// Los roles viven en la base, no en el código: un administrador puede crear
// roles personalizados, así que esto no puede ser una unión cerrada.
export type Role = string

export type User = {
  id: string
  name: string
  email: string
  role: Role
  // Nombre visible del rol ("Médico"). `role` es la llave estable ("medico").
  roleLabel: string
  unit: string | null
  phone: string | null
  active: boolean
  lastActivity: string | null
}

export type Credentials = {
  email: string
  password: string
}
