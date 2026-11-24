// Pantalla "med/alertas/centro" (Figma node 48:7) — generada desde el diseño original de Figma.
// Las alertas del seed de los pacientes asignados (GET /sensors/alerts), agrupadas por cama, signo y
// severidad: el seed trae una por minuto mientras el signo sigue fuera de rango (REVISION-IA.md, D5).
// El historial muestra las que el seed trae como `reconocida`. Atender y silenciar no existen en el
// backend (CONEXION-BACKEND.md, pedido 2): duran lo que la visita.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgBell10 from '../../assets/bell-10.svg';
import imgBell11 from '../../assets/bell-11.svg';
import imgBell9 from '../../assets/bell-9.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import { useAlerts } from '../../api/queries';
import { AppLayout, Badge, Button, EmptyState, IconCalendar, KpiCard, rowLinkClass, Select, Table, useRowLink, useToast } from '../../components';
import { alertInfoFrom, attendedAlerts, CONFIRM_PATH, type AttendedState, type ConfirmState } from '../../data/alerts';
import { usePatientRows, type PatientRow } from '../../data/patients';
import { alertTitle, alertValueText, type AlertGroup } from '../../lib/alerts';
import { fmtAgo, fmtDate, fmtTime, SEVERITY_LABEL } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';

type AlertStatus = 'activa' | 'silenciada' | 'atendida';

/** Una tarjeta: un grupo de alertas de un paciente. */
type Alert = { group: AlertGroup; patient: PatientRow };

const SEVERITY_STYLE = {
  critica: { icon: imgBell9, stripe: 'bg-danger', event: 'text-danger', box: 'bg-danger-soft' },
  alta: { icon: imgBell10, stripe: 'bg-warning', event: 'text-[#d97706]', box: 'bg-white' },
  media: { icon: imgBell11, stripe: 'bg-success', event: 'text-muted', box: 'bg-white' },
  baja: { icon: imgBell11, stripe: 'bg-success', event: 'text-muted', box: 'bg-white' },
} as const;

const SEVERITIES = ['Todas', 'Crítica', 'Alta', 'Media'];
const STATES = ['Activas', 'Silenciadas', 'Atendidas', 'Todas'];
const today = new Date();
const yesterday = new Date(Date.now() - 86_400_000);
const DATES = [
  { value: 'hoy', label: `Hoy, ${fmtDate(today.toISOString())}` },
  { value: 'ayer', label: `Ayer, ${fmtDate(yesterday.toISOString())}` },
  { value: '7d', label: 'Últimos 7 días' },
];
// Punto de la severidad en el historial (los de Figma).
const HISTORY_DOT = { critica: imgDropdownBadgeEllipse, alta: imgDropdownBadgeEllipse2, media: imgLiveIndicatorEllipse, baja: imgLiveIndicatorEllipse } as const;

const SELF = '/MedAlertasCentro';

