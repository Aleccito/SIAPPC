// Matriz de permisos por rol: copia de `rol_permiso` en backend/db/seed.sql.
//
// El backend no devuelve los permisos del usuario en /auth/me (CONEXION-BACKEND.md, sección 7,
// pedido 1). Mientras tanto, el menú y los botones se deciden con esta copia; el servidor vuelve a
// comprobar cada llamada, así que si un administrador cambia la matriz lo peor que pasa es un 403.

export type Accion = 'ver' | 'crear' | 'editar' | 'eliminar';

type Fila = [ver: boolean, crear: boolean, editar: boolean, eliminar: boolean];
const T = true;
const F = false;

export const PERMISOS: Record<string, Record<string, Fila>> = {
  medico: {
    pacientes: [T, T, T, F],
    historia_clinica: [T, T, T, F],
    notas_soap: [T, T, T, F],
    monitoreo: [T, F, F, F],
    dispositivos: [T, F, F, F],
    alertas: [T, F, F, F],
    reportes: [T, T, F, F],
    admisiones: [T, F, F, F],
    asistente_ia: [T, F, F, F],
  },
  enfermero: {
    pacientes: [T, F, T, F],
    historia_clinica: [T, F, F, F],
    notas_soap: [T, F, F, F],
    monitoreo: [T, T, T, F],
    dispositivos: [T, F, F, F],
    alertas: [T, F, T, F],
    reportes: [T, T, F, F],
    admisiones: [T, F, T, F],
  },
  administrativo: {
    pacientes: [T, T, T, F],
    monitoreo: [T, F, F, F],
    dispositivos: [T, F, F, F],
    alertas: [T, F, F, F],
    reportes: [T, T, F, F],
    configuracion: [T, F, F, F],
    admisiones: [T, T, T, T],
  },
  admin: {
    pacientes: [T, T, T, T],
    historia_clinica: [T, F, F, F],
    notas_soap: [T, F, F, F],
    monitoreo: [T, T, T, T],
    dispositivos: [T, T, T, T],
    alertas: [T, T, T, T],
    reportes: [T, T, T, T],
    configuracion: [T, T, T, T],
    usuarios: [T, T, T, T],
    auditoria: [T, T, T, T],
    admisiones: [T, T, T, T],
    asistente_ia: [T, F, F, F],
  },
};

const INDICE: Record<Accion, number> = { ver: 0, crear: 1, editar: 2, eliminar: 3 };

export function puede(role: string, modulo: string, accion: Accion): boolean {
  return PERMISOS[role]?.[modulo]?.[INDICE[accion]] ?? false;
}
