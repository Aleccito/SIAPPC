// Pantalla "med/dashboard/principal" (Figma node 245:22) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgAlertTriangle2 from '../../assets/alert-triangle-2.svg';
import imgCheckSquare from '../../assets/check-square.svg';
import imgEye from '../../assets/eye.svg';
import imgFileText4 from '../../assets/file-text-4.svg';
import imgFolder from '../../assets/folder.svg';
import imgHeart2 from '../../assets/heart-2.svg';
import imgHeart3 from '../../assets/heart-3.svg';
import imgSparklineContainer from '../../assets/sparkline-container.svg';
import imgSparklineContainer2 from '../../assets/sparkline-container-2.svg';
import imgSparklineContainer3 from '../../assets/sparkline-container-3.svg';
import imgSparklineContainer4 from '../../assets/sparkline-container-4.svg';
import imgUsers3 from '../../assets/users-3.svg';
import { AppLayout, Badge, Button, Card, EmptyState, rowLinkClass, SearchBox, Select, Table, useRowLink } from '../../components';
import { CONFIRM_PATH, type ConfirmState } from '../../data/alerts';
import { cn } from '../../lib/cn';

// Indicadores: los dos primeros llevan a su lista; "Pendientes" filtra la tabla.
const KPIS: Array<{ label: string; value: string; stripe: string; color: string; icon: string; to?: string }> = [
  { label: 'Pacientes Asignados', value: '12', stripe: 'bg-primary', color: 'text-ink', icon: imgUsers3, to: '/MedPacientesLista' },
  { label: 'Alertas Críticas', value: '3', stripe: 'bg-danger', color: 'text-danger', icon: imgAlertTriangle2, to: '/MedAlertasCentro' },
  { label: 'Pendientes Evaluación', value: '2', stripe: 'bg-success', color: 'text-ink', icon: imgCheckSquare },
];

const UNITS = ['UCI', 'Urgencias', 'Hospitalización'];
const STATES = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'CRÍTICO', label: 'Crítico' },
  { value: 'ATENCIÓN', label: 'Atención' },
  { value: 'ESTABLE', label: 'Estable' },
];

type Row = {
  name: string;
  hc: string;
  status: 'CRÍTICO' | 'ATENCIÓN' | 'ESTABLE';
  bed: string;
  vitals?: [string, string];
  gcs: string;
  triage: string;
  alert?: string;
};

const STATUS = {
  CRÍTICO: { tone: 'danger', triage: 'text-danger', row: 'bg-danger-soft' },
  ATENCIÓN: { tone: 'warning', triage: 'text-warning', row: 'bg-white' },
  ESTABLE: { tone: 'success', triage: 'text-success', row: 'bg-white' },
} as const;

const ROWS: Row[] = [
  { name: 'García López, Juan', hc: 'HC-49521', status: 'CRÍTICO', bed: 'UCI Cama 3', vitals: ['FC: 112↑ SpO2: 89%↓', 'PA: 85/50 (Hipotensión)'], gcs: 'GCS: 9/15', triage: 'TRIAGE: T1', alert: '⚠️ Hace 4 min' },
  { name: 'Rojas Méndez, Ana', hc: 'HC-98232', status: 'CRÍTICO', bed: 'UCI Cama 7', vitals: ['FC: 98 SpO2: 91%↓', 'PA: 90/60 (Baja)'], gcs: 'GCS: 11/15', triage: 'TRIAGE: T1', alert: '⚠️ Hace 3 min' },
  { name: 'Pérez Díaz, Carlos', hc: 'HC-44923', status: 'ATENCIÓN', bed: 'UCI Cama 2', vitals: ['FC: 88↑ SpO2: 94%', 'PA: 110/70'], gcs: 'GCS: 13/15', triage: 'TRIAGE: T2' },
  { name: 'Morales Vega, Luis', hc: 'HC-49822', status: 'ATENCIÓN', bed: 'UCI Cama 5', vitals: ['FC: 92↑ SpO2: 93%', 'PA: 105/65'], gcs: 'GCS: 12/15', triage: 'TRIAGE: T2' },
  { name: 'Fernández R., María', hc: 'HC-86521', status: 'ESTABLE', bed: 'UCI Cama 12', gcs: 'GCS: 15/15', triage: 'TRIAGE: T3' },
  { name: 'Torres G., Diego', hc: 'HC-19235', status: 'ESTABLE', bed: 'UCI Cama 8', gcs: 'GCS: 15/15', triage: 'TRIAGE: T3' },
];

