import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import {
  authHeader,
  closeConnections,
  flushRedis,
  loginAsAdmin,
  resetDatabase,
} from "./helpers.ts";

// Lo que se comprueba aquí es el contrato REST que genera lib/crud.ts: qué
// verbo hace qué, qué código sale en cada caso y que la baja sea lógica. Sin
// esto, un cambio en la fábrica rompe los cinco recursos a la vez y nada avisa.

const NUEVO_PACIENTE = {
  name: "Ana Ruiz",
  document: "C-900",
  module: "KY-001",
  reason: "Fiebre",
  fechaNacimiento: "1990-05-14",
  sexo: "F",
} as const;

describe("CRUD generado", () => {
  let app: FastifyInstance;
  let headers: Record<string, string>;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    headers = authHeader(await loginAsAdmin(app));
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  const call = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, payload?: object) =>
    app.inject({ method, url, headers, ...(payload ? { payload } : {}) });

  it("POST devuelve 201 con Location al recurso creado", async () => {
    const res = await call("POST", "/patients", NUEVO_PACIENTE);
    assert.equal(res.statusCode, 201);
    assert.equal(res.headers.location, `/patients/${res.json().id}`);
  });

  it("la lista es un arreglo y el total va en X-Total-Count", async () => {
    const res = await call("GET", "/patients");
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.json()));
    // El total en la cabecera y no en el cuerpo: el cuerpo de una colección es
    // la colección. Si alguien lo envuelve en `{ total, items }`, el frontend
    // deja de encontrar los pacientes y esta prueba lo caza antes.
    assert.ok(Number(res.headers["x-total-count"]) >= 1);
  });

  it("GET /:id inexistente es 404, y un id que no es número es 400", async () => {
    assert.equal((await call("GET", "/patients/999999")).statusCode, 404);
    assert.equal((await call("GET", "/patients/abc")).statusCode, 400);
  });

  it("PATCH acepta un cuerpo parcial; PUT exige el completo", async () => {
    const id = (await call("GET", "/patients")).json()[0]!.id;

    const patch = await call("PATCH", `/patients/${id}`, { status: "inService" });
    assert.equal(patch.statusCode, 200);
    assert.equal(patch.json().status, "inService");

    assert.equal((await call("PUT", `/patients/${id}`, { name: "Solo el nombre" })).statusCode, 400);
    assert.equal(
      (await call("PUT", `/patients/${id}`, { ...NUEVO_PACIENTE, module: "KY-004" })).statusCode,
      200,
    );
  });

  it("una llave duplicada es 409, no un 500", async () => {
    const res = await call("POST", "/patients", { ...NUEVO_PACIENTE, name: "Otra" });
    assert.equal(res.statusCode, 409);
    assert.equal(typeof res.json().error, "string");
  });

  it("DELETE responde 204 y da de baja sin borrar el renglón", async () => {
    const id = (await call("GET", "/patients")).json()[0]!.id;
    assert.equal((await call("DELETE", `/patients/${id}`)).statusCode, 204);
    // Deja de estar en la lista y en el GET por id, pero la fila sigue ahí:
    // la bitácora y la historia clínica la referencian.
    assert.equal((await call("GET", `/patients/${id}`)).statusCode, 404);
    // Y por eso la cédula sigue ocupada: un alta con la misma choca.
    assert.equal((await call("POST", "/patients", NUEVO_PACIENTE)).statusCode, 409);
  });

  it("sin token no se llega a ningún recurso", async () => {
    const res = await app.inject({ method: "GET", url: "/patients" });
    assert.equal(res.statusCode, 401);
  });

  it("el CRUD de unidades funciona igual con otro recurso y otro modelo", async () => {
    // Que `/units` exija permiso de administración para escribir y ninguno para
    // leer se configura en routes/catalogs.ts; comprobarlo hace falta una
    // cuenta sin ese permiso y no la hay sembrada. Aquí solo se verifica que la
    // fábrica sirve a un segundo recurso, no la matriz de permisos.
    const creada = await call("POST", "/units", { name: "UCI-Prueba" });
    assert.equal(creada.statusCode, 201);
    const id = creada.json().id;

    assert.equal((await call("PATCH", `/units/${id}`, { name: "UCI-2" })).statusCode, 200);
    assert.equal((await call("DELETE", `/units/${id}`)).statusCode, 204);
  });
});
