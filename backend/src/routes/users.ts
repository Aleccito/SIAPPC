import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { badRequest, conflict, notFound, parseOr400 } from "../lib/http.ts";
import { hashPassword } from "../lib/passwords.ts";
import type { ActivityEntry, User } from "../types.ts";

// Las mismas relaciones en todas las consultas de usuario: el rol da la
// etiqueta que se ve en pantalla y la unidad su nombre. Se exporta porque
// routes/auth.ts devuelve el mismo objeto tras iniciar sesión.
export const USER_INCLUDE = {
  rol: { select: { nombre: true, etiqueta: true } },
  unidad: { select: { nombre: true } },
} as const;

export type UsuarioConRelaciones = {
  usuario_id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  ultimo_acceso: Date | null;
  activo: boolean;
  rol: { nombre: string; etiqueta: string };
  unidad: { nombre: string } | null;
};

export function toUser(row: UsuarioConRelaciones): User {
  return {
    id: String(row.usuario_id),
    name: row.nombre,
    email: row.email,
    role: row.rol.nombre,
    roleLabel: row.rol.etiqueta,
    unit: row.unidad?.nombre ?? null,
    phone: row.telefono,
    active: row.activo,
    lastActivity: row.ultimo_acceso ? row.ultimo_acceso.toISOString() : null,
  };
}

const createUserSchema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email().max(150),
  phone: z.string().max(30).optional(),
  role: z.string().min(1),
  unitId: z.number().int().positive().optional(),
  // Sin `hospitalId`: la cuenta nueva nace en el hospital de quien la crea, y
  // eso lo pone `authenticate` desde la sesión (ver src/plugins/auth.ts). Un
  // administrador no da de alta personal de otro hospital desde su pantalla.
});

const updateUserSchema = z.object({
  role: z.string().min(1).optional(),
  unitId: z.number().int().positive().nullable().optional(),
  active: z.boolean().optional(),
});

const activityQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(30),
});

// Contraseña temporal: el administrador la entrega a mano. Se muestra una sola
// vez en la respuesta de creación y no se guarda en claro en ningún lado.
// PENDIENTE: cuando exista servicio de correo, enviarla por ahí en su lugar.
function generateTempPassword(): string {
  return randomBytes(9).toString("base64url");
}

async function findRoleId(role: string): Promise<number> {
  const row = await prisma.rol.findFirst({
    where: { nombre: role, activo: true },
    select: { rol_id: true },
  });
  if (!row) throw badRequest(`Rol '${role}' no existe`);
  return row.rol_id;
}

// Acotada al hospital de quien pregunta: por aquí pasan la ficha, la edición y
// la suspensión, así que una cuenta de otro hospital no se lee ni se toca.
// Responde 404 y no 403 por lo mismo que en /patients: "existe pero no es
// tuyo" ya confirma que ese correo está dado de alta en algún sitio.
async function findUser(id: number, hospitalId: number): Promise<UsuarioConRelaciones> {
  const row = await prisma.usuario.findFirst({
    where: { usuario_id: id, hospital_id: hospitalId },
    include: USER_INCLUDE,
  });
  if (!row) throw notFound("Usuario no encontrado");
  return row;
}

/**
 * Corta la operación si deja el sistema sin ningún administrador activo.
 *
 * Suspender o dar de baja al último no se puede revertir desde la interfaz: no
 * quedaría nadie con permiso para reactivarlo.
 */
async function assertNotLastAdmin(userId: number): Promise<void> {
  const otros = await prisma.usuario.count({
    where: { rol: { nombre: "admin" }, activo: true, usuario_id: { not: userId } },
  });
  if (otros === 0) {
    throw conflict("No puede suspender al último administrador");
  }
}

