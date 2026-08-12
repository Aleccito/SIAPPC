// Ingresos y egresos.
//
// NO pasa por la fábrica de CRUD (lib/crud.ts) porque un ingreso arrastra el
// estado de una cama, y eso son reglas, no configuración:
//
//   1. Asignar una cama la pone `ocupada`. Si ya lo estaba, 409: dos pacientes
//      en la misma cama es el error que este endpoint existe para impedir.
//   2. El egreso no es un PATCH del estado: es POST /admissions/:id/discharge,
//      que cierra el ingreso y libera la cama a `limpieza` en la MISMA
//      transacción. Separarlos deja camas ocupadas por pacientes que ya se
//      fueron cada vez que falle la segunda mitad.
//   3. Un ingreso no se borra. Cancelarlo es un estado, y la cama vuelve a
//      quedar libre.
//
// El egreso tampoco toca `paciente.estado`: la sala de espera (`waiting` /
// `inService` / `discharged`) es otro ciclo, el del módulo de atención, y
// moverlo desde aquí pisaría lo que hace routes/patients.ts.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { dayRange } from "../lib/dates.ts";
import { conflict, notFound, parseOr400 } from "../lib/http.ts";
import { admissionStates, admissionTypes } from "../types.ts";
import type { Admission, AdmissionState, AdmissionType } from "../types.ts";

const INGRESO_INCLUDE = {
  paciente: { select: { nombre: true, cedula: true } },
  cama: { select: { codigo: true, unidad_id: true, unidad: { select: { nombre: true } } } },
  registrante: { select: { nombre: true } },
} as const;

type IngresoRow = {
  ingreso_id: number;
  paciente_id: number;
  cama_id: number | null;
  tipo: AdmissionType;
  estado: AdmissionState;
  motivo: string;
  fecha_ingreso: Date;
  fecha_egreso: Date | null;
  resumen_egreso: string | null;
  registrado_por: number | null;
  paciente: { nombre: string; cedula: string };
  cama: { codigo: string; unidad_id: number; unidad: { nombre: string } } | null;
  registrante: { nombre: string } | null;
};

function toAdmission(row: IngresoRow): Admission {
  return {
    id: String(row.ingreso_id),
    patientId: String(row.paciente_id),
    patientName: row.paciente.nombre,
    patientDocument: row.paciente.cedula,
    bedId: row.cama_id === null ? null : String(row.cama_id),
    bedCode: row.cama?.codigo ?? null,
    unitId: row.cama ? String(row.cama.unidad_id) : null,
    unit: row.cama?.unidad.nombre ?? null,
    type: row.tipo,
    state: row.estado,
    reason: row.motivo,
    admittedAt: row.fecha_ingreso.toISOString(),
    dischargedAt: row.fecha_egreso ? row.fecha_egreso.toISOString() : null,
    dischargeSummary: row.resumen_egreso,
    recordedById: row.registrado_por === null ? null : String(row.registrado_por),
    recordedByName: row.registrante?.nombre ?? null,
  };
}

const idSchema = z.coerce.number().int().positive();

