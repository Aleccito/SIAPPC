import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { badRequest, conflict, notFound, parseOr400 } from "../lib/http.ts";
import type { RoleChange, RolePermission, RoleSummary } from "../types.ts";

const createRoleSchema = z.object({
  label: z.string().min(1).max(80),
  description: z.string().max(255).optional(),
  // Los permisos del rol base se copian como punto de partida.
  baseRole: z.string().min(1).optional(),
});

const updateRoleSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  description: z.string().max(255).nullable().optional(),
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

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

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

type RolConConteo = {
  rol_id: number;
  nombre: string;
  etiqueta: string;
  descripcion: string | null;
  es_sistema: boolean;
  _count: { usuarios: number };
};

function toRoleSummary(row: RolConConteo): RoleSummary {
  return {
    id: String(row.rol_id),
    name: row.nombre,
    label: row.etiqueta,
    description: row.descripcion,
    isSystem: row.es_sistema,
    userCount: row._count.usuarios,
  };
}

/** El rol o un 404, y de paso el 409 de los roles del sistema si se pide. */
async function findRole(id: number, mustBeEditable: boolean) {
  const role = await prisma.rol.findUnique({ where: { rol_id: id } });
  if (!role) throw notFound("Rol no encontrado");
  // Los roles base se muestran en solo lectura en la interfaz; el servidor lo
  // vuelve a exigir por si alguien llama la ruta directamente.
  if (mustBeEditable && role.es_sistema) {
    throw conflict("Los roles predefinidos no se editan");
  }
  return role;
}

