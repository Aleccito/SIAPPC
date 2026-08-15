import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { notFound } from "../lib/http.ts";
import { alLlegarOnda } from "../services/waveform.ts";
import type { WaveformBatch } from "../services/waveform.ts";

// La onda de UNA cama, en vivo.
//
// Ruta por dispositivo y no un flujo general: la onda solo la quiere quien está
// mirando esa cama. Un flujo con todas las camas obligaría a mandar veinte
// caudales a cada pestaña para que descartara diecinueve.
//
// Mismo mecanismo que /alerts/stream —SSE sobre HTTP normal, mismo proxy, mismo
// `Authorization`— por las mismas razones, que están explicadas allí.

/** Latido para que ningún intermediario corte por inactividad. */
const LATIDO_MS = 25_000;

function marco(evento: string, datos: unknown): string {
  return `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;
}

export default async function waveformStreamRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get<{ Params: { device: string } }>(
    "/monitoring/:device/waveform",
    { preHandler: [app.requirePermission("monitoreo", "ver")] },
    async (req, reply) => {
      const { device } = req.params;

      // El equipo tiene que ser de ESTE hospital. Sin esta comprobación,
      // cualquiera con sesión podría escuchar la onda de un equipo de otro
      // hospital sabiendo su código, que es justo lo que el resto de la API
      // impide en todas sus consultas.
      const dispositivo = await prisma.dispositivo.findFirst({
        where: { codigo: device, hospital_id: req.hospitalId },
        select: { dispositivo_id: true },
      });
      if (!dispositivo) throw notFound("Dispositivo no encontrado");

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        // nginx almacena las respuestas por omisión y aquí eso se nota
        // inmediatamente: la onda llegaría a golpes en vez de fluir.
        "X-Accel-Buffering": "no",
      });

      // Confirma que el flujo está abierto sin esperar al primer lote. Importa
      // más que en las alertas: si el equipo está apagado no llegará ninguno, y
      // el navegador necesita distinguir "conectado y sin señal" de "no
      // conectado".
      reply.raw.write(marco("listo", { device }));

      const enviar = (lote: WaveformBatch) => {
        // `device` ya viene filtrado por el registro de oyentes; se manda el
        // lote tal cual, sin el nombre del equipo repetido en cada marco.
        reply.raw.write(
          marco("onda", { variable: lote.variable, hz: lote.hz, ts: lote.ts, samples: lote.samples }),
        );
      };

      const cancelar = alLlegarOnda(device, enviar);

      const latido = setInterval(() => {
        reply.raw.write(": latido\n\n");
      }, LATIDO_MS);

      // Cerrar la pestaña, cambiar de cama en la ronda o perder la red pasan por
      // aquí. Sin esta limpieza cada cama visitada dejaría un oyente vivo, y con
      // el giro automático de la ronda eso son tres por minuto.
      req.raw.on("close", () => {
        clearInterval(latido);
        cancelar();
      });

      return reply;
    },
  );
}
