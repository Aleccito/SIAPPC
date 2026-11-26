// Pantalla "med/paciente/monitoreo-detallado" (Figma node 6:267) — generada desde el diseño original de Figma.
// FC, SpO2 y FR: últimas lecturas del seed (GET /monitoring/beds); alertas agrupadas del equipo.
// PA, temperatura y los paneles de la derecha no existen en el backend (src/api/sinBackend.ts).
import { useAlerts, useMonitoredBeds } from '../../api/queries';
import { getMonitoreoExtra, getSerie, getSignosExtra, useExtra, type Signo } from '../../api/sinBackend';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import { AiIdeasCard, AppLink, Badge, Card, Divider, IconActivity, IconAlertTriangle, PatientLayout, type PatientView, usePatient } from '../../components';
import type { ReactNode } from 'react';
import { CurvaSigno } from '../../components/monitor/CurvaSigno';
import { RegistrarExploracion } from '../../components/patient/RegistrarExploracion';
import { EcgLive } from '../../components/monitor/EcgLive';
import { alertTitle, esActiva, groupAlerts, vitalTone } from '../../lib/alerts';
import { AnterioresSinAtender } from '../../components/ui/AnterioresSinAtender';
import { fmtAgo } from '../../lib/clinical';
import { cn } from '../../lib/cn';

/** `curva`: los signos que dibuja la fila (la PA son dos: sistólica y diastólica). La fila del ECG lleva la onda real. */
type Signal = { label: string; value: string; unit: string; color: string; curva: Signo[]; minimo: number; alert?: boolean; ecg?: boolean; full?: boolean };

/** `hora`: cuándo llegó el resultado (laboratorios y gasometría). */
type Tile = { label: string; value: string; note?: string; danger?: boolean; wide?: boolean; action?: ReactNode; hora?: string };

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
      {tile.hora && <p className={cn('font-jakarta text-[11px] font-medium', tile.danger ? 'opacity-80' : 'text-muted')}>{tile.hora}</p>}
      {tile.action}
    </div>
  );
}

