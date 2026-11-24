export type ReportStatus = 'ready' | 'running' | 'failed'

export type Report = {
  id: string
  name: string
  source: string
  status: ReportStatus
  updatedAt: string
  // Detalle de la corrida del ETL: filas leídas de las tablas operativas, filas
  // escritas en el datamart y el motivo si la corrida terminó en rojo.
  rowsRead: number
  rowsWritten: number
  error: string | null
}
