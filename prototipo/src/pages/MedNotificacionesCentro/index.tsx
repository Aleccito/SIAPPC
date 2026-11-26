// Pantalla "med-notificaciones-centro" (Figma node 333:4) — generada desde el diseño original de Figma.
// Las notificaciones de alertas vienen de GET /notifications; las de otro tipo (asignación, laboratorio,
// recordatorio, imagen, sistema) no existen en el backend y salen de src/api/sinBackend.ts.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout, Badge, Button, Card, Divider, EmptyState, IconCheck, NotificationIcon, Select, useToast } from '../../components';
import { useNotificationFeed, type FeedItem, type FeedKind } from '../../data/notifications';
import { cn } from '../../lib/cn';

type Tone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

// El ícono y su color salen de NotificationIcon (los mismos que en la bandeja); aquí la etiqueta.
const STYLE: Record<FeedKind, { tag: string; tone: Tone }> = {
  alertaCritica: { tag: 'Clínica', tone: 'danger' },
  alertaTemprana: { tag: 'Clínica', tone: 'danger' },
  asignacion: { tag: 'Asignación', tone: 'info' },
  laboratorio: { tag: 'Laboratorio', tone: 'success' },
  recordatorio: { tag: 'Recordatorio', tone: 'warning' },
  imagen: { tag: 'Imagen', tone: 'success' },
  sistema: { tag: 'Sistema', tone: 'neutral' },
};

const TYPES = ['Todas', 'Clínica', 'Asignación', 'Laboratorio', 'Recordatorio', 'Imagen', 'Sistema'];
const GROUPS = ['Hoy', 'Ayer', 'Esta semana'] as const;

export default function MedNotificacionesCentro() {
  const navigate = useNavigate();
  const toast = useToast();
  const [type, setType] = useState('Todas');
  const feed = useNotificationFeed();

  const open = (r: FeedItem) => {
    void feed.markOne(r);
    if (r.to) navigate(r.to);
    else toast('Notificación marcada como leída', 'info');
  };

  const markAll = async () => {
    await feed.markAll();
    toast('Todas las notificaciones marcadas como leídas');
  };

  const sections = GROUPS.map((label) => ({ label, rows: feed.items.filter((r) => r.group === label && (type === 'Todas' || STYLE[r.kind].tag === type)) })).filter((s) => s.rows.length);

  return (
    <AppLayout
      breadcrumb="SIAPPC > Notificaciones"
      title="Centro de Notificaciones"
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
      <div className="flex w-full min-w-0 flex-1 flex-col p-4 md:p-8">
        <Card padding="none" className="flex w-full flex-col p-3 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)]">
          {sections.length === 0 && <EmptyState message={feed.isPending ? 'Cargando notificaciones…' : undefined} onReset={() => setType('Todas')} />}
          {sections.map((section) => (
            <section key={section.label} className="flex w-full flex-col">
              <div className="flex w-full flex-col gap-1 pb-0.5 pt-2">
                <h2 className="font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">{section.label}</h2>
                <Divider />
              </div>
              <ul className="flex w-full flex-col">
                {section.rows.map((r) => {
                  const s = STYLE[r.kind];
                  return (
                    <li key={r.key}>
                      <button
                        type="button"
                        onClick={() => open(r)}
                        className={cn(
                          'flex w-full flex-wrap items-center gap-3 border-b border-line px-3 py-2 text-left transition-colors hover:bg-surface sm:flex-nowrap',
                          r.unread ? 'bg-primary-soft' : 'bg-white',
                        )}
                      >
                        <div className="flex w-14 shrink-0 items-center gap-2">
                          {r.unread ? <span className="flex h-2 w-4 shrink-0 items-center justify-center"><span className="size-2 rounded-full bg-primary" /><span className="sr-only">Sin leer</span></span> : <span className="h-2 w-4 shrink-0" />}
                          <NotificationIcon kind={r.kind} size="sm" />
                        </div>
                        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-0.5">
                          <p className={`font-jakarta text-[13px] leading-[normal] text-ink ${r.unread ? 'font-bold' : 'font-semibold'}`}>{r.title}</p>
                          <p className="font-jakarta text-[12px] font-normal leading-4 text-muted">{r.text}</p>
                        </div>
                        <div className="ml-[68px] flex shrink-0 items-center justify-end gap-3 sm:ml-0 sm:w-[220px]">
                          <p className="font-jakarta text-[11px] font-medium leading-[normal] text-muted sm:w-[90px] sm:text-right">{r.time}</p>
                          <Badge tone={s.tone} className="uppercase">
                            {s.tag}
                          </Badge>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
