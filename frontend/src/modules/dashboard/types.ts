import type { AlertSeverity } from '../sensors/types'
import type { PatientStatus, ServiceModule } from '../patients/types'
import type { AdmissionType } from '../admissions/types'

// Espejo de backend/src/types.ts (AssignedPatient, DeviceStatus). El backend
// produce exactamente estas formas; si una cambia allá, cambia aquí.

export const deviceStates = ['activo', 'inactivo', 'mantenimiento', 'baja'] as const
export type DeviceState = (typeof deviceStates)[number]

export type AssignedPatient = {
  id: string
  name: string
  document: string
  module: ServiceModule | null
  status: PatientStatus
  arrivedAt: string
  reason: string
  assignedAt: string
  /** Código del dispositivo a pie de cama, o null si no tiene equipo. */
  device: string | null
  deviceState: DeviceState | null
  openAlerts: number
  worstSeverity: AlertSeverity | null
  /** `expediente_clinico.expediente_id`, o null si aún no tiene expediente. */
  record: string | null
  /** Unidad y cama del ingreso activo; null si no lo tiene o si no hay cama. */
  unit: string | null
  bed: string | null
  /** Fecha civil ("1990-05-14T00:00:00-05:00"). La edad se calcula al pintar. */
  birthDate: string
  /**
   * `ingreso.tipo` del ingreso activo, o null si no tiene ninguno abierto. El
   * estado no viaja: la consulta ya filtra por `activo`.
   */
  admissionType: AdmissionType | null
  admittedAt: string | null
  /** Escala de Glasgow (3 a 15) de la exploración física, si está registrada. */
  glasgow: number | null
  /** Si ya tiene exploración física: `false` es evaluación primaria pendiente. */
  examined: boolean
  vitals: PatientVitals
}

/**
 * Último valor de cada signo vital. Solo los que el monitor publica: la presión
 * arterial no está porque `lectura.valor` es un escalar y una PA es un par
 * sistólica/diastólica — no cabe en el modelo.
 */
export type PatientVitals = {
  hr: number | null
  spo2: number | null
  at: string | null
}

export type DeviceStatus = {
  code: string
  model: string | null
  state: DeviceState
  patient: string | null
  sensors: number
  activeSensors: number
  lastReadingAt: string | null
}
