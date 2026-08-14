import { request } from '../../../shared/api/http'
import type { MonitoredBed } from '../types'

/**
 * Camas de la central de monitoreo. Sin `unitId` vienen todas las del hospital;
 * el filtro por unidad se resuelve en el servidor, no recortando la lista aquí,
 * para que el techo de 200 camas se aplique sobre lo que de verdad se pide.
 *
 * Requiere permiso `monitoreo:ver`, que el servidor revalida: llegar a la
 * pantalla no es autorización.
 */
export async function listMonitoredBeds(unitId?: string): Promise<MonitoredBed[]> {
  const query = unitId ? `?unitId=${encodeURIComponent(unitId)}` : ''
  return request<MonitoredBed[]>(`/monitoring/beds${query}`)
}
