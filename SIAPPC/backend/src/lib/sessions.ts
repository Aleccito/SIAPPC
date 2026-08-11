// Lista de tokens revocados, en Redis.
//
// El JWT es stateless: una vez firmado vale hasta que expira, y cerrar sesión
// tirando el token en el navegador no impide que alguien que se quedó con una
// copia lo siga usando doce horas más. Esto es lo que cierra esa ventana.
//
// Se revoca POR TOKEN y no por usuario: cada sesión se firma con un `jti`
// propio, así que cerrar sesión en el celular no echa a la misma persona de la
// computadora del consultorio.
//
// La entrada vive exactamente lo que le quedaba al token. Después de eso la
// firma ya no vale por su cuenta y guardarla más tiempo solo ocupa memoria.

import type { FastifyBaseLogger } from "fastify";
import { redis } from "./redis.ts";

const NAMESPACE = "siappc-jwt:";

const key = (jti: string) => `${NAMESPACE}${jti}`;

/**
 * Marca el token como revocado hasta su expiración.
 *
 * `exp` es el del propio token, en segundos (lo pone @fastify/jwt al firmar).
 * Devuelve false si no se pudo anotar —sin Redis, o con Redis caído—, porque el
 * que llama tiene que saber que la revocación NO ocurrió.
 */
export async function revokeToken(
  jti: string,
  exp: number,
  logger: FastifyBaseLogger,
): Promise<boolean> {
  if (!redis) return false;

  // Lo que le queda de vida al token. Un token ya vencido no necesita entrada.
  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl <= 0) return true;

  try {
    await redis.set(key(jti), "1", "EX", ttl);
    return true;
  } catch (err: unknown) {
    logger.error({ err, jti }, "sessions: no se pudo revocar el token");
    return false;
  }
}

/**
 * ¿Está revocado?
 *
 * Con Redis caído responde que no y deja pasar la petición, igual que hacen la
 * caché y el límite de peticiones (ver skipOnError en app.ts). Tiene un costo
 * real y explícito: mientras Redis no esté, un token revocado vuelve a servir.
 * Se elige así porque lo contrario —negar todo— deja al hospital sin monitoreo
 * por una caída de la caché, y el resto de los controles siguen en pie: la
 * cuenta suspendida se corta contra la base, y el token caduca solo a las 12 h.
 * Un Redis caído es un incidente de operación, no un modo de funcionamiento.
 */
export async function isTokenRevoked(jti: string, logger: FastifyBaseLogger): Promise<boolean> {
  if (!redis) return false;

  try {
    return (await redis.exists(key(jti))) === 1;
  } catch (err: unknown) {
    logger.error({ err, jti }, "sessions: no se pudo consultar la lista de revocados");
    return false;
  }
}
