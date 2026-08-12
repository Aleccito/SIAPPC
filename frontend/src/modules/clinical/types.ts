// Espejo de backend/src/types.ts. El backend produce exactamente estas formas;
// si una cambia allá, esta se cambia aquí y no al revés.

export type SoapStatus = 'borrador' | 'firmada'

export type SoapNote = {
  id: string
  patientId: string
  authorId: string
  authorName: string
  // No nulo = la nota es un addendum de esa otra.
  parentId: string | null
  at: string
  subjective: string | null
  objective: string | null
  assessment: string | null
  plan: string | null
  status: SoapStatus
  signedById: string | null
  signedByName: string | null
  signedAt: string | null
}

export type NewSoapNote = {
  patientId: number
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  sign?: boolean
}

// Las categorías del expediente, en el orden en que se leen en pantalla. Los
// nombres son los mismos segmentos de la URL del backend.
export const historiaCategories = [
  'antecedentes',
  'alergias',
  'medicamentos',
  'diagnosticos',
  'hospitalizaciones',
  'procedimientos',
  'documentos',
  'evoluciones',
] as const

export type HistoriaCategory = (typeof historiaCategories)[number]

// Cada categoría trae columnas distintas y la pantalla las pinta genéricamente
// —etiqueta: valor— en vez de tener ocho tablas a medida. Un expediente vacío
// devuelve el arreglo vacío, no falta la clave.
export type HistoriaEntry = Record<string, unknown> & { id: string }

export type HistoriaChange = {
  id: string
  category: string
  recordId: string
  action: 'alta' | 'modificacion' | 'baja'
  authorId: string | null
  authorName: string | null
  at: string
  detail: string | null
}

export type Expediente = Record<HistoriaCategory, HistoriaEntry[]> & {
  patientId: string
  patientName: string
  document: string
  openedAt: string | null
  notes: string | null
}
