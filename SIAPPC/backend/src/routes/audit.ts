import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { parseOr400 } from "../lib/http.ts";
import type { AuditEntry } from "../types.ts";

const querySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  entity: z.string().max(60).optional(),
  // Los seis valores del ENUM de `auditoria.accion`. LOGIN_BLOCKED tiene que
  // estar: filtrar por él es justo lo que se hace al revisar fuerza bruta.
  action: z.enum(["INSERT", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "LOGIN_BLOCKED"]).optional(),
  days: z.coerce.number().int().positive().max(365).optional(),
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

type AuditRawRow = {
  auditoria_id: bigint;
  entidad: string;
  registro_id: bigint;
  accion: string;
  fecha_hora: Date;
  observacion: string | null;
  autor: string | null;
};

// La bitácora va por consulta cruda y no por el constructor de consultas de
// Prisma por dos razones concretas:
//
//   - `NOW() - INTERVAL ? DAY` lo resuelve MariaDB. Calcular la fecha de corte
//     en Node la ataría al reloj del backend, que no es el mismo que el de la
//     base cuando corren en zonas distintas.
//   - El total y la página salen de la MISMA cláusula WHERE. Con dos consultas
//     construidas por separado, cualquier filtro nuevo hay que acordarse de
//     agregarlo en los dos sitios.
//
// Los valores nunca se concatenan: `Prisma.sql` los manda como parámetros, uno
// por cada `${}`. Lo único que se arma como texto es la unión de condiciones.
function buildWhere(filters: z.infer<typeof querySchema>): Prisma.Sql {
  const conditions: Prisma.Sql[] = [];
  if (filters.userId !== undefined) conditions.push(Prisma.sql`a.usuario_id = ${filters.userId}`);
  if (filters.entity) conditions.push(Prisma.sql`a.entidad = ${filters.entity}`);
  if (filters.action) conditions.push(Prisma.sql`a.accion = ${filters.action}`);
  if (filters.days) conditions.push(Prisma.sql`a.fecha_hora >= NOW() - INTERVAL ${filters.days} DAY`);

  return conditions.length
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}

function toEntry(row: AuditRawRow): AuditEntry {
  return {
    id: String(row.auditoria_id),
    author: row.autor,
    entity: row.entidad,
    recordId: String(row.registro_id),
    action: row.accion,
    note: row.observacion,
    at: new Date(row.fecha_hora).toISOString(),
  };
}

export default async function auditRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/audit", { preHandler: [app.requirePermission("auditoria", "ver")] }, async (req) => {
    const filters = parseOr400(querySchema, req.query);
    const where = buildWhere(filters);
    const { page, pageSize } = filters;

    // El log crece sin límite, así que se pagina en el servidor: la pantalla
    // nunca pide la tabla completa.
    const [counts, rows] = await Promise.all([
      prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COUNT(*) AS total FROM auditoria a ${where}
      `,
      prisma.$queryRaw<AuditRawRow[]>`
        SELECT a.auditoria_id, a.entidad, a.registro_id, a.accion, a.fecha_hora,
               a.observacion, u.nombre AS autor
        FROM auditoria a
        LEFT JOIN usuario u ON u.usuario_id = a.usuario_id
        ${where}
        ORDER BY a.fecha_hora DESC, a.auditoria_id DESC
        LIMIT ${pageSize} OFFSET ${page * pageSize}
      `,
    ]);

    return {
      total: Number(counts[0]?.total ?? 0),
      entries: rows.map(toEntry),
    };
  });

  // Valores presentes en el log, para llenar los filtros sin inventar opciones
  // que no existen en los datos.
  app.get(
    "/audit/entities",
    { preHandler: [app.requirePermission("auditoria", "ver")] },
    async () => {
      const rows = await prisma.auditoria.findMany({
        distinct: ["entidad"],
        select: { entidad: true },
        orderBy: { entidad: "asc" },
      });
      return rows.map((row) => row.entidad);
    },
  );
}
