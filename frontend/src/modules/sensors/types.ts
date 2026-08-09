// Mirrors backend/src/types.ts SensorReading. `variable` is not a closed union
// on the backend (sensor.variable_medida is VARCHAR), so it stays a string here.
export type SensorReading = {
  id: string
  device: string
  variable: string
  unit: string
  value: number
  at: string
}

export type ReadingsFilter = {
  device?: string
  variable?: string
  limit?: number
}

// Mirrors backend/src/types.ts SensorAlert. Severity and status are the raw
// `alerta` ENUM values; the UI translates them for display only.
export const alertSeverities = ['baja', 'media', 'alta', 'critica'] as const
export type AlertSeverity = (typeof alertSeverities)[number]

export const alertStatuses = ['abierta', 'reconocida', 'resuelta'] as const
export type AlertStatus = (typeof alertStatuses)[number]

export type SensorAlert = {
  id: string
  readingId: string
  device: string
  variable: string
  unit: string
  value: number
  type: string
  severity: AlertSeverity
  message: string | null
  status: AlertStatus
  at: string
  resolvedAt: string | null
}

export type AlertsFilter = ReadingsFilter & {
  severity?: AlertSeverity
  status?: AlertStatus
}
