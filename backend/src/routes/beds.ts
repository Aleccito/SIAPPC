// Camas.
//
// El CRUD sale de la fábrica (lib/crud.ts): un alta de cama es un alta y no
// tiene reglas propias. Lo único escrito a mano es el resumen de ocupación, que
// es un agregado por unidad y no un listado.
//
// El estado de la cama NO se cambia desde aquí a mano en el caso normal: lo
// mueve routes/admissions.ts al asignar la cama (`ocupada`) y al dar el egreso
// (`limpieza`). PATCH /beds/:id existe para lo otro —sacarla por mantenimiento,
// devolverla al servicio cuando la limpiaron— que es decisión de la unidad y no
// consecuencia de un ingreso.

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { registerCrud } from "../lib/crud.ts";
import { prisma } from "../lib/prisma.ts";
import { bedStates } from "../types.ts";
import type { Bed, BedOccupancy, BedState } from "../types.ts";

const CAMA_INCLUDE = {
  unidad: { select: { nombre: true } },
  // Quién la ocupa. Solo el ingreso activo: una cama arrastra todos los que
  // pasaron por ella, y el que importa aquí es el que no ha egresado.
  ingresos: {
    where: { estado: "activo" as const },
    select: { paciente: { select: { paciente_id: true, nombre: true } } },
    take: 1,
  },
} as const;

type CamaRow = {
  cama_id: number;
  unidad_id: number;
  codigo: string;
  tipo: string | null;
  estado: BedState;
  unidad: { nombre: string };
  ingresos: { paciente: { paciente_id: number; nombre: string } }[];
};

function toBed(row: CamaRow): Bed {
  const ocupante = row.ingresos[0]?.paciente ?? null;
  return {
    id: String(row.cama_id),
    unitId: String(row.unidad_id),
    unit: row.unidad.nombre,
    code: row.codigo,
    type: row.tipo,
    state: row.estado,
    patientId: ocupante ? String(ocupante.paciente_id) : null,
    patientName: ocupante?.nombre ?? null,
  };
}

const bedSchema = z.object({
  unitId: z.coerce.number().int().positive(),
  code: z.string().min(1).max(20),
  type: z.string().max(40).nullish(),
  state: z.enum(bedStates).default("disponible"),
});

const bedPatchSchema = bedSchema.partial();

type BedInput = z.infer<typeof bedSchema>;

function toRow(input: Partial<BedInput>): Record<string, unknown> {
  return {
    ...(input.unitId !== undefined ? { unidad_id: input.unitId } : {}),
    ...(input.code !== undefined ? { codigo: input.code } : {}),
    ...(input.type !== undefined ? { tipo: input.type ?? null } : {}),
    ...(input.state !== undefined ? { estado: input.state } : {}),
  };
}

type OcupacionRow = {
  unidad_id: number;
  unidad: string;
  total: bigint | number;
  ocupadas: bigint | number | null;
  disponibles: bigint | number | null;
  fuera: bigint | number | null;
};

export default async function bedsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  // Va ANTES de la fábrica por legibilidad, no por necesidad: Fastify resuelve
  // el segmento fijo `occupancy` antes que `:id` sin importar el orden de
  // registro. Sin esta ruta, /beds/occupancy caería en la de detalle y el id
  // "occupancy" saldría rechazado con un 400 desconcertante.
  //
  // La consulta cuenta TODAS las unidades, incluidas las que no tienen camas
  // —de ahí el LEFT JOIN—: una unidad sin camas registradas es justamente lo
  // que el administrativo necesita ver para darlas de alta.
  app.get(
    "/beds/occupancy",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req): Promise<BedOccupancy[]> => {
      const rows = await prisma.$queryRaw<OcupacionRow[]>`
        SELECT u.unidad_id, u.nombre AS unidad,
               COUNT(c.cama_id) AS total,
               SUM(c.estado = 'ocupada') AS ocupadas,
               SUM(c.estado = 'disponible') AS disponibles,
               SUM(c.estado IN ('limpieza', 'mantenimiento')) AS fuera
        FROM unidad u
        LEFT JOIN cama c ON c.unidad_id = u.unidad_id AND c.activo = TRUE
        WHERE u.activo = TRUE AND u.hospital_id = ${req.hospitalId}
        GROUP BY u.unidad_id, u.nombre
        ORDER BY u.nombre ASC
      `;

      return rows.map((row): BedOccupancy => {
        // COUNT y SUM llegan como BigInt del driver: JSON.stringify no sabe
        // serializarlos y la respuesta saldría 500.
        const total = Number(row.total);
        const occupied = Number(row.ocupadas ?? 0);
        return {
          unitId: String(row.unidad_id),
          unit: row.unidad,
          total,
          occupied,
          available: Number(row.disponibles ?? 0),
          outOfService: Number(row.fuera ?? 0),
          rate: total === 0 ? 0 : occupied / total,
        };
      });
    },
  );

  registerCrud<CamaRow, Bed, BedInput, Partial<BedInput>>(app, {
    path: "/beds",
    model: "cama",
    idField: "cama_id",
    auditEntity: "cama",
    permissions: {
      ver: "admisiones",
      crear: "admisiones",
      editar: "admisiones",
      eliminar: "admisiones",
    },
    createSchema: bedSchema,
    updateSchema: bedPatchSchema,
    query: {
      // La cama no guarda `hospital_id`: lo alcanza por su unidad, que es donde
      // vive. Guardarlo aquí además sería la dependencia transitiva que el
      // esquema evita a propósito.
      where: (req) => ({ activo: true, unidad: { hospital_id: req.hospitalId } }),
      orderBy: [{ unidad_id: "asc" }, { codigo: "asc" }],
      include: CAMA_INCLUDE,
    },
    // Baja lógica: los ingresos pasados apuntan a la cama y la bitácora la
    // referencia por id.
    softDelete: { field: "activo", inactiveValue: false },
    toDto: toBed,
    toCreateData: (input) => toRow(input),
    toUpdateData: (input) => toRow(input),
    describe: {
      create: (row) => `dio de alta la cama ${row.codigo} en ${row.unidad.nombre}`,
      update: (row) => `modificó la cama ${row.codigo} de ${row.unidad.nombre}`,
      remove: (row) => `dio de baja la cama ${row.codigo} de ${row.unidad.nombre}`,
    },
  });
}
