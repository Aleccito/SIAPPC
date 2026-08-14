// Espejo de backend/src/types.ts (bloque "Bandeja de notificaciones").

/**
 * De qué habla el aviso. De ahí salen su icono y su color.
 *
 * Son DOS y no siete. Esta pantalla se diseñó con siete —asignación, reporte,
 * sistema, nota clínica, mantenimiento— sobre datos de ejemplo, y el esquema no
 * los sostiene: `notificacion.alerta_id` es NOT NULL, así que en esta base una
 * notificación no puede existir sin una alerta detrás, y ninguno de esos cinco
 * sucesos genera alertas. Se quitaron en vez de dejarlos apuntando a nada: una
 * pantalla que ofrece filtrar por "Mantenimiento" y siempre sale vacía miente
 * dos veces, sobre lo que hay y sobre lo que el sistema sabe hacer.
 *
 * No es la severidad: es el par de niveles que sí se notifican, separados
 * porque en la bandeja tienen que distinguirse de un vistazo.
 */
export const notificationKinds = ['alertaCritica', 'alertaTemprana'] as const

export type NotificationKind = (typeof notificationKinds)[number]

export type AlertSeverity = 'baja' | 'media' | 'alta' | 'critica'

/**
 * Una fila de la bandeja.
 *
 * No trae el texto ya redactado sino los DATOS del hecho: el título y el cuerpo
 * los arma la pantalla con `t()`. Si el servidor mandara la frase hecha, la
 * bandeja tendría cadenas en español que ningún idioma nuevo alcanzaría.
 */
export type Notification = {
  id: string
  kind: NotificationKind
  /** La alerta que lo originó, para poder ir a ella desde la bandeja. */
  alertId: string
  patientId: string | null
  patientName: string | null
  device: string
  variable: string
  unit: string
  value: number
  /** `alerta.tipo`: `hr_fuera_de_rango`, `spo2_bajo`, … */
  type: string
  severity: AlertSeverity
  /** Mensaje redactado por la ingesta. Puede faltar. */
  message: string | null
  /** ISO 8601. La bandeja agrupa por este campo, no por uno precalculado. */
  at: string
  read: boolean
}

export type NotificationPage = {
  total: number
  /** Sin leer en TODA la bandeja, no en la página: es lo que pinta la campana. */
  unread: number
  entries: Notification[]
}
