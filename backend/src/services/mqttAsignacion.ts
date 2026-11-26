// Aviso de asignación a cada monitor: siappc/<equipo>/asignacion, retenido.
//
// Un monitor de verdad recibe la admisión de su cama: sabe si tiene paciente y para qué está puesto. Aquí el aviso
// lleva lo mínimo para eso —si está asignado, el motivo de consulta y los diagnósticos activos— y NUNCA el nombre, la
// cédula ni el id del paciente: el broker es compartido por todos los equipos.
//
// Lo usa el publicador de demo (prototipo/tools/telemetria-demo) para saber a qué equipos simular sin tener otra
// contraseña que la de MQTT. Al ser retenido, quien se suscribe recibe en el acto el estado de cada equipo.
//
// Cuándo se publica:
//   - al asignar o liberar un monitor (routes/devices.ts) y al egresar o cancelar un ingreso (routes/admissions.ts);
//   - al conectarse al broker y cada SINCRONIA_MS para todos los equipos: así llega también un diagnóstico que el
//     médico registra después, y un aviso que se perdió con el broker caído.
import type mqtt from "mqtt";
import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../lib/prisma.ts";

export const SINCRONIA_MS = 120_000;

export const topicoAsignacion = (codigo: string) => `siappc/${codigo}/asignacion`;

export type AvisoAsignacion =
  | { device: string; asignado: false }
  | { device: string; asignado: true; motivo: string | null; diagnosticos: string[] };

export type DatosAsignacion = {
  motivoConsulta: string | null;
  /** Motivo del ingreso activo: el de respaldo si el paciente no tiene motivo de consulta. */
  motivoIngreso: string | null;
  diagnosticos: Array<{ descripcion: string; cie10: string | null }>;
};

/** El cuerpo del aviso. Sin paciente: `asignado: false`. Pura, para probarla sin broker. */
export function mensajeAsignacion(codigo: string, datos: DatosAsignacion | null): AvisoAsignacion {
  if (!datos) return { device: codigo, asignado: false };
  const motivo = datos.motivoConsulta?.trim() || datos.motivoIngreso?.trim() || null;
  return {
    device: codigo,
    asignado: true,
    motivo,
    diagnosticos: datos.diagnosticos.map((d) => (d.cie10 ? `${d.descripcion} [${d.cie10}]` : d.descripcion)),
  };
}

let cliente: mqtt.MqttClient | null = null;

/** Lee de la base lo que va en el aviso de cada equipo (todos, o los de `codigos`). */
async function avisosDe(codigos?: string[]): Promise<AvisoAsignacion[]> {
  const equipos = await prisma.dispositivo.findMany({
    where: codigos ? { codigo: { in: codigos } } : {},
    select: {
      codigo: true,
      paciente: {
        select: {
          activo: true,
          motivo_consulta: true,
          ingresos: { where: { estado: "activo" }, orderBy: { fecha_ingreso: "desc" }, take: 1, select: { motivo: true } },
          expediente: {
            select: {
              diagnosticos: {
                where: { estado: "activo" },
                orderBy: { fecha_registro: "desc" },
                take: 5,
                select: { descripcion: true, cie10: true },
              },
            },
          },
        },
      },
    },
  });
  // Un equipo de un paciente dado de baja se trata como libre: nadie lo está usando.
  const encontrados = equipos.map((e) =>
    mensajeAsignacion(
      e.codigo,
      e.paciente?.activo
        ? {
            motivoConsulta: e.paciente.motivo_consulta,
            motivoIngreso: e.paciente.ingresos[0]?.motivo ?? null,
            diagnosticos: e.paciente.expediente?.diagnosticos ?? [],
          }
        : null,
    ),
  );
  // Un código pedido que ya no existe se avisa como libre: que el simulador deje de publicarlo.
  const faltan = (codigos ?? []).filter((c) => !equipos.some((e) => e.codigo === c));
  return [...encontrados, ...faltan.map((c) => mensajeAsignacion(c, null))];
}

function publicar(aviso: AvisoAsignacion): Promise<void> {
  const c = cliente;
  if (!c?.connected) return Promise.resolve();
  return new Promise((resolve, reject) =>
    c.publish(topicoAsignacion(aviso.device), JSON.stringify(aviso), { qos: 1, retain: true }, (err) => (err ? reject(err) : resolve())),
  );
}

/**
 * Avisa a esos equipos de su asignación actual. Nunca falla: la asignación ya quedó en la base y la sincronía
 * periódica la vuelve a mandar. Sin broker (las pruebas, o MQTT caído) no hace nada.
 */
export async function avisarAsignacion(codigos: string[], logger?: FastifyBaseLogger): Promise<void> {
  if (!codigos.length || !cliente?.connected) return;
  try {
    for (const aviso of await avisosDe(codigos)) await publicar(aviso);
  } catch (err) {
    logger?.warn({ err, codigos }, "mqtt: no se pudo avisar la asignación del monitor");
  }
}

/** Publica el aviso de TODOS los equipos (al conectarse y cada SINCRONIA_MS). */
export async function sincronizarAsignaciones(logger: FastifyBaseLogger): Promise<void> {
  if (!cliente?.connected) return;
  try {
    const avisos = await avisosDe();
    for (const aviso of avisos) await publicar(aviso);
    logger.debug({ equipos: avisos.length }, "mqtt: asignaciones sincronizadas");
  } catch (err) {
    logger.warn({ err }, "mqtt: no se pudieron sincronizar las asignaciones");
  }
}

/** Lo llama services/mqttIngest.ts con su cliente: el mismo que ya está conectado al broker. */
export function usarClienteAsignacion(c: mqtt.MqttClient, logger: FastifyBaseLogger): void {
  cliente = c;
  c.on("connect", () => void sincronizarAsignaciones(logger));
  setInterval(() => void sincronizarAsignaciones(logger), SINCRONIA_MS).unref();
}
