// Cierre de sesión en un solo lugar (REVISION-IA.md, sección 6).
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';

/**
 * Devuelve la función que cierra la sesión: avisa "Sesión cerrada" y va al Login
 * reemplazando la pantalla actual en el historial.
 *
 * Es asíncrona a propósito: aquí se agrega la llamada a `logout()` de `src/api/auth.ts`
 * (POST /auth/logout y borrar el token), sin tocar a quien la usa.
 */
export function useLogout(): () => Promise<void> {
  const navigate = useNavigate();
  const toast = useToast();
  return useCallback(async () => {
    toast('Sesión cerrada');
    navigate('/Login', { replace: true });
  }, [navigate, toast]);
}
