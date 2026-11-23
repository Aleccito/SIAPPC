// Pantalla "med/paciente/config-umbrales" (Figma node 140:259) — generada desde el diseño original de Figma.
// Los campos son dibujos (paso 3 del plan los vuelve editables).
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
import { BackButton, Button, Card, PatientLayout, Table } from '../../components';
import { cn } from '../../lib/cn';

const SEVERITY_DOT: Record<string, string> = { Crítica: imgDropdownBadgeEllipse, Alta: imgDropdownBadgeEllipse2, Media: imgBulletItemEllipse };

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

export default function MedPacienteConfigUmbrales() {
  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Umbrales" title="Configuración de Umbrales de Alarma" tab="monitoreo" actions={<BackButton />}>
      <Card padding="lg" className="flex w-full flex-col gap-5 drop-shadow-[0px_4px_6px_rgba(0,0,0,0.01)]">
        <div className="flex w-full flex-col gap-1.5 leading-[normal]">
          <h2 className="font-jakarta text-[16px] font-extrabold text-ink">Configuración de Parámetros Clínicos</h2>
          <p className="font-jakarta text-[13px] font-normal text-muted">Configure los límites fisiológicos personalizados para disparar alertas en la central de monitoreo.</p>
        </div>

        <Table minWidth={820}>
          <div className="flex w-full gap-4 px-4 pb-[10px] font-jakarta text-[12px] font-bold leading-[normal] text-subtle">
            <p className="w-[220px] shrink-0">SIGNO VITAL</p>
            <p className="w-[300px] shrink-0">LÍMITES (MIN / MAX)</p>
            <p className="w-[180px] shrink-0">SEVERIDAD POR DEFECTO</p>
            <p className="min-w-0 flex-1 text-right">ESTADO</p>
          </div>
          <div className="flex w-full flex-col gap-[10px]">
            {ROWS.map((r) => (
              <div key={r.name} className={cn('flex w-full items-center gap-4 rounded-lg border border-line px-4 py-3', r.enabled ? 'bg-white' : 'bg-[#f1f5f9] opacity-65')}>
                <div className="flex w-[220px] shrink-0 items-center gap-3">
                  <img className="size-9 shrink-0" alt="" src={r.icon} />
                  <p className={cn('font-jakarta text-[14px] font-bold leading-[normal]', r.enabled ? 'text-ink' : 'text-subtle')}>{r.name}</p>
                </div>
                <div className="flex w-[300px] shrink-0 items-center gap-4">
                  <LimitBox label="Min" value={r.min} />
                  <LimitBox label="Max" value={r.max} />
                </div>
                <div className="w-[180px] shrink-0">
                  <div className="flex w-full items-center justify-between rounded-md border border-line bg-white px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <img className="size-1.5" alt="" src={SEVERITY_DOT[r.severity]} />
                      <span className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{r.severity}</span>
                    </div>
                    <img className="size-3.5" alt="" src={imgChevronDown} />
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 justify-end">
                  <img className="h-6 w-11" alt={r.enabled ? 'Activado' : 'Desactivado'} src={r.enabled ? imgToggleSwitch : imgToggleSwitch2} />
                </div>
              </div>
            ))}
          </div>
        </Table>

        <div className="flex w-full flex-wrap items-center justify-end gap-4 pt-3">
          <Button variant="ghost" size="lg">Restablecer valores sugeridos</Button>
          <Button size="lg">Guardar Configuración</Button>
        </div>
      </Card>
    </PatientLayout>
  );
}
