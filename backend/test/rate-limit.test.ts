import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.ts";
import { pool } from "../db/db.ts";
import { redis } from "../src/lib/redis.ts";
import { ADMIN, closeConnections, flushRedis, resetDatabase } from "./helpers.ts";

// El punto de esta suite: el contador vive en Redis, no en la memoria del
// proceso. Con el contador en memoria, dos réplicas del backend dejaban pasar el
// doble de intentos y reiniciar borraba los bloqueos.

const WRONG = { email: ADMIN.email, password: "no-es-la-clave" };

function login(app: FastifyInstance, payload: object) {
  return app.inject({ method: "POST", url: "/auth/login", payload });
}

describe("límite de intentos de login", () => {
  let app: FastifyInstance;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("deja pasar 5 intentos y bloquea el sexto", async () => {
    for (let i = 0; i < 5; i++) {
      assert.equal((await login(app, WRONG)).statusCode, 401, `intento ${i + 1}`);
    }
    assert.equal((await login(app, WRONG)).statusCode, 429);
  });

  it("el contador está en Redis, no en el proceso", async () => {
    const keys = await redis!.keys("siappc-rl:*auth/login*");
    assert.ok(keys.length > 0, "no se escribió ninguna clave de login en Redis");
  });

  it("cada bloqueo queda como LOGIN_BLOCKED en la bitácora", async () => {
    const [rows] = await pool.query<{ total: number }[] & object[]>(
      "SELECT COUNT(*) AS total FROM auditoria WHERE accion = 'LOGIN_BLOCKED'",
    );
    assert.ok((rows as { total: number }[])[0]!.total > 0);
  });

  it("una instancia nueva hereda el bloqueo — es el caso de la segunda réplica", async () => {
    // Otra instancia de la aplicación, con su propia memoria, hablando con el
    // mismo Redis: es lo que ocurre al escalar a dos contenedores. Con el store
    // en memoria esta instancia arrancaría con el contador en cero y daría 401
    // (o incluso 200 con la clave buena), no 429.
    const replica = await buildApp();
    await replica.ready();
    try {
      assert.equal((await login(replica, WRONG)).statusCode, 429);
      // Ni siquiera con las credenciales correctas: el bloqueo es por IP+correo.
      assert.equal((await login(replica, ADMIN)).statusCode, 429);
    } finally {
      await replica.close();
    }
  });
});
