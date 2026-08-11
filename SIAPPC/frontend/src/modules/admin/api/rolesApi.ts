import { request } from '../../../shared/api/http'
import type { NewRole, RoleChange, RolePermission, RoleSummary } from '../types'

export async function listRoles(): Promise<RoleSummary[]> {
  return request<RoleSummary[]>('/roles')
}

export async function createRole(role: NewRole): Promise<RoleSummary> {
  return request<RoleSummary>('/roles', {
    method: 'POST',
    body: JSON.stringify(role),
  })
}

export async function getRolePermissions(id: string): Promise<RolePermission[]> {
  return request<RolePermission[]>(`/roles/${id}/permissions`)
}

export async function saveRolePermissions(
  id: string,
  permissions: RolePermission[],
): Promise<void> {
  await request(`/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({
      permissions: permissions.map(({ module, ver, crear, editar, eliminar }) => ({
        module,
        ver,
        crear,
        editar,
        eliminar,
      })),
    }),
  })
}

export async function listRoleChanges(): Promise<RoleChange[]> {
  return request<RoleChange[]>('/roles/changes')
}
