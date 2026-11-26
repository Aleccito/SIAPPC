// Pantalla "med/monitoreo/lista-uci" (Figma node 127:11) — generada desde el diseño original de Figma.
// Las mismas camas que la vista Grid (GET /monitoring/beds), en filas.
//
// Desde 768 px es una tabla con columnas proporcionales y una sola fila de títulos (con las unidades): cada celda
// lleva solo su valor. Con los anchos fijos de Figma quedaban ~600 px vacíos a 1920 y cada celda repetía "FC",
// "SpO2"… (docs/historial/REVISION-DETALLES.md, A1). En celular, una tarjeta por cama con la etiqueta de cada signo.
import { Fragment, type ReactNode } from 'react';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgBedIcon from '../../assets/bed-icon.svg';
import imgBedIcon2 from '../../assets/bed-icon-2.svg';
import imgBedIcon3 from '../../assets/bed-icon-3.svg';
import imgBedIcon4 from '../../assets/bed-icon-4.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import { AppLayout, Badge, rowLinkClass, Table, useRowLink, useSession } from '../../components';
import { ALL_UNITS, groupByUnit, PatientsWithoutBed, patientsLabel, unitSummary, unitTitle, useUnitBeds, useUnitParam, type BedView } from '../../components/monitor/BedCards';
import { RegistrarExploracion } from '../../components/patient/RegistrarExploracion';
import { vitalTone } from '../../lib/alerts';
import { ageFrom, fmtAgoShort, primerApellido, STATE_LABEL } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { MonitorActions } from '../MedMonitoreoGridUci';

const LEVEL_COLOR = { normal: 'text-success', warning: 'text-warning', danger: 'text-danger' } as const;
const STATE_STYLE = {
  estable: { icon: imgBedIcon, tone: 'success', row: 'bg-white' },
  atencion: { icon: imgBedIcon3, tone: 'warning', row: 'bg-surface' },
  critico: { icon: imgBedIcon2, tone: 'danger', row: 'bg-[#f1f5f9]' },
} as const;

/** Los signos, en el orden de la tabla. La unidad va en el título (tabla) o junto al valor (tarjeta del celular). */
const VITALS = [
  { label: 'FC', unit: 'bpm' },
  { label: 'SpO2', unit: '%' },
  { label: 'P. arterial', unit: 'mmHg' },
  { label: 'Temp', unit: '°C' },
  { label: 'FR', unit: 'rpm' },
  { label: 'GCS', unit: '' },
];

// Cama, paciente, estado, los 6 signos y "actualizado": proporcionales, con un mínimo para que nada se corte.
const COLS =
  'grid grid-cols-[minmax(84px,0.8fr)_minmax(150px,1.8fr)_minmax(100px,1fr)_minmax(64px,0.8fr)_minmax(64px,0.8fr)_minmax(96px,1.1fr)_minmax(64px,0.8fr)_minmax(64px,0.8fr)_minmax(80px,0.9fr)_minmax(88px,0.9fr)] items-center gap-3';

const LEGEND: Array<[string, string]> = [
  [imgStatusPillEllipse, 'Estable'],
  [imgAlertTextEllipse, 'Atención'],
  [imgAlertTextEllipse2, 'Crítico'],
];

const shortName = (name: string) => {
  const first = name.split(/\s+/)[0] ?? '';
  const surname = primerApellido(name);
  return surname !== name ? `${first[0]}. ${surname}` : name;
};

/** Rótulo de cada unidad con la opción "Todas": "UCI · 6 pacientes". */
function GroupTitle({ unit, patients, className }: { unit: string; patients: number; className?: string }) {
  return (
    <p className={cn('font-jakarta text-[13px] font-extrabold leading-[normal] text-ink', className)}>
      {unit} <span className="font-semibold text-muted">{`· ${patientsLabel(patients)}`}</span>
    </p>
  );
}

