// Espejo de backend/src/types.ts (bloque "Búsqueda global"). Claves en inglés
// camelCase como el resto de la API; los valores de los enumerados van en
// español, tal cual están en la base.

export type SearchPatientResult = {
  kind: 'patient'
  id: string
  name: string
  document: string
  /** Tiene alertas sin resolver de severidad alta o crítica. */
  critical: boolean
  bed: string | null
  unit: string | null
  /** `dispositivo.codigo` con el que se abre el monitoreo, o null. */
  device: string | null
  diagnosis: string | null
}

export type SearchNoteResult = {
  kind: 'soapNote'
  id: string
  patientId: string
  patientName: string
  at: string
  excerpt: string
}

export type SearchDocumentResult = {
  kind: 'document'
  id: string
  patientId: string
  patientName: string
  title: string
  /** `documento_clinico.tipo`: laboratorio, imagenologia, receta, … */
  type: string
  at: string
  unit: string | null
}

export type SearchResult = SearchPatientResult | SearchNoteResult | SearchDocumentResult

export type SearchResponse = {
  query: string
  patients: SearchPatientResult[]
  notes: SearchNoteResult[]
  documents: SearchDocumentResult[]
  total: number
}
