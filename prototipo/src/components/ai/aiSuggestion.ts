// No viene de Figma: cómo viaja una sugerencia de la IA a la nota SOAP (REVISION-IA.md, sección 5).
// Va en sessionStorage ligada a la cédula: sobrevive a recargar, no pone texto clínico en la URL y una
// sugerencia de un paciente no aparece en la nota de otro. Se borra al firmar, al descartar y al cerrar sesión.

export type SoapTarget = 'a' | 'p';

export type AiSuggestion = {
  cedula: string;
  origin: 'consulta' | 'ideas';
  /** Qué se llevó ("Respuesta completa", "Estudios", "Hipótesis de la IA"…). */
  what: string;
  at: string;
  model: string | null;
  /** Texto plano, ya sin Markdown. */
  text: string;
  target: SoapTarget;
};

const KEY = (cedula: string) => `ai.sugerencia.${cedula}`;
const USED = (cedula: string) => `ai.usada.${cedula}`;

function get(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function set(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Sin sessionStorage la sugerencia dura lo que la pantalla.
  }
}

export function saveSuggestion(s: AiSuggestion) {
  set(KEY(s.cedula), JSON.stringify(s));
}

export function readSuggestion(cedula: string): AiSuggestion | null {
  try {
    const raw = get(KEY(cedula));
    const s = raw ? (JSON.parse(raw) as AiSuggestion) : null;
    return s && s.cedula === cedula ? s : null;
  } catch {
    return null;
  }
}

export function discardSuggestion(cedula: string) {
  set(KEY(cedula), null);
}

/** La nota de este paciente ya tiene texto que vino de la IA: firmar pide la casilla de D8. */
export function markAiTextUsed(cedula: string) {
  set(USED(cedula), '1');
}
export function aiTextUsed(cedula: string): boolean {
  return get(USED(cedula)) === '1';
}
/** Al firmar o descartar la nota. */
export function clearAiText(cedula: string) {
  set(KEY(cedula), null);
  set(USED(cedula), null);
}

/** Al cerrar sesión: no queda ninguna sugerencia ni marca de ningún paciente. */
export function clearAllAiSuggestions() {
  try {
    // Primero se juntan las claves y después se borran: al borrar, el navegador puede reordenarlas y un recorrido por
    // índice se saltaría alguna.
    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('ai.sugerencia.') || k.startsWith('ai.usada.'));
    for (const k of keys) sessionStorage.removeItem(k);
  } catch {
    // Nada que borrar.
  }
}