export default function MedAlertasCentro() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const rowLink = useRowLink();
  const attendedId = (location.state as AttendedState | null)?.attendedId;

  // Estado de cada grupo; si se vuelve de la confirmación, ese grupo ya llega atendido.
  const [status, setStatus] = useState<Record<string, AlertStatus>>(() =>
    Object.fromEntries([...attendedAlerts, ...(attendedId ? [attendedId] : [])].map((id) => [id, 'atendida' as AlertStatus])),
  );
  // Con las atendidas en esta visita, para poder filtrar "Atendidas".
  const { rows, isPending } = usePatientRows({ includeAttended: true });
  const raw = useAlerts({ limit: 500 });
  const ALERTS: Alert[] = rows.flatMap((patient) => patient.alertGroups.map((group) => ({ group, patient })));
  const [severity, setSeverity] = useState('Todas');
  const [stateFilter, setStateFilter] = useState('Activas');
  const [date, setDate] = useState('hoy');

  // Se limpia el state de la navegación para que recargar no repita la acción.
  useEffect(() => {
    if (attendedId) navigate(SELF, { replace: true, state: null });
  }, [attendedId, navigate]);

  const statusOf = (a: Alert): AlertStatus => status[a.group.key] ?? 'activa';
  const visible = date === 'ayer' ? [] : ALERTS.filter((a) => {
    const st = statusOf(a);
    if (severity !== 'Todas' && SEVERITY_LABEL[a.group.severity] !== severity) return false;
    if (stateFilter === 'Activas') return st !== 'atendida';
    if (stateFilter === 'Silenciadas') return st === 'silenciada';
    if (stateFilter === 'Atendidas') return st === 'atendida';
    return true;
  });

  const attended = ALERTS.filter((a) => statusOf(a) === 'atendida');
  // Historial: lo atendido en esta visita y las alertas que el seed trae como reconocidas.
  type HistoryRow = { key: string; time: string; dot: string; patient: PatientRow; event: string; by: string; resp: string };
  const acknowledged: HistoryRow[] = (raw.data ?? [])
    .filter((a) => a.status === 'reconocida')
    .slice(0, 6)
    .flatMap((a) => {
      const patient = rows.find((r) => r.device === a.device);
      return patient
        ? [{ key: a.id, time: fmtTime(a.at), dot: HISTORY_DOT[a.severity], patient, event: `${alertTitle(a.variable, a.severity, a.value)} (${a.value})`, by: 'Reconocida en el monitor', resp: '—' }]
        : [];
    });
  const history: HistoryRow[] =
    date === 'ayer'
      ? []
      : [
          ...attended.map((a): HistoryRow => ({ key: a.group.key, time: 'Ahora', dot: imgLiveIndicatorEllipse, patient: a.patient, event: alertTitle(a.group.variable, a.group.severity, a.group.latest.value), by: 'Dr. C. Méndez', resp: '—' })),
          ...acknowledged,
        ];

  const activeCount = ALERTS.length - attended.length;
  const pendingCount = ALERTS.filter((a) => a.group.open > 0 && statusOf(a) === 'activa').length;

  const toggleMute = (a: Alert) => {
    const muted = statusOf(a) === 'silenciada';
    setStatus((s) => ({ ...s, [a.group.key]: muted ? 'activa' : 'silenciada' }));
    toast(muted ? `Alerta de ${a.patient.name} reactivada` : `Alerta de ${a.patient.name} silenciada 15 min`, muted ? 'info' : 'success');
  };

  const attend = (a: Alert) => {
    const state: ConfirmState = { from: SELF, alert: alertInfoFrom(a.group, { cedula: a.patient.document, name: a.patient.name, bed: a.patient.bed }) };
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
          {/* El backend no registra cuándo se atiende una alerta (CONEXION-BACKEND.md, pedido 2). */}
          <KpiCard label="Tiempo Resp. Promedio" value="—" tone="success" badge="Sin registro" />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 xl:flex-row">
          <section className="flex w-full min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Alertas Críticas Activas</h2>
            <div className="flex w-full flex-col gap-3">
              {visible.length === 0 && (
                <div className="rounded-xl border border-line bg-white">
                  <EmptyState message={isPending ? 'Cargando alertas…' : undefined} onReset={resetFilters} />
                </div>
              )}
              {visible.map((a) => {
                const st = statusOf(a);
                const s = SEVERITY_STYLE[a.group.severity];
                const g = a.group;
                return (
                  <article key={g.key} className={cn('flex w-full items-stretch overflow-hidden rounded-xl border border-line transition-opacity', s.box, st !== 'activa' && 'opacity-60')}>
                    <div className={cn('w-1.5 shrink-0', s.stripe)} />
                    <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-col gap-1.5 leading-[normal]">
                        <div className="flex items-center gap-2">
                          <img className="size-3.5 shrink-0" alt="" src={s.icon} />
                          <p className="font-jakarta text-[15px] font-extrabold text-ink">{`${a.patient.bed ?? '—'} ${a.patient.name}`}</p>
                        </div>
                        <p className={cn('font-jakarta text-[13px] font-semibold', s.event)}>
                          {`${alertTitle(g.variable, g.severity, g.latest.value)} — ${alertValueText(g.variable, g.latest.value)}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                          <p className="font-jakarta font-medium text-subtle">
                            {`${fmtAgo(g.latest.at).replace(/^h/, 'H')} · ${g.count} ${g.count === 1 ? 'aviso' : 'avisos'} desde las ${fmtTime(g.since)}`}
                          </p>
                          <p className="font-jakarta font-semibold text-primary">Dr. Carlos Méndez (Asignado)</p>
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
                            <Button onClick={() => attend(a)}>Atender</Button>
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
                {history.map(({ key, time, dot, patient: p, event, by, resp }, i) => (
                  <div
                    key={key}
                    {...rowLink(patientPath('/MedPacienteResumen', p.document))}
                    aria-label={`Ver a ${p.name}`}
                    className={cn('flex w-full items-start gap-3 border-b border-line p-3 last:border-b-0', i % 2 ? 'bg-surface' : 'bg-white', rowLinkClass)}
                  >
                    <p className="w-[45px] shrink-0 font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{time}</p>
                    <div className="flex w-[125px] shrink-0 items-start gap-1.5">
                      <img className="mt-[5px] size-1.5 shrink-0" alt="" src={dot} />
                      <p className="min-w-0 font-jakarta text-[13px] font-bold leading-[normal] text-ink">{p.name}</p>
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
