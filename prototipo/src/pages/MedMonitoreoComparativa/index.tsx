// Pantalla "med/monitoreo/comparativa" (Figma node 245:895) — generada desde el diseño original de Figma.
// Compara dos de los pacientes asignados: signos de la central, tendencias (src/api/sinBackend.ts:
// el seed solo trae 40 min), alertas agrupadas, última nota SOAP y medicamentos activos del expediente.
import { useRef, useState } from 'react';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import { useExpediente, useSoapNotes } from '../../api/queries';
import { getTendencias, useExtra } from '../../api/sinBackend';
import { AppLayout, Badge, Button, Divider, IconChevronDown, IconDownload, PatientAvatar, SearchBox, SegmentedControl, Select, Table } from '../../components';
import { direccionFc, direccionSpo2, Flecha, type Direccion } from '../../components/ui/Flecha';
import { imprimirElemento } from '../../lib/imprimir';
import { Sparkline } from '../../components/ui/Sparkline';
import { usePatientRows, type PatientRow } from '../../data/patients';
import { vitalTone } from '../../lib/alerts';
import { fmtTime } from '../../lib/clinical';
import { cn } from '../../lib/cn';

const KPI_STYLE = { danger: 'bg-danger-soft text-danger', warning: 'bg-warning-soft text-warning' };

const PERIODS = [
  { hours: 4, label: 'Últimas 4h' },
  { hours: 12, label: '12h' },
  { hours: 24, label: '24h' },
];

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
/** "Ileana Montenegro Sáez" → "Ileana M." */
const shortName = (name: string) => {
  const [first, last = ''] = name.split(' ');
  return `${first} ${last.charAt(0)}.`;
};

type Metrics = { fcAvg: number | null; spo2Min: number | null; alerts: number; critical: boolean; interventions: number };

/** Lo que muestra cada columna y lo que usa el resumen de abajo. */
function usePatientData(p: PatientRow | undefined, hours: number) {
  const trend = useExtra(`tendencias-${hours}`, p?.document, (c) => getTendencias(c, hours, p?.device));
  const notes = useSoapNotes(p?.id);
  const exp = useExpediente(p?.id);
  const points = (trend.data ?? []).filter((x): x is NonNullable<typeof x> => !!x);
  const metrics: Metrics = {
    fcAvg: (() => {
      const hr = points.map((x) => x.hr).filter((v): v is number => v !== null);
      return hr.length ? Math.round(hr.reduce((s, x) => s + x, 0) / hr.length) : null;
    })(),
    spo2Min: (() => {
      const spo2 = points.map((x) => x.spo2).filter((v): v is number => v !== null);
      return spo2.length ? Math.min(...spo2) : null;
    })(),
    alerts: p?.alertGroups.reduce((s, g) => s + g.count, 0) ?? 0,
    critical: !!p?.alertGroups.some((g) => g.severity === 'critica'),
    interventions: (exp.data?.medicamentos ?? []).filter((m) => m.status === 'activo').length,
  };
  return { points, note: notes.data?.find((n) => n.parentId === null), metrics };
}

