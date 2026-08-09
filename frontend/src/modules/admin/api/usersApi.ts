import { request } from '../../../shared/api/http'
import type { User } from '../../auth/types'
import type { ActivityEntry, CreatedUser, NewUser, RoleSummary, Unit } from '../types'

// El backend re-verifica el permiso en cada una de estas rutas — llegar a esta
// pantalla no es autorización.
export async function listUsers(): Promise<User[]> {
  return request<User[]>('/users')
}

export async function createUser(user: NewUser): Promise<CreatedUser> {
  return request<CreatedUser>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export async function updateUser(
  id: string,
  changes: { role?: string; unitId?: number | null; active?: boolean },
): Promise<User> {
  return request<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export async function listUserActivity(id: string, days: number): Promise<ActivityEntry[]> {
  return request<ActivityEntry[]>(`/users/${id}/activity?days=${days}`)
}

export async function listRoles(): Promise<RoleSummary[]> {
  return request<RoleSummary[]>('/roles')
}

export async function listUnits(): Promise<Unit[]> {
  return request<Unit[]>('/units')
}
