// Interruptor de datos del prototipo (REVISION-IA.md, sección 2; CONEXION-BACKEND.md, sección 4).
//
//   VITE_API_MODE=mock   todo simulado (por defecto en `npm run dev`; para trabajar sin backend)
//   VITE_API_MODE=real   todo va a /api (el backend, por el proxy de Vite o de nginx)
//   VITE_API_MODE=mixto  solo los grupos o rutas de VITE_API_REAL van al backend
//                        (VITE_API_REAL=auth,dashboard/assigned-patients,sensors)
//
// Sin la variable, el prototipo funciona sin backend (modo mock).

export type ApiMode = 'mock' | 'real' | 'mixto';

const raw = String(import.meta.env.VITE_API_MODE ?? 'mock');
export const API_MODE: ApiMode = raw === 'real' || raw === 'mixto' ? raw : 'mock';

/**
 * Lo que va al backend en modo mixto: grupos (el primer segmento: `patients` cubre `/patients/3`) o rutas más
 * precisas (`dashboard/assigned-patients` cubre esa ruta y lo que cuelgue de ella, pero no `/dashboard/devices`).
 */
const REAL_PREFIXES = String(import.meta.env.VITE_API_REAL ?? '')
  .split(',')
  .map((g) => g.trim().replace(/^\/+|\/+$/g, ''))
  .filter(Boolean);

/** ¿Esta ruta (sin el prefijo /api) va al backend real? */
export function goesToBackend(path: string): boolean {
  if (API_MODE === 'real') return true;
  if (API_MODE === 'mock') return false;
  const route = path.replace(/^\//, '').split('?')[0];
  return REAL_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`));
}

/** ¿El login y la sesión son los del backend? (en mock, el simulador entra solo como el médico). */
export const REAL_AUTH = goesToBackend('/auth/login');
