import { readFile } from "node:fs/promises";
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

async function migrate(): Promise<void> {
  // Relative to this file, not to the shell's directory, so the script works
  // no matter where it is run from.
  const sql = await readFile(resolve(import.meta.dirname, "schema.sql"), "utf8");

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await conn.query(sql);
    console.log(`Esquema aplicado correctamente en '${DB_NAME}'.`);
  } catch (err) {
    console.error("Fallo la migracion:", (err as Error).message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

migrate();
