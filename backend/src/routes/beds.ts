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
import { conflict, notFound, parseOr400 } from "../lib/http.ts";
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

// El techo no es una regla clínica, es un cortafuegos: un cero de más en el
// formulario no debe crear diez mil camas en una transacción.
const capacitySchema = z.object({
  unitId: z.coerce.number().int().positive(),
  total: z.coerce.number().int().min(0).max(500),
});

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

  // Capacidad de una unidad: cuántas camas tiene, como UN número.
  //
  // El CRUD de abajo da de alta camas de una en una, que es lo correcto cuando
  // se añade una cama concreta con su código. Pero la pregunta que se hace de
  // verdad al montar una unidad es "¿de cuántas camas dispone la UCI?", y
  // responderla a base de doce altas seguidas es una forma tonta de gastar el
  // tiempo de alguien.
  //
  // Es idempotente: se manda el total que debe haber, no cuántas añadir. Pedir
  // dos veces 12 deja 12, no 24 — importa porque este botón se pulsa dos veces
  // cuando la primera respuesta tarda.
  //
  // Reducir NO borra camas ocupadas. Si se piden menos de las que están en uso,
  // la operación se rechaza entera en vez de decidir por su cuenta a qué
  // paciente deja sin cama.
  app.put(
    "/beds/capacity",
    { preHandler: [app.requirePermission("admisiones", "editar")] },
    async (req) => {
      const { unitId, total } = parseOr400(capacitySchema, req.body);

      // La unidad tiene que ser de este hospital: el identificador viene del
      // cuerpo, así que sin esta comprobación se podrían montar camas en la
      // unidad de otro hospital.
      const unidad = await prisma.unidad.findFirst({
        where: { unidad_id: unitId, hospital_id: req.hospitalId },
        select: { unidad_id: true, nombre: true },
      });
      if (!unidad) throw notFound("La unidad no existe en este hospital");

      return prisma.$transaction(async (tx) => {
        const existentes = await tx.cama.findMany({
          where: { unidad_id: unitId, activo: true },
          select: { cama_id: true, codigo: true, ingresos: { where: { estado: "activo" }, select: { ingreso_id: true }, take: 1 } },
          orderBy: { codigo: "asc" },
        });

        const ocupadas = existentes.filter((cama) => cama.ingresos.length > 0);
        if (total < ocupadas.length) {
          throw conflict(
            `${unidad.nombre} tiene ${ocupadas.length} camas ocupadas: no puede quedarse con ${total}`,
          );
        }

        if (total > existentes.length) {
          let faltan = total - existentes.length;

          // Primero se REACTIVAN las que se dieron de baja aquí mismo, antes de
          // crear ninguna.
          //
          // No es un atajo, es obligatorio: la baja es lógica (`activo=false`)
          // pero `uq_cama_unidad_codigo` es (unidad_id, codigo) y NO distingue
          // activas de inactivas. Un INSERT de C-03 con una C-03 inactiva
          // delante choca contra el índice, y con `skipDuplicates` se descarta
          // en silencio: la unidad se quedaba con menos camas de las pedidas y
          // el endpoint respondía como si todo hubiera ido bien.
          const bajas = await tx.cama.findMany({
            where: { unidad_id: unitId, activo: false },
            select: { cama_id: true },
            orderBy: { codigo: "asc" },
            take: faltan,
          });
          if (bajas.length > 0) {
            await tx.cama.updateMany({
              where: { cama_id: { in: bajas.map((cama) => cama.cama_id) } },
              // Vuelve disponible: una cama que regresa al servicio no arrastra
              // el estado que tenía el día que se retiró.
              data: { activo: true, estado: "disponible" },
            });
            faltan -= bajas.length;
          }

          if (faltan > 0) {
            // Los códigos se numeran rellenando huecos, no continuando desde el
            // último, para que la unidad no acabe con una numeración con
            // agujeros que nadie sabe leer. Se comparan contra TODAS las camas
            // de la unidad —activas e inactivas— por lo mismo que arriba: el
            // índice único no distingue.
            const todas = await tx.cama.findMany({
              where: { unidad_id: unitId },
              select: { codigo: true },
            });
            const usados = new Set(todas.map((cama) => cama.codigo));
            const nuevas: { unidad_id: number; codigo: string }[] = [];
            for (let n = 1; nuevas.length < faltan; n += 1) {
              const codigo = `C-${String(n).padStart(2, "0")}`;
              if (!usados.has(codigo)) nuevas.push({ unidad_id: unitId, codigo });
            }
            // `skipDuplicates` queda solo para la carrera contra otra pestaña
            // haciendo esto mismo; la unicidad la garantiza el índice.
            await tx.cama.createMany({ data: nuevas, skipDuplicates: true });
          }
        }

        if (total < existentes.length) {
          // Se quitan las libres de código más alto: son las últimas que se
          // añadieron y las que menos historia arrastran.
          const libres = existentes.filter((cama) => cama.ingresos.length === 0);
          const sobran = libres.slice(-(existentes.length - total));
          await tx.cama.updateMany({
            where: { cama_id: { in: sobran.map((cama) => cama.cama_id) } },
            // Baja lógica, igual que el DELETE del CRUD: los ingresos pasados
            // apuntan a la cama y la bitácora la referencia por id.
            data: { activo: false },
          });
        }

        const camas = await tx.cama.count({ where: { unidad_id: unitId, activo: true } });
        return { unitId: String(unitId), unit: unidad.nombre, total: camas };
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
