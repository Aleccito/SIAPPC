import { request } from '../../../shared/api/http'
import type { Report } from '../types'

// The list is the ETL run log: every row is one execution of a process in
// backend/etl/. See backend/etl/README.md.
export async function listReports(): Promise<Report[]> {
  return request<Report[]>('/reports')
}
