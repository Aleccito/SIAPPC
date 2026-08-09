import { request } from '../../../shared/api/http'
import type { AuditFilters, AuditPage } from '../types'

export async function listAudit(filters: AuditFilters): Promise<AuditPage> {
  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  params.set('pageSize', String(filters.pageSize))
  if (filters.userId) params.set('userId', filters.userId)
  if (filters.entity) params.set('entity', filters.entity)
  if (filters.action) params.set('action', filters.action)
  if (filters.days) params.set('days', String(filters.days))

  return request<AuditPage>(`/audit?${params.toString()}`)
}

export async function listAuditEntities(): Promise<string[]> {
  return request<string[]>('/audit/entities')
}
