import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { listAlerts, listReadings } from '../api/sensorsApi'
import { alertSeverities, alertStatuses } from '../types'
import type { AlertSeverity, AlertStatus } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const ALL = '__all__'

// Umbral fijo: suficiente para poblar los filtros de dispositivo/variable sin
// necesitar un endpoint de catálogo aparte.
const CATALOG_LIMIT = 500
const READINGS_LIMIT = 100
const ALERTS_LIMIT = 100
// Telemetría en vivo: refrescar sin que el usuario tenga que recargar la página.
const REFRESH_INTERVAL_MS = 5000

const severityColor: Record<AlertSeverity, 'default' | 'info' | 'warning' | 'error'> = {
  baja: 'default',
  media: 'info',
  alta: 'warning',
  critica: 'error',
}

const severityKey: Record<AlertSeverity, StringKey> = {
  baja: 'alertSeverity.baja',
  media: 'alertSeverity.media',
  alta: 'alertSeverity.alta',
  critica: 'alertSeverity.critica',
}

const statusKey: Record<AlertStatus, StringKey> = {
  abierta: 'alertStatus.abierta',
  reconocida: 'alertStatus.reconocida',
  resuelta: 'alertStatus.resuelta',
}

export function SensorsPage() {
  const { t, language } = useLanguage()
  const [device, setDevice] = useState(ALL)
  const [variable, setVariable] = useState(ALL)
  const [severity, setSeverity] = useState<AlertSeverity | typeof ALL>(ALL)
  const [status, setStatus] = useState<AlertStatus | typeof ALL>(ALL)

  const catalog = useQuery({
    queryKey: ['sensorReadings', 'catalog'],
    queryFn: () => listReadings({ limit: CATALOG_LIMIT }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const devices = useMemo(
    () => Array.from(new Set(catalog.data?.map((r) => r.device))).sort(),
    [catalog.data],
  )
  const variables = useMemo(
    () => Array.from(new Set(catalog.data?.map((r) => r.variable))).sort(),
    [catalog.data],
  )

  const filters = {
    device: device === ALL ? undefined : device,
    variable: variable === ALL ? undefined : variable,
    limit: READINGS_LIMIT,
  }

  const readings = useQuery({
    queryKey: ['sensorReadings', filters],
    queryFn: () => listReadings(filters),
    refetchInterval: REFRESH_INTERVAL_MS,
    placeholderData: keepPreviousData,
  })

  // Dispositivo y variable son los mismos filtros que las lecturas: una alerta
  // cuelga de una lectura, así que el JOIN del backend acepta ambos.
  const alertFilters = {
    device: device === ALL ? undefined : device,
    variable: variable === ALL ? undefined : variable,
    severity: severity === ALL ? undefined : severity,
    status: status === ALL ? undefined : status,
    limit: ALERTS_LIMIT,
  }

  const alerts = useQuery({
    queryKey: ['sensorAlerts', alertFilters],
    queryFn: () => listAlerts(alertFilters),
    refetchInterval: REFRESH_INTERVAL_MS,
    placeholderData: keepPreviousData,
  })

  const filtersActive = device !== ALL || variable !== ALL || severity !== ALL || status !== ALL

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">{t('sensors.title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sensors.subtitle')}
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label={t('sensors.filter.device')}
            value={device}
            onChange={(event) => setDevice(event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={ALL}>{t('sensors.filter.all')}</MenuItem>
            {devices.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('sensors.filter.variable')}
            value={variable}
            onChange={(event) => setVariable(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('sensors.filter.all')}</MenuItem>
            {variables.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('sensors.filter.severity')}
            value={severity}
            onChange={(event) => setSeverity(event.target.value as AlertSeverity | typeof ALL)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('sensors.filter.all')}</MenuItem>
            {alertSeverities.map((name) => (
              <MenuItem key={name} value={name}>
                {t(severityKey[name])}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('sensors.filter.status')}
            value={status}
            onChange={(event) => setStatus(event.target.value as AlertStatus | typeof ALL)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('sensors.filter.all')}</MenuItem>
            {alertStatuses.map((name) => (
              <MenuItem key={name} value={name}>
                {t(statusKey[name])}
              </MenuItem>
            ))}
          </TextField>

          {filtersActive && (
            <Button
              onClick={() => {
                setDevice(ALL)
                setVariable(ALL)
                setSeverity(ALL)
                setStatus(ALL)
              }}
            >
              {t('sensors.clearFilters')}
            </Button>
          )}
        </Stack>
      </Paper>

      <Typography variant="subtitle1">{t('sensors.section.alerts')}</Typography>

      {alerts.isError && <Alert severity="error">{t('sensors.alerts.error')}</Alert>}

      <TableContainer component={Paper}>
        <Box sx={{ height: 4 }}>{alerts.isFetching && <LinearProgress />}</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('sensors.col.severity')}</TableCell>
              <TableCell>{t('sensors.col.device')}</TableCell>
              <TableCell>{t('sensors.col.variable')}</TableCell>
              <TableCell>{t('sensors.col.value')}</TableCell>
              <TableCell>{t('sensors.col.message')}</TableCell>
              <TableCell>{t('sensors.col.status')}</TableCell>
              <TableCell>{t('sensors.col.when')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('sensors.alerts.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {alerts.data?.map((alert) => (
              <TableRow key={alert.id} hover>
                <TableCell>
                  <Chip
                    size="small"
                    label={t(severityKey[alert.severity])}
                    color={severityColor[alert.severity]}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{alert.device}</TableCell>
                <TableCell>{alert.variable}</TableCell>
                <TableCell>
                  {alert.value} {alert.unit}
                </TableCell>
                <TableCell>{alert.message ?? alert.type}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{t(statusKey[alert.status])}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {new Date(alert.at).toLocaleString(language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1">{t('sensors.section.readings')}</Typography>

      {readings.isError && <Alert severity="error">{t('sensors.error')}</Alert>}

      <TableContainer component={Paper}>
        <Box sx={{ height: 4 }}>{readings.isFetching && <LinearProgress />}</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('sensors.col.device')}</TableCell>
              <TableCell>{t('sensors.col.variable')}</TableCell>
              <TableCell>{t('sensors.col.value')}</TableCell>
              <TableCell>{t('sensors.col.when')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readings.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('sensors.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {readings.data?.map((reading) => (
              <TableRow key={reading.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{reading.device}</TableCell>
                <TableCell>{reading.variable}</TableCell>
                <TableCell>
                  {reading.value} {reading.unit}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {new Date(reading.at).toLocaleString(language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
