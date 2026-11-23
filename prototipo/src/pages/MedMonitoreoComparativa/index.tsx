// Pantalla "med/monitoreo/comparativa" (Figma node 245:895) — generada desde el diseño original de Figma.
import { useState, type ReactNode } from 'react';
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
import { AppLayout, Badge, Button, Divider, LineChart, SearchBox, SegmentedControl, Select, Table, useToast } from '../../components';
import { cn } from '../../lib/cn';

type Kpi = { label: string; value: string; alert?: 'danger' | 'warning' };

/** Paciente de UCI que se puede elegir como A o B (datos de ejemplo). */
type Patient = {
  name: string;
  meta: string;
  avatar?: string;
  status: string;
  tone: 'danger' | 'warning' | 'success';
  kpis: Kpi[];
  note: { time: string; text: string };
  /** Para el resumen métrico. */
  fcAvg: number;
  spo2Min: number;
  alerts: { n: number; kind: 'crítica' | 'preventiva' };
  interventions: number;
};

type Chart = { title: (hours: number) => string; note: string; noteColor: string; chart: (name: string, hours: number) => ReactNode; framed?: boolean };

const KPI_STYLE = { danger: 'bg-danger-soft text-danger', warning: 'bg-warning-soft text-warning' };

const Spark = ({ src }: { src: string }) => <img className="h-[70px] w-full" alt="" src={src} />;

const PressureChart = ({ sys, dia }: { sys: string; dia: string }) => (
  <div className="relative h-[70px] w-full rounded-lg bg-surface p-3">
    <img className="absolute inset-3 h-[46px] w-[calc(100%-24px)]" alt="" src={sys} />
    <img className="absolute inset-3 h-[46px] w-[calc(100%-24px)]" alt="" src={dia} />
  </div>
);

const spo2Chart = (name: string, hours: number) => (
  <LineChart
    width={480}
    height={70}
    label={`Saturación de oxígeno de ${name} en las últimas ${hours} horas`}
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

const fcTitle = (h: number) => `Frecuencia Cardíaca (Últimas ${h}h)`;
const spo2Title = () => 'Saturación Oxígeno (SpO2%)';
const paTitle = () => 'Presión Arterial (Sistólica/Diastólica)';

// Las gráficas son de ejemplo y quedan fijas por columna; al cambiar de paciente
// cambian nombre, cama, estado, signos y nota.
const CHARTS_A: Chart[] = [
  { title: fcTitle, note: 'Rango: 98 - 128 bpm', noteColor: 'text-danger', chart: () => <Spark src={imgSparklineChart} />, framed: true },
  { title: spo2Title, note: 'Alarma < 90%', noteColor: 'text-danger', chart: spo2Chart, framed: true },
  { title: paTitle, note: 'Hipotensión activa', noteColor: 'text-danger', chart: () => <PressureChart sys={imgSparklineChart2} dia={imgSparklineChart3} /> },
];

const CHARTS_B: Chart[] = [
  { title: fcTitle, note: 'Estable ~85-90', noteColor: 'text-success', chart: () => <Spark src={imgSparklineChart4} />, framed: true },
  { title: spo2Title, note: 'Fijado: 92-95%', noteColor: 'text-success', chart: () => <Spark src={imgSparklineChart5} />, framed: true },
  { title: paTitle, note: 'Parámetros estables', noteColor: 'text-success', chart: () => <PressureChart sys={imgSparklineChart6} dia={imgSparklineChart7} /> },
];

const PATIENTS: Patient[] = [
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
    note: { time: '14:30 hrs', text: '"Deterioro hemodinámico progresivo. Se inició vasopresores."' },
    fcAvg: 108,
    spo2Min: 87,
    alerts: { n: 4, kind: 'crítica' },
    interventions: 3,
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
    note: { time: '06:20 hrs', text: '"Glasgow mejoró de 9 a 11. Evaluando retiro de sedación."' },
    fcAvg: 86,
    spo2Min: 92,
    alerts: { n: 1, kind: 'preventiva' },
    interventions: 1,
  },
  {
    name: 'Francisco Díaz',
    meta: 'HC: PT-7410 • UCI Cama C6',
    status: 'Crítico',
    tone: 'danger',
    kpis: [
      { label: 'FC (LPM)', value: '130 ↑', alert: 'danger' },
      { label: 'SpO2 (%)', value: '88% ↓', alert: 'danger' },
      { label: 'PA (mmHg)', value: '85/55', alert: 'danger' },
      { label: 'Temp', value: '38.5°C', alert: 'warning' },
      { label: 'Glasgow', value: '8/15' },
    ],
    note: { time: '07:45 hrs', text: '"Sepsis de foco pulmonar. Se ajustó esquema antibiótico."' },
    fcAvg: 126,
    spo2Min: 86,
    alerts: { n: 5, kind: 'crítica' },
    interventions: 4,
  },
  {
    name: 'Laura Torres',
    meta: 'HC: PT-5127 • UCI Cama B2',
    status: 'Atención',
    tone: 'warning',
    kpis: [
      { label: 'FC (LPM)', value: '95' },
      { label: 'SpO2 (%)', value: '95%', alert: 'warning' },
      { label: 'PA (mmHg)', value: '135/88', alert: 'warning' },
      { label: 'Temp', value: '37.1°C' },
      { label: 'Glasgow', value: '14/15' },
    ],
    note: { time: '09:10 hrs', text: '"Respuesta favorable al diurético. Vigilar presión arterial."' },
    fcAvg: 92,
    spo2Min: 94,
    alerts: { n: 2, kind: 'preventiva' },
    interventions: 2,
  },
  {
    name: 'Alberto Ruiz',
    meta: 'HC: PT-4390 • UCI Cama C4',
    status: 'Estable',
    tone: 'success',
    kpis: [
      { label: 'FC (LPM)', value: '72' },
      { label: 'SpO2 (%)', value: '97%' },
      { label: 'PA (mmHg)', value: '118/75' },
      { label: 'Temp', value: '36.8°C' },
      { label: 'Glasgow', value: '15/15' },
    ],
    note: { time: '08:00 hrs', text: '"Evolución estable. Plan de egreso a sala en 24 h."' },
    fcAvg: 74,
    spo2Min: 96,
    alerts: { n: 0, kind: 'preventiva' },
    interventions: 1,
  },
];

