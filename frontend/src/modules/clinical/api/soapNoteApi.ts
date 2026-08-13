import { request } from '../../../shared/api/http'
import type { SoapNote } from '../types'

// En archivo propio para no tocar clinicalApi.ts: ahí no existía el detalle de
// una nota suelta, que es lo único que necesita el diálogo.

/** GET /soap/notes/:id — la nota completa, con autor y firma. */
export async function getSoapNote(noteId: string): Promise<SoapNote> {
  return request<SoapNote>(`/soap/notes/${encodeURIComponent(noteId)}`)
}
