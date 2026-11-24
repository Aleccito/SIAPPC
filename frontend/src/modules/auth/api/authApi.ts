import { clearToken, request, setToken } from '../../../shared/api/http'
import type { Credentials, User } from '../types'

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

  // El token autoriza las llamadas siguientes; el usuario se guarda junto a
  // él para que recargar la página restaure la sesión sin ir al servidor.
  setToken(token)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export async function logout(): Promise<void> {
  // El JWT no tiene estado: no hay nada que revocar en el servidor. La llamada
  // solo sirve para que el cierre quede en la bitácora como LOGOUT — la pantalla
  // de Auditoría filtra por él, y sin él una sesión tiene inicio pero no fin.
  try {
    await request('/auth/logout', { method: 'POST' })
  } catch {
    // Un token vencido o ya rechazado no debe dejar a nadie atrapado en la app:
    // borrar las credenciales abajo es lo que de verdad cierra la sesión.
  }

  clearToken()
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}
