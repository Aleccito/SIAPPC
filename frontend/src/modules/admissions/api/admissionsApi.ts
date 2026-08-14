import { request, requestList } from '../../../shared/api/http'
import type { ListResult } from '../../../shared/api/http'
import type {
  Admission,
  Appointment,
  Bed,
  BedCapacity,
  BedOccupancy,
  NewAdmission,
  NewAppointment,
  NewBed,
} from '../types'

// `date` viaja como la palabra `today` y no como una fecha calculada aquí: la
// resuelve el servidor, que es el que sabe en qué día está el hospital. Un
// navegador con la fecha corrida pediría el turno de otro día.
export type DayQuery = { date?: 'today' | string }

// ---------------------------------------------------------------------------
// Camas
// ---------------------------------------------------------------------------

export async function listBeds(): Promise<ListResult<Bed>> {
  return requestList<Bed>('/beds')
}

export async function listBedOccupancy(): Promise<BedOccupancy[]> {
  return request<BedOccupancy[]>('/beds/occupancy')
}

export async function addBed(bed: NewBed): Promise<Bed> {
  return request<Bed>('/beds', { method: 'POST', body: JSON.stringify(bed) })
}

export async function updateBed(id: string, changes: Partial<NewBed>): Promise<Bed> {
  return request<Bed>(`/beds/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

/**
 * Fija cuántas camas tiene una unidad. Se manda el total que debe haber, no
 * cuántas añadir: es idempotente, así que pulsar dos veces no duplica nada.
 *
 * El servidor responde 409 si se piden menos camas de las que están ocupadas.
 */
export async function setBedCapacity(unitId: string, total: number): Promise<BedCapacity> {
  return request<BedCapacity>('/beds/capacity', {
    method: 'PUT',
    body: JSON.stringify({ unitId, total }),
  })
}

// ---------------------------------------------------------------------------
// Ingresos y egresos
// ---------------------------------------------------------------------------

function withQuery(path: string, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, value)
  }
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

export async function listAdmissions(
  query: DayQuery & { state?: string } = {},
): Promise<ListResult<Admission>> {
  return requestList<Admission>(withQuery('/admissions', query))
}

export async function listDischarges(query: DayQuery = {}): Promise<ListResult<Admission>> {
  return requestList<Admission>(withQuery('/discharges', query))
}

export async function admitPatient(admission: NewAdmission): Promise<Admission> {
  return request<Admission>('/admissions', {
    method: 'POST',
    body: JSON.stringify(admission),
  })
}

/**
 * Da el egreso. Es POST y no PATCH del estado porque el servidor cierra el
 * ingreso y libera la cama en la misma transacción: son un solo acto.
 */
export async function dischargeAdmission(id: string, summary?: string): Promise<Admission> {
  return request<Admission>(`/admissions/${id}/discharge`, {
    method: 'POST',
    body: JSON.stringify({ summary: summary ?? null }),
  })
}

/** Cancelar y reasignar cama son lo mismo para la API: un PATCH del ingreso. */
export async function updateAdmission(
  id: string,
  changes: { bedId?: number | null; reason?: string; state?: 'activo' | 'cancelado' },
): Promise<Admission> {
  return request<Admission>(`/admissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

// ---------------------------------------------------------------------------
// Citas
// ---------------------------------------------------------------------------

export async function listAppointments(
  query: DayQuery & { state?: string; professionalId?: string } = {},
): Promise<ListResult<Appointment>> {
  return requestList<Appointment>(withQuery('/appointments', query))
}

export async function addAppointment(appointment: NewAppointment): Promise<Appointment> {
  return request<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}

export async function updateAppointment(
  id: string,
  changes: Partial<NewAppointment> & { state?: string },
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}
