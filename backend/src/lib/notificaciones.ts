import type { FastifyBaseLogger } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "./prisma.ts";
import type { AlertSeverity } from "../types.ts";

// Quién se entera de una alerta, y cuántas veces.
//
// La tabla `notificacion` existía en el esquema desde el principio y nadie la
// llenaba: la ingesta creaba la `alerta` y la empujaba al tablero por SSE, así
// que el aviso solo existía mientras alguien tuviera la pantalla abierta. Quien
// volvía de una guardia no tenía forma de saber qué había pasado. Esto es lo
// que faltaba.

/**
 * Severidades que justifican dirigirle un aviso a una persona.
 *
 * Es a propósito la MISMA lista que empuja el flujo SSE (ver
 * routes/alertsStream.ts): si algo no merece interrumpir a quien está mirando
 * el tablero, tampoco merece esperarle en la bandeja. Una `baja` como
 * `perfusion_baja` es calidad de señal, no un hecho clínico, y notificarla
 * enseñaría a ignorar la campana — que es la única manera de romperla del todo.
 */
const SEVERIDADES_NOTIFICABLES: ReadonlySet<AlertSeverity> = new Set<AlertSeverity>([
  "alta",
  "critica",
]);

/**
 * Ventana de agrupación, en minutos.
 *
 * ── LA REGLA ────────────────────────────────────────────────────────────────
 * Un destinatario recibe COMO MUCHO una notificación por (dispositivo, tipo de
 * alerta) cada 15 minutos, y solo se rompe la ventana si la severidad SUBE.
 *
 * ── POR QUÉ ─────────────────────────────────────────────────────────────────
 * La Pi publica una lectura por segundo y por sensor (iot/.env:PUBLISH_INTERVAL).
 * Un paciente con la saturación en 88 % durante cinco minutos genera 300 alertas
 * `spo2_bajo` seguidas. Sin agrupar, eso son 300 notificaciones que dicen
 * exactamente lo mismo y que entierran cualquier otra cosa que llegue después:
 * la bandeja deja de informar y pasa a ser ruido que se marca como leído en
 * bloque sin mirarlo. El daño de eso no es cosmético, es clínico.
 *
 * Se agrupa por DISPOSITIVO Y TIPO, no por paciente a secas, porque "SpO2 bajo"
 * y "frecuencia cardiaca fuera de rango" en el mismo paciente son dos hechos
 * distintos y el segundo no puede quedar tapado por el primero — justo esa
 * combinación es la que describe un deterioro. Y se rompe la ventana al SUBIR
 * de severidad porque pasar de `alta` a `critica` es información nueva: es la
 * transición, no la repetición, lo que hay que avisar.
 *
 * 15 minutos: por debajo de ~5 no agrupa nada útil con una alerta por segundo;
 * por encima de ~30 una situación que sigue abierta deja de recordarse en un
 * cambio de turno. Es un número clínico y por eso es una constante con nombre,
 * no un literal enterrado en un WHERE.
 *
 * ── ALTERNATIVAS DESCARTADAS ────────────────────────────────────────────────
 *   · Una notificación por alerta, sin ventana. Es lo que hace la tabla si nadie
 *     piensa: 300 filas por episodio.
 *   · Silenciador en memoria (un Map de última-vez-avisado). Más barato —cero
 *     consultas— pero se vacía en cada reinicio del backend y no lo comparten
 *     dos réplicas: con dos instancias la ventana se duplica. La base es la
 *     única memoria que ya es común a todas y sobrevive al reinicio.
 *   · Una fila viva por episodio con un contador (`repeticiones`) que se
 *     incrementa. Suena mejor y no lo es: exige columna nueva, mutar un aviso ya
 *     entregado (y "des-leerlo" para que reaparezca), y a quien lo lee "×300" no
 *     le dice más que "sigue pasando". Además, la cuenta exacta de alertas ya
 *     está en `alerta` y en `alerta_dia`; duplicarla aquí es inventarse una
 *     segunda verdad.
 *   · Agrupar solo por paciente. Descartada arriba: esconde el deterioro.
 */
export const VENTANA_AGRUPACION_MIN = 15;

/**
 * Orden de las severidades, para comparar "igual o peor" en SQL.
 *
 * Se compara con `FIELD()` sobre el ENUM y no con el valor literal porque el
 * orden alfabético de `alta`/`baja`/`critica`/`media` no es el clínico.
 */
const ORDEN_SEVERIDAD = ["baja", "media", "alta", "critica"] as const;

