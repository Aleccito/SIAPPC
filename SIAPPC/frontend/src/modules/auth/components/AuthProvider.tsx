import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/authApi'
import { AuthContext } from '../authContext'
import type { Credentials, User } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authApi.getStoredUser())

  const login = useCallback(async (credentials: Credentials) => {
    setUser(await authApi.login(credentials))
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