// Íconos de acción de cada fila.
const ROW_ACTIONS = [
  { label: 'Ver perfil', to: '/MedPacienteResumen' },
  { label: 'Monitoreo', to: '/MedPacienteMonitoreoDetallado' },
  { label: 'Nota SOAP', to: '/MedPacienteNotasSoapNueva' },
  { label: 'Historia clínica', to: '/MedPacienteHistoriaClinicaGeneral' },
];

const TRENDS = [
  { name: 'García López Juan', bed: 'UCI Cama 3', series: [['FC (112 bpm)', 'text-danger', imgSparklineContainer], ['SpO2 (89%)', 'text-primary', imgSparklineContainer2]] },
  { name: 'Rojas Méndez Ana', bed: 'UCI Cama 7', series: [['FC (98 bpm)', 'text-warning', imgSparklineContainer3], ['SpO2 (91%)', 'text-primary', imgSparklineContainer4]] },
];

const FROM = '/MedDashboardPrincipal';

const ATTENTION: Array<{ tag: string; tone: 'danger' | 'warning' | 'neutral'; when: string; text: string; bed: string; to: string; state?: ConfirmState }> = [
  {
    tag: 'GCS Crítico',
    tone: 'danger',
    when: 'Hace 2 min',
    text: 'García: Glasgow bajó abruptamente de 13→9 en los últimos 20 minutos',
    bed: 'UCI Cama 3',
    to: CONFIRM_PATH,
    state: { from: FROM, alert: { id: 'D-03', patient: 'Juan García López', bed: 'UCI Cama 3', title: 'Alerta Crítica — Glasgow bajó de 13 a 9', detail: 'Activada hace 2 minutos' } },
  },
  {
    tag: 'SpO2 Bajo',
    tone: 'danger',
    when: 'Hace 3 min',
    text: 'Rojas: SpO2 por debajo de umbral hace 3 minutos sin confirmación médica',
    bed: 'UCI Cama 7',
    to: CONFIRM_PATH,
    state: { from: FROM, alert: { id: 'D-07', patient: 'Ana Rojas Méndez', bed: 'UCI Cama 7', title: 'Alerta Crítica — SpO2 por debajo de umbral (91%)', detail: 'Activada hace 3 minutos, sin confirmación médica' } },
  },
  { tag: 'Evaluación', tone: 'warning', when: 'Hace 12 min', text: 'Méndez: Evaluación primaria ABCDE lleva 45 minutos sin completarse', bed: 'Cama 6', to: '/MedPacienteResumen' },
  { tag: 'Pendiente', tone: 'neutral', when: 'Hace 20 min', text: 'Pérez: Pendiente registrar nota SOAP tras pase de guardia de trauma', bed: 'UCI Cama 2', to: '/MedPacienteNotasSoapNueva' },
];

const BED_COLOR = { danger: 'text-danger', warning: 'text-warning', neutral: 'text-muted' };

const COLS = 'flex w-full items-center px-4';