const byName = (name: string) => PATIENTS.find((p) => p.name === name) ?? PATIENTS[0];
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const alertsText = ({ n, kind }: Patient['alerts']) => (n === 0 ? 'Sin alertas' : `${n} ${n === 1 ? 'alerta' : 'alertas'} ${n === 1 ? kind : `${kind}s`}`);
/** "María González" → "María G." */
const shortName = (name: string) => {
  const [first, last = ''] = name.split(' ');
  return `${first} ${last.charAt(0)}.`;
};

const summaryRows = (a: Patient, b: Patient): Array<[string, string, string, string, 'danger' | 'warning' | 'success']> => [
  ['FC promedio', `${a.fcAvg} LPM`, `${b.fcAvg} LPM`, `${signed(a.fcAvg - b.fcAvg)} LPM`, 'danger'],
  ['SpO2 mínimo', `${a.spo2Min}%`, `${b.spo2Min}%`, `${signed(a.spo2Min - b.spo2Min)}%`, 'danger'],
  ['Eventos de alerta (últimas 24h)', alertsText(a.alerts), alertsText(b.alerts), `${signed(a.alerts.n - b.alerts.n)} eventos`, 'warning'],
  [
    'Intervenciones médicas',
    `${a.interventions} ${a.interventions === 1 ? 'indicada' : 'indicadas'}`,
    `${b.interventions} ${b.interventions === 1 ? 'indicada' : 'indicadas'}`,
    `${signed(a.interventions - b.interventions)} interv.`,
    'success',
  ],
];

const PERIODS = [
  { hours: 4, label: 'Últimas 4h' },
  { hours: 12, label: '12h' },
  { hours: 24, label: '24h' },
];

function Avatar({ p }: { p: Patient }) {
  if (p.avatar) return <img className="size-12 shrink-0 rounded-full object-cover" alt="" src={p.avatar} />;
  const initials = p.name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('');
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft font-jakarta text-[15px] font-extrabold leading-[normal] text-primary" aria-hidden="true">
      {initials}
    </span>
  );
}

