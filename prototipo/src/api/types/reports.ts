// Copia de frontend/src/modules/reports/types.ts (no editar aquí sin cambiarlo allá: es el contrato con el backend).
export type ReportStatus = 'ready' | 'running' | 'failed'

export type Report = {
  id: string
  name: string
  source: string
  status: ReportStatus
  updatedAt: string
  // ETL run detail: rows read from the operational tables, rows written to the
  // datamart, and the reason a run ended in red.
  rowsRead: number
  rowsWritten: number
  error: string | null
}
