// Orquestador del ETL: extraer → transformar → cargar, y dejar constancia.
//
//   node --env-file=.env etl/run.ts                  los dos procesos
//   node --env-file=.env etl/run.ts lecturas_hora    solo uno
//   node --env-file=.env etl/run.ts --completo       reprocesa TODO desde cero
//
// Cada corrida abre un renglón en `etl_ejecucion` en estado `ejecutando` y lo
// cierra en `completado` o `fallido`. Ese renglón es tres cosas a la vez: la
// marca de agua de dónde seguir, la bitácora de qué pasó, y lo que lista la
// pantalla de Reportes (GET /reports).
//
// La ventana de cada corrida arranca en el INICIO DEL BUCKET de la marca
// anterior, no en la marca exacta. Si la corrida previa cortó a las 14:37, esa
// hora quedó a medias: volver a leerla completa y reemplazar su fila es lo que
// deja el agregado bien. Reprocesar un bucket es barato y la carga es idempotente.

import { prisma, closePrisma } from "../src/lib/prisma.ts";
import { extraerAlertas, extraerLecturas } from "./extract.ts";
import { agruparLecturasPorHora, contarAlertasPorDia, inicioDeDia, inicioDeHora } from "./transform.ts";
import { cargarAlertasDia, cargarLecturasHora } from "./load.ts";

export const PROCESOS = ["lecturas_hora", "alertas_dia"] as const;
export type Proceso = (typeof PROCESOS)[number];

export type Resultado = {
  proceso: Proceso;
  filasLeidas: number;
  filasEscritas: number;
  marca: Date | null;
};

/** Marca de agua: hasta dónde llegó la última corrida que terminó bien. */
async function ultimaMarca(proceso: Proceso): Promise<Date | null> {
  const previa = await prisma.etlEjecucion.findFirst({
    where: { proceso, estado: "completado", marca_hasta: { not: null } },
    orderBy: { marca_hasta: "desc" },
    select: { marca_hasta: true },
  });
  return previa?.marca_hasta ?? null;
}

async function correrLecturas(desde: Date | null) {
  const lecturas = await extraerLecturas(desde);
  const filas = agruparLecturasPorHora(lecturas);
  const escritas = await cargarLecturasHora(filas);
  return {
    leidas: lecturas.length,
    escritas,
    // La marca es la última fecha REALMENTE procesada, no `new Date()`: entre el
    // extract y este punto pudieron entrar lecturas nuevas por MQTT, y darlas
    // por procesadas las perdería para siempre.
    marca: lecturas.at(-1)?.fecha_hora ?? null,
  };
}

async function correrAlertas(desde: Date | null) {
  const alertas = await extraerAlertas(desde);
  const filas = contarAlertasPorDia(alertas);
  const escritas = await cargarAlertasDia(filas);
  return { leidas: alertas.length, escritas, marca: alertas.at(-1)?.fecha_hora ?? null };
}

/**
 * Corre un proceso de punta a punta y deja el renglón de `etl_ejecucion`.
 *
 * `completo` ignora la marca y reprocesa desde el principio. Es la salida cuando
 * el datamart quedó mal: no hace falta borrar tablas ni tocar SQL a mano.
 */
export async function correr(proceso: Proceso, completo = false): Promise<Resultado> {
  const marcaPrevia = completo ? null : await ultimaMarca(proceso);
  const desde = marcaPrevia
    ? proceso === "lecturas_hora"
      ? inicioDeHora(marcaPrevia)
      : inicioDeDia(marcaPrevia)
    : null;

  const ejecucion = await prisma.etlEjecucion.create({
    data: { proceso, estado: "ejecutando", marca_desde: desde },
    select: { ejecucion_id: true },
  });

  try {
    const { leidas, escritas, marca } =
      proceso === "lecturas_hora" ? await correrLecturas(desde) : await correrAlertas(desde);

    await prisma.etlEjecucion.update({
      where: { ejecucion_id: ejecucion.ejecucion_id },
      data: {
        estado: "completado",
        // Sin filas nuevas la marca no avanza: se conserva la anterior para no
        // dejar un hueco entre esta corrida y la siguiente.
        marca_hasta: marca ?? marcaPrevia,
        filas_leidas: leidas,
        filas_escritas: escritas,
        fin: new Date(),
      },
    });

    return { proceso, filasLeidas: leidas, filasEscritas: escritas, marca: marca ?? marcaPrevia };
  } catch (err: unknown) {
    // El fallo queda en la tabla ANTES de propagarse: un proceso que se muere
    // sin dejar rastro es el que nadie descubre hasta que el tablero lleva una
    // semana con datos viejos. Como el renglón no queda en `completado`, la
    // marca no avanza y la próxima corrida reintenta la misma ventana.
    await prisma.etlEjecucion.update({
      where: { ejecucion_id: ejecucion.ejecucion_id },
      data: {
        estado: "fallido",
        error: err instanceof Error ? err.message : String(err),
        fin: new Date(),
      },
    });
    throw err;
  }
}

/** Corre los procesos pedidos. Un fallo no impide que corran los demás. */
export async function correrTodos(procesos: readonly Proceso[], completo = false): Promise<boolean> {
  let todoBien = true;

  for (const proceso of procesos) {
    try {
      const r = await correr(proceso, completo);
      console.log(
        `etl: ${proceso} — ${r.filasLeidas} leídas, ${r.filasEscritas} escritas, marca ${r.marca?.toISOString() ?? "sin cambio"}`,
      );
    } catch (err: unknown) {
      todoBien = false;
      console.error(`etl: ${proceso} FALLÓ —`, err instanceof Error ? err.message : err);
    }
  }

  return todoBien;
}

function parsearArgumentos(argv: string[]): { procesos: Proceso[]; completo: boolean } {
  const completo = argv.includes("--completo");
  const pedidos = argv.filter((arg) => !arg.startsWith("--"));

  for (const pedido of pedidos) {
    if (!PROCESOS.includes(pedido as Proceso)) {
      console.error(`etl: proceso desconocido '${pedido}'. Opciones: ${PROCESOS.join(", ")}`);
      process.exit(2);
    }
  }

  return { procesos: pedidos.length ? (pedidos as Proceso[]) : [...PROCESOS], completo };
}

// Solo cuando se ejecuta directamente: las pruebas y el planificador importan
// `correr`/`correrTodos` y manejan ellos el cierre de la conexión.
if (process.argv[1] && import.meta.filename === process.argv[1]) {
  const { procesos, completo } = parsearArgumentos(process.argv.slice(2));
  const todoBien = await correrTodos(procesos, completo);
  await closePrisma();
  // Código de salida distinto de cero si algo falló: es lo que mira cron, el
  // contenedor o el CI para saber que hay que revisar.
  process.exit(todoBien ? 0 : 1);
}
