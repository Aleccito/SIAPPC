// Copia de frontend/src/modules/monitoring/api/monitoringApi.ts (mismas funciones, parámetros y tipos; solo cambian las rutas de importación).
import { request } from './http'
import type { MonitoredBed } from './types/monitoring'

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