function PatientColumn({ p, hours }: { p: PatientRow; hours: number }) {
  const { points, note } = usePatientData(p, hours);
  const { hr, spo2 } = p.vitals;
  const pa = p.signos?.pa;
  const tone = (t: string) => (t === 'normal' ? undefined : (t as 'danger' | 'warning'));
  const kpis: Array<{ label: string; value: string; dir?: Direccion; alert?: 'danger' | 'warning' }> = [
    { label: 'FC (LPM)', value: `${hr ?? '—'}`, dir: direccionFc(hr), alert: tone(vitalTone('hr', hr)) },
    { label: 'SpO2 (%)', value: `${spo2 ?? '—'}%`, dir: direccionSpo2(spo2), alert: tone(vitalTone('spo2', spo2)) },
    { label: 'PA (mmHg)', value: pa ? `${pa.sis}/${pa.dia}` : '—', alert: tone(vitalTone('pa', pa?.sis)) },
    { label: 'Temp', value: p.signos ? `${p.signos.temp.toFixed(1)}°C` : '—', alert: tone(vitalTone('temp', p.signos?.temp)) },
    { label: 'Glasgow', value: p.glasgow ? `${p.glasgow}/15` : '—' },
  ];
  // Un tramo sin lectura (null) se salta: no se dibuja como cero.
  const hrValues = points.map((x) => x.hr).filter((v): v is number => v !== null);
  const spo2Values = points.map((x) => x.spo2).filter((v): v is number => v !== null);
  const charts: Array<{ title: string; note: string; color: string; body: React.ReactNode }> = [
    {
      title: `Frecuencia Cardíaca (Últimas ${hours}h)`,
      note: hrValues.length ? `Rango: ${Math.min(...hrValues)} - ${Math.max(...hrValues)} bpm` : '—',
      color: vitalTone('hr', hr) === 'normal' ? 'text-success' : 'text-danger',
      body: <Sparkline values={hrValues} className={cn('h-[70px]', vitalTone('hr', hr) === 'normal' ? 'text-success' : 'text-danger')} />,
    },
    {
      title: 'Saturación Oxígeno (SpO2%)',
      note: vitalTone('spo2', spo2) === 'normal' ? 'En rango' : 'Alarma < 90%',
      color: vitalTone('spo2', spo2) === 'normal' ? 'text-success' : 'text-danger',
      body: <Sparkline values={spo2Values} className="h-[70px] text-warning" />,
    },
    {
      title: 'Presión Arterial (Sistólica/Diastólica)',
      note: pa ? (pa.sis < 90 ? 'Hipotensión activa' : pa.sis > 140 ? 'PA elevada' : 'Parámetros estables') : '—',
      color: pa && (pa.sis < 90 || pa.sis > 140) ? 'text-danger' : 'text-success',
      body: (
        <div className="relative h-[70px] w-full">
          <Sparkline values={points.map((x) => x.sis).filter((v): v is number => v !== null)} className="absolute inset-0 h-[46px] text-[#06B6D4]" />
          <Sparkline values={points.map((x) => x.dia).filter((v): v is number => v !== null)} className="absolute inset-x-0 bottom-0 h-[46px] text-[#8B5CF6]" />
        </div>
      ),
    },
  ];
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-line bg-white p-5 lg:flex-1">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar name={p.name} size={48} />
          <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
            <p className="font-jakarta text-[16px] font-extrabold text-ink">{p.name}</p>
            <p className="font-jakarta text-[12px] font-normal text-muted">{`HC: ${p.document} • ${p.unit ?? ''} Cama ${p.bed ?? '—'}`}</p>
          </div>
        </div>
        <Badge tone={p.tone}>{p.stateLabel}</Badge>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 leading-[normal] sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={cn('flex min-w-0 flex-col gap-1 rounded-lg p-3', k.alert ? KPI_STYLE[k.alert] : 'bg-surface')}>
            <p className={cn('font-jakarta text-[11px] font-semibold', !k.alert && 'text-muted')}>{k.label}</p>
            <p className={cn('flex items-center gap-1 whitespace-nowrap font-jakarta text-[20px] font-extrabold', !k.alert && 'text-ink')}>
              {k.value}
              <Flecha dir={k.dir ?? null} size={16} />
            </p>
          </div>
        ))}
      </div>
      <Divider />
      {charts.map((ch) => (
        <div key={ch.title} className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 leading-[normal]">
            <p className="font-jakarta text-[13px] font-bold text-ink">{ch.title}</p>
            <p className={cn('font-jakarta text-[12px] font-semibold', ch.color)}>{ch.note}</p>
          </div>
          <div className="w-full rounded-lg bg-surface p-3">{ch.body}</div>
        </div>
      ))}
      <Divider />
      <div className="flex w-full flex-col gap-1.5 rounded-lg bg-surface p-3 leading-[normal]">
        <div className="flex w-full items-center justify-between text-[11px] text-muted">
          <p className="font-jakarta font-bold">ÚLTIMA NOTA SOAP</p>
          <p className="font-jakarta font-semibold">{note ? `${fmtTime(note.at)} hrs` : '—'}</p>
        </div>
        <p className="w-full font-jakarta text-[13px] font-semibold text-ink">{note ? `"${note.assessment ?? note.subjective ?? ''}"` : 'Sin notas SOAP.'}</p>
      </div>
    </div>
  );
}

