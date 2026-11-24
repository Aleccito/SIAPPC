// Copia de frontend/src/modules/reports/api/reportsApi.ts (mismas funciones, parámetros y tipos; solo cambian las rutas de importación).
import { request } from './http'
import type { Report } from './types/reports'

// The list is the ETL run log: every row is one execution of a process in
// backend/etl/. See backend/etl/README.md.
export async function listReports(): Promise<Report[]> {
  return request<Report[]>('/reports')
}
