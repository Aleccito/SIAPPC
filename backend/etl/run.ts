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
import { inicioDeDia, inicioDeHora } from "./transform.ts";

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

/**
 * La agregación ocurre DENTRO de la base, con `sp_etl_lecturas_hora`.
 *
 * Antes se traían las lecturas crudas a Node para reducirlas aquí. Con una
 * lectura por segundo y por sensor, eso es mover millones de renglones por la
 * red para escribir unos cientos: el trabajo real es la agregación, y se hace
 * junto al dato.
 *
 * El procedimiento se invoca con `$executeRaw` y no con `$queryRaw` porque
 * escribe y no devuelve filas. Un `CALL` que SÍ devuelve resultados no sirve
 * desde aquí: el adaptador de MariaDB entrega esas filas sin nombres de
 * columna (por eso los informes de la API consultan vistas).
 *
 * `agruparLecturasPorHora` sigue existiendo en transform.ts: es la misma regla
 * escrita en TypeScript y es lo que prueban las pruebas unitarias, sin base.
 */
async function correrLecturas(desde: Date | null) {
  // Un solo recorrido para las tres cifras que hacen falta:
  //
  //   leidas   cuántas lecturas caen en la ventana
  //   buckets  cuántas filas de `lectura_hora` resultan. NO se puede usar lo
  //            que devuelve el CALL: `ON DUPLICATE KEY UPDATE` cuenta 1 al
  //            insertar y 2 al actualizar, así que reprocesar una ventana ya
  //            cargada informaría el doble de filas escritas.
  //   marca    la última fecha REALMENTE procesada, no `new Date()`: entre esta
  //            consulta y el final pueden entrar lecturas nuevas por MQTT, y
  //            darlas por procesadas las perdería para siempre.
  const [resumen] = await prisma.$queryRaw<
    { leidas: bigint; buckets: bigint; marca: Date | null }[]
  >`
    SELECT
      COUNT(*) AS leidas,
      COUNT(DISTINCT sensor_id, DATE_FORMAT(fecha_hora, '%Y-%m-%d %H:00:00')) AS buckets,
      MAX(fecha_hora) AS marca
    FROM lectura
    WHERE ${desde} IS NULL OR fecha_hora >= ${desde}
  `;

  const marca = resumen?.marca ?? null;
  if (!marca) {
    return { leidas: 0, escritas: 0, marca: null };
  }

  // La ventana se cierra en `marca` y no en "ahora": lo que llegue mientras
  // corre el procedimiento queda para la próxima vuelta, que es exactamente lo
  // que dice la marca de agua que se guarda abajo.
  await prisma.$executeRaw`CALL sp_etl_lecturas_hora(${desde}, ${marca})`;

  return { leidas: Number(resumen!.leidas), escritas: Number(resumen!.buckets), marca };
}

/**
 * Mismo criterio que `correrLecturas`: el conteo lo hace `sp_etl_alertas_dia`
 * dentro de la base. `contarAlertasPorDia` sigue en transform.ts porque es la
 * misma regla en TypeScript y es lo que prueban las pruebas sin base de datos.
 */
async function correrAlertas(desde: Date | null) {
  // `buckets` no puede salir del CALL: `ON DUPLICATE KEY UPDATE` informa 1 al
  // insertar y 2 al actualizar, así que reprocesar contaría el doble.
  const [resumen] = await prisma.$queryRaw<
    { leidas: bigint; buckets: bigint; marca: Date | null }[]
  >`
    SELECT
      COUNT(*) AS leidas,
      COUNT(DISTINCT DATE(a.fecha_hora), l.sensor_id, a.severidad) AS buckets,
      MAX(a.fecha_hora) AS marca
    FROM alerta a
    JOIN lectura l ON l.lectura_id = a.lectura_id
    WHERE ${desde} IS NULL OR a.fecha_hora >= ${desde}
  `;

  const marca = resumen?.marca ?? null;
  if (!marca) {
    return { leidas: 0, escritas: 0, marca: null };
  }

  await prisma.$executeRaw`CALL sp_etl_alertas_dia(${desde}, ${marca})`;

  return { leidas: Number(resumen!.leidas), escritas: Number(resumen!.buckets), marca };
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
