// Pantalla "notificaciones" (Figma node 48:447) — generada desde el diseño original de Figma.
// La misma bandeja que el Centro de Notificaciones (src/data/notifications.ts), con los tipos de esta pantalla.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgActivity4 from '../../assets/activity-4.svg';
import imgBell4 from '../../assets/bell-4.svg';
import imgBell5 from '../../assets/bell-5.svg';
import imgCheckCircle from '../../assets/check-circle.svg';
import imgCpu2 from '../../assets/cpu-2.svg';
import imgUnreadIndicatorContainer from '../../assets/unread-indicator-container.svg';
import imgUsers4 from '../../assets/users-4.svg';
import { AppLayout, Button, EmptyState, IconCheck, Select, useToast } from '../../components';
import { useNotificationFeed, type FeedItem, type FeedKind } from '../../data/notifications';

type Kind = 'Alertas' | 'Pacientes' | 'Notas SOAP' | 'Reportes' | 'Sistema';

const STYLE: Record<FeedKind, { icon: string; iconBg: string; kind: Kind }> = {
  alertaCritica: { icon: imgBell4, iconBg: 'bg-danger-soft', kind: 'Alertas' },
  alertaTemprana: { icon: imgBell5, iconBg: 'bg-warning-soft', kind: 'Alertas' },
  asignacion: { icon: imgCpu2, iconBg: 'bg-primary-soft', kind: 'Pacientes' },
  laboratorio: { icon: imgCheckCircle, iconBg: 'bg-success-soft', kind: 'Reportes' },
  imagen: { icon: imgCheckCircle, iconBg: 'bg-success-soft', kind: 'Reportes' },
  recordatorio: { icon: imgUsers4, iconBg: 'bg-[#f5f3ff]', kind: 'Notas SOAP' },
  sistema: { icon: imgActivity4, iconBg: 'bg-[#dbeafe]', kind: 'Sistema' },
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
                      <div className={`flex shrink-0 rounded-full p-[10px] ${s.iconBg}`}>
                        <img className="size-4" alt="" src={s.icon} />
                      </div>
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
