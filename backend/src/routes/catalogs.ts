import type { FastifyInstance } from "fastify";
import { pool } from "../../db/db.ts";
import type { UnidadRow, Unit } from "../types.ts";

// Catálogos que alimentan los selectores de la administración. Las unidades no
// llevan permiso propio: cualquier usuario autenticado necesita leerlas para
// que los formularios muestren nombres en vez de identificadores.
export default async function catalogRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/units", async () => {
    const [rows] = await pool.query<UnidadRow[]>(
      "SELECT unidad_id, nombre FROM unidad WHERE activo = TRUE ORDER BY nombre",
    );
    return rows.map((row): Unit => ({ id: String(row.unidad_id), name: row.nombre }));
  });
}
