// Qué convierte una lectura en alerta.
//
// Hasta ahora esto eran cuatro `if` con los números escritos dentro de
// `mqttIngest.ts`, y ajustarlos exigía recompilar: un paciente con EPOC, que
// vive por debajo del 90 % de saturación, disparaba alertas de SpO2 todo el día
// y la única salida era enseñar a ignorarlas. Ahora las bandas viven en
// `umbral_alerta` y se pueden afinar por paciente.
//
// ── POR QUÉ UN CACHÉ EN PROCESO Y NO REDIS ──────────────────────────────────
// Por aquí pasa CADA lectura que entra por MQTT: una por segundo y por sensor.
// Una consulta por mensaje está descartada, pero Redis tampoco sirve tal cual —
// sería un viaje de red por mensaje, o sea el mismo problema con otro sistema en
// medio. Redis solo aportaría la invalidación entre réplicas, y para eso basta
// un TTL: la tabla entera son unas pocas decenas de filas (ocho por defecto, más
// las de los pacientes afinados), así que cabe en memoria completa y se recarga
// de una sola consulta.
//
// El precio, dicho claro: con varias réplicas del backend, un cambio de umbral
// tarda hasta `THRESHOLDS_CACHE_TTL` segundos en llegar a todas. La que atendió
// la petición lo aplica en el acto —`invalidarUmbrales()`—, las demás esperan a
// que les caduque el suyo. Es el mismo trato que ya hace la caché de lecturas
// (lib/cache.ts) y por el mismo motivo: un desfase acotado y conocido es más
// barato de razonar que una invalidación distribuida. Si algún día no bastara,
// el bus de `lib/eventos.ts` ya publica por Redis y este módulo podría
// suscribirse.

import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { env } from "../env.ts";
import { alertSeverities } from "../types.ts";
import type { AlertSeverity } from "../types.ts";

/** Una banda ya lista para comparar: sin Decimal y sin filas inactivas. */
type Banda = {
  severidad: AlertSeverity;
  valorMin: number | null;
  valorMax: number | null;
  tipo: string;
  plantilla: string;
};

/**
 * La tabla entera, indexada por el juego de bandas que le toca a cada lectura.
 *
 * La llave es `variable` para el valor por defecto general y `pacienteId:variable`
 * para un ajuste. Que sean llaves distintas y no una jerarquía dentro del valor
 * es lo que hace que la vuelta atrás sea por variable completa: se busca la del
 * paciente y, si no hay, la general — nunca se mezclan las dos.
 */
type Umbrales = {
  bandas: Map<string, Banda[]>;
  cargadoEn: number;
};

export type AlertaEvaluada = {
  tipo: string;
  severidad: AlertSeverity;
  mensaje: string;
};

/** Orden clínico, no alfabético: el índice en `alertSeverities` es el rango. */
const rango = new Map<AlertSeverity, number>(alertSeverities.map((s, i) => [s, i]));

const claveGeneral = (variable: string) => variable;
const clavePaciente = (pacienteId: number, variable: string) => `${pacienteId}:${variable}`;

let vigentes: Umbrales | null = null;
// Recarga en vuelo. Sin esto, el primer mensaje que llega tras caducar el caché
// no es uno sino todos los que estén en el aire a la vez, y cada uno lanza su
// propia consulta.
let recarga: Promise<Umbrales> | null = null;

