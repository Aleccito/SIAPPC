import type { Credentials, User } from '../types'

// PHASE 1: fake implementation. Only the bodies of these functions change when
// the real backend lands — the signatures and everything that calls them stay.
const STORAGE_KEY = 'auth.user'

export async function login(credentials: Credentials): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required')
  }

  // PHASE 2: the role comes from the backend. Until then, any email containing
  // "admin" signs in as an admin so both paths are testable.
  const user: User = {
    id: 'local-1',
    name: credentials.email.split('@')[0],
    email: credentials.email,
    role: credentials.email.includes('admin') ? 'admin' : 'user',
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export async function logout(): Promise<void> {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}
