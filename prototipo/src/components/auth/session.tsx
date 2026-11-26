// Sesión del prototipo (docs/CONEXION-BACKEND.md, secciones 2 y 9). Guarda el usuario, dice qué puede hacer
// (`can`, con la matriz de permisos de seed.sql) y manda al Login a quien no tiene sesión.
// Después del login viene el código de verificación (LoginMfa): hasta pasarlo, la sesión queda "pendiente" y
// ninguna pantalla de adentro se abre. El backend no tiene MFA: el código es fijo, 000000 (pendiente, pedido 17).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getMe, getStoredUser, login as apiLogin, logout as apiLogout } from '../../api/auth';
import { clearToken, onUnauthorized, setToken } from '../../api/http';
import { REAL_AUTH } from '../../api/mode';
import { puede, type Accion } from '../../api/permisos';
import { MEDICO, tokenDe } from '../../api/mock/session';
import type { Credentials, User } from '../../api/types/auth';
import { staffName } from '../../lib/clinical';
import { useToast } from '../ui/Toast';
import { clearAllAiSuggestions } from '../ai/aiSuggestion';

/** Marca de "cerró sesión a propósito": sin ella, el modo mock entra solo como el médico. */
const SALIO = 'auth.salio';
const USER_KEY = 'auth.user';
/** Login hecho, falta el código de verificación. */
const MFA_PENDIENTE = 'auth.mfa';
/** El código fijo mientras el backend no tenga MFA (docs/CONEXION-BACKEND.md, sección 2). */
export const MFA_CODE = '000000';

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
 * Con el login simulado y sin sesión, se entra como el médico del seed, para que un enlace directo siga
 * funcionando sin backend. Con el login real, nunca: hay que entrar. Después de "Cerrar sesión", tampoco.
 */
function initialUser(): User | null {
  try {
    const stored = getStoredUser();
    if (stored) return stored;
  } catch {
    // Usuario guardado ilegible: como si no hubiera.
  }
  if (REAL_AUTH || storage.get(SALIO)) return null;
  setToken(tokenDe(MEDICO));
  storage.set(USER_KEY, JSON.stringify(MEDICO));
  return MEDICO;
}

/** Pantalla de inicio de cada rol (docs/CONEXION-BACKEND.md, sección 9.1). */
export function landingFor(role: string | undefined): string {
  if (role === 'admin') return '/MedPerfilMiPerfil';
  if (role === 'administrativo') return '/MedMonitoreoGridUci';
  return '/MedDashboardPrincipal';
}

type Session = {
  user: User | null;
  /** ¿El usuario puede hacer `accion` en `modulo`? (matriz `rol_permiso` de seed.sql) */
  can: (modulo: string, accion?: Accion) => boolean;
  signIn: (credentials: Credentials) => Promise<User>;
  /** Falta el código de verificación. */
  mfaPending: boolean;
  /** true si el código es el correcto; entonces la sesión queda abierta. */
  verifyMfa: (code: string) => boolean;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [mfaPending, setMfaPending] = useState(() => !!user && storage.get(MFA_PENDIENTE) === '1');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { pathname, search } = useLocation();

  // Con el backend real, la sesión guardada se confirma con /auth/me al abrir la app.
  useEffect(() => {
    if (!REAL_AUTH || !user) return;
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
        storage.remove(MFA_PENDIENTE);
        storage.set(SALIO, '1');
        queryClient.clear();
        setUser(null);
        setMfaPending(false);
        // Varias peticiones en vuelo pueden dar 401 a la vez: solo la primera avisa y lleva al Login, recordando la
        // pantalla donde estaba para volver a ella al entrar. Las demás ya encuentran el Login.
        const { pathname: aqui, search: consulta } = window.location;
        if (PUBLIC_PATHS.includes(aqui)) return;
        toast('Su sesión terminó. Vuelva a entrar.', 'info');
        navigate('/Login', { replace: true, state: { volver: aqui + consulta } });
      }),
    [navigate, queryClient, toast],
  );

  const signIn = useCallback(async (credentials: Credentials) => {
    const logged = await apiLogin(credentials);
    storage.remove(SALIO);
    storage.set(MFA_PENDIENTE, '1');
    queryClient.clear();
    setUser(logged);
    setMfaPending(true);
    return logged;
  }, [queryClient]);

  const verifyMfa = useCallback((code: string) => {
    if (code !== MFA_CODE) return false;
    storage.remove(MFA_PENDIENTE);
    setMfaPending(false);
    return true;
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout();
    clearAllAiSuggestions();
    storage.remove(MFA_PENDIENTE);
    storage.set(SALIO, '1');
    queryClient.clear();
    setUser(null);
    setMfaPending(false);
  }, [queryClient]);

  const value = useMemo<Session>(
    () => ({
      user,
      can: (modulo, accion = 'ver') => (user && !mfaPending ? puede(user.role, modulo, accion) : false),
      signIn,
      mfaPending,
      verifyMfa,
      signOut,
    }),
    [user, mfaPending, signIn, verifyMfa, signOut],
  );

  if (!PUBLIC_PATHS.includes(pathname)) {
    if (!user) return <Navigate to="/Login" replace state={{ volver: pathname + search }} />;
    // Entró pero no puso el código: vuelve a esa pantalla.
    if (mfaPending) return <Navigate to="/LoginMfa" replace state={{ volver: pathname + search }} />;
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession va dentro de SessionProvider');
  return session;
}

/** Nombre (con su título: "Dr. Carlos Méndez") y rol del usuario de la sesión, para el pie del menú y Mi Perfil. */
export function useDisplayUser(): { name: string; role: string; plainName: string } {
  const { user } = useSession();
  if (!user) return { name: '—', role: '', plainName: '' };
  return { name: staffName(user.name), role: user.unit ? `${user.roleLabel} · ${user.unit}` : user.roleLabel, plainName: user.name };
}
