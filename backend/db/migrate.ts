// Aplica las migraciones pendientes de `db/migrations/` sobre una base que ya
// existe.
//
//   docker compose exec backend node db/migrate.ts
//
// El esquema completo de una instalación nueva vive en `schema.sql`, y lo
// aplica MariaDB sola en el primer arranque. Este script es para lo otro: una
// base que ya tiene datos y se quedó atrás.
//
// Cada archivo se aplica una vez y queda anotado en la tabla `migracion`.
// Volver a correr el script cuando no hay nada pendiente no hace nada.

import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error("Faltan DB_NAME / DB_USER / DB_PASSWORD en el entorno (.env)");
  process.exit(1);
}

// Relativo a este archivo, no al directorio del shell, para que funcione desde
// donde sea que se ejecute.
const MIGRATIONS_DIR = resolve(import.meta.dirname, "migrations");

async function migrate(): Promise<void> {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((name) => name.endsWith(".sql"))
    // Orden alfabético = orden de aplicación; por eso los nombres van
    // numerados (001-, 002-, …) y no por fecha.
    .sort();

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    // Las bases creadas antes de que existiera el mecanismo no tienen la tabla;
    // se crea vacía y entonces les toca aplicar todo desde la primera.
    await conn.query(
      `CREATE TABLE IF NOT EXISTS migracion (
         nombre      VARCHAR(120) NOT NULL,
         aplicada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
         PRIMARY KEY (nombre)
       ) ENGINE=InnoDB`,
    );

    const [rows] = await conn.query<mysql.RowDataPacket[]>("SELECT nombre FROM migracion");
    const applied = new Set(rows.map((row) => String(row.nombre)));

    const pending = files.filter((name) => !applied.has(name));
    if (pending.length === 0) {
      console.log(`Sin migraciones pendientes en '${DB_NAME}'.`);
      return;
    }

    for (const name of pending) {
      const sql = await readFile(resolve(MIGRATIONS_DIR, name), "utf8");
      // Sin transacción a propósito: MariaDB no revierte DDL, así que envolver
      // esto en un BEGIN daría una sensación falsa de atomicidad. Si una
      // migración falla, se corta aquí y se arregla a mano; las anteriores ya
      // quedaron registradas y no se repiten.
      await conn.query(sql);
      await conn.query("INSERT INTO migracion (nombre) VALUES (?)", [name]);
      console.log(`Aplicada: ${name}`);
    }

    console.log(`${pending.length} migración(es) aplicada(s) en '${DB_NAME}'.`);
  } catch (err) {
    console.error("Falló la migración:", (err as Error).message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

migrate();
