import type { FastifyInstance } from "fastify";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { hashPassword } from "../lib/passwords.ts";
import type { UsuarioRow, User } from "../types.ts";

function toUser(row: UsuarioRow): User {
  return {
    id: String(row.usuario_id),
    name: row.nombre,
    email: row.email,
    role: row.rol_nombre,
  };
}

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  hospitalId: z.number().int().positive(),
  role: z.enum(["admin", "user"]),
  tipoPersonal: z.string().min(1),
});

const roleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export default async function usersRoutes(app: FastifyInstance) {
  // Every route here re-checks admin server-side, regardless of what the
  // frontend screen already gated — never trust that the client got there.
  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", app.requireRole("admin"));

  app.get("/users", async () => {
    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.usuario_id, u.nombre, u.email, r.nombre AS rol_nombre
       FROM usuario u
       JOIN rol r ON r.rol_id = u.rol_id
       WHERE u.activo = TRUE
       ORDER BY u.nombre`,
    );
    return rows.map(toUser);
  });

  app.post("/users", async (req, reply) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues });
    }
    const { name, email, password, hospitalId, role, tipoPersonal } = parsed.data;

    const [roleRows] = await pool.query<(RowDataPacket & { rol_id: number })[]>(
      "SELECT rol_id FROM rol WHERE nombre = ?",
      [role],
    );
    if (!roleRows[0]) {
      return reply.code(400).send({ error: `Rol '${role}' no existe` });
    }

    const passwordHash = await hashPassword(password);
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO usuario (hospital_id, rol_id, nombre, tipo_personal, email, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [hospitalId, roleRows[0].rol_id, name, tipoPersonal, email, passwordHash],
      );
      return reply.code(201).send({
        id: String(result.insertId),
        name,
        email,
        role,
      } satisfies User);
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
        return reply.code(409).send({ error: "Ese email ya está en uso" });
      }
      throw err;
    }
  });

  app.patch("/users/:id/role", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "role debe ser 'admin' o 'user'" });
    }

    const [roleRows] = await pool.query<(RowDataPacket & { rol_id: number })[]>(
      "SELECT rol_id FROM rol WHERE nombre = ?",
      [parsed.data.role],
    );
    if (!roleRows[0]) {
      return reply.code(400).send({ error: `Rol '${parsed.data.role}' no existe` });
    }

    await pool.query("UPDATE usuario SET rol_id = ? WHERE usuario_id = ?", [
      roleRows[0].rol_id,
      id,
    ]);

    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.usuario_id, u.nombre, u.email, r.nombre AS rol_nombre
       FROM usuario u
       JOIN rol r ON r.rol_id = u.rol_id
       WHERE u.usuario_id = ?`,
      [id],
    );
    if (!rows[0]) return reply.code(404).send({ error: "Usuario no encontrado" });
    return toUser(rows[0]);
  });
}
