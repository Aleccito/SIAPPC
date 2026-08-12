import type { AlertSeverity } from '../sensors/types'
import type { PatientStatus, ServiceModule } from '../patients/types'

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
