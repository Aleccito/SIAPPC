import type { StringKey } from '../../shared/i18n/dictionary'
import { alertSeverities } from '../sensors/types'
import type { AlertSeverity, AlertStatus } from '../sensors/types'
import type { DeviceState } from './types'
import type {
  AdmissionState,
  AdmissionType,
  AppointmentState,
  BedState,
} from '../admissions/types'

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

// Clasificación clínica del tablero médico (ATLS).
//
// OJO con el origen del dato: ni el estado ni el triage existen como columna.
// Los dos se DERIVAN de la peor alerta abierta del paciente, que es lo único
// que la base sabe hoy sobre su gravedad. Por eso se calculan aquí una sola vez
// y salen juntos: son la misma regla mirada de dos maneras, y si se escribieran
// por separado acabarían contradiciéndose en pantalla.
//
// Cuando `ingreso` tenga una columna de triage puesta por el médico, esta
// función deja de derivarlo y pasa a leerlo; el resto del widget no cambia.

export type ClinicalState = 'critico' | 'atencion' | 'estable'

/** Nivel de triage ATLS: T1 atención inmediata, T3 puede esperar. */
export type TriageLevel = 'T1' | 'T2' | 'T3'

export const clinicalStateColor: Record<ClinicalState, 'error' | 'warning' | 'success'> = {
  critico: 'error',
  atencion: 'warning',
  estable: 'success',
}

export const clinicalStateKey: Record<ClinicalState, StringKey> = {
  critico: 'dash.state.critico',
  atencion: 'dash.state.atencion',
  estable: 'dash.state.estable',
}

export function clinicalState(worstSeverity: AlertSeverity | null): ClinicalState {
  if (worstSeverity === 'critica') return 'critico'
  if (worstSeverity === 'alta' || worstSeverity === 'media') return 'atencion'
  // `baja` incluida: una alerta de calidad de señal no pone a nadie en amarillo.
  return 'estable'
}

export function triageLevel(worstSeverity: AlertSeverity | null): TriageLevel {
  const state = clinicalState(worstSeverity)
  if (state === 'critico') return 'T1'
  return state === 'atencion' ? 'T2' : 'T3'
}

// Nota sobre los rótulos: el mockup de /patients llama MONITOREO a lo que el
// tablero llama ATENCIÓN. Se mantiene UNA sola escala y UN solo rótulo, no dos
// tablas paralelas: es el mismo eje derivado de la misma peor alerta abierta, y
// dos palabras para el mismo estado harían que el tablero y la lista de
// pacientes parecieran discrepar sobre el mismo enfermo mirándolos de reojo.
// Si el hospital prefiere "Monitoreo", se cambia el valor de
// 'dash.state.atencion' en el diccionario y cambia en las dos pantallas a la
// vez, que es justamente lo que se quiere.

/** Color de una cifra de signo vital según el umbral que la haría alertar. */
export type VitalTone = 'error' | 'warning' | undefined

// Umbrales de color de los signos vitales. Son LOS MISMOS que dispara la
// ingesta (backend/src/services/mqttIngest.ts): si aquí fueran otros, un número
// podría verse rojo sin alerta, o verse normal con una alerta crítica abierta.
//
// Viven aquí y no junto a la tabla del tablero porque la lista de pacientes
// pinta las mismas dos columnas: copiarlos sería garantizar que un día alguien
// ajuste un umbral en un archivo y no en el otro.

export function hrTone(hr: number): VitalTone {
  if (hr < 40 || hr > 140) return 'error'
  if (hr < 50 || hr > 120) return 'warning'
  return undefined
}

export function spo2Tone(spo2: number): VitalTone {
  if (spo2 < 85) return 'error'
  if (spo2 < 90) return 'warning'
  return undefined
}

/**
 * Respiración ESTIMADA (`resp`), la que publica el monitor a partir de cómo la
 * respiración mueve la línea de base del pletismógrafo.
 *
 * Nunca devuelve 'error', y no es un descuido: la ingesta tampoco la eleva
 * nunca a `critica` (ver el comentario de `resp` en mqttIngest.ts). Es una
 * estimación óptica, no una respiración medida por flujo ni por impedancia, y
 * pintarla en rojo la haría parecer más fiable que el número del que sale. El
 * único umbral es el mismo que abre la alerta: fuera de 8–30 rpm.
 *
 * Ojo: `modules/monitoring/vitals.ts` marca 12–20 como rango "normal" para el
 * monitor de una cama. Aquí no se usa ese margen porque en una lista de doce
 * camas un color sin alerta detrás invita a llamar a alguien por algo que el
 * servidor no consideró digno de una alerta.
 */
export function respTone(resp: number): VitalTone {
  if (resp < 8 || resp > 30) return 'warning'
  return undefined
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

export const admissionTypeKey: Record<AdmissionType, StringKey> = {
  urgencia: 'admissionType.urgencia',
  programado: 'admissionType.programado',
  traslado: 'admissionType.traslado',
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
