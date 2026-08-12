import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { listReports } from '../../reports/api/reportsApi'
import { WidgetEmpty, WidgetError, WidgetPending } from '../components/WidgetMessage'
import { REFRESH_INTERVAL_MS } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { ReportStatus } from '../../reports/types'

// El tablero administrativo depende casi por completo de ingreso, egreso, cama
// y cita, que son tablas que todavía no existen. Los widgets están construidos
// y dicen a qué endpoint esperan; ninguno inventa cifras mientras tanto.

const reportStatusKey: Record<ReportStatus, StringKey> = {
  ready: 'reportStatus.ready',
  running: 'reportStatus.running',
  failed: 'reportStatus.failed',
}

const reportStatusColor: Record<ReportStatus, 'success' | 'info' | 'error'> = {
  ready: 'success',
  running: 'info',
  failed: 'error',
}

/** Ocupación de camas por unidad. */
export function BedOccupancyWidget() {
  return <WidgetPending message="dash.occupancy.pending" endpoint="GET /beds/occupancy" />
}

/** Ingresos y egresos del día. */
export function AdmissionsTodayWidget() {
  return (
    <WidgetPending
      message="dash.admissions.pending"
      endpoint="GET /admissions?date=today, GET /discharges?date=today"
    />
  )
}

/** Agenda de citas del día. */
export function AppointmentsWidget() {
  return <WidgetPending message="dash.appointments.pending" endpoint="GET /appointments?date=today" />
}

/**
 * Reportes recientes: hoy son las corridas del ETL, que es lo que `GET /reports`
 * entrega (`etl_ejecucion`).
 */
export function RecentReportsWidget() {
  const { t, language } = useLanguage()
  const reports = useQuery({
    queryKey: ['dashboard', 'reports'],
    queryFn: listReports,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (reports.isError) return <WidgetError message="dash.reports.error" />
  if (reports.data && reports.data.length === 0) return <WidgetEmpty message="reports.empty" />

  return (
    <Stack spacing={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.col.name')}</TableCell>
            <TableCell>{t('reports.col.status')}</TableCell>
            <TableCell>{t('reports.col.updated')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(reports.data ?? []).slice(0, 6).map((report) => (
            <TableRow key={report.id} hover>
              <TableCell>{report.name}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  variant="outlined"
                  color={reportStatusColor[report.status]}
                  label={t(reportStatusKey[report.status])}
                />
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>
                {new Date(report.updatedAt).toLocaleString(language)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button size="small" component={RouterLink} to="/reports" sx={{ alignSelf: 'flex-start' }}>
        {t('dash.reports.seeAll')}
      </Button>
    </Stack>
  )
}