/** [color, valor] de los 6 signos de la fila. */
function cells(b: BedView): Array<[keyof typeof LEVEL_COLOR, string]> {
  const { hr, spo2, resp } = b.vitals;
  const pa = b.signos?.pa;
  const g = b.glasgow;
  return [
    [vitalTone('hr', hr), String(hr ?? '—')],
    [vitalTone('spo2', spo2), String(spo2 ?? '—')],
    [vitalTone('pa', pa?.sis), pa ? `${pa.sis}/${pa.dia}` : '—'],
    [vitalTone('temp', b.signos?.temp), b.signos ? b.signos.temp.toFixed(1) : '—'],
    [vitalTone('resp', resp), String(resp ?? '—')],
    [g === null ? 'normal' : g <= 8 ? 'danger' : g <= 13 ? 'warning' : 'normal', g === null ? '—' : String(g)],
  ];
}

/** El valor de un signo; el GCS sin registrar lleva a registrar la exploración física (A4). */
function Valor({ b, i, cell, withUnit }: { b: BedView; i: number; cell: [keyof typeof LEVEL_COLOR, string] | undefined; withUnit: boolean }) {
  const v = VITALS[i];
  const gcsPendiente = Boolean(v.label === 'GCS' && cell && b.glasgow === null && b.cedula);
  return (
    <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
      <p className="flex items-baseline gap-1">
        <span className={cn('font-jakarta text-[13px] font-extrabold', cell ? LEVEL_COLOR[cell[0]] : 'text-subtle')}>{cell ? cell[1] : '—'}</span>
        {withUnit && v.unit && <span className="font-jakarta text-[10px] font-semibold text-muted">{v.unit}</span>}
      </p>
      {gcsPendiente && <RegistrarExploracion cedula={b.cedula!} texto="Registrar" className="text-[11px]" />}
    </div>
  );
}

