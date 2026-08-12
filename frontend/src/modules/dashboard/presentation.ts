import type { StringKey } from '../../shared/i18n/dictionary'
import { alertSeverities } from '../sensors/types'
import type { AlertSeverity, AlertStatus } from '../sensors/types'
import type { DeviceState } from './types'
import type { AdmissionState, AppointmentState, BedState } from '../admissions/types'

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

// Admisión. Va aquí por lo mismo que las severidades: el estado de una cama y
// el de una cita se pintan en el tablero y en la pantalla de Admisión, y dos
// tablas de colores acabarían discrepando.

export const bedStateColor: Record<BedState, 'success' | 'error' | 'info' | 'warning'> = {
  disponible: 'success',
  ocupada: 'error',
  limpieza: 'info',
  mantenimiento: 'warning',
}

export const bedStateKey: Record<BedState, StringKey> = {
  disponible: 'bedState.disponible',
  ocupada: 'bedState.ocupada',
  limpieza: 'bedState.limpieza',
  mantenimiento: 'bedState.mantenimiento',
}

export const admissionStateColor: Record<AdmissionState, 'success' | 'default' | 'warning'> = {
  activo: 'success',
  egresado: 'default',
  cancelado: 'warning',
}

export const admissionStateKey: Record<AdmissionState, StringKey> = {
  activo: 'admissionState.activo',
  egresado: 'admissionState.egresado',
  cancelado: 'admissionState.cancelado',
}

export const appointmentStateColor: Record<
  AppointmentState,
  'info' | 'primary' | 'success' | 'default' | 'error'
> = {
  programada: 'info',
  confirmada: 'primary',
  atendida: 'success',
  cancelada: 'default',
  no_asistio: 'error',
}

export const appointmentStateKey: Record<AppointmentState, StringKey> = {
  programada: 'appointmentState.programada',
  confirmada: 'appointmentState.confirmada',
  atendida: 'appointmentState.atendida',
  cancelada: 'appointmentState.cancelada',
  no_asistio: 'appointmentState.no_asistio',
}
