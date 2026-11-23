// Pantalla "med/paciente/monitoreo-detallado" (Figma node 6:267) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAlertTriangle3 from '../../assets/alert-triangle-3.svg';
import imgBpWave from '../../assets/bp-wave.svg';
import imgEcgWave from '../../assets/ecg-wave.svg';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgSpo2Wave from '../../assets/spo2-wave.svg';
import imgTempWave from '../../assets/temp-wave.svg';
import { BackButton, Badge, Card, Divider, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';

type Signal = { label: string; value: string; unit: string; color: string; wave: string; alert?: boolean; ecg?: boolean; full?: boolean };

const SIGNALS: Signal[] = [
  { label: 'ECG II', value: '134', unit: 'bpm', color: 'text-[#22c55e]', wave: imgEcgWave, ecg: true, full: true },
  { label: 'Temp', value: '38.5', unit: '°C', color: 'text-white', wave: imgTempWave, alert: true },
  { label: 'SpO2', value: '89', unit: '%', color: 'text-[#06b6d4]', wave: imgSpo2Wave, alert: true },
  { label: 'PA', value: '140/90', unit: 'mmHg', color: 'text-[#eab308]', wave: imgBpWave, alert: true },
  { label: 'FR', value: '24', unit: 'rpm', color: 'text-[#eab308]', wave: imgBpWave, full: true },
];

const ALERTS = [
  ['SpO2 < 90%', 'Hace 5 min'],
  ['FC > 130 bpm', 'Hace 12 min'],
  ['Lactato elevado 4.2 mmol/L', 'Última medición'],
];

type Tile = { label: string; value: string; note?: string; danger?: boolean; wide?: boolean };

const SECTIONS: Array<{ title: string; cols: 2 | 3; tiles: Tile[] }> = [
  {
    title: 'Estado Neurológico',
    cols: 2,
    tiles: [
      { label: 'Glasgow', value: '8/15', note: 'O2 V3 M3' },
      { label: 'Pupilas', value: 'Isocóricas reactivas 3mm' },
      { label: 'Nivel de conciencia', value: 'Sedado', wide: true },
    ],
  },
  {
    title: 'Estado Respiratorio',
    cols: 2,
    tiles: [
      { label: 'Ventilación mecánica', value: 'Sí (modo SIMV)' },
      { label: 'PEEP', value: '8 cmH2O' },
      { label: 'FiO2', value: '60%' },
      { label: 'EtCO2', value: '38 mmHg' },
    ],
  },
  {
    title: 'Balance Hídrico y Renal',
    cols: 2,
    tiles: [
      { label: 'Diuresis última hora', value: '45 mL/h' },
      { label: 'Balance acumulado', value: '+850 mL' },
      { label: 'Cristaloides', value: '2500 mL' },
      { label: 'Hemoderivados', value: '2 UGRE' },
    ],
  },
  {
    title: 'Laboratorios Recientes',
    cols: 3,
    tiles: [
      { label: 'Hb', value: '9.2 g/dL' },
      { label: 'Hto', value: '28%' },
      { label: 'Lactato', value: '4.2 mmol/L', danger: true },
      { label: 'K+', value: '4.1 mEq/L' },
      { label: 'Glucosa', value: '142 mg/dL' },
      { label: 'Creatinina', value: '1.3 mg/dL' },
      { label: 'INR', value: '1.4' },
      { label: 'Plaquetas', value: '145,000' },
    ],
  },
  {
    title: 'Perfusión y Hemodinamia',
    cols: 2,
    tiles: [
      { label: 'PAM', value: '68 mmHg' },
      { label: 'Llenado capilar', value: '3 seg' },
      { label: 'Norepinefrina', value: '0.15 mcg/kg/min', wide: true },
    ],
  },
];

const SideTitle = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">{children}</h2>;

function StatTile({ tile, cols }: { tile: Tile; cols: 2 | 3 }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-[10px] p-3 leading-[normal]',
        tile.danger ? 'bg-danger-soft text-danger' : 'bg-surface',
        tile.wide && (cols === 2 ? 'col-span-2' : ''),
      )}
    >
      <p className={cn('font-jakarta text-[11px] font-bold uppercase', !tile.danger && 'text-muted')}>{tile.label}</p>
      <p className={cn('font-jakarta', tile.note ? 'text-[18px] font-extrabold' : 'text-[14px]', tile.danger ? 'font-extrabold' : 'font-bold', !tile.danger && 'text-ink')}>
        {tile.value}
      </p>
      {tile.note && <p className="font-jakarta text-[12px] font-normal text-muted">{tile.note}</p>}
    </div>
  );
}

