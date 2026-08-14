import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { registerCrud } from "../lib/crud.ts";
import { civilDateIso } from "../lib/dates.ts";
import { bloodTypes, sexes } from "../types.ts";
import type { BloodType, PacienteRow, Patient } from "../types.ts";
import type { TipoSangre } from "../generated/prisma/enums.ts";

// Prisma nombra los valores del enumerado `A_POS` porque un identificador de
// TypeScript no admite '+'; MariaDB guarda "A+" (ver `@map` en schema.prisma).
// El DTO lleva el valor de la base, así que la traducción vive aquí y en un solo
// sitio.
const BLOOD_TYPE_VALUE: Record<TipoSangre, BloodType> = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
};

// El camino de vuelta, para escribir: el cliente manda "A+" y Prisma espera
// `A_POS`. Se deriva de la tabla de arriba para que no puedan discrepar.
const BLOOD_TYPE_ENUM = Object.fromEntries(
  Object.entries(BLOOD_TYPE_VALUE).map(([nombre, valor]) => [valor, nombre]),
) as Record<BloodType, TipoSangre>;

function toPatient(row: PacienteRow): Patient {
  return {
    id: String(row.paciente_id),
    name: row.nombre,
    document: row.cedula,
    status: row.estado,
    arrivedAt: new Date(row.fecha_llegada).toISOString(),
    reason: row.motivo_consulta ?? "",
    birthDate: civilDateIso(row.fecha_nacimiento),
    sex: row.sexo,
    bloodType: row.tipo_sangre ? BLOOD_TYPE_VALUE[row.tipo_sangre] : null,
    emergencyContact: row.contacto_emergencia,
  };
}

const patientSchema = z.object({
  name: z.string().min(1).max(150),
  document: z.string().min(1).max(30),
  // El módulo de atención ya NO se pide al registrar. Se dejó de preguntar
  // porque el alta ocurre en urgencias, cuando lo que se sabe del paciente es
  // quién es y por qué viene: el módulo es una decisión de organización
  // posterior, y obligar a elegir uno en ese momento solo conseguía que se
  // eligiera el primero de la lista sin mirarlo.
  //
  // La columna `paciente.modulo` sigue existiendo y es nulable: los pacientes
  // registrados antes conservan el suyo. Lo que desaparece es la captura, no el
  // dato histórico. Por eso tampoco está en `toRow`: nada lo escribe ya.
  reason: z.string().min(1).max(255),
  // Sin `hospitalId`: lo pone el servidor desde la sesión (req.hospitalId, ver
  // src/plugins/auth.ts). Un paciente se da de alta en el hospital de quien lo
  // registra, y eso no es un campo del formulario.
  fechaNacimiento: z.string(), // ISO date, e.g. "1990-05-14"
  sexo: z.enum(sexes),
  // Opcionales: no siempre se conocen al ingresar a alguien inconsciente, y
  // exigirlos impediría registrar precisamente al paciente más grave.
  tipoSangre: z.enum(bloodTypes).nullish(),
  contactoEmergencia: z.string().max(150).nullish(),
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
    ...(input.reason !== undefined ? { motivo_consulta: input.reason } : {}),
    ...(input.fechaNacimiento !== undefined
      ? { fecha_nacimiento: new Date(input.fechaNacimiento) }
      : {}),
    ...(input.sexo !== undefined ? { sexo: input.sexo } : {}),
    ...(input.tipoSangre !== undefined
      ? { tipo_sangre: input.tipoSangre === null ? null : BLOOD_TYPE_ENUM[input.tipoSangre] }
      : {}),
    ...(input.contactoEmergencia !== undefined
      ? { contacto_emergencia: input.contactoEmergencia ?? null }
      : {}),
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
    // El hospital NO es opcional en ninguna consulta: sale de la sesión y se
    // aplica siempre, no solo cuando alguien lo pide. Lo mismo vale para la
    // ficha, la edición y la baja, porque las tres pasan antes por esta
    // condición: un paciente de otro hospital responde 404, y no 403, porque
    // decir "existe pero no es tuyo" ya filtra que ese documento está
    // registrado en algún sitio.
    query: {
      where: (req) => ({ activo: true, hospital_id: req.hospitalId }),
      orderBy: { fecha_llegada: "desc" },
    },
    // Un paciente no se borra: su historia clínica y su bitácora lo
    // referencian, y el alta es un estado, no una desaparición.
    softDelete: { field: "activo", inactiveValue: false },
    toDto: toPatient,
    // El hospital solo se fija al crear: mover un paciente de hospital sería
    // un traslado, no una edición de su ficha.
    toCreateData: (input, req) => ({ ...toRow(input), hospital_id: req.hospitalId }),
    toUpdateData: (input) => toRow(input),
    describe: {
      // Sin el motivo de consulta: es dato clínico y vive en `paciente`, con
      // los permisos de esa tabla. La bitácora dice quién y cuándo, no el
      // cuadro del paciente.
      // Sin el módulo: ya no se captura al registrar, así que la frase decía
      // "al módulo null" en toda alta nueva.
      create: (row) => `registró la llegada de ${row.nombre} (${row.cedula})`,
      update: (row) => `actualizó el registro de ${row.nombre} (${row.cedula})`,
      remove: (row) => `dio de baja el registro de ${row.nombre} (${row.cedula})`,
    },
  });
}
