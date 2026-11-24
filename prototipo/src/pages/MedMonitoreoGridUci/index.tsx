// Pantalla "med/monitoreo/grid-uci" (Figma node 45:984) — generada desde el diseño original de Figma.
// Las camas de la unidad elegida (GET /monitoring/beds): las de los 8 pacientes del seed y las libres.
// Las seis tarjetas que eran copias de Figma ahora son una sola (`BedCard`) que se llena con cada cama.
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import { AppLayout, SegmentedControl, Select } from '../../components';
import { BedCard, unitSummary, useUnitBeds, useUnitParam } from '../../components/monitor/BedCards';

const INDICATORS: Array<[string, string]> = [
  [imgStatusPillEllipse, 'Estable'],
  [imgAlertTextEllipse, 'Atención'],
  [imgAlertTextEllipse2, 'Crítico'],
];

/** Selector de unidad y Grid/Lista, que conserva la unidad. */
export function MonitorActions({ unit, units, setUnit, view }: { unit: string; units: string[]; setUnit: (u: string) => void; view: 'grid' | 'lista' }) {
  const q = unit === 'UCI' ? '' : `?unidad=${encodeURIComponent(unit)}`;
  return (
    <>
      <Select variant="soft" ariaLabel="Unidad" options={units.length ? units : [unit]} value={unit} onChange={setUnit} format={(u) => `Unidad: ${u}`} align="right" />
      <SegmentedControl
        label="Vista"
        active={view}
        items={[
          { id: 'grid', label: 'Grid', to: `/MedMonitoreoGridUci${q}` },
          { id: 'lista', label: 'Lista', to: `/MedMonitoreoListaUci${q}` },
        ]}
      />
    </>
  );
}

export default function MedMonitoreoGridUci() {
  const [unit, setUnit] = useUnitParam();
  const { beds, units, isPending } = useUnitBeds(unit);
  const summary = unitSummary(beds, unit);

  return (
    <AppLayout breadcrumb="SIAPPC > Monitoreo" title={`Central de Monitoreo - ${unit}`} actions={<MonitorActions unit={unit} units={units} setUnit={setUnit} view="grid" />}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-6 bg-white p-4 md:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="font-jakarta text-[15px] font-semibold leading-[normal] text-[#374151]">
            {'Monitoreo activo para '}
            <span className="font-extrabold">{summary.lead}</span>
            {summary.rest}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {INDICATORS.map(([dot, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <img className="size-2" alt="" src={dot} />
                <p className="whitespace-nowrap font-jakarta text-[12px] font-semibold leading-[normal] text-subtle">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {beds.map((b) => (
            <BedCard key={b.id} b={b} />
          ))}
          {!isPending && beds.length === 0 && <p className="font-jakarta text-[14px] text-muted">{`Sin camas en ${unit}.`}</p>}
        </div>
      </div>
    </AppLayout>
  );
}
