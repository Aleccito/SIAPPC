import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import type { Notification, NotificationKind } from './types'
import type { StringKey } from '../../shared/i18n/dictionary'

// Icono y color por tipo. Vive aparte de la página porque el menú de la
// campana pinta las mismas filas: si estuviera dentro de la pantalla, el menú
// tendría su propia tabla y las dos se separarían al primer tipo nuevo.
type Palette = 'error' | 'warning' | 'success' | 'primary' | 'info'

const KIND: Record<NotificationKind, { icon: SvgIconComponent; color: Palette }> = {
  alertaCritica: { icon: NotificationsActiveOutlinedIcon, color: 'error' },
  alertaTemprana: { icon: NotificationsActiveOutlinedIcon, color: 'warning' },
  asignacion: { icon: PersonAddAltOutlinedIcon, color: 'primary' },
  reporte: { icon: CheckCircleOutlinedIcon, color: 'success' },
  sistema: { icon: MonitorHeartOutlinedIcon, color: 'info' },
  nota: { icon: GroupsOutlinedIcon, color: 'info' },
  mantenimiento: { icon: BuildOutlinedIcon, color: 'primary' },
}

export function kindIcon(kind: NotificationKind): SvgIconComponent {
  return KIND[kind].icon
}

/** Azulejo tenue del color del tipo, como las etiquetas de la bitácora. */
export function kindTile(theme: Theme, kind: NotificationKind) {
  const main = theme.palette[KIND[kind].color].main
  return { bgcolor: alpha(main, 0.12), color: main }
}

// --- Agrupación por día ---------------------------------------------------

type Bucket = 'today' | 'yesterday' | 'older'

// Se compara por día natural y no por horas transcurridas: a las 00:30, algo de
// las 23:00 es "ayer" aunque hayan pasado noventa minutos.
function startOfDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
}

function bucketOf(at: string, now = new Date()): Bucket {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(at))) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return 'older'
}

/**
 * Clave del día en hora local: `YYYY-MM-DD`.
 *
 * A mano y no con `toISOString()`, que pasa a UTC: una notificación de las
 * 23:30 en México caería en el día siguiente y aparecería bajo una fecha en la
 * que el usuario no estaba trabajando. Es también el formato que emite y espera
 * un `<input type="date">`, así que el filtro compara sin convertir nada.
 */
export function dayKey(at: string | Date): string {
  const date = typeof at === 'string' ? new Date(at) : at
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Un grupo por fecha, del día más reciente al más antiguo. */
export function groupByDay(items: Notification[]): [string, Notification[]][] {
  const groups = new Map<string, Notification[]>()
  for (const item of items) {
    const key = dayKey(item.at)
    const list = groups.get(key)
    if (list) list.push(item)
    else groups.set(key, [item])
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a))
}

/**
 * Encabezado de un día: "Hoy · 10 ago 2026".
 *
 * La fecha va siempre, incluso en Hoy y Ayer: son las dos únicas etiquetas que
 * caducan solas, y con la fecha al lado el encabezado sigue siendo cierto si la
 * pestaña lleva abierta desde anoche.
 */
export function dayHeading(
  key: string,
  t: (key: StringKey, vars?: Record<string, string>) => string,
  locale: string,
  now = new Date(),
): string {
  // `key` es local; partirla evita que `new Date('2026-08-10')` la interprete
  // como UTC y retroceda un día según la zona horaria.
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year!, month! - 1, day!)
  const formatted = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const bucket = bucketOf(date.toISOString(), now)
  if (bucket === 'today') return `${t('notifications.group.today')} · ${formatted}`
  if (bucket === 'yesterday') return `${t('notifications.group.yesterday')} · ${formatted}`
  return formatted
}

/**
 * "Hace 5 min", "Ayer, 19:40", "Hace 3 días".
 *
 * Lo de hoy se cuenta en minutos y horas porque es lo que importa: cuánto hace
 * que saltó la alerta. Lo de ayer lleva hora exacta, y lo anterior se redondea
 * a días, donde la hora ya no dice nada.
 */
export function relativeTime(
  at: string,
  t: (key: StringKey, vars?: Record<string, string>) => string,
  locale: string,
  now = new Date(),
): string {
  const date = new Date(at)
  const bucket = bucketOf(at, now)

  if (bucket === 'today') {
    const minutes = Math.max(1, Math.round((now.getTime() - date.getTime()) / 60_000))
    if (minutes < 60) return t('notifications.ago.minutes', { count: String(minutes) })
    return t('notifications.ago.hours', { count: String(Math.round(minutes / 60)) })
  }

  if (bucket === 'yesterday') {
    const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    return t('notifications.ago.yesterdayAt', { time })
  }

  const days = Math.round((now.getTime() - date.getTime()) / 86_400_000)
  return t('notifications.ago.days', { count: String(days) })
}
