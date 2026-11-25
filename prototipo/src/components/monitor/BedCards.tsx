// Piezas de la central de monitoreo (Grid y Lista): selector de unidad, resumen de la unidad y la
// tarjeta de cama de Figma (node 45:984) dibujada a partir de una cama de GET /monitoring/beds.
import { useSearchParams } from 'react-router-dom';
import imgActivity10 from '../../assets/activity-10.svg';
import imgActivity8 from '../../assets/activity-8.svg';
import imgActivity9 from '../../assets/activity-9.svg';
import imgArmchair from '../../assets/armchair.svg';
import imgArmchair2 from '../../assets/armchair-2.svg';
import imgArmchair3 from '../../assets/armchair-3.svg';
import imgBed from '../../assets/bed.svg';
import imgBed2 from '../../assets/bed-2.svg';
import imgBed3 from '../../assets/bed-3.svg';
import imgBrain2 from '../../assets/brain-2.svg';
import imgBrain3 from '../../assets/brain-3.svg';
import imgBrain4 from '../../assets/brain-4.svg';
import imgHeart6 from '../../assets/heart-6.svg';
import imgHeart7 from '../../assets/heart-7.svg';
import imgHeart8 from '../../assets/heart-8.svg';
import imgThermometer2 from '../../assets/thermometer-2.svg';
import imgThermometer3 from '../../assets/thermometer-3.svg';
import imgWind2 from '../../assets/wind-2.svg';
import imgWind3 from '../../assets/wind-3.svg';
import imgWind5 from '../../assets/wind-5.svg';
import { useMonitoredBeds, usePatients } from '../../api/queries';
import { useSignosTodos, type SignosExtra } from '../../api/sinBackend';
import type { MonitoredBed } from '../../api/types/monitoring';
import { vitalTone } from '../../lib/alerts';
import { clinicalState, STATE_LABEL, type ClinicalState } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { useRowLink } from '../ui/rowLink';
import { useSession } from '../auth/session';

export const DEFAULT_UNIT = 'UCI';

/** La unidad elegida va en la URL (`?unidad=UCI`), como `frontend/` (CONEXION-BACKEND.md). */
export function useUnitParam(): [string, (u: string) => void] {
  const [params, setParams] = useSearchParams();
  const unit = params.get('unidad') ?? DEFAULT_UNIT;
  return [unit, (u) => setParams(u === DEFAULT_UNIT ? {} : { unidad: u }, { replace: true })];
}

export type BedView = MonitoredBed & { cedula: string | null; state: ClinicalState | null; signos: SignosExtra | undefined };

/** Camas de la unidad con el paciente (cédula, estado clínico, PA y temperatura). */
export function useUnitBeds(unit: string) {
  const beds = useMonitoredBeds();
  const patients = usePatients();
  const signos = useSignosTodos();
  const units = [...new Set((beds.data ?? []).map((b) => b.unit))];
  const list: BedView[] = (beds.data ?? [])
    .filter((b) => b.unit === unit)
    .sort((a, b) => a.bed.localeCompare(b.bed))
    .map((b) => {
      const cedula = patients.data?.items.find((p) => p.id === b.patientId)?.document ?? null;
      return { ...b, cedula, state: b.patientId ? clinicalState(b.worstSeverity) : null, signos: cedula ? signos.data?.[cedula] : undefined };
    });
  return { beds: list, units, isPending: beds.isPending };
}

/** "Monitoreo activo para 5 pacientes en UCI • 0 Estable • 1 Atención • 4 Crítico". */
export function unitSummary(beds: BedView[], unit: string) {
  const occupied = beds.filter((b) => b.state);
  const count = (s: ClinicalState) => occupied.filter((b) => b.state === s).length;
  return {
    lead: `${occupied.length} ${occupied.length === 1 ? 'paciente' : 'pacientes'} en ${unit}`,
    rest: ` • ${count('estable')} Estable • ${count('atencion')} Atención • ${count('critico')} Crítico`,
  };
}

