import { request } from '../../../shared/api/http'
import type { SearchResponse } from '../types'

/**
 * `GET /search?q=`. El servidor exige dos caracteres como mínimo; llamar con
 * menos devolvería un 400 que la pantalla no tiene nada que enseñar, así que
 * quien llama no dispara la consulta hasta ahí (ver SearchPage).
 */
export async function search(q: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ q })
  return request<SearchResponse>(`/search?${params.toString()}`)
}
