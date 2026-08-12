// Citas.
//
// Escrito a mano y no con la fábrica de CRUD por una sola razón: el listado se
// consulta por día (`?date=today`, que es lo que pide el tablero) y por
// profesional, y la fábrica solo sabe filtrar por un `where` fijo.
//
// El estado de la cita es una máquina pequeña —programada → confirmada →
// atendida, o cancelada / no_asistio en cualquier momento— pero NO se valida
// aquí: recepción corrige a mano lo que se registró mal, y una máquina de
// estados estricta convierte cada corrección en una llamada al soporte. Lo que
// sí se impide es solapar la agenda de un profesional.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { dayRange } from "../lib/dates.ts";
import { conflict, notFound, parseOr400 } from "../lib/http.ts";
import { appointmentStates } from "../types.ts";
import type { Appointment, AppointmentState } from "../types.ts";

const CITA_INCLUDE = {
  paciente: { select: { nombre: true, cedula: true } },
  usuario: { select: { nombre: true } },
  unidad: { select: { nombre: true } },
} as const;

type CitaRow = {
  cita_id: number;
  paciente_id: number;
  usuario_id: number;
  unidad_id: number | null;
  fecha_hora: Date;
  duracion_min: number;
  motivo: string;
  estado: AppointmentState;
  notas: string | null;
  paciente: { nombre: string; cedula: string };
  usuario: { nombre: string };
  unidad: { nombre: string } | null;
};

function toAppointment(row: CitaRow): Appointment {
  return {
    id: String(row.cita_id),
    patientId: String(row.paciente_id),
    patientName: row.paciente.nombre,
    patientDocument: row.paciente.cedula,
    professionalId: String(row.usuario_id),
    professionalName: row.usuario.nombre,
    unitId: row.unidad_id === null ? null : String(row.unidad_id),
    unit: row.unidad?.nombre ?? null,
    at: row.fecha_hora.toISOString(),
    durationMin: row.duracion_min,
    reason: row.motivo,
    state: row.estado,
    notes: row.notas,
  };
}

const idSchema = z.coerce.number().int().positive();

