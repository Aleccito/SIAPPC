// Cierre de sesión en un solo lugar (docs/historial/REVISION-IA.md, sección 6).
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { useSession } from './session';

/**
 * Devuelve la función que cierra la sesión: POST /auth/logout (en mock responde 204), borra el token,
 * el usuario y la caché de datos, avisa "Sesión cerrada" y va al Login. Sin sesión, cualquier
 * pantalla de adentro manda al Login, así que Atrás tampoco vuelve.
 */
export function useLogout(): () => Promise<void> {
  const navigate = useNavigate();
  const toast = useToast();
  const { signOut } = useSession();
  return useCallback(async () => {
    await signOut();
    toast('Sesión cerrada');
    navigate('/Login', { replace: true });
  }, [navigate, toast, signOut]);
}
