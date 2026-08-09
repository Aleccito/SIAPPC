// Every request goes to a same-origin /api prefix: Vite proxies it in dev and
// nginx proxies it in the container, so the browser never makes a cross-origin
// call and there is no CORS to configure.
const BASE_URL = '/api'
const TOKEN_KEY = 'auth.token'

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// The backend answers errors as { error: string } or, for Zod failures, as
// { error: ZodIssue[] }. Both collapse to one line for the caller.
async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown }
    if (typeof body.error === 'string') return body.error
    if (Array.isArray(body.error)) {
      return body.error
        .map((issue) => (issue as { message?: string }).message ?? '')
        .filter(Boolean)
        .join(', ')
    }
  } catch {
    // Not JSON — fall through to the status text.
  }
  return response.statusText
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response))
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}