export default function MedMonitoreoListaUci() {
  const rowLink = useRowLink();
  // Sin el expediente (el administrativo), las filas se miran pero no abren nada.
  const opens = useSession().can('historia_clinica', 'ver');
  const [unit, setUnit] = useUnitParam();
  const { beds, units, counts } = useUnitBeds(unit);
  // Con "Todas", un rótulo antes de la primera cama de cada unidad.
  const all = unit === ALL_UNITS;
  const groupStart = new Map(all ? groupByUnit(beds).map((g) => [g.beds[0].id, g] as const) : []);
  const summary = unitSummary(beds, unit);

  const filas = beds.map((b) => {
    const free = !b.state || !b.cedula;
    const style = b.state ? STATE_STYLE[b.state] : null;
    // Las camas ocupadas llevan al expediente. La libre es informativa: asignar camas es de Admisión.
    const rowProps = free || !opens ? {} : { ...rowLink(patientPath('/MedPacienteResumen', b.cedula!)), 'aria-label': `Ver a ${b.patientName}, cama ${b.bed}` };
    return { b, free, style, row: free ? null : cells(b), rowProps, age: ageFrom(b.birthDate) };
  });

  const cama = (f: (typeof filas)[number]): ReactNode => (
    <div className="flex items-center gap-2">
      <img className="size-[18px]" alt="" src={f.style?.icon ?? imgBedIcon4} />
      <p className="whitespace-nowrap font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{f.b.bed}</p>
    </div>
  );
  const paciente = (f: (typeof filas)[number]): ReactNode => (
    <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
      <p className={cn('truncate font-jakarta text-[13px] font-bold', f.free ? 'text-muted' : 'text-ink')}>{f.free ? 'Disponible' : shortName(f.b.patientName ?? '')}</p>
      {!f.free && f.age !== null && <p className="font-jakarta text-[11px] font-medium text-muted">{`${f.age} años`}</p>}
    </div>
  );
  const estado = (f: (typeof filas)[number]): ReactNode => (
    <Badge tone={f.style?.tone ?? 'info'} size="sm">{f.b.state ? STATE_LABEL[f.b.state].toUpperCase() : 'DISPONIBLE'}</Badge>
  );
  const actualizado = (f: (typeof filas)[number]) => (f.free ? '—' : fmtAgoShort(f.b.vitals.at));

  return (
    <AppLayout breadcrumb="SIAPPC > Monitoreo" title={`Central de Monitoreo – ${unitTitle(unit)}`} actions={<MonitorActions unit={unit} units={units} counts={counts} setUnit={setUnit} view="lista" />}>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 bg-white p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4">
          <p className="font-jakarta text-[15px] font-semibold leading-[normal] text-[#374151]">
            Monitoreo activo para <span className="font-extrabold text-primary">{summary.lead}</span>
            {summary.rest}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {LEGEND.map(([dot, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <img className="size-2" alt="" src={dot} />
                <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{label}</p>
              </div>
            ))}
          </div>
          <PatientsWithoutBed />
        </div>

        {/* Desde 768 px: tabla. La caja mide lo que su contenido (antes se estiraba hasta el final de la pantalla). */}
        <div className="hidden w-full overflow-hidden rounded-xl border border-line md:block">
          <Table minWidth={900}>
            <div className={cn(COLS, 'border-b border-line bg-surface px-6 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted')}>
              <p>Cama</p>
              <p>Paciente</p>
              <p>Estado</p>
              {VITALS.map((v) => (
                <p key={v.label} className="whitespace-nowrap">
                  {v.label}
                  {v.unit && <span className="ml-1 font-semibold normal-case text-subtle">{`(${v.unit})`}</span>}
                </p>
              ))}
              <p className="text-right">Actualizado</p>
            </div>
            {filas.map((f) => (
              <Fragment key={f.b.id}>
                {groupStart.has(f.b.id) && <GroupTitle unit={f.b.unit} patients={groupStart.get(f.b.id)!.patients} className="border-b border-line bg-white px-6 py-2.5" />}
                <div {...f.rowProps} className={cn(COLS, 'min-h-[64px] border-b border-line px-6 py-3 last:border-b-0', f.style?.row ?? 'bg-[#f3f4f6]', !f.free && opens && rowLinkClass)}>
                  {cama(f)}
                  {paciente(f)}
                  <div>{estado(f)}</div>
                  {VITALS.map((v, i) => (
                    <Valor key={v.label} b={f.b} i={i} cell={f.row?.[i]} withUnit={false} />
                  ))}
                  <p className="text-right font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{actualizado(f)}</p>
                </div>
              </Fragment>
            ))}
          </Table>
        </div>

        {/* Celular: una tarjeta por cama, con la etiqueta de cada signo. */}
        <ul className="flex w-full flex-col gap-3 md:hidden">
          {filas.map((f) => (
            <Fragment key={f.b.id}>
            {groupStart.has(f.b.id) && (
              <li>
                <GroupTitle unit={f.b.unit} patients={groupStart.get(f.b.id)!.patients} className="pt-2" />
              </li>
            )}
            <li {...f.rowProps} className={cn('flex flex-col gap-3 rounded-xl border border-line p-4', f.style?.row ?? 'bg-[#f3f4f6]', !f.free && opens && rowLinkClass)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {cama(f)}
                  {paciente(f)}
                </div>
                {estado(f)}
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-2">
                {VITALS.map((v, i) => (
                  <div key={v.label} className="flex min-w-0 flex-col gap-0.5">
                    <p className="font-jakarta text-[10px] font-bold uppercase leading-[normal] text-muted">{v.label}</p>
                    <Valor b={f.b} i={i} cell={f.row?.[i]} withUnit />
                  </div>
                ))}
              </div>
              <p className="font-jakarta text-[11px] font-semibold leading-[normal] text-muted">{`Actualizado: ${actualizado(f)}`}</p>
            </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
