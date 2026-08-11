// EXTRACCIÓN — leer del modelo operativo, sin transformar nada.
//
// Lee por ventana y no la tabla entera: `lectura` crece una fila por segundo y
// por sensor, y una carga completa deja de caber en memoria a las pocas semanas.
// La ventana empieza en la marca de agua de la última corrida (etl_ejecucion) y
// llega hasta donde alcance el lote.
//
// El tope por lote es lo que hace que una base con meses de atraso se ponga al
// día en varias corridas seguidas en vez de intentarlo en una sola que se queda
// sin memoria. La marca avanza en cada una, así que no se repite trabajo.

import { prisma } from "../src/lib/prisma.ts";

/** Máximo de renglones por corrida. */
export const LOTE_MAXIMO = 200_000;

export type LecturaCruda = {
  sensor_id: number;
  fecha_hora: Date;
  valor: unknown;
};

export type AlertaCruda = {
  fecha_hora: Date;
  severidad: "baja" | "media" | "alta" | "critica";
  lectura: { sensor_id: number };
};

/**
 * Lecturas desde `desde` (inclusive), en orden cronológico.
 *
 * `desde` nulo es la carga inicial: no hay marca previa y se empieza por el
 * principio de la tabla.
 */
export function extraerLecturas(desde: Date | null): Promise<LecturaCruda[]> {
  return prisma.lectura.findMany({
    where: desde ? { fecha_hora: { gte: desde } } : {},
    select: { sensor_id: true, fecha_hora: true, valor: true },
    orderBy: { fecha_hora: "asc" },
    take: LOTE_MAXIMO,
  });
}

/**
 * Alertas desde `desde` (inclusive), con el sensor al que pertenecen.
 *
 * El sensor no está en `alerta`: se llega por la lectura que la disparó. Va como
 * `include` y no como una segunda consulta para no hacer N+1.
 */
export function extraerAlertas(desde: Date | null): Promise<AlertaCruda[]> {
  return prisma.alerta.findMany({
    where: desde ? { fecha_hora: { gte: desde } } : {},
    select: {
      fecha_hora: true,
      severidad: true,
      lectura: { select: { sensor_id: true } },
    },
    orderBy: { fecha_hora: "asc" },
    take: LOTE_MAXIMO,
  });
}
