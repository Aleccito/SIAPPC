import type { Role, User } from '../../auth/types'

// PHASE 2: replace these bodies with fetches. The backend must re-check that
// the caller is an admin — never trust that this screen was reachable.
let fixtures: User[] = [
  { id: 'u-001', name: 'admin', email: 'admin@plant.local', role: 'admin' },
  { id: 'u-002', name: 'lucia', email: 'lucia@plant.local', role: 'user' },
  { id: 'u-003', name: 'marco', email: 'marco@plant.local', role: 'user' },
]

export async function listUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return fixtures
}

export async function setUserRole(id: string, role: Role): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  fixtures = fixtures.map((user) => (user.id === id ? { ...user, role } : user))
  const updated = fixtures.find((user) => user.id === id)
  if (!updated) {
    throw new Error('User not found')
  }
  return updated
}
