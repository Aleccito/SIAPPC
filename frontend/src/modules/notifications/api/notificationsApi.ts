import { request } from '../../../shared/api/http'
import type { NotificationPage } from '../types'

// La bandeja del usuario de la sesión.
//
// Ninguna de estas llamadas lleva identificador de usuario, y no es un olvido:
// el servidor lo saca del token (backend/src/routes/notifications.ts), así que
// "las notificaciones de otro" no es una petición que se pueda formular desde
// aquí ni escribiendo la URL a mano.

export async function listNotifications(
  page: number,
  pageSize: number,
): Promise<NotificationPage> {
  return request<NotificationPage>(`/notifications?page=${page}&pageSize=${pageSize}`)
}

/** Marca una. El servidor revalida que sea del usuario de la sesión. */
export async function markRead(id: string): Promise<void> {
  await request<void>(`/notifications/${id}/read`, { method: 'POST' })
}

/** Marca todas las suyas. Devuelve cuántas cambiaron de verdad. */
export async function markAllRead(): Promise<{ updated: number }> {
  return request<{ updated: number }>('/notifications/read-all', { method: 'POST' })
}
