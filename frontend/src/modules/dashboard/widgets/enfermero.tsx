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
import { listAlerts } from '../../sensors/api/sensorsApi'
import { alertStatuses } from '../../sensors/types'
import { KpiCard } from '../components/KpiCard'
import { WidgetEmpty, WidgetError, WidgetPending } from '../components/WidgetMessage'
import { severityColor, severityKey, statusKey } from '../presentation'
import { REFRESH_INTERVAL_MS, useAssignedPatients } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'

const ALERTS_LIMIT = 100

/**
 * Pacientes a cargo de la enfermera o enfermero de la sesión.
 *
 * Sale del mismo `GET /dashboard/assigned-patients` que el tablero médico: la
 * tabla de asignación va por `usuario_id`, no por rol.
 */
export function NurseAssignmentsWidget() {
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
            <TableCell>{t('dash.col.bed')}</TableCell>
            <TableCell>{t('dash.col.device')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {patient.name}
                </Typography>
              </TableCell>
              <TableCell>
                {/* La cama sale del ingreso activo del paciente. Antes esta
                    columna decía "pendiente" y a su lado había otra con el
                    módulo de atención (KY-001…), que no era una ubicación:
                    ahora está la cama de verdad y el módulo desapareció. */}
                {patient.bed ? (
                  <Typography variant="body2">
                    {t('dash.bedAt', { unit: patient.unit ?? '', bed: patient.bed })}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.disabled">
                    {t('dash.noBed')}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {patient.device ? (
                  <Link component={RouterLink} to={`/monitoring/${patient.device}`}>
                    {patient.device}
                  </Link>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t('dash.noDevice')}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

/**
 * Alertas activas y en qué punto de su ciclo están.
 *
 * `resuelta` no cuenta como activa: lo que se vigila en el turno es lo abierto
 * y lo que alguien ya reconoció pero todavía no cierra.
 */
export function AlertAcknowledgementWidget() {
  const { t, language } = useLanguage()
  const alerts = useQuery({
    queryKey: ['dashboard', 'nurseAlerts'],
    queryFn: () => listAlerts({ limit: ALERTS_LIMIT }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (alerts.isError) return <WidgetError message="sensors.alerts.error" />

  const active = (alerts.data ?? []).filter((a) => a.status !== 'resuelta')
  const counts = Object.fromEntries(
    alertStatuses.map((status) => [
      status,
      (alerts.data ?? []).filter((a) => a.status === status).length,
    ]),
  ) as Record<(typeof alertStatuses)[number], number>

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        }}
      >
        <KpiCard
          label="alertStatus.abierta"
          value={alerts.data ? counts.abierta : null}
          icon={ReportProblemOutlinedIcon}
          tone={counts.abierta ? 'critical' : 'ok'}
        />
        <KpiCard
          label="alertStatus.reconocida"
          value={alerts.data ? counts.reconocida : null}
          icon={PendingActionsOutlinedIcon}
          tone="warning"
        />
        <KpiCard
          label="alertStatus.resuelta"
          value={alerts.data ? counts.resuelta : null}
          icon={CheckCircleOutlineOutlinedIcon}
          tone="ok"
        />
      </Box>

      {active.length === 0 ? (
        <WidgetEmpty message="dash.alerts.empty" />
      ) : (
        <Stack spacing={1} divider={<Divider flexItem />}>
          {active.slice(0, 6).map((alert) => (
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
                  {t(statusKey[alert.status])} · {new Date(alert.at).toLocaleString(language)}
                </Typography>
              </Box>
              <Button size="small" component={RouterLink} to={`/monitoring/${alert.device}`}>
                {alert.device}
              </Button>
            </Stack>
          ))}
        </Stack>
      )}

      {/* PENDIENTE: reconocer una alerta desde aquí necesita
          `PATCH /sensors/alerts/:id`, que todavía no existe. El widget muestra
          el estado; no lo cambia. */}
      <Typography variant="caption" color="text.disabled">
        {t('dash.alerts.ackPending')}
      </Typography>
    </Stack>
  )
}

/** Recordatorios de procedimiento y observación del turno. */
export function NurseRemindersWidget() {
  return (
    <WidgetPending message="dash.reminders.pending" endpoint="GET /nursing/reminders" />
  )
}

/** Acceso rápido a las notas de enfermería del turno. */
export function NursingNotesWidget() {
  return <WidgetPending message="dash.nursingNotes.pending" endpoint="GET /soap-notes" />
}
