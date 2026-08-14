import type { StringKey } from '../../shared/i18n/dictionary'
import { hrTone, respTone, spo2Tone } from '../dashboard/presentation'
import type { ClinicalState, VitalTone } from '../dashboard/presentation'
import type { MonitoredBed } from './types'

// Cómo se pinta la central. Los criterios clínicos —qué es crítico, qué cifra
// se sale de rango— NO están aquí: viven en modules/dashboard/presentation.ts
// (clinicalState, hrTone, spo2Tone, respTone) y se importan. Este archivo solo
// traduce esas decisiones a píxeles.

/**
 * Los mismos tres estados, en hexadecimal.
 *
 * Hacen falta aparte de `clinicalStateColor` porque el panel de cada tarjeta es
 * negro siempre —como el monitor de cama— y ahí `palette.error.main` del tema
 * claro queda demasiado oscuro para leerse. Son los mismos tonos que ya usa
 * `levelColor` en vitals.ts, para que un número rojo en la central y en el
 * monitor de la cama sean el mismo rojo.
 */
export const stateHex: Record<ClinicalState, string> = {
  critico: '#f87171',
  atencion: '#fbbf24',
  estable: '#4ade80',
}

/**
 * Color de una cifra sobre el panel negro de la tarjeta.
 *
 * `undefined` (en rango) es blanco y no verde: el verde está reservado al
 * estado de la cama. Si cada número en rango fuera verde, una cama crítica con
 * cuatro cifras normales y una roja se leería de lejos como una cama verde.
 */
const toneHex: Record<'normal' | 'warning' | 'error', string> = {
  normal: '#ffffff',
  warning: '#fbbf24',
  error: '#f87171',
}

export function hexOf(tone: VitalTone): string {
  return toneHex[tone ?? 'normal']
}

const MINUTO = 60_000
const HORA = 60 * MINUTO
const DIA = 24 * HORA

/**
 * "hace 5 min" a partir de una marca ISO.
 *
 * Se redondea hacia abajo y se corta en "hace un momento" por debajo del
 * minuto: el mockup enseña segundos ("hace 3seg"), pero una cifra de segundos
 * que solo se recalcula cuando la consulta vuelve (cada 5 s) estaría mintiendo
 * la mayor parte del tiempo. Con minutos el redondeo absorbe el desfase.
 *
 * Devuelve la clave y sus valores en vez del texto ya armado porque traducir es
 * trabajo de `t()`, y este módulo no tiene acceso al diccionario.
 */
export function agoKey(at: string | null): { key: StringKey; params?: Record<string, string> } {
  if (!at) return { key: 'central.ago.never' }

  const elapsed = Date.now() - new Date(at).getTime()
  // Un reloj de la Pi adelantado deja `elapsed` en negativo. Se trata como
  // recién llegada en vez de enseñar "hace -2 min", que no significa nada.
  if (elapsed < MINUTO) return { key: 'central.ago.now' }
  if (elapsed < HORA) {
    return { key: 'central.ago.minutes', params: { n: String(Math.floor(elapsed / MINUTO)) } }
  }
  if (elapsed < DIA) {
    return { key: 'central.ago.hours', params: { n: String(Math.floor(elapsed / HORA)) } }
  }
  return { key: 'central.ago.days', params: { n: String(Math.floor(elapsed / DIA)) } }
}

/**
 * Cifra tal como se pinta, o la raya cuando no hay medición.
 *
 * La raya NO es un cero ni un valor por defecto: dice que falta el dato, que es
 * distinto de estar en rango. Ninguna pantalla de este proyecto enseña una cifra
 * inventada, y esta es la función que lo garantiza en la central.
 */
export function figure(value: number | null): string {
  return value === null ? '—' : String(value)
}

/**
 * Cuánto puede pasar sin lectura antes de que la cifra deje de darse por buena.
 *
 * Los equipos publican una tanda por segundo, así que dos minutos son ciento
 * veinte tandas perdidas: no es una pausa, es que dejó de llegar.
 */
export const STALE_AFTER_MS = 2 * 60_000

export function isStale(at: string | null): boolean {
  if (!at) return false
  const elapsed = Date.now() - new Date(at).getTime()
  // El negativo es un reloj de la Pi adelantado. Eso no es una lectura vieja.
  return elapsed > STALE_AFTER_MS
}

/**
 * ¿Hay señal VIGENTE que dibujar?
 *
 * Decide si se pinta el trazo, y es más estricta que `isStale` a propósito: solo
 * cuenta una lectura de este minuto. Entre uno y dos minutos la cifra todavía se
 * da por buena —una FC no cambia tanto en noventa segundos— pero una ONDA de
 * hace noventa segundos ya no describe nada de lo que está pasando.
 *
 * Sin esto, el trazo se quedaba quieto pero seguía dibujado, y una cama sin
 * equipo y sin una sola lectura enseñaba un ECG completo. Que no se moviera no
 * lo hacía menos falso: lo que se ve es una onda, y no había ninguna.
 *
 * Y cuando no hay señal NO se dibuja una línea plana: en un ECG eso es asistolia,
 * o sea un hallazgo clínico. La ausencia de datos se dice con palabras.
 */
export function hasLiveSignal(bed: MonitoredBed): boolean {
  if (!bed.device || !bed.vitals.at) return false
  const elapsed = Date.now() - new Date(bed.vitals.at).getTime()
  return elapsed < MINUTO
}

