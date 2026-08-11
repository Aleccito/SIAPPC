import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../useAuth'
import type { Role } from '../types'

// Esto oculta pantallas que al usuario no le corresponden. NO es control de
// acceso: el navegador siempre puede alcanzar la ruta, y basta con editar el
// estado en memoria para saltárselo. Quien decide de verdad es el servidor, que
// revalida el permiso concreto contra `rol_permiso` en cada endpoint
// (`app.requirePermission`, ver backend/src/plugins/auth.ts). Si algún día una
// pantalla nueva llama a un endpoint sin esa guarda, el agujero está allá, no
// aquí.
export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth()

  if (user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
