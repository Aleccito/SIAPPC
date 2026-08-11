import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { registerCrud } from "../lib/crud.ts";
import type { Unit } from "../types.ts";

type UnidadRow = { unidad_id: number; nombre: string; hospital_id: number; activo: boolean };

const unitSchema = z.object({
  name: z.string().min(1).max(80),
  hospitalId: z.number().int().positive().default(1),
});

// Catálogos que alimentan los selectores de la administración. Las unidades no
// llevan permiso de lectura propio: cualquier usuario autenticado necesita
// leerlas para que los formularios muestren nombres en vez de identificadores.
// Crearlas y borrarlas sí, y por eso el módulo de permiso no es null.
export default async function catalogRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  registerCrud<UnidadRow, Unit, z.infer<typeof unitSchema>, Partial<z.infer<typeof unitSchema>>>(
    app,
    {
      path: "/units",
      model: "unidad",
      idField: "unidad_id",
      auditEntity: "unidad",
      // Leerlas: cualquiera con sesión, o los formularios se quedan sin
      // nombres. Escribirlas: administración de personal, igual que los roles,
      // porque `unidad` no tiene módulo propio en la tabla `permiso`.
      permissions: {
        ver: null,
        crear: "usuarios",
        editar: "usuarios",
        eliminar: "usuarios",
      },
      createSchema: unitSchema,
      updateSchema: unitSchema.partial(),
      query: { where: { activo: true }, orderBy: { nombre: "asc" } },
      // Una unidad borrada sigue siendo la unidad de los usuarios que la
      // tuvieron asignada y de lo que quedó en la bitácora.
      softDelete: { field: "activo", inactiveValue: false },
      toDto: (row) => ({ id: String(row.unidad_id), name: row.nombre }),
      toCreateData: (input) => ({ nombre: input.name, hospital_id: input.hospitalId }),
      toUpdateData: (input) => ({
        ...(input.name !== undefined ? { nombre: input.name } : {}),
        ...(input.hospitalId !== undefined ? { hospital_id: input.hospitalId } : {}),
      }),
      describe: {
        create: (row) => `creó la unidad ${row.nombre}`,
        update: (row) => `actualizó la unidad ${row.nombre}`,
        remove: (row) => `dio de baja la unidad ${row.nombre}`,
      },
    },
  );
}
