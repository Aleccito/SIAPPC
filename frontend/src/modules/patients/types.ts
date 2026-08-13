// The hospital attends patients at numbered service modules. A patient is
// always assigned to exactly one of them.
export const serviceModules = ['KY-001', 'KY-004', 'KY-012', 'KY-019'] as const

export type ServiceModule = (typeof serviceModules)[number]

export type PatientStatus = 'waiting' | 'inService' | 'discharged'

// El expediente exige sexo y fecha de nacimiento: la tabla `paciente` los pide
// y el backend los valida al crear.
export const sexes = ['M', 'F', 'O'] as const

export type Sex = (typeof sexes)[number]

// Los grupos sanguíneos llegan con el valor que guarda la base ("A+", "O-"), no
// con el nombre que Prisma les da en TypeScript. Ver backend/src/types.ts.
export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export type BloodType = (typeof bloodTypes)[number]

export type Patient = {
  id: string
  name: string
  document: string
  module: ServiceModule
  status: PatientStatus
  arrivedAt: string
  reason: string
  // Fecha civil sin hora ("1990-05-14"): la columna es DATE. La edad se calcula
  // al pintarla, no se guarda.
  birthDate: string
  sex: Sex
  bloodType: BloodType | null
  emergencyContact: string | null
}

export type NewPatient = {
  name: string
  document: string
  module: ServiceModule
  reason: string
  // Fecha ISO ("1990-05-14"), tal como la entrega un <input type="date">. El
  // servidor la devuelve con la hora y el desfase del hospital.
  fechaNacimiento: string
  sexo: Sex
  // Opcionales: de un paciente inconsciente pueden no conocerse al ingresar.
  tipoSangre?: BloodType | null
  contactoEmergencia?: string | null
}

// PATCH acepta cualquier subconjunto; con él la sala de espera mueve a un
// paciente de `waiting` a `inService` sin reenviar la ficha completa.
export type PatientChanges = Partial<NewPatient> & { status?: PatientStatus }
