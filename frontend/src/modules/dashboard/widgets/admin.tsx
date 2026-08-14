import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { listDeviceStatus } from '../api/dashboardApi'
import { listUsers } from '../../admin/api/usersApi'
import { listAudit } from '../../admin/api/auditApi'
import { request } from '../../../shared/api/http'
import { KpiCard } from '../components/KpiCard'
import { WidgetEmpty, WidgetError } from '../components/WidgetMessage'
import { deviceStateKey } from '../presentation'
import { REFRESH_INTERVAL_MS } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { DeviceState } from '../types'

// El tablero enseña CINCO eventos y solo los de seguridad; la bitácora entera
// vive en Reportes › Auditoría. Un panel de inicio con todo el registro se
// convierte en un muro que nadie lee, y lo importante se pierde entre altas y
// modificaciones rutinarias.
const SECURITY_ROWS = 5

// De dónde se recorta. Se piden más filas de las que se pintan porque el filtro
// es del lado del cliente: `GET /audit` acepta UNA acción, y aquí hacen falta
// varias.
const SECURITY_WINDOW = 60

/**
 * Qué cuenta como evento de seguridad.
 *
 * Un intento de acceso bloqueado y un borrado lo son por sí mismos. El resto
 * depende de sobre QUÉ se actuó: tocar cuentas, roles o permisos cambia quién
 * puede hacer qué, y eso es seguridad; dar de alta un paciente o una cama, no.
 */
const SECURITY_ENTITIES = ['usuario', 'rol', 'rol_permiso', 'permiso']

/** Escrituras. LOGIN y LOGOUT correctos son rutina, no un evento de seguridad. */
const SECURITY_ACTIONS = ['INSERT', 'UPDATE', 'DELETE']

function esEventoDeSeguridad(entry: { action: string; entity: string }): boolean {
  if (entry.action === 'LOGIN_BLOCKED' || entry.action === 'DELETE') return true
  // Solo cuenta si además se ESCRIBIÓ sobre esa entidad: sin esta condición,
  // cada inicio de sesión entraba —`LOGIN` se anota sobre `usuario`— y los
  // cinco huecos se llenaban de rutina, tapando lo que importa.
  return SECURITY_ACTIONS.includes(entry.action) && SECURITY_ENTITIES.includes(entry.entity)
}
// Un equipo que lleva más de esto sin publicar se da por desconectado. Es el
// mismo orden de magnitud que el intervalo de publicación de la Raspberry
// (iot/.env: PUBLISH_INTERVAL) multiplicado por un margen holgado.
const STALE_AFTER_MS = 2 * 60 * 1000

const deviceStateColor: Record<DeviceState, 'success' | 'default' | 'warning' | 'error'> = {
  activo: 'success',
  inactivo: 'default',
  mantenimiento: 'warning',
  baja: 'error',
}

/** Traducción de `auditoria.accion`. Sigue a la lista de admin/types.ts. */
const auditActionKey: Record<string, StringKey> = {
  INSERT: 'audit.INSERT',
  UPDATE: 'audit.UPDATE',
  DELETE: 'audit.DELETE',
  LOGIN: 'audit.LOGIN',
  LOGOUT: 'audit.LOGOUT',
  LOGIN_BLOCKED: 'audit.LOGIN_BLOCKED',
}

function isStale(lastReadingAt: string | null): boolean {
  if (!lastReadingAt) return true
  return Date.now() - new Date(lastReadingAt).getTime() > STALE_AFTER_MS
}

function useUsers() {
  return useQuery({ queryKey: ['dashboard', 'users'], queryFn: listUsers })
}

