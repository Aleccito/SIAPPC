// Import con nombre, no por defecto: ioredis es CommonJS y con ESM + NodeNext
// el `export =` solo se ve como espacio de nombres — `new Redis(...)` sobre el
// import por defecto no compila.
import { Redis } from "ioredis";
import { env } from "../env.ts";

// Cliente único del proceso. Lo comparten el store del límite de peticiones
// (@fastify/rate-limit, ver src/app.ts) y la caché de /sensors/* (lib/cache.ts).
//
// null cuando no hay REDIS_URL: el backend sigue arrancando y el rate limit cae
// al contador en memoria. Eso alcanza para `npm run dev` con una sola
// instancia; en Compose la variable siempre viene puesta.
export const redis: Redis | null = env.redisUrl
  ? new Redis(env.redisUrl, {
      // Los tres juntos son lo que evita que un Redis caído cuelgue las
      // peticiones. Por defecto ioredis encola los comandos mientras
      // reconecta y reintenta hasta 20 veces: cada request se quedaría
      // esperando en vez de fallar rápido y dejar que skipOnError decida.
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      // Backoff con techo: sin él, ioredis reintenta cada 50 ms indefinidamente
      // y llena el log mientras Redis está abajo.
      retryStrategy: (attempts: number) => Math.min(attempts * 200, 5000),
    })
  : null;

export function registerRedisLogging(logger: {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (obj: object, msg: string) => void;
}): void {
  if (!redis) {
    logger.warn(
      "redis: sin REDIS_URL — el limite de peticiones usa el contador en memoria " +
        "y la cache de /sensors/* queda desactivada. Solo valido con una instancia.",
    );
    return;
  }
  redis.on("connect", () => logger.info("redis: conectado"));
  redis.on("reconnecting", () => logger.warn("redis: reconectando…"));
  // ioredis emite 'error' en cada intento fallido. Se registra y ya: el proceso
  // no se cae, porque HTTP debe seguir respondiendo aunque la caché no esté.
  redis.on("error", (err: unknown) => logger.error({ err }, "redis: error de conexión"));
}

export async function closeRedis(): Promise<void> {
  if (redis) await redis.quit();
}
