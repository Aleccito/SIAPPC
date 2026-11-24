// Pantalla "med/dashboard/principal" (Figma node 245:22) — generada desde el diseño original de Figma.
// Datos: los pacientes asignados (GET /dashboard/assigned-patients), sus alertas agrupadas y lecturas
// del seed. Los indicadores se calculan; PA y temperatura salen de src/api/sinBackend.ts.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadings } from '../../api/queries';
import imgAlertTriangle2 from '../../assets/alert-triangle-2.svg';
import imgCheckSquare from '../../assets/check-square.svg';
import imgEye from '../../assets/eye.svg';
import imgFileText4 from '../../assets/file-text-4.svg';
import imgFolder from '../../assets/folder.svg';
import imgHeart2 from '../../assets/heart-2.svg';
import imgHeart3 from '../../assets/heart-3.svg';
import imgUsers3 from '../../assets/users-3.svg';
import { AppLayout, Badge, Button, Card, EmptyState, rowLinkClass, SearchBox, Select, Table, useRowLink } from '../../components';
import { Sparkline } from '../../components/ui/Sparkline';
import { alertInfoFrom, CONFIRM_PATH, type ConfirmState } from '../../data/alerts';
import { usePatientRows, vitalsText, type PatientRow } from '../../data/patients';
import { alertTitle } from '../../lib/alerts';
import { fmtAgo, surnameFirst, VARIABLE_LABEL } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';

const ALL_UNITS = 'Todas';
const STATES = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'critico', label: 'Crítico' },
  { value: 'atencion', label: 'Atención' },
  { value: 'estable', label: 'Estable' },
];
/** Filas por página: las de Figma (el resto, en "Ver todos"). */
const PAGE = 6;

const STATUS_STYLE = {
  critico: { triage: 'text-danger', row: 'bg-danger-soft' },
  atencion: { triage: 'text-warning', row: 'bg-white' },
  estable: { triage: 'text-success', row: 'bg-white' },
} as const;

// Íconos de acción de cada fila.
const ROW_ACTIONS = [
  { label: 'Ver perfil', to: '/MedPacienteResumen' },
  { label: 'Monitoreo', to: '/MedPacienteMonitoreoDetallado' },
  { label: 'Nota SOAP', to: '/MedPacienteNotasSoapNueva' },
  { label: 'Historia clínica', to: '/MedPacienteHistoriaClinicaGeneral' },
];

const FROM = '/MedDashboardPrincipal';

type Attention = { key: string; tag: string; tone: 'danger' | 'warning' | 'neutral'; when: string; at: string; text: string; bed: string; to: string; state?: ConfirmState };

const BED_COLOR = { danger: 'text-danger', warning: 'text-warning', neutral: 'text-muted' };

const COLS = 'flex w-full items-center px-4';

const surname = (name: string) => name.split(/\s+/)[1] ?? name;

/** "Requiere tu atención ahora": las alertas más graves y recientes (una por paciente) y las evaluaciones pendientes. */
function attentionItems(rows: PatientRow[]): Attention[] {
  const alerts = rows.flatMap((r) => {
    const g = r.alertGroups[0];
    if (!g) return [];
    const crit = g.severity === 'critica';
    const short = VARIABLE_LABEL[g.variable]?.short ?? g.variable;
    return [
      {
        key: g.key,
        tag: `${short} ${crit ? 'Crítica' : 'Alta'}`,
        tone: crit ? ('danger' as const) : ('warning' as const),
        when: fmtAgo(g.latest.at),
        at: g.latest.at,
        text: `${surname(r.name)}: ${alertTitle(g.variable, g.severity, g.latest.value)} (${g.latest.value}${VARIABLE_LABEL[g.variable]?.unit === '%' ? '%' : ` ${VARIABLE_LABEL[g.variable]?.unit ?? ''}`}), ${g.count} avisos sin confirmación médica`,
        bed: r.bed ?? '—',
        to: `${CONFIRM_PATH}?paciente=${r.document}`,
        state: { from: FROM, alert: alertInfoFrom(g, { cedula: r.document, name: r.name, bed: r.bed }) },
      },
    ];
  });
  const pending = rows
    .filter((r) => !r.examined)
    .map((r) => ({
      key: `eval-${r.document}`,
      tag: 'Evaluación',
      tone: 'warning' as const,
      when: fmtAgo(r.admittedAt),
      at: r.admittedAt ?? r.arrivedAt,
      text: `${surname(r.name)}: evaluación primaria pendiente (sin exploración física desde el ingreso)`,
      bed: r.bed ?? '—',
      to: patientPath('/MedPacienteExploracionFisica', r.document),
    }));
  const crit = alerts.filter((a) => a.tone === 'danger');
  const rest = alerts.filter((a) => a.tone !== 'danger');
  return [...crit.slice(0, 2), ...pending.slice(0, 1), ...crit.slice(2), ...rest, ...pending.slice(1)].slice(0, 4);
}

