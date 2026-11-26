import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { mensajeAsignacion, topicoAsignacion } from "../../backend/src/services/mqttAsignacion.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Monitor a pie de cama de un paciente (routes/devices.ts).
//
// `dispositivo.paciente_id` decide de qué paciente son las lecturas que ven el tablero, la central y el expediente.
// Lo que se comprueba es lo que el esquema no sostiene solo:
//
//   - un monitor es de un paciente a la vez (409), y cambiar de monitor libera el anterior;
//   - sin cama no hay monitor (409), y uno en mantenimiento no se asigna;
//   - el egreso y la cancelación del ingreso lo liberan;
//   - el administrativo asigna; el médico solo ve (403);
//   - el hospital acota paciente y monitor (404);
//   - y el aviso al equipo por MQTT no lleva datos que identifiquen al paciente.

const PACIENTE = { reason: "Fiebre y tos de 4 días", fechaNacimiento: "1961-04-10", sexo: "F" } as const;
const UNIDAD_UCI = 1;

describe("Monitor del paciente", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;
  let administrativo: Record<string, string>;
  let medico: Record<string, string>;
  let prisma: typeof import("../../backend/src/lib/prisma.ts").prisma;
  const monitor: Record<string, number> = {};

  async function cuenta(role: string, email: string): Promise<Record<string, string>> {
    const creada = await app.inject({ method: "POST", url: "/users", headers: admin, payload: { name: `Prueba ${email}`, email, role } });
    assert.equal(creada.statusCode, 201, creada.body);
    const login = await app.inject({ method: "POST", url: "/auth/login", payload: { email, password: creada.json().tempPassword } });
    assert.equal(login.statusCode, 200, login.body);
    return authHeader(login.json().token as string);
  }

  async function paciente(document: string, conCama: string | null): Promise<{ id: string; ingreso: string | null }> {
    const res = await app.inject({ method: "POST", url: "/patients", headers: administrativo, payload: { ...PACIENTE, name: `Paciente ${document}`, document } });
    assert.equal(res.statusCode, 201, res.body);
    const id = res.json().id as string;
    if (!conCama) return { id, ingreso: null };
    const cama = await app.inject({ method: "POST", url: "/beds", headers: administrativo, payload: { unitId: UNIDAD_UCI, code: conCama } });
    assert.equal(cama.statusCode, 201, cama.body);
    const ingreso = await app.inject({
      method: "POST",
      url: "/admissions",
      headers: administrativo,
      payload: { patientId: Number(id), bedId: Number(cama.json().id), reason: PACIENTE.reason },
    });
    assert.equal(ingreso.statusCode, 201, ingreso.body);
    return { id, ingreso: ingreso.json().id as string };
  }

  const asignar = (pacienteId: string, deviceId: number, headers = administrativo) =>
    app.inject({ method: "PUT", url: `/patients/${pacienteId}/device`, headers, payload: { deviceId } });

  async function libres(): Promise<string[]> {
    const res = await app.inject({ method: "GET", url: "/devices/free", headers: administrativo });
    assert.equal(res.statusCode, 200, res.body);
    return (res.json() as { code: string }[]).map((m) => m.code);
  }

  async function delPaciente(pacienteId: string): Promise<string | null> {
    const res = await app.inject({ method: "GET", url: `/patients/${pacienteId}/device`, headers: administrativo });
    assert.equal(res.statusCode, 200, res.body);
    return (res.json() as { monitor: { code: string } | null }).monitor?.code ?? null;
  }

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    ({ prisma } = await import("../../backend/src/lib/prisma.ts"));
    admin = authHeader(await loginAsAdmin(app));
    administrativo = await cuenta("administrativo", "admision.monitores@institucion.org");
    medico = await cuenta("medico", "medico.monitores@institucion.org");

    const hospital = await prisma.hospital.findFirstOrThrow({ select: { hospital_id: true } });
    for (const [codigo, estado] of [
      ["MON-A", "inactivo"],
      ["MON-B", "activo"],
      ["MON-C", "mantenimiento"],
    ] as const) {
      const d = await prisma.dispositivo.create({ data: { hospital_id: hospital.hospital_id, codigo, estado, modelo: "Monitor de prueba" } });
      monitor[codigo] = d.dispositivo_id;
    }
    const ajeno = await prisma.hospital.create({ data: { nombre: "Hospital Ajeno Monitores" } });
    const d = await prisma.dispositivo.create({ data: { hospital_id: ajeno.hospital_id, codigo: "MON-AJENO" } });
    monitor["MON-AJENO"] = d.dispositivo_id;
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("lista los libres del hospital, sin los de mantenimiento ni los ajenos", async () => {
    assert.deepEqual(await libres(), ["MON-A", "MON-B"]);
  });

  it("sin cama no se asigna (409)", async () => {
    const p = await paciente("MON-0001", null);
    const res = await asignar(p.id, monitor["MON-A"]);
    assert.equal(res.statusCode, 409, res.body);
    assert.match(res.json().error ?? res.json().message ?? res.body, /cama/);
  });

  it("asigna, lo saca de los libres y se ve en el paciente", async () => {
    const p = await paciente("MON-0002", "MON-C01");
    const res = await asignar(p.id, monitor["MON-A"]);
    assert.equal(res.statusCode, 200, res.body);
    assert.equal(res.json().code, "MON-A");
    assert.equal(await delPaciente(p.id), "MON-A");
    assert.deepEqual(await libres(), ["MON-B"]);
  });

  it("un monitor ocupado no se le da a otro (409)", async () => {
    const otro = await paciente("MON-0003", "MON-C02");
    const res = await asignar(otro.id, monitor["MON-A"]);
    assert.equal(res.statusCode, 409, res.body);
  });

  it("uno en mantenimiento no se asigna (409) y uno de otro hospital no existe (404)", async () => {
    const p = await paciente("MON-0004", "MON-C03");
    assert.equal((await asignar(p.id, monitor["MON-C"])).statusCode, 409);
    assert.equal((await asignar(p.id, monitor["MON-AJENO"])).statusCode, 404);
  });

  it("el médico ve el monitor pero no lo asigna (403)", async () => {
    const p = await paciente("MON-0005", "MON-C04");
    assert.equal((await asignar(p.id, monitor["MON-B"], medico)).statusCode, 403);
    const ver = await app.inject({ method: "GET", url: `/patients/${p.id}/device`, headers: medico });
    assert.equal(ver.statusCode, 200, ver.body);
  });

  it("cambiar de monitor libera el anterior en el mismo paso", async () => {
    const p = await paciente("MON-0006", "MON-C05");
    assert.equal((await asignar(p.id, monitor["MON-B"])).statusCode, 200);
    // Libero MON-A del paciente MON-0002 para tener uno libre con qué cambiar.
    const dos = await prisma.paciente.findFirstOrThrow({ where: { cedula: "MON-0002" }, select: { paciente_id: true } });
    const liberar = await app.inject({ method: "DELETE", url: `/patients/${dos.paciente_id}/device`, headers: administrativo });
    assert.equal(liberar.statusCode, 204, liberar.body);
    assert.deepEqual(await libres(), ["MON-A"]);

    assert.equal((await asignar(p.id, monitor["MON-A"])).statusCode, 200);
    assert.equal(await delPaciente(p.id), "MON-A");
    assert.deepEqual(await libres(), ["MON-B"]);
  });

  it("liberar sin monitor responde 404", async () => {
    const p = await paciente("MON-0007", "MON-C06");
    const res = await app.inject({ method: "DELETE", url: `/patients/${p.id}/device`, headers: administrativo });
    assert.equal(res.statusCode, 404, res.body);
  });

  it("el egreso libera el monitor", async () => {
    const p = await paciente("MON-0008", "MON-C07");
    assert.equal((await asignar(p.id, monitor["MON-B"])).statusCode, 200);
    const egreso = await app.inject({ method: "POST", url: `/admissions/${p.ingreso}/discharge`, headers: administrativo, payload: {} });
    assert.equal(egreso.statusCode, 200, egreso.body);
    assert.equal(await delPaciente(p.id), null);
    assert.ok((await libres()).includes("MON-B"));
  });

  it("cancelar el ingreso libera el monitor", async () => {
    const p = await paciente("MON-0009", "MON-C08");
    assert.equal((await asignar(p.id, monitor["MON-B"])).statusCode, 200);
    const cancelar = await app.inject({ method: "PATCH", url: `/admissions/${p.ingreso}`, headers: administrativo, payload: { state: "cancelado" } });
    assert.equal(cancelar.statusCode, 200, cancelar.body);
    assert.equal(await delPaciente(p.id), null);
  });

  it("cada cambio queda en la bitácora", async () => {
    const n = await prisma.auditoria.count({ where: { entidad: "dispositivo" } });
    // asignar ×4 y liberar ×4 (a mano, por cambio, por egreso y por cancelación).
    assert.ok(n >= 8, `se esperaban al menos 8 renglones y hay ${n}`);
  });

  it("el administrativo ve el personal clínico para ponerlo a cargo (sin correo ni teléfono)", async () => {
    // GET /users le da 403: sin esta lista, su diálogo "Personal a cargo" salía vacío.
    assert.equal((await app.inject({ method: "GET", url: "/users", headers: administrativo })).statusCode, 403);
    const res = await app.inject({ method: "GET", url: "/patients/care-staff", headers: administrativo });
    assert.equal(res.statusCode, 200, res.body);
    const lista = res.json() as Array<Record<string, unknown>>;
    assert.ok(lista.some((u) => u.name === "Prueba medico.monitores@institucion.org" && u.role === "medico"));
    assert.ok(lista.every((u) => u.role === "medico" || u.role === "enfermero"));
    assert.deepEqual(Object.keys(lista[0]).sort(), ["id", "name", "role", "roleLabel", "unit"]);
  });

  it("el aviso al monitor no identifica al paciente", () => {
    assert.equal(topicoAsignacion("DEMO-DEV-16"), "siappc/DEMO-DEV-16/asignacion");
    assert.deepEqual(mensajeAsignacion("DEMO-DEV-16", null), { device: "DEMO-DEV-16", asignado: false });
    const aviso = mensajeAsignacion("DEMO-DEV-16", {
      motivoConsulta: "  ",
      motivoIngreso: "Fiebre y tos",
      diagnosticos: [{ descripcion: "Neumonía", cie10: "J18.9" }, { descripcion: "Hipertensión", cie10: null }],
    });
    assert.deepEqual(aviso, { device: "DEMO-DEV-16", asignado: true, motivo: "Fiebre y tos", diagnosticos: ["Neumonía [J18.9]", "Hipertensión"] });
    assert.deepEqual(Object.keys(aviso).sort(), ["asignado", "device", "diagnosticos", "motivo"]);
  });
});
