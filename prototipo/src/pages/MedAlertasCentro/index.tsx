// Pantalla "med/alertas/centro" (Figma node 48:7) — generada desde el diseño original de Figma.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgBell10 from '../../assets/bell-10.svg';
import imgBell11 from '../../assets/bell-11.svg';
import imgBell9 from '../../assets/bell-9.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import { AppLayout, Badge, Button, EmptyState, IconCalendar, KpiCard, rowLinkClass, Select, Table, useRowLink, useToast } from '../../components';
import { CONFIRM_PATH, type AttendedState, type ConfirmState } from '../../data/alerts';
import { cn } from '../../lib/cn';

type Severity = 'Crítica' | 'Alta' | 'Media';
type AlertStatus = 'activa' | 'silenciada' | 'atendida';

type Alert = {
  id: string;
  patient: string;
  icon: string;
  stripe: string;
  severity: Severity;
  event: string;
  eventColor: string;
  time: string;
  owner: string;
  ownerColor?: string;
  attending?: boolean;
  /** Cuenta en "Pendientes de Atención". */
  pending?: boolean;
  highlight?: 'danger' | 'selected';
};

const ALERTS: Alert[] = [
  { id: 'C-03', patient: 'María González', icon: imgBell9, stripe: 'bg-danger', severity: 'Crítica', event: 'SpO2 Crítico — 84% en ventilador mecánico', eventColor: 'text-danger', time: 'Hace 1 min', owner: 'Dr. Roberto Silva (Asignado)', highlight: 'danger' },
  { id: 'C-09', patient: 'Francisco Díaz', icon: imgBell10, stripe: 'bg-warning', severity: 'Alta', event: 'FC Elevada — Taquicardia de 145 lpm detectada', eventColor: 'text-[#d97706]', time: 'Hace 3 min', owner: 'Atendiendo', ownerColor: 'text-[#d97706]', attending: true, highlight: 'selected' },
  { id: 'C-01', patient: 'Ricardo Gómez', icon: imgBell10, stripe: 'bg-warning', severity: 'Alta', event: 'Temperatura Elevada — 39.1°C persistente', eventColor: 'text-muted', time: 'Hace 8 min', owner: 'Dra. Ana Gómez', pending: true },
  { id: 'C-06', patient: 'Javier Mendoza', icon: imgBell10, stripe: 'bg-warning', severity: 'Alta', event: 'Presión Arterial Límite — 148/92 mmHg', eventColor: 'text-muted', time: 'Hace 12 min', owner: 'Dr. Roberto Silva', pending: true },
  { id: 'C-11', patient: 'Sofía Martínez', icon: imgBell11, stripe: 'bg-success', severity: 'Media', event: 'Desconexión de Sonda Vesical detectada', eventColor: 'text-muted', time: 'Hace 15 min', owner: 'Enf. Lucía Fernández', pending: true },
];

type HistoryRow = [string, string, string, string, string, string];

const HISTORY: HistoryRow[] = [
  ['08:15', imgLiveIndicatorEllipse, 'Andrés Castro', 'SpO2 Recuperado', 'Enf. Carlos M.', '1.5 min'],
  ['08:02', imgDropdownBadgeEllipse, 'Elena Rodríguez', 'FC Muy Alta', 'Dr. R. Silva', '2.1 min'],
  ['07:45', imgDropdownBadgeEllipse2, 'Gabriela Ruiz', 'Ritmo Inestable', 'Dr. C. Méndez', '3.2 min'],
  ['07:30', imgDropdownBadgeEllipse2, 'Lucía Fernández', 'Fiebre 38.9°C', 'Enf. Carlos M.', '4.0 min'],
  ['07:12', imgDropdownBadgeEllipse, 'Javier Mendoza', 'SpO2 Crítico', 'Dr. R. Silva', '1.8 min'],
  ['06:50', imgDropdownBadgeEllipse2, 'Elena Rodríguez', 'Presión Baja', 'Dra. A. Gómez', '2.5 min'],
];

