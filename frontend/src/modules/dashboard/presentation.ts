import type { StringKey } from '../../shared/i18n/dictionary'
import { alertSeverities } from '../sensors/types'
import type { AlertSeverity, AlertStatus } from '../sensors/types'
import type { DeviceState } from './types'

// Cómo se pintan y cómo se nombran los valores que vienen de la base. Vive
// aparte de los widgets porque tres de ellos muestran severidades y ninguno
// debería tener su propia tabla de colores.

export const severityColor: Record<AlertSeverity, 'default' | 'info' | 'warning' | 'error'> = {
  baja: 'default',
  media: 'info',
  alta: 'warning',
  critica: 'error',
}

export const severityKey: Record<AlertSeverity, StringKey> = {
  baja: 'alertSeverity.baja',
  media: 'alertSeverity.media',
  alta: 'alertSeverity.alta',
  critica: 'alertSeverity.critica',
}

export const statusKey: Record<AlertStatus, StringKey> = {
  abierta: 'alertStatus.abierta',
  reconocida: 'alertStatus.reconocida',
  resuelta: 'alertStatus.resuelta',
}

export const deviceStateKey: Record<DeviceState, StringKey> = {
  activo: 'dash.deviceState.activo',
  inactivo: 'dash.deviceState.inactivo',
  mantenimiento: 'dash.deviceState.mantenimiento',
  baja: 'dash.deviceState.baja',
}

/** De menor a mayor gravedad, que es el orden del ENUM `alerta.severidad`. */
const rank = new Map<AlertSeverity, number>(alertSeverities.map((s, i) => [s, i]))

/** Orden descendente por severidad: lo crítico primero. */
export function bySeverityDesc(a: AlertSeverity, b: AlertSeverity): number {
  return (rank.get(b) ?? 0) - (rank.get(a) ?? 0)
}

export function severityRank(severity: AlertSeverity | null): number {
  return severity ? (rank.get(severity) ?? 0) + 1 : 0
}