/**
 * Por qué no hay trazo. Los tres casos llevan a acciones distintas: sin equipo
 * hay que pedir uno, sin ninguna lectura hay que revisar el que hay, y una señal
 * perdida hace un rato suele ser un electrodo suelto.
 */
export function traceReason(bed: MonitoredBed): StringKey {
  if (!bed.device) return 'central.trace.noDevice'
  if (!bed.vitals.at) return 'central.trace.never'
  return 'central.trace.lost'
}

/** Un número de la cabecera de la cama, ya resuelto: qué es, cuánto y de qué color. */
export type Metric = {
  id: 'hr' | 'spo2' | 'resp' | 'gcs'
  label: StringKey
  unit: StringKey
  /**
   * La cifra VIGENTE, o `null` si no la hay.
   *
   * `null` tanto cuando nunca hubo medición como cuando la última ya envejeció.
   * Las dos cosas significan lo mismo de cara a quien mira: **ahora mismo no se
   * sabe cuánto vale**. Enseñar la de hace veinte minutos con el mismo tamaño y
   * el mismo color que una de hace un segundo es afirmar algo que no consta.
   */
  value: number | null
  tone: VitalTone
  /**
   * La última medición conocida, cuando `value` es null porque envejeció.
   *
   * Se conserva porque sigue siendo información —el último dato real que hubo—
   * pero se pinta aparte y en pequeño: es contexto, no el valor actual.
   */
  lastKnown: number | null
  /** Advertencia sobre la fiabilidad del dato, si la hay. */
  hint?: StringKey
}

/**
 * Las cuatro cifras que la central enseña por cama, en el orden en que se leen.
 *
 * Son cuatro y no las siete del mockup. Las tres que faltan:
 *
 *  - **P. ARTERIAL**: ninguna Pi la publica, y `lectura.valor` es un escalar
 *    DECIMAL: una PA es un par sistólica/diastólica y no cabe en una fila. La
 *    columna se OMITE en vez de dejarse llena de rayas — una columna que nunca,
 *    para ninguna cama, puede tener un valor, solo ocupa ancho y hace pensar que
 *    algún día se llenará sola.
 *  - **PAM**: es aritmética sobre la PA. Sin PA no hay PAM.
 *  - **TEMP**: nadie publica `temp`. La única temperatura del equipo es
 *    `die_temp_c`, la del encapsulado del MAX30102 (~30 °C): es la del chip, y
 *    enseñarla como temperatura corporal sería una mentira clínica.
 *
 * El GCS va sin color a propósito. Colorear una cifra es afirmar que el sistema
 * la considera fuera de rango, y el servidor no abre ninguna alerta sobre
 * `glasgow`: no hay umbral que respetar, así que el resto de la interfaz
 * quedaría diciendo algo que la ingesta no dice. Lleva su advertencia de que no
 * es telemetría.
 */
export type MetricSpec = Pick<Metric, 'id' | 'label' | 'unit' | 'hint'>

/**
 * Qué columnas hay y en qué orden, sin ninguna cama de por medio.
 *
 * Existe aparte de `metricsOf` porque la cabecera de la tabla necesita los
 * rótulos antes de tener datos —y con la lista vacía no hay ninguna fila de la
 * que sacarlos—. Que las dos salgan de la misma lista es lo que impide que la
 * cabecera y las celdas se desordenen una respecto de la otra.
 */
export const metricSpecs: MetricSpec[] = [
  { id: 'hr', label: 'central.hr', unit: 'central.unit.hr' },
  { id: 'spo2', label: 'central.spo2', unit: 'central.unit.spo2' },
  { id: 'resp', label: 'central.fr', unit: 'central.unit.fr', hint: 'central.fr.estimated' },
  { id: 'gcs', label: 'central.gcs', unit: 'central.unit.gcs', hint: 'central.gcs.notLive' },
]

export function metricsOf(bed: MonitoredBed): Metric[] {
  const { hr, spo2, resp } = bed.vitals
  const value: Record<Metric['id'], number | null> = {
    hr,
    spo2,
    resp,
    gcs: bed.glasgow,
  }
  const tone: Record<Metric['id'], VitalTone> = {
    hr: hr === null ? undefined : hrTone(hr),
    spo2: spo2 === null ? undefined : spo2Tone(spo2),
    resp: resp === null ? undefined : respTone(resp),
    gcs: undefined,
  }

  // El GCS NO envejece con la telemetría y por eso queda fuera: sale de la
  // exploración física, lo escribe un clínico y no lo publica ningún equipo.
  // Que la Pi deje de mandar no lo vuelve dudoso. Marcarlo como viejo diría que
  // se perdió una medición que nunca dependió de esa conexión.
  const vieja = isStale(bed.vitals.at)

  return metricSpecs.map((spec) => {
    const actual = value[spec.id]
    const envejece = spec.id !== 'gcs'

    if (vieja && envejece && actual !== null) {
      // Sin tono: colorear una cifra es afirmar que el sistema la considera
      // dentro o fuera de rango AHORA, y de eso es justo de lo que no hay dato.
      return { ...spec, value: null, tone: undefined, lastKnown: actual }
    }
    return { ...spec, value: actual, tone: tone[spec.id], lastKnown: null }
  })
}