export default function MedPacienteMonitoreoDetallado() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Monitoreo`} title="Monitoreo Detallado" tab="monitoreo">
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
  // Las curvas del monitor: los últimos 30 min de cada signo, se vuelven a pedir cada 15 s.
  const curva = useExtra('curva-30m', v.cedula, (c) => getSerie(c, 0.5, device ?? bed?.device)).data;
  const alerts = useAlerts({ device, limit: 500 }, !!device);
  const todas = groupAlerts(alerts.data ?? []);
  // Activas: con un aviso en los últimos 30 min; las demás sin atender van plegadas.
  const groups = todas.filter((g) => esActiva(g));
  const anteriores = todas.filter((g) => !esActiva(g));
  const out = (tone: string) => tone !== 'normal';

  const signals: Signal[] = [
    { label: 'ECG II', value: String(vitals?.hr ?? '—'), unit: 'bpm', color: 'text-[#22c55e]', curva: ['hr'], minimo: 20, ecg: true, full: true, alert: out(vitalTone('hr', vitals?.hr)) },
    { label: 'Temp', value: signos ? signos.temp.toFixed(1) : '—', unit: '°C', color: 'text-white', curva: ['temp'], minimo: 1, alert: out(vitalTone('temp', signos?.temp)) },
    { label: 'SpO2', value: String(vitals?.spo2 ?? '—'), unit: '%', color: 'text-[#06b6d4]', curva: ['spo2'], minimo: 6, alert: out(vitalTone('spo2', vitals?.spo2)) },
    { label: 'PA', value: signos ? `${signos.pa.sis}/${signos.pa.dia}` : '—', unit: 'mmHg', color: 'text-[#eab308]', curva: ['sis', 'dia'], minimo: 30, alert: out(vitalTone('pa', signos?.pa.sis)) },
    { label: 'FR', value: String(vitals?.resp ?? '—'), unit: 'rpm', color: 'text-[#eab308]', curva: ['resp'], minimo: 8, full: true, alert: out(vitalTone('resp', vitals?.resp)) },
  ];

  const glasgow = v.assigned?.glasgow;
  const sections: Array<{ title: string; cols: 2 | 3; tiles: Tile[] }> = extra
    ? [
        {
          title: 'Estado Neurológico',
          cols: 2,
          tiles: [
            {
              label: 'Glasgow',
              value: glasgow ? `${glasgow}/15` : 'Pendiente',
              note: glasgow ? extra.glasgowDetalle : 'Sin exploración física',
              action: glasgow ? undefined : <RegistrarExploracion cedula={v.cedula} />,
            },
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
          // Resultados simulados: cambian solo cuando "llega" uno nuevo, cada 1 a 2 h, con su hora.
          tiles: extra.laboratorios.map(([label, value, danger, at]) => ({ label, value, danger, hora: `Resultado ${fmtAgo(new Date(at).toISOString())}` })),
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
      // Las columnas crecen con la pantalla: con los anchos fijos de Figma (707 + 443 px) quedaban ~480 px libres a 1920.
      // Desde 1600 px los paneles de la derecha van en dos columnas (docs/historial/REVISION-DETALLES.md, A1).
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
        {/* El monitor lleva a las tendencias de signos vitales */}
        <AppLink to="/MedPacienteTendenciasVitales" className="w-full min-w-0" aria-label="Ver tendencias de signos vitales">
          <div className="flex w-full flex-col gap-[14px] rounded-xl border border-white bg-white p-4 drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] sm:p-5">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-black">{`Monitor de Cama - Cama ${v.bed ?? '—'}`}</h2>
            {signals.map((s) => (
              <div key={s.label} className={cn('flex w-full flex-col gap-[10px] rounded-[10px] bg-[#0b1220] p-3', s.full ? 'border border-white' : 'border-l-[3px] border-white')}>
                <div className="flex w-full items-center justify-between leading-[normal]">
                  <div className="flex items-center gap-2">
                    <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{s.label}</p>
                    {s.ecg && <IconActivity size={14} className="text-success" />}
                  </div>
                  <div className={cn('flex items-baseline gap-1.5', s.color)}>
                    <p className="font-jakarta text-[22px] font-extrabold">{s.value}</p>
                    <p className="font-jakarta text-[12px] font-bold">{s.unit}</p>
                    {s.alert && (
                      <span className="flex self-center">
                        <IconAlertTriangle size={14} />
                        <span className="sr-only">Fuera de rango</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-14 w-full overflow-hidden rounded-lg border border-white bg-[#0b1220]">
                  {/* El ECG es la onda real del equipo (GET /monitoring/:device/waveform); los demás, la curva de sus últimas lecturas. */}
                  {s.ecg ? (
                    <EcgLive device={device ?? bed?.device} />
                  ) : (
                    <div className={cn('absolute inset-1', s.color)}>
                      <CurvaSigno
                        label={`${s.label}: últimos 30 minutos`}
                        minimo={s.minimo}
                        curvas={s.curva.map((k, i) => ({ puntos: curva?.series[k] ?? [], opacidad: i ? 0.6 : 1 }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AppLink>
        {/* No viene de Figma (PR 3): ideas de la IA bajo el monitor, solo con el paciente crítico (como BedMonitorPage). */}
        {v.state === 'critico' && <AiIdeasCard variant="compact" patientId={v.id} cedula={v.cedula} />}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[443px] xl:shrink-0 min-[1600px]:block min-[1600px]:w-auto min-[1600px]:flex-[1.3] min-[1600px]:columns-2 min-[1600px]:gap-4 min-[1600px]:[&>*]:mb-4 min-[1600px]:[&>*]:break-inside-avoid">
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
            <AnterioresSinAtender cantidad={anteriores.length}>
              <ul className="flex w-full flex-col gap-3">
                {anteriores.map((g) => (
                  <li key={g.key} className="flex w-full items-center gap-[10px]">
                    <img className="size-2 shrink-0" alt="" src={imgAlertTextEllipse2} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                      <p className="font-jakarta text-[13px] font-bold text-ink">{alertTitle(g.variable, g.severity, g.latest.value)}</p>
                      <p className="font-jakarta text-[11px] font-normal text-muted">{`${g.count} ${g.count === 1 ? 'aviso' : 'avisos'} · el último ${fmtAgo(g.latest.at)}`}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </AnterioresSinAtender>
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
                  <div className="flex w-full items-baseline justify-between gap-2">
                    <p className="font-jakarta text-[11px] font-bold uppercase text-muted">Última gasometría</p>
                    {extra && <p className="font-jakarta text-[11px] font-medium text-muted">{fmtAgo(new Date(extra.gasometriaAt).toISOString())}</p>}
                  </div>
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
