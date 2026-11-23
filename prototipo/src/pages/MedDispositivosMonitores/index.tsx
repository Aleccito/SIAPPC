// Pantalla "med-dispositivos-monitores" (Figma node 265:4) — generada desde el diseño original de Figma.
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFiltersRowFrame from '../../assets/filters-row-frame.svg';
import imgKpiRowFrame from '../../assets/kpi-row-frame.svg';
import imgKpiRowFrame2 from '../../assets/kpi-row-frame-2.svg';
import imgKpiRowFrame3 from '../../assets/kpi-row-frame-3.svg';
import imgKpiRowFrame4 from '../../assets/kpi-row-frame-4.svg';
import imgRowC01Vector from '../../assets/row-c-01-vector.svg';
import imgRowC06Vector from '../../assets/row-c-06-vector.svg';
import imgRowC07Vector from '../../assets/row-c-07-vector.svg';
import imgSearchFieldVector from '../../assets/search-field-vector.svg';
import { AppLayout, Badge, Button, Card, KpiCard, SearchBox, Table } from '../../components';
import { cn } from '../../lib/cn';

type Device = {
  bed: string;
  icon: string;
  patient: string;
  age?: string;
  model: string;
  status: 'ACTIVO' | 'FALLA' | 'INACTIVO';
  battery: number;
  calibration: string;
  calibrationDue?: boolean;
  signals: string[];
  rowBg?: string;
};

const STATUS_TONE = { ACTIVO: 'success', FALLA: 'danger', INACTIVO: 'neutral' } as const;

const DEVICES: Device[] = [
  { bed: 'C-01', icon: imgRowC01Vector, patient: 'María González', age: '64 años', model: 'Philips IntelliVue MX800', status: 'ACTIVO', battery: 92, calibration: '15 Jul 2026', signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-02', icon: imgRowC01Vector, patient: 'Juan García', age: '72 años', model: 'GE CARESCAPE B650', status: 'ACTIVO', battery: 87, calibration: '20 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'FR'] },
  { bed: 'C-03', icon: imgRowC01Vector, patient: 'Carlos Rodríguez', age: '58 años', model: 'Philips IntelliVue MX800', status: 'ACTIVO', battery: 95, calibration: '01 Ago 2026', signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-05', icon: imgRowC01Vector, patient: 'Laura Torres', age: '49 años', model: 'Mindray BeneVision N22', status: 'ACTIVO', battery: 78, calibration: '10 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'Temp'] },
  { bed: 'C-06', icon: imgRowC06Vector, patient: 'Francisco Díaz', age: '81 años', model: 'GE CARESCAPE B650', status: 'FALLA', battery: 15, calibration: '05 Jul 2026', signals: ['ECG (intermitente)'], rowBg: 'bg-danger-soft' },
  { bed: 'C-07', icon: imgRowC07Vector, patient: '— Disponible —', model: 'Philips IntelliVue MX550', status: 'INACTIVO', battery: 100, calibration: '28 Jul 2026', signals: ['—'], rowBg: 'bg-[rgba(248,250,252,0.7)]' },
  { bed: 'C-09', icon: imgRowC01Vector, patient: 'Ana Morales', age: '35 años', model: 'Mindray BeneVision N22', status: 'ACTIVO', battery: 65, calibration: '25 Jun 2026', calibrationDue: true, signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-11', icon: imgRowC01Vector, patient: 'Pedro Sánchez', age: '53 años', model: 'Philips IntelliVue MX800', status: 'ACTIVO', battery: 88, calibration: '30 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'FR'] },
];

const COLS = 'flex w-full items-center gap-4 px-6';

function FilterBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-line bg-white px-3 py-2">
      <div className="flex flex-col gap-0.5 font-jakarta font-semibold leading-[normal]">
        <p className="text-[10px] uppercase text-muted">{label}</p>
        <p className="text-[13px] text-ink">{value}</p>
      </div>
      <img className="size-3.5" alt="" src={imgFiltersRowFrame} />
    </div>
  );
}

const kpiIcon = (src: string) => <img className="size-7 shrink-0" alt="" src={src} />;

