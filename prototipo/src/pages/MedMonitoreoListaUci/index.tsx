// Pantalla "med/monitoreo/lista-uci" (Figma node 127:11) — generada desde el diseño original de Figma.
// Las mismas camas que la vista Grid (GET /monitoring/beds), en filas.
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgBedIcon from '../../assets/bed-icon.svg';
import imgBedIcon2 from '../../assets/bed-icon-2.svg';
import imgBedIcon3 from '../../assets/bed-icon-3.svg';
import imgBedIcon4 from '../../assets/bed-icon-4.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import { AppLayout, Badge, rowLinkClass, Table, useRowLink, useSession } from '../../components';
import { unitSummary, useUnitBeds, useUnitParam, type BedView } from '../../components/monitor/BedCards';
import { vitalTone } from '../../lib/alerts';
import { ageFrom, fmtAgoShort, STATE_LABEL } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { MonitorActions } from '../MedMonitoreoGridUci';

const LEVEL_COLOR = { normal: 'text-success', warning: 'text-warning', danger: 'text-danger' } as const;
const STATE_STYLE = {
  estable: { icon: imgBedIcon, tone: 'success', row: 'bg-white' },
  atencion: { icon: imgBedIcon3, tone: 'warning', row: 'bg-surface' },
  critico: { icon: imgBedIcon2, tone: 'danger', row: 'bg-[#f1f5f9]' },
} as const;

const VITALS = [
  { label: 'FC', unit: 'bpm', width: 'w-[70px]' },
  { label: 'SpO2', unit: '%', width: 'w-[70px]' },
  { label: 'P. ARTERIAL', unit: 'mmHg', width: 'w-[110px]' },
  { label: 'TEMP', unit: '°C', width: 'w-[70px]' },
  { label: 'FR', unit: 'rpm', width: 'w-[70px]' },
  { label: 'GCS', unit: '', width: 'w-[60px]' },
];

const LEGEND: Array<[string, string]> = [
  [imgStatusPillEllipse, 'Estable'],
  [imgAlertTextEllipse, 'Atención'],
  [imgAlertTextEllipse2, 'Crítico'],
];

const shortName = (name: string) => {
  const [first, surname] = name.split(/\s+/);
  return surname ? `${first[0]}. ${surname}` : name;
};

/** [color, valor] de los 6 signos de la fila. */
function cells(b: BedView): Array<[keyof typeof LEVEL_COLOR, string]> {
  const { hr, spo2, resp } = b.vitals;
  const pa = b.signos?.pa;
  const g = b.glasgow;
  return [
    [vitalTone('hr', hr), String(hr ?? '-')],
    [vitalTone('spo2', spo2), String(spo2 ?? '-')],
    [vitalTone('pa', pa?.sis), pa ? `${pa.sis}/${pa.dia}` : '-'],
    [vitalTone('temp', b.signos?.temp), b.signos ? b.signos.temp.toFixed(1) : '-'],
    [vitalTone('resp', resp), String(resp ?? '-')],
    [g === null ? 'normal' : g <= 8 ? 'danger' : g <= 13 ? 'warning' : 'normal', g === null ? '-' : String(g)],
  ];
}

export default function MedMonitoreoListaUci() {
  const rowLink = useRowLink();
  // Sin el expediente (el administrativo), las filas se miran pero no abren nada.
  const opens = useSession().can('historia_clinica', 'ver');
  const [unit, setUnit] = useUnitParam();
  const { beds, units } = useUnitBeds(unit);
  const summary = unitSummary(beds, unit);

  return (
    <AppLayout breadcrumb="SIAPPC > Monitoreo" title={`Central de Monitoreo – ${unit}`} actions={<MonitorActions unit={unit} units={units} setUnit={setUnit} view="lista" />}>
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
        </div>

        <div className="w-full flex-1 overflow-hidden rounded-xl border border-line">
          <Table minWidth={1020}>
            <div className="flex w-full items-center gap-4 border-b border-line bg-surface px-6 py-3 font-jakarta font-bold leading-[normal] text-muted">
              <p className="w-[60px] shrink-0 text-center text-[11px]">CAMA</p>
              <p className="w-[140px] shrink-0 text-[11px]">PACIENTE</p>
              <p className="w-[90px] shrink-0 text-[11px]">ESTADO</p>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <p className="w-full text-center text-[11px]">SIGNOS VITALES / TELEMETRÍA EN TIEMPO REAL</p>
                <div className="flex w-full items-center gap-4 text-[10px]">
                  {VITALS.map((v) => (
                    <p key={v.label} className={cn(v.width, 'shrink-0 text-center')}>
                      {v.label}
                    </p>
                  ))}
                  <p className="w-[84px] shrink-0 font-semibold">ACTUALIZADO</p>
                </div>
              </div>
            </div>
            {beds.map((b) => {
              const free = !b.state || !b.cedula;
              const style = b.state ? STATE_STYLE[b.state] : null;
              const row = free ? null : cells(b);
              // Las camas ocupadas llevan al expediente. La libre es informativa: asignar camas es de Admisión.
              const rowProps = free || !opens ? {} : { ...rowLink(patientPath('/MedPacienteResumen', b.cedula!)), 'aria-label': `Ver a ${b.patientName}, cama ${b.bed}` };
              const age = ageFrom(b.birthDate);
              return (
                <div key={b.id} {...rowProps} className={cn('flex min-h-[72px] w-full items-center gap-4 border-b border-line px-6 py-3 last:border-b-0', style?.row ?? 'bg-[#f3f4f6]', !free && opens && rowLinkClass)}>
                  <div className="flex w-[60px] shrink-0 items-center gap-2">
                    <img className="size-[18px]" alt="" src={style?.icon ?? imgBedIcon4} />
                    <p className="whitespace-nowrap font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{b.bed}</p>
                  </div>
                  <div className="flex w-[140px] shrink-0 flex-col gap-0.5 leading-[normal]">
                    <p className={cn('truncate font-jakarta text-[12px] font-bold', free ? 'text-muted' : 'text-ink')}>{free ? 'Disponible' : shortName(b.patientName ?? '')}</p>
                    {!free && age !== null && <p className="font-jakarta text-[11px] font-medium text-muted">{`${age} años`}</p>}
                  </div>
                  <div className="w-[90px] shrink-0">
                    <Badge tone={style?.tone ?? 'info'} size="sm">{b.state ? STATE_LABEL[b.state].toUpperCase() : 'DISPONIBLE'}</Badge>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {VITALS.map((v, i) => {
                      const cell = row?.[i];
                      return (
                        <div key={v.label} className={cn(v.width, 'flex shrink-0 flex-col gap-0.5 leading-[normal]')}>
                          <p className="font-jakarta text-[10px] font-bold text-muted">{v.label}</p>
                          <p className="flex items-baseline gap-1">
                            <span className={cn('font-jakarta text-[12px] font-extrabold', cell ? LEVEL_COLOR[cell[0]] : 'text-subtle')}>{cell ? cell[1] : '-'}</span>
                            {v.unit && <span className="font-jakarta text-[10px] font-semibold text-muted">{v.unit}</span>}
                          </p>
                        </div>
                      );
                    })}
                    <div className="flex w-[84px] shrink-0 flex-col items-end gap-0.5 text-right font-jakarta font-semibold leading-[normal]">
                      <p className="w-full text-[10px] text-subtle">ACTUALIZADO</p>
                      <p className="w-full text-[11px] text-muted">{free ? '-' : fmtAgoShort(b.vitals.at)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
