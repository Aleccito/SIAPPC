import type { FastifyInstance } from "fastify";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import type { AuditEntry, AuditoriaRow } from "../types.ts";

const querySchema = z.object({
  userId: z.string().optional(),
  entity: z.string().optional(),
  // Los seis valores del ENUM de `auditoria.accion` en db/schema.sql.
  // LOGIN_BLOCKED faltaba aquí: filtrar por él devolvía 400 y era justo el que
  // se quiere aislar al revisar intentos de fuerza bruta.
  action: z
    .enum(["INSERT", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "LOGIN_BLOCKED"])
    .optional(),
  days: z.coerce.number().int().positive().max(365).optional(),
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export default async function auditRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/audit",
    { preHandler: [app.requirePermission("auditoria", "ver")] },
    async (req, reply) => {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }
      const { userId, entity, action, days, page, pageSize } = parsed.data;

      // El log crece sin límite, así que se pagina en el servidor: la pantalla
      // nunca pide la tabla completa.
      const where: string[] = [];
      const values: unknown[] = [];
      if (userId) {
        where.push("a.usuario_id = ?");
        values.push(userId);
      }
      if (entity) {
        where.push("a.entidad = ?");
        values.push(entity);
      }
      if (action) {
        where.push("a.accion = ?");
        values.push(action);
      }
      if (days) {
        where.push("a.fecha_hora >= NOW() - INTERVAL ? DAY");
        values.push(days);
      }
      const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const [counts] = await pool.query<(RowDataPacket & { total: number })[]>(
        `SELECT COUNT(*) AS total FROM auditoria a ${clause}`,
        values,
      );

      const [rows] = await pool.query<(AuditoriaRow & { autor: string | null })[]>(
        `SELECT a.auditoria_id, a.entidad, a.registro_id, a.accion, a.fecha_hora,
                a.observacion, u.nombre AS autor
         FROM auditoria a
         LEFT JOIN usuario u ON u.usuario_id = a.usuario_id
         ${clause}
         ORDER BY a.fecha_hora DESC
         LIMIT ? OFFSET ?`,
        [...values, pageSize, page * pageSize],
      );

      return {
        total: Number(counts[0]?.total ?? 0),
        entries: rows.map(
          (row): AuditEntry => ({
            id: String(row.auditoria_id),
            author: row.autor,
            entity: row.entidad,
            recordId: String(row.registro_id),
            action: row.accion,
            note: row.observacion,
            at: new Date(row.fecha_hora).toISOString(),
          }),
        ),
      };
    },
  );

  // Valores presentes en el log, para llenar los filtros sin inventar opciones
  // que no existen en los datos.
  app.get(
    "/audit/entities",
    { preHandler: [app.requirePermission("auditoria", "ver")] },
    async () => {
      const [rows] = await pool.query<(RowDataPacket & { entidad: string })[]>(
        "SELECT DISTINCT entidad FROM auditoria ORDER BY entidad",
      );
      return rows.map((row) => row.entidad);
    },
  );
}
