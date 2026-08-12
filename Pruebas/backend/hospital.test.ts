import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// De qué hospital es cada registro.
//
// La regla: lo decide la SESIÓN, nunca el cuerpo de la petición. Antes las tres
// altas —paciente, unidad y cuenta— aceptaban `hospitalId` del cliente, con un
// `1` fijo escrito en el frontend. Eso hacía dos cosas malas a la vez: fijaba
// el despliegue a un solo hospital, y dejaba que una petición hecha a mano
// escribiera en cualquier otro con solo cambiar el número.
//
// Estas pruebas mandan `hospitalId` a propósito, con un valor que no es el de
// la sesión, y comprueban que el servidor lo ignora.

const OTRO_HOSPITAL = 999;

const PACIENTE = {
  module: "KY-001",
  reason: "Prueba de hospital",
  fechaNacimiento: "1990-04-04",
  sexo: "F",
} as const;

describe("El hospital sale de la sesión", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  /** El hospital de la cuenta sembrada por db/seed.sql. */
  async function hospitalDelAdmin(): Promise<number> {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const cuenta = await prisma.usuario.findFirst({
      where: { email: "admin@institucion.org" },
      select: { hospital_id: true },
    });
    return cuenta!.hospital_id;
  }

  it("un paciente nace en el hospital de quien lo registra, no en el que pida el cliente", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/patients",
      headers: admin,
      payload: {
        ...PACIENTE,
        name: "Elena Bravo",
        document: "C-HOSP-1",
        // Ruido deliberado: el esquema ya no declara este campo, así que zod lo
        // descarta y el servidor pone el suyo.
        hospitalId: OTRO_HOSPITAL,
      },
    });
    assert.equal(res.statusCode, 201, res.body);

    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const paciente = await prisma.paciente.findFirst({
      where: { cedula: "C-HOSP-1" },
      select: { hospital_id: true },
    });

    assert.equal(paciente!.hospital_id, await hospitalDelAdmin());
    assert.notEqual(paciente!.hospital_id, OTRO_HOSPITAL);
  });

  it("una unidad nueva también, aunque el cuerpo diga otra cosa", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/units",
      headers: admin,
      payload: { name: "Quirófano 2", hospitalId: OTRO_HOSPITAL },
    });
    assert.equal(res.statusCode, 201, res.body);

    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const unidad = await prisma.unidad.findFirst({
      where: { nombre: "Quirófano 2" },
      select: { hospital_id: true },
    });

    assert.equal(unidad!.hospital_id, await hospitalDelAdmin());
  });

  it("una cuenta nueva hereda el hospital de quien la crea", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      headers: admin,
      payload: {
        name: "Rosa Delgado",
        email: "rosa@institucion.org",
        role: "enfermero",
        hospitalId: OTRO_HOSPITAL,
      },
    });
    assert.equal(res.statusCode, 201, res.body);

    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const cuenta = await prisma.usuario.findFirst({
      where: { email: "rosa@institucion.org" },
      select: { hospital_id: true },
    });

    assert.equal(cuenta!.hospital_id, await hospitalDelAdmin());
  });

  describe("aislamiento entre hospitales", () => {
    let ajenoPacienteId: number;

    before(async () => {
      const { prisma } = await import("../../backend/src/lib/prisma.ts");

      // Un segundo hospital, con su unidad y su paciente. Nadie de la sesión
      // actual debería verlo por ninguna ruta.
      const otro = await prisma.hospital.create({
        data: { nombre: "Hospital Vecino" },
        select: { hospital_id: true },
      });
      await prisma.unidad.create({
        data: { hospital_id: otro.hospital_id, nombre: "UCI Vecina" },
      });
      const paciente = await prisma.paciente.create({
        data: {
          hospital_id: otro.hospital_id,
          nombre: "Paciente Ajeno",
          cedula: "C-AJENO-1",
          fecha_nacimiento: new Date("1975-06-06"),
          sexo: "M",
        },
        select: { paciente_id: true },
      });
      ajenoPacienteId = paciente.paciente_id;
    });

    it("la lista de pacientes no incluye los de otro hospital", async () => {
      const res = await app.inject({ method: "GET", url: "/patients", headers: admin });
      assert.equal(res.statusCode, 200, res.body);

      const cedulas = (res.json() as { document: string }[]).map((p) => p.document);
      assert.ok(!cedulas.includes("C-AJENO-1"), "no debe aparecer el paciente ajeno");

      // Y el total de la cabecera cuenta lo mismo que se devolvió: si contara
      // sin filtro, la paginación mostraría páginas vacías.
      assert.equal(res.headers["x-total-count"], String(cedulas.length));
    });

    it("pedir por id un paciente de otro hospital responde 404, no 403", async () => {
      // 404 y no 403 a propósito: "existe pero no es tuyo" ya confirma que esa
      // persona está registrada en algún sitio.
      const res = await app.inject({
        method: "GET",
        url: `/patients/${ajenoPacienteId}`,
        headers: admin,
      });
      assert.equal(res.statusCode, 404, res.body);
    });

    it("tampoco se puede editar ni dar de baja", async () => {
      const patch = await app.inject({
        method: "PATCH",
        url: `/patients/${ajenoPacienteId}`,
        headers: admin,
        payload: { reason: "intento" },
      });
      assert.equal(patch.statusCode, 404, patch.body);

      const baja = await app.inject({
        method: "DELETE",
        url: `/patients/${ajenoPacienteId}`,
        headers: admin,
      });
      assert.equal(baja.statusCode, 404, baja.body);
    });

    it("no se puede admitir a un paciente de otro hospital", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: admin,
        payload: { patientId: ajenoPacienteId, reason: "no deberia" },
      });
      assert.equal(res.statusCode, 404, res.body);
    });

    it("la lista de usuarios no incluye personal de otro hospital", async () => {
      const { prisma } = await import("../../backend/src/lib/prisma.ts");
      const otro = await prisma.hospital.findFirst({
        where: { nombre: "Hospital Vecino" },
        select: { hospital_id: true },
      });
      const rol = await prisma.rol.findFirst({
        where: { nombre: "enfermero" },
        select: { rol_id: true },
      });
      await prisma.usuario.create({
        data: {
          hospital_id: otro!.hospital_id,
          rol_id: rol!.rol_id,
          nombre: "Enfermera Ajena",
          tipo_personal: "enfermero",
          email: "ajena@vecino.org",
          password_hash: "$2a$10$0000000000000000000000000000000000000000000000000000",
        },
      });

      const res = await app.inject({ method: "GET", url: "/users", headers: admin });
      assert.equal(res.statusCode, 200, res.body);
      const correos = (res.json() as { email: string }[]).map((u) => u.email);
      assert.ok(!correos.includes("ajena@vecino.org"), "no debe aparecer personal ajeno");
    });

    it("la ficha y la actividad de una cuenta ajena responden 404", async () => {
      const { prisma } = await import("../../backend/src/lib/prisma.ts");
      const ajena = await prisma.usuario.findFirst({
        where: { email: "ajena@vecino.org" },
        select: { usuario_id: true },
      });

      const ficha = await app.inject({
        method: "GET",
        url: `/users/${ajena!.usuario_id}`,
        headers: admin,
      });
      assert.equal(ficha.statusCode, 404, ficha.body);

      const actividad = await app.inject({
        method: "GET",
        url: `/users/${ajena!.usuario_id}/activity?days=30`,
        headers: admin,
      });
      assert.equal(actividad.statusCode, 404, actividad.body);
    });

    it("la bitácora no muestra acciones de otro hospital, pero sí los bloqueos sin cuenta", async () => {
      const { prisma } = await import("../../backend/src/lib/prisma.ts");
      const ajena = await prisma.usuario.findFirst({
        where: { email: "ajena@vecino.org" },
        select: { usuario_id: true },
      });

      await prisma.auditoria.create({
        data: {
          usuario_id: ajena!.usuario_id,
          entidad: "paciente",
          registro_id: BigInt(1),
          accion: "INSERT",
          observacion: "accion del hospital vecino",
        },
      });

      // Bloqueo de un correo que no existe: sin cuenta, y por tanto sin
      // hospital. Tiene que seguir viéndose.
      await prisma.auditoria.create({
        data: {
          usuario_id: null,
          entidad: "usuario",
          registro_id: BigInt(0),
          accion: "LOGIN_BLOCKED",
          observacion: JSON.stringify({ ip: "10.0.0.9", email: "nadie@ninguna.org" }),
        },
      });

      const res = await app.inject({
        method: "GET",
        url: "/audit?pageSize=100",
        headers: admin,
      });
      assert.equal(res.statusCode, 200, res.body);

      const notas = (res.json().entries as { note: string | null }[]).map((e) => e.note ?? "");
      assert.ok(
        !notas.some((n) => n.includes("accion del hospital vecino")),
        "no debe verse la acción del otro hospital",
      );
      assert.ok(
        notas.some((n) => n.includes("nadie@ninguna.org")),
        "el bloqueo sin cuenta sí tiene que verse",
      );
    });

    it("las unidades y la ocupación son solo las de este hospital", async () => {
      const unidades = await app.inject({ method: "GET", url: "/units", headers: admin });
      assert.equal(unidades.statusCode, 200, unidades.body);
      const nombres = (unidades.json() as { name: string }[]).map((u) => u.name);
      assert.ok(!nombres.includes("UCI Vecina"), "no debe aparecer la unidad ajena");

      const ocupacion = await app.inject({
        method: "GET",
        url: "/beds/occupancy",
        headers: admin,
      });
      assert.equal(ocupacion.statusCode, 200, ocupacion.body);
      const unidadesOcupacion = (ocupacion.json() as { unit: string }[]).map((u) => u.unit);
      assert.ok(!unidadesOcupacion.includes("UCI Vecina"));
    });
  });

  it("el hospital de un paciente no se cambia por PATCH", async () => {
    // Mover a un paciente de hospital sería un traslado —un acto con su propio
    // registro—, no una edición de la ficha. `toUpdateData` no toca la columna.
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const antes = await prisma.paciente.findFirst({
      where: { cedula: "C-HOSP-1" },
      select: { paciente_id: true, hospital_id: true },
    });

    const res = await app.inject({
      method: "PATCH",
      url: `/patients/${antes!.paciente_id}`,
      headers: admin,
      payload: { reason: "Corregido", hospitalId: OTRO_HOSPITAL },
    });
    assert.equal(res.statusCode, 200, res.body);

    const despues = await prisma.paciente.findUnique({
      where: { paciente_id: antes!.paciente_id },
      select: { hospital_id: true },
    });
    assert.equal(despues!.hospital_id, antes!.hospital_id);
  });
});
