import { useMemo, useState } from 'react'
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
import AirlineSeatFlatOutlinedIcon from '@mui/icons-material/AirlineSeatFlatOutlined'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { listReadings } from '../../sensors/api/sensorsApi'
import { KpiCard } from '../components/KpiCard'
import { Sparkline } from '../components/Sparkline'
import { WidgetEmpty, WidgetError } from '../components/WidgetMessage'
import {
  bySeverityDesc,
  clinicalState,
  clinicalStateColor,
  clinicalStateKey,
  hrTone,
  severityColor,
  spo2Tone,
  severityKey,
  severityRank,
  triageLevel,
} from '../presentation'
import { REFRESH_INTERVAL_MS, useAssignedPatients, useBedOccupancy, useOpenAlerts } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { ClinicalState } from '../presentation'
import type { AssignedPatient } from '../types'

// Muestras por curva. A una lectura por segundo son los últimos ~4 minutos.
const TREND_SAMPLES = 60
const TREND_DEVICES = 2

/** Renglones que se ven sin salir del tablero; el resto, en /patients. */
const PREVIEW_ROWS = 6

/** Peor primero; a igual severidad, el que tiene más alertas abiertas. */
function byGravity(a: AssignedPatient, b: AssignedPatient): number {
  const diff = severityRank(b.worstSeverity) - severityRank(a.worstSeverity)
  return diff !== 0 ? diff : b.openAlerts - a.openAlerts
}

export function MedicoKpisWidget() {
  const { t } = useLanguage()
  const patients = useAssignedPatients()
  const alerts = useOpenAlerts()
  const beds = useBedOccupancy()

  const criticas = alerts.data?.filter((a) => a.severity === 'critica').length ?? null
  // "Pendientes de evaluación" son los que todavía no tienen exploración
  // física: la evaluación primaria está sin completar. Sale de `examined`, que
  // el servidor calcula contra `exploracion_fisica`.
  const sinEvaluar = patients.data?.filter((p) => !p.examined).length ?? null

  // Camas libres de TODO el hospital, sumando las unidades. La central de
  // monitoreo solo pinta camas ocupadas —una cama vacía no tiene nada que
  // monitorear—, así que la capacidad que queda tiene que verse aquí.
  const libres = beds.data?.reduce((suma, unidad) => suma + unidad.available, 0) ?? null

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
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
        label="dash.kpi.pendingAssessment"
        value={sinEvaluar}
        icon={AssignmentLateOutlinedIcon}
        tone={sinEvaluar ? 'warning' : 'ok'}
      />
        <KpiCard
          label="dash.kpi.freeBeds"
          value={libres}
          icon={AirlineSeatFlatOutlinedIcon}
          tone={libres === 0 ? 'warning' : 'neutral'}
        />
      </Box>

      {/* Atajo a la central: desde el tablero, lo siguiente que se hace cuando
          hay una crítica es abrir el monitor, y hasta ahora eso obligaba a
          buscar la entrada en el menú lateral. */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant="outlined"
          component={RouterLink}
          to="/monitoring"
          startIcon={<AirlineSeatFlatOutlinedIcon />}
        >
          {t('dash.openCentral')}
        </Button>
      </Box>
    </Stack>
  )
}

// Los umbrales de color de los signos vitales viven en presentation.ts desde
// que la lista de pacientes pinta las mismas columnas: ver hrTone/spo2Tone.

