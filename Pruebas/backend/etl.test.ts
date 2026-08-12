import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../backend/src/lib/prisma.ts";
import { correr } from "../../backend/etl/run.ts";
import { agruparLecturasPorHora, contarAlertasPorDia } from "../../backend/etl/transform.ts";
import { closePrisma } from "../../backend/src/lib/prisma.ts";
import { resetDatabase } from "./helpers.ts";

// Lo que se comprueba aquí es lo que hace confiable a un ETL: que agregue bien,
// que repetirlo NO duplique, y que un fallo no mueva la marca de agua. Sin esto
// un cambio en la agregación se descubre cuando el tablero ya lleva días
// mostrando números que nadie sabe reproducir.

const HORA = new Date("2026-08-11T10:00:00");

async function sembrarSensor(): Promise<number> {
  const dispositivo = await prisma.dispositivo.create({
    data: { hospital_id: 1, codigo: "ETL-TEST" },
    select: { dispositivo_id: true },
  });
  const sensor = await prisma.sensor.create({
    // La unidad la aporta el catálogo `variable` (db/seed.sql), no el sensor.
    data: { dispositivo_id: dispositivo.dispositivo_id, variable_medida: "spo2" },
    select: { sensor_id: true },
  });
  return sensor.sensor_id;
}

/** Lecturas con valores conocidos, dentro de la misma hora. */
async function sembrarLecturas(sensorId: number, valores: number[], base: Date): Promise<void> {
  await prisma.lectura.createMany({
    data: valores.map((valor, i) => ({
      sensor_id: sensorId,
      valor,
      fecha_hora: new Date(base.getTime() + i * 1000),
      hash_sha256: `${base.getTime()}${i}`.padStart(64, "0"),
    })),
  });
}

describe("ETL — transformación (sin base de datos)", () => {
  it("agrupa por sensor y hora con mín, máx y promedio", () => {
    const filas = agruparLecturasPorHora([
      { sensor_id: 1, fecha_hora: new Date("2026-08-11T10:00:00"), valor: 90 },
      { sensor_id: 1, fecha_hora: new Date("2026-08-11T10:59:59"), valor: 98 },
      // Otra hora: bucket aparte, no se mezcla con el anterior.
      { sensor_id: 1, fecha_hora: new Date("2026-08-11T11:00:00"), valor: 50 },
      // Otro sensor a la misma hora: también bucket aparte.
      { sensor_id: 2, fecha_hora: new Date("2026-08-11T10:30:00"), valor: 70 },
    ]);

    assert.equal(filas.length, 3);

    const primera = filas.find((f) => f.sensor_id === 1 && f.hora.getHours() === 10)!;
    assert.equal(primera.muestras, 2);
    assert.equal(primera.valor_min, 90);
    assert.equal(primera.valor_max, 98);
    assert.equal(primera.valor_prom, 94);
  });

  it("cuenta alertas por día, sensor y severidad", () => {
    const filas = contarAlertasPorDia([
      { fecha_hora: new Date("2026-08-11T01:00:00"), severidad: "alta", lectura: { sensor_id: 1 } },
      { fecha_hora: new Date("2026-08-11T23:00:00"), severidad: "alta", lectura: { sensor_id: 1 } },
      // Misma fecha y sensor, otra severidad: no se suma con las anteriores.
      { fecha_hora: new Date("2026-08-11T02:00:00"), severidad: "critica", lectura: { sensor_id: 1 } },
    ]);

    assert.equal(filas.length, 2);
    assert.equal(filas.find((f) => f.severidad === "alta")!.total, 2);
    assert.equal(filas.find((f) => f.severidad === "critica")!.total, 1);
  });
});

