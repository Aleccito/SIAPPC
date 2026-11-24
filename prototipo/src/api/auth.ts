// Copia de frontend/src/modules/auth/api/authApi.ts (mismas funciones, parámetros y tipos; solo cambian las rutas de importación).
import { clearToken, request, setToken } from './http'
import type { Credentials, User } from './types/auth'

const STORAGE_KEY = 'auth.user'

type LoginResponse = {
  token: string
  user: User
}

export async function login(credentials: Credentials): Promise<User> {
  const { token, user } = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  // The token is what authorises the next calls; the user is cached alongside
  // it so a reload restores the session without a round trip.
  setToken(token)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export async function logout(): Promise<void> {
  // The JWT is stateless: there is nothing to revoke server-side. The call is
  // only so the sign-out lands in the audit log as LOGOUT — the Audit screen
  // filters on it, and without it a session has a start and no end.
  try {
    await request('/auth/logout', { method: 'POST' })
  } catch {
    // An expired or already-rejected token must not trap anyone in the app:
    // dropping the credentials below is what actually signs them out.
  }

  clearToken()
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

// --- Agregado en el prototipo (no está en frontend/) ------------------------

/**
 * GET /auth/me: confirma que la sesión sigue viva y refresca el usuario guardado.
 * frontend/ no la usa; aquí sí (ver CONEXION-BACKEND.md, sección 2).
 */
export async function getMe(): Promise<User> {
  const user = await request<User>('/auth/me')
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}
