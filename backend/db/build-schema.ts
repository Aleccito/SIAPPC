// Genera `db/schema.sql` a partir de `prisma/schema.prisma`.
//
//   npm run schema:build
//
// El resultado es el DDL completo de una instalación nueva, que es lo que corre
// MariaDB en el primer arranque del contenedor y lo que usan las pruebas para
// recrear la base. No hace falta una base viva: el DDL sale del datamodel.
//
// Tres partes, en este orden:
//   1. Las tablas, de `prisma migrate diff`.
//   2. `db/extra.sql`, lo que Prisma no puede expresar (CHECK, triggers).
//   3. `_prisma_migrations` con todas las migraciones ya marcadas como
//      aplicadas — una base recién creada nace al día, igual que antes lo hacía
//      el INSERT sobre `migracion`. Sin esto, el siguiente `migrate deploy`
//      intentaría volver a crear tablas que ya existen.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const MIGRATIONS_DIR = resolve(ROOT, "prisma", "migrations");
const OUT = resolve(ROOT, "db", "schema.sql");

const HEADER = `-- ThermoTrace / Monitoreo Hospitalario - MariaDB 11.4
--
-- ARCHIVO GENERADO. NO EDITAR A MANO.
--   fuente:  prisma/schema.prisma  (+ db/extra.sql)
--   regenera: npm run schema:build
--
-- El nombre de la base viene de DB_NAME en el entorno: Docker la crea con
-- MARIADB_DATABASE y se conecta directo a ella. Por eso aquí no hay CREATE
-- DATABASE ni USE.
--
-- Corre una sola vez, en el primer arranque del contenedor con el volumen
-- vacío. Sobre una base que ya tiene tablas falla, y eso es correcto: para
-- cambiar el esquema de una base existente se usa \`npm run migrate\`.
`;

function tablesDdl(): string {
  return execFileSync(
    process.execPath,
    [
      resolve(ROOT, "node_modules", "prisma", "build", "index.js"),
      "migrate",
      "diff",
      "--from-empty",
      "--to-schema",
      "prisma/schema.prisma",
      "--script",
    ],
    { cwd: ROOT, encoding: "utf8" },
  )
    // La CLI saluda por stdout antes del SQL; el DDL empieza en el primer
    // comentario `-- CreateTable`.
    .replace(/^[\s\S]*?(?=-- CreateTable)/, "");
}

/** Mismo cálculo que usa Prisma para la columna `checksum`. */
function checksum(sql: string): string {
  return createHash("sha256").update(sql).digest("hex");
}

async function appliedMigrationsSql(): Promise<string> {
  const names = (await readdir(MIGRATIONS_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const values: string[] = [];
  for (const name of names) {
    const sql = await readFile(resolve(MIGRATIONS_DIR, name, "migration.sql"), "utf8");
    // El `id` es un UUID en Prisma; aquí basta con que sea único y estable, y
    // derivarlo del nombre hace el archivo reproducible.
    const id = createHash("sha256").update(name).digest("hex").slice(0, 36);
    values.push(`('${id}', '${checksum(sql)}', NOW(3), '${name}', NOW(3), 1)`);
  }

  return `-- Migraciones ya incorporadas al DDL de arriba. Una base creada con este
-- archivo nace al día y \`prisma migrate deploy\` no repite ninguna.
CREATE TABLE \`_prisma_migrations\` (
    \`id\` VARCHAR(36) NOT NULL,
    \`checksum\` VARCHAR(64) NOT NULL,
    \`finished_at\` DATETIME(3) NULL,
    \`migration_name\` VARCHAR(255) NOT NULL,
    \`logs\` TEXT NULL,
    \`rolled_back_at\` DATETIME(3) NULL,
    \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO \`_prisma_migrations\`
  (\`id\`, \`checksum\`, \`finished_at\`, \`migration_name\`, \`started_at\`, \`applied_steps_count\`)
VALUES
${values.join(",\n")};
`;
}

const extra = await readFile(resolve(ROOT, "db", "extra.sql"), "utf8");

await writeFile(
  OUT,
  [HEADER, tablesDdl(), extra, await appliedMigrationsSql()].join("\n"),
  "utf8",
);

console.log(`Escrito ${OUT}`);