describe("ETL — carga contra la base", () => {
  let sensorId: number;

  before(async () => {
    await resetDatabase();
    sensorId = await sembrarSensor();
  });

  // Solo Prisma: el ETL no usa Redis, y `closeConnections()` cerraría un cliente
  // que nunca llegó a conectarse.
  after(async () => {
    await closePrisma();
  });

  it("la primera corrida llena el datamart y deja la marca", async () => {
    await sembrarLecturas(sensorId, [90, 94, 98], HORA);

    const r = await correr("lecturas_hora");
    assert.equal(r.filasLeidas, 3);
    assert.equal(r.filasEscritas, 1);

    const bucket = await prisma.lecturaHora.findUnique({
      where: { sensor_id_hora: { sensor_id: sensorId, hora: HORA } },
    });
    assert.equal(bucket?.muestras, 3);
    assert.equal(Number(bucket?.valor_prom), 94);

    const ejecucion = await prisma.etlEjecucion.findFirst({
      where: { proceso: "lecturas_hora" },
      orderBy: { inicio: "desc" },
    });
    assert.equal(ejecucion?.estado, "completado");
    assert.ok(ejecucion?.marca_hasta);
  });

  it("volver a correrla no duplica ni cambia el agregado", async () => {
    const antes = await prisma.lecturaHora.count();

    const r = await correr("lecturas_hora");
    // Relee la hora en curso —por eso no es 0— pero el resultado es el mismo.
    assert.equal(r.filasEscritas, 1);

    assert.equal(await prisma.lecturaHora.count(), antes);
    const bucket = await prisma.lecturaHora.findUnique({
      where: { sensor_id_hora: { sensor_id: sensorId, hora: HORA } },
    });
    assert.equal(bucket?.muestras, 3);
  });

  it("lecturas nuevas en la misma hora recalculan el bucket, no lo suman", async () => {
    // 100 entra al bucket que ya existía: 4 muestras, máximo 100, promedio 95.5.
    await sembrarLecturas(sensorId, [100], new Date(HORA.getTime() + 10_000));

    await correr("lecturas_hora");

    const bucket = await prisma.lecturaHora.findUnique({
      where: { sensor_id_hora: { sensor_id: sensorId, hora: HORA } },
    });
    assert.equal(bucket?.muestras, 4);
    assert.equal(Number(bucket?.valor_max), 100);
    assert.equal(Number(bucket?.valor_prom), 95.5);
  });

  it("--completo reconstruye lo mismo desde cero", async () => {
    await prisma.lecturaHora.deleteMany();

    await correr("lecturas_hora", true);

    const bucket = await prisma.lecturaHora.findUnique({
      where: { sensor_id_hora: { sensor_id: sensorId, hora: HORA } },
    });
    assert.equal(bucket?.muestras, 4);
  });

  it("un fallo queda registrado y NO mueve la marca", async () => {
    const marcaBuena = (
      await prisma.etlEjecucion.findFirst({
        where: { proceso: "lecturas_hora", estado: "completado" },
        orderBy: { marca_hasta: "desc" },
      })
    )?.marca_hasta;

    // Se rompe la carga por debajo: la tabla destino deja de existir durante
    // esta corrida. Es la forma de provocar un fallo real del load sin tocar el
    // código que se está probando.
    await prisma.$executeRawUnsafe("ALTER TABLE lectura_hora RENAME TO lectura_hora_off");
    await assert.rejects(() => correr("lecturas_hora"));
    await prisma.$executeRawUnsafe("ALTER TABLE lectura_hora_off RENAME TO lectura_hora");

    const fallida = await prisma.etlEjecucion.findFirst({
      where: { proceso: "lecturas_hora" },
      orderBy: { inicio: "desc" },
    });
    assert.equal(fallida?.estado, "fallido");
    assert.ok(fallida?.error);

    // La siguiente corrida arranca donde quedó la última BUENA, no donde murió
    // la fallida: si la marca hubiera avanzado, esa ventana no se procesaría
    // nunca y el datamart quedaría con un hueco permanente.
    const marcaVigente = (
      await prisma.etlEjecucion.findFirst({
        where: { proceso: "lecturas_hora", estado: "completado" },
        orderBy: { marca_hasta: "desc" },
      })
    )?.marca_hasta;
    assert.deepEqual(marcaVigente, marcaBuena);
  });
});