const listQuerySchema = z.object({
  /** `today` o `YYYY-MM-DD`. Ausente = todos los ingresos, paginados. */
  date: z.string().optional(),
  state: z.enum(admissionStates).optional(),
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

const createSchema = z.object({
  patientId: idSchema,
  bedId: idSchema.nullish(),
  type: z.enum(admissionTypes).default("urgencia"),
  reason: z.string().min(1).max(255),
});

// Solo lo que se corrige en un ingreso abierto. El egreso tiene su propia ruta
// y el paciente no se cambia: eso sería otro ingreso.
const patchSchema = z
  .object({
    bedId: idSchema.nullish(),
    type: z.enum(admissionTypes).optional(),
    reason: z.string().min(1).max(255).optional(),
    state: z.enum(["activo", "cancelado"] as const).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "No hay nada que cambiar",
  });

const dischargeSchema = z.object({
  summary: z.string().max(20_000).nullish(),
});

export default async function admissionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  const paramId = (req: FastifyRequest) => parseOr400(idSchema, (req.params as { id: string }).id);

  async function findAdmission(id: number): Promise<IngresoRow> {
    const row = (await prisma.ingreso.findUnique({
      where: { ingreso_id: id },
      include: INGRESO_INCLUDE,
    })) as IngresoRow | null;
    if (!row) throw notFound(`No existe ingreso con id ${id}`);
    return row;
  }

  /**
   * Toma la cama para este ingreso, o falla.
   *
   * Se llama SIEMPRE dentro de la transacción del ingreso: comprobar fuera y
   * escribir después deja la ventana en la que dos altas simultáneas ven la
   * misma cama libre.
   */
  async function ocuparCama(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    camaId: number,
    ingresoActual: number | null,
  ): Promise<void> {
    const cama = await tx.cama.findUnique({
      where: { cama_id: camaId },
      select: { codigo: true, activo: true },
    });
    if (!cama?.activo) throw notFound(`No existe cama con id ${camaId}`);

    const ocupante = await tx.ingreso.findFirst({
      where: {
        cama_id: camaId,
        estado: "activo",
        ...(ingresoActual === null ? {} : { NOT: { ingreso_id: ingresoActual } }),
      },
      select: { ingreso_id: true },
    });
    if (ocupante) {
      throw conflict(`La cama ${cama.codigo} ya está ocupada por otro ingreso`);
    }

    await tx.cama.update({ where: { cama_id: camaId }, data: { estado: "ocupada" } });
  }

  /** Deja la cama a punto para el siguiente: limpieza, no disponible. */
  async function liberarCama(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    camaId: number,
    estado: "limpieza" | "disponible",
  ): Promise<void> {
    await tx.cama.update({ where: { cama_id: camaId }, data: { estado } });
  }

  // Listado. Con `?date` es el día —lo que pide el tablero administrativo—; sin
  // él, la lista completa paginada, que es lo que pide la pantalla de gestión.
  app.get(
    "/admissions",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req, reply) => {
      const { date, state, page, pageSize } = parseOr400(listQuerySchema, req.query);

      const where = {
        ...(date ? { fecha_ingreso: dayRange(date) } : {}),
        ...(state ? { estado: state } : {}),
      };
      // Anotado, y no inferido del ternario: sin el tipo, las dos ramas dan
      // objetos de forma distinta y el `skip` opcional no encaja al esparcirlo.
      const pagination: { skip?: number; take?: number } = pageSize
        ? { skip: page * pageSize, take: pageSize }
        : {};

      const [rows, total] = await Promise.all([
        prisma.ingreso.findMany({
          where,
          include: INGRESO_INCLUDE,
          orderBy: { fecha_ingreso: "desc" },
          ...pagination,
        }),
        prisma.ingreso.count({ where }),
      ]);

      reply.header("X-Total-Count", String(total));
      return (rows as IngresoRow[]).map(toAdmission);
    },
  );

  // Egresos del día. Es la misma tabla mirada por la otra fecha, y por eso no
  // hay tabla `egreso`: un egreso no existe sin su ingreso.
  app.get(
    "/discharges",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req, reply) => {
      const { date, page, pageSize } = parseOr400(listQuerySchema, req.query);

      const where = {
        estado: "egresado" as const,
        ...(date ? { fecha_egreso: dayRange(date) } : { fecha_egreso: { not: null } }),
      };
      // Anotado, y no inferido del ternario: sin el tipo, las dos ramas dan
      // objetos de forma distinta y el `skip` opcional no encaja al esparcirlo.
      const pagination: { skip?: number; take?: number } = pageSize
        ? { skip: page * pageSize, take: pageSize }
        : {};

      const [rows, total] = await Promise.all([
        prisma.ingreso.findMany({
          where,
          include: INGRESO_INCLUDE,
          orderBy: { fecha_egreso: "desc" },
          ...pagination,
        }),
        prisma.ingreso.count({ where }),
      ]);

      reply.header("X-Total-Count", String(total));
      return (rows as IngresoRow[]).map(toAdmission);
    },
  );

  app.get(
    "/admissions/:id",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req) => toAdmission(await findAdmission(paramId(req))),
  );

  app.post(
    "/admissions",
    { preHandler: [app.requirePermission("admisiones", "crear")] },
    async (req, reply) => {
      const input = parseOr400(createSchema, req.body);

      const paciente = await prisma.paciente.findFirst({
        where: { paciente_id: input.patientId, activo: true },
        select: { nombre: true },
      });
      if (!paciente) throw notFound(`No existe paciente con id ${input.patientId}`);

      // Un paciente no puede estar internado dos veces a la vez. Se comprueba
      // aquí y no con un índice único porque la unicidad es sobre "los activos"
      // y MariaDB no tiene índices parciales.
      const abierto = await prisma.ingreso.findFirst({
        where: { paciente_id: input.patientId, estado: "activo" },
        select: { ingreso_id: true },
      });
      if (abierto) {
        throw conflict(`${paciente.nombre} ya tiene un ingreso activo (#${abierto.ingreso_id})`);
      }

      const row = await prisma.$transaction(async (tx) => {
        if (input.bedId) await ocuparCama(tx, input.bedId, null);

        const creado = await tx.ingreso.create({
          data: {
            paciente_id: input.patientId,
            cama_id: input.bedId ?? null,
            tipo: input.type,
            motivo: input.reason,
            registrado_por: Number(req.user.sub),
          },
          include: INGRESO_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "ingreso",
          registroId: creado.ingreso_id,
          accion: "INSERT",
          observacion: `registró el ingreso de ${paciente.nombre}${
            creado.cama ? ` en la cama ${creado.cama.codigo}` : " sin cama asignada"
          }`,
        });
        return creado as IngresoRow;
      });

      reply.header("Location", `/admissions/${row.ingreso_id}`);
      return reply.code(201).send(toAdmission(row));
    },
  );

  app.patch(
    "/admissions/:id",
    { preHandler: [app.requirePermission("admisiones", "editar")] },
    async (req) => {
      const id = paramId(req);
      const input = parseOr400(patchSchema, req.body);
      const antes = await findAdmission(id);

      if (antes.estado === "egresado") {
        throw conflict("El ingreso ya está cerrado: un egreso no se reabre");
      }

      const row = await prisma.$transaction(async (tx) => {
        // Cambio de cama: se toma la nueva y se suelta la anterior. El orden
        // importa —si la nueva está ocupada, la anterior no se ha tocado.
        if (input.bedId !== undefined) {
          if (input.bedId) await ocuparCama(tx, input.bedId, id);
          if (antes.cama_id && antes.cama_id !== input.bedId) {
            await liberarCama(tx, antes.cama_id, "limpieza");
          }
        }

        // Cancelar suelta la cama sin pasar por limpieza: nadie la usó.
        if (input.state === "cancelado") {
          const cama = input.bedId === undefined ? antes.cama_id : input.bedId;
          if (cama) await liberarCama(tx, cama, "disponible");
        }

        const actualizado = await tx.ingreso.update({
          where: { ingreso_id: id },
          data: {
            ...(input.bedId !== undefined ? { cama_id: input.bedId ?? null } : {}),
            ...(input.type !== undefined ? { tipo: input.type } : {}),
            ...(input.reason !== undefined ? { motivo: input.reason } : {}),
            ...(input.state !== undefined ? { estado: input.state } : {}),
          },
          include: INGRESO_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "ingreso",
          registroId: id,
          accion: "UPDATE",
          observacion:
            input.state === "cancelado"
              ? `canceló el ingreso de ${antes.paciente.nombre}`
              : `actualizó el ingreso de ${antes.paciente.nombre}`,
        });
        return actualizado as IngresoRow;
      });

      return toAdmission(row);
    },
  );

  // El egreso: cierra el ingreso y libera la cama, o no hace ninguna de las dos.
  app.post(
    "/admissions/:id/discharge",
    { preHandler: [app.requirePermission("admisiones", "editar")] },
    async (req) => {
      const id = paramId(req);
      const { summary } = parseOr400(dischargeSchema, req.body ?? {});
      const antes = await findAdmission(id);

      if (antes.estado !== "activo") {
        throw conflict(`El ingreso #${id} no está activo: está ${antes.estado}`);
      }

      const row = await prisma.$transaction(async (tx) => {
        if (antes.cama_id) await liberarCama(tx, antes.cama_id, "limpieza");

        const cerrado = await tx.ingreso.update({
          where: { ingreso_id: id },
          data: {
            estado: "egresado",
            fecha_egreso: new Date(),
            resumen_egreso: summary ?? null,
          },
          include: INGRESO_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "ingreso",
          registroId: id,
          accion: "UPDATE",
          observacion: `dio el egreso de ${antes.paciente.nombre}`,
        });
        return cerrado as IngresoRow;
      });

      return toAdmission(row);
    },
  );

  // Sin DELETE a propósito: un ingreso es un hecho asistencial. Lo que en la
  // pantalla es "eliminar" es PATCH con `state: "cancelado"`, y ahí queda quién
  // lo canceló y cuándo.
}
