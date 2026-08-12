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

async function send(path: string, init: RequestInit): Promise<Response> {
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
  return response
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await send(path, init)
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export type ListResult<T> = {
  items: T[]
  total: number
}

// Las listas del CRUD genérico devuelven el arreglo en el cuerpo y el total en
// la cabecera `X-Total-Count` (el CORS del backend la expone). Sin cabecera
// —una respuesta sin paginar— el total es el largo de lo recibido.
export async function requestList<T>(
  path: string,
  init: RequestInit = {},
): Promise<ListResult<T>> {
  const response = await send(path, init)
  const items = (await response.json()) as T[]
  const header = response.headers.get('X-Total-Count')
  const total = header === null ? items.length : Number(header)
  return { items, total: Number.isFinite(total) ? total : items.length }
}
