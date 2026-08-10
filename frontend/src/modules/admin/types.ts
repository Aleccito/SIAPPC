export type RoleSummary = {
  id: string
  name: string
  label: string
  description: string | null
  isSystem: boolean
  userCount: number
}

export type Unit = {
  id: string
  name: string
}

export type NewUser = {
  name: string
  email: string
  phone?: string
  role: string
  unitId?: number
}

// La contraseña temporal viaja una sola vez, en la respuesta de creación. No
// hay forma de volver a consultarla.
export type CreatedUser = {
  user: import('../auth/types').User
  tempPassword: string
}

export type NewRole = {
  label: string
  description?: string
  baseRole?: string
}

export type RolePermission = {
  module: string
  label: string
  ver: boolean
  crear: boolean
  editar: boolean
  eliminar: boolean
}

export const permissionActions = ['ver', 'crear', 'editar', 'eliminar'] as const
export type PermissionAction = (typeof permissionActions)[number]

export type RoleChange = {
  id: string
  author: string | null
  description: string
  at: string
}

export type AuditEntry = {
  id: string
  author: string | null
  entity: string
  recordId: string
  action: string
  note: string | null
  at: string
}

export type AuditPage = {
  total: number
  entries: AuditEntry[]
}

// Debe seguir al ENUM de `auditoria.accion` en backend/db/schema.sql. Faltaba
// LOGIN_BLOCKED, que es el que escribe el límite de intentos de login: había
// renglones en la tabla que el filtro no podía seleccionar, justo los que
// interesa revisar cuando se sospecha de fuerza bruta.
export const auditActions = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'LOGIN_BLOCKED',
] as const

export type AuditFilters = {
  userId?: string
  entity?: string
  action?: string
  days?: number
  page: number
  pageSize: number
}

export type ActivityEntry = {
  id: string
  entity: string
  action: string
  at: string
  note: string | null
}
