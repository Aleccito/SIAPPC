// Notas SOAP: rutas y ayudas para mostrar las notas de /soap/notes (src/api/clinical.ts).
import type { SoapNote as ApiSoapNote } from '../api/types/clinical';
import type { SoapNote } from '../components/patient/SoapSections';

export const SOAP_HISTORY_PATH = '/MedPacienteNotasSoapHistorial';
export const SOAP_NEW_PATH = '/MedPacienteNotasSoapNueva';

/** Detalle de una nota (el paciente lo agrega `withPatient`). */
export const soapDetailPath = (noteId: string) => `/MedPacienteNotasSoapDetalle?nota=${encodeURIComponent(noteId)}`;

/** Las cuatro secciones para `SoapSections`; una sección vacía se muestra como raya. */
export const toSoapSections = (n: ApiSoapNote): SoapNote => ({
  s: n.subjective ?? '—',
  o: n.objective ?? '—',
  a: n.assessment ?? '—',
  p: n.plan ?? '—',
});

/** Referencia corta de la nota ("NS-000012"), en lugar de las de ejemplo de Figma. */
export const noteRef = (n: ApiSoapNote) => `NS-${n.id.padStart(6, '0')}`;

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Fecha y hora de ahora con el formato de las notas ("23 Nov 2026, 14:05"). */
export function nowLabel() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
