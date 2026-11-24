// Pantalla "notificaciones" (Figma node 48:447) — generada desde el diseño original de Figma.
// La misma bandeja que el Centro de Notificaciones (src/data/notifications.ts), con los tipos de esta pantalla.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgUnreadIndicatorContainer from '../../assets/unread-indicator-container.svg';
import { AppLayout, Button, EmptyState, IconCheck, NotificationIcon, Select, useToast } from '../../components';
import { useNotificationFeed, type FeedItem, type FeedKind } from '../../data/notifications';

type Kind = 'Alertas' | 'Pacientes' | 'Notas SOAP' | 'Reportes' | 'Sistema';

// El ícono y su color salen de NotificationIcon (los mismos que en el Centro); aquí solo el filtro.
const STYLE: Record<FeedKind, { kind: Kind }> = {
  alertaCritica: { kind: 'Alertas' },
  alertaTemprana: { kind: 'Alertas' },
  asignacion: { kind: 'Pacientes' },
  laboratorio: { kind: 'Reportes' },
  imagen: { kind: 'Reportes' },
  recordatorio: { kind: 'Notas SOAP' },
  sistema: { kind: 'Sistema' },
};

const TYPES = ['Todas', 'Alertas', 'Pacientes', 'Notas SOAP', 'Reportes', 'Sistema'];
const GROUPS = ['Hoy', 'Ayer', 'Esta semana'] as const;

export default function Notificaciones() {
  const navigate = useNavigate();
  const toast = useToast();
  const [type, setType] = useState('Todas');
  const feed = useNotificationFeed();

  const open = (n: FeedItem) => {
    void feed.markOne(n);
    if (n.to) navigate(n.to);
    else toast('Notificación marcada como leída', 'info');
  };

  const markAll = async () => {
    await feed.markAll();
    toast('Todas las notificaciones marcadas como leídas');
  };

  const groups = GROUPS.map((label) => ({ label, items: feed.items.filter((n) => n.group === label && (type === 'Todas' || STYLE[n.kind].kind === type)) })).filter((g) => g.items.length);

  return (
    <AppLayout
      breadcrumb="SIAPPC > Notificaciones"
      title="Bandeja de Notificaciones"
      notifications={feed.unread}
      actions={
        <>
          <Button variant="secondary" icon={<IconCheck size={14} />} onClick={() => void markAll()}>
            Marcar todas como leídas
          </Button>
          <Select options={TYPES} value={type} onChange={setType} format={(l) => `Tipo: ${l}`} align="right" />
        </>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        {groups.length === 0 && (
          <div className="rounded-xl border border-line bg-white">
            <EmptyState message={feed.isPending ? 'Cargando notificaciones…' : undefined} onReset={() => setType('Todas')} />
          </div>
        )}
        {groups.map((group) => (
          <section key={group.label} className="flex w-full flex-col gap-[10px]">
            <h2 className="font-jakarta text-[13px] font-extrabold uppercase leading-[normal] text-muted">{group.label}</h2>
            <ul className="flex w-full flex-col gap-2">
              {group.items.map((n) => {
                const s = STYLE[n.kind];
                return (
                  <li key={n.key}>
                    <button
                      type="button"
                      onClick={() => open(n)}
                      className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-4 text-left transition-colors hover:border-subtle sm:gap-4"
                    >
                      {n.unread ? <img className="size-3 shrink-0" alt="Sin leer" src={imgUnreadIndicatorContainer} /> : <span className="size-3 shrink-0" />}
                      <NotificationIcon kind={n.kind} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[14px] font-extrabold text-ink">{n.title}</p>
                        <p className="font-jakarta text-[12px] font-normal text-muted">{n.text}</p>
                        <p className="font-jakarta text-[11px] font-medium text-subtle sm:hidden">{n.time}</p>
                      </div>
                      <p className="hidden w-[100px] shrink-0 text-right font-jakarta text-[11px] font-medium leading-[normal] text-subtle sm:block">{n.time}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
