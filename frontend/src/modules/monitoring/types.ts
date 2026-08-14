import type { AlertSeverity } from '../sensors/types'
import type { BedState } from '../admissions/types'
import type { DeviceState } from '../dashboard/types'

// Espejo de backend/src/types.ts (MonitoredBed, MonitoredVitals). El backend
// produce exactamente estas formas; si una cambia allá, cambia aquí.

/**
 * Último valor de cada variable que la central pinta por cama.
 *
 * Solo las tres que un publicador emite de verdad (`hr`, `spo2` y `resp`, ver
 * iot/monitor/net/publisher.py). NO hay presión arterial ni temperatura, y no
 * es un hueco pendiente de rellenar:
 *
 *  - La PA necesitaría un par sistólica/diastólica y `lectura.valor` es un
 *    escalar. La PAM se calcula sobre ese par, así que tampoco existe.
 *  - Nadie publica `temp`. Lo único parecido es la temperatura del encapsulado
 *    del sensor (~30 °C), que no es la del paciente.
 */
export type MonitoredVitals = {
  hr: number | null
  spo2: number | null
  /** Frecuencia respiratoria ESTIMADA del pletismógrafo, en rpm. */
  resp: number | null
  /** Momento de la más reciente de las lecturas anteriores. */
  at: string | null
}

export type MonitoredBed = {
  id: string
  /** `cama.codigo`: "C-01". */
  bed: string
  unitId: string
  unit: string
  bedState: BedState
  /** Todo null cuando la cama no tiene ingreso activo. */
  patientId: string | null
  patientName: string | null
  /** Fecha civil ("1990-05-14T00:00:00-05:00"). La edad se calcula al pintar. */
  birthDate: string | null
  /** `dispositivo.codigo` con el que se abre el monitor de esa cama, o null. */
  device: string | null
  deviceState: DeviceState | null
  openAlerts: number
  /** De aquí se deriva el estado clínico: no hay columna que lo diga. */
  worstSeverity: AlertSeverity | null
  /** `exploracion_fisica.glasgow` (3–15). No es telemetría: no cambia solo. */
  glasgow: number | null
  vitals: MonitoredVitals
}