export default function MedMonitoreoComparativa() {
  const comparativa = useRef<HTMLDivElement>(null);
  const { rows } = usePatientRows();
  const [nameA, setNameA] = useState<string | null>(null);
  const [nameB, setNameB] = useState<string | null>(null);
  const [hours, setHours] = useState(4);
  // Arranca con el más grave contra el primero que no es crítico.
  const a = rows.find((r) => r.name === nameA) ?? rows[0];
  const b = rows.find((r) => r.name === nameB) ?? rows.find((r) => r !== a && r.state !== 'critico') ?? rows[1];
  const ma = usePatientData(a, hours).metrics;
  const mb = usePatientData(b, hours).metrics;
  // Cada lista excluye al paciente que ya está en la otra columna.
  const optionsFor = (other: PatientRow | undefined) => rows.filter((p) => p !== other).map((p) => p.name);
  const chevron = <IconChevronDown size={12} className="text-muted" />;
  const alertsText = (m: Metrics) => (m.alerts === 0 ? 'Sin alertas' : `${m.alerts} ${m.alerts === 1 ? 'alerta' : 'alertas'} ${m.critical ? 'críticas' : 'preventivas'}`);

  const summary: Array<[string, string, string, string, 'danger' | 'warning' | 'success']> =
    a && b
      ? [
          ['FC promedio', `${ma.fcAvg ?? '—'} LPM`, `${mb.fcAvg ?? '—'} LPM`, `${signed((ma.fcAvg ?? 0) - (mb.fcAvg ?? 0))} LPM`, 'danger'],
          ['SpO2 mínimo', `${ma.spo2Min ?? '—'}%`, `${mb.spo2Min ?? '—'}%`, `${signed((ma.spo2Min ?? 0) - (mb.spo2Min ?? 0))}%`, 'danger'],
          ['Eventos de alerta (últimos 40 min)', alertsText(ma), alertsText(mb), `${signed(ma.alerts - mb.alerts)} eventos`, 'warning'],
          ['Medicamentos activos', `${ma.interventions} indicados`, `${mb.interventions} indicados`, `${signed(ma.interventions - mb.interventions)} interv.`, 'success'],
        ]
      : [];

  return (
    <AppLayout breadcrumb="SIAPPC > Monitoreo > Comparativa de Pacientes" title="Comparativa de Pacientes" actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, cama o HC..." width={280} />}>
      <div className="flex w-full min-w-0 flex-col gap-6 p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              options={optionsFor(b)}
              value={a?.name ?? ''}
              onChange={setNameA}
              format={(l) => `Paciente A: ${l}`}
              icon={<img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse2} />}
              trailingIcon={chevron}
              ariaLabel={`Paciente A: ${a?.name ?? ''}`}
            />
            <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-muted">vs</p>
            <Select
              options={optionsFor(a)}
              value={b?.name ?? ''}
              onChange={setNameB}
              format={(l) => `Paciente B: ${l}`}
              icon={<img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse} />}
              trailingIcon={chevron}
              ariaLabel={`Paciente B: ${b?.name ?? ''}`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl label="Periodo" items={PERIODS.map((p) => ({ id: String(p.hours), label: p.label }))} active={String(hours)} onChange={(id) => setHours(Number(id))} />
            {/* Imprime la comparativa (o la guarda en PDF desde el navegador). */}
            <Button variant="secondary" icon={<IconDownload size={14} />} onClick={() => imprimirElemento(comparativa.current, 'Comparativa de pacientes')}>
              Exportar
            </Button>
          </div>
        </div>

        {/* Lado a lado desde 1024 px: es una comparación (REVISION.md, V13). */}
        <div ref={comparativa} className="flex w-full flex-col items-start gap-5 lg:flex-row">
          {a && <PatientColumn p={a} hours={hours} />}
          {b && <PatientColumn p={b} hours={hours} />}
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-line bg-white p-5">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Resumen Métrico Comparativo</h2>
          <div className="w-full overflow-hidden rounded-lg border border-line">
            <Table minWidth={600}>
              <div className="flex w-full items-center border-b border-line bg-surface px-4 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="min-w-[150px] flex-[0_1_280px]">PARÁMETRO</p>
                <p className="min-w-[150px] flex-[0_1_280px]">{`PACIENTE A (${a ? shortName(a.name) : '—'})`}</p>
                <p className="min-w-[150px] flex-[0_1_280px]">{`PACIENTE B (${b ? shortName(b.name) : '—'})`}</p>
                <p className="min-w-[120px] flex-1">DIFERENCIA / DELTA</p>
              </div>
              {summary.map(([param, va, vb, delta, tone]) => (
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
