// Pantalla "med/paciente/config-umbrales" (Figma node 140:259) — generada desde el diseño original de Figma.
// Los campos Mín/Máx son dibujos (paso 3 del plan los vuelve editables).
import { useState } from 'react';
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
import { BackButton, Button, Card, PatientLayout, Select, Table, useToast } from '../../components';
import { cn } from '../../lib/cn';

const SEVERITY_DOT: Record<string, string> = { Crítica: imgDropdownBadgeEllipse, Alta: imgDropdownBadgeEllipse2, Media: imgBulletItemEllipse };
const SEVERITIES = ['Crítica', 'Alta', 'Media', 'Baja'];

/** Punto de color de la severidad ("Baja" no viene de Figma: punto verde). */
const SeverityLabel = ({ value }: { value: string }) => (
  <span className="flex items-center gap-1.5">
    {SEVERITY_DOT[value] ? <img className="size-1.5" alt="" src={SEVERITY_DOT[value]} /> : <span className="size-1.5 rounded-full bg-success" />}
    {value}
  </span>
);

const ROWS: Array<{ icon: string; name: string; min?: string; max?: string; severity: string; enabled: boolean }> = [
  { icon: imgActivity7, name: 'FC (Frecuencia Cardíaca)', min: '50', max: '120', severity: 'Crítica', enabled: true },
  { icon: imgWind, name: 'SpO2 (Saturación)', min: '92', severity: 'Crítica', enabled: true },
  { icon: imgHeart5, name: 'PA Sistólica', max: '160', severity: 'Alta', enabled: true },
  { icon: imgHeart5, name: 'PA Diastólica', max: '100', severity: 'Alta', enabled: true },
  { icon: imgThermometer, name: 'Temp (Temperatura)', max: '38.5', severity: 'Media', enabled: true },
  { icon: imgTrendingUp, name: 'FR (Frecuencia Resp.)', min: '10', max: '30', severity: 'Media', enabled: false },
];

function LimitBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">{label}</span>
      <span className="flex w-20 justify-center rounded-md border border-line bg-white px-3 py-2 font-jakarta text-[13px] font-semibold leading-[normal] text-ink">
        {value ?? <span className="text-subtle">-</span>}
      </span>
    </div>
  );
}

const initialSeverity = () => ROWS.map((r) => r.severity);
const initialEnabled = () => ROWS.map((r) => r.enabled);

export default function MedPacienteConfigUmbrales() {
  const toast = useToast();
  const [severity, setSeverity] = useState(initialSeverity);
  const [enabled, setEnabled] = useState(initialEnabled);
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
            {ROWS.map((r, i) => (
              <div
                key={r.name}
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
                  <LimitBox label="Min" value={r.min} />
                  <LimitBox label="Max" value={r.max} />
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
            ))}
          </div>
        </Table>

        <div className="flex w-full flex-wrap items-center justify-end gap-4 pt-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setSeverity(initialSeverity());
              setEnabled(initialEnabled());
              toast('Valores sugeridos restablecidos', 'info');
            }}
          >
            Restablecer valores sugeridos
          </Button>
          <Button size="lg" onClick={() => toast('Umbrales guardados')}>
            Guardar Configuración
          </Button>
        </div>
      </Card>
    </PatientLayout>
  );
}
