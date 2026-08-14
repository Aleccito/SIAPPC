import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import type { Notification, NotificationKind } from './types'
import type { StringKey } from '../../shared/i18n/dictionary'

// Icono y color por tipo. Vive aparte de la página porque el menú de la
// campana pinta las mismas filas: si estuviera dentro de la pantalla, el menú
// tendría su propia tabla y las dos se separarían al primer tipo nuevo.
type Palette = 'error' | 'warning'

// Los dos comparten icono a propósito: son el mismo suceso —una constante vital
// fuera de rango— y lo que los separa es la gravedad, que es lo que dice el
// color. Dos dibujos distintos harían pensar en dos cosas distintas.
const KIND: Record<NotificationKind, { icon: SvgIconComponent; color: Palette }> = {
  alertaCritica: { icon: NotificationsActiveOutlinedIcon, color: 'error' },
  alertaTemprana: { icon: NotificationsActiveOutlinedIcon, color: 'warning' },
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
 * que el usuario no estaba trabajando.
 *
 * Sin `export`: solo la usa `groupByDay`, aquí al lado. Lo era cuando la bandeja
 * filtraba por fecha en el navegador; ese filtro se quitó al paginar en el
 * servidor.
 */
function dayKey(at: string | Date): string {
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

// --- Texto de una fila ----------------------------------------------------
//
// El servidor manda los datos del hecho, no la frase: así el idioma lo decide
// el diccionario y no queda español incrustado en una respuesta JSON. Las dos
// funciones viven aquí, junto al icono y el color, porque la campana y la
// bandeja pintan la misma fila y no pueden redactarla cada una a su manera.

type Traducir = (key: StringKey, vars?: Record<string, string>) => string

/** "Elena Rodríguez · Equipo UCI-03", o el equipo solo si no hay paciente. */
export function notificationTitle(notification: Notification, t: Traducir): string {
  if (notification.patientName) {
    return t('notifications.row.title', {
      patient: notification.patientName,
      device: notification.device,
    })
  }
  // El equipo puede estar sin paciente asignado: se dice, no se rellena con un
  // nombre inventado ni se esconde la notificación.
  return t('notifications.row.titleNoPatient', { device: notification.device })
}

/**
 * El mensaje que redactó la ingesta.
 *
 * Si la alerta no trae mensaje —la columna es nulable— se reconstruye con la
 * lectura que la disparó, que es un dato real y no un texto de relleno.
 */
export function notificationBody(notification: Notification, t: Traducir): string {
  if (notification.message) return notification.message
  return t('notifications.row.reading', {
    variable: notification.variable,
    value: String(notification.value),
    unit: notification.unit,
  })
}
