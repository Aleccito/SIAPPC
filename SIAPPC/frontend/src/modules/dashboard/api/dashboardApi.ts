import { request } from '../../../shared/api/http'
import type { AssignedPatient, DeviceStatus } from '../types'

// Los dos únicos endpoints propios del tablero: el resto de los widgets
// consume las rutas que ya existían (/sensors, /reports, /users, /audit).

/**
 * Pacientes a cargo del usuario de la sesión. El servidor los saca del token,
 * así que no hay parámetro que permita pedir los de otra persona.
 */
export async function listAssignedPatients(): Promise<AssignedPatient[]> {
  return request<AssignedPatient[]>('/dashboard/assigned-patients')
}

/** Conectividad de los equipos a pie de cama. Requiere permiso `dispositivos`. */
export async function listDeviceStatus(): Promise<DeviceStatus[]> {
  return request<DeviceStatus[]>('/dashboard/devices')
}
