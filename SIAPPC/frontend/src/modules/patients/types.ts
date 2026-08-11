// The hospital attends patients at numbered service modules. A patient is
// always assigned to exactly one of them.
export const serviceModules = ['KY-001', 'KY-004', 'KY-012', 'KY-019'] as const

export type ServiceModule = (typeof serviceModules)[number]

export type PatientStatus = 'waiting' | 'inService' | 'discharged'

export type Patient = {
  id: string
  name: string
  document: string
  module: ServiceModule
  status: PatientStatus
  arrivedAt: string
  reason: string
}

// El expediente exige sexo y fecha de nacimiento: la tabla `paciente` los pide
// y el backend los valida al crear.
export const sexes = ['M', 'F', 'O'] as const

export type Sex = (typeof sexes)[number]

export type NewPatient = {
  name: string
  document: string
  module: ServiceModule
  reason: string
  // Fecha ISO ("1990-05-14"), tal como la entrega un <input type="date">.
  fechaNacimiento: string
  sexo: Sex
}

// PATCH acepta cualquier subconjunto; con él la sala de espera mueve a un
// paciente de `waiting` a `inService` sin reenviar la ficha completa.
export type PatientChanges = Partial<NewPatient> & { status?: PatientStatus }
