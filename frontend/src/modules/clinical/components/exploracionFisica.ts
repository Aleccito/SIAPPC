import type { StringKey } from '../../../shared/i18n/dictionary'

// Tipos y claves de traducción de la Exploración Física, en un módulo aparte
// para que las tarjetas y la pantalla compartan la misma forma del formulario.
//
// Las claves de esta pantalla viven aquí, en un solo sitio, para que la página
// y sus tarjetas no las repitan sueltas. Están tipadas contra el diccionario:
// una clave que no exista no compila.
export const K = {
  title: 'exploracion.title',
  subtitle: 'exploracion.subtitle',
  back: 'exploracion.back',
  newSoap: 'exploracion.newSoap',
  generateReport: 'exploracion.generateReport',

  pickPatient: 'exploracion.pickPatient',
  patientError: 'exploracion.patientError',
  admitted: 'exploracion.admitted',

  tabPending: 'exploracion.tabPending',

  somatometria: 'exploracion.somatometria',
  peso: 'exploracion.peso',
  talla: 'exploracion.talla',
  imc: 'exploracion.imc',
  perimetro: 'exploracion.perimetro',

  signosVitales: 'exploracion.signosVitales',
  glasgow: 'exploracion.glasgow',
  glasgowHelp: 'exploracion.glasgowHelp',

  detalle: 'exploracion.detalle',
  regionActiva: 'exploracion.regionActiva',
  hallazgoPlaceholder: 'exploracion.hallazgoPlaceholder',
  hallazgoNormal: 'exploracion.hallazgo.normal',
  hallazgoAnormal: 'exploracion.hallazgo.anormal',

  save: 'exploracion.save',
  sinBackend: 'exploracion.sinBackend',
} as const

/** Pestañas del expediente del paciente. Aquí solo vive «Historia Clínica». */
export const EXPLORACION_TABS: { value: string; label: StringKey }[] = [
  { value: 'summary', label: 'exploracion.tab.summary' },
  { value: 'history', label: 'exploracion.tab.history' },
  { value: 'soap', label: 'exploracion.tab.soap' },
  { value: 'monitoring', label: 'exploracion.tab.monitoring' },
  { value: 'documents', label: 'exploracion.tab.documents' },
]

// Las seis regiones se exploran siempre en este orden: es el de la nota médica,
// de la cabeza a los pies y el neurológico al final.
export const REGIONES = [
  'cabezaCuello',
  'torax',
  'abdomen',
  'extremidadesSuperiores',
  'extremidadesInferiores',
  'neurologico',
] as const

export type Region = (typeof REGIONES)[number]

export const REGION_KEY: Record<Region, StringKey> = {
  cabezaCuello: 'exploracion.region.cabezaCuello',
  torax: 'exploracion.region.torax',
  abdomen: 'exploracion.region.abdomen',
  extremidadesSuperiores: 'exploracion.region.extremidadesSuperiores',
  extremidadesInferiores: 'exploracion.region.extremidadesInferiores',
  neurologico: 'exploracion.region.neurologico',
}

// Las cuatro técnicas de la exploración, en el orden clásico en que se aplican.
export const TECNICAS = ['inspeccion', 'palpacion', 'percusion', 'auscultacion'] as const

export type Tecnica = (typeof TECNICAS)[number]

export const TECNICA_KEY: Record<Tecnica, StringKey> = {
  inspeccion: 'exploracion.tecnica.inspeccion',
  palpacion: 'exploracion.tecnica.palpacion',
  percusion: 'exploracion.tecnica.percusion',
  auscultacion: 'exploracion.tecnica.auscultacion',
}

/** Un hallazgo sin explorar no es «normal»: por eso el estado admite vacío. */
export type Hallazgo = { estado: '' | 'normal' | 'anormal'; texto: string }

export type RegionHallazgos = Record<Tecnica, Hallazgo>

export type ExploracionForm = {
  pesoKg: string
  tallaCm: string
  perimetroCm: string
  glasgow: string
  regiones: Record<Region, RegionHallazgos>
}

const HALLAZGO_VACIO: Hallazgo = { estado: '', texto: '' }

/**
 * Formulario en blanco.
 *
 * Arranca vacío a propósito: no hay tabla de exploración física en el esquema,
 * y rellenar la pantalla con cifras de ejemplo en una aplicación clínica se
 * leería como una medición real del paciente.
 */
export function formularioVacio(): ExploracionForm {
  return {
    pesoKg: '',
    tallaCm: '',
    perimetroCm: '',
    glasgow: '',
    regiones: Object.fromEntries(
      REGIONES.map((region) => [
        region,
        Object.fromEntries(
          TECNICAS.map((tecnica) => [tecnica, { ...HALLAZGO_VACIO }]),
        ) as RegionHallazgos,
      ]),
    ) as Record<Region, RegionHallazgos>,
  }
}

export type ImcCalculado = { valor: number; clase: StringKey }

/**
 * IMC = peso / talla². Devuelve `null` mientras falte cualquiera de los dos:
 * un IMC a medias no es un dato, y enseñar «0.0» invita a leerlo como medición.
 *
 * Los cortes son los de la OMS para adultos.
 */
export function calcularImc(pesoKg: string, tallaCm: string): ImcCalculado | null {
  const peso = Number(pesoKg)
  const talla = Number(tallaCm) / 100
  if (!Number.isFinite(peso) || !Number.isFinite(talla) || peso <= 0 || talla <= 0) return null

  const valor = peso / (talla * talla)
  const clase =
    valor < 18.5
      ? ('exploracion.imc.bajoPeso')
      : valor < 25
        ? ('exploracion.imc.normal')
        : valor < 30
          ? ('exploracion.imc.sobrepeso')
          : ('exploracion.imc.obesidad')

  return { valor, clase }
}

/** Color del IMC: solo el rango normal se pinta en verde. */
export function colorImc(clase: StringKey): 'success.main' | 'warning.main' | 'error.main' {
  if (clase === ('exploracion.imc.normal')) return 'success.main'
  if (clase === ('exploracion.imc.obesidad')) return 'error.main'
  return 'warning.main'
}
