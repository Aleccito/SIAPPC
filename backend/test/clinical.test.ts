import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Notas SOAP e Historia Clínica General.
//
// Lo que se comprueba son las reglas que NO se ven en el esquema y que un
// refactor rompe sin que nada avise:
//
//   - una nota firmada deja de admitir ediciones,
//   - solo su autor la firma,
//   - y el acceso sale de `rol_permiso`, no del rol que trae el token: un rol
//     sin el módulo se queda fuera aunque tenga sesión válida.
//
// El admin sembrado no puede escribir historia clínica ni notas —la matriz le
// da solo lectura, ver db/seed.sql—, así que las pruebas crean sus propias
// cuentas de médico y de enfermería por la misma ruta que usa la interfaz.

const PACIENTE = {
  name: "Rita Ledezma",
  document: "C-SOAP-1",
  module: "KY-001",
  reason: "Disnea",
  hospitalId: 1,
  fechaNacimiento: "1971-03-02",
  sexo: "F",
} as const;

describe("Notas SOAP e Historia Clínica", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;
  let medico: Record<string, string>;
  let otroMedico: Record<string, string>;
  let enfermero: Record<string, string>;
  let administrativo: Record<string, string>;
  let pacienteId: string;

  /** Da de alta una cuenta con ese rol y devuelve su cabecera de sesión. */
  async function cuenta(role: string, email: string): Promise<Record<string, string>> {
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
    return authHeader(login.json().token as string);
  }

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));

    medico = await cuenta("medico", "medico1@institucion.org");
    otroMedico = await cuenta("medico", "medico2@institucion.org");
    enfermero = await cuenta("enfermero", "enfermera@institucion.org");
    administrativo = await cuenta("administrativo", "recepcion@institucion.org");

    const paciente = await app.inject({
      method: "POST",
      url: "/patients",
      headers: admin,
      payload: PACIENTE,
    });
    assert.equal(paciente.statusCode, 201, paciente.body);
    pacienteId = paciente.json().id;
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  const call = (
    method: "GET" | "POST" | "PUT" | "PATCH",
    url: string,
    headers: Record<string, string>,
    payload?: object,
  ) => app.inject({ method, url, headers, ...(payload ? { payload } : {}) });

  const nuevaNota = (extra: object = {}) => ({
    patientId: Number(pacienteId),
    subjective: "Refiere dolor torácico opresivo.",
    objective: "TA 150/95, FC 102.",
    assessment: "Angina inestable a descartar.",
    plan: "ECG y troponinas seriadas.",
    ...extra,
  });

  // --- Notas SOAP ----------------------------------------------------------

  it("el médico crea una nota en borrador y la firma; queda con autor y hora", async () => {
    const creada = await call("POST", "/soap/notes", medico, nuevaNota());
    assert.equal(creada.statusCode, 201, creada.body);
    assert.equal(creada.json().status, "borrador");
    assert.equal(creada.json().signedAt, null);
    assert.equal(creada.headers.location, `/soap/notes/${creada.json().id}`);

    const firmada = await call("POST", `/soap/notes/${creada.json().id}/sign`, medico);
    assert.equal(firmada.statusCode, 200, firmada.body);
    assert.equal(firmada.json().status, "firmada");
    assert.equal(firmada.json().signedById, firmada.json().authorId);
    assert.ok(firmada.json().signedAt);
  });

  it("una nota firmada rechaza PATCH y PUT con 409 y un motivo legible", async () => {
    const nota = (await call("POST", "/soap/notes", medico, nuevaNota({ sign: true }))).json();
    assert.equal(nota.status, "firmada");

    const patch = await call("PATCH", `/soap/notes/${nota.id}`, medico, { plan: "Otro plan" });
    assert.equal(patch.statusCode, 409, patch.body);
    assert.match(patch.json().error, /firmada/i);

    const put = await call("PUT", `/soap/notes/${nota.id}`, medico, {
      subjective: "s",
      objective: "o",
      assessment: "a",
      plan: "p",
    });
    assert.equal(put.statusCode, 409, put.body);

    // Y el texto sigue siendo el que se firmó.
    const leida = await call("GET", `/soap/notes/${nota.id}`, medico);
    assert.equal(leida.json().plan, "ECG y troponinas seriadas.");
  });

  it("solo el autor firma su nota: otro médico con el mismo permiso recibe 403", async () => {
    const nota = (await call("POST", "/soap/notes", medico, nuevaNota())).json();

    const ajeno = await call("POST", `/soap/notes/${nota.id}/sign`, otroMedico);
    assert.equal(ajeno.statusCode, 403, ajeno.body);
    assert.match(ajeno.json().error, /autor/i);

    // Y tampoco puede editar el borrador ajeno.
    const edicion = await call("PATCH", `/soap/notes/${nota.id}`, otroMedico, { plan: "x" });
    assert.equal(edicion.statusCode, 403, edicion.body);

    assert.equal((await call("POST", `/soap/notes/${nota.id}/sign`, medico)).statusCode, 200);
  });

  it("una nota firmada se corrige por addendum, que cuelga de la original", async () => {
    const nota = (await call("POST", "/soap/notes", medico, nuevaNota({ sign: true }))).json();

    const addendum = await call("POST", `/soap/notes/${nota.id}/addendum`, medico, {
      assessment: "Se corrige: troponinas negativas, se descarta angina.",
    });
    assert.equal(addendum.statusCode, 201, addendum.body);
    assert.equal(addendum.json().parentId, nota.id);
    // Nace firmado: una corrección sin responsable no es una corrección.
    assert.equal(addendum.json().status, "firmada");

    // El addendum de un addendum se aplana contra la nota raíz.
    const segundo = await call("POST", `/soap/notes/${addendum.json().id}/addendum`, otroMedico, {
      plan: "Alta con control en consulta.",
    });
    assert.equal(segundo.statusCode, 201, segundo.body);
    assert.equal(segundo.json().parentId, nota.id);
  });

  it("un borrador no admite addendum: se edita", async () => {
    const nota = (await call("POST", "/soap/notes", medico, nuevaNota())).json();
    const res = await call("POST", `/soap/notes/${nota.id}/addendum`, medico, { plan: "x" });
    assert.equal(res.statusCode, 409, res.body);
  });

  it("la lista de un paciente sale en orden inverso y con el total en la cabecera", async () => {
    const res = await call("GET", `/soap/notes?patientId=${pacienteId}`, medico);
    assert.equal(res.statusCode, 200);
    const notas = res.json();
    assert.ok(notas.length >= 2);
    assert.ok(Number(res.headers["x-total-count"]) === notas.length);

    const fechas = notas.map((nota: { at: string }) => Date.parse(nota.at));
    assert.deepEqual(fechas, [...fechas].sort((a: number, b: number) => b - a));

    // Sin addenda quedan solo las notas raíz.
    const raices = await call(
      "GET",
      `/soap/notes?patientId=${pacienteId}&includeAddenda=false`,
      medico,
    );
    assert.ok(raices.json().length < notas.length);
  });

  // --- Permisos, revalidados contra rol_permiso ------------------------------

  it("un rol sin el módulo no entra, ni a leer: administrativo recibe 403", async () => {
    // La sesión es válida —el mismo token lee la sala de espera— y aun así el
    // expediente y las notas quedan fuera: el corte lo pone `rol_permiso`.
    assert.equal((await call("GET", "/patients", administrativo)).statusCode, 200);

    assert.equal(
      (await call("GET", `/soap/notes?patientId=${pacienteId}`, administrativo)).statusCode,
      403,
    );
    assert.equal((await call("GET", `/historia/${pacienteId}`, administrativo)).statusCode, 403);
    assert.equal(
      (await call("POST", "/soap/notes", administrativo, nuevaNota())).statusCode,
      403,
    );
  });

  it("enfermería lee las notas pero no las escribe, y eso sale de la matriz", async () => {
    assert.equal(
      (await call("GET", `/soap/notes?patientId=${pacienteId}`, enfermero)).statusCode,
      200,
    );
    assert.equal((await call("POST", "/soap/notes", enfermero, nuevaNota())).statusCode, 403);
  });

  it("el administrador lee el expediente para auditarlo, pero no lo edita", async () => {
    assert.equal((await call("GET", `/historia/${pacienteId}`, admin)).statusCode, 200);
    const escritura = await call("POST", `/historia/${pacienteId}/alergias`, admin, {
      substance: "Penicilina",
    });
    assert.equal(escritura.statusCode, 403, escritura.body);
  });

  // --- Historia Clínica General ---------------------------------------------

  it("el médico escribe cada categoría del expediente y todas vuelven en el resumen", async () => {
    const altas: [string, object][] = [
      ["antecedentes", { type: "familiar", description: "Diabetes tipo 2", relationship: "madre" }],
      [
        "alergias",
        { substance: "Penicilina", reaction: "Urticaria", severity: "moderada", detectedOn: "2019-04-01" },
      ],
      ["medicamentos", { name: "Enalapril", dose: "10 mg", frequency: "cada 12 h" }],
      ["diagnosticos", { code: "I10", description: "Hipertensión esencial", type: "definitivo" }],
      ["hospitalizaciones", { reason: "Crisis hipertensiva", admittedOn: "2024-02-11" }],
      ["procedimientos", { name: "Ecocardiograma", performedOn: "2024-02-12" }],
      ["documentos", { type: "laboratorio", title: "Perfil lipídico" }],
    ];

    for (const [slug, payload] of altas) {
      const res = await call("POST", `/historia/${pacienteId}/${slug}`, medico, payload);
      assert.equal(res.statusCode, 201, `${slug}: ${res.body}`);
      assert.ok(res.json().id);
    }

    const resumen = await call("GET", `/historia/${pacienteId}`, medico);
    assert.equal(resumen.statusCode, 200, resumen.body);
    const expediente = resumen.json();
    for (const [slug] of altas) {
      assert.equal(expediente[slug].length, 1, slug);
    }
    // El documento queda como ficha sin archivo: la subida no existe todavía.
    assert.equal(expediente.documentos[0].hasFile, false);
  });

  it("la evolución sigue escribiéndose en la tabla historia_clinica de siempre", async () => {
    const creada = await call("POST", `/historia/${pacienteId}/evoluciones`, medico, {
      diagnosis: "Hipertensión controlada",
      treatment: "Continúa enalapril",
    });
    assert.equal(creada.statusCode, 201, creada.body);

    const lista = await call("GET", `/historia/${pacienteId}/evoluciones`, medico);
    assert.equal(lista.json().length, 1);
    assert.equal(lista.json()[0].diagnosis, "Hipertensión controlada");
  });

  it("enfermería sí escribe las observaciones del expediente", async () => {
    const res = await call("PATCH", `/historia/${pacienteId}/observaciones`, enfermero, {
      notes: "Paciente tolera la dieta; sin dolor en el turno.",
    });
    assert.equal(res.statusCode, 200, res.body);
    assert.match(res.json().notes, /tolera la dieta/);

    // Y no por eso puede tocar el resto del expediente.
    assert.equal(
      (await call("POST", `/historia/${pacienteId}/alergias`, enfermero, { substance: "Yodo" }))
        .statusCode,
      403,
    );
  });

  it("cada cambio del expediente queda con autor en el historial", async () => {
    const res = await call("GET", `/historia/${pacienteId}/cambios`, medico);
    assert.equal(res.statusCode, 200);
    const cambios = res.json();
    assert.ok(cambios.length >= 8);
    assert.ok(cambios.every((cambio: { authorName: string | null }) => cambio.authorName));
    assert.ok(cambios.some((cambio: { category: string }) => cambio.category === "observaciones"));
  });

  it("una categoría se modifica pero no se borra, y no por la URL de otro paciente", async () => {
    const alergia = (await call("GET", `/historia/${pacienteId}/alergias`, medico)).json()[0];

    const patch = await call(
      "PATCH",
      `/historia/${pacienteId}/alergias/${alergia.id}`,
      medico,
      { status: "descartada" },
    );
    assert.equal(patch.statusCode, 200, patch.body);
    assert.equal(patch.json().status, "descartada");

    // Ese id no existe en el expediente de otro paciente aunque exista la fila.
    const ajeno = await call("PATCH", `/historia/999999/alergias/${alergia.id}`, medico, {
      status: "activa",
    });
    assert.equal(ajeno.statusCode, 404, ajeno.body);
  });

  it("sin token no se llega ni al expediente ni a las notas", async () => {
    assert.equal(
      (await app.inject({ method: "GET", url: `/historia/${pacienteId}` })).statusCode,
      401,
    );
    assert.equal(
      (await app.inject({ method: "GET", url: `/soap/notes?patientId=${pacienteId}` })).statusCode,
      401,
    );
  });
});