export default function MedPacienteMonitoreoDetallado() {
  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Monitoreo" title="Monitoreo Detallado" tab="monitoreo" actions={<BackButton />}>
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        {/* El monitor lleva a las tendencias de signos vitales */}
        <Link to="/MedPacienteTendenciasVitales" className="w-full min-w-0 xl:max-w-[707px] xl:flex-1" aria-label="Ver tendencias de signos vitales">
          <div className="flex w-full flex-col gap-[14px] rounded-xl border border-white bg-white p-4 drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] sm:p-5">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-black">Monitor de Cama - Cama 03</h2>
            {SIGNALS.map((s) => (
              <div key={s.label} className={cn('flex w-full flex-col gap-[10px] rounded-[10px] bg-[#0b1220] p-3', s.full ? 'border border-white' : 'border-l-[3px] border-white')}>
                <div className="flex w-full items-center justify-between leading-[normal]">
                  <div className="flex items-center gap-2">
                    <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{s.label}</p>
                    {s.ecg && <img className="size-3.5" alt="" src={imgHeaderRowFrame} />}
                  </div>
                  <div className={cn('flex items-baseline gap-1.5', s.color)}>
                    <p className="font-jakarta text-[22px] font-extrabold">{s.value}</p>
                    <p className="font-jakarta text-[12px] font-bold">{s.unit}</p>
                    {s.alert && <img className="size-3.5 self-center" alt="Fuera de rango" src={imgAlertTriangle3} />}
                  </div>
                </div>
                <div className="relative h-14 w-full overflow-hidden rounded-lg border border-white bg-[#0b1220]">
                  <img className="absolute inset-x-0 top-0 h-9 w-full object-fill" alt="" src={s.wave} />
                </div>
              </div>
            ))}
          </div>
        </Link>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[443px] xl:shrink-0">
          <Card raised className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <SideTitle>Alertas Activas</SideTitle>
              <Badge tone="danger" size="sm">3</Badge>
            </div>
            <Divider />
            <ul className="flex w-full flex-col gap-3">
              {ALERTS.map(([title, when]) => (
                <li key={title} className="flex w-full items-center gap-[10px]">
                  <img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse2} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{title}</p>
                    <p className="font-jakarta text-[11px] font-normal text-muted">{when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {SECTIONS.map((section) => (
            <Card key={section.title} raised className="flex w-full flex-col gap-3">
              <SideTitle>{section.title}</SideTitle>
              <Divider />
              <div className={cn('grid w-full gap-3', section.cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2')}>
                {section.tiles.map((t) => (
                  <StatTile key={t.label} tile={t} cols={section.cols} />
                ))}
              </div>
              {section.title === 'Estado Respiratorio' && (
                <div className="flex w-full flex-col gap-1.5 rounded-[10px] bg-surface p-3 leading-[normal]">
                  <p className="font-jakarta text-[11px] font-bold uppercase text-muted">Última gasometría</p>
                  <div className="grid w-full grid-cols-3 gap-3">
                    {[
                      ['pH', '7.32'],
                      ['PaO2', '85'],
                      ['PaCO2', '42'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <p className="font-jakarta text-[11px] font-normal text-muted">{label}</p>
                        <p className="font-jakarta text-[14px] font-bold text-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
