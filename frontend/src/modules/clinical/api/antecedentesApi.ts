import { request } from '../../../shared/api/http'

// Antecedentes del expediente. La categoría ya existe en el backend
// (backend/src/routes/historia.ts, slug `antecedentes`), así que aquí no hay
// datos de ejemplo: se leen y se escriben por sus rutas reales.
//
// Va en su propio archivo y no en clinicalApi.ts porque esa pantalla usa el
// expediente completo (`GET /historia/:pacienteId`) y esta solo necesita una
// categoría.

// Los mismos cinco valores del enum `TipoAntecedente` de prisma/schema.prisma.
export const tiposAntecedente = [
  'personal',
  'familiar',
  'quirurgico',
  'ginecoobstetrico',
  'habito',
] as const

export type TipoAntecedente = (typeof tiposAntecedente)[number]

// Espejo del `toDto` de la categoría `antecedentes` en historia.ts.
export type Antecedente = {
  id: string
  type: TipoAntecedente
  description: string
  // `parentesco` en la tabla: solo tiene sentido cuando `type = familiar`.
  relationship: string | null
  // Año aproximado; muchos antecedentes no traen fecha exacta.
  year: number | null
  // `false` = dado de baja. Del expediente no se borra (no hay DELETE).
  active: boolean
}

export type NuevoAntecedente = {
  type: TipoAntecedente
  description: string
  relationship?: string
  year?: number
}

export async function listAntecedentes(pacienteId: string): Promise<Antecedente[]> {
  return request<Antecedente[]>(`/historia/${pacienteId}/antecedentes`)
}

export async function createAntecedente(
  pacienteId: string,
  antecedente: NuevoAntecedente,
): Promise<Antecedente> {
  return request<Antecedente>(`/historia/${pacienteId}/antecedentes`, {
    method: 'POST',
    body: JSON.stringify(antecedente),
  })
}
