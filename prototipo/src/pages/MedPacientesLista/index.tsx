// Pantalla "med/pacientes/lista" (Figma node 45:79) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
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
import { AppLayout, Badge, Button, Card, Divider, IconPlus, KpiCard, Table } from '../../components';
import { cn } from '../../lib/cn';

type Patient = {
  initials: string;
  name: string;
  meta: string;
  status: 'CRÍTICO' | 'MONITOREO' | 'ESTABLE';
  transfer: [string, string];
  bed: string;
  hr: string;
  spo2: string;
  temp: string;
  selected?: boolean;
};

const STATUS_TONE = { CRÍTICO: 'danger', MONITOREO: 'warning', ESTABLE: 'success' } as const;

const PATIENTS: Patient[] = [
  { initials: 'ER', name: 'Elena Rodríguez', meta: 'PT-8821 • 64 años', status: 'CRÍTICO', transfer: [imgArrowRight, 'Ingreso'], bed: 'Cama C-03', hr: '112', spo2: '89', temp: '38.2°' },
  { initials: 'JM', name: 'Javier Mendoza', meta: 'PT-8822 • 45 años', status: 'MONITOREO', transfer: [imgArrowLeft, 'Salida'], bed: 'Cama C-07', hr: '88', spo2: '96', temp: '37.1°', selected: true },
  { initials: 'SM', name: 'Sofía Martínez', meta: 'PT-8823 • 29 años', status: 'ESTABLE', transfer: [imgCheck, 'Alta'], bed: 'Cama C-02', hr: '72', spo2: '99', temp: '36.6°' },
  { initials: 'RG', name: 'Ricardo Gómez', meta: 'PT-8824 • 72 años', status: 'CRÍTICO', transfer: [imgAlertTriangle, 'Urgente'], bed: 'Cama C-01', hr: '105', spo2: '91', temp: '37.8°' },
  { initials: 'LF', name: 'Lucía Fernández', meta: 'PT-8825 • 53 años', status: 'ESTABLE', transfer: [imgArrowUpRight, 'Traslado'], bed: 'Cama C-05', hr: '68', spo2: '98', temp: '36.8°' },
];

const ALERTS: Array<[string, string, string, string]> = [
  [imgStateIndicator, 'Caída severa de SpO2 < 89%', 'Cama 03', 'Hace 2 min'],
  [imgStateIndicator, 'Taquicardia ventricular detectada', 'Cama 06', 'Hace 5 min'],
  [imgStateIndicator2, 'Fiebre alta registrada 39.1°C', 'Cama 06', 'Hace 12 min'],
  [imgStateIndicator2, 'Presión arterial en límites (140/90)', 'Cama 02', 'Hace 20 min'],
];

function FilterBox({ label, value, icon, grow }: { label: string; value: string; icon: string; grow?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2', grow && 'sm:flex-1')}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 font-jakarta font-semibold leading-[normal]">
        <p className="text-[10px] uppercase text-muted">{label}</p>
        <p className="text-[13px] text-ink">{value}</p>
      </div>
      <img className="size-3.5 shrink-0" alt="" src={icon} />
    </div>
  );
}

const COLS = 'grid grid-cols-[200px_100px_110px_85px_70px_70px_70px_minmax(30px,1fr)] items-center gap-3';

function PatientRow({ p }: { p: Patient }) {
  const crit = p.status === 'CRÍTICO';
  const cells: ReactNode = (
    <>
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
      <div className="flex justify-end">
        <img className="size-[18px]" alt="Más opciones" src={imgMoreHorizontal} />
      </div>
    </>
  );
  return p.selected ? (
    <Link to="/MedPacienteResumen" className={cn(COLS, 'relative border-b border-line bg-primary-soft p-4')}>
      <span className="absolute inset-y-0 left-0 w-[3px] bg-primary" />
      {cells}
    </Link>
  ) : (
    <div className={cn(COLS, 'border-b border-line bg-white p-4 last:border-b-0')}>{cells}</div>
  );
}

export default function MedPacientesLista() {
  return (
    <AppLayout breadcrumb="SIAPPC > Pacientes" title="Gestión de Pacientes" actions={<Button icon={<IconPlus size={14} />}>Nuevo Paciente</Button>}>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <FilterBox label="Unidad" value="Todas" icon={imgChevronDown} />
          <FilterBox label="Estado" value="Todos" icon={imgChevronDown} />
          <FilterBox label="Rango de Admisión" value="Cualquier fecha" icon={imgCalendar} grow />
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
              <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-[10px] py-2">
                <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">Todos</p>
                <img className="size-3.5" alt="" src={imgChevronDown} />
              </div>
              <div className="flex w-full max-w-[320px] items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
                <img className="size-4 shrink-0" alt="" src={imgSearch} />
                <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal] text-muted">Filtrar por nombre o ID...</p>
              </div>
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
                {PATIENTS.map((p) => (
                  <PatientRow key={p.name} p={p} />
                ))}
              </Table>
            </Card>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">Mostrando 5 de 12 pacientes bajo su cuidado.</p>
              <div className="flex gap-[10px]">
                <Button variant="secondary">Anterior</Button>
                <Button variant="secondary">Siguiente</Button>
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
              {ALERTS.map(([icon, text, bed, when]) => (
                <li key={text} className="flex w-full items-start gap-[10px]">
                  <img className="mt-0.5 h-3.5 w-2 shrink-0" alt="" src={icon} />
                  <div className="flex min-w-0 flex-1 flex-col gap-px leading-[normal]">
                    <p className="font-jakarta text-[12px] font-bold text-ink">{text}</p>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <p className="font-jakarta font-bold text-primary">{bed}</p>
                      <p className="font-jakarta font-normal text-muted">{when}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
