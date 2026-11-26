// El paciente del expediente va en la URL: `?paciente=DEMO-0002` (docs/historial/REVISION-IA.md, sección 1).
// Un enlace a una pantalla del expediente que no dice de qué paciente es conserva el de la URL
// actual. Lo aplican Button, Tabs, SegmentedControl, useRowLink, AppLink y usePatientNavigate,
// así que moverse entre pestañas y pantallas del expediente nunca pierde al paciente.
import { useCallback } from 'react';
import { useLocation, useNavigate, type NavigateOptions } from 'react-router-dom';

export const PATIENT_PARAM = 'paciente';

/** Paciente que se abre cuando la URL no trae uno: el caso más parecido al de Figma (crítica, disnea). */
export const DEFAULT_PATIENT = 'DEMO-0002';

/** ¿Es una pantalla del expediente? (`MedPacientesLista` es la lista, no un expediente.) */
export const isPatientPath = (path: string) => /^\/MedPaciente(?!sLista)/.test(path);

/** Agrega el paciente de `currentSearch` a `to` si `to` es del expediente y no trae paciente. */
export function withPatient(to: string, currentSearch: string): string {
  if (!isPatientPath(to)) return to;
  const [path, query = ''] = to.split('?');
  const params = new URLSearchParams(query);
  if (params.has(PATIENT_PARAM)) return to;
  const current = new URLSearchParams(currentSearch).get(PATIENT_PARAM);
  if (!current) return to;
  const next = new URLSearchParams([[PATIENT_PARAM, current], ...params]);
  return `${path}?${next.toString()}`;
}

/** Ruta del expediente de un paciente concreto: `patientPath('/MedPacienteResumen', 'DEMO-0001', { nota: 2 })`. */
export function patientPath(path: string, cedula: string, extra: Record<string, string | number> = {}): string {
  const params = new URLSearchParams([[PATIENT_PARAM, cedula], ...Object.entries(extra).map(([k, v]) => [k, String(v)] as [string, string])]);
  return `${path}?${params.toString()}`;
}

export function useWithPatient() {
  const { search } = useLocation();
  return useCallback((to: string) => withPatient(to, search), [search]);
}

/** `navigate` que conserva el paciente al ir a otra pantalla del expediente. */
export function usePatientNavigate() {
  const navigate = useNavigate();
  const keep = useWithPatient();
  return useCallback(
    (to: string | number, options?: NavigateOptions) => (typeof to === 'number' ? navigate(to) : navigate(keep(to), options)),
    [navigate, keep],
  );
}
