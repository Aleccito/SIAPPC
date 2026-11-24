// No viene de Figma: quién ve la IA (CONEXION-BACKEND.md, sección 2). Hace falta `asistente_ia:ver` y además no
// ser admin: el seed le da el permiso al admin, pero su sección no tiene IA clínica y la interfaz se la oculta.
import { useSession } from '../auth/session';

export function useAiAccess(): boolean {
  const { user, can } = useSession();
  return !!user && user.role !== 'admin' && can('asistente_ia', 'ver');
}
