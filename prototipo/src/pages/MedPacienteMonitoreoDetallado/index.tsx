// Pantalla "med/paciente/monitoreo-detallado" (Figma node 6:267) — generada desde el diseño original de Figma.
// FC, SpO2 y FR: últimas lecturas del seed (GET /monitoring/beds); alertas agrupadas del equipo.
// PA, temperatura y los paneles de la derecha no existen en el backend (src/api/sinBackend.ts).
import { useAlerts, useMonitoredBeds } from '../../api/queries';
import { getMonitoreoExtra, getSignosExtra, useExtra } from '../../api/sinBackend';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAlertTriangle3 from '../../assets/alert-triangle-3.svg';
import imgBpWave from '../../assets/bp-wave.svg';
import imgEcgWave from '../../assets/ecg-wave.svg';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgSpo2Wave from '../../assets/spo2-wave.svg';
import imgTempWave from '../../assets/temp-wave.svg';
import { AiIdeasCard, AppLink, BackButton, Badge, Card, Divider, PatientLayout, usePatient, type PatientView } from '../../components';
import { alertTitle, groupAlerts, vitalTone } from '../../lib/alerts';
import { fmtAgo } from '../../lib/clinical';
import { cn } from '../../lib/cn';

type Signal = { label: string; value: string; unit: string; color: string; wave: string; alert?: boolean; ecg?: boolean; full?: boolean };

type Tile = { label: string; value: string; note?: string; danger?: boolean; wide?: boolean };

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
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Monitoreo`} title="Monitoreo Detallado" tab="monitoreo" actions={<BackButton />}>
      {view && <Monitoreo v={view} />}
    </PatientLayout>
  );
}

function Monitoreo({ v }: { v: PatientView }) {
  const device = v.assigned?.device ?? undefined;
  const bed = useMonitoredBeds().data?.find((b) => b.patientId === v.id);
  const vitals = bed?.vitals;
  const signos = useExtra('signos', v.cedula, getSignosExtra).data;
  const extra = useExtra('monitoreo', v.cedula, getMonitoreoExtra).data;
  const alerts = useAlerts({ device, limit: 500 }, !!device);
  const groups = groupAlerts(alerts.data ?? []);
  const out = (tone: string) => tone !== 'normal';

  const signals: Signal[] = [
    { label: 'ECG II', value: String(vitals?.hr ?? '—'), unit: 'bpm', color: 'text-[#22c55e]', wave: imgEcgWave, ecg: true, full: true, alert: out(vitalTone('hr', vitals?.hr)) },
    { label: 'Temp', value: signos ? signos.temp.toFixed(1) : '—', unit: '°C', color: 'text-white', wave: imgTempWave, alert: out(vitalTone('temp', signos?.temp)) },
    { label: 'SpO2', value: String(vitals?.spo2 ?? '—'), unit: '%', color: 'text-[#06b6d4]', wave: imgSpo2Wave, alert: out(vitalTone('spo2', vitals?.spo2)) },
    { label: 'PA', value: signos ? `${signos.pa.sis}/${signos.pa.dia}` : '—', unit: 'mmHg', color: 'text-[#eab308]', wave: imgBpWave, alert: out(vitalTone('pa', signos?.pa.sis)) },
    { label: 'FR', value: String(vitals?.resp ?? '—'), unit: 'rpm', color: 'text-[#eab308]', wave: imgBpWave, full: true, alert: out(vitalTone('resp', vitals?.resp)) },
  ];

  const glasgow = v.assigned?.glasgow;
  const sections: Array<{ title: string; cols: 2 | 3; tiles: Tile[] }> = extra
    ? [
        {
          title: 'Estado Neurológico',
          cols: 2,
          tiles: [
            { label: 'Glasgow', value: glasgow ? `${glasgow}/15` : 'Pendiente', note: glasgow ? extra.glasgowDetalle : 'Sin exploración física' },
            { label: 'Pupilas', value: extra.pupilas },
            { label: 'Nivel de conciencia', value: extra.conciencia, wide: true },
          ],
        },
        {
          title: 'Estado Respiratorio',
          cols: 2,
          tiles: [
            { label: 'Ventilación mecánica', value: extra.ventilacion },
            { label: 'PEEP', value: extra.peep },
            { label: 'FiO2', value: extra.fio2 },
            { label: 'EtCO2', value: extra.etco2 },
          ],
        },
        {
          title: 'Balance Hídrico y Renal',
          cols: 2,
          tiles: [
            { label: 'Diuresis última hora', value: extra.diuresis },
            { label: 'Balance acumulado', value: extra.balance },
            { label: 'Cristaloides', value: extra.cristaloides },
            { label: 'Hemoderivados', value: extra.hemoderivados },
          ],
        },
        {
          title: 'Laboratorios Recientes',
          cols: 3,
          tiles: extra.laboratorios.map(([label, value, danger]) => ({ label, value, danger })),
        },
        {
          title: 'Perfusión y Hemodinamia',
          cols: 2,
          tiles: [
            { label: 'PAM', value: signos ? `${signos.pam} mmHg` : '—', danger: (signos?.pam ?? 99) < 65 },
            { label: 'Llenado capilar', value: extra.llenadoCapilar },
            { label: extra.vasoactivo[0], value: extra.vasoactivo[1], wide: true },
          ],
        },
      ]
    : [];

  return (
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-4 xl:max-w-[707px] xl:flex-1">
        {/* El monitor lleva a las tendencias de signos vitales */}
        <AppLink to="/MedPacienteTendenciasVitales" className="w-full min-w-0" aria-label="Ver tendencias de signos vitales">
          <div className="flex w-full flex-col gap-[14px] rounded-xl border border-white bg-white p-4 drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] sm:p-5">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-black">{`Monitor de Cama - Cama ${v.bed ?? '—'}`}</h2>
            {signals.map((s) => (
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
        </AppLink>
        {/* No viene de Figma (PR 3): ideas de la IA bajo el monitor, solo con el paciente crítico (como BedMonitorPage). */}
        {v.state === 'critico' && <AiIdeasCard variant="compact" patientId={v.id} cedula={v.cedula} />}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[443px] xl:shrink-0">
          <Card raised className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <SideTitle>Alertas Activas</SideTitle>
              <Badge tone={groups.length ? 'danger' : 'neutral'} size="sm">{groups.length}</Badge>
            </div>
            <Divider />
            <ul className="flex w-full flex-col gap-3">
              {groups.map((g) => (
                <li key={g.key} className="flex w-full items-center gap-[10px]">
                  <img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse2} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{alertTitle(g.variable, g.severity, g.latest.value)}</p>
                    <p className="font-jakarta text-[11px] font-normal text-muted">{`${g.count} ${g.count === 1 ? 'aviso' : 'avisos'} · el último ${fmtAgo(g.latest.at)}`}</p>
                  </div>
                </li>
              ))}
              {groups.length === 0 && <li className="font-jakarta text-[13px] text-muted">{alerts.isPending ? 'Cargando…' : 'Sin alertas activas.'}</li>}
            </ul>
          </Card>

          {sections.map((section) => (
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
                      ['pH', extra?.gasometria.ph ?? '—'],
                      ['PaO2', extra?.gasometria.pao2 ?? '—'],
                      ['PaCO2', extra?.gasometria.paco2 ?? '—'],
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
  );
}
