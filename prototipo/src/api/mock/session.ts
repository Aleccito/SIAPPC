// Cuentas del simulador: las cuatro de backend/db/seed.sql. Los permisos están en ../permisos.ts.
import type { User } from '../types/auth';

export { puede, type Accion } from '../permisos';

/** Las cuatro cuentas de seed.sql. El id sigue el orden de inserción del seed. */
export const USUARIOS: User[] = [
  { id: '1', name: 'Carlos Méndez', email: 'medico@institucion.org', role: 'medico', roleLabel: 'Médico', unit: 'UCI', phone: null, active: true, lastActivity: null },
  { id: '2', name: 'Lucía Ramos', email: 'enfermero@institucion.org', role: 'enfermero', roleLabel: 'Enfermero', unit: 'UCI', phone: null, active: true, lastActivity: null },
  { id: '3', name: 'Pedro Solís', email: 'administrativo@institucion.org', role: 'administrativo', roleLabel: 'Administrativo', unit: 'Admisión', phone: null, active: true, lastActivity: null },
  { id: '4', name: 'Ana García', email: 'admin@institucion.org', role: 'admin', roleLabel: 'Administrador', unit: 'TI', phone: null, active: true, lastActivity: null },
];

/** El médico de los 8 pacientes (`medico_paciente` del seed de demo). */
export const MEDICO = USUARIOS[0];

/** Token simulado: `mock.<id del usuario>`. */
export const tokenDe = (user: User) => `mock.${user.id}`;
export const usuarioDeToken = (token: string | null): User | null =>
  !token ? null : token.startsWith('mock.') ? USUARIOS.find((u) => u.id === token.slice(5)) ?? null : usuarioDeJwt(token);

/**
 * Modo mixto con `auth` en el backend: el token es el JWT real. El simulador toma el rol de su carga
 * (`{ sub, role }`, backend/src/plugins/auth.ts) sin verificar la firma, para responder con los permisos de ese rol.
 */
function usuarioDeJwt(token: string): User | null {
  try {
    const carga = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { role } = JSON.parse(atob(carga)) as { role?: string };
    return USUARIOS.find((u) => u.role === role) ?? null;
  } catch {
    return null;
  }
}

/**
 * Login simulado: cualquier dato sirve, como antes. Las cuentas de seed.sql entran con su rol
 * (enfermero@institucion.org sirve para ver la IA sin permiso); cualquier otro correo, como el médico.
 */
export function usuarioDeLogin(email: string): User {
  return USUARIOS.find((u) => u.email === email.trim().toLowerCase()) ?? MEDICO;
}
