export type ReportStatus = 'ready' | 'running' | 'failed'

export type Report = {
  id: string
  name: string
  source: string
  status: ReportStatus
  updatedAt: string
}
