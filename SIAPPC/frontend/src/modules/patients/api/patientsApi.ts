import { request, requestList } from '../../../shared/api/http'
import type { ListResult } from '../../../shared/api/http'
import type { NewPatient, Patient, PatientChanges } from '../types'

// El despliegue atiende un solo hospital, igual que el alta de usuarios y el
// catálogo de unidades, que también lo fijan en 1.
const HOSPITAL_ID = 1

export type PatientQuery = {
  page?: number
  pageSize?: number
}

// El identificador y la hora de llegada los asigna el servidor: nunca se mandan
// desde el navegador.
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
    body: JSON.stringify({ ...patient, hospitalId: HOSPITAL_ID }),
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
