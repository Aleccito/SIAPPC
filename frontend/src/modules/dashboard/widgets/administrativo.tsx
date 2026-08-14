import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { listReports } from '../../reports/api/reportsApi'
import {
  listAdmissions,
  listAppointments,
  listDischarges,
} from '../../admissions/api/admissionsApi'
import { KpiCard } from '../components/KpiCard'
import { WidgetEmpty, WidgetError } from '../components/WidgetMessage'
import { appointmentStateColor, appointmentStateKey } from '../presentation'
import { REFRESH_INTERVAL_MS, useBedOccupancy } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { ReportStatus } from '../../reports/types'

// Los cuatro widgets del tablero administrativo. Los tres primeros consumen
// /beds/occupancy, /admissions, /discharges y /appointments; el cuarto son las
// corridas del ETL, que es lo que `GET /reports` entrega.

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

/** Rojo a partir de nueve de cada diez camas: a esa altura ya no hay margen. */
function occupancyColor(rate: number): 'success' | 'warning' | 'error' {
  if (rate >= 0.9) return 'error'
  if (rate >= 0.75) return 'warning'
  return 'success'
}

/** Ocupación de camas por unidad. */
export function BedOccupancyWidget() {
  const { t } = useLanguage()
  // La consulta vive en queries.ts porque la lista de pacientes usa la misma.
  const { data, isError } = useBedOccupancy()

  if (isError) return <WidgetError message="dash.occupancy.error" />
  if (data && data.length === 0) return <WidgetEmpty message="dash.occupancy.empty" />

  return (
    <Stack spacing={1.5}>
      {(data ?? []).map((unit) => (
        <Box key={unit.unitId}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {unit.unit}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {/* Ocupadas sobre el total; las de limpieza y mantenimiento no
                  cuentan como libres y por eso se nombran aparte. */}
              {t('dash.occupancy.ratio', {
                occupied: String(unit.occupied),
                total: String(unit.total),
              })}
            </Typography>
          </Stack>
          {/* La barra no aporta ningún dato que no esté ya escrito arriba
              —ocupadas sobre total— y abajo —libres y fuera de servicio—: es la
              misma cifra dibujada. Se oculta al lector de pantalla en vez de
              ponerle nombre, que solo haría repetir el porcentaje una tercera
              vez. */}
          <LinearProgress
            aria-hidden="true"
            variant="determinate"
            value={Math.round(unit.rate * 100)}
            color={occupancyColor(unit.rate)}
            sx={{ height: 6, borderRadius: 3, my: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary">
            {t('dash.occupancy.detail', {
              available: String(unit.available),
              outOfService: String(unit.outOfService),
            })}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

/** Ingresos y egresos del día. */
export function AdmissionsTodayWidget() {
  const { t, locale } = useLanguage()

  const admissions = useQuery({
    queryKey: ['dashboard', 'admissions', 'today'],
    queryFn: () => listAdmissions({ date: 'today' }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
  const discharges = useQuery({
    queryKey: ['dashboard', 'discharges', 'today'],
    queryFn: () => listDischarges({ date: 'today' }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (admissions.isError || discharges.isError) {
    return <WidgetError message="dash.admissions.error" />
  }

  // `null` mientras carga: KpiCard lo pinta como raya y no como cero, que en un
  // tablero se leería como "hoy no ingresó nadie".
  const ingresos = admissions.data?.total ?? null
  const egresos = discharges.data?.total ?? null
  const ultimos = admissions.data?.items.slice(0, 4) ?? []

  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <KpiCard label="dash.kpi.admissionsToday" value={ingresos} icon={LoginOutlinedIcon} />
        <KpiCard label="dash.kpi.dischargesToday" value={egresos} icon={LogoutOutlinedIcon} />
      </Box>

      {ultimos.length > 0 && (
        <>
          <Divider />
          <Stack spacing={0.75}>
            {ultimos.map((admission) => (
              <Stack
                key={admission.id}
                direction="row"
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                  {admission.patientName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {admission.bedCode ?? t('dash.admissions.noBed')} ·{' '}
                  {new Date(admission.admittedAt).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      <Button size="small" component={RouterLink} to="/admissions" sx={{ alignSelf: 'flex-start' }}>
        {t('dash.admissions.manage')}
      </Button>
    </Stack>
  )
}

/** Agenda de citas del día. */
export function AppointmentsWidget() {
  const { t, locale } = useLanguage()
  const { data, isError } = useQuery({
    queryKey: ['dashboard', 'appointments', 'today'],
    queryFn: () => listAppointments({ date: 'today' }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (isError) return <WidgetError message="dash.appointments.error" />
  if (data && data.items.length === 0) return <WidgetEmpty message="dash.appointments.empty" />

  return (
    <Stack spacing={1}>
      <Stack spacing={0.75} divider={<Divider flexItem />}>
        {(data?.items ?? []).slice(0, 6).map((appointment) => (
          <Stack
            key={appointment.id}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 44 }}>
              {new Date(appointment.at).toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {appointment.patientName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {appointment.professionalName}
              </Typography>
            </Box>
            <Chip
              size="small"
              variant="outlined"
              label={t(appointmentStateKey[appointment.state])}
              color={appointmentStateColor[appointment.state]}
            />
          </Stack>
        ))}
      </Stack>
      <Button size="small" component={RouterLink} to="/admissions" sx={{ alignSelf: 'flex-start' }}>
        {t('dash.appointments.seeAll')}
      </Button>
    </Stack>
  )
}

/**
 * Reportes recientes: hoy son las corridas del ETL, que es lo que `GET /reports`
 * entrega (`etl_ejecucion`).
 */
export function RecentReportsWidget() {
  const { t, locale } = useLanguage()
  const reports = useQuery({
    queryKey: ['dashboard', 'reports'],
    queryFn: listReports,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (reports.isError) return <WidgetError message="dash.reports.error" />
  if (reports.data && reports.data.length === 0) return <WidgetEmpty message="reports.empty" />

  return (
    <Stack spacing={1}>
      <Table aria-label={t('dash.widget.recentReports')} size="small">
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
                {new Date(report.updatedAt).toLocaleString(locale)}
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
