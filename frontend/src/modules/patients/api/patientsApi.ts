import { request, requestList } from '../../../shared/api/http'
import type { ListResult } from '../../../shared/api/http'
import type { CareAssignment, NewPatient, Patient, PatientChanges } from '../types'

export type PatientQuery = {
  page?: number
  pageSize?: number
}

// El identificador, la hora de llegada y el HOSPITAL los asigna el servidor:
// nunca se mandan desde el navegador. El hospital sale de la cuenta de la
// sesión (backend/src/plugins/auth.ts), no de una constante de aquí.
export async function listPatients(
  query: PatientQuery = {},
): Promise<ListResult<Patient>> {
  const params = new URLSearchParams()
  if (query.page !== undefined) params.set('page', String(query.page))
  if (query.pageSize !== undefined) params.set('pageSize', String(query.pageSize))
  const search = params.toString()
  return requestList<Patient>(`/patients${search ? `?${search}` : ''}`)
}

export async function getPatient(id: string): Promise<Patient> {
  return request<Patient>(`/patients/${id}`)
}

export async function addPatient(patient: NewPatient): Promise<Patient> {
  return request<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(patient),
  })
}

// PATCH y no PUT: PUT exigiría reenviar la ficha entera para cambiar el estado.
export async function updatePatient(
  id: string,
  changes: PatientChanges,
): Promise<Patient> {
  return request<Patient>(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

// El backend responde 204: el paciente no se borra, se marca inactivo.
export async function removePatient(id: string): Promise<void> {
  await request<void>(`/patients/${id}`, { method: 'DELETE' })
}

// Equipo a cargo. Estos tres endpoints son los que llenan `medico_paciente`:
// antes solo se leía, y por eso la pantalla de Pacientes salía vacía.
export async function listAssignments(patientId: string): Promise<CareAssignment[]> {
  return request<CareAssignment[]>(`/patients/${patientId}/assignments`)
}

export async function assignCare(
  patientId: string,
  body: { userId: number; reason?: string },
): Promise<CareAssignment> {
  return request<CareAssignment>(`/patients/${patientId}/assignments`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// 204: la asignación no se borra, se marca inactiva. El historial se conserva.
export async function unassignCare(patientId: string, userId: number): Promise<void> {
  await request<void>(`/patients/${patientId}/assignments/${userId}`, { method: 'DELETE' })
}
