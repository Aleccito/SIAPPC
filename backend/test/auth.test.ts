import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.ts";
import { Prisma } from "../src/generated/prisma/client.ts";
import {
  authHeader,
  closeConnections,
  countRows,
  flushRedis,
  loginAsAdmin,
  resetDatabase,
} from "./helpers.ts";

// Lo que se comprueba aquí es que la sesión deje de valer cuando la cuenta deja
// de valer. La matriz de permisos ya exigía `activo = TRUE`, pero las rutas sin
// módulo de permiso —la sala de espera, los catálogos, /auth/me— no pasan por
// ella: sin esta prueba, una cuenta suspendida seguía entrando a todas hasta que
// expirara el token.

describe("sesión de una cuenta suspendida", () => {
  let app: FastifyInstance;
  let adminHeaders: Record<string, string>;
  let victimaHeaders: Record<string, string>;
  let victimaId: string;
  let tempPassword: string;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    adminHeaders = authHeader(await loginAsAdmin(app));

    // Una cuenta que NO sea el último administrador: al admin sembrado no se le
    // puede dar de baja (assertNotLastAdmin).
    const creada = await app.inject({
      method: "POST",
      url: "/users",
      headers: adminHeaders,
      payload: {
        name: "Enfermera Prueba",
        email: "enfermera@institucion.org",
        role: "enfermero",
      },
    });
    assert.equal(creada.statusCode, 201);
    victimaId = creada.json().user.id;
    tempPassword = creada.json().tempPassword;

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "enfermera@institucion.org", password: tempPassword },
    });
    assert.equal(login.statusCode, 200);
    victimaHeaders = authHeader(login.json().token);
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("con la cuenta activa el token entra a una ruta sin permiso propio", async () => {
    const res = await app.inject({ method: "GET", url: "/patients", headers: victimaHeaders });
    assert.equal(res.statusCode, 200);
  });

  // Va antes de la suspensión: después el token ya no pasa `authenticate` y no
  // se distinguiría qué de los dos lo cortó.
  it("cerrar sesión anota LOGOUT y mata el token, que no había vencido", async () => {
    const antes = await countRows(
      Prisma.sql`FROM auditoria WHERE accion = 'LOGOUT' AND usuario_id = ${Number(victimaId)}`,
    );

    const res = await app.inject({ method: "POST", url: "/auth/logout", headers: victimaHeaders });
    assert.equal(res.statusCode, 204);

    const despues = await countRows(
      Prisma.sql`FROM auditoria WHERE accion = 'LOGOUT' AND usuario_id = ${Number(victimaId)}`,
    );
    assert.equal(despues, antes + 1);

    // El token sigue firmado y le quedan casi 12 h: si esto diera 200, cerrar
    // sesión no serviría de nada contra una copia del token.
    const reuso = await app.inject({ method: "GET", url: "/patients", headers: victimaHeaders });
    assert.equal(reuso.statusCode, 401);
  });

  // Revocar por token y no por usuario es la diferencia entre cerrar sesión en
  // el celular y quedarse fuera también de la computadora del consultorio.
  it("cerrar una sesión no toca las otras sesiones de la misma cuenta", async () => {
    const otra = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "enfermera@institucion.org", password: tempPassword },
    });
    assert.equal(otra.statusCode, 200);
    const otraHeaders = authHeader(otra.json().token);

    const tercera = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "enfermera@institucion.org", password: tempPassword },
    });
    assert.equal(tercera.statusCode, 200);
    const terceraHeaders = authHeader(tercera.json().token);

    assert.equal(
      (await app.inject({ method: "POST", url: "/auth/logout", headers: otraHeaders })).statusCode,
      204,
    );

    assert.equal(
      (await app.inject({ method: "GET", url: "/patients", headers: otraHeaders })).statusCode,
      401,
    );
    assert.equal(
      (await app.inject({ method: "GET", url: "/patients", headers: terceraHeaders })).statusCode,
      200,
    );
  });

  it("suspendida, el MISMO token deja de entrar aunque no haya expirado", async () => {
    // Token recién emitido y NO revocado: lo que se comprueba aquí es la baja de
    // la cuenta, no el cierre de sesión de las pruebas anteriores.
    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "enfermera@institucion.org", password: tempPassword },
    });
    assert.equal(login.statusCode, 200);
    const vivos = authHeader(login.json().token);
    assert.equal(
      (await app.inject({ method: "GET", url: "/patients", headers: vivos })).statusCode,
      200,
    );

    const baja = await app.inject({
      method: "DELETE",
      url: `/users/${victimaId}`,
      headers: adminHeaders,
    });
    assert.equal(baja.statusCode, 204);

    // /patients no tiene módulo de permiso: solo lo cubre `authenticate`.
    const patients = await app.inject({ method: "GET", url: "/patients", headers: vivos });
    assert.equal(patients.statusCode, 401);

    // Y /auth/me tampoco puede seguir devolviendo la cuenta como si nada.
    const me = await app.inject({ method: "GET", url: "/auth/me", headers: vivos });
    assert.equal(me.statusCode, 401);
  });

  // `inject()` no aplica CORS, así que lo que se mira es la cabecera que el
  // servidor manda: sin ella el navegador entrega el cuerpo pero esconde el
  // total de la lista y el Location del recurso creado.
  it("CORS expone X-Total-Count y Location al navegador", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "http://localhost:5173" },
    });
    const expuestas = String(res.headers["access-control-expose-headers"] ?? "");
    assert.match(expuestas, /X-Total-Count/);
    assert.match(expuestas, /Location/);
  });
});
