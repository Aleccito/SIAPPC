import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { registerCrud } from "../lib/crud.ts";
import { serviceModules } from "../types.ts";
import type { PacienteRow, Patient } from "../types.ts";

function toPatient(row: PacienteRow): Patient {
  return {
    id: String(row.paciente_id),
    name: row.nombre,
    document: row.cedula,
    module: (row.modulo ?? serviceModules[0]) as Patient["module"],
    status: row.estado,
    arrivedAt: new Date(row.fecha_llegada).toISOString(),
    reason: row.motivo_consulta ?? "",
  };
}

const patientSchema = z.object({
  name: z.string().min(1).max(150),
  document: z.string().min(1).max(30),
  module: z.enum(serviceModules),
  reason: z.string().min(1).max(255),
  hospitalId: z.number().int().positive(),
  fechaNacimiento: z.string(), // ISO date, e.g. "1990-05-14"
  sexo: z.enum(["M", "F", "O"]),
  status: z.enum(["waiting", "inService", "discharged"]).default("waiting"),
});

// PATCH acepta cualquier subconjunto. Es el verbo con el que la sala de espera
// mueve a un paciente de `waiting` a `inService` sin reenviar su expediente.
const patientPatchSchema = patientSchema.partial();

type PatientInput = z.infer<typeof patientSchema>;

function toRow(input: Partial<PatientInput>): Record<string, unknown> {
  return {
    ...(input.name !== undefined ? { nombre: input.name } : {}),
    ...(input.document !== undefined ? { cedula: input.document } : {}),
    ...(input.module !== undefined ? { modulo: input.module } : {}),
    ...(input.reason !== undefined ? { motivo_consulta: input.reason } : {}),
    ...(input.hospitalId !== undefined ? { hospital_id: input.hospitalId } : {}),
    ...(input.fechaNacimiento !== undefined
      ? { fecha_nacimiento: new Date(input.fechaNacimiento) }
      : {}),
    ...(input.sexo !== undefined ? { sexo: input.sexo } : {}),
    ...(input.status !== undefined ? { estado: input.status } : {}),
  };
}

export default async function patientsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  registerCrud<PacienteRow, Patient, PatientInput, Partial<PatientInput>>(app, {
    path: "/patients",
    model: "paciente",
    idField: "paciente_id",
    auditEntity: "paciente",
    // `paciente` no tiene módulo propio en la tabla `permiso`; el acceso a la
    // sala de espera es el mismo de siempre: tener sesión.
    permissions: { ver: null, crear: null, editar: null, eliminar: null },
    createSchema: patientSchema,
    updateSchema: patientPatchSchema,
    query: { where: { activo: true }, orderBy: { fecha_llegada: "desc" } },
    // Un paciente no se borra: su historia clínica y su bitácora lo
    // referencian, y el alta es un estado, no una desaparición.
    softDelete: { field: "activo", inactiveValue: false },
    toDto: toPatient,
    toCreateData: (input) => toRow(input),
    toUpdateData: (input) => toRow(input),
    describe: {
      // Sin el motivo de consulta: es dato clínico y vive en `paciente`, con
      // los permisos de esa tabla. La bitácora dice quién y cuándo, no el
      // cuadro del paciente.
      create: (row) =>
        `registró la llegada de ${row.nombre} (${row.cedula}) al módulo ${row.modulo}`,
      update: (row) => `actualizó el registro de ${row.nombre} (${row.cedula})`,
      remove: (row) => `dio de baja el registro de ${row.nombre} (${row.cedula})`,
    },
  });
}
