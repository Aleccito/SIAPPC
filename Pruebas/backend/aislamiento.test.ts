import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { deviceDelTopic } from "../../backend/src/services/mqttIngest.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Aislamiento entre hospitales en lo clínico y en la telemetría.
//
// Se siembra un segundo hospital con un paciente, una nota SOAP, un equipo y
// una lectura, y se comprueba que la sesión del admin (hospital sembrado) no
// alcanza nada de eso cambiando ids en la URL. 404 y no 403: un 403 confirmaría
// que el id existe en otro hospital.

describe("Aislamiento entre hospitales", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;
  let pacienteAjeno: number;
  let notaAjena: bigint;
  const EQUIPO_AJENO = "EQ-AJENO-1";

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));

    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const hospital = await prisma.hospital.create({ data: { nombre: "Hospital Ajeno" } });
    const paciente = await prisma.paciente.create({
      data: {
        hospital_id: hospital.hospital_id,
        nombre: "Paciente Ajeno",
        cedula: "C-AJENO-1",
        fecha_nacimiento: new Date("1980-01-01"),
        sexo: "M",
      },
    });
    pacienteAjeno = paciente.paciente_id;

    const autor = await prisma.usuario.findFirstOrThrow({ select: { usuario_id: true } });
    const nota = await prisma.notaSoap.create({
      data: { paciente_id: pacienteAjeno, usuario_id: autor.usuario_id, subjetivo: "secreto clínico" },
    });
    notaAjena = nota.nota_id;

    await prisma.variable.upsert({
      where: { codigo: "fc_aislamiento" },
      update: {},
      create: { codigo: "fc_aislamiento", unidad: "lpm" },
    });
    const equipo = await prisma.dispositivo.create({
      data: { hospital_id: hospital.hospital_id, codigo: EQUIPO_AJENO },
    });
    const sensor = await prisma.sensor.create({
      data: { dispositivo_id: equipo.dispositivo_id, variable_medida: "fc_aislamiento" },
    });
    await prisma.lectura.create({
      data: { sensor_id: sensor.sensor_id, valor: 77, hash_sha256: "a".repeat(64) },
    });
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  for (const ruta of ["", "/evoluciones", "/cambios", "/exploracion-fisica", "/alergias"]) {
    it(`GET /historia/:id${ruta} de otro hospital da 404`, async () => {
      const res = await app.inject({ method: "GET", url: `/historia/${pacienteAjeno}${ruta}`, headers: admin });
      assert.equal(res.statusCode, 404, res.body);
    });
  }

  it("no se escriben observaciones en el expediente de otro hospital", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/historia/${pacienteAjeno}/observaciones`,
      headers: admin,
      payload: { notes: "intrusión" },
    });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("la lista de notas SOAP de un paciente ajeno da 404", async () => {
    const res = await app.inject({ method: "GET", url: `/soap/notes?patientId=${pacienteAjeno}`, headers: admin });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("una nota SOAP ajena por id da 404", async () => {
    const res = await app.inject({ method: "GET", url: `/soap/notes/${notaAjena}`, headers: admin });
    assert.equal(res.statusCode, 404, res.body);
    assert.ok(!res.body.includes("secreto clínico"));
  });

  it("las lecturas de sensores no incluyen equipos de otro hospital", async () => {
    const res = await app.inject({ method: "GET", url: `/sensors/readings?device=${EQUIPO_AJENO}`, headers: admin });
    assert.equal(res.statusCode, 200, res.body);
    assert.deepEqual(res.json(), []);
  });

  it("las alertas de sensores tampoco", async () => {
    const res = await app.inject({ method: "GET", url: `/sensors/alerts?device=${EQUIPO_AJENO}`, headers: admin });
    assert.equal(res.statusCode, 200, res.body);
    assert.deepEqual(res.json(), []);
  });
});

describe("MQTT: equipo según el topic", () => {
  it("saca el equipo del segmento antes del último", () => {
    assert.equal(deviceDelTopic("siappc/CAMA-01/telemetry"), "CAMA-01");
    assert.equal(deviceDelTopic("siappc/CAMA-01/waveform"), "CAMA-01");
  });

  it("devuelve null con un topic sin equipo", () => {
    assert.equal(deviceDelTopic("telemetry"), null);
    assert.equal(deviceDelTopic("siappc//telemetry"), null);
  });
});
