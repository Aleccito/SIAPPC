import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { hashPassword } from "../lib/passwords.ts";
import type { ActivityEntry, AuditoriaRow, UsuarioRow, User } from "../types.ts";

function toUser(row: UsuarioRow): User {
  return {
    id: String(row.usuario_id),
    name: row.nombre,
    email: row.email,
    role: row.rol_nombre,
    roleLabel: row.rol_etiqueta,
    unit: row.unidad_nombre,
    phone: row.telefono,
    active: Boolean(row.activo),
    lastActivity: row.ultimo_acceso ? new Date(row.ultimo_acceso).toISOString() : null,
  };
}

const SELECT_USER = `
  SELECT u.usuario_id, u.nombre, u.email, u.telefono, u.ultimo_acceso, u.activo,
         r.nombre AS rol_nombre, r.etiqueta AS rol_etiqueta,
         un.nombre AS unidad_nombre
  FROM usuario u
  JOIN rol r ON r.rol_id = u.rol_id
  LEFT JOIN unidad un ON un.unidad_id = u.unidad_id
`;

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(1),
  unitId: z.number().int().positive().optional(),
  hospitalId: z.number().int().positive().default(1),
});

const updateUserSchema = z.object({
  role: z.string().min(1).optional(),
  unitId: z.number().int().positive().nullable().optional(),
  active: z.boolean().optional(),
});

// Contraseña temporal: el administrador la entrega a mano. Se muestra una sola
// vez en la respuesta de creación y no se guarda en claro en ningún lado.
// PENDIENTE: cuando exista servicio de correo, enviarla por ahí en su lugar.
function generateTempPassword(): string {
  return randomBytes(9).toString("base64url");
}

async function findRoleId(role: string): Promise<number | null> {
  const [rows] = await pool.query<(RowDataPacket & { rol_id: number })[]>(
    "SELECT rol_id FROM rol WHERE nombre = ? AND activo = TRUE",
    [role],
  );
  return rows[0]?.rol_id ?? null;
}

export default async function usersRoutes(app: FastifyInstance) {
  // Cada ruta re-verifica el permiso en el servidor, sin importar que la
  // pantalla ya se hubiera bloqueado en el navegador.
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/users",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async () => {
      const [rows] = await pool.query<UsuarioRow[]>(`${SELECT_USER} ORDER BY u.nombre`);
      return rows.map(toUser);
    },
  );

  app.post(
    "/users",
    { preHandler: [app.requirePermission("usuarios", "crear")] },
    async (req, reply) => {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }
      const { name, email, phone, role, unitId, hospitalId } = parsed.data;

      const rolId = await findRoleId(role);
      if (!rolId) {
        return reply.code(400).send({ error: `Rol '${role}' no existe` });
      }

      const tempPassword = generateTempPassword();
      try {
        const [result] = await pool.query<ResultSetHeader>(
          `INSERT INTO usuario (hospital_id, rol_id, unidad_id, nombre, tipo_personal, email, telefono, password_hash)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [hospitalId, rolId, unitId ?? null, name, role, email, phone ?? null, await hashPassword(tempPassword)],
        );

        const [rows] = await pool.query<UsuarioRow[]>(
          `${SELECT_USER} WHERE u.usuario_id = ?`,
          [result.insertId],
        );
        // La contraseña viaja una única vez, aquí. No hay forma de recuperarla
        // después: si se pierde, se genera otra.
        return reply.code(201).send({ user: toUser(rows[0]!), tempPassword });
      } catch (err) {
        if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
          return reply.code(409).send({ error: "Ese email ya está en uso" });
        }
        throw err;
      }
    },
  );

  // Historial de actividad de una cuenta. Sale de `auditoria`, que hoy solo
  // recibe LOGIN: el resto de acciones se irán registrando conforme cada módulo
  // las escriba.
  app.get(
    "/users/:id/activity",
    { preHandler: [app.requirePermission("auditoria", "ver")] },
    async (req) => {
      const { id } = req.params as { id: string };
      const { days } = req.query as { days?: string };
      const window = Number(days) > 0 ? Number(days) : 30;

      const [rows] = await pool.query<AuditoriaRow[]>(
        `SELECT auditoria_id, entidad, registro_id, accion, fecha_hora, observacion
         FROM auditoria
         WHERE usuario_id = ? AND fecha_hora >= NOW() - INTERVAL ? DAY
         ORDER BY fecha_hora DESC
         LIMIT 100`,
        [id, window],
      );

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
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }
      const { role, unitId, active } = parsed.data;

      const updates: string[] = [];
      const values: unknown[] = [];

      if (role !== undefined) {
        const rolId = await findRoleId(role);
        if (!rolId) {
          return reply.code(400).send({ error: `Rol '${role}' no existe` });
        }
        updates.push("rol_id = ?");
        values.push(rolId);
      }
      if (unitId !== undefined) {
        updates.push("unidad_id = ?");
        values.push(unitId);
      }
      if (active !== undefined) {
        // Suspender al último administrador dejaría el sistema sin quien
        // administre y sin forma de revertirlo desde la interfaz.
        if (!active) {
          const [admins] = await pool.query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total
             FROM usuario u JOIN rol r ON r.rol_id = u.rol_id
             WHERE r.nombre = 'admin' AND u.activo = TRUE AND u.usuario_id <> ?`,
            [id],
          );
          if (!admins[0]?.total) {
            return reply.code(409).send({ error: "No puede suspender al último administrador" });
          }
        }
        updates.push("activo = ?");
        values.push(active);
      }

      if (!updates.length) {
        return reply.code(400).send({ error: "Nada que actualizar" });
      }

      await pool.query(`UPDATE usuario SET ${updates.join(", ")} WHERE usuario_id = ?`, [
        ...values,
        id,
      ]);

      const [rows] = await pool.query<UsuarioRow[]>(`${SELECT_USER} WHERE u.usuario_id = ?`, [id]);
      if (!rows[0]) return reply.code(404).send({ error: "Usuario no encontrado" });
      return toUser(rows[0]);
    },
  );
}
