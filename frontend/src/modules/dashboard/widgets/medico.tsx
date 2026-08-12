import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import { listReadings } from '../../sensors/api/sensorsApi'
import { KpiCard } from '../components/KpiCard'
import { Sparkline } from '../components/Sparkline'
import { WidgetEmpty, WidgetError } from '../components/WidgetMessage'
import { bySeverityDesc, severityColor, severityKey, severityRank } from '../presentation'
import { REFRESH_INTERVAL_MS, useAssignedPatients, useOpenAlerts } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { AssignedPatient } from '../types'

// Muestras por curva. A una lectura por segundo son los últimos ~4 minutos.
const TREND_SAMPLES = 60
const TREND_DEVICES = 3

/** Peor primero; a igual severidad, el que tiene más alertas abiertas. */
function byGravity(a: AssignedPatient, b: AssignedPatient): number {
  const diff = severityRank(b.worstSeverity) - severityRank(a.worstSeverity)
  return diff !== 0 ? diff : b.openAlerts - a.openAlerts
}

export function MedicoKpisWidget() {
  const patients = useAssignedPatients()
  const alerts = useOpenAlerts()

  const criticas = alerts.data?.filter((a) => a.severity === 'critica').length ?? null
  const sinEquipo = patients.data?.filter((p) => !p.device).length ?? null

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
      }}
    >
      <KpiCard
        label="dash.kpi.assignedPatients"
        value={patients.data?.length ?? null}
        icon={GroupsOutlinedIcon}
      />
      <KpiCard
        label="dash.kpi.criticalAlerts"
        value={criticas}
        icon={NotificationsActiveOutlinedIcon}
        tone={criticas ? 'critical' : 'ok'}
      />
      <KpiCard
        label="dash.kpi.withoutDevice"
        value={sinEquipo}
        icon={SensorsOutlinedIcon}
        tone={sinEquipo ? 'warning' : 'neutral'}
      />
    </Box>
  )
}

export function AssignedPatientsWidget() {
  const { t } = useLanguage()
  const { data, isError } = useAssignedPatients()

  if (isError) return <WidgetError message="dash.assignedPatients.error" />
  if (data && data.length === 0) return <WidgetEmpty message="dash.assignedPatients.empty" />

  return (
    <Stack spacing={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('dash.col.patient')}</TableCell>
            <TableCell>{t('dash.col.state')}</TableCell>
            <TableCell>{t('dash.col.device')}</TableCell>
            <TableCell align="right">{t('dash.col.openAlerts')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...(data ?? [])].sort(byGravity).map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {patient.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {patient.reason || t('patients.details.none')}
                </Typography>
              </TableCell>
              <TableCell>
                {patient.worstSeverity ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t(severityKey[patient.worstSeverity])}
                    color={severityColor[patient.worstSeverity]}
                  />
                ) : (
                  <Typography variant="caption" color="success.main">
                    {t('dash.noAlerts')}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {/* El atajo al expediente es, hoy, la cama: es la única
                    pantalla de paciente que existe. */}
                {patient.device ? (
                  <Link
                    component={RouterLink}
                    to={`/monitoring/${patient.device}`}
                    sx={{ fontWeight: 600 }}
                  >
                    {patient.device}
                  </Link>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t('dash.noDevice')}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">{patient.openAlerts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider />
      {/* PENDIENTE: los accesos directos a la Historia Clínica y a las Notas
          SOAP de cada paciente esperan `GET /patients/:id/history` y
          `GET /patients/:id/soap-notes`, que construye el módulo de Notas SOAP.
          Mientras tanto el enlace es a la cama, no a un expediente vacío. */}
      <Typography variant="caption" color="text.disabled">
        {t('dash.assignedPatients.recordsPending')}
      </Typography>
    </Stack>
  )
}

export function ActiveAlertsWidget() {
  const { t, language } = useLanguage()
  const { data, isError } = useOpenAlerts()

  if (isError) return <WidgetError message="sensors.alerts.error" />
  if (data && data.length === 0) return <WidgetEmpty message="dash.alerts.empty" />

  const sorted = [...(data ?? [])].sort(
    (a, b) => bySeverityDesc(a.severity, b.severity) || b.at.localeCompare(a.at),
  )

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {sorted.slice(0, 8).map((alert) => (
        <Stack key={alert.id} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Chip
            size="small"
            variant="outlined"
            label={t(severityKey[alert.severity])}
            color={severityColor[alert.severity]}
            sx={{ minWidth: 84 }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {alert.message ?? alert.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {alert.variable} · {alert.value} {alert.unit} ·{' '}
              {new Date(alert.at).toLocaleString(language)}
            </Typography>
          </Box>
          <Button size="small" component={RouterLink} to={`/monitoring/${alert.device}`}>
            {alert.device}
          </Button>
        </Stack>
      ))}
    </Stack>
  )
}

/** Una curva por dispositivo: la frecuencia cardíaca de los últimos minutos. */
function DeviceTrend({ device, patient }: { device: string; patient: string }) {
  const { t } = useLanguage()
  const readings = useQuery({
    queryKey: ['dashboard', 'trend', device],
    queryFn: () => listReadings({ device, variable: 'hr', limit: TREND_SAMPLES }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  // El servidor entrega de la más nueva a la más vieja; la curva se lee al revés.
  const values = [...(readings.data ?? [])].reverse().map((r) => r.value)
  const last = values.at(-1)

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {patient}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {device}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {t('monitor.hr')}
      </Typography>
      {values.length >= 2 ? (
        <>
          <Sparkline values={values} color="#dc2626" />
          <Typography variant="caption" color="text.secondary">
            {last} lpm
          </Typography>
        </>
      ) : (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', py: 1 }}>
          {t('monitor.noReadings')}
        </Typography>
      )}
    </Box>
  )
}

export function CriticalTrendsWidget() {
  const { data, isError } = useAssignedPatients()

  if (isError) return <WidgetError message="dash.assignedPatients.error" />

  const critical = [...(data ?? [])]
    .filter((p) => p.device && p.worstSeverity)
    .sort(byGravity)
    .slice(0, TREND_DEVICES)

  if (data && critical.length === 0) return <WidgetEmpty message="dash.trends.empty" />

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
      }}
    >
      {critical.map((patient) => (
        <DeviceTrend key={patient.id} device={patient.device!} patient={patient.name} />
      ))}
    </Box>
  )
}
