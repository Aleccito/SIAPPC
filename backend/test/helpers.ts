import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import type { FastifyInstance } from "fastify";

// Credenciales del admin que siembra db/seed.sql.
export const ADMIN = { email: "admin@institucion.org", password: "Admin12345" };

const HERE = import.meta.dirname;

/**
 * Borra y recrea la base de pruebas desde schema.sql + seed.sql.
 *
 * Se hace por conexión suelta y no con el pool de db/db.ts porque ese pool ya
 * apunta a la base que estamos por recrear.
 *
 * `multipleStatements` va aquí y en ningún otro sitio: los .sql traen decenas de
 * sentencias. El pool de la aplicación NO lo activa, que es lo que impide que
 * una inyección encadene una segunda sentencia.
 */
export async function resetDatabase(): Promise<void> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  const name = process.env.DB_NAME!;
  await connection.query(`DROP DATABASE IF EXISTS \`${name}\``);
  await connection.query(`CREATE DATABASE \`${name}\``);
  await connection.changeUser({ database: name });

  for (const file of ["schema.sql", "seed.sql"]) {
    await connection.query(await readFile(resolve(HERE, "..", "db", file), "utf-8"));
  }

  await connection.end();
}

/** Token del admin sembrado, pidiéndolo por la misma ruta que usa el navegador. */
export async function loginAsAdmin(app: FastifyInstance): Promise<string> {
  const res = await app.inject({ method: "POST", url: "/auth/login", payload: ADMIN });
  if (res.statusCode !== 200) {
    throw new Error(`login de prueba falló: ${res.statusCode} ${res.body}`);
  }
  return res.json().token as string;
}

export function authHeader(token: string): Record<string, string> {
  return { authorization: `Bearer ${token}` };
}

/**
 * Vacía las claves que dejan las pruebas anteriores.
 *
 * Sin esto, la prueba del límite de peticiones arrastra el contador de la
 * corrida previa y falla la segunda vez que se corre `npm test` — que es
 * exactamente el fallo que la suite existe para detectar en producción.
 */
export async function flushRedis(): Promise<void> {
  const { redis } = await import("../src/lib/redis.ts");
  if (!redis) throw new Error("las pruebas necesitan REDIS_URL (ver .env.test)");
  for (const prefix of ["siappc-rl:*", "siappc-cache:*"]) {
    const keys = await redis.keys(prefix);
    if (keys.length) await redis.del(...keys);
  }
}

/** Cierra pool y cliente de Redis para que el proceso de pruebas termine. */
export async function closeConnections(): Promise<void> {
  const { pool } = await import("../db/db.ts");
  const { closeRedis } = await import("../src/lib/redis.ts");
  await pool.end();
  await closeRedis();
}
