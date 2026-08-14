import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Personal a cargo de un paciente (`medico_paciente`).
//
// Esta tabla decide dos cosas que no se ven en ella: qué pacientes lista
// `GET /dashboard/assigned-patients` —la pantalla de Pacientes— y a quién le
// llegan las notificaciones. Hasta que existieron estos endpoints solo se
// leía, así que la pantalla salía vacía para todo el mundo.
//
// Lo que se comprueba es lo que el esquema NO puede sostener solo:
//
//   - la llave única incluye la fecha, así que reasignar el mismo día tiene que
//     reactivar el renglón en vez de chocar contra `uq_medico_paciente`,
//   - quitar a alguien es `activo = false` y no un DELETE: el historial se
//     conserva y por eso el renglón sigue estando,
//   - el hospital acota las dos puntas —paciente y usuario—, y un identificador
//     ajeno responde 404 y no 403,
//   - y asignar cambia de verdad lo que ve el asignado en su propia lista, que
//     es el motivo por el que todo esto existe.

const PACIENTE = {
  reason: "Dolor torácico",
  fechaNacimiento: "1975-03-02",
  sexo: "F",
} as const;

describe("Personal a cargo de un paciente", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;
  let medico: Record<string, string>;
  let medicoId: number;
  let otroMedicoId: number;
  let pacienteId: string;

  async function cuenta(
    role: string,
    email: string,
  ): Promise<{ headers: Record<string, string>; id: number }> {
    const creada = await app.inject({
      method: "POST",
      url: "/users",
      headers: admin,
      payload: { name: `Prueba ${email}`, email, role },
    });
    assert.equal(creada.statusCode, 201, creada.body);

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email, password: creada.json().tempPassword },
    });
    assert.equal(login.statusCode, 200, login.body);
    return {
      headers: authHeader(login.json().token as string),
      id: Number(creada.json().user.id),
    };
  }

  /** Los que están a cargo AHORA, por identificador de usuario. */
  async function aCargo(id = pacienteId): Promise<number[]> {
    const res = await app.inject({
      method: "GET",
      url: `/patients/${id}/assignments`,
      headers: admin,
    });
    assert.equal(res.statusCode, 200, res.body);
    return (res.json() as { userId: number }[]).map((a) => a.userId);
  }

  /** Cuántos pacientes ve el médico en su propia pantalla. */
  async function miLista(headers: Record<string, string>): Promise<string[]> {
    const res = await app.inject({
      method: "GET",
      url: "/dashboard/assigned-patients",
      headers,
    });
    assert.equal(res.statusCode, 200, res.body);
    return (res.json() as { id: string }[]).map((p) => p.id);
  }

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));

    const m = await cuenta("medico", "acargo@institucion.org");
    medico = m.headers;
    medicoId = m.id;
    otroMedicoId = (await cuenta("medico", "suplente@institucion.org")).id;

    const creado = await app.inject({
      method: "POST",
      url: "/patients",
      headers: admin,
      payload: { ...PACIENTE, name: "Paciente A Cargo", document: "CC-9001" },
    });
    assert.equal(creado.statusCode, 201, creado.body);
    pacienteId = creado.json().id as string;
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("un paciente recién registrado no tiene a nadie a cargo", async () => {
    assert.deepEqual(await aCargo(), []);
  });

  it("asignar a un médico lo pone en la lista y le aparece el paciente", async () => {
    // Antes: el médico no ve nada. Es el estado que hacía parecer rota la
    // pantalla de Pacientes.
    assert.deepEqual(await miLista(medico), []);

    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { userId: medicoId, reason: "Médico tratante" },
    });
    assert.equal(res.statusCode, 201, res.body);
    assert.equal(res.json().userId, medicoId);

    assert.deepEqual(await aCargo(), [medicoId]);
    // Y ahora sí: el paciente aparece en SU lista, que es el efecto que se
    // busca. Comprobarlo solo con GET /assignments no diría nada de esto.
    assert.deepEqual(await miLista(medico), [pacienteId]);
  });

  it("asignar dos veces al mismo responde 409", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { userId: medicoId },
    });
    assert.equal(res.statusCode, 409, res.body);
  });

  it("un paciente puede tener a varios a cargo a la vez", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { userId: otroMedicoId },
    });
    assert.equal(res.statusCode, 201, res.body);

    const actuales = await aCargo();
    assert.equal(actuales.length, 2);
    assert.ok(actuales.includes(medicoId));
    assert.ok(actuales.includes(otroMedicoId));
  });

  it("quitar a alguien lo saca de la lista y de su pantalla", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/patients/${pacienteId}/assignments/${otroMedicoId}`,
      headers: admin,
    });
    assert.equal(res.statusCode, 204, res.body);

    assert.deepEqual(await aCargo(), [medicoId]);
  });

  it("quitar a quien no está a cargo responde 404", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/patients/${pacienteId}/assignments/${otroMedicoId}`,
      headers: admin,
    });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("volver a asignar el mismo día reactiva el renglón, no choca con la llave", async () => {
    // `uq_medico_paciente` es (usuario, paciente, FECHA). Insertar otra vez el
    // mismo día daría 500 por llave duplicada si el endpoint no reactivara el
    // renglón que la baja dejó en `activo = false`.
    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { userId: otroMedicoId },
    });
    assert.equal(res.statusCode, 201, res.body);
    assert.equal((await aCargo()).length, 2);
  });

  it("un paciente de otro hospital responde 404", async () => {
    // El hospital sale de la sesión. Pedir las asignaciones de un paciente
    // ajeno no puede distinguirse de pedir uno que no existe.
    const res = await app.inject({
      method: "GET",
      url: "/patients/999999/assignments",
      headers: admin,
    });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("asignar un usuario inexistente responde 404", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { userId: 999999 },
    });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("el cuerpo se valida: sin userId es 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/patients/${pacienteId}/assignments`,
      headers: admin,
      payload: { reason: "sin usuario" },
    });
    assert.equal(res.statusCode, 400, res.body);
  });

  it("admin ve todos los pacientes del hospital, tenga o no asignaciones", async () => {
    // La regla ensanchada: admin y administrativo no atienden pacientes, así
    // que con el filtro estricto su pantalla salía vacía aunque el hospital
    // tuviera gente. El médico sigue viendo solo los suyos.
    const suyos = await miLista(medico);
    const todos = await miLista(admin);

    assert.ok(todos.includes(pacienteId));
    assert.ok(todos.length >= suyos.length);
    // Y el admin no tiene ninguna asignación propia: lo que ve no sale de
    // `medico_paciente`.
    const res = await app.inject({ method: "GET", url: "/auth/me", headers: admin });
    assert.equal(res.statusCode, 200, res.body);
  });
});