// Los roles tampoco pasan por la fábrica de CRUD: el alta deriva el `nombre` de
// la etiqueta y copia la matriz de otro rol, la edición está prohibida sobre
// los roles del sistema, y la matriz de permisos es un recurso anidado con su
// propio verbo. Es un CRUD, pero no el CRUD genérico.
export default async function rolesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/roles", { preHandler: [app.requirePermission("usuarios", "ver")] }, async () => {
    const rows = await prisma.rol.findMany({
      where: { activo: true },
      // El conteo de usuarios activos por rol lo hace la base en la misma
      // consulta; traerlos para contarlos en Node sería traer toda la tabla.
      include: { _count: { select: { usuarios: { where: { activo: true } } } } },
      orderBy: [{ es_sistema: "desc" }, { etiqueta: "asc" }],
    });
    return rows.map(toRoleSummary);
  });

  // Va antes de "/roles/:id" a propósito: Fastify no confundiría "changes" con
  // un id porque el esquema del parámetro lo rechaza, pero el orden deja claro
  // que es una ruta fija y no un recurso.
  //
  // Alimenta "Últimos cambios de permisos".
  app.get(
    "/roles/changes",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async () => {
      const rows = await prisma.$queryRaw<
        { auditoria_id: bigint; fecha_hora: Date; observacion: string | null; autor: string | null }[]
      >`
        SELECT a.auditoria_id, a.fecha_hora, a.observacion, u.nombre AS autor
        FROM auditoria a
        LEFT JOIN usuario u ON u.usuario_id = a.usuario_id
        WHERE a.entidad IN ('rol', 'rol_permiso')
        ORDER BY a.fecha_hora DESC, a.auditoria_id DESC
        LIMIT 10
      `;

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

  app.get("/roles/:id", { preHandler: [app.requirePermission("usuarios", "ver")] }, async (req) => {
    const { id } = parseOr400(idParamSchema, req.params);
    const row = await prisma.rol.findUnique({
      where: { rol_id: id },
      include: { _count: { select: { usuarios: { where: { activo: true } } } } },
    });
    if (!row) throw notFound("Rol no encontrado");
    return toRoleSummary(row);
  });

  // Matriz de un rol: un renglón por módulo, exista o no la fila en
  // `rol_permiso`. Un módulo sin fila es un módulo sin ningún permiso.
  //
  // Consulta cruda: es un LEFT JOIN cuya condición depende del rol pedido
  // (`rp.rol_id = ?` va DENTRO del ON, no en el WHERE) más un COALESCE por
  // columna. Con el constructor de consultas habría que traer los permisos y
  // las filas del rol por separado y cruzarlos en Node — el mismo resultado
  // pero con dos viajes y la lógica del outer join escrita a mano.
  app.get(
    "/roles/:id/permissions",
    { preHandler: [app.requirePermission("usuarios", "ver")] },
    async (req) => {
      const { id } = parseOr400(idParamSchema, req.params);

      const rows = await prisma.$queryRaw<
        {
          modulo: string;
          etiqueta: string;
          puede_ver: number | boolean;
          puede_crear: number | boolean;
          puede_editar: number | boolean;
          puede_eliminar: number | boolean;
        }[]
      >`
        SELECT p.modulo, p.nombre AS etiqueta,
               COALESCE(rp.puede_ver, FALSE)      AS puede_ver,
               COALESCE(rp.puede_crear, FALSE)    AS puede_crear,
               COALESCE(rp.puede_editar, FALSE)   AS puede_editar,
               COALESCE(rp.puede_eliminar, FALSE) AS puede_eliminar
        FROM permiso p
        LEFT JOIN rol_permiso rp ON rp.permiso_id = p.permiso_id AND rp.rol_id = ${id}
        ORDER BY p.permiso_id
      `;

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
    async (req) => {
      const { id } = parseOr400(idParamSchema, req.params);
      const { permissions } = parseOr400(permissionsSchema, req.body);
      const role = await findRole(id, true);

      // Los módulos se resuelven de una sola vez y no uno por uno dentro de la
      // transacción: son tantas idas a la base como casillas tenga la matriz.
      const modulos = await prisma.permiso.findMany({
        where: { modulo: { in: permissions.map((entry) => entry.module) } },
        select: { permiso_id: true, modulo: true },
      });
      const permisoPorModulo = new Map(modulos.map((row) => [row.modulo, row.permiso_id]));

      await prisma.$transaction(async (tx) => {
        for (const entry of permissions) {
          const permisoId = permisoPorModulo.get(entry.module);
          // Un módulo que no existe en `permiso` se ignora en silencio, igual
          // que antes: la matriz del navegador puede ir por delante de la base
          // recién migrada.
          if (permisoId === undefined) continue;

          const valores = {
            puede_ver: entry.ver,
            puede_crear: entry.crear,
            puede_editar: entry.editar,
            puede_eliminar: entry.eliminar,
          };
          await tx.rolPermiso.upsert({
            where: { rol_id_permiso_id: { rol_id: id, permiso_id: permisoId } },
            create: { rol_id: id, permiso_id: permisoId, ...valores },
            update: valores,
          });
        }

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "rol_permiso",
          registroId: id,
          accion: "UPDATE",
          observacion: `actualizó los permisos del rol ${role.etiqueta}`,
        });
      });

      return { ok: true };
    },
  );

  app.post(
    "/roles",
    { preHandler: [app.requirePermission("usuarios", "crear")] },
    async (req, reply) => {
      const { label, description, baseRole } = parseOr400(createRoleSchema, req.body);
      const name = toRoleName(label);
      if (!name) throw badRequest("El nombre del rol no puede quedar vacío");

      const created = await prisma.$transaction(async (tx) => {
        const row = await tx.rol.create({
          data: { nombre: name, etiqueta: label, descripcion: description ?? null },
          include: { _count: { select: { usuarios: { where: { activo: true } } } } },
        });

        if (baseRole) {
          // Copia de la matriz del rol base en una sola sentencia: leerla y
          // reinsertarla desde Node serían N+1 viajes para un resultado
          // idéntico.
          await tx.$executeRaw`
            INSERT INTO rol_permiso
              (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
            SELECT ${row.rol_id}, rp.permiso_id,
                   rp.puede_ver, rp.puede_crear, rp.puede_editar, rp.puede_eliminar
            FROM rol_permiso rp
            JOIN rol base ON base.rol_id = rp.rol_id
            WHERE base.nombre = ${baseRole}
          `;
        }

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "rol",
          registroId: row.rol_id,
          accion: "INSERT",
          observacion: `creó rol personalizado ${label}`,
        });

        return row;
      });

      reply.header("Location", `/roles/${created.rol_id}`);
      return reply.code(201).send(toRoleSummary(created));
    },
  );

  app.patch(
    "/roles/:id",
    { preHandler: [app.requirePermission("usuarios", "editar")] },
    async (req) => {
      const { id } = parseOr400(idParamSchema, req.params);
      const { label, description } = parseOr400(updateRoleSchema, req.body);
      const role = await findRole(id, true);

      const data: Record<string, unknown> = {};
      // El `nombre` NO se recalcula al renombrar la etiqueta: es la llave que
      // usan el token de sesión y las consultas de permisos, y cambiarla dejaría
      // fuera a todos los usuarios que ya tienen el rol.
      if (label !== undefined) data.etiqueta = label;
      if (description !== undefined) data.descripcion = description;
      if (Object.keys(data).length === 0) throw badRequest("Nada que actualizar");

      return prisma.$transaction(async (tx) => {
        const updated = await tx.rol.update({
          where: { rol_id: id },
          data,
          include: { _count: { select: { usuarios: { where: { activo: true } } } } },
        });
        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "rol",
          registroId: id,
          accion: "UPDATE",
          observacion: `actualizó el rol ${role.etiqueta}`,
        });
        return toRoleSummary(updated);
      });
    },
  );

  app.delete(
    "/roles/:id",
    { preHandler: [app.requirePermission("usuarios", "eliminar")] },
    async (req, reply) => {
      const { id } = parseOr400(idParamSchema, req.params);
      const role = await findRole(id, true);

      // Un rol con cuentas asignadas no se da de baja: `usuario.rol_id` es NOT
      // NULL con ON DELETE RESTRICT, y dejarlo inactivo escondería un rol que
      // sigue mandando en los permisos de esa gente.
      const enUso = await prisma.usuario.count({ where: { rol_id: id, activo: true } });
      if (enUso > 0) {
        throw conflict(`El rol ${role.etiqueta} tiene ${enUso} cuenta(s) activa(s) asignada(s)`);
      }

      await prisma.$transaction(async (tx) => {
        await tx.rol.update({ where: { rol_id: id }, data: { activo: false } });
        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "rol",
          registroId: id,
          accion: "DELETE",
          observacion: `dio de baja el rol ${role.etiqueta}`,
        });
      });

      return reply.code(204).send();
    },
  );

  app.get("/permissions", { preHandler: [app.requirePermission("usuarios", "ver")] }, async () => {
    const rows = await prisma.permiso.findMany({
      select: { modulo: true, nombre: true },
      orderBy: { permiso_id: "asc" },
    });
    return rows.map((row) => ({ module: row.modulo, label: row.nombre }));
  });
}
