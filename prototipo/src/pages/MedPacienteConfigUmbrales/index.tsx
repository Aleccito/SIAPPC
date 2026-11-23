// Pantalla "med/paciente/config-umbrales" (Figma node 140:259) — generada desde el diseño original de Figma.
// Paso 3: Mín/Máx son campos numéricos. Cada signo activo necesita al menos un límite, dentro de su rango
// posible y con el mínimo menor que el máximo (REVISION.md, paso 3, punto 4).
import { Fragment, useState } from 'react';
import imgActivity7 from '../../assets/activity-7.svg';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgHeart5 from '../../assets/heart-5.svg';
import imgThermometer from '../../assets/thermometer.svg';
import imgToggleSwitch from '../../assets/toggle-switch.svg';
import imgToggleSwitch2 from '../../assets/toggle-switch-2.svg';
import imgTrendingUp from '../../assets/trending-up.svg';
import imgWind from '../../assets/wind.svg';
import { BackButton, Button, Card, FieldError, focusFirst, NumberField, PatientLayout, Select, Table, useToast, useValidation } from '../../components';
import { cn } from '../../lib/cn';
import { checkNumber, parseNumber, VITAL_RANGES, type NumberRule } from '../../lib/validate';

const SEVERITY_DOT: Record<string, string> = { Crítica: imgDropdownBadgeEllipse, Alta: imgDropdownBadgeEllipse2, Media: imgBulletItemEllipse };
const SEVERITIES = ['Crítica', 'Alta', 'Media', 'Baja'];

/** Punto de color de la severidad ("Baja" no viene de Figma: punto verde). */
const SeverityLabel = ({ value }: { value: string }) => (
  <span className="flex items-center gap-1.5">
    {SEVERITY_DOT[value] ? <img className="size-1.5" alt="" src={SEVERITY_DOT[value]} /> : <span className="size-1.5 rounded-full bg-success" />}
    {value}
  </span>
);

const ROWS: Array<{ icon: string; name: string; min?: string; max?: string; severity: string; enabled: boolean; range: NumberRule }> = [
  { icon: imgActivity7, name: 'FC (Frecuencia Cardíaca)', min: '50', max: '120', severity: 'Crítica', enabled: true, range: VITAL_RANGES.fc },
  { icon: imgWind, name: 'SpO2 (Saturación)', min: '92', severity: 'Crítica', enabled: true, range: VITAL_RANGES.spo2 },
  { icon: imgHeart5, name: 'PA Sistólica', max: '160', severity: 'Alta', enabled: true, range: VITAL_RANGES.paSys },
  { icon: imgHeart5, name: 'PA Diastólica', max: '100', severity: 'Alta', enabled: true, range: VITAL_RANGES.paDia },
  { icon: imgThermometer, name: 'Temp (Temperatura)', max: '38.5', severity: 'Media', enabled: true, range: VITAL_RANGES.temp },
  { icon: imgTrendingUp, name: 'FR (Frecuencia Resp.)', min: '10', max: '30', severity: 'Media', enabled: false, range: VITAL_RANGES.fr },
];

type Limits = { min: string; max: string };

type LimitBoxProps = {
  id: string;
  label: string;
  signal: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  decimals?: number;
  error: string | null;
};

function LimitBox({ id, label, signal, value, onChange, onBlur, decimals, error }: LimitBoxProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <label htmlFor={id} className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">
        {label}
      </label>
      <NumberField id={id} value={value} onChange={onChange} onBlur={onBlur} decimals={decimals} placeholder="-" aria-label={`${label} de ${signal}`} error={error} />
    </div>
  );
}

const initialSeverity = () => ROWS.map((r) => r.severity);
const initialEnabled = () => ROWS.map((r) => r.enabled);
const initialLimits = (): Limits[] => ROWS.map((r) => ({ min: r.min ?? '', max: r.max ?? '' }));

// Lo guardado se conserva mientras no se recargue la página (sin backend).
let saved: { severity: string[]; enabled: boolean[]; limits: Limits[] } | null = null;

/** Errores de una fila activa: cada límite en su rango y, si hay dos, el mínimo menor que el máximo. */
function rowErrors(l: Limits, r: (typeof ROWS)[number], on: boolean) {
  if (!on) return { min: null, max: null };
  const rule = { ...r.range, required: false };
  const min = checkNumber(l.min, rule);
  const max = checkNumber(l.max, rule);
  if (min || max) return { min, max };
  if (!l.min.trim() && !l.max.trim()) return { min: 'Defina al menos un límite (mínimo o máximo)', max: null };
  const a = parseNumber(l.min);
  const b = parseNumber(l.max);
  if (a !== null && b !== null && a >= b) return { min: 'El mínimo debe ser menor que el máximo', max: null };
  return { min: null, max: null };
}

