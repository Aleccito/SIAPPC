import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { Prisma } from "../../backend/src/generated/prisma/client.ts";
import { prisma } from "../../backend/src/lib/prisma.ts";
import {
  authHeader,
  closeConnections,
  countRows,
  flushRedis,
  loginAsAdmin,
  resetDatabase,
} from "./helpers.ts";

// Lo que se comprueba aquí es que crear una cuenta, suspenderla, reactivarla y
// registrar un paciente DEJAN RASTRO. Antes no lo dejaban: las rutas escribían
// en la base sin tocar `auditoria`, y nada en el código impedía volver a ese
// estado.

type AuditRow = { accion: string; entidad: string; registro_id: number; observacion: string | null };

async function auditFor(entidad: string, registroId: number | string): Promise<AuditRow[]> {
  return prisma.$queryRaw<AuditRow[]>`
    SELECT accion, entidad, registro_id, observacion FROM auditoria
    WHERE entidad = ${entidad} AND registro_id = ${Number(registroId)}
    ORDER BY auditoria_id
  `;
}

describe("bitácora de auditoría", () => {
  let app: FastifyInstance;
  let token: string;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    token = await loginAsAdmin(app);
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("crear un usuario escribe un INSERT con quién lo creó", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      headers: authHeader(token),
      payload: {
        name: "Nueva Enfermera",
        email: "nueva.enfermera@institucion.org",
        role: "enfermero",
      },
    });
    assert.equal(res.statusCode, 201);

    const created = res.json().user;
    const rows = await auditFor("usuario", created.id);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]!.accion, "INSERT");
    assert.match(rows[0]!.observacion!, /nueva\.enfermera@institucion\.org/);

    // La contraseña temporal viaja en la respuesta pero NO puede quedar
    // guardada en la bitácora, que ve cualquiera con permiso de auditoría.
    assert.doesNotMatch(rows[0]!.observacion!, new RegExp(res.json().tempPassword));
  });

  it("suspender y reactivar quedan distinguibles, no como un 'UPDATE' genérico", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/users",
      headers: authHeader(token),
      payload: { name: "Cuenta Temporal", email: "temporal@institucion.org", role: "medico" },
    });
    const id = created.json().user.id;

    for (const active of [false, true]) {
      const res = await app.inject({
        method: "PATCH",
        url: `/users/${id}`,
        headers: authHeader(token),
        payload: { active },
      });
      assert.equal(res.statusCode, 200);
    }

    const updates = (await auditFor("usuario", id)).filter((row) => row.accion === "UPDATE");
    assert.equal(updates.length, 2);
    assert.match(updates[0]!.observacion!, /suspendió/);
    assert.match(updates[1]!.observacion!, /reactivó/);
  });

  it("reenviar el mismo valor no ensucia la bitácora", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/users",
      headers: authHeader(token),
      payload: { name: "Sin Cambios", email: "sin.cambios@institucion.org", role: "medico" },
    });
    const id = created.json().user.id;

    // La cuenta ya nace activa: pedir active=true otra vez es un UPDATE real
    // contra la base que no cambia nada.
    const res = await app.inject({
      method: "PATCH",
      url: `/users/${id}`,
      headers: authHeader(token),
      payload: { active: true },
    });
    assert.equal(res.statusCode, 200);

    const updates = (await auditFor("usuario", id)).filter((row) => row.accion === "UPDATE");
    assert.equal(updates.length, 0);
  });

  it("registrar un paciente escribe un INSERT sin datos clínicos", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/patients",
      headers: authHeader(token),
      payload: {
        name: "Paciente Uno",
        document: "8-111-2222",
        reason: "Politraumatismo por accidente de tránsito",
        fechaNacimiento: "1990-05-14",
        sexo: "M",
      },
    });
    assert.equal(res.statusCode, 201);

    const rows = await auditFor("paciente", res.json().id);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]!.accion, "INSERT");
    assert.match(rows[0]!.observacion!, /Paciente Uno/);
    // El motivo de consulta es dato clínico y vive en `paciente`, no aquí.
    assert.doesNotMatch(rows[0]!.observacion!, /Politraumatismo/);
  });

  it("si no se puede auditar, el cambio NO se hace", async () => {
    // La prueba fuerte de la suite. Se esconde la tabla `auditoria` para que
    // recordAudit reviente, y se comprueba que el alta se deshace entera.
    //
    // Es la regresión realista: alguien envuelve el recordAudit en un try/catch
    // «para no tumbar la petición» y a partir de ahí hay altas sin rastro, que
    // es el agujero que esta tabla existe para tapar. Con el INSERT fallando
    // primero (correo duplicado) no se distingue nada: ahí recordAudit ni
    // siquiera llega a ejecutarse.
    await prisma.$executeRawUnsafe("RENAME TABLE auditoria TO auditoria_oculta");
    try {
      const res = await app.inject({
        method: "POST",
        url: "/users",
        headers: authHeader(token),
        payload: {
          name: "No Debe Existir",
          email: "no.debe.existir@institucion.org",
          role: "medico",
        },
      });
      assert.equal(res.statusCode, 500);
    } finally {
      await prisma.$executeRawUnsafe("RENAME TABLE auditoria_oculta TO auditoria");
    }

    const total = await countRows(
      Prisma.sql`FROM usuario WHERE email = ${"no.debe.existir@institucion.org"}`,
    );
    assert.equal(total, 0, "la cuenta se creó sin auditoría");
  });

  it("si el cambio falla, no queda renglón de auditoría suelto", async () => {
    // Segundo alta con el mismo correo: choca con el índice único y la
    // transacción se deshace. El renglón de auditoría se escribe DENTRO de esa
    // transacción, así que tiene que desaparecer con ella. Si alguien mueve el
    // recordAudit fuera del `beginTransaction`, esta prueba lo caza.
    const payload = {
      name: "Duplicada",
      email: "duplicada@institucion.org",
      role: "medico" as const,
    };
    const first = await app.inject({
      method: "POST",
      url: "/users",
      headers: authHeader(token),
      payload,
    });
    assert.equal(first.statusCode, 201);

    const before = await countRows(Prisma.sql`FROM auditoria`);

    const second = await app.inject({
      method: "POST",
      url: "/users",
      headers: authHeader(token),
      payload,
    });
    assert.equal(second.statusCode, 409);

    assert.equal(await countRows(Prisma.sql`FROM auditoria`), before);
  });
});
