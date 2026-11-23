// Pantalla "med/monitoreo/comparativa" (Figma node 245:895) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAvatarBPng from '../../assets/avatar-b.png';
import imgChevronDown3 from '../../assets/chevron-down-3.svg';
import imgDownload from '../../assets/download.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgPatientAvatar7Png from '../../assets/patient-avatar-7.png';
import imgSparklineChart from '../../assets/sparkline-chart.svg';
import imgSparklineChart2 from '../../assets/sparkline-chart-2.svg';
import imgSparklineChart3 from '../../assets/sparkline-chart-3.svg';
import imgSparklineChart4 from '../../assets/sparkline-chart-4.svg';
import imgSparklineChart5 from '../../assets/sparkline-chart-5.svg';
import imgSparklineChart6 from '../../assets/sparkline-chart-6.svg';
import imgSparklineChart7 from '../../assets/sparkline-chart-7.svg';
import imgThresholdLinePng from '../../assets/threshold-line.png';
import { AppLayout, Badge, Button, Divider, LineChart, SearchBox, Table } from '../../components';
import { cn } from '../../lib/cn';

type Kpi = { label: string; value: string; alert?: 'danger' | 'warning' };
type Column = {
  name: string;
  meta: string;
  avatar: string;
  status: string;
  tone: 'danger' | 'warning';
  kpis: Kpi[];
  charts: Array<{ title: string; note: string; noteColor: string; chart: ReactNode; framed?: boolean }>;
  note: { time: string; text: string };
};

const KPI_STYLE = { danger: 'bg-danger-soft text-danger', warning: 'bg-warning-soft text-warning' };

const Spark = ({ src }: { src: string }) => <img className="h-[70px] w-full" alt="" src={src} />;

const PressureChart = ({ sys, dia }: { sys: string; dia: string }) => (
  <div className="relative h-[70px] w-full rounded-lg bg-surface p-3">
    <img className="absolute inset-3 h-[46px] w-[calc(100%-24px)]" alt="" src={sys} />
    <img className="absolute inset-3 h-[46px] w-[calc(100%-24px)]" alt="" src={dia} />
  </div>
);

const SPO2_A = (
  <LineChart
    width={480}
    height={70}
    label="Saturación de oxígeno de María González en las últimas 4 horas"
    limits={[{ y: 35, src: imgThresholdLinePng }]}
    series={[
      {
        color: '#F59E0B',
        strokeWidth: 2,
        marker: imgDropdownBadgeEllipse2,
        markerSize: 6,
        points: [[10, 12], [90, 15], [170, 24], [250, 32], [330, 48], [410, 52], [470, 60]],
      },
    ]}
  />
);

const COLUMNS: Column[] = [
  {
    name: 'María González',
    meta: 'HC: PT-8821 • UCI Cama D3',
    avatar: imgPatientAvatar7Png,
    status: 'Crítico',
    tone: 'danger',
    kpis: [
      { label: 'FC (LPM)', value: '112 ↑', alert: 'danger' },
      { label: 'SpO2 (%)', value: '89% ↓', alert: 'danger' },
      { label: 'PA (mmHg)', value: '85/50', alert: 'danger' },
      { label: 'Temp', value: '37.8°C' },
      { label: 'Glasgow', value: '9/15' },
    ],
    charts: [
      { title: 'Frecuencia Cardíaca (Últimas 4h)', note: 'Rango: 98 - 128 bpm', noteColor: 'text-danger', chart: <Spark src={imgSparklineChart} />, framed: true },
      { title: 'Saturación Oxígeno (SpO2%)', note: 'Alarma < 90%', noteColor: 'text-danger', chart: SPO2_A, framed: true },
      { title: 'Presión Arterial (Sistólica/Diastólica)', note: 'Hipotensión activa', noteColor: 'text-danger', chart: <PressureChart sys={imgSparklineChart2} dia={imgSparklineChart3} /> },
    ],
    note: { time: '14:30 hrs', text: '"Deterioro hemodinámico progresivo. Se inició vasopresores."' },
  },
  {
    name: 'Juan García',
    meta: 'HC: PT-6632 • UCI Cama C5',
    avatar: imgAvatarBPng,
    status: 'Atención',
    tone: 'warning',
    kpis: [
      { label: 'FC (LPM)', value: '88' },
      { label: 'SpO2 (%)', value: '94%', alert: 'warning' },
      { label: 'PA (mmHg)', value: '110/70' },
      { label: 'Temp', value: '36.5°C' },
      { label: 'Glasgow', value: '11/15' },
    ],
    charts: [
      { title: 'Frecuencia Cardíaca (Últimas 4h)', note: 'Estable ~85-90', noteColor: 'text-success', chart: <Spark src={imgSparklineChart4} />, framed: true },
      { title: 'Saturación Oxígeno (SpO2%)', note: 'Fijado: 92-95%', noteColor: 'text-success', chart: <Spark src={imgSparklineChart5} />, framed: true },
      { title: 'Presión Arterial (Sistólica/Diastólica)', note: 'Parámetros estables', noteColor: 'text-success', chart: <PressureChart sys={imgSparklineChart6} dia={imgSparklineChart7} /> },
    ],
    note: { time: '06:20 hrs', text: '"Glasgow mejoró de 9 a 11. Evaluando retiro de sedación."' },
  },
];

