import type { StringKey } from '../../shared/i18n/dictionary'

// Los signos que muestra el monitor, en el orden en que se leen. `variable` es
// el `sensor.variable_medida` que publica la Raspberry; los que hoy ningún
// dispositivo emite se quedan con el hueco a la vista en vez de desaparecer,
// para que se note que falta el sensor y no que el paciente está estable.
export type VitalSpec = {
  variable: string
  label: StringKey
  unit: string
  /** Fuera de este rango el valor se pinta en ámbar. */
  normal: [number, number]
  /** Fuera de este otro, en rojo. Debe contener a `normal`. */
  critical: [number, number]
}

// Los umbrales de `hr` y `spo2` son los mismos que aplica la ingesta al decidir
// si abre una alerta (backend/src/services/mqttIngest.ts). Si allá cambian, aquí
// también: el monitor no puede pintar en verde algo que el servidor ya elevó.
export const vitals: VitalSpec[] = [
  { variable: 'hr', label: 'monitor.hr', unit: 'lpm', normal: [50, 120], critical: [40, 140] },
  { variable: 'spo2', label: 'monitor.spo2', unit: '%', normal: [90, 100], critical: [85, 100] },
  { variable: 'pa', label: 'monitor.pa', unit: 'mmHg', normal: [90, 140], critical: [80, 180] },
  { variable: 'temp', label: 'monitor.temp', unit: '°C', normal: [36, 37.5], critical: [35, 39] },
  { variable: 'fr', label: 'monitor.fr', unit: 'rpm', normal: [12, 20], critical: [8, 30] },
]

export type VitalLevel = 'normal' | 'warning' | 'critical'

export function levelOf(spec: VitalSpec, value: number): VitalLevel {
  if (value < spec.critical[0] || value > spec.critical[1]) return 'critical'
  if (value < spec.normal[0] || value > spec.normal[1]) return 'warning'
  return 'normal'
}

// Sobre el fondo oscuro del monitor: blanco lo que está en rango, ámbar lo que
// se sale y rojo lo crítico. Son colores fijos y no del tema porque el panel es
// oscuro siempre, y `text.primary` allí sería ilegible.
export const levelColor: Record<VitalLevel, string> = {
  normal: '#ffffff',
  warning: '#fbbf24',
  critical: '#f87171',
}
