// The hospital attends patients at numbered service modules. A patient is
// always assigned to exactly one of them.
export const serviceModules = ['KY-001', 'KY-004', 'KY-012', 'KY-019'] as const

export type ServiceModule = (typeof serviceModules)[number]

export type PatientStatus = 'waiting' | 'inService' | 'discharged'

export type Patient = {
  id: string
  name: string
  document: string
  module: ServiceModule
  status: PatientStatus
  arrivedAt: string
  reason: string
}

export type NewPatient = {
  name: string
  document: string
  module: ServiceModule
  reason: string
}