export default function MedDispositivosMonitores() {
  return (
    <AppLayout breadcrumb="SIAPPC > Dispositivos" title="Dispositivos — Monitores UCI" actions={<SearchBox placeholder="Buscar por serie/ID..." width={260} />}>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Dispositivos" value="12" note="Monitorización central" icon={kpiIcon(imgKpiRowFrame)} />
          <KpiCard label="Activos" value="10" tone="success" tint="success" note="En transmisiones" icon={kpiIcon(imgKpiRowFrame2)} />
          <KpiCard label="En Falla" value="1" tone="danger" tint="danger" note="Soporte requerido" icon={kpiIcon(imgKpiRowFrame3)} />
          <KpiCard label="Pendiente Calibración" value="2" tone="warning" tint="warning" note="Próximos 7 días" icon={kpiIcon(imgKpiRowFrame4)} />
        </div>

        <div className="flex w-full flex-wrap items-center gap-3">
          <FilterBox label="Estado" value="Todos" />
          <FilterBox label="Cama" value="Todas las UCI" />
          <div className="flex min-w-[220px] flex-1 items-center gap-[10px] rounded-lg border border-line bg-white px-[14px] py-[10px]">
            <img className="size-3.5 shrink-0" alt="" src={imgSearchFieldVector} />
            <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal] text-muted">Filtrar pacientes o modelo de equipo...</p>
          </div>
        </div>

        <Card padding="none" className="w-full overflow-hidden shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)]">
          <Table minWidth={1060}>
            <div className={cn(COLS, 'border-b border-line bg-surface py-[14px] font-jakarta text-[11px] font-bold leading-[normal] text-muted')}>
              <p className="w-[60px] shrink-0">CAMA</p>
              <p className="w-[160px] shrink-0">PACIENTE</p>
              <p className="w-[180px] shrink-0">MODELO MONITOR</p>
              <p className="w-[100px] shrink-0">ESTADO</p>
              <p className="w-[100px] shrink-0">BATERÍA</p>
              <p className="w-[130px] shrink-0">ÚLTIMA CALIBRACIÓN</p>
              <p className="w-[180px] shrink-0">SEÑALES</p>
              <p className="min-w-0 flex-1 text-right">ACCIÓN</p>
            </div>
            {DEVICES.map((d) => {
              const low = d.battery < 20;
              return (
                <div key={d.bed} className={cn(COLS, 'border-b border-line py-3 last:border-b-0', d.rowBg ?? 'bg-white')}>
                  <div className="flex w-[60px] shrink-0 items-center gap-2">
                    <img className="size-4" alt="" src={d.icon} />
                    <p className="font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{d.bed}</p>
                  </div>
                  <div className="flex w-[160px] shrink-0 flex-col gap-0.5 leading-[normal]">
                    <p className={cn('truncate font-jakarta text-[12px] font-bold', d.age ? 'text-ink' : 'text-muted')}>{d.patient}</p>
                    {d.age && <p className="font-jakarta text-[11px] font-medium text-muted">{d.age}</p>}
                  </div>
                  <p className="w-[180px] shrink-0 truncate font-jakarta text-[13px] font-medium leading-[normal] text-ink">{d.model}</p>
                  <div className="w-[100px] shrink-0">
                    <Badge tone={STATUS_TONE[d.status]} size="sm">{d.status}</Badge>
                  </div>
                  <div className="flex w-[100px] shrink-0 items-center gap-2">
                    <span className="flex h-3 w-6 items-center overflow-hidden rounded-sm border border-muted p-px" aria-hidden="true">
                      <span className={cn('h-full rounded-[1px]', low ? 'bg-danger' : 'bg-success')} style={{ width: `${d.battery}%` }} />
                    </span>
                    <p className={cn('font-jakarta text-[13px] font-semibold leading-[normal]', low ? 'text-danger' : 'text-ink')}>{d.battery}%</p>
                  </div>
                  <div className="flex w-[130px] shrink-0 items-center gap-1.5">
                    {d.calibrationDue && <img className="size-1.5" alt="Calibración vencida" src={imgDropdownBadgeEllipse2} />}
                    <p className={cn('font-jakarta text-[13px] font-semibold leading-[normal]', d.calibrationDue ? 'text-warning' : 'text-ink')}>{d.calibration}</p>
                  </div>
                  <div className="flex w-[180px] shrink-0 flex-wrap gap-1">
                    {d.signals.map((s) => (
                      <span key={s} className="rounded border border-line bg-surface px-1.5 py-0.5 font-jakarta text-[10px] font-semibold leading-[normal] text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex min-w-0 flex-1 justify-end">
                    <Button variant="outline" size="sm">Ver Detalle</Button>
                  </div>
                </div>
              );
            })}
          </Table>
        </Card>

        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">Mostrando 8 de 12 monitores UCI activos.</p>
          <div className="flex gap-[10px]">
            <Button variant="secondary">Anterior</Button>
            <Button variant="secondary">Siguiente</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