const listQuerySchema = z.object({
  /** `today` o `YYYY-MM-DD`. Ausente = la agenda completa, paginada. */
  date: z.string().optional(),
  state: z.enum(appointmentStates).optional(),
  professionalId: idSchema.optional(),
  patientId: idSchema.optional(),
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

const createSchema = z.object({
  patientId: idSchema,
  professionalId: idSchema,
  unitId: idSchema.nullish(),
  /** Instante completo en ISO: la hora es parte del dato, no un campo aparte. */
  at: z.string().datetime({ offset: true }),
  durationMin: z.coerce.number().int().min(5).max(480).default(30),
  reason: z.string().min(1).max(255),
  notes: z.string().max(20_000).nullish(),
});

const patchSchema = createSchema
  .partial()
  .extend({ state: z.enum(appointmentStates).optional() })
  .refine((value) => Object.keys(value).length > 0, { message: "No hay nada que cambiar" });

/** Las que ya no ocupan hueco en la agenda: sobre ellas no hay solape. */
const ESTADOS_LIBERADOS: AppointmentState[] = ["cancelada", "no_asistio"];

export default async function appointmentsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  const paramId = (req: FastifyRequest) => parseOr400(idSchema, (req.params as { id: string }).id);

  // Acotada al hospital de la sesión, como la lista.
  async function findCita(id: number, req: FastifyRequest): Promise<CitaRow> {
    const row = (await prisma.cita.findFirst({
      where: { cita_id: id, paciente: { hospital_id: req.hospitalId } },
      include: CITA_INCLUDE,
    })) as CitaRow | null;
    if (!row) throw notFound(`No existe cita con id ${id}`);
    return row;
  }

  /**
   * Rechaza dos citas del mismo profesional que se pisan.
   *
   * El solape se calcula con los extremos y no comparando solo el inicio: una
   * cita de 60 minutos y otra que empieza 30 minutos después no comparten hora
   * de inicio y aun así son la misma persona en dos sitios.
   */
  async function checkSolape(
    profesionalId: number,
    inicio: Date,
    duracionMin: number,
    excluir: number | null,
  ): Promise<void> {
    const fin = new Date(inicio.getTime() + duracionMin * 60_000);

    // El filtro por `fecha_hora` acota la búsqueda al día con el índice
    // `ix_cita_usuario_fecha`; el solape exacto se decide en JavaScript porque
    // el fin de la otra cita es una suma de dos columnas y no una columna.
    const delDia = await prisma.cita.findMany({
      where: {
        usuario_id: profesionalId,
        estado: { notIn: ESTADOS_LIBERADOS },
        fecha_hora: {
          gte: new Date(inicio.getTime() - 480 * 60_000),
          lt: fin,
        },
        ...(excluir === null ? {} : { NOT: { cita_id: excluir } }),
      },
      select: { cita_id: true, fecha_hora: true, duracion_min: true },
    });

    const choque = delDia.find((otra) => {
      const otroFin = new Date(otra.fecha_hora.getTime() + otra.duracion_min * 60_000);
      return otra.fecha_hora < fin && inicio < otroFin;
    });

    if (choque) {
      throw conflict(
        `El profesional ya tiene la cita #${choque.cita_id} a esa hora`,
      );
    }
  }

  app.get(
    "/appointments",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req, reply) => {
      const { date, state, professionalId, patientId, page, pageSize } = parseOr400(
        listQuerySchema,
        req.query,
      );

      const where = {
        paciente: { hospital_id: req.hospitalId },
        ...(date ? { fecha_hora: dayRange(date) } : {}),
        ...(state ? { estado: state } : {}),
        ...(professionalId ? { usuario_id: professionalId } : {}),
        ...(patientId ? { paciente_id: patientId } : {}),
      };
      // Anotado, y no inferido del ternario: sin el tipo, las dos ramas dan
      // objetos de forma distinta y el `skip` opcional no encaja al esparcirlo.
      const pagination: { skip?: number; take?: number } = pageSize
        ? { skip: page * pageSize, take: pageSize }
        : {};

      const [rows, total] = await Promise.all([
        prisma.cita.findMany({
          where,
          include: CITA_INCLUDE,
          // Ascendente y no descendente como los ingresos: una agenda se lee de
          // la próxima a la última, no al revés.
          orderBy: { fecha_hora: "asc" },
          ...pagination,
        }),
        prisma.cita.count({ where }),
      ]);

      reply.header("X-Total-Count", String(total));
      return (rows as CitaRow[]).map(toAppointment);
    },
  );

  app.get(
    "/appointments/:id",
    { preHandler: [app.requirePermission("admisiones", "ver")] },
    async (req) => toAppointment(await findCita(paramId(req), req)),
  );

  app.post(
    "/appointments",
    { preHandler: [app.requirePermission("admisiones", "crear")] },
    async (req, reply) => {
      const input = parseOr400(createSchema, req.body);
      const at = new Date(input.at);

      // Paciente y profesional, los dos de este hospital.
      const paciente = await prisma.paciente.findFirst({
        where: { paciente_id: input.patientId, activo: true, hospital_id: req.hospitalId },
        select: { nombre: true },
      });
      if (!paciente) throw notFound(`No existe paciente con id ${input.patientId}`);

      const profesional = await prisma.usuario.findFirst({
        where: { usuario_id: input.professionalId, activo: true, hospital_id: req.hospitalId },
        select: { nombre: true },
      });
      if (!profesional) throw notFound(`No existe usuario con id ${input.professionalId}`);

      await checkSolape(input.professionalId, at, input.durationMin, null);

      const row = await prisma.$transaction(async (tx) => {
        const creada = await tx.cita.create({
          data: {
            paciente_id: input.patientId,
            usuario_id: input.professionalId,
            unidad_id: input.unitId ?? null,
            fecha_hora: at,
            duracion_min: input.durationMin,
            motivo: input.reason,
            notas: input.notes ?? null,
          },
          include: CITA_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "cita",
          registroId: creada.cita_id,
          accion: "INSERT",
          observacion: `agendó una cita de ${paciente.nombre} con ${profesional.nombre}`,
        });
        return creada as CitaRow;
      });

      reply.header("Location", `/appointments/${row.cita_id}`);
      return reply.code(201).send(toAppointment(row));
    },
  );

  app.patch(
    "/appointments/:id",
    { preHandler: [app.requirePermission("admisiones", "editar")] },
    async (req) => {
      const id = paramId(req);
      const input = parseOr400(patchSchema, req.body);
      const antes = await findCita(id, req);

      // Reprogramar es cambiar hora, duración o profesional; cualquiera de los
      // tres obliga a revisar el solape con los valores que quedarán.
      const profesionalId = input.professionalId ?? antes.usuario_id;
      const at = input.at ? new Date(input.at) : antes.fecha_hora;
      const duracion = input.durationMin ?? antes.duracion_min;
      const estado = input.state ?? antes.estado;

      if (!ESTADOS_LIBERADOS.includes(estado)) {
        await checkSolape(profesionalId, at, duracion, id);
      }

      const row = await prisma.$transaction(async (tx) => {
        const actualizada = await tx.cita.update({
          where: { cita_id: id },
          data: {
            ...(input.patientId !== undefined ? { paciente_id: input.patientId } : {}),
            ...(input.professionalId !== undefined ? { usuario_id: input.professionalId } : {}),
            ...(input.unitId !== undefined ? { unidad_id: input.unitId ?? null } : {}),
            ...(input.at !== undefined ? { fecha_hora: at } : {}),
            ...(input.durationMin !== undefined ? { duracion_min: input.durationMin } : {}),
            ...(input.reason !== undefined ? { motivo: input.reason } : {}),
            ...(input.notes !== undefined ? { notas: input.notes ?? null } : {}),
            ...(input.state !== undefined ? { estado: input.state } : {}),
          },
          include: CITA_INCLUDE,
        });

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "cita",
          registroId: id,
          accion: "UPDATE",
          observacion:
            input.state !== undefined && input.state !== antes.estado
              ? `marcó la cita de ${antes.paciente.nombre} como ${input.state}`
              : `actualizó la cita de ${antes.paciente.nombre}`,
        });
        return actualizada as CitaRow;
      });

      return toAppointment(row);
    },
  );

  // Sin DELETE, igual que en los ingresos: una cita que no se atendió es
  // `cancelada` o `no_asistio`, y esa diferencia es justo lo que se quiere
  // poder contar al final del mes.
}
