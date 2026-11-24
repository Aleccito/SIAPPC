// Copia de frontend/src/modules/clinical/api/soapNoteApi.ts (mismas funciones, parámetros y tipos; solo cambian las rutas de importación).
import { request } from './http'
import type { SoapNote } from './types/clinical'

// En archivo propio para no tocar clinicalApi.ts: ahí no existía el detalle de
// una nota suelta, que es lo único que necesita el diálogo.

/** GET /soap/notes/:id — la nota completa, con autor y firma. */
export async function getSoapNote(noteId: string): Promise<SoapNote> {
  return request<SoapNote>(`/soap/notes/${encodeURIComponent(noteId)}`)
}
