import type { Notification } from '../types'

// PENDIENTE: datos de ejemplo. La tabla `notificacion` del esquema existe pero
// hoy solo sirve para avisos que nacen de una alerta —`alerta_id` es NOT NULL—,
// así que no puede representar notas SOAP, altas programadas ni mantenimiento
// de dispositivos, que es la mitad de lo que muestra esta pantalla. Conectarla
// pide antes ampliar el esquema; la forma de `Notification` es la definitiva.

// Las fechas se calculan desde "ahora" para que la agrupación por Hoy / Ayer /
// Esta semana siga teniendo sentido mañana. Con fechas fijas, la bandeja se
// quedaría entera en "hace meses" a la semana de escribir esto.
const now = Date.now()
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const fixtures: Notification[] = [
  {
    id: 'n-001',
    kind: 'alertaCritica',
    title: 'Alerta Crítica: Cama 03 – Elena Rodríguez',
    body: 'Frecuencia cardiaca superó el límite programado (145 lpm). Requiere atención.',
    at: new Date(now - 5 * MINUTE).toISOString(),
    read: false,
  },
  {
    id: 'n-002',
    kind: 'asignacion',
    title: 'Asignación de Paciente: Cama 08',
    body: 'El paciente Javier Mendoza ha sido derivado oficialmente bajo su cuidado.',
    at: new Date(now - HOUR).toISOString(),
    read: false,
  },
  {
    id: 'n-003',
    kind: 'reporte',
    title: 'Reporte Clínico Generado con éxito',
    body: 'El consolidado mensual de la Unidad de Cuidados Intensivos Médica está listo para descarga.',
    at: new Date(now - 2 * HOUR).toISOString(),
    read: false,
  },
  {
    id: 'n-004',
    kind: 'sistema',
    title: 'Actualización de Sistema Completada',
    body: 'SIAPPC v2.4.1 ha sido desplegada con mejoras en la latencia de monitoreo cardiaco.',
    at: new Date(now - DAY - 3 * HOUR).toISOString(),
    read: true,
  },
  {
    id: 'n-005',
    kind: 'nota',
    title: 'Nueva Nota SOAP Registrada',
    body: 'Dra. Ana Gómez registró una nota de evolución sobre la paciente Elena Rodríguez.',
    at: new Date(now - DAY - 8 * HOUR).toISOString(),
    read: true,
  },
  {
    id: 'n-006',
    kind: 'alertaTemprana',
    title: 'Alerta Temprana: Cama 12 – Ricardo Gómez',
    body: 'Temperatura registrada en 38.3 °C. Alerta de nivel moderado enviada.',
    at: new Date(now - DAY - 13 * HOUR).toISOString(),
    read: true,
  },
  {
    id: 'n-007',
    kind: 'reporte',
    title: 'Alta de Paciente Programada',
    body: 'Andrés Castro (PT-8824) cuenta con pre-alta firmada para el día 26 de Octubre.',
    at: new Date(now - 3 * DAY).toISOString(),
    read: true,
  },
  {
    id: 'n-008',
    kind: 'mantenimiento',
    title: 'Mantenimiento Preventivo de Dispositivos',
    body: 'El sensor biométrico de la cama UCI-05 será recalibrado a las 14:00 horas.',
    at: new Date(now - 4 * DAY).toISOString(),
    read: true,
  },
]

let store = fixtures

export async function listNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  // Copia: si la pantalla ordenara o filtrara sobre el array devuelto, estaría
  // tocando el almacén de este módulo.
  return store.map((entry) => ({ ...entry }))
}

export async function markAllRead(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  store = store.map((entry) => ({ ...entry, read: true }))
}