/** Minigráficas de FC y SpO2 de un paciente: sus 40 min de lecturas del seed. */
function TrendRow({ r }: { r: PatientRow }) {
  const hr = useReadings({ device: r.device ?? undefined, variable: 'hr', limit: 41 }, !!r.device);
  const spo2 = useReadings({ device: r.device ?? undefined, variable: 'spo2', limit: 41 }, !!r.device);
  const series: Array<[string, string, number[]]> = [
    [`FC (${r.vitals.hr ?? '—'} bpm)`, r.state === 'critico' ? 'text-danger' : 'text-warning', (hr.data ?? []).map((x) => x.value).reverse()],
    [`SpO2 (${r.vitals.spo2 ?? '—'}%)`, 'text-primary', (spo2.data ?? []).map((x) => x.value).reverse()],
  ];
  return (
    <Link
      to={patientPath('/MedPacienteTendenciasVitales', r.document)}
      aria-label={`Tendencias de ${r.name}`}
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-subtle sm:flex-row sm:items-center"
    >
      {/* Nombre completo (en Figma se cortaba a 100 px) y gráficas que se estiran (REVISION.md, V8). */}
      <div className="flex min-w-[100px] shrink-0 flex-col gap-0.5 leading-[normal]">
        <p className="whitespace-nowrap font-jakarta text-[13px] font-bold text-ink">{r.name.split(/\s+/).slice(0, 2).join(' ')}</p>
        <p className="font-jakarta text-[11px] font-normal text-muted">{`Cama ${r.bed ?? '—'}`}</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {series.map(([label, color, values]) => (
          <div key={label} className="flex min-w-[96px] flex-1 flex-col gap-0.5">
            <p className={cn('font-jakarta text-[11px] font-semibold leading-[normal]', color)}>{label}</p>
            <Sparkline values={values} className={color} />
          </div>
        ))}
      </div>
    </Link>
  );
}

