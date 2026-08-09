import type { FastifyInstance } from "fastify";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import type {
  AuditoriaRow,
  PermisoRow,
  RolPermisoRow,
  RolRow,
  RoleChange,
  RoleSummary,
  RolePermission,
} from "../types.ts";

const createRoleSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  // Los permisos del rol base se copian como punto de partida.
  baseRole: z.string().min(1).optional(),
});

const permissionsSchema = z.object({
  permissions: z.array(
    z.object({
      module: z.string().min(1),
      ver: z.boolean(),
      crear: z.boolean(),
      editar: z.boolean(),
      eliminar: z.boolean(),
    }),
  ),
});

// Marcas diacríticas combinantes. Se construye con escapes en vez de con los
// caracteres literales para que no dependa de la codificación del archivo.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

// "Jefe de Servicio" -> "jefe_de_servicio". La etiqueta es lo que ve el
// usuario; el nombre es la llave estable que usan las consultas.
function toRoleName(label: string): string {
  return label
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function toRoleSummary(row: RolRow): RoleSummary {
  return {
    id: String(row.rol_id),
    name: row.nombre,
    label: row.etiqueta,
    description: row.descripcion,
    isSystem: Boolean(row.es_sistema),
    userCount: Number(row.usuarios),
  };
}

export default async function rolesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/roles", { preHandler: [app.requirePermission("usuarios", "ver")] }, async () => {
    const [rows] = await pool.query<RolRow[]>(
      `SELECT r.rol_id, r.nombre, r.etiqueta, r.descripcion, r.es_sistema,
              COUNT(u.usuario_id) AS usuarios
       FROM rol r
       LEFT JOIN usuario u ON u.rol_id = r.rol_id AND u.activo = TRUE
       WHERE r.activo = TRUE
       GROUP BY r.rol_id
       ORDER BY r.es_sistema DESC, r.etiqueta`,
    );
    return rows.map(toRoleSummary);
  });

  // Matriz de un rol: un renglón por módulo, exista o no la fila en
  // `rol_permiso`. Un módulo sin fila es un módulo sin ningún permiso.
  app.get(
    "/roles/:id/permissions",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async (req) => {
      const { id } = req.params as { id: string };

      const [rows] = await pool.query<RolPermisoRow[]>(
        `SELECT p.modulo, p.nombre AS etiqueta,
                COALESCE(rp.puede_ver, FALSE) AS puede_ver,
                COALESCE(rp.puede_crear, FALSE) AS puede_crear,
                COALESCE(rp.puede_editar, FALSE) AS puede_editar,
                COALESCE(rp.puede_eliminar, FALSE) AS puede_eliminar
         FROM permiso p
         LEFT JOIN rol_permiso rp ON rp.permiso_id = p.permiso_id AND rp.rol_id = ?
         ORDER BY p.permiso_id`,
        [id],
      );

      return rows.map(
        (row): RolePermission => ({
          module: row.modulo,
          label: row.etiqueta,
          ver: Boolean(row.puede_ver),
          crear: Boolean(row.puede_crear),
          editar: Boolean(row.puede_editar),
          eliminar: Boolean(row.puede_eliminar),
        }),
      );
    },
  );

  app.put(
    "/roles/:id/permissions",
    { preHandler: [app.requirePermission("usuarios", "editar")] },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const parsed = permissionsSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }

      const [roles] = await pool.query<RolRow[]>(
        "SELECT rol_id, nombre, etiqueta, es_sistema FROM rol WHERE rol_id = ?",
        [id],
      );
      const role = roles[0];
      if (!role) return reply.code(404).send({ error: "Rol no encontrado" });
      // Los roles base se muestran en solo lectura en la interfaz; el servidor
      // lo vuelve a exigir por si alguien llama la ruta directamente.
      if (role.es_sistema) {
        return reply.code(409).send({ error: "Los roles predefinidos no se editan" });
      }

      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        for (const entry of parsed.data.permissions) {
          const [permisos] = await connection.query<(RowDataPacket & { permiso_id: number })[]>(
            "SELECT permiso_id FROM permiso WHERE modulo = ?",
            [entry.module],
          );
          if (!permisos[0]) continue;

          await connection.query(
            `INSERT INTO rol_permiso (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               puede_ver = VALUES(puede_ver), puede_crear = VALUES(puede_crear),
               puede_editar = VALUES(puede_editar), puede_eliminar = VALUES(puede_eliminar)`,
            [id, permisos[0].permiso_id, entry.ver, entry.crear, entry.editar, entry.eliminar],
          );
        }

        await connection.query(
          `INSERT INTO auditoria (usuario_id, entidad, registro_id, accion, observacion)
           VALUES (?, 'rol_permiso', ?, 'UPDATE', ?)`,
          [req.user.sub, id, `actualizó los permisos del rol ${role.etiqueta}`],
        );
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }

      return { ok: true };
    },
  );

  app.post("/roles", { preHandler: [app.requirePermission("usuarios", "crear")] }, async (req, reply) => {
    const parsed = createRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues });
    }
    const { label, description, baseRole } = parsed.data;
    const name = toRoleName(label);
    if (!name) {
      return reply.code(400).send({ error: "El nombre del rol no puede quedar vacío" });
    }

    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO rol (nombre, etiqueta, descripcion, es_sistema) VALUES (?, ?, ?, FALSE)",
        [name, label, description ?? null],
      );

      if (baseRole) {
        await pool.query(
          `INSERT INTO rol_permiso (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
           SELECT ?, rp.permiso_id, rp.puede_ver, rp.puede_crear, rp.puede_editar, rp.puede_eliminar
           FROM rol_permiso rp JOIN rol base ON base.rol_id = rp.rol_id
           WHERE base.nombre = ?`,
          [result.insertId, baseRole],
        );
      }

      await pool.query(
        `INSERT INTO auditoria (usuario_id, entidad, registro_id, accion, observacion)
         VALUES (?, 'rol', ?, 'INSERT', ?)`,
        [req.user.sub, result.insertId, `creó rol personalizado ${label}`],
      );

      const [rows] = await pool.query<RolRow[]>(
        `SELECT r.rol_id, r.nombre, r.etiqueta, r.descripcion, r.es_sistema, 0 AS usuarios
         FROM rol r WHERE r.rol_id = ?`,
        [result.insertId],
      );
      return reply.code(201).send(toRoleSummary(rows[0]!));
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
        return reply.code(409).send({ error: "Ya existe un rol con ese nombre" });
      }
      throw err;
    }
  });

  // Alimenta "Últimos cambios de permisos".
  app.get(
    "/roles/changes",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async () => {
      const [rows] = await pool.query<(AuditoriaRow & { autor: string | null })[]>(
        `SELECT a.auditoria_id, a.entidad, a.registro_id, a.accion, a.fecha_hora, a.observacion,
                u.nombre AS autor
         FROM auditoria a
         LEFT JOIN usuario u ON u.usuario_id = a.usuario_id
         WHERE a.entidad IN ('rol', 'rol_permiso')
         ORDER BY a.fecha_hora DESC
         LIMIT 10`,
      );

      return rows.map(
        (row): RoleChange => ({
          id: String(row.auditoria_id),
          author: row.autor,
          description: row.observacion ?? "",
          at: new Date(row.fecha_hora).toISOString(),
        }),
      );
    },
  );

  app.get("/permissions", { preHandler: [app.requirePermission("usuarios", "ver")] }, async () => {
    const [rows] = await pool.query<PermisoRow[]>(
      "SELECT modulo, nombre FROM permiso ORDER BY permiso_id",
    );
    return rows.map((row) => ({ module: row.modulo, label: row.nombre }));
  });
}