export type AlertaNotificable = {
  alertaId: bigint;
  dispositivoId: number;
  /** Paciente al que está asignado el equipo, o null si el equipo está libre. */
  pacienteId: number | null;
  tipo: string;
  severidad: AlertSeverity;
};

/**
 * Crea las notificaciones de una alerta recién guardada y devuelve a quiénes se
 * les creó.
 *
 * Nunca lanza: la alerta ya está en la base cuando esto se llama, y un fallo
 * repartiendo el aviso no puede tumbar la ingesta ni deshacer el registro
 * clínico. Devuelve una lista vacía y deja el error en el log.
 *
 * El canal es `panel` y solo `panel`: es el único que este sistema sabe
 * entregar. Los otros tres valores del ENUM (email, sms, push) existen en el
 * esquema pero no hay nada detrás que los mande, y escribir filas con ellos
 * sería registrar envíos que nunca ocurrieron.
 */
export async function notificarAlerta(
  alerta: AlertaNotificable,
  logger: FastifyBaseLogger,
): Promise<number[]> {
  if (!SEVERIDADES_NOTIFICABLES.has(alerta.severidad)) return [];

  // Sin paciente asignado al equipo no hay a quién dirigirla. Se podría avisar
  // a toda la unidad, y es justo lo que NO se hace: un aviso que le llega a
  // todos no es de nadie. Un equipo transmitiendo sin paciente es un problema
  // de inventario, y para eso está el tablero de dispositivos.
  if (alerta.pacienteId === null) return [];

  try {
    // Los responsables del paciente, que es lo que significa `medico_paciente`.
    // `distinct` porque la unicidad de esa tabla incluye la fecha: reasignar al
    // mismo médico otro día crea una segunda fila viva.
    const asignaciones = await prisma.medicoPaciente.findMany({
      where: {
        paciente_id: alerta.pacienteId,
        activo: true,
        // A una cuenta suspendida no se le apila trabajo que no va a ver.
        usuario: { activo: true },
      },
      select: { usuario_id: true },
      distinct: ["usuario_id"],
    });

    const destinatarios = asignaciones.map((fila) => fila.usuario_id);
    if (destinatarios.length === 0) return [];

    const rango = ORDEN_SEVERIDAD.indexOf(alerta.severidad) + 1;

    // Quién está dentro de su ventana de silencio. Una sola consulta para todos
    // los destinatarios: son pocos, pero una por cabeza y por lectura es una ida
    // a la base por segundo y por sensor.
    const silenciados = await prisma.$queryRaw<{ usuario_id: number }[]>`
      SELECT DISTINCT n.usuario_id
      FROM notificacion n
      JOIN alerta a ON a.alerta_id = n.alerta_id
      JOIN lectura l ON l.lectura_id = a.lectura_id
      JOIN sensor s ON s.sensor_id = l.sensor_id
      WHERE n.usuario_id IN (${Prisma.join(destinatarios)})
        AND n.canal = 'panel'
        AND n.fecha_envio >= NOW() - INTERVAL ${VENTANA_AGRUPACION_MIN} MINUTE
        AND s.dispositivo_id = ${alerta.dispositivoId}
        AND a.tipo = ${alerta.tipo}
        AND FIELD(a.severidad, 'baja', 'media', 'alta', 'critica') >= ${rango}
    `;

    const callados = new Set(silenciados.map((fila) => fila.usuario_id));
    const pendientes = destinatarios.filter((id) => !callados.has(id));
    if (pendientes.length === 0) return [];

    // `enviado` y no `pendiente`: el canal es el propio panel y la fila ES la
    // entrega. `pendiente` describiría un correo esperando a un worker que aquí
    // no existe.
    //
    // `skipDuplicates` se apoya en `uq_notif_alerta_usuario_canal`: si dos
    // réplicas procesan a la vez —la ventana se consulta y se escribe sin
    // transacción, así que la carrera es posible— la segunda no duplica ni
    // revienta la ingesta con un error de llave.
    await prisma.notificacion.createMany({
      data: pendientes.map((usuario_id) => ({
        alerta_id: alerta.alertaId,
        usuario_id,
        canal: "panel" as const,
        estado_envio: "enviado" as const,
      })),
      skipDuplicates: true,
    });

    return pendientes;
  } catch (err: unknown) {
    logger.error({ err, alertaId: String(alerta.alertaId) }, "notificaciones: fallo al repartir");
    return [];
  }
}