export default function MedDashboardPrincipal() {
  const [unit, setUnit] = useState(ALL_UNITS);
  const [status, setStatus] = useState('TODOS');
  const navigate = useNavigate();
  const rowLink = useRowLink();
  const { rows: all, isPending } = usePatientRows();
  const units = [ALL_UNITS, ...[...new Set(all.map((r) => r.unit).filter((u): u is string => !!u))]];
  const filtered = all.filter((r) => (unit === ALL_UNITS || r.unit === unit) && (status === 'TODOS' || r.state === status));
  const rows = filtered.slice(0, PAGE);
  const resetFilters = () => {
    setUnit(ALL_UNITS);
    setStatus('TODOS');
  };
  // Indicadores: los dos primeros llevan a su lista; "Pendientes" filtra la tabla a quien no tiene exploración.
  const [pendingOnly, setPendingOnly] = useState(false);
  const shownRows = pendingOnly ? filtered.filter((r) => !r.examined).slice(0, PAGE) : rows;
  const KPIS: Array<{ label: string; value: string; stripe: string; color: string; icon: string; to?: string }> = [
    { label: 'Pacientes Asignados', value: isPending ? '—' : String(all.length), stripe: 'bg-primary', color: 'text-ink', icon: imgUsers3, to: '/MedPacientesLista' },
    { label: 'Alertas Críticas', value: isPending ? '—' : String(all.filter((r) => r.state === 'critico').length), stripe: 'bg-danger', color: 'text-danger', icon: imgAlertTriangle2, to: '/MedAlertasCentro' },
    { label: 'Pendientes Evaluación', value: isPending ? '—' : String(all.filter((r) => !r.examined).length), stripe: 'bg-success', color: 'text-ink', icon: imgCheckSquare },
  ];
  const trends = all.filter((r) => r.state === 'critico').slice(0, 2);
  const attention = attentionItems(all);

  return (
    <AppLayout breadcrumb="SIAPPC > Dashboard" title="Dashboard Principal" actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente por nombre o HC..." width={320} />}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-5 p-4 md:p-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          {/* En celular los tres indicadores van en una fila compacta (REVISION.md, V16). */}
          <div className="grid w-full grid-cols-3 gap-2 sm:gap-[14px]">
            {KPIS.map((k) => {
              const pressed = !k.to && pendingOnly;
              const body = (
                <Card raised padding="none" className={cn('relative flex h-full flex-col gap-2 overflow-hidden p-3 transition-colors hover:border-subtle sm:p-[18px]', pressed && 'border-primary')}>
                  <span className={cn('absolute inset-y-0 left-0 w-1', k.stripe)} />
                  <div className="flex w-full items-center justify-between pl-1.5">
                    <p className="font-jakarta text-[11px] font-medium leading-[normal] text-muted sm:text-[13px]">{k.label}</p>
                    <img className="hidden size-5 sm:block" alt="" src={k.icon} />
                  </div>
                  <p className={cn('pl-1.5 font-jakarta text-[22px] font-extrabold leading-[normal] sm:text-[28px]', k.color)}>{k.value}</p>
                </Card>
              );
              return k.to ? (
                <Link key={k.label} to={k.to} className="block rounded-xl">
                  {body}
                </Link>
              ) : (
                <button
                  key={k.label}
                  type="button"
                  aria-pressed={pressed}
                  title="Filtrar la tabla a pacientes con evaluación pendiente"
                  onClick={() => {
                    resetFilters();
                    setPendingOnly(!pressed);
                  }}
                  className="block rounded-xl text-left"
                >
                  {body}
                </button>
              );
            })}
          </div>

          <Card className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Monitoreo de Pacientes Politraumatizados (ATLS)</h2>
                <Badge tone="danger">Alta Prioridad de Atención</Badge>
              </div>
              <div className="flex items-center gap-[10px] font-jakarta text-[12px] leading-[normal]">
                <p className="font-semibold text-muted">Unidad:</p>
                <Select variant="chip" chevron={false} ariaLabel="Unidad" options={units} value={unit} onChange={setUnit} />
                <p className="font-semibold text-muted">Estado:</p>
                <Select variant="chip" chevron={false} ariaLabel="Estado" options={STATES} value={status} onChange={setStatus} align="right" />
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-line">
              <Table minWidth={1000}>
                <div className={cn(COLS, 'border-b border-line bg-surface py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted')}>
                  <p className="w-[180px] shrink-0">Nombre / HC</p>
                  <p className="w-[100px] shrink-0">Estado</p>
                  <p className="w-[100px] shrink-0">Ubicación</p>
                  <p className="w-[250px] shrink-0">Signos Vitales</p>
                  <p className="w-[130px] shrink-0">Glasgow / TR</p>
                  <p className="w-[120px] shrink-0">Alerta Activa</p>
                  <p className="min-w-0 flex-1 text-right">Acciones</p>
                </div>
                {shownRows.length === 0 && <EmptyState message={isPending ? 'Cargando pacientes…' : undefined} onReset={resetFilters} />}
                {shownRows.map((r) => {
                  const s = STATUS_STYLE[r.state];
                  const crit = r.state === 'critico';
                  const icons = [imgEye, crit ? imgHeart2 : imgHeart3, imgFileText4, imgFolder];
                  const vitals = vitalsText(r);
                  const lastAlert = r.alertGroups[0]?.latest.at;
                  return (
                    <div key={r.id} {...rowLink(patientPath('/MedPacienteResumen', r.document))} aria-label={`Ver a ${r.name}`} className={cn(COLS, 'border-b border-line py-3 last:border-b-0', s.row, rowLinkClass)}>
                      <div className="flex w-[180px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{surnameFirst(r.name)}</p>
                        <p className="font-jakarta text-[11px] font-normal text-muted">{r.document}</p>
                      </div>
                      <div className="w-[100px] shrink-0">
                        <Badge tone={r.tone} size="sm">{r.stateLabel.toUpperCase()}</Badge>
                      </div>
                      <p className="w-[100px] shrink-0 font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{r.bed ?? '—'}</p>
                      <div className="flex w-[250px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className={cn('font-jakarta text-[13px] font-bold', crit ? 'text-danger' : 'text-ink')}>{vitals[0]}</p>
                        <p className="font-jakarta text-[11px] font-normal text-muted">{vitals[1]}</p>
                      </div>
                      <div className="flex w-[130px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink" title={r.glasgow ? undefined : 'Glasgow pendiente: sin exploración física desde el ingreso'}>
                          {r.glasgow ? `GCS: ${r.glasgow}/15` : 'GCS: —'}
                        </p>
                        <p className={cn('font-jakarta text-[11px] font-semibold', s.triage)}>{`TRIAGE: ${r.triage}`}</p>
                      </div>
                      <p className={cn('w-[120px] shrink-0 whitespace-nowrap font-jakarta text-[12px] leading-[normal]', lastAlert ? 'font-bold text-danger' : 'font-normal text-muted')}>
                        {lastAlert ? `⚠️ ${fmtAgo(lastAlert).replace('hace un momento', 'ahora').replace(/^[ha]/, (c) => c.toUpperCase())}` : 'Ninguna'}
                      </p>
                      <div className="flex min-w-0 flex-1 justify-end gap-1">
                        {ROW_ACTIONS.map((a, i) => (
                          <Link
                            key={a.label}
                            to={patientPath(a.to, r.document)}
                            title={a.label}
                            aria-label={`${a.label} de ${r.name}`}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="flex items-center justify-center rounded-lg border border-line bg-white p-2 hover:bg-surface"
                          >
                            <img className="size-4" alt="" src={icons[i]} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </Table>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-3 font-jakarta text-[13px] leading-[normal]">
              <p className="font-normal text-muted">{`Mostrando ${shownRows.length} de ${pendingOnly ? filtered.filter((r) => !r.examined).length : filtered.length} pacientes`}</p>
              <Button variant="link" to="/MedPacientesLista">
                Ver todos →
              </Button>
            </div>
          </Card>

          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex flex-col gap-0.5 leading-[normal]">
              <h2 className="font-jakarta text-[15px] font-extrabold text-ink">📈 Tendencias de Pacientes Críticos (Últimas 4 Horas)</h2>
              <p className="font-jakarta text-[12px] font-normal text-muted">Lecturas en tiempo real</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 min-[1400px]:grid-cols-2">
              {trends.map((r) => (
                <TrendRow key={r.id} r={r} />
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-4 xl:w-[340px] xl:shrink-0 xl:self-stretch">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Requiere tu atención ahora</h2>
          <ul className="flex w-full flex-col gap-3">
            {attention.length === 0 && <li className="font-jakarta text-[13px] text-muted">{isPending ? 'Cargando…' : 'Nada pendiente.'}</li>}
            {attention.map((a) => (
              <li key={a.key}>
                <button
                  type="button"
                  onClick={() => navigate(a.to, { state: a.state })}
                  className="flex w-full flex-col gap-2 rounded-lg border border-line bg-white p-[14px] text-left transition-colors hover:border-subtle"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Badge tone={a.tone} size="sm">{a.tag}</Badge>
                    <p className="font-jakarta text-[11px] font-normal leading-[normal] text-muted">{a.when}</p>
                  </div>
                  <p className="font-jakarta text-[12px] font-semibold leading-[17px] text-ink">{a.text}</p>
                  <p className={cn('font-jakarta text-[11px] font-bold leading-[normal]', BED_COLOR[a.tone])}>{a.bed}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppLayout>
  );
}