export default function MedPacienteConfigUmbrales() {
  const toast = useToast();
  const [severity, setSeverity] = useState(() => saved?.severity ?? initialSeverity());
  const [enabled, setEnabled] = useState(() => saved?.enabled ?? initialEnabled());
  const [limits, setLimits] = useState(() => saved?.limits ?? initialLimits());
  const form = useValidation(
    Object.fromEntries(
      ROWS.flatMap((r, i) => {
        const e = rowErrors(limits[i], r, enabled[i]);
        return [
          [`umbral-min-${i}`, () => e.min],
          [`umbral-max-${i}`, () => e.max],
        ];
      }),
    ) as Record<string, () => string | null>,
  );
  const setLimit = (i: number, key: keyof Limits, v: string) => setLimits((all) => all.map((l, j) => (j === i ? { ...l, [key]: v } : l)));
  const save = () => {
    form.markAll();
    const bad = Object.keys(form.errors).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los umbrales marcados', 'info');
      focusFirst([bad]);
      return;
    }
    saved = { severity, enabled, limits };
    toast('Umbrales guardados');
  };
  const update = <T,>(set: (fn: (prev: T[]) => T[]) => void, i: number, value: T) => set((prev) => prev.map((x, j) => (j === i ? value : x)));

  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Umbrales" title="Configuración de Umbrales de Alarma" tab="monitoreo" actions={<BackButton />}>
      <Card padding="lg" className="flex w-full flex-col gap-5 drop-shadow-[0px_4px_6px_rgba(0,0,0,0.01)]">
        <div className="flex w-full flex-col gap-1.5 leading-[normal]">
          <h2 className="font-jakarta text-[16px] font-extrabold text-ink">Configuración de Parámetros Clínicos</h2>
          <p className="font-jakarta text-[13px] font-normal text-muted">Configure los límites fisiológicos personalizados para disparar alertas en la central de monitoreo.</p>
        </div>

        {/* Columnas más angostas abajo de 1280 px para que la tabla entre completa a 1024 y 768;
            en celular cada signo vital es una tarjeta (REVISION.md, V12). A 1440 queda igual que Figma. */}
        <Table minWidth={0}>
          <div className="hidden w-full gap-4 px-4 pb-[10px] font-jakarta text-[12px] font-bold leading-[normal] text-subtle md:flex">
            <p className="w-[150px] shrink-0 xl:w-[220px]">SIGNO VITAL</p>
            <p className="w-[248px] shrink-0 xl:w-[300px]">LÍMITES (MIN / MAX)</p>
            <p className="w-[130px] shrink-0 xl:w-[180px]">SEVERIDAD POR DEFECTO</p>
            <p className="min-w-0 flex-1 whitespace-nowrap text-right">ESTADO</p>
          </div>
          <div className="flex w-full flex-col gap-[10px]">
            {ROWS.map((r, i) => {
              const minError = form.show(`umbral-min-${i}`);
              const maxError = form.show(`umbral-max-${i}`);
              return (
              <Fragment key={r.name}>
              <div
                className={cn(
                  'flex w-full flex-col gap-3 rounded-lg border border-line px-4 py-3 transition-opacity md:flex-row md:items-center md:gap-4',
                  enabled[i] ? 'bg-white' : 'bg-[#f1f5f9] opacity-65',
                )}
              >
                <div className="flex items-center gap-3 md:w-[150px] md:shrink-0 xl:w-[220px]">
                  <img className="size-9 shrink-0" alt="" src={r.icon} />
                  <p id={`umbral-${i}`} className={cn('font-jakarta text-[14px] font-bold leading-[normal]', enabled[i] ? 'text-ink' : 'text-subtle')}>
                    {r.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:w-[248px] md:shrink-0 xl:w-[300px]">
                  <LimitBox
                    id={`umbral-min-${i}`}
                    label="Min"
                    signal={r.name}
                    value={limits[i].min}
                    onChange={(v) => setLimit(i, 'min', v)}
                    onBlur={() => form.touch(`umbral-min-${i}`)}
                    decimals={r.range.decimals}
                    error={minError}
                  />
                  <LimitBox
                    id={`umbral-max-${i}`}
                    label="Max"
                    signal={r.name}
                    value={limits[i].max}
                    onChange={(v) => setLimit(i, 'max', v)}
                    onBlur={() => form.touch(`umbral-max-${i}`)}
                    decimals={r.range.decimals}
                    error={maxError}
                  />
                </div>
                <div className="flex items-center gap-3 md:contents">
                <div className="min-w-0 flex-1 md:w-[130px] md:flex-none md:shrink-0 xl:w-[180px]">
                  <Select
                    variant="compact"
                    options={SEVERITIES}
                    value={severity[i]}
                    onChange={(v) => update(setSeverity, i, v)}
                    format={(l) => <SeverityLabel value={l} />}
                    trailingIcon={<img className="size-3.5" alt="" src={imgChevronDown} />}
                    ariaLabel={`Severidad por defecto de ${r.name}`}
                  />
                </div>
                <div className="flex shrink-0 justify-end md:min-w-0 md:flex-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled[i]}
                    aria-labelledby={`umbral-${i}`}
                    onClick={() => update(setEnabled, i, !enabled[i])}
                    className="flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <img className="h-6 w-11" alt="" src={enabled[i] ? imgToggleSwitch : imgToggleSwitch2} />
                  </button>
                </div>
                </div>
              </div>
              {/* El mensaje va bajo la fila; su id lo enlaza con el campo que tiene el error. */}
              <FieldError forId={minError ? `umbral-min-${i}` : `umbral-max-${i}`} error={minError ?? maxError} className="-mt-1 px-4" />
              </Fragment>
              );
            })}
          </div>
        </Table>

        <div className="flex w-full flex-wrap items-center justify-end gap-4 pt-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setSeverity(initialSeverity());
              setEnabled(initialEnabled());
              setLimits(initialLimits());
              form.reset();
              toast('Valores sugeridos restablecidos', 'info');
            }}
          >
            Restablecer valores sugeridos
          </Button>
          <Button size="lg" onClick={save}>
            Guardar Configuración
          </Button>
        </div>
      </Card>
    </PatientLayout>
  );
}
