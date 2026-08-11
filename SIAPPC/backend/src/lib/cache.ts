import type { FastifyBaseLogger } from "fastify";
import { redis } from "./redis.ts";

// Caché de lectura (cache-aside) sobre Redis, con TTL y sin invalidación
// explícita.
//
// Por qué TTL y no invalidar en cada escritura: la ingesta MQTT inserta una
// lectura por segundo y por sensor (iot/.env:PUBLISH_INTERVAL). Invalidar en
// cada INSERT dejaría la caché siempre fría — sería toda la complejidad de la
// invalidación y ninguno de los aciertos. Un TTL corto acota el desfase a un
// número conocido y no puede quedarse pegado.
//
// El precio es que una respuesta puede venir hasta TTL segundos vieja. Para el
// tablero y los reportes es aceptable; para algo que dispare una acción clínica
// inmediata no lo sería, y ese endpoint tendría que saltarse la caché.

// El namespace separa estas claves de las del límite de peticiones
// (`siappc-rl:`, ver src/app.ts) para que borrar una caché nunca borre un
// contador.
const NAMESPACE = "siappc-cache:";

// Serializa los parámetros en orden fijo: `?device=A&limit=50` y
// `?limit=50&device=A` son la misma consulta y deben dar la misma clave.
export function cacheKey(scope: string, params: Record<string, unknown>): string {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`);
  return `${NAMESPACE}${scope}:${parts.join("&")}`;
}

/**
 * Devuelve el valor en caché o ejecuta `load` y lo guarda.
 *
 * Cualquier fallo de Redis se degrada a ir a la base de datos: la caché nunca
 * puede convertir una API que funciona en una que responde 500.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  logger: FastifyBaseLogger,
  load: () => Promise<T>,
): Promise<T> {
  if (!redis || ttlSeconds <= 0) return load();

  try {
    const hit = await redis.get(key);
    if (hit !== null) return JSON.parse(hit) as T;
  } catch (err: unknown) {
    logger.warn({ err, key }, "cache: fallo al leer, se va a la base de datos");
    return load();
  }

  const value = await load();

  // Escribir la caché no debe hacer fallar la petición: el dato ya está listo.
  // `void` + catch en vez de await para no sumar el viaje a Redis a la latencia
  // de una respuesta que ya se puede enviar.
  void redis
    .set(key, JSON.stringify(value), "EX", ttlSeconds)
    .catch((err: unknown) => logger.warn({ err, key }, "cache: fallo al guardar"));

  return value;
}
