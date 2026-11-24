/** Texto sin tildes y en minúsculas, para comparar búsquedas ("Núñez" = "nunez"). */
export const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** true si `query` (sin tildes ni mayúsculas) aparece en alguno de los textos. Vacío = todo coincide. */
export const matches = (query: string, ...fields: Array<string | undefined>) => {
  const q = plain(query.trim());
  return !q || fields.some((f) => f !== undefined && plain(f).includes(q));
};
