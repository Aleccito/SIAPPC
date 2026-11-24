// Espejo de SensorReading en backend/src/types.ts. `variable` no es una unión
// cerrada en el backend (sensor.variable_medida es VARCHAR), así que aquí es string.
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

// Espejo de SensorAlert en backend/src/types.ts. Severidad y estado son los valores
// crudos del ENUM de `alerta`; la interfaz solo los traduce para mostrarlos.
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