export default function MedDashboardPrincipal() {
  const [unit, setUnit] = useState('UCI');
  const [status, setStatus] = useState('TODOS');
  const navigate = useNavigate();
  const rowLink = useRowLink();
  const rows = unit === 'UCI' ? ROWS.filter((r) => status === 'TODOS' || r.status === status) : [];
  const resetFilters = () => {
    setUnit('UCI');
    setStatus('TODOS');
  };

  return (
    <AppLayout breadcrumb="SIAPPC > Dashboard" title="Dashboard Principal" actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente por nombre o HC..." width={320} />}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-5 p-4 md:p-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          {/* En celular los tres indicadores van en una fila compacta (REVISION.md, V16). */}
          <div className="grid w-full grid-cols-3 gap-2 sm:gap-[14px]">
            {KPIS.map((k) => {
              const pressed = !k.to && status === 'ATENCIÓN';
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
                  title="Filtrar la tabla a pacientes en atención"
                  onClick={() => {
                    setUnit('UCI');
                    setStatus(pressed ? 'TODOS' : 'ATENCIÓN');
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
                <Select variant="chip" chevron={false} ariaLabel="Unidad" options={UNITS} value={unit} onChange={setUnit} />
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
                {rows.length === 0 && <EmptyState message={unit === 'UCI' ? undefined : `Sin pacientes de ejemplo en ${unit}.`} onReset={resetFilters} />}
                {rows.map((r) => {
                  const s = STATUS[r.status];
                  const crit = r.status === 'CRÍTICO';
                  const icons = [imgEye, crit ? imgHeart2 : imgHeart3, imgFileText4, imgFolder];
                  return (
                    <div key={r.hc} {...rowLink('/MedPacienteResumen')} aria-label={`Ver a ${r.name}`} className={cn(COLS, 'border-b border-line py-3 last:border-b-0', s.row, rowLinkClass)}>
                      <div className="flex w-[180px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{r.name}</p>
                        <p className="font-jakarta text-[11px] font-normal text-muted">{r.hc}</p>
                      </div>
                      <div className="w-[100px] shrink-0">
                        <Badge tone={s.tone} size="sm">{r.status}</Badge>
                      </div>
                      <p className="w-[100px] shrink-0 font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{r.bed}</p>
                      <div className="flex w-[250px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        {r.vitals ? (
                          <>
                            <p className={cn('font-jakarta text-[13px] font-bold', crit ? 'text-danger' : 'text-ink')}>{r.vitals[0]}</p>
                            <p className="font-jakarta text-[11px] font-normal text-muted">{r.vitals[1]}</p>
                          </>
                        ) : (
                          <p className="font-jakarta text-[13px] font-normal text-muted">-</p>
                        )}
                      </div>
                      <div className="flex w-[130px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{r.gcs}</p>
                        <p className={cn('font-jakarta text-[11px] font-semibold', s.triage)}>{r.triage}</p>
                      </div>
                      <p className={cn('w-[120px] shrink-0 font-jakarta text-[12px] leading-[normal]', r.alert ? 'font-bold text-danger' : 'font-normal text-muted')}>{r.alert ?? 'Ninguna'}</p>
                      <div className="flex min-w-0 flex-1 justify-end gap-1">
                        {ROW_ACTIONS.map((a, i) => (
                          <Link
                            key={a.label}
                            to={a.to}
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
              <p className="font-normal text-muted">Mostrando {rows.length} de 12 pacientes</p>
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
              {TRENDS.map((t) => (
                <Link
                  key={t.name}
                  to="/MedPacienteTendenciasVitales"
                  aria-label={`Tendencias de ${t.name}`}
                  className="flex min-w-0 flex-col gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-subtle sm:flex-row sm:items-center"
                >
                  {/* Nombre completo (en Figma se cortaba a 100 px) y gráficas que se estiran (REVISION.md, V8). */}
                  <div className="flex min-w-[100px] shrink-0 flex-col gap-0.5 leading-[normal]">
                    <p className="whitespace-nowrap font-jakarta text-[13px] font-bold text-ink">{t.name}</p>
                    <p className="font-jakarta text-[11px] font-normal text-muted">{t.bed}</p>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {t.series.map(([label, color, img]) => (
                      <div key={label} className="flex min-w-[96px] flex-1 flex-col gap-0.5">
                        <p className={cn('font-jakarta text-[11px] font-semibold leading-[normal]', color)}>{label}</p>
                        <img className="h-8 w-full object-fill" alt="" src={img} />
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-4 xl:w-[340px] xl:shrink-0 xl:self-stretch">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Requiere tu atención ahora</h2>
          <ul className="flex w-full flex-col gap-3">
            {ATTENTION.map((a) => (
              <li key={a.text}>
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
