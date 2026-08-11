// Configuración de la CLI de Prisma (migrate, generate, studio). El cliente en
// tiempo de ejecución NO pasa por aquí: se conecta con el adaptador de mariadb
// sobre el pool de `db/db.ts` (ver src/lib/prisma.ts).
//
// La URL se arma con las mismas DB_* que ya usan Docker Compose y el pool, para
// no tener el mismo dato escrito de dos formas en el `.env`.
import { defineConfig } from "prisma/config";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // La semilla es SQL plano y la comparte con el primer arranque de Docker.
    seed: "node db/seed.ts",
  },
  datasource: {
    url: `mysql://${encodeURIComponent(DB_USER ?? "")}:${encodeURIComponent(
      DB_PASSWORD ?? "",
    )}@${DB_HOST}:${DB_PORT}/${DB_NAME ?? ""}`,
  },
});
