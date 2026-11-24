// Sesión del prototipo (CONEXION-BACKEND.md, sección 2). Guarda el usuario, dice qué puede hacer
// (`can`, con la matriz de permisos de seed.sql) y manda al Login a quien no tiene sesión.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getMe, getStoredUser, login as apiLogin, logout as apiLogout } from '../../api/auth';
import { clearToken, onUnauthorized, setToken } from '../../api/http';
import { API_MODE } from '../../api/mode';
import { puede, type Accion } from '../../api/permisos';
import { MEDICO, tokenDe } from '../../api/mock/session';
import type { Credentials, User } from '../../api/types/auth';
import { CURRENT_USER } from '../layout/nav';
import { useToast } from '../ui/Toast';
import { clearAllAiSuggestions } from '../ai/aiSuggestion';

/** Marca de "cerró sesión a propósito": sin ella, el modo mock entra solo como el médico. */
const SALIO = 'auth.salio';
const USER_KEY = 'auth.user';

/** Pantallas que se ven sin sesión. */
const PUBLIC_PATHS = ['/', '/Login', '/LoginMfa', '/RecuperarContrasena', '/RecuperacionEnviada'];

const storage = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      // Sin sessionStorage la sesión dura lo que la página.
    }
  },
  remove: (k: string) => {
    try {
      sessionStorage.removeItem(k);
    } catch {
      // Nada que borrar.
    }
  },
};

/**
 * Modo mock sin sesión: se entra como el médico del seed, para que un enlace directo al prototipo
 * publicado siga funcionando. Después de "Cerrar sesión" no: hay que volver a entrar.
 */
function initialUser(): User | null {
  try {
    const stored = getStoredUser();
    if (stored) return stored;
  } catch {
    // Usuario guardado ilegible: como si no hubiera.
  }
  if (API_MODE !== 'mock' || storage.get(SALIO)) return null;
  setToken(tokenDe(MEDICO));
  storage.set(USER_KEY, JSON.stringify(MEDICO));
  return MEDICO;
}

type Session = {
  user: User | null;
  /** ¿El usuario puede hacer `accion` en `modulo`? (matriz `rol_permiso` de seed.sql) */
  can: (modulo: string, accion?: Accion) => boolean;
  signIn: (credentials: Credentials) => Promise<User>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { pathname, search } = useLocation();

  // Con el backend real, la sesión guardada se confirma con /auth/me al abrir la app.
  useEffect(() => {
    if (API_MODE === 'mock' || !user) return;
    getMe()
      .then(setUser)
      .catch(() => {
        // El 401 lo atiende `onUnauthorized`; cualquier otro error deja la sesión como estaba.
      });
    // Solo al abrir la app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Un 401 en cualquier llamada: la sesión terminó (venció, la revocaron o suspendieron la cuenta).
  useEffect(
    () =>
      onUnauthorized(() => {
        clearToken();
        clearAllAiSuggestions();
        storage.remove(USER_KEY);
        storage.set(SALIO, '1');
        queryClient.clear();
        setUser(null);
        toast('Su sesión terminó. Vuelva a entrar.', 'info');
        navigate('/Login', { replace: true });
      }),
    [navigate, queryClient, toast],
  );

  const signIn = useCallback(async (credentials: Credentials) => {
    const logged = await apiLogin(credentials);
    storage.remove(SALIO);
    queryClient.clear();
    setUser(logged);
    return logged;
  }, [queryClient]);

  const signOut = useCallback(async () => {
    await apiLogout();
    clearAllAiSuggestions();
    storage.set(SALIO, '1');
    queryClient.clear();
    setUser(null);
  }, [queryClient]);

  const value = useMemo<Session>(
    () => ({ user, can: (modulo, accion = 'ver') => (user ? puede(user.role, modulo, accion) : false), signIn, signOut }),
    [user, signIn, signOut],
  );

  if (!user && !PUBLIC_PATHS.includes(pathname)) {
    return <Navigate to="/Login" replace state={{ volver: pathname + search }} />;
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession va dentro de SessionProvider');
  return session;
}

/**
 * Nombre y cargo del pie del menú. Para el médico del seed se conserva el texto de Figma
 * ("Dr. Carlos Méndez · Médico Intensivista"); para las otras cuentas, nombre y rol.
 */
export function useDisplayUser(): { name: string; role: string } {
  const { user } = useSession();
  if (!user || user.email === MEDICO.email) return CURRENT_USER;
  return { name: user.name, role: user.roleLabel };
}
