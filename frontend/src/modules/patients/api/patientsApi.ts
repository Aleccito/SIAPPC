import type { NewPatient, Patient } from '../types'

// PHASE 2: replace these bodies with fetches to /api/patients. The backend owns
// the identifier and the arrival timestamp — never send them from the browser.
let fixtures: Patient[] = [
  {
    id: 'p-001',
    name: 'Yariela Sánchez',
    document: '8-912-2044',
    module: 'KY-012',
    status: 'inService',
    arrivedAt: '2026-07-25T07:40:00Z',
    reason: 'Control de presión arterial',
  },
  {
    id: 'p-002',
    name: 'Ernesto Villalaz',
    document: '4-731-1188',
    module: 'KY-001',
    status: 'waiting',
    arrivedAt: '2026-07-25T08:05:00Z',
    reason: 'Dolor abdominal',
  },
  {
    id: 'p-003',
    name: 'Damaris Quintero',
    document: '3-118-9057',
    module: 'KY-019',
    status: 'discharged',
    arrivedAt: '2026-07-25T06:15:00Z',
    reason: 'Curación de herida',
  },
]

let nextId = 4

export async function listPatients(): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return fixtures
}

export async function addPatient(patient: NewPatient): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!patient.name.trim() || !patient.document.trim()) {
    // The screen shows a translated message, so this one is for the log.
    throw new Error('Name and document are required')
  }

  const created: Patient = {
    ...patient,
    id: `p-${String(nextId++).padStart(3, '0')}`,
    status: 'waiting',
    arrivedAt: new Date().toISOString(),
  }
  fixtures = [created, ...fixtures]
  return created
}
