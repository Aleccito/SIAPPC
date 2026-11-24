// Bandeja de notificaciones: las del backend (GET /notifications: solo alertas críticas y tempranas)
// más las de otro tipo que muestra Figma y el backend no tiene (src/api/sinBackend.ts).
// La usan el Centro de Notificaciones, la Bandeja y la campana de la barra superior.
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { markAllRead, markRead } from '../api/notifications';
import { useAssignedPatients, useNotifications } from '../api/queries';
import { getNotificacionesExtra, marcarNotificacionesExtra } from '../api/sinBackend';
import { fmtAgo, fmtTime } from '../lib/clinical';

export type FeedKind = 'alertaCritica' | 'alertaTemprana' | 'asignacion' | 'laboratorio' | 'recordatorio' | 'imagen' | 'sistema';

export type FeedItem = {
  key: string;
  kind: FeedKind;
  title: string;
  text: string;
  at: string;
  /** "Hace 5 min", "Ayer, 22:15" o "Lun, 14:30". */
  time: string;
  group: 'Hoy' | 'Ayer' | 'Esta semana';
  to: string | null;
  unread: boolean;
  /** Para marcarla leída en el backend. */
  apiId?: string;
};

const DAY = 86_400_000;
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function when(at: string): Pick<FeedItem, 'time' | 'group'> {
  const t = new Date(at);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (t.getTime() >= today.getTime()) return { time: fmtAgo(at).replace(/^h/, 'H'), group: 'Hoy' };
  if (t.getTime() >= today.getTime() - DAY) return { time: `Ayer, ${fmtTime(at)}`, group: 'Ayer' };
  return { time: `${WEEKDAYS[t.getDay()]}, ${fmtTime(at)}`, group: 'Esta semana' };
}

export function useNotificationFeed() {
  const api = useNotifications(0, 50);
  const extra = useQuery({ queryKey: ['sinBackend', 'notificaciones'], queryFn: getNotificacionesExtra });
  const patients = useAssignedPatients();
  const queryClient = useQueryClient();

  const fromApi: FeedItem[] = (api.data?.entries ?? []).map((n) => {
    const crit = n.kind === 'alertaCritica';
    const p = patients.data?.find((x) => x.id === n.patientId);
    return {
      key: `api-${n.id}`,
      kind: n.kind,
      title: `${crit ? 'Alerta Crítica' : 'Alerta Temprana'}: ${n.patientName ?? n.device}${p?.bed ? ` - Cama ${p.bed}` : ''}`,
      text: `${n.message ?? ''}. ${crit ? 'Requiere atención inmediata.' : 'Vigilar la tendencia.'}`,
      at: n.at,
      ...when(n.at),
      to: '/MedAlertasCentro',
      unread: !n.read,
      apiId: n.id,
    };
  });
  const fromExtra: FeedItem[] = (extra.data ?? []).map((n) => ({
    key: n.id,
    kind: n.tipo,
    title: n.titulo,
    text: n.texto,
    at: n.at,
    ...when(n.at),
    to: n.to,
    unread: !n.leida,
  }));
  const items = [...fromApi, ...fromExtra].sort((a, b) => b.at.localeCompare(a.at));

  const refresh = () =>
    Promise.all([queryClient.invalidateQueries({ queryKey: ['notifications'] }), queryClient.invalidateQueries({ queryKey: ['sinBackend', 'notificaciones'] })]);

  return {
    items,
    isPending: api.isPending || extra.isPending,
    unread: items.filter((i) => i.unread).length,
    markOne: async (item: FeedItem) => {
      if (!item.unread) return;
      if (item.apiId) await markRead(item.apiId);
      else await marcarNotificacionesExtra([item.key]);
      await refresh();
    },
    markAll: async () => {
      await markAllRead();
      await marcarNotificacionesExtra(fromExtra.map((i) => i.key));
      await refresh();
    },
  };
}

/** Cuántas sin leer, para la campana (sin pedir la lista de pacientes). */
export function useUnreadCount(): number | undefined {
  const api = useNotifications(0, 50);
  const extra = useQuery({ queryKey: ['sinBackend', 'notificaciones'], queryFn: getNotificacionesExtra });
  if (!api.data || !extra.data) return undefined;
  return api.data.unread + extra.data.filter((n) => !n.leida).length;
}
