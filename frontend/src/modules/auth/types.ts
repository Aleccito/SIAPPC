export type Role = 'admin' | 'user'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type Credentials = {
  email: string
  password: string
}
