// Pantalla "med/pacientes/lista" (Figma node 45:79) — generada desde el diseño original de Figma.
import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import imgAlertTriangle from '../../assets/alert-triangle.svg';
import imgArrowLeft from '../../assets/arrow-left.svg';
import imgArrowRight from '../../assets/arrow-right.svg';
import imgArrowUpRight from '../../assets/arrow-up-right.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgCheck from '../../assets/check.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgMoreHorizontal from '../../assets/more-horizontal.svg';
import imgSearch from '../../assets/search.svg';
import imgStateIndicator from '../../assets/state-indicator.svg';
import imgStateIndicator2 from '../../assets/state-indicator-2.svg';
import { AppLayout, Badge, Button, Card, Divider, EmptyState, IconPlus, KpiCard, Menu, rowLinkClass, Select, Table, useRowLink, useToast } from '../../components';
import { cn } from '../../lib/cn';
import { matches } from '../../lib/text';

type Status = 'CRÍTICO' | 'MONITOREO' | 'ESTABLE';
type Unit = 'UCI' | 'Urgencias' | 'Hospitalización';

type Patient = {
  initials: string;
  name: string;
  meta: string;
  status: Status;
  transfer: [string, string];
  bed: string;
  hr: string;
  spo2: string;
  temp: string;
  unit: Unit;
  /** Días desde el ingreso (para "Rango de Admisión"). */
  admittedDaysAgo: number;
  selected?: boolean;
};

const STATUS_TONE = { CRÍTICO: 'danger', MONITOREO: 'warning', ESTABLE: 'success' } as const;
const STATUS_RANK: Record<Status, number> = { CRÍTICO: 0, MONITOREO: 1, ESTABLE: 2 };

const PATIENTS: Patient[] = [
  { initials: 'ER', name: 'Elena Rodríguez', meta: 'PT-8821 • 64 años', status: 'CRÍTICO', transfer: [imgArrowRight, 'Ingreso'], bed: 'Cama C-03', hr: '112', spo2: '89', temp: '38.2°', unit: 'UCI', admittedDaysAgo: 0 },
  { initials: 'JM', name: 'Javier Mendoza', meta: 'PT-8822 • 45 años', status: 'MONITOREO', transfer: [imgArrowLeft, 'Salida'], bed: 'Cama C-07', hr: '88', spo2: '96', temp: '37.1°', unit: 'UCI', admittedDaysAgo: 2, selected: true },
  { initials: 'SM', name: 'Sofía Martínez', meta: 'PT-8823 • 29 años', status: 'ESTABLE', transfer: [imgCheck, 'Alta'], bed: 'Cama C-02', hr: '72', spo2: '99', temp: '36.6°', unit: 'UCI', admittedDaysAgo: 5 },
  { initials: 'RG', name: 'Ricardo Gómez', meta: 'PT-8824 • 72 años', status: 'CRÍTICO', transfer: [imgAlertTriangle, 'Urgente'], bed: 'Cama C-01', hr: '105', spo2: '91', temp: '37.8°', unit: 'UCI', admittedDaysAgo: 1 },
  { initials: 'LF', name: 'Lucía Fernández', meta: 'PT-8825 • 53 años', status: 'ESTABLE', transfer: [imgArrowUpRight, 'Traslado'], bed: 'Cama C-05', hr: '68', spo2: '98', temp: '36.8°', unit: 'UCI', admittedDaysAgo: 12 },
  // Agregados para las páginas 2 y 3 y para los filtros (datos de ejemplo).
  { initials: 'AR', name: 'Alberto Ruiz', meta: 'PT-8826 • 45 años', status: 'ESTABLE', transfer: [imgArrowRight, 'Ingreso'], bed: 'Cama C-04', hr: '72', spo2: '97', temp: '36.8°', unit: 'UCI', admittedDaysAgo: 3 },
  { initials: 'FD', name: 'Francisco Díaz', meta: 'PT-8827 • 81 años', status: 'CRÍTICO', transfer: [imgAlertTriangle, 'Urgente'], bed: 'Cama C-06', hr: '130', spo2: '88', temp: '38.5°', unit: 'UCI', admittedDaysAgo: 1 },
  { initials: 'AM', name: 'Ana Morales', meta: 'PT-8828 • 35 años', status: 'MONITOREO', transfer: [imgArrowRight, 'Ingreso'], bed: 'Cama U-02', hr: '98', spo2: '95', temp: '37.4°', unit: 'Urgencias', admittedDaysAgo: 0 },
  { initials: 'AC', name: 'Andrés Castro', meta: 'PT-8829 • 52 años', status: 'MONITOREO', transfer: [imgArrowUpRight, 'Traslado'], bed: 'Cama U-04', hr: '92', spo2: '94', temp: '37.0°', unit: 'Urgencias', admittedDaysAgo: 0 },
  { initials: 'TH', name: 'Tomás Herrera', meta: 'PT-8830 • 53 años', status: 'ESTABLE', transfer: [imgArrowRight, 'Ingreso'], bed: 'Cama H-08', hr: '76', spo2: '97', temp: '36.7°', unit: 'Hospitalización', admittedDaysAgo: 8 },
  { initials: 'VC', name: 'Valeria Castillo', meta: 'PT-8831 • 41 años', status: 'ESTABLE', transfer: [imgCheck, 'Alta'], bed: 'Cama H-12', hr: '70', spo2: '98', temp: '36.5°', unit: 'Hospitalización', admittedDaysAgo: 20 },
  { initials: 'DT', name: 'Diego Torres', meta: 'PT-8832 • 39 años', status: 'MONITOREO', transfer: [imgArrowLeft, 'Salida'], bed: 'Cama C-08', hr: '101', spo2: '93', temp: '37.6°', unit: 'UCI', admittedDaysAgo: 4 },
];

