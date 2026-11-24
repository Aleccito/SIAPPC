// Copia de frontend/src/modules/search/api/searchApi.ts (mismas funciones, parámetros y tipos; solo cambian las rutas de importación).
import { request } from './http'
import type { SearchResponse } from './types/search'

/**
 * `GET /search?q=`. El servidor exige dos caracteres como mínimo; llamar con
 * menos devolvería un 400 que la pantalla no tiene nada que enseñar, así que
 * quien llama no dispara la consulta hasta ahí (ver SearchPage).
 */
export async function search(q: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ q })
  return request<SearchResponse>(`/search?${params.toString()}`)
}