/** Una cifra de signo vital con su color; ausente se pinta como raya. */
function Vital({ label, value, unit, tone }: {
  label: string
  value: number | null
  unit: string
  tone?: 'error' | 'warning'
}) {
  if (value === null) {
    return (
      <Typography variant="caption" color="text.disabled">
        {label}: —
      </Typography>
    )
  }

  return (
    <Typography
      variant="body2"
      component="span"
      sx={{
        fontWeight: tone ? 700 : 500,
        color: tone ? `${tone}.main` : 'text.primary',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {label}: {value}
      {unit}
    </Typography>
  )
}

/** Todas las unidades presentes, para el filtro. Sin repetir y ordenadas. */
function unitsOf(patients: AssignedPatient[]): string[] {
  return [...new Set(patients.map((p) => p.unit).filter((u): u is string => Boolean(u)))].sort()
}

export function AssignedPatientsWidget() {
  const { t } = useLanguage()
  const { data, isError } = useAssignedPatients()

  // Los filtros son de esta vista y no viajan al servidor: la lista ya está
  // acotada a los pacientes de la sesión (tope de 100), así que filtrar aquí
  // evita una consulta por cada clic en un chip.
  const [unit, setUnit] = useState<string | null>(null)
  const [state, setState] = useState<ClinicalState | null>(null)

  // Los memos dependen de `data` y no de una copia con `?? []`: ese literal
  // sería un array nuevo en cada render y los recalcularía siempre.
  const units = useMemo(() => unitsOf(data ?? []), [data])

  const filtered = useMemo(
    () =>
      [...(data ?? [])]
        .filter(
          (p) =>
            (unit === null || p.unit === unit) &&
            (state === null || clinicalState(p.worstSeverity) === state),
        )
        .sort(byGravity),
    [data, unit, state],
  )

  if (isError) return <WidgetError message="dash.assignedPatients.error" />
  if (data && data.length === 0) return <WidgetEmpty message="dash.assignedPatients.empty" />

  const shown = filtered.slice(0, PREVIEW_ROWS)

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('dash.filter.unit')}
        </Typography>
        <Chip
          size="small"
          label={t('dash.filter.all')}
          color={unit === null ? 'primary' : 'default'}
          variant={unit === null ? 'filled' : 'outlined'}
          onClick={() => setUnit(null)}
        />
        {units.map((name) => (
          <Chip
            key={name}
            size="small"
            label={name}
            color={unit === name ? 'primary' : 'default'}
            variant={unit === name ? 'filled' : 'outlined'}
            onClick={() => setUnit(name)}
          />
        ))}

        <Divider orientation="vertical" flexItem />

        <Typography variant="caption" color="text.secondary">
          {t('dash.filter.state')}
        </Typography>
        <Chip
          size="small"
          label={t('dash.filter.all')}
          color={state === null ? 'primary' : 'default'}
          variant={state === null ? 'filled' : 'outlined'}
          onClick={() => setState(null)}
        />
        {(['critico', 'atencion', 'estable'] as const).map((value) => (
          <Chip
            key={value}
            size="small"
            label={t(clinicalStateKey[value])}
            color={state === value ? clinicalStateColor[value] : 'default'}
            variant={state === value ? 'filled' : 'outlined'}
            onClick={() => setState(value)}
          />
        ))}
      </Stack>

      <Table aria-label={t('dash.widget.assignedPatients')} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('dash.col.patient')}</TableCell>
            <TableCell>{t('dash.col.state')}</TableCell>
            <TableCell>{t('dash.col.location')}</TableCell>
            <TableCell>{t('dash.col.vitals')}</TableCell>
            <TableCell>{t('dash.col.glasgowTriage')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shown.map((patient) => {
            const estado = clinicalState(patient.worstSeverity)
            const triage = triageLevel(patient.worstSeverity)

            return (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {patient.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {patient.record
                      ? t('dash.recordNumber', { number: patient.record })
                      : t('dash.noRecord')}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t(clinicalStateKey[estado])}
                    color={clinicalStateColor[estado]}
                  />
                </TableCell>

                <TableCell>
                  {patient.bed ? (
                    <Typography variant="body2">
                      {t('dash.bedAt', { unit: patient.unit ?? '', bed: patient.bed })}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      {t('dash.noBed')}
                    </Typography>
                  )}
                  {/* El equipo enlaza al monitor de cama: es, hoy, la única
                      pantalla de paciente en vivo que existe. */}
                  {patient.device ? (
                    <Link
                      component={RouterLink}
                      to={`/monitoring/${patient.device}`}
                      variant="caption"
                      sx={{ display: 'block', fontWeight: 600 }}
                    >
                      {patient.device}
                    </Link>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {t('dash.noDevice')}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1.5}>
                    <Vital
                      label={t('dash.vital.hr')}
                      value={patient.vitals.hr}
                      unit=""
                      tone={patient.vitals.hr !== null ? hrTone(patient.vitals.hr) : undefined}
                    />
                    <Vital
                      label={t('dash.vital.spo2')}
                      value={patient.vitals.spo2}
                      unit="%"
                      tone={patient.vitals.spo2 !== null ? spo2Tone(patient.vitals.spo2) : undefined}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {patient.openAlerts > 0
                      ? t('dash.openAlertsCount', { count: String(patient.openAlerts) })
                      : t('dash.noAlerts')}
                  </Typography>
                </TableCell>

                <TableCell>
                  {patient.glasgow !== null ? (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('dash.gcs', { value: String(patient.glasgow) })}
                    </Typography>
                  ) : (
                    <Link
                      component={RouterLink}
                      to={`/expediente/${patient.id}/exploracion-fisica`}
                      variant="body2"
                    >
                      {t('dash.gcs.pending')}
                    </Link>
                  )}
                  {/* El triage NO es un dato guardado: se deriva de la peor
                      alerta abierta (ver presentation.ts). */}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: `${clinicalStateColor[estado]}.main` }}
                  >
                    {t('dash.triage', { level: triage })}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {filtered.length === 0 && <WidgetEmpty message="dash.assignedPatients.noMatch" />}

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {t('dash.showingOf', {
            shown: String(shown.length),
            total: String(filtered.length),
          })}
        </Typography>
        <Button size="small" component={RouterLink} to="/patients">
          {t('dash.seeAll')}
        </Button>
      </Stack>
    </Stack>
  )
}

export function ActiveAlertsWidget() {
  const { t, locale } = useLanguage()
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
              {new Date(alert.at).toLocaleString(locale)}
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

/** Una curva por variable: la serie reciente de un signo vital. */
function VitalTrend({ device, variable, label, unit, color }: {
  device: string
  variable: string
  label: string
  unit: string
  color: string
}) {
  const { t } = useLanguage()
  const readings = useQuery({
    queryKey: ['dashboard', 'trend', device, variable],
    queryFn: () => listReadings({ device, variable, limit: TREND_SAMPLES }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  // El servidor entrega de la más nueva a la más vieja; la curva se lee al revés.
  const values = [...(readings.data ?? [])].reverse().map((r) => r.value)
  const last = values.at(-1)

  return (
    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color }}>
        {label}
        {last !== undefined && ` (${last} ${unit})`}
      </Typography>
      {values.length >= 2 ? (
        <Sparkline values={values} color={color} />
      ) : (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', py: 1 }}>
          {t('monitor.noReadings')}
        </Typography>
      )}
    </Box>
  )
}

/** Las dos curvas de un paciente crítico, con su cama. */
function PatientTrends({ patient }: { patient: AssignedPatient }) {
  const { t } = useLanguage()
  const device = patient.device!

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
        {patient.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {patient.bed ? t('dash.bedAt', { unit: patient.unit ?? '', bed: patient.bed }) : device}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <VitalTrend
          device={device}
          variable="hr"
          label={t('dash.vital.hr')}
          unit="lpm"
          color="#dc2626"
        />
        <VitalTrend
          device={device}
          variable="spo2"
          label={t('dash.vital.spo2')}
          unit="%"
          color="#2563eb"
        />
      </Stack>
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
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      }}
    >
      {critical.map((patient) => (
        <PatientTrends key={patient.id} patient={patient} />
      ))}
    </Box>
  )
}
