// Pantalla "med-dispositivos-monitores" (Figma node 265:4) — generada desde el diseño original de Figma.
// Con el backend, los monitores de GET /dashboard/devices; sin él, los 8 del seed (src/data/useDevices.ts).
import { useState } from 'react';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFiltersRowFrame from '../../assets/filters-row-frame.svg';
import imgKpiRowFrame from '../../assets/kpi-row-frame.svg';
import imgKpiRowFrame2 from '../../assets/kpi-row-frame-2.svg';
import imgKpiRowFrame3 from '../../assets/kpi-row-frame-3.svg';
import imgKpiRowFrame4 from '../../assets/kpi-row-frame-4.svg';
import imgSearchFieldVector from '../../assets/search-field-vector.svg';
import { AppLayout, Badge, Button, Card, EmptyState, KpiCard, Pagination, rowLinkClass, SearchBox, Select, Table, useRowLink } from '../../components';
import { deviceDetailPath, STATUS_TONE } from '../../data/devices';
import { useDevices } from '../../data/useDevices';
import { cn } from '../../lib/cn';
import { matches } from '../../lib/text';

const COLS = 'flex w-full items-center gap-4 px-6';
const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'FALLA', label: 'Falla' },
  { value: 'INACTIVO', label: 'Inactivo' },
];

const filterIcon = <img className="size-3.5" alt="" src={imgFiltersRowFrame} />;
const kpiIcon = (src: string) => <img className="size-7 shrink-0" alt="" src={src} />;

export default function MedDispositivosMonitores() {
  const rowLink = useRowLink();
  const [serial, setSerial] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [bed, setBed] = useState('all');
  const [page, setPage] = useState(1);
  const { devices } = useDevices();
  const BED_OPTIONS = [{ value: 'all', label: 'Todas las camas' }, ...[...new Set(devices.map((d) => d.bed))].sort().map((b) => ({ value: b, label: b }))];

  // Cualquier cambio de filtro vuelve a la primera página.
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const filtered = devices.filter(
    (d) =>
      (status === 'all' || d.status === status) &&
      (bed === 'all' || d.bed === bed) &&
      matches(serial, d.serial, d.bed) &&
      matches(query, d.patient, d.model),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = () => {
    setSerial('');
    setQuery('');
    setStatus('all');
    setBed('all');
    setPage(1);
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Dispositivos"
      title="Dispositivos — Monitores UCI"
      actions={<SearchBox placeholder="Buscar por serie/ID..." width={260} aria-label="Buscar por serie o ID" value={serial} onChange={(e) => filter(setSerial)(e.target.value)} />}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Dispositivos" value={String(devices.length)} note="Monitorización central" icon={kpiIcon(imgKpiRowFrame)} />
          <KpiCard label="Activos" value={String(devices.filter((d) => d.status === 'ACTIVO').length)} tone="success" tint="success" note="En transmisiones" icon={kpiIcon(imgKpiRowFrame2)} />
          <KpiCard label="En Falla" value={String(devices.filter((d) => d.status === 'FALLA').length)} tone="danger" tint="danger" note="Soporte requerido" icon={kpiIcon(imgKpiRowFrame3)} />
          <KpiCard label="Pendiente Calibración" value={String(devices.filter((d) => d.calibrationDue).length)} tone="warning" tint="warning" note="Vencida o próxima" icon={kpiIcon(imgKpiRowFrame4)} />
        </div>

        <div className="flex w-full flex-wrap items-center gap-3">
          <Select variant="stacked" label="Estado" options={STATUS_OPTIONS} value={status} onChange={filter(setStatus)} trailingIcon={filterIcon} />
          <Select variant="stacked" label="Cama" options={BED_OPTIONS} value={bed} onChange={filter(setBed)} trailingIcon={filterIcon} />
          <label className="flex min-w-[220px] flex-1 items-center gap-[10px] rounded-lg border border-line bg-white px-[14px] py-[10px] focus-within:border-primary">
            <img className="size-3.5 shrink-0" alt="" src={imgSearchFieldVector} />
            <input
              type="search"
              value={query}
              onChange={(e) => filter(setQuery)(e.target.value)}
              placeholder="Filtrar pacientes o modelo de equipo..."
              aria-label="Filtrar pacientes o modelo de equipo"
              className="min-w-0 flex-1 bg-transparent font-jakarta text-[13px] font-normal leading-[normal] text-ink outline-none placeholder:text-muted"
            />
          </label>
        </div>

        <Card padding="none" className="w-full overflow-hidden shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)]">
          <Table minWidth={1060}>
            <div className={cn(COLS, 'border-b border-line bg-surface py-[14px] font-jakarta text-[11px] font-bold leading-[normal] text-muted')}>
              <p className="w-[76px] shrink-0">CAMA</p>
              <p className="w-[160px] shrink-0">PACIENTE</p>
              <p className="w-[180px] shrink-0">MODELO MONITOR</p>
              <p className="w-[100px] shrink-0">ESTADO</p>
              <p className="w-[100px] shrink-0">BATERÍA</p>
              <p className="w-[130px] shrink-0">ÚLTIMA CALIBRACIÓN</p>
              <p className="w-[180px] shrink-0">SEÑALES</p>
              <p className="min-w-0 flex-1 text-right">ACCIÓN</p>
            </div>
            {rows.map((d) => {
              const low = d.battery < 20;
              return (
                <div
                  key={d.serial}
                  {...rowLink(deviceDetailPath(d.bed))}
                  aria-label={`Ver detalle del monitor de la cama ${d.bed}`}
                  className={cn(COLS, 'border-b border-line py-3 last:border-b-0', d.rowBg ?? 'bg-white', rowLinkClass)}
                >
                  <div className="flex w-[76px] shrink-0 items-center gap-2">
                    <img className="size-4" alt="" src={d.icon} />
                    <p className="whitespace-nowrap font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{d.bed}</p>
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
                  <div className="flex min-w-0 flex-1 justify-end" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" to={deviceDetailPath(d.bed)}>
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && <EmptyState onReset={reset} />}
          </Table>
        </Card>

        <Pagination summary={`Mostrando ${rows.length} de ${filtered.length} monitores.`} page={current} pages={pages} onChange={setPage} />
      </div>
    </AppLayout>
  );
}
