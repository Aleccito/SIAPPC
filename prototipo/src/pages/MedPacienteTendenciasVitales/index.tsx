// Pantalla "med/paciente/tendencias-vitales" (Figma node 140:6) — generada desde el diseño original de Figma.
// Cada lectura en su hora real (src/api/sinBackend.ts, getSerie): FC, SpO2, FR y temperatura del monitor; la PA,
// simulada. El backend entrega hasta 500 lecturas por signo y sin filtro de fecha, así que en los rangos largos la
// gráfica dice desde cuándo hay datos (CONEXION-BACKEND.md, pedido 9). Se vuelve a pedir cada 30 s.
import { useState } from 'react';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgChartCanvasEllipse from '../../assets/chart-canvas-ellipse.svg';
import imgChartCanvasEllipse2 from '../../assets/chart-canvas-ellipse-2.svg';
import imgChartCanvasEllipse3 from '../../assets/chart-canvas-ellipse-3.svg';
import { getSerie, useExtra, type PuntoTendencia, type Signo } from '../../api/sinBackend';
import { AppLink, Card, IconArrowLeft, PatientLayout, type PatientView, usePatient } from '../../components';
import { vitalTone } from '../../lib/alerts';
import { cn } from '../../lib/cn';
import { TrendChart, type TrendSeries } from './TrendChart';

const RANGES = ['6h', '12h', '24h', '48h', '7d'];
const HOURS: Record<string, number> = { '6h': 6, '12h': 12, '24h': 24, '48h': 48, '7d': 168 };
const RANGE_TEXT: Record<string, string> = { '6h': '6 horas', '12h': '12 horas', '24h': '24 horas', '48h': '48 horas', '7d': '7 días' };
const X = [20, 114, 209, 303, 398, 492];
const W = 512;
const H = 110;
/** Con menos puntos que esto se dibuja cada lectura con su marcador. */
const POCOS = 16;

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const pad = (n: number) => String(n).padStart(2, '0');
/** Marca del eje X según el rango: "06:00", "Lun 08:00" o "18 Nov". */
function axisLabel(at: number, range: string): string {
  const d = new Date(at);
  if (range === '7d') return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return range === '48h' ? `${DAYS[d.getDay()]} ${time}` : time;
}

type ChartDef = {
  title: string;
  unit: string;
  /** Escala vertical de la gráfica. */
  lo: number;
  hi: number;
  /** Límites dibujados (los umbrales de alerta del backend, y los de PA/temperatura de la pantalla de umbrales). */
  limits: number[];
  keys: Signo[];
  tone: (p: PuntoTendencia) => 'danger' | 'warning' | 'normal';
  status: (p: PuntoTendencia, tone: 'danger' | 'warning' | 'normal') => string;
  value: (p: PuntoTendencia) => string;
};

const CHARTS: ChartDef[] = [
  {
    title: 'FC (Frecuencia Cardíaca)',
    unit: 'bpm',
    lo: 30,
    hi: 170,
    limits: [120],
    keys: ['hr'],
    tone: (p) => vitalTone('hr', p.hr),
    status: (p, t) => (t === 'normal' ? 'En rango' : (p.hr ?? 0) > 100 ? `${t === 'danger' ? 'Alerta' : 'Advertencia'} Taquicardia` : `${t === 'danger' ? 'Alerta' : 'Advertencia'} Bradicardia`),
    value: (p) => String(p.hr ?? '—'),
  },
  {
    title: 'SpO2 (Saturación de Oxígeno)',
    unit: '%',
    lo: 75,
    hi: 100,
    limits: [90],
    keys: ['spo2'],
    tone: (p) => vitalTone('spo2', p.spo2),
    status: (_, t) => (t === 'danger' ? 'Alerta Desaturación' : t === 'warning' ? 'Advertencia Desaturación' : 'En rango'),
    value: (p) => String(p.spo2 ?? '—'),
  },
  {
    title: 'PA (Presión Arterial)',
    unit: 'mmHg',
    lo: 30,
    hi: 190,
    limits: [160, 90],
    keys: ['sis', 'dia'],
    tone: (p) => vitalTone('pa', p.sis),
    status: (p, t) => (t === 'normal' ? 'En rango' : (p.sis ?? 120) < 100 ? 'Hipotensión' : 'PA Elevada'),
    value: (p) => (p.sis === null ? '—' : `${p.sis}/${p.dia ?? '—'}`),
  },
  {
    title: 'Temperatura',
    unit: '°C',
    lo: 35,
    hi: 40,
    limits: [38],
    keys: ['temp'],
    tone: (p) => vitalTone('temp', p.temp),
    status: (p, t) => (t === 'danger' ? ((p.temp ?? 37) < 36 ? 'Hipotermia' : 'Estado Febril') : t === 'warning' ? 'Febrícula' : 'Afebril'),
    value: (p) => (p.temp === null ? '—' : p.temp.toFixed(1)),
  },
];

const SERIES_STYLE = [
  { color: '#2563EB', marker: imgChartCanvasEllipse },
  { color: '#8B5CF6', marker: imgChartCanvasEllipse3 },
];
const PA_STYLE = [
  { color: '#06B6D4', marker: imgChartCanvasEllipse2 },
  { color: '#8B5CF6', marker: imgChartCanvasEllipse3 },
];

