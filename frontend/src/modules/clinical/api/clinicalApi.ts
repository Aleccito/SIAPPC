import { request } from '../../../shared/api/http'
import type { Patient } from '../../patients/types'
import type { Expediente, HistoriaChange, NewSoapNote, SoapNote } from '../types'

// Llamadas reales, sin datos de ejemplo: /soap/* y /historia/* existen en el
// backend (backend/src/routes/soap.ts e historia.ts).

/** La lista de pacientes que alimenta el selector del expediente. */
export async function listPatients(): Promise<Patient[]> {
  return request<Patient[]>('/patients')
}

export async function listSoapNotes(patientId: string): Promise<SoapNote[]> {
  return request<SoapNote[]>(`/soap/notes?patientId=${encodeURIComponent(patientId)}`)
}

export async function createSoapNote(note: NewSoapNote): Promise<SoapNote> {
  return request<SoapNote>('/soap/notes', { method: 'POST', body: JSON.stringify(note) })
}

export async function signSoapNote(noteId: string): Promise<SoapNote> {
  return request<SoapNote>(`/soap/notes/${noteId}/sign`, { method: 'POST' })
}

export async function addSoapAddendum(
  noteId: string,
  sections: Omit<NewSoapNote, 'patientId' | 'sign'>,
): Promise<SoapNote> {
  return request<SoapNote>(`/soap/notes/${noteId}/addendum`, {
    method: 'POST',
    body: JSON.stringify(sections),
  })
}

/** El expediente completo en una llamada: la pantalla lo pinta por categorías. */
export async function getExpediente(patientId: string): Promise<Expediente> {
  return request<Expediente>(`/historia/${patientId}`)
}

export async function listHistoriaChanges(patientId: string): Promise<HistoriaChange[]> {
  return request<HistoriaChange[]>(`/historia/${patientId}/cambios`)
}

/** Lo único del expediente que puede escribir enfermería. */
export async function saveObservaciones(
  patientId: string,
  notes: string,
): Promise<{ patientId: string; notes: string | null; updatedAt: string }> {
  return request(`/historia/${patientId}/observaciones`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  })
}
