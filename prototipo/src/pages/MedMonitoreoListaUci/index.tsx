// Pantalla "med/monitoreo/lista-uci" (Figma node 127:11) — generada desde el diseño original de Figma.
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgBedIcon from '../../assets/bed-icon.svg';
import imgBedIcon2 from '../../assets/bed-icon-2.svg';
import imgBedIcon3 from '../../assets/bed-icon-3.svg';
import imgBedIcon4 from '../../assets/bed-icon-4.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import { AppLayout, Badge, rowLinkClass, SegmentedControl, Table, useRowLink } from '../../components';
import { cn } from '../../lib/cn';

type Level = 'ok' | 'warn' | 'crit';
const LEVEL_COLOR: Record<Level, string> = { ok: 'text-success', warn: 'text-warning', crit: 'text-danger' };

type Bed = {
  bed: string;
  icon: string;
  name: string;
  age?: string;
  status: 'ESTABLE' | 'CRÍTICO' | 'MONITOREO' | 'DISPONIBLE';
  rowBg: string;
  vitals?: [Level, string][]; // FC, SpO2, PA, Temp, FR, GCS
  updated: string;
};

const STATUS_TONE = { ESTABLE: 'success', CRÍTICO: 'danger', MONITOREO: 'warning', DISPONIBLE: 'info' } as const;

const VITALS = [
  { label: 'FC', unit: 'bpm', width: 'w-[70px]' },
  { label: 'SpO2', unit: '%', width: 'w-[70px]' },
  { label: 'P. ARTERIAL', unit: 'mmHg', width: 'w-[110px]' },
  { label: 'TEMP', unit: '°C', width: 'w-[70px]' },
  { label: 'FR', unit: 'rpm', width: 'w-[70px]' },
  { label: 'GCS', unit: '', width: 'w-[60px]' },
];

const BEDS: Bed[] = [
  { bed: 'C-01', icon: imgBedIcon, name: 'R. López', age: '64 años', status: 'ESTABLE', rowBg: 'bg-white', vitals: [['ok', '78'], ['ok', '98'], ['ok', '120/80'], ['ok', '36.5'], ['ok', '16'], ['ok', '15']], updated: 'hace 5min' },
  { bed: 'C-02', icon: imgBedIcon2, name: 'M. García', age: '72 años', status: 'CRÍTICO', rowBg: 'bg-[#f1f5f9]', vitals: [['crit', '125'], ['crit', '89'], ['crit', '90/60'], ['warn', '38.2'], ['crit', '28'], ['crit', '10']], updated: 'hace 12min' },
  { bed: 'C-03', icon: imgBedIcon2, name: 'M. González', age: '67 años', status: 'CRÍTICO', rowBg: 'bg-surface', vitals: [['warn', '112'], ['warn', '93'], ['warn', '145/92'], ['warn', '37.8'], ['warn', '22'], ['warn', '12']], updated: 'hace 3seg' },
  { bed: 'C-04', icon: imgBedIcon, name: 'A. Ruiz', age: '45 años', status: 'ESTABLE', rowBg: 'bg-white', vitals: [['ok', '72'], ['ok', '97'], ['ok', '118/75'], ['ok', '36.8'], ['ok', '14'], ['ok', '15']], updated: 'hace 8min' },
  { bed: 'C-05', icon: imgBedIcon3, name: 'L. Torres', age: '58 años', status: 'MONITOREO', rowBg: 'bg-surface', vitals: [['ok', '95'], ['warn', '95'], ['warn', '135/88'], ['ok', '37.1'], ['ok', '18'], ['ok', '14']], updated: 'hace 14min' },
  { bed: 'C-06', icon: imgBedIcon2, name: 'F. Díaz', age: '81 años', status: 'CRÍTICO', rowBg: 'bg-white', vitals: [['crit', '130'], ['crit', '88'], ['crit', '85/55'], ['warn', '38.5'], ['crit', '32'], ['crit', '8']], updated: 'hace 1min' },
  { bed: 'C-07', icon: imgBedIcon4, name: 'Disponible', status: 'DISPONIBLE', rowBg: 'bg-[#f3f4f6]', updated: '-' },
];

const LEGEND: Array<[string, string]> = [
  [imgStatusPillEllipse, 'Estable'],
  [imgAlertTextEllipse, 'Monitoreo'],
  [imgAlertTextEllipse2, 'Crítico'],
];

export default function MedMonitoreoListaUci() {
  const rowLink = useRowLink();

  return (
    <AppLayout
      breadcrumb="SIAPPC > Monitoreo"
      title="Central de Monitoreo – UCI"
      actions={
        <SegmentedControl
          label="Vista"
          active="lista"
          items={[
            { id: 'grid', label: 'Grid', to: '/MedMonitoreoGridUci' },
            { id: 'lista', label: 'Lista', to: '/MedMonitoreoListaUci' },
          ]}
        />
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 bg-white p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4">
          <p className="font-jakarta text-[15px] font-semibold leading-[normal] text-[#374151]">
            Monitoreo activo para <span className="font-extrabold text-primary">6 pacientes críticos en UCI</span> • 2 Estable • 1 Monitoreo • 3 Crítico
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
            {BEDS.map((b) => {
              const free = b.status === 'DISPONIBLE';
              // Las camas ocupadas llevan al expediente. La libre es informativa: asignar camas es de Admisión.
              const rowProps = free ? {} : { ...rowLink('/MedPacienteResumen'), 'aria-label': `Ver a ${b.name}, cama ${b.bed}` };
              return (
              <div key={b.bed} {...rowProps} className={cn('flex min-h-[72px] w-full items-center gap-4 border-b border-line px-6 py-3 last:border-b-0', b.rowBg, !free && rowLinkClass)}>
                <div className="flex w-[60px] shrink-0 items-center gap-2">
                  <img className="size-[18px]" alt="" src={b.icon} />
                  <p className="font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{b.bed}</p>
                </div>
                <div className="flex w-[140px] shrink-0 flex-col gap-0.5 leading-[normal]">
                  <p className={cn('font-jakarta text-[12px] font-bold', b.age ? 'text-ink' : 'text-muted')}>{b.name}</p>
                  {b.age && <p className="font-jakarta text-[11px] font-medium text-muted">{b.age}</p>}
                </div>
                <div className="w-[90px] shrink-0">
                  <Badge tone={STATUS_TONE[b.status]} size="sm">{b.status}</Badge>
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {VITALS.map((v, i) => {
                    const cell = b.vitals?.[i];
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
                    <p className="w-full text-[11px] text-muted">{b.updated}</p>
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