export default function MedPacienteTendenciasVitales() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Tendencias`} title="Tendencias de Signos Vitales" tab="monitoreo">
      {view && <Tendencias v={view} />}
    </PatientLayout>
  );
}

function Tendencias({ v }: { v: PatientView }) {
  const [range, setRange] = useState('24h');
  const hours = HOURS[range];
  const data = useExtra(`serie-${range}`, v.cedula, (c) => getSerie(c, hours, v.assigned?.device));
  const serie = data.data ?? null;
  const u = serie?.ultimo ?? {};
  // El último valor de cada signo, con la forma que esperan los tonos y los textos de cada gráfica.
  const last: PuntoTendencia | null = serie
    ? { at: new Date(serie.hasta).toISOString(), hr: u.hr ?? null, spo2: u.spo2 ?? null, resp: u.resp ?? null, sis: u.sis ?? null, dia: u.dia ?? null, temp: u.temp ?? null }
    : null;
  const desde = serie?.desde ?? Date.now() - hours * 3_600_000;
  const hasta = serie?.hasta ?? Date.now();
  // Marcas del eje: 6 instantes repartidos en el rango.
  const axis = X.map((_, i) => axisLabel(desde + (i / 5) * (hasta - desde), range));
  const x = (t: number) => 8 + ((t - desde) / Math.max(1, hasta - desde)) * (W - 16);
  const y = (c: ChartDef, value: number) => Math.round(8 + (1 - (Math.min(c.hi, Math.max(c.lo, value)) - c.lo) / (c.hi - c.lo)) * (H - 16));
  const hora = (t: number) => {
    const d = new Date(t);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <AppLink to="/MedPacienteMonitoreoDetallado" className="flex items-center gap-2 font-jakarta text-[14px] font-bold leading-[normal] text-primary hover:underline">
          <IconArrowLeft size={16} />
          Volver a Monitoreo en Vivo
        </AppLink>
        <div className="flex gap-1 rounded-lg border border-line bg-white p-1" role="group" aria-label="Rango de tiempo">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={r === range}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-[14px] py-1.5 font-jakarta text-[13px] font-semibold leading-[normal] transition-colors',
                r === range ? 'bg-primary text-white' : 'text-muted hover:bg-surface hover:text-ink',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        {CHARTS.map((c) => {
          const tone = last ? c.tone(last) : 'normal';
          const styles = c.keys.length > 1 ? PA_STYLE : SERIES_STYLE;
          const series: TrendSeries[] = c.keys.flatMap((k, n) => {
            const pts = (serie?.series[k] ?? []).map(([t, val]) => [x(t), y(c, val)] as [number, number]);
            const ultimoPunto = pts.at(-1);
            // Con pocas lecturas, un marcador en cada una; con muchas, solo en la última.
            return [
              { color: styles[n].color, points: pts, marker: pts.length <= POCOS ? styles[n].marker : undefined },
              ...(ultimoPunto && pts.length > POCOS ? [{ color: styles[n].color, points: [ultimoPunto], marker: styles[n].marker }] : []),
            ];
          });
          const limitY = c.limits.map((l) => y(c, l));
          const lastValue = last?.[c.keys[0]] ?? null;
          const lastY = lastValue !== null ? y(c, lastValue) : 0;
          const lastX = serie?.series[c.keys[0]].at(-1)?.[0];
          // Desde cuándo hay lecturas del monitor, si empiezan bastante después del inicio del rango.
          const primera = serie && serie.reales.includes(c.keys[0]) ? serie.series[c.keys[0]][0]?.[0] : undefined;
          const avisoDesde = primera !== undefined && primera - desde > (hasta - desde) * 0.05 ? `Lecturas del monitor desde las ${hora(primera)}` : null;
          const simulada = serie && !serie.reales.includes(c.keys[0]);
          return (
            <Card key={c.title} className="flex min-w-0 flex-col gap-4">
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 leading-[normal]">
                  <h2 className="font-jakarta text-[14px] font-bold text-muted">{c.title}</h2>
                  <div className="flex items-center gap-1.5">
                    {tone === 'normal' ? (
                      <span className="size-2 rounded-full bg-success" aria-hidden="true" />
                    ) : (
                      <img className="size-2" alt="" src={tone === 'danger' ? imgAlertTextEllipse2 : imgAlertTextEllipse} />
                    )}
                    <p className={cn('font-jakarta text-[12px] font-semibold', tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-success')}>
                      {last ? c.status(last, tone) : '—'}
                    </p>
                  </div>
                </div>
                <p className="flex items-baseline gap-1 whitespace-nowrap leading-[normal]">
                  <span className={cn('font-jakarta text-[28px] font-extrabold', tone === 'danger' ? 'text-danger' : 'text-ink')}>{last ? c.value(last) : '—'}</span>
                  <span className="font-jakarta text-[14px] font-semibold text-muted">{c.unit}</span>
                </p>
              </div>
              <TrendChart
                label={`Tendencia de ${c.title} en ${RANGE_TEXT[range]}`}
                series={series}
                limits={limitY}
                limitLabel={c.keys.length === 1 ? { text: `Límite: ${c.limits[0]}`, y: Math.max(0, limitY[0] - 12) } : undefined}
                tooltip={last && c.keys.length === 1 && lastValue !== null ? { text: c.value(last), y: Math.max(1, lastY - 14), x: lastX !== undefined ? Math.min(x(lastX), W - 40) - 20 : undefined } : undefined}
              />
              {(avisoDesde || simulada) && (
                <p className="-mt-2 font-jakarta text-[11px] font-medium leading-[normal] text-muted">
                  {[avisoDesde, simulada && 'Valores simulados: el monitor no mide este signo'].filter(Boolean).join(' · ')}
                </p>
              )}
              <div className="flex w-full justify-between font-jakarta text-[10px] font-normal leading-[normal] text-subtle">
                {axis.map((h, i) => (
                  <span key={`${h}-${i}`}>{h}</span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
