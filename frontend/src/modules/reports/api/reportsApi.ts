import { request } from '../../../shared/api/http'
import type { Report } from '../types'

// La lista es la bitácora de corridas del ETL: cada fila es una ejecución de un
// proceso de backend/etl/. Ver backend/etl/README.md.
export async function listReports(): Promise<Report[]> {
  return request<Report[]>('/reports')
}