const ALERTS: Array<[string, string, string, string]> = [
  [imgStateIndicator, 'Caída severa de SpO2 < 89%', 'Cama 03', 'Hace 2 min'],
  [imgStateIndicator, 'Taquicardia ventricular detectada', 'Cama 06', 'Hace 5 min'],
  [imgStateIndicator2, 'Fiebre alta registrada 39.1°C', 'Cama 06', 'Hace 12 min'],
  [imgStateIndicator2, 'Presión arterial en límites (140/90)', 'Cama 02', 'Hace 20 min'],
];

const UNIT_OPTIONS = ['Todas', 'UCI', 'Urgencias', 'Hospitalización'];
const STATUS_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'CRÍTICO', label: 'Crítico' },
  { value: 'MONITOREO', label: 'Monitoreo' },
  { value: 'ESTABLE', label: 'Estable' },
];
const RANGE_OPTIONS = [
  { value: '-1', label: 'Cualquier fecha' },
  { value: '0', label: 'Hoy' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
];
const SORT_OPTIONS = [
  { value: 'default', label: 'Todos' },
  { value: 'crit', label: 'Más críticos primero' },
  { value: 'bed', label: 'Por cama' },
  { value: 'name', label: 'Por nombre' },
];

const PAGE_SIZE = 5;
const COLS = 'grid grid-cols-[200px_100px_110px_85px_70px_70px_70px_minmax(30px,1fr)] items-center gap-3';
const stop = (e: SyntheticEvent) => e.stopPropagation();
const icon = (src: string) => <img className="size-3.5 shrink-0" alt="" src={src} />;

function PatientRow({ p }: { p: Patient }) {
  const rowLink = useRowLink();
  const toast = useToast();
  const crit = p.status === 'CRÍTICO';
  return (
    <div
      {...rowLink('/MedPacienteResumen')}
      aria-label={`Ver a ${p.name}`}
      className={cn(
        COLS,
        'p-4',
        p.selected ? 'relative cursor-pointer border-b border-line bg-primary-soft outline-none' : cn('border-b border-line bg-white last:border-b-0', rowLinkClass),
      )}
    >
      {p.selected && <span className="absolute inset-y-0 left-0 w-[3px] bg-primary" />}
      <div className="flex items-center gap-[10px]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-line font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{p.initials}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
          <p className="truncate font-jakarta text-[14px] font-bold text-ink">{p.name}</p>
          <p className="font-jakarta text-[12px] font-normal text-muted">{p.meta}</p>
        </div>
      </div>
      <div>
        <Badge tone={STATUS_TONE[p.status]} size="sm">{p.status}</Badge>
      </div>
      <div className="flex items-center gap-1.5">
        <img className="size-3" alt="" src={p.transfer[0]} />
        <p className="font-jakarta text-[11px] font-bold leading-[normal] text-muted">{p.transfer[1]}</p>
      </div>
      <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{p.bed}</p>
      <p className={cn('font-jakarta text-[13px] leading-[normal]', crit ? 'font-extrabold text-danger' : 'font-bold text-ink')}>{p.hr}</p>
      <p className={cn('font-jakarta text-[13px] leading-[normal]', crit ? 'font-extrabold text-danger' : 'font-bold text-ink')}>{p.spo2}</p>
      <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">{p.temp}</p>
      {/* El menú no debe activar la fila (los eventos del menú suben por el árbol de React). */}
      <div className="flex justify-end" onClick={stop} onKeyDown={stop}>
        <Menu
          label={`Más opciones de ${p.name}`}
          className="-m-1"
          trigger={<img className="size-[18px]" alt="" src={imgMoreHorizontal} />}
          items={[
            { label: 'Ver expediente', to: '/MedPacienteResumen' },
            { label: 'Monitoreo', to: '/MedPacienteMonitoreoDetallado' },
            { label: 'Nueva nota SOAP', to: '/MedPacienteNotasSoapNueva' },
            { label: 'Dar de alta', tone: 'danger', onSelect: () => toast(`Alta registrada · ${p.name}`) },
          ]}
        />
      </div>
    </div>
  );
}

export default function MedPacientesLista() {
  const [unit, setUnit] = useState('Todas');
  const [status, setStatus] = useState('Todos');
  const [range, setRange] = useState('-1');
  const [sort, setSort] = useState('default');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Cualquier cambio de filtro vuelve a la primera página.
  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };
  const days = Number(range);

  const filtered = PATIENTS.filter(
    (p) =>
      (unit === 'Todas' || p.unit === unit) &&
      (status === 'Todos' || p.status === status) &&
      (days < 0 || p.admittedDaysAgo <= days) &&
      matches(query, p.name, p.meta),
  );
  const sorted =
    sort === 'crit'
      ? [...filtered].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])
      : sort === 'bed'
        ? [...filtered].sort((a, b) => a.bed.localeCompare(b.bed))
        : sort === 'name'
          ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'es'))
          : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = () => {
    setUnit('Todas');
    setStatus('Todos');
    setRange('-1');
    setQuery('');
    setPage(1);
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Pacientes"
      title="Gestión de Pacientes"
      actions={
        <Button icon={<IconPlus size={14} />} to="/MedPacienteNuevo">
          Nuevo Paciente
        </Button>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <Select variant="stacked" label="Unidad" options={UNIT_OPTIONS} value={unit} onChange={filter(setUnit)} trailingIcon={icon(imgChevronDown)} />
          <Select variant="stacked" label="Estado" options={STATUS_OPTIONS} value={status} onChange={filter(setStatus)} trailingIcon={icon(imgChevronDown)} />
          <Select
            variant="stacked"
            label="Rango de Admisión"
            options={RANGE_OPTIONS}
            value={range}
            onChange={filter(setRange)}
            trailingIcon={icon(imgCalendar)}
            className="sm:flex-1"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Pacientes Activos" value="8" note="Cupo: 12 camas" />
          <KpiCard label="Estado Crítico" value="2" tone="danger" tint="danger" note="Acción inmediata" />
          <KpiCard label="Alertas Activas" value="5" tone="warning" tint="warning" note="Últimos 15 min" />
          <KpiCard label="Camas Disponibles" value="4 / 12" note="33% libre" />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 xl:flex-row">
          <section className="flex w-full min-w-0 flex-col gap-3 xl:flex-1">
            <div className="flex w-full flex-col gap-1.5 leading-[normal]">
              <h2 className="font-jakarta text-[16px] font-extrabold text-ink">Lista de Pacientes Asignados</h2>
              <p className="font-jakarta text-[13px] font-normal text-muted">Resumen de estado de salud actual para su supervisión.</p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-[10px]">
              <Select variant="soft" options={SORT_OPTIONS} value={sort} onChange={setSort} trailingIcon={icon(imgChevronDown)} ariaLabel="Ordenar pacientes" align="right" />
              <label className="flex w-full max-w-[320px] items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 focus-within:border-primary">
                <img className="size-4 shrink-0" alt="" src={imgSearch} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => filter(setQuery)(e.target.value)}
                  placeholder="Filtrar por nombre o ID..."
                  aria-label="Filtrar por nombre o ID"
                  className="min-w-0 flex-1 bg-transparent font-jakarta text-[13px] font-normal leading-[normal] text-ink outline-none placeholder:text-muted"
                />
              </label>
            </div>
            <Card padding="none" className="w-full overflow-hidden shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)]">
              <Table minWidth={900}>
                <div className={cn(COLS, 'border-b border-line bg-surface px-4 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted')}>
                  <p>PACIENTE</p>
                  <p>ESTADO</p>
                  <p>TRASLADO UCI</p>
                  <p className="normal-case">CAMA</p>
                  <p>FC (LPM)</p>
                  <p>SPO2 (%)</p>
                  <p>TEMP (°C)</p>
                  <p className="text-right">•••</p>
                </div>
                {rows.map((p) => (
                  <PatientRow key={p.name} p={p} />
                ))}
                {rows.length === 0 && <EmptyState onReset={reset} />}
              </Table>
            </Card>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">{`Mostrando ${rows.length} de ${sorted.length} pacientes bajo su cuidado.`}</p>
              <div className="flex gap-[10px]">
                <Button variant="secondary" onClick={() => setPage(Math.max(1, current - 1))} aria-label="Página anterior">
                  Anterior
                </Button>
                <Button variant="secondary" onClick={() => setPage(Math.min(pages, current + 1))} aria-label="Página siguiente">
                  Siguiente
                </Button>
              </div>
            </div>
          </section>

          <Card padding="sm" className="flex w-full min-w-0 flex-col gap-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)] xl:w-[280px] xl:shrink-0 xl:self-stretch">
            <div className="flex w-full items-center justify-between">
              <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Alertas Recientes</h2>
              <Badge tone="danger" size="sm">Hoy</Badge>
            </div>
            <Divider />
            <ul className="flex w-full flex-col gap-3">
              {ALERTS.map(([img, text, bed, when]) => (
                <li key={text}>
                  <Link to="/MedAlertasCentro" className="flex w-full items-start gap-[10px] rounded-md transition-colors hover:bg-surface">
                    <img className="mt-0.5 h-3.5 w-2 shrink-0" alt="" src={img} />
                    <div className="flex min-w-0 flex-1 flex-col gap-px leading-[normal]">
                      <p className="font-jakarta text-[12px] font-bold text-ink">{text}</p>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <p className="font-jakarta font-bold text-primary">{bed}</p>
                        <p className="font-jakarta font-normal text-muted">{when}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
