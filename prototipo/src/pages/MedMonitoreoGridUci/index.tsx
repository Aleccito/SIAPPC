// Pantalla "med/monitoreo/grid-uci" (Figma node 45:984) — generada desde el diseño original de Figma.
// Las camas de la unidad elegida (GET /monitoring/beds): las de los 8 pacientes del seed y las libres.
// Las seis tarjetas que eran copias de Figma ahora son una sola (`BedCard`) que se llena con cada cama.
// Con "Todas", las camas de todas las unidades, en un grupo por unidad (docs/historial/REVISION-TABLAS-Y-VOLVER.md).
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import { AppLayout, SegmentedControl, Select } from '../../components';
import {
  ALL_UNITS,
  BedCard,
  DEFAULT_UNIT,
  groupByUnit,
  PatientsWithoutBed,
  patientsLabel,
  unitSummary,
  unitTitle,
  useUnitBeds,
  useUnitParam,
} from '../../components/monitor/BedCards';

const INDICATORS: Array<[string, string]> = [
  [imgStatusPillEllipse, 'Estable'],
  [imgAlertTextEllipse, 'Atención'],
  [imgAlertTextEllipse2, 'Crítico'],
];

/** Selector de unidad (con cuántos pacientes tiene cada una, y "Todas") y Grid/Lista, que conserva la unidad. */
export function MonitorActions({
  unit,
  units,
  counts,
  setUnit,
  view,
}: {
  unit: string;
  units: string[];
  counts: Record<string, number>;
  setUnit: (u: string) => void;
  view: 'grid' | 'lista';
}) {
  const q = unit === DEFAULT_UNIT ? '' : `?unidad=${encodeURIComponent(unit)}`;
  const total = Object.values(counts).reduce((a, n) => a + n, 0);
  const list = units.length ? units : unit === ALL_UNITS ? [] : [unit];
  const options = [{ value: ALL_UNITS, label: `Todas (${total})` }, ...list.map((u) => ({ value: u, label: `${u} (${counts[u] ?? 0})` }))];
  return (
    <>
      <Select variant="soft" ariaLabel="Unidad" options={options} value={unit} onChange={setUnit} format={(u) => `Unidad: ${u}`} align="right" />
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

const GRID = 'grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';

export default function MedMonitoreoGridUci() {
  const [unit, setUnit] = useUnitParam();
  const { beds, units, counts, isPending } = useUnitBeds(unit);
  const summary = unitSummary(beds, unit);

  return (
    <AppLayout
      breadcrumb="SIAPPC > Monitoreo"
      title={`Central de Monitoreo - ${unitTitle(unit)}`}
      actions={<MonitorActions unit={unit} units={units} counts={counts} setUnit={setUnit} view="grid" />}
    >
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
          <PatientsWithoutBed />
        </div>
        {unit === ALL_UNITS ? (
          groupByUnit(beds).map((g) => (
            <section key={g.unit} className="flex w-full flex-col gap-3" aria-label={g.unit}>
              <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">
                {g.unit} <span className="font-semibold text-muted">{`· ${patientsLabel(g.patients)}`}</span>
              </h2>
              <div className={GRID}>
                {g.beds.map((b) => (
                  <BedCard key={b.id} b={b} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={GRID}>
            {beds.map((b) => (
              <BedCard key={b.id} b={b} />
            ))}
          </div>
        )}
        {!isPending && beds.length === 0 && <p className="font-jakarta text-[14px] text-muted">{unit === ALL_UNITS ? 'Sin camas.' : `Sin camas en ${unit}.`}</p>}
      </div>
    </AppLayout>
  );
}