// Los usuarios NO pasan por la fábrica de CRUD (lib/crud.ts): el alta genera y
// devuelve una contraseña temporal, la baja tiene que comprobar que no sea el
// último administrador, y la bitácora dice qué cambió y no solo que cambió.
// Nada de eso cabe en una configuración declarativa, y meterlo a la fuerza
// convertiría la fábrica en un caso especial por recurso.
export default async function usersRoutes(app: FastifyInstance) {
  // Cada ruta re-verifica el permiso en el servidor, sin importar que la
  // pantalla ya se hubiera bloqueado en el navegador.
  app.addHook("preHandler", app.authenticate);

  app.get("/users", { preHandler: [app.requirePermission("usuarios", "ver")] }, async (req) => {
    // Solo el personal de este hospital. El permiso `usuarios` dice que puedes
    // administrar cuentas; no dice de cuál institución.
    const rows = await prisma.usuario.findMany({
      where: { hospital_id: req.hospitalId },
      include: USER_INCLUDE,
      orderBy: { nombre: "asc" },
    });
    return rows.map(toUser);
  });

  app.get(
    "/users/:id",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async (req) => {
      const { id } = parseOr400(z.object({ id: z.coerce.number().int().positive() }), req.params);
      return toUser(await findUser(id, req.hospitalId));
    },
  );

  app.post(
    "/users",
    { preHandler: [app.requirePermission("usuarios", "crear")] },
    async (req, reply) => {
      const { name, email, phone, role, unitId } = parseOr400(createUserSchema, req.body);

      const rolId = await findRoleId(role);

      const tempPassword = generateTempPassword();
      // El hash se calcula antes de abrir la transacción: bcrypt tarda del
      // orden de decenas de milisegundos y no hay razón para tener una
      // transacción abierta mientras tanto.
      const passwordHash = await hashPassword(tempPassword);

      // Alta y bitácora en la misma transacción: dar de alta una cuenta sin
      // dejar constancia de quién la creó es exactamente el rastro que no puede
      // faltar. Si no se puede registrar, no se crea.
      const created = await prisma.$transaction(async (tx) => {
        const row = await tx.usuario.create({
          data: {
            hospital_id: req.hospitalId,
            rol_id: rolId,
            unidad_id: unitId ?? null,
            nombre: name,
            tipo_personal: role,
            email,
            telefono: phone ?? null,
            password_hash: passwordHash,
          },
          include: USER_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "usuario",
          registroId: row.usuario_id,
          accion: "INSERT",
          // Sin la contraseña temporal ni el hash: la bitácora la puede leer
          // cualquiera con permiso de auditoría, y no es donde se guardan
          // credenciales.
          observacion: `creó la cuenta ${email} con rol ${role}`,
        });

        return row;
      });

      reply.header("Location", `/users/${created.usuario_id}`);
      // La contraseña viaja una única vez, aquí. No hay forma de recuperarla
      // después: si se pierde, se genera otra.
      return reply.code(201).send({ user: toUser(created), tempPassword });
    },
  );

  // Historial de actividad de una cuenta, desde `auditoria`. Filtra por
  // `usuario_id`, que es QUIEN ejecutó la acción: aquí salen las cosas que hizo
  // esta cuenta, no las que le hicieron a ella. Para eso último se consulta
  // `GET /audit` por entidad y registro.
  app.get(
    "/users/:id/activity",
    { preHandler: [app.requirePermission("auditoria", "ver")] },
    async (req) => {
      const { id } = parseOr400(z.object({ id: z.coerce.number().int().positive() }), req.params);
      const { days } = parseOr400(activityQuerySchema, req.query);

      // Que la cuenta sea de este hospital se comprueba ANTES de leer su
      // actividad: si no, un identificador ajeno devolvía la bitácora de
      // personal de otra institución, que es lo mismo que /audit sin filtro
      // pero por la puerta de al lado.
      await findUser(id, req.hospitalId);

      // La ventana se calcula contra el reloj de la base y no el de Node: los
      // dos procesos pueden estar en zonas distintas y la bitácora se guarda
      // con la hora del servidor de base de datos.
      const rows = await prisma.$queryRaw<
        {
          auditoria_id: bigint;
          entidad: string;
          accion: string;
          fecha_hora: Date;
          observacion: string | null;
        }[]
      >`
        SELECT auditoria_id, entidad, accion, fecha_hora, observacion
        FROM auditoria
        WHERE usuario_id = ${id} AND fecha_hora >= NOW() - INTERVAL ${days} DAY
        ORDER BY fecha_hora DESC
        LIMIT 100
      `;

      return rows.map(
        (row): ActivityEntry => ({
          id: String(row.auditoria_id),
          entity: row.entidad,
          action: row.accion,
          at: new Date(row.fecha_hora).toISOString(),
          note: row.observacion,
        }),
      );
    },
  );

  app.patch(
    "/users/:id",
    { preHandler: [app.requirePermission("usuarios", "editar")] },
    async (req) => {
      const { id } = parseOr400(z.object({ id: z.coerce.number().int().positive() }), req.params);
      const { role, unitId, active } = parseOr400(updateUserSchema, req.body);

      // Se lee la cuenta ANTES de tocarla: la bitácora necesita a quién se le
      // aplicó el cambio, y después del UPDATE ya no se sabe cómo estaba. De
      // paso, un id inexistente se corta aquí en vez de tras un UPDATE que no
      // afectó ningún renglón.
      const target = await findUser(id, req.hospitalId);

      const data: Record<string, unknown> = {};
      // Qué se cambió, en prosa, que es como la pantalla de Auditoría muestra
      // `observacion` (ver routes/audit.ts).
      const changes: string[] = [];

      if (role !== undefined) {
        data.rol_id = await findRoleId(role);
        if (role !== target.rol.nombre) {
          changes.push(`cambió el rol de ${target.rol.nombre} a ${role}`);
        }
      }
      if (unitId !== undefined) {
        data.unidad_id = unitId;
        changes.push(unitId === null ? "quitó la unidad" : "cambió la unidad");
      }
      if (active !== undefined) {
        if (!active) await assertNotLastAdmin(id);
        data.activo = active;
        if (active !== target.activo) {
          changes.push(active ? "reactivó la cuenta" : "suspendió la cuenta");
        }
      }

      if (Object.keys(data).length === 0) {
        throw badRequest("Nada que actualizar");
      }

      // Cambio y bitácora en la misma transacción: una suspensión sin rastro de
      // quién la ordenó es justo lo que no puede pasar.
      return prisma.$transaction(async (tx) => {
        const updated = await tx.usuario.update({
          where: { usuario_id: id },
          data,
          include: USER_INCLUDE,
        });

        // `changes` queda vacío cuando la petición reenvía los valores que ya
        // tenía la cuenta. El UPDATE es real pero no cambió nada, y anotar
        // "actualizó" sin decir qué solo ensucia la bitácora.
        if (changes.length) {
          await recordAudit(tx, {
            actorId: req.user.sub,
            entidad: "usuario",
            registroId: id,
            accion: "UPDATE",
            // Guion en vez de "de": con "cambió el rol de X a Y" pegado a "de
            // <correo>" salían dos "de" seguidos y no se entendía a quién.
            observacion: `${changes.join("; ")} — ${target.email}`,
          });
        }

        return toUser(updated);
      });
    },
  );

  // Baja lógica, no DELETE real: la cuenta aparece como autora de renglones de
  // `auditoria` y como responsable de historias clínicas, y borrarla dejaría
  // esos registros sin dueño.
  app.delete(
    "/users/:id",
    { preHandler: [app.requirePermission("usuarios", "eliminar")] },
    async (req, reply) => {
      const { id } = parseOr400(z.object({ id: z.coerce.number().int().positive() }), req.params);
      const target = await findUser(id, req.hospitalId);
      await assertNotLastAdmin(id);

      await prisma.$transaction(async (tx) => {
        await tx.usuario.update({ where: { usuario_id: id }, data: { activo: false } });
        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "usuario",
          registroId: id,
          accion: "DELETE",
          observacion: `dio de baja la cuenta ${target.email}`,
        });
      });

      return reply.code(204).send();
    },
  );
}
