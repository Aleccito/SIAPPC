// Rango de un día para las consultas de la agenda y del tablero.
//
// El tablero pide `?date=today`, y esa palabra la resuelve el SERVIDOR: si la
// resolviera el navegador, dos pestañas con relojes distintos —o una máquina
// con la fecha corrida— pedirían días diferentes y el turno vería ingresos que
// no son los suyos. La fecha explícita (`?date=2026-08-12`) sigue admitida para
// consultar otro día.

import { badRequest } from "./http.ts";

/** Medianoche a medianoche: `[desde, hasta)`, con el extremo derecho abierto. */
export type DayRange = { gte: Date; lt: Date };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Convierte `today` o `YYYY-MM-DD` en el rango del día en la zona horaria del
 * proceso, que es la del hospital.
 *
 * El extremo derecho es abierto y no `23:59:59`: con `<=` a un segundo antes de
 * medianoche, lo que ocurra dentro de ese último segundo no cae en ningún día.
 */
export function dayRange(date: string): DayRange {
  const base = new Date();

  if (date !== "today") {
    if (!ISO_DATE.test(date)) {
      throw badRequest("La fecha debe ser 'today' o YYYY-MM-DD");
    }
    const [year, month, day] = date.split("-").map(Number) as [number, number, number];
    // Se construye con el constructor de partes y no con `new Date(cadena)`:
    // una cadena `YYYY-MM-DD` se interpreta como UTC, y el rango saldría
    // corrido las horas que el hospital esté de Greenwich.
    base.setFullYear(year, month - 1, day);
    if (base.getMonth() !== month - 1 || base.getDate() !== day) {
      throw badRequest(`No existe la fecha ${date}`);
    }
  }

  const gte = new Date(base);
  gte.setHours(0, 0, 0, 0);
  const lt = new Date(gte);
  lt.setDate(lt.getDate() + 1);
  return { gte, lt };
}

/**
 * Desfase horario del hospital. Panamá no aplica horario de verano, así que es
 * fijo todo el año y no hace falta una tabla de zonas.
 */
const DESFASE_HOSPITAL = "-05:00";

/**
 * Serializa una columna DATE (fecha civil, sin hora) fijando la medianoche en
 * el huso del hospital.
 *
 * La parte de la fecha se toma en UTC —Prisma entrega el DATE como medianoche
 * UTC— y NO con getFullYear/getMonth, que la leerían en la zona del servidor y
 * restarían un día en cualquier huso negativo.
 *
 * Vive aquí y no en routes/patients.ts porque `fecha_nacimiento` sale ya por
 * dos rutas (/patients y /dashboard/assigned-patients) y dos copias de esta
 * conversión son dos oportunidades de que una de ellas corra la fecha un día.
 */
export function civilDateIso(value: Date): string {
  return `${value.toISOString().slice(0, 10)}T00:00:00${DESFASE_HOSPITAL}`;
}
