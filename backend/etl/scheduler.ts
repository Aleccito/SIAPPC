// Planificador del ETL: corre `run.ts` cada hora, en punto.
//
//   node --env-file=.env etl/scheduler.ts
//
// Es el comando del servicio `etl` de docker-compose.yml. La automatización va
// dentro del contenedor y no en el cron de la máquina anfitriona a propósito:
// `docker compose up` tiene que dejar el sistema completo funcionando, sin pedir
// que nadie edite un crontab. Y así la programación queda versionada con el
// código que dispara.
//
// Sin dependencias de cron: lo único que hace falta es "al minuto ETL_MINUTO de
// cada hora", y para eso alcanza con calcular cuánto falta y esperar. Una
// expresión cron completa sería una biblioteca más para expresar lo mismo.

import { prisma, closePrisma } from "../src/lib/prisma.ts";
import { correrTodos, PROCESOS } from "./run.ts";

// Minuto de cada hora en el que corre. No en punto por defecto: a las :00 la
// hora recién cerrada todavía puede estar recibiendo lecturas con retraso desde
// el buffer de las Raspberry, y el bucket saldría corto.
const MINUTO = Number(process.env.ETL_MINUTO ?? "5");

if (!Number.isInteger(MINUTO) || MINUTO < 0 || MINUTO > 59) {
  console.error("ETL_MINUTO debe ser un entero entre 0 y 59");
  process.exit(1);
}

function msHastaLaProximaCorrida(): number {
  const ahora = new Date();
  const proxima = new Date(ahora);
  proxima.setMinutes(MINUTO, 0, 0);
  // Si el minuto de esta hora ya pasó, la próxima es la hora siguiente.
  if (proxima <= ahora) proxima.setHours(proxima.getHours() + 1);
  return proxima.getTime() - ahora.getTime();
}

/**
 * Días de lecturas crudas que se conservan. CERO = no se borra nada, y es el
 * valor por defecto a propósito: la poda destruye datos, y eso se enciende a
 * mano en cada institución, no al desplegar.
 *
 * Solo afecta a `lectura`. Los agregados de `lectura_hora` y `alerta_dia` no se
 * tocan nunca: son los que sostienen los informes y Power BI.
 */
const RETENCION_DIAS = Number(process.env.ETL_RETENCION_DIAS ?? "0");

/** Filas por llamada. Un DELETE enorme bloquea la tabla y frena la ingesta. */
const LOTE_PURGA = 5000;

if (!Number.isInteger(RETENCION_DIAS) || RETENCION_DIAS < 0) {
  console.error("ETL_RETENCION_DIAS debe ser un entero de días >= 0 (0 desactiva la poda)");
  process.exit(1);
}

/**
 * Poda lo ya agregado, DESPUÉS de la corrida.
 *
 * El orden importa: agregar primero y borrar después es lo que garantiza que
 * ninguna lectura desaparezca sin haber entrado en su bucket. El procedimiento
 * lo comprueba de todos modos —no borra nada cuyo bucket no exista— pero
 * invertir el orden dejaría cada corrida podando la ventana anterior.
 */
async function purgar(): Promise<void> {
  if (RETENCION_DIAS === 0) return;

  const borradas = await prisma.$executeRaw`CALL sp_purgar_lecturas(${RETENCION_DIAS}, ${LOTE_PURGA})`;
  if (borradas > 0) {
    console.log(`etl: poda — ${borradas} lecturas crudas anteriores a ${RETENCION_DIAS} días`);
  }
}

let corriendo = false;

async function tick(): Promise<void> {
  // Una corrida que se alargó más de una hora no se pisa con la siguiente: dos
  // procesos escribiendo los mismos buckets se bloquearían entre ellos.
  if (corriendo) {
    console.warn("etl: la corrida anterior sigue en curso, se salta este turno");
    return;
  }

  corriendo = true;
  try {
    await correrTodos(PROCESOS);
    await purgar();
  } catch (err: unknown) {
    // `correrTodos` ya atrapa lo de cada proceso; esto es la red por si falla el
    // propio orquestador. El planificador NO se cae: si se muere el proceso, no
    // vuelve a correr hasta que alguien reinicie el contenedor.
    console.error("etl: fallo inesperado del planificador —", err);
  } finally {
    corriendo = false;
  }
}

function programar(): void {
  const espera = msHastaLaProximaCorrida();
  console.log(`etl: próxima corrida en ${Math.round(espera / 1000)} s`);
  setTimeout(() => {
    void tick().finally(programar);
  }, espera);
}

for (const señal of ["SIGINT", "SIGTERM"] as const) {
  process.on(señal, () => {
    console.log(`etl: ${señal}, cerrando`);
    void closePrisma().finally(() => process.exit(0));
  });
}

// Una corrida al arrancar, y de ahí en adelante por reloj: si el contenedor
// estuvo caído, ponerse al día no debería esperar hasta el próximo turno.
console.log(`etl: planificador activo, corre al minuto :${String(MINUTO).padStart(2, "0")}`);
await tick();
programar();
