// Espejo de backend/src/types.ts (bloque "Admisión"). Las claves van en inglés
// camelCase como el resto de la API; los valores de los enumerados van en
// español, tal cual están en la base.

export const bedStates = ['disponible', 'ocupada', 'limpieza', 'mantenimiento'] as const

export type BedState = (typeof bedStates)[number]

export type Bed = {
  id: string
  unitId: string
  unit: string
  code: string
  type: string | null
  state: BedState
  /** Quién la ocupa ahora, o null. */
  patientId: string | null
  patientName: string | null
}

export type NewBed = {
  unitId: number
  code: string
  type?: string | null
  state?: BedState
}

/** Una fila de `GET /beds/occupancy`. */
export type BedOccupancy = {
  unitId: string
  unit: string
  total: number
  occupied: number
  available: number
  /** Limpieza y mantenimiento juntas. */
  outOfService: number
  /** Ocupadas sobre el total, 0–1. */
  rate: number
}

/** Lo que devuelve PUT /beds/capacity: cuántas camas tiene la unidad al final. */
export type BedCapacity = {
  unitId: string
  unit: string
  total: number
}

export const admissionTypes = ['urgencia', 'programado', 'traslado'] as const

export type AdmissionType = (typeof admissionTypes)[number]

export const admissionStates = ['activo', 'egresado', 'cancelado'] as const

export type AdmissionState = (typeof admissionStates)[number]

export type Admission = {
  id: string
  patientId: string
  patientName: string
  patientDocument: string
  bedId: string | null
  bedCode: string | null
  unitId: string | null
  unit: string | null
  type: AdmissionType
  state: AdmissionState
  reason: string
  admittedAt: string
  dischargedAt: string | null
  dischargeSummary: string | null
  recordedById: string | null
  recordedByName: string | null
}

export type NewAdmission = {
  patientId: number
  bedId?: number | null
  type?: AdmissionType
  reason: string
}

export const appointmentStates = [
  'programada',
  'confirmada',
  'atendida',
  'cancelada',
  'no_asistio',
] as const

export type AppointmentState = (typeof appointmentStates)[number]

export type Appointment = {
  id: string
  patientId: string
  patientName: string
  patientDocument: string
  /** Con quién es la cita, no quién la agendó. */
  professionalId: string
  professionalName: string
  unitId: string | null
  unit: string | null
  at: string
  durationMin: number
  reason: string
  state: AppointmentState
  notes: string | null
}

export type NewAppointment = {
  patientId: number
  professionalId: number
  unitId?: number | null
  /** Instante completo en ISO con desfase, tal como lo pide el backend. */
  at: string
  durationMin?: number
  reason: string
  notes?: string | null
}