const SEVERITIES = ['Todas', 'Crítica', 'Alta', 'Media'];
const STATES = ['Activas', 'Silenciadas', 'Atendidas', 'Todas'];
const DATES = [
  { value: 'hoy', label: 'Hoy, 24 Oct 2025' },
  { value: 'ayer', label: 'Ayer, 23 Oct 2025' },
  { value: '7d', label: 'Últimos 7 días' },
];

const SELF = '/MedAlertasCentro';

export default function MedAlertasCentro() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const rowLink = useRowLink();
  const attendedId = (location.state as AttendedState | null)?.attendedId;

  // Estado de cada alerta; si se vuelve de la confirmación, esa alerta ya llega atendida.
  const [status, setStatus] = useState<Record<string, AlertStatus>>(() => (attendedId ? { [attendedId]: 'atendida' } : {}));
  const [severity, setSeverity] = useState('Todas');
  const [stateFilter, setStateFilter] = useState('Activas');
  const [date, setDate] = useState('hoy');

  // Se limpia el state de la navegación para que recargar no repita la acción.
  useEffect(() => {
    if (attendedId) navigate(SELF, { replace: true, state: null });
  }, [attendedId, navigate]);

  const statusOf = (a: Alert): AlertStatus => status[a.id] ?? 'activa';
  const visible = date === 'ayer' ? [] : ALERTS.filter((a) => {
    const st = statusOf(a);
    if (severity !== 'Todas' && a.severity !== severity) return false;
    if (stateFilter === 'Activas') return st !== 'atendida';
    if (stateFilter === 'Silenciadas') return st === 'silenciada';
    if (stateFilter === 'Atendidas') return st === 'atendida';
    return true;
  });

  const attended = ALERTS.filter((a) => statusOf(a) === 'atendida');
  const history: HistoryRow[] =
    date === 'ayer' ? [] : [...attended.map((a): HistoryRow => ['Ahora', imgLiveIndicatorEllipse, a.patient, a.event.split(' — ')[0], 'Dr. C. Méndez', '—']), ...HISTORY];

  const activeCount = ALERTS.length - attended.length;
  const pendingCount = ALERTS.filter((a) => a.pending && statusOf(a) === 'activa').length;

  const toggleMute = (a: Alert) => {
    const muted = statusOf(a) === 'silenciada';
    setStatus((s) => ({ ...s, [a.id]: muted ? 'activa' : 'silenciada' }));
    toast(muted ? `Alerta de ${a.patient} reactivada` : `Alerta de ${a.patient} silenciada 15 min`, muted ? 'info' : 'success');
  };

  const attend = (a: Alert) => {
    const state: ConfirmState = {
      from: SELF,
      alert: { id: a.id, patient: a.patient, bed: `UCI Cama ${a.id}`, title: `Alerta ${a.severity} — ${a.event}`, detail: `Activada ${a.time.toLowerCase()}` },
    };
    navigate(CONFIRM_PATH, { state });
  };

  const resetFilters = () => {
    setSeverity('Todas');
    setStateFilter('Activas');
    setDate('hoy');
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Alertas"
      title="Centro de Alertas Críticas"
      actionsInlineFrom="xl"
      actions={
        <>
          <Select options={SEVERITIES} value={severity} onChange={setSeverity} format={(l) => `Severidad: ${l}`} />
          <Select options={STATES} value={stateFilter} onChange={setStateFilter} format={(l) => `Estado: ${l}`} />
          <Select options={DATES} value={date} onChange={setDate} icon={<IconCalendar size={14} className="text-muted" />} chevron={false} align="right" />
        </>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Alertas Activas" value={String(activeCount)} tone="danger" badge="Acción Urgente" />
          <KpiCard label="Pendientes de Atención" value={String(pendingCount)} tone="warning" badge="En Cola" />
          <KpiCard label="Tiempo Resp. Promedio" value="2.3" unit="min" tone="success" badge="Bajo el límite" />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 xl:flex-row">
          <section className="flex w-full min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Alertas Críticas Activas</h2>
            <div className="flex w-full flex-col gap-3">
              {visible.length === 0 && (
                <div className="rounded-xl border border-line bg-white">
                  <EmptyState onReset={resetFilters} />
                </div>
              )}
              {visible.map((a) => {
                const st = statusOf(a);
                return (
                  <article
                    key={a.id}
                    className={cn(
                      'flex w-full items-stretch overflow-hidden rounded-xl transition-opacity',
                      a.highlight === 'selected' ? 'border-2 border-primary bg-primary-soft' : 'border border-line',
                      a.highlight === 'danger' ? 'bg-danger-soft' : a.highlight !== 'selected' && 'bg-white',
                      st !== 'activa' && 'opacity-60',
                    )}
                  >
                    <div className={cn('w-1.5 shrink-0', a.stripe)} />
                    <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-col gap-1.5 leading-[normal]">
                        <div className="flex items-center gap-2">
                          <img className="size-3.5 shrink-0" alt="" src={a.icon} />
                          <p className="font-jakarta text-[15px] font-extrabold text-ink">
                            {a.id} {a.patient}
                          </p>
                        </div>
                        <p className={cn('font-jakarta text-[13px] font-semibold', a.eventColor)}>{a.event}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                          <p className="font-jakarta font-medium text-subtle">{a.time}</p>
                          <p className={cn('font-jakarta font-semibold', a.ownerColor ?? 'text-primary')}>{a.owner}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {st === 'atendida' ? (
                          <Badge tone="success">Atendida</Badge>
                        ) : (
                          <>
                            <Button variant="secondary" onClick={() => toggleMute(a)}>
                              {st === 'silenciada' ? 'Reactivar' : 'Silenciar'}
                            </Button>
                            {a.attending ? (
                              <Button variant="warning" onClick={() => attend(a)}>
                                Atendiendo
                              </Button>
                            ) : (
                              <Button onClick={() => attend(a)}>Atender</Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="flex w-full min-w-0 flex-col gap-3 xl:w-[450px] xl:shrink-0">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Historial Resuelto (Últimas horas)</h2>
            <div className="w-full overflow-hidden rounded-xl border border-line bg-white">
              {/* Paciente 20 px más ancho que en Figma para que los nombres no se corten (REVISION.md, V7). */}
              <Table minWidth={426}>
                <div className="flex w-full gap-3 border-b border-line bg-surface px-3 py-2.5 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                  <p className="w-[45px] shrink-0">HORA</p>
                  <p className="w-[125px] shrink-0">PACIENTE</p>
                  <p className="min-w-[110px] flex-1">EVENTO</p>
                  <p className="w-[60px] shrink-0 text-right">RESP.</p>
                </div>
                {history.length === 0 && <EmptyState message="Sin alertas resueltas en este periodo." onReset={resetFilters} />}
                {history.map(([time, dot, patient, event, by, resp], i) => (
                  <div
                    key={`${time}-${patient}`}
                    {...rowLink('/MedPacienteResumen')}
                    aria-label={`Ver a ${patient}`}
                    className={cn('flex w-full items-start gap-3 border-b border-line p-3 last:border-b-0', i % 2 ? 'bg-surface' : 'bg-white', rowLinkClass)}
                  >
                    <p className="w-[45px] shrink-0 font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{time}</p>
                    <div className="flex w-[125px] shrink-0 items-center gap-1.5">
                      <img className="size-1.5 shrink-0" alt="" src={dot} />
                      <p className="truncate font-jakarta text-[13px] font-bold leading-[normal] text-ink">{patient}</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-0.5 leading-[normal]">
                      <p className="font-jakarta text-[12px] font-semibold text-ink">{event}</p>
                      <p className="font-jakarta text-[10px] font-normal text-subtle">{by}</p>
                    </div>
                    <p className="w-[60px] shrink-0 text-right font-jakarta text-[12px] font-bold leading-[normal] text-success">{resp}</p>
                  </div>
                ))}
              </Table>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