const TONE_ICON = {
  hr: { normal: imgHeart6, warning: imgHeart8, danger: imgHeart7 },
  spo2: { normal: imgActivity8, warning: imgActivity10, danger: imgActivity9 },
  pa: { normal: imgArmchair, warning: imgArmchair3, danger: imgArmchair2 },
  resp: { normal: imgWind2, warning: imgWind3, danger: imgWind5 },
  temp: { normal: imgThermometer2, warning: imgThermometer3, danger: imgThermometer3 },
  gcs: { normal: imgBrain2, warning: imgBrain4, danger: imgBrain3 },
};
const TONE_TEXT = { normal: 'text-white', warning: 'text-warning', danger: 'text-danger' };
const TONE_DOT = { normal: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' };

const CARD = {
  critico: { border: 'border-[#dc2626]', badge: 'bg-[#fee2e2] text-[#dc2626]', bed: imgBed2, ecg: '#EF4444' },
  atencion: { border: 'border-[#d97706]', badge: 'bg-[#fffbeb] text-[#d97706]', bed: imgBed3, ecg: '#F59E0B' },
  estable: { border: 'border-[#1e3a8a]', badge: 'bg-[#d1fae5] text-success', bed: imgBed, ecg: '#10B981' },
};

/** "Ileana Montenegro Sáez" → "I. Montenegro" (como "M. García" en Figma). */
const shortName = (name: string) => {
  const [first, surname] = name.split(/\s+/);
  return surname ? `${first[0]}. ${surname}` : name;
};

const gcsTone = (g: number | null) => (g === null ? 'normal' : g <= 8 ? 'danger' : g <= 13 ? 'warning' : 'normal');

function Vital({ kind, label, value, unit, note, tone, big }: { kind: keyof typeof TONE_ICON; label: string; value: string; unit: string; note?: string; tone: 'normal' | 'warning' | 'danger'; big?: boolean }) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-1">
      <div className="flex w-full items-center gap-1.5">
        <img className="size-3.5 shrink-0" alt="" src={TONE_ICON[kind][tone]} />
        <p className="whitespace-nowrap font-jakarta text-[10px] font-bold leading-[normal] text-muted">{label}</p>
        <span className={cn('size-1.5 shrink-0 rounded-[3px]', TONE_DOT[tone])} />
      </div>
      <p className={cn('whitespace-nowrap font-jakarta font-extrabold leading-[normal]', TONE_TEXT[tone])}>
        <span className={big ? 'text-[22px]' : 'text-[18px]'}>{`${value} `}</span>
        <span className="font-medium text-[12px] text-muted">{unit}</span>
      </p>
      {note && <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{note}</p>}
    </div>
  );
}

/**
 * Trazo de ECG que se repite (en Figma eran segmentos sueltos); toma el color del estado de la cama.
 * SIMULADO: en la central no es la onda del equipo (sería una conexión por cama, y el navegador abre 6 por host;
 * pedido 29 de CONEXION-BACKEND.md). Corre a la FC real de la cama: un latido cada 60/FC segundos. Sin FC, plano.
 */
export function EcgTrace({ color, className, hr }: { color: string; className?: string; hr?: number | null }) {
  const beat = (x: number) => `${x},22 ${x + 8},22 ${x + 11},19 ${x + 14},22 ${x + 18},22 ${x + 20},26 ${x + 23},6 ${x + 26},34 ${x + 28},22 ${x + 34},22 ${x + 38},17 ${x + 43},22 ${x + 50},22`;
  const points = hr === null ? '0,22 450,22' : Array.from({ length: 9 }, (_, i) => beat(i * 50)).join(' ');
  const quieto = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <svg viewBox="0 0 400 44" preserveAspectRatio="xMinYMid slice" className={cn('h-full w-full', className)} aria-hidden="true">
      <g>
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" opacity={hr === null ? 0.45 : 1} />
        {hr && !quieto && <animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" dur={`${(60 / Math.max(30, hr)).toFixed(2)}s`} repeatCount="indefinite" />}
      </g>
    </svg>
  );
}