const SUMMARY: Array<[string, string, string, string, 'danger' | 'warning' | 'success']> = [
  ['FC promedio', '108 LPM', '86 LPM', '+22 LPM', 'danger'],
  ['SpO2 mínimo', '87%', '92%', '-5%', 'danger'],
  ['Eventos de alerta (últimas 24h)', '4 alertas críticas', '1 alerta preventiva', '+3 eventos', 'warning'],
  ['Intervenciones médicas', '3 indicadas', '1 indicada', '+2 interv.', 'success'],
];

function PatientPicker({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
      <img className="size-2 shrink-0" alt="" src={dot} />
      <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{label}</p>
      <img className="size-3 shrink-0" alt="" src={imgChevronDown3} />
    </div>
  );
}

function PatientColumn({ c }: { c: Column }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-line bg-white p-5 xl:flex-1">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img className="size-12 shrink-0 rounded-full object-cover" alt="" src={c.avatar} />
          <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
            <p className="font-jakarta text-[16px] font-extrabold text-ink">{c.name}</p>
            <p className="font-jakarta text-[12px] font-normal text-muted">{c.meta}</p>
          </div>
        </div>
        <Badge tone={c.tone}>{c.status}</Badge>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 leading-[normal] sm:grid-cols-5">
        {c.kpis.map((k) => (
          <div key={k.label} className={cn('flex min-w-0 flex-col gap-1 rounded-lg p-3', k.alert ? KPI_STYLE[k.alert] : 'bg-surface')}>
            <p className={cn('font-jakarta text-[11px] font-semibold', !k.alert && 'text-muted')}>{k.label}</p>
            <p className={cn('whitespace-nowrap font-jakarta text-[20px] font-extrabold', !k.alert && 'text-ink')}>{k.value}</p>
          </div>
        ))}
      </div>
      <Divider />
      {c.charts.map((ch) => (
        <div key={ch.title} className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 leading-[normal]">
            <p className="font-jakarta text-[13px] font-bold text-ink">{ch.title}</p>
            <p className={cn('font-jakarta text-[12px] font-semibold', ch.noteColor)}>{ch.note}</p>
          </div>
          {ch.framed ? <div className="w-full rounded-lg bg-surface p-3">{ch.chart}</div> : ch.chart}
        </div>
      ))}
      <Divider />
      <div className="flex w-full flex-col gap-1.5 rounded-lg bg-surface p-3 leading-[normal]">
        <div className="flex w-full items-center justify-between text-[11px] text-muted">
          <p className="font-jakarta font-bold">ÚLTIMA NOTA SOAP</p>
          <p className="font-jakarta font-semibold">{c.note.time}</p>
        </div>
        <p className="w-full font-jakarta text-[13px] font-semibold text-ink">{c.note.text}</p>
      </div>
    </div>
  );
}

export default function MedMonitoreoComparativa() {
  return (
    <AppLayout
      breadcrumb="SIAPPC > Monitoreo > Comparativa de Pacientes"
      title="Comparativa de Pacientes"
      actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, cama o HC..." width={280} />}
    >
      <div className="flex w-full min-w-0 flex-col gap-6 p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <PatientPicker dot={imgAlertTextEllipse2} label="Paciente A: María González" />
            <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-muted">vs</p>
            <PatientPicker dot={imgAlertTextEllipse} label="Paciente B: Juan García" />
            <Button variant="outline">+ Agregar Paciente</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-0.5 rounded-lg bg-surface p-1" role="group" aria-label="Periodo">
              {['Últimas 4h', '12h', '24h'].map((p, i) => (
                <span
                  key={p}
                  className={cn('rounded-md px-3 py-1.5 font-jakarta text-[12px] leading-[normal]', i === 0 ? 'bg-white font-bold text-ink' : 'font-medium text-muted')}
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  {p}
                </span>
              ))}
            </div>
            <Button variant="secondary" icon={<img className="size-3.5" alt="" src={imgDownload} />}>
              Exportar
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
          {COLUMNS.map((c) => (
            <PatientColumn key={c.name} c={c} />
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-line bg-white p-5">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Resumen Métrico Comparativo</h2>
          <div className="w-full overflow-hidden rounded-lg border border-line">
            <Table minWidth={960}>
              <div className="flex w-full items-center border-b border-line bg-surface px-4 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="w-[280px] shrink-0">PARÁMETRO</p>
                <p className="w-[280px] shrink-0">PACIENTE A (MARÍA G.)</p>
                <p className="w-[280px] shrink-0">PACIENTE B (JUAN G.)</p>
                <p className="min-w-0 flex-1">DIFERENCIA / DELTA</p>
              </div>
              {SUMMARY.map(([param, a, b, delta, tone]) => (
                <div key={param} className="flex w-full items-center border-b border-line px-4 py-[14px] font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0">
                  <p className="w-[280px] shrink-0 font-bold">{param}</p>
                  <p className="w-[280px] shrink-0 font-medium">{a}</p>
                  <p className="w-[280px] shrink-0 font-medium">{b}</p>
                  <div className="min-w-0 flex-1">
                    <Badge tone={tone}>{delta}</Badge>
                  </div>
                </div>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