async function cargar(logger: FastifyBaseLogger): Promise<Umbrales> {
  const filas = await prisma.umbralAlerta.findMany({
    where: { activo: true },
    select: {
      umbral_id: true,
      variable_codigo: true,
      paciente_id: true,
      severidad: true,
      valor_min: true,
      valor_max: true,
      tipo: true,
      plantilla_mensaje: true,
    },
    // `umbral_id` ascendente resuelve de forma determinista el caso que el
    // índice único no puede cubrir: en MariaDB dos filas con `paciente_id` NULL
    // no chocan, así que dos valores por defecto de la misma variable y
    // severidad son posibles escribiendo SQL a mano. Gana el último, y la
    // ordenación por severidad de abajo los deja adyacentes.
    orderBy: { umbral_id: "asc" },
  });

  const bandas = new Map<string, Banda[]>();
  for (const fila of filas) {
    const clave =
      fila.paciente_id === null
        ? claveGeneral(fila.variable_codigo)
        : clavePaciente(fila.paciente_id, fila.variable_codigo);
    const lista = bandas.get(clave) ?? [];
    // Un duplicado de (variable, paciente, severidad) reemplaza al anterior en
    // vez de sumarse: dos bandas de la misma severidad no son dos reglas, son
    // una escrita dos veces.
    const previa = lista.findIndex((banda) => banda.severidad === fila.severidad);
    const banda: Banda = {
      severidad: fila.severidad,
      // `Decimal(12,4)` llega como Decimal del driver; la comparación es con un
      // `number` que viene del JSON de MQTT.
      valorMin: fila.valor_min === null ? null : Number(fila.valor_min),
      valorMax: fila.valor_max === null ? null : Number(fila.valor_max),
      tipo: fila.tipo,
      plantilla: fila.plantilla_mensaje,
    };
    if (previa === -1) lista.push(banda);
    else lista[previa] = banda;
    bandas.set(clave, lista);
  }

  // De más grave a menos: gana la primera que salta, que es el orden en el que
  // estaban los `if` del código anterior. Sin esto, un SpO2 de 84 podría salir
  // como `alta` en vez de `critica` según el orden de inserción de la tabla.
  for (const lista of bandas.values()) {
    lista.sort((a, b) => (rango.get(b.severidad) ?? 0) - (rango.get(a.severidad) ?? 0));
  }

  if (filas.length === 0) {
    // No hay valores por defecto en el código, y es deliberado: tenerlos sería
    // volver a las dos verdades que esta tabla viene a unificar. Pero una tabla
    // vacía significa que NINGUNA lectura alerta, y eso no puede pasar en
    // silencio — se siembra en db/seed.sql y en la migración que crea la tabla.
    logger.error("umbrales: la tabla umbral_alerta está vacía, ninguna lectura va a alertar");
  }

  return { bandas, cargadoEn: Date.now() };
}

async function umbralesVigentes(logger: FastifyBaseLogger): Promise<Umbrales> {
  if (vigentes && Date.now() - vigentes.cargadoEn < env.thresholdsCacheTtl * 1000) {
    return vigentes;
  }

  recarga ??= cargar(logger).finally(() => {
    recarga = null;
  });

  try {
    vigentes = await recarga;
  } catch (err: unknown) {
    // Con una copia anterior se sigue con ella: un fallo transitorio de la base
    // no puede dejar sin evaluar las lecturas que sí entraron. Se marca como
    // recién cargada para no repetir la consulta rota una vez por mensaje.
    if (!vigentes) throw err;
    logger.warn({ err }, "umbrales: fallo al recargar, se sigue con la copia anterior");
    vigentes.cargadoEn = Date.now();
  }

  return vigentes;
}

/**
 * Descarta la copia en memoria. La llaman las rutas de `/alert-thresholds` tras
 * escribir, para que el cambio se note en la siguiente lectura y no dentro de un
 * minuto.
 */
export function invalidarUmbrales(): void {
  vigentes = null;
}

/**
 * Decide si una lectura abre alerta, y con qué severidad y mensaje.
 *
 * `pacienteId` es el del equipo que publicó: sus bandas ganan a las generales
 * para las variables que tenga afinadas. Devuelve `null` cuando la lectura está
 * dentro de rango o cuando la variable no tiene ninguna banda configurada — que
 * es lo que pasa con `ecg`, y sigue siendo lo correcto: una muestra instantánea
 * de voltaje no dice nada sin la forma de onda.
 */
export async function evaluarAlerta(
  variable: string,
  valor: number,
  pacienteId: number | null,
  logger: FastifyBaseLogger,
): Promise<AlertaEvaluada | null> {
  const { bandas } = await umbralesVigentes(logger);

  const propias = pacienteId === null ? undefined : bandas.get(clavePaciente(pacienteId, variable));
  const aplicables = propias ?? bandas.get(claveGeneral(variable));
  if (!aplicables) return null;

  for (const banda of aplicables) {
    const fuera =
      (banda.valorMin !== null && valor < banda.valorMin) ||
      (banda.valorMax !== null && valor > banda.valorMax);
    if (fuera) {
      return {
        tipo: banda.tipo,
        severidad: banda.severidad,
        mensaje: redactar(banda.plantilla, valor),
      };
    }
  }

  return null;
}

/**
 * Rellena la plantilla con la cifra medida.
 *
 * `String(valor)` y no un formato propio: es lo que producía la interpolación
 * del código anterior, y cualquier redondeo aquí cambiaría el texto de todas las
 * alertas existentes. El recorte a 255 es el ancho de `alerta.mensaje` — una
 * plantilla larga con un valor largo dentro haría fallar el INSERT, y perder la
 * alerta por un texto es peor que perder el final del texto.
 */
function redactar(plantilla: string, valor: number): string {
  return plantilla.replaceAll("{valor}", String(valor)).slice(0, 255);
}