function PatientColumn({ p, charts, hours }: { p: Patient; charts: Chart[]; hours: number }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-line bg-white p-5 lg:flex-1">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar p={p} />
          <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
            <p className="font-jakarta text-[16px] font-extrabold text-ink">{p.name}</p>
            <p className="font-jakarta text-[12px] font-normal text-muted">{p.meta}</p>
          </div>
        </div>
        <Badge tone={p.tone}>{p.status}</Badge>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 leading-[normal] sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
        {p.kpis.map((k) => (
          <div key={k.label} className={cn('flex min-w-0 flex-col gap-1 rounded-lg p-3', k.alert ? KPI_STYLE[k.alert] : 'bg-surface')}>
            <p className={cn('font-jakarta text-[11px] font-semibold', !k.alert && 'text-muted')}>{k.label}</p>
            <p className={cn('whitespace-nowrap font-jakarta text-[20px] font-extrabold', !k.alert && 'text-ink')}>{k.value}</p>
          </div>
        ))}
      </div>
      <Divider />
      {charts.map((ch) => (
        <div key={ch.note} className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 leading-[normal]">
            <p className="font-jakarta text-[13px] font-bold text-ink">{ch.title(hours)}</p>
            <p className={cn('font-jakarta text-[12px] font-semibold', ch.noteColor)}>{ch.note}</p>
          </div>
          {ch.framed ? <div className="w-full rounded-lg bg-surface p-3">{ch.chart(p.name, hours)}</div> : ch.chart(p.name, hours)}
        </div>
      ))}
      <Divider />
      <div className="flex w-full flex-col gap-1.5 rounded-lg bg-surface p-3 leading-[normal]">
        <div className="flex w-full items-center justify-between text-[11px] text-muted">
          <p className="font-jakarta font-bold">ÚLTIMA NOTA SOAP</p>
          <p className="font-jakarta font-semibold">{p.note.time}</p>
        </div>
        <p className="w-full font-jakarta text-[13px] font-semibold text-ink">{p.note.text}</p>
      </div>
    </div>
  );
}

export default function MedMonitoreoComparativa() {
  const toast = useToast();
  const [nameA, setNameA] = useState(PATIENTS[0].name);
  const [nameB, setNameB] = useState(PATIENTS[1].name);
  const [hours, setHours] = useState(4);
  const a = byName(nameA);
  const b = byName(nameB);
  // Cada lista excluye al paciente que ya está en la otra columna.
  const optionsFor = (other: string) => PATIENTS.filter((p) => p.name !== other).map((p) => p.name);
  const chevron = <img className="size-3 shrink-0" alt="" src={imgChevronDown3} />;

  return (
    <AppLayout
      breadcrumb="SIAPPC > Monitoreo > Comparativa de Pacientes"
      title="Comparativa de Pacientes"
      actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, cama o HC..." width={280} />}
    >
      <div className="flex w-full min-w-0 flex-col gap-6 p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              options={optionsFor(nameB)}
              value={nameA}
              onChange={setNameA}
              format={(l) => `Paciente A: ${l}`}
              icon={<img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse2} />}
              trailingIcon={chevron}
              ariaLabel={`Paciente A: ${nameA}`}
            />
            <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-muted">vs</p>
            <Select
              options={optionsFor(nameA)}
              value={nameB}
              onChange={setNameB}
              format={(l) => `Paciente B: ${l}`}
              icon={<img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse} />}
              trailingIcon={chevron}
              ariaLabel={`Paciente B: ${nameB}`}
            />
            <Button variant="outline" onClick={() => toast('La comparativa admite 2 pacientes; cambia A o B desde su lista', 'info')}>
              + Agregar Paciente
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              label="Periodo"
              items={PERIODS.map((p) => ({ id: String(p.hours), label: p.label }))}
              active={String(hours)}
              onChange={(id) => setHours(Number(id))}
            />
            <Button variant="secondary" icon={<img className="size-3.5" alt="" src={imgDownload} />} onClick={() => toast('Comparativa exportada (PDF)')}>
              Exportar
            </Button>
          </div>
        </div>

        {/* Lado a lado desde 1024 px: es una comparación (REVISION.md, V13). */}
        <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
          <PatientColumn p={a} charts={CHARTS_A} hours={hours} />
          <PatientColumn p={b} charts={CHARTS_B} hours={hours} />
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-line bg-white p-5">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Resumen Métrico Comparativo</h2>
          <div className="w-full overflow-hidden rounded-lg border border-line">
            <Table minWidth={600}>
              <div className="flex w-full items-center border-b border-line bg-surface px-4 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="min-w-[150px] flex-[0_1_280px]">PARÁMETRO</p>
                <p className="min-w-[150px] flex-[0_1_280px]">{`PACIENTE A (${shortName(a.name)})`}</p>
                <p className="min-w-[150px] flex-[0_1_280px]">{`PACIENTE B (${shortName(b.name)})`}</p>
                <p className="min-w-[120px] flex-1">DIFERENCIA / DELTA</p>
              </div>
              {summaryRows(a, b).map(([param, va, vb, delta, tone]) => (
                <div key={param} className="flex w-full items-center border-b border-line px-4 py-[14px] font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0">
                  <p className="min-w-[150px] flex-[0_1_280px] font-bold">{param}</p>
                  <p className="min-w-[150px] flex-[0_1_280px] font-medium">{va}</p>
                  <p className="min-w-[150px] flex-[0_1_280px] font-medium">{vb}</p>
                  <div className="min-w-[120px] flex-1">
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
