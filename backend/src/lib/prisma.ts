// Cliente de Prisma: el único acceso a la base desde la aplicación.
//
// Prisma 7 no abre la conexión por sí solo — se le pasa un adaptador de driver.
// Aquí es el de MariaDB, configurado con las mismas DB_* que ya usan Docker
// Compose y la CLI de migraciones (prisma.config.ts), para que la conexión esté
// descrita en un solo lugar.

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.ts";

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

/**
 * Adaptador que recuerda todos los pools que abrió, para poder cerrarlos.
 *
 * El pool de conexiones es del driver, no de Prisma, y `$disconnect()` solo
 * cierra el que tiene a mano. Cada `connect()` crea uno nuevo —al levantar una
 * segunda instancia de la aplicación en la misma prueba, por ejemplo— y esos
 * quedan con sus sockets vivos. En el servidor da igual, porque el proceso no
 * termina; en las pruebas deja a Node colgado al acabar la suite.
 */
class MariaDbConCierre extends PrismaMariaDb {
  #abiertos: { dispose(): Promise<void> }[] = [];

  override async connect() {
    const adapter = await super.connect();
    this.#abiertos.push(adapter);
    return adapter;
  }

  async dispose(): Promise<void> {
    await Promise.all(
      this.#abiertos.map(async (adapter) => {
        try {
          await adapter.dispose();
        } catch (err) {
          // `$disconnect()` ya cerró este pool. Cerrarlo dos veces es un error
          // del driver, no del programa: la única forma de saber si hace falta
          // es intentarlo.
          if ((err as { code?: string }).code !== "ER_POOL_ALREADY_CLOSED") throw err;
        }
      }),
    );
    this.#abiertos = [];
  }
}

const adapter = new MariaDbConCierre({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  connectionLimit: 10,
  // Los BIGINT UNSIGNED de `lectura`, `alerta` y `auditoria` llegan como BigInt
  // de JavaScript. Se convierten a texto en el borde de la API (ver
  // lib/serialize.ts); no se dejan como Number porque a partir de 2^53 el
  // identificador dejaría de ser exacto.
  bigIntAsNumber: false,
});

export const prisma = new PrismaClient({ adapter });

export async function closePrisma(): Promise<void> {
  await prisma.$disconnect();
  await adapter.dispose();
}
