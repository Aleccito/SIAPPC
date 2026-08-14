import { EventEmitter } from "node:events";
import { Redis } from "ioredis";
import { env } from "../env.ts";
import type { AlertSeverity } from "../types.ts";

// Bus de eventos en vivo: lo que el servidor EMPUJA al tablero sin que el
// navegador pregunte.
//
// Existe por una razón clínica: una alerta crítica avisada por sondeo llega
// cuando al navegador le toca preguntar —hasta 15 segundos— y solo si alguien
// tiene la pantalla abierta. En cuidado crítico esa espera no es aceptable.
//
// NO confundir con el ETL: aquel agrega por lotes cada hora para los reportes;
// esto es el instante en que una lectura cruza un umbral.

/** Lo que viaja al navegador cuando una lectura dispara una alerta. */
export type EventoAlerta = {
  alertId: string;
  hospitalId: number;
  device: string;
  patientId: string | null;
  patientName: string | null;
  variable: string;
  value: number;
  unit: string;
  severity: AlertSeverity;
  type: string;
  message: string | null;
  at: string;
  /**
   * Usuarios a los que esta alerta SÍ les creó una notificación en la bandeja
   * (ver lib/notificaciones.ts). Viaja por el bus y no lo recalcula el flujo
   * porque la decisión —quién es responsable, y a quién le tocaba callar por la
   * ventana de agrupación— ya se tomó en la ingesta: repetirla en cada conexión
   * abierta daría respuestas distintas según cuándo se pregunte.
   *
   * NO se manda al navegador: es una lista de identificadores de otras personas.
   * routes/alertsStream.ts la usa para decidir a quién avisar y la descarta.
   */
  notificados: number[];
};

const CANAL = "siappc:alertas";

// Dentro del proceso siempre. Es lo único que hace falta con una sola
// instancia, y es también el destino final de lo que llega por Redis.
const local = new EventEmitter();
// El tablero de un hospital grande puede tener muchas pestañas abiertas y cada
// una es un oyente; el aviso por defecto a los 10 no aporta nada aquí.
local.setMaxListeners(0);

/**
 * Suscriptor propio, y no el cliente compartido de lib/redis.ts: una conexión
 * de ioredis en modo suscripción NO admite comandos normales, así que
 * reutilizarlo rompería el límite de peticiones y la caché.
 *
 * Solo se crea si hay REDIS_URL. Sin él todo sigue funcionando con una
 * instancia; con varias, cada backend avisaría únicamente a los navegadores
 * conectados a él.
 */
const suscriptor: Redis | null = env.redisUrl
  ? new Redis(env.redisUrl, { maxRetriesPerRequest: null, connectTimeout: 2000 })
  : null;

/** Publicador aparte por lo mismo: el suscriptor no puede publicar. */
const publicador: Redis | null = env.redisUrl
  ? new Redis(env.redisUrl, { enableOfflineQueue: false, maxRetriesPerRequest: 1 })
  : null;

if (suscriptor) {
  void suscriptor.subscribe(CANAL);
  suscriptor.on("message", (canal: string, carga: string) => {
    if (canal !== CANAL) return;
    try {
      local.emit("alerta", JSON.parse(carga) as EventoAlerta);
    } catch {
      // Un mensaje ilegible no debe tumbar el proceso que atiende el monitoreo.
    }
  });
}

/**
 * Publica una alerta a todos los tableros conectados, de esta instancia y de
 * las demás.
 *
 * Nunca lanza: la alerta YA está guardada en la base cuando esto se llama, y
 * que falle el aviso en vivo no puede deshacer ni interrumpir la ingesta.
 */
export function publicarAlerta(evento: EventoAlerta): void {
  if (publicador) {
    void publicador.publish(CANAL, JSON.stringify(evento)).catch(() => {
      // Sin Redis el aviso queda dentro de esta instancia; el tablero además
      // sigue repreguntando por su cuenta, así que no se pierde el dato.
    });
    // Con Redis, el propio suscriptor de este proceso recibirá el mensaje y
    // hará el `emit`: emitir aquí también duplicaría el aviso.
    return;
  }
  local.emit("alerta", evento);
}

/** Escucha alertas. Devuelve la función que cancela la suscripción. */
export function alSurgirAlerta(oyente: (evento: EventoAlerta) => void): () => void {
  local.on("alerta", oyente);
  return () => local.off("alerta", oyente);
}

export async function cerrarEventos(): Promise<void> {
  await Promise.all([suscriptor?.quit(), publicador?.quit()]);
}
