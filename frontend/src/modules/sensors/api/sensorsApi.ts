import { request } from '../../../shared/api/http'
import type { AlertsFilter, ReadingsFilter, SensorAlert, SensorReading } from '../types'

function baseParams(filters: ReadingsFilter): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.device) params.set('device', filters.device)
  if (filters.variable) params.set('variable', filters.variable)
  if (filters.limit) params.set('limit', String(filters.limit))
  return params
}

export async function listReadings(filters: ReadingsFilter = {}): Promise<SensorReading[]> {
  const query = baseParams(filters).toString()
  return request<SensorReading[]>(`/sensors/readings${query ? `?${query}` : ''}`)
}

export async function listAlerts(filters: AlertsFilter = {}): Promise<SensorAlert[]> {
  const params = baseParams(filters)
  if (filters.severity) params.set('severity', filters.severity)
  if (filters.status) params.set('status', filters.status)

  const query = params.toString()
  return request<SensorAlert[]>(`/sensors/alerts${query ? `?${query}` : ''}`)
}
