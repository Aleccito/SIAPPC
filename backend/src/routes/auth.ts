import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { verifyPassword } from "../lib/passwords.ts";
import type { UsuarioRow, User } from "../types.ts";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function toUser(row: UsuarioRow): User {
  return {
    id: String(row.usuario_id),
    name: row.nombre,
    email: row.email,
    role: row.rol_nombre,
  };
}

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Email y contraseña son requeridos" });
    }
    const { email, password } = parsed.data;

    const [rows] = await pool.query<(UsuarioRow & { activo: number })[]>(
      `SELECT u.usuario_id, u.nombre, u.email, u.password_hash, u.activo, r.nombre AS rol_nombre
       FROM usuario u
       JOIN rol r ON r.rol_id = u.rol_id
       WHERE u.email = ?`,
      [email],
    );
    const row = rows[0];

    // Same error for "no existe" and "clave incorrecta": don't leak which one failed.
    if (!row || !row.activo || !(await verifyPassword(password, row.password_hash))) {
      return reply.code(401).send({ error: "Credenciales inválidas" });
    }

    const token = await reply.jwtSign({ sub: String(row.usuario_id), role: row.rol_nombre });
    return { token, user: toUser(row) };
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (req, reply) => {
    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT u.usuario_id, u.nombre, u.email, r.nombre AS rol_nombre
       FROM usuario u
       JOIN rol r ON r.rol_id = u.rol_id
       WHERE u.usuario_id = ?`,
      [req.user.sub],
    );
    const row = rows[0];
    if (!row) return reply.code(404).send({ error: "Usuario no encontrado" });
    return toUser(row);
  });
}
