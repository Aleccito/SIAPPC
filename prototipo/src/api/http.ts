// Copia de frontend/src/shared/api/http.ts. Única diferencia: `send()` pregunta a `goesToBackend`
// si la ruta va al backend (fetch a /api) o al simulador (src/api/mock/). Así los servicios de
// src/api/ son los mismos de frontend/ y el simulador prueba también su código.
import { goesToBackend } from './mode';
import { mockFetch } from './mock/router';

// Every request goes to a same-origin /api prefix: Vite proxies it in dev and
// nginx proxies it in the container, so the browser never makes a cross-origin
// call and there is no CORS to configure.
const BASE_URL = '/api';
const TOKEN_KEY = 'auth.token';

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Sin sessionStorage (ventana privada estricta): la sesión dura lo que la pestaña.
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nada que borrar.
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// The backend answers errors as { error: string } or, for Zod failures, as
// { error: ZodIssue[] }. Both collapse to one line for the caller.
async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === 'string') return body.error;
    if (Array.isArray(body.error)) {
      return body.error
        .map((issue) => (issue as { message?: string }).message ?? '')
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    // Not JSON — fall through to the status text.
  }
  return response.statusText;
}

/** fetch a /api o al simulador, según el modo. La usan `send` y los flujos (alertas, CSV). */
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return goesToBackend(path) ? fetch(`${BASE_URL}${path}`, init) : mockFetch(path, init);
}

/** Quien quiera enterarse de un 401 (la sesión terminó) se suscribe aquí; lo usa `SessionProvider`. */
type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

export async function send(path: string, init: RequestInit): Promise<Response> {
  const token = getToken();
  const response = await apiFetch(path, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    // El login responde 401 por credenciales malas: eso no es "la sesión terminó".
    if (response.status === 401 && !path.startsWith('/auth/login')) unauthorizedListeners.forEach((l) => l());
    throw new ApiError(response.status, await readError(response));
  }
  return response;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await send(path, init);
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export type ListResult<T> = {
  items: T[];
  total: number;
};

// Las listas del CRUD genérico devuelven el arreglo en el cuerpo y el total en
// la cabecera `X-Total-Count` (el CORS del backend la expone). Sin cabecera
// —una respuesta sin paginar— el total es el largo de lo recibido.
export async function requestList<T>(path: string, init: RequestInit = {}): Promise<ListResult<T>> {
  const response = await send(path, init);
  const items = (await response.json()) as T[];
  const header = response.headers.get('X-Total-Count');
  const total = header === null ? items.length : Number(header);
  return { items, total: Number.isFinite(total) ? total : items.length };
}
