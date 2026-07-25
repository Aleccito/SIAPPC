import { createContext } from 'react'
import type { Credentials, User } from './types'

export type AuthContextValue = {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
