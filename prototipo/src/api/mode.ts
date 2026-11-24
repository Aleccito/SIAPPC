// Interruptor de datos del prototipo (REVISION-IA.md, sección 2; CONEXION-BACKEND.md, sección 4).
//
//   VITE_API_MODE=mock   todo simulado (por defecto; es lo publicado en prototipo.melo-coton.uk)
//   VITE_API_MODE=real   todo va a /api (el backend, por el proxy de Vite o de nginx)
//   VITE_API_MODE=mixto  solo los grupos de VITE_API_REAL van al backend (VITE_API_REAL=auth,dashboard,…)
//
// Hoy está preparado pero inactivo: sin la variable, el prototipo funciona sin backend.

export type ApiMode = 'mock' | 'real' | 'mixto';

const raw = String(import.meta.env.VITE_API_MODE ?? 'mock');
export const API_MODE: ApiMode = raw === 'real' || raw === 'mixto' ? raw : 'mock';

/** Grupos de rutas que van al backend en modo mixto: el primer segmento de la ruta (`/patients/3` → `patients`). */
const REAL_GROUPS = new Set(
  String(import.meta.env.VITE_API_REAL ?? '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean),
);

/** ¿Esta ruta (sin el prefijo /api) va al backend real? */
export function goesToBackend(path: string): boolean {
  if (API_MODE === 'real') return true;
  if (API_MODE === 'mock') return false;
  const group = path.replace(/^\//, '').split(/[/?]/)[0];
  return REAL_GROUPS.has(group);
}