/** Conectividad de los equipos a pie de cama y de sus sensores. */
export function DeviceConnectivityWidget() {
  const { t, locale } = useLanguage()
  const devices = useQuery({
    queryKey: ['dashboard', 'devices'],
    queryFn: listDeviceStatus,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  if (devices.isError) return <WidgetError message="dash.devices.error" />
  if (devices.data && devices.data.length === 0) return <WidgetEmpty message="dash.devices.empty" />

  const rows = devices.data ?? []
  const emitiendo = rows.filter((d) => !isStale(d.lastReadingAt)).length

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
          label="dash.kpi.devices"
          value={devices.data ? rows.length : null}
          icon={ShieldOutlinedIcon}
        />
        <KpiCard
          label="dash.kpi.devicesLive"
          value={devices.data ? emitiendo : null}
          icon={ShieldOutlinedIcon}
          tone="ok"
        />
        <KpiCard
          label="dash.kpi.devicesSilent"
          value={devices.data ? rows.length - emitiendo : null}
          icon={PersonOffOutlinedIcon}
          tone={rows.length - emitiendo ? 'warning' : 'neutral'}
        />
      </Box>

      <Table aria-label={t('dash.widget.deviceConnectivity')} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('dash.col.device')}</TableCell>
            <TableCell>{t('dash.col.state')}</TableCell>
            <TableCell align="right">{t('dash.col.sensors')}</TableCell>
            <TableCell>{t('dash.col.lastReading')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(0, 10).map((device) => (
            <TableRow key={device.code} hover>
              <TableCell>
                <Button size="small" component={RouterLink} to={`/monitoring/${device.code}`}>
                  {device.code}
                </Button>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  variant="outlined"
                  color={deviceStateColor[device.state]}
                  label={t(deviceStateKey[device.state])}
                />
              </TableCell>
              <TableCell align="right">
                {device.activeSensors}/{device.sensors}
              </TableCell>
              <TableCell sx={{ color: isStale(device.lastReadingAt) ? 'warning.main' : 'text.secondary' }}>
                {device.lastReadingAt
                  ? new Date(device.lastReadingAt).toLocaleString(locale)
                  : t('dash.devices.never')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

/** Cuántas cuentas hay por rol y por unidad. */
export function PlatformUsageWidget() {
  const { t } = useLanguage()
  const users = useUsers()

  if (users.isError) return <WidgetError message="dash.users.error" />
  if (users.data && users.data.length === 0) return <WidgetEmpty message="users.empty" />

  const rows = users.data ?? []
  const porRol = new Map<string, number>()
  const porUnidad = new Map<string, number>()
  for (const user of rows) {
    porRol.set(user.roleLabel, (porRol.get(user.roleLabel) ?? 0) + 1)
    const unidad = user.unit ?? t('dash.usage.noUnit')
    porUnidad.set(unidad, (porUnidad.get(unidad) ?? 0) + 1)
  }

  const bar = (count: number) => `${Math.round((count / Math.max(rows.length, 1)) * 100)}%`

  const list = (entries: Map<string, number>) => (
    <Stack spacing={0.75}>
      {[...entries.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => (
          <Box key={label}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="caption">{label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {count}
              </Typography>
            </Stack>
            <Box sx={{ height: 6, bgcolor: 'action.hover', borderRadius: 3 }}>
              <Box
                sx={{ height: 6, width: bar(count), bgcolor: 'primary.main', borderRadius: 3 }}
              />
            </Box>
          </Box>
        ))}
    </Stack>
  )

  return (
    <Box
      sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary">
          {t('dash.usage.byRole')}
        </Typography>
        {list(porRol)}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {t('dash.usage.byUnit')}
        </Typography>
        {list(porUnidad)}
      </Box>
    </Box>
  )
}

/** Cuentas activas y suspendidas. */
export function ActiveUsersWidget() {
  const { t } = useLanguage()
  const users = useUsers()

  if (users.isError) return <WidgetError message="dash.users.error" />

  const rows = users.data ?? []
  const activos = rows.filter((u) => u.active).length

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}
      >
        <KpiCard
          label="dash.kpi.activeUsers"
          value={users.data ? activos : null}
          icon={GroupsOutlinedIcon}
          tone="ok"
        />
        <KpiCard
          label="dash.kpi.suspendedUsers"
          value={users.data ? rows.length - activos : null}
          icon={PersonOffOutlinedIcon}
          tone={rows.length - activos ? 'warning' : 'neutral'}
        />
      </Box>
      <Button size="small" component={RouterLink} to="/admin/users" sx={{ alignSelf: 'flex-start' }}>
        {t('dash.users.manage')}
      </Button>
    </Stack>
  )
}

/** Últimos movimientos de la bitácora, con los de seguridad destacados. */
export function SecurityEventsWidget() {
  const { t, locale } = useLanguage()
  const audit = useQuery({
    queryKey: ['dashboard', 'audit'],
    queryFn: () => listAudit({ page: 0, pageSize: SECURITY_WINDOW }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const eventos = (audit.data?.entries ?? []).filter(esEventoDeSeguridad).slice(0, SECURITY_ROWS)

  if (audit.isError) return <WidgetError message="dash.audit.error" />
  // Sin eventos de seguridad NO es lo mismo que sin bitácora: el mensaje lo
  // dice así para que nadie lea el widget vacío como "la auditoría no funciona".
  if (audit.data && eventos.length === 0) return <WidgetEmpty message="dash.security.empty" />

  // `auditoria.accion` es un ENUM, pero la traducción se busca en una tabla y
  // no interpolando la cadena: una acción nueva en la base dejaría al widget
  // pidiendo una clave que el diccionario no tiene, y `t` devolvería undefined.
  const label = (action: string): string =>
    action in auditActionKey ? t(auditActionKey[action]!) : action

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {eventos.map((entry) => (
        <Stack key={entry.id} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Chip
            size="small"
            variant="outlined"
            color={entry.action === 'LOGIN_BLOCKED' ? 'error' : 'default'}
            label={label(entry.action)}
            sx={{ minWidth: 96 }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {entry.note ?? `${entry.entity} #${entry.recordId}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.author ?? t('dash.audit.system')} ·{' '}
              {new Date(entry.at).toLocaleString(locale)}
            </Typography>
          </Box>
        </Stack>
      ))}
      <Button size="small" component={RouterLink} to="/admin/audit" sx={{ alignSelf: 'flex-start' }}>
        {t('permissionChanges.seeAudit')}
      </Button>
    </Stack>
  )
}

type IntegrationRow = {
  name: string
  detail: StringKey
  ok: boolean | null
}

/**
 * Estado de las integraciones.
 *
 * La API se comprueba de verdad contra `GET /health`. Power BI y FlexSim se
 * declaran no configurados porque lo están: su capa de datos en el frontend
 * todavía no habla con ningún servicio (ver los PENDIENTE de powerbiApi.ts y
 * flexsimApi.ts).
 */
export function IntegrationsWidget() {
  const { t } = useLanguage()
  const health = useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: () => request<{ status: string }>('/health'),
    refetchInterval: REFRESH_INTERVAL_MS,
    retry: false,
  })

  const rows: IntegrationRow[] = [
    {
      name: t('dash.integrations.api'),
      detail: health.data?.status === 'ok' ? 'dash.integrations.up' : 'dash.integrations.down',
      ok: health.isLoading ? null : health.data?.status === 'ok',
    },
    // PENDIENTE: `GET /powerbi/embed-token`, que emite el token de incrustación
    // desde el service principal. Sin él no hay nada que consultar.
    { name: t('dash.integrations.powerbi'), detail: 'dash.integrations.notConfigured', ok: false },
    // PENDIENTE: `GET /flexsim/runs`, servido por el servicio de trabajos que
    // lanza FlexSim en modo headless.
    { name: t('dash.integrations.flexsim'), detail: 'dash.integrations.notConfigured', ok: false },
  ]

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {rows.map((row) => (
        <Stack key={row.name} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t(row.detail)}
            </Typography>
          </Box>
          <Chip
            size="small"
            variant="outlined"
            color={row.ok === null ? 'default' : row.ok ? 'success' : 'warning'}
            label={t(row.ok === null ? 'dash.integrations.checking' : row.ok ? 'dash.integrations.ok' : 'dash.integrations.off')}
          />
        </Stack>
      ))}
    </Stack>
  )
}
