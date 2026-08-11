// CARGA — escribir los agregados en el datamart.
//
// Se escribe con REEMPLAZO, no sumando: el bucket que llega trae el total de esa
// hora (o de ese día) recalculado desde las lecturas crudas, así que pisar el
// valor anterior es lo correcto. Es lo que hace que el ETL se pueda volver a
// correr sobre una ventana ya procesada sin duplicar nada — que es la única
// forma de reparar un día mal cargado sin borrar la tabla a mano.
//
// Por eso la llave primaria de las dos tablas es el bucket (sensor+hora,
// día+sensor+severidad) y no un autoincrement: sin ella el "reemplazo" no
// tendría sobre qué operar.

import { prisma } from "../src/lib/prisma.ts";
import type { FilaAlertaDia, FilaLecturaHora } from "./transform.ts";

// Los buckets van en tandas dentro de una transacción. Una sola transacción con
// todo dentro mantiene bloqueada la tabla mientras dure la carga completa; una
// transacción por bucket son miles de commits. La tanda es el punto medio.
const TANDA = 500;

function enTandas<T>(filas: T[]): T[][] {
  const tandas: T[][] = [];
  for (let i = 0; i < filas.length; i += TANDA) {
    tandas.push(filas.slice(i, i + TANDA));
  }
  return tandas;
}

export async function cargarLecturasHora(filas: FilaLecturaHora[]): Promise<number> {
  for (const tanda of enTandas(filas)) {
    await prisma.$transaction(
      tanda.map((fila) =>
        prisma.lecturaHora.upsert({
          where: { sensor_id_hora: { sensor_id: fila.sensor_id, hora: fila.hora } },
          create: fila,
          update: {
            muestras: fila.muestras,
            valor_min: fila.valor_min,
            valor_max: fila.valor_max,
            valor_prom: fila.valor_prom,
          },
        }),
      ),
    );
  }
  return filas.length;
}

export async function cargarAlertasDia(filas: FilaAlertaDia[]): Promise<number> {
  for (const tanda of enTandas(filas)) {
    await prisma.$transaction(
      tanda.map((fila) =>
        prisma.alertaDia.upsert({
          where: {
            dia_sensor_id_severidad: {
              dia: fila.dia,
              sensor_id: fila.sensor_id,
              severidad: fila.severidad,
            },
          },
          create: fila,
          update: { total: fila.total },
        }),
      ),
    );
  }
  return filas.length;
}
