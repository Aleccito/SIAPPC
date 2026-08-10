import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../useAuth'
import type { Role } from '../types'

// This hides UI the user has no business seeing. It is NOT access control —
// the browser can always reach the route. PHASE 2: the API must reject the
// request too, on every endpoint the screen calls.
export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth()

  if (user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
