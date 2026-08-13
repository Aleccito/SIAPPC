import type { FastifyInstance } from "fastify";
import { alSurgirAlerta } from "../lib/eventos.ts";
import type { EventoAlerta } from "../lib/eventos.ts";

// Aviso en vivo de alertas críticas: Server-Sent Events.
//
// SSE y no WebSocket a propósito. El flujo es de una sola dirección —el
// servidor avisa, el navegador no responde nada—, va sobre HTTP normal (mismo
// puerto, mismo proxy de nginx, mismas cabeceras de autorización) y el
// navegador reconecta solo. Un WebSocket traería negociación de protocolo y una
// ruta aparte en el proxy para no ganar nada aquí.
//
// El navegador NO usa `EventSource`: esa API no deja poner cabeceras y obligaría
// a mandar el token en la URL, donde acaba en los registros del servidor y del
// proxy. El frontend lee el flujo con `fetch` y su `Authorization` de siempre
// (ver frontend/src/modules/dashboard/useAlertStream.ts).

/** Cada cuánto se manda un latido para que ningún intermediario corte por inactividad. */
const LATIDO_MS = 25_000;

/** Severidades que justifican interrumpir a alguien. Las bajas no se empujan. */
const SEVERIDADES_EN_VIVO = new Set(["alta", "critica"]);

function marco(evento: string, datos: unknown): string {
  return `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;
}

export default async function alertsStreamRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/alerts/stream",
    { preHandler: [app.requirePermission("alertas", "ver")] },
    async (req, reply) => {
      const hospitalId = req.hospitalId;

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        // nginx almacena las respuestas por omisión y se quedaría con los
        // eventos en el buffer: el tablero no vería nada hasta que cerrara.
        "X-Accel-Buffering": "no",
      });

      // Primer marco inmediato: confirma al navegador que el flujo está abierto
      // sin esperar a que haya una alerta, que puede tardar horas.
      reply.raw.write(marco("listo", { at: new Date().toISOString() }));

      const enviar = (evento: EventoAlerta) => {
        // Cada tablero ve solo su hospital, igual que el resto de la API.
        if (evento.hospitalId !== hospitalId) return;
        if (!SEVERIDADES_EN_VIVO.has(evento.severity)) return;
        reply.raw.write(marco("alerta", evento));
      };

      const cancelar = alSurgirAlerta(enviar);

      const latido = setInterval(() => {
        // Comentario SSE: el navegador lo ignora y la conexión sigue viva.
        reply.raw.write(": latido\n\n");
      }, LATIDO_MS);

      // Cerrar la pestaña, navegar a otra pantalla o perder la red pasan por
      // aquí. Sin esta limpieza, cada recarga dejaría un oyente y un temporizador
      // vivos para siempre.
      req.raw.on("close", () => {
        clearInterval(latido);
        cancelar();
      });

      // La promesa no se resuelve: la petición queda abierta a propósito, que es
      // en lo que consiste el flujo.
      return reply;
    },
  );
}
