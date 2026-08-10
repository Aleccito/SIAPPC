// El tipo marca de qué habla el aviso, y de ahí salen su icono y su color. No
// es la severidad: `alertaCritica` y `alertaTemprana` son la misma clase de
// suceso con distinto nivel, y se separan porque en la bandeja tienen que
// distinguirse de un vistazo.
export const notificationKinds = [
  'alertaCritica',
  'alertaTemprana',
  'asignacion',
  'reporte',
  'sistema',
  'nota',
  'mantenimiento',
] as const

export type NotificationKind = (typeof notificationKinds)[number]

export type Notification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  /** ISO 8601. La bandeja agrupa por este campo, no por uno precalculado. */
  at: string
  read: boolean
}