export function BedCard({ b }: { b: BedView }) {
  const rowLink = useRowLink();
  // Sin el expediente (el administrativo), la tarjeta se mira pero no abre nada.
  const opens = useSession().can('historia_clinica', 'ver');
  if (!b.state || !b.patientName || !b.cedula) {
    return (
      <div className="flex min-w-0 flex-col items-start gap-3 overflow-clip rounded-xl border border-b border-l-4 border-r border-t border-[#1e3a8a] bg-[#f3f4f6] p-4 xl:h-[360px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="size-[18px]" alt="" src={imgBed} />
            <p className="whitespace-nowrap font-jakarta text-[16px] font-extrabold leading-[normal] text-[#111827]">{b.bed}</p>
          </div>
          <span className="rounded bg-primary-soft px-2 py-0.5 font-jakarta text-[10px] font-extrabold leading-[normal] text-[#1e3a8a]">DISPONIBLE</span>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1.5 py-3 text-center leading-[normal]">
          <p className="font-jakarta text-[15px] font-bold text-[#111827]">Disponible</p>
          <p className="font-jakarta text-[12px] font-semibold text-[#6b7280]">Sin paciente asignado</p>
        </div>
      </div>
    );
  }
  const style = CARD[b.state];
  const { hr, spo2, resp } = b.vitals;
  const pa = b.signos?.pa;
  return (
    <div
      {...(opens ? rowLink(patientPath('/MedPacienteResumen', b.cedula)) : {})}
      aria-label={opens ? `Ver paciente de la cama ${b.bed}` : undefined}
      className={cn(
        opens && 'cursor-pointer',
        'flex min-w-0 flex-col items-start gap-3 overflow-clip rounded-xl border border-b border-l-4 border-r border-t bg-white p-4 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary xl:h-[360px]',
        style.border,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <img className="size-[18px]" alt="" src={style.bed} />
          <p className="whitespace-nowrap font-jakarta text-[16px] font-extrabold leading-[normal] text-[#111827]">{b.bed}</p>
        </div>
        <span className={cn('rounded px-2 py-0.5 font-jakarta text-[10px] font-extrabold leading-[normal]', style.badge)}>{STATE_LABEL[b.state].toUpperCase()}</span>
      </div>
      <p className="w-full truncate font-jakarta text-[15px] font-bold leading-[normal] text-[#111827]" title={b.patientName}>
        {shortName(b.patientName)}
      </p>
      <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-[#0b1220] p-4">
        <div className="flex w-full items-start justify-between">
          <Vital kind="hr" label="FC" value={String(hr ?? '—')} unit="bpm" tone={vitalTone('hr', hr)} big />
          <Vital kind="spo2" label="SpO₂" value={String(spo2 ?? '—')} unit="%" tone={vitalTone('spo2', spo2)} big />
          <Vital kind="pa" label="PA" value={pa ? `${pa.sis}/${pa.dia}` : '—'} unit="mmHg" note={b.signos ? `PAM: ${b.signos.pam} mmHg` : undefined} tone={vitalTone('pa', pa?.sis)} />
        </div>
        <div className="flex w-full items-start justify-between">
          <Vital kind="resp" label="FR" value={String(resp ?? '—')} unit="rpm" tone={vitalTone('resp', resp)} />
          <Vital kind="temp" label="TEMP" value={b.signos ? b.signos.temp.toFixed(1) : '—'} unit="°C" tone={vitalTone('temp', b.signos?.temp)} />
          <Vital kind="gcs" label="GCS" value={b.glasgow !== null ? String(b.glasgow) : '—'} unit="pts" tone={gcsTone(b.glasgow)} />
        </div>
        <div className="flex h-11 w-full overflow-clip rounded-lg border border-[#1f2937] bg-[#0b1220]">
          <EcgTrace color={style.ecg} hr={hr} />
        </div>
      </div>
    </div>
  );
}
