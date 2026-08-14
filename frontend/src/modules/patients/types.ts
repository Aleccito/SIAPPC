// Los "módulos de atención" (KY-001, KY-004…) ya no existen en la aplicación.
// Eran una lista fija de códigos que no describía dónde está el paciente, y lo
// que hace falta saber es su CAMA. La columna `paciente.modulo` sigue en la
// base con lo que se registró en su día, pero ninguna pantalla la pide ni la
// enseña, y la API ya no la entrega.

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

// El módulo de atención NO va aquí: el alta dejó de pedirlo. Ver el comentario
// de `patientSchema` en backend/src/routes/patients.ts.
export type NewPatient = {
  name: string
  document: string
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
