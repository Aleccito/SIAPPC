// Pantalla "med/paciente/tendencias-vitales" (Figma node 140:6) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgArrowLeft4 from '../../assets/arrow-left-4.svg';
import imgChartCanvasEllipse from '../../assets/chart-canvas-ellipse.svg';
import imgChartCanvasEllipse2 from '../../assets/chart-canvas-ellipse-2.svg';
import imgChartCanvasEllipse3 from '../../assets/chart-canvas-ellipse-3.svg';
import { Card, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';
import { TrendChart, type TrendSeries } from './TrendChart';

const RANGES = ['6h', '12h', '24h', '48h', '7d'];
/** Marcas del eje X de cada rango (los puntos de las gráficas siguen siendo los de Figma). */
const AXIS: Record<string, string[]> = {
  '6h': ['02:00', '03:00', '04:00', '05:00', '06:00', '07:00'],
  '12h': ['20:00', '22:00', '00:00', '02:00', '04:00', '06:00'],
  '24h': ['08:00', '12:00', '16:00', '20:00', '00:00', '04:00'],
  '48h': ['Lun 08:00', 'Lun 16:00', 'Mar 00:00', 'Mar 08:00', 'Mar 16:00', 'Mié 00:00'],
  '7d': ['18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct'],
};
const RANGE_TEXT: Record<string, string> = { '6h': '6 horas', '12h': '12 horas', '24h': '24 horas', '48h': '48 horas', '7d': '7 días' };
const X = [20, 114, 209, 303, 398, 492];
const line = (ys: number[]): Array<[number, number]> => ys.map((y, i) => [X[i], y]);

const BLUE = { color: '#2563EB', marker: imgChartCanvasEllipse };

const CHARTS: Array<{
  title: string;
  status: string;
  danger?: boolean;
  value: string;
  unit: string;
  series: TrendSeries[];
  limits: number[];
  limitLabel?: { text: string; y: number };
  tooltip?: { text: string; y: number };
}> = [
  {
    title: 'FC (Frecuencia Cardíaca)',
    status: 'Alerta Taquicardia',
    danger: true,
    value: '112',
    unit: 'bpm',
    series: [{ ...BLUE, points: line([95, 86, 47, 15, 37, 43]) }],
    limits: [26],
    limitLabel: { text: 'Límite: 120', y: 14 },
    tooltip: { text: '112', y: 13 },
  },
  {
    title: 'SpO2 (Saturación de Oxígeno)',
    status: 'Advertencia Desaturación',
    value: '93',
    unit: '%',
    series: [{ ...BLUE, points: line([15, 38, 61, 95, 84, 72]) }],
    limits: [84],
    limitLabel: { text: 'Límite: 92', y: 72 },
    tooltip: { text: '93', y: 42 },
  },
  {
    title: 'PA (Presión Arterial)',
    status: 'PA Elevada',
    value: '145/92',
    unit: 'mmHg',
    series: [
      { color: '#06B6D4', marker: imgChartCanvasEllipse2, points: line([46, 42, 38, 28, 34, 36]).map(([x, y]) => [x + 1, y]) },
      { color: '#8B5CF6', marker: imgChartCanvasEllipse3, points: line([86, 84, 80, 76, 77, 78]).map(([x, y]) => [x + 1, y]) },
    ],
    limits: [23, 71],
  },
  {
    title: 'Temperatura',
    status: 'Estado Febril',
    value: '37.8',
    unit: '°C',
    series: [{ ...BLUE, points: line([95, 84, 63, 15, 26, 31]) }],
    limits: [20],
    limitLabel: { text: 'Límite: 38', y: 8 },
    tooltip: { text: '37.8', y: 1 },
  },
];

export default function MedPacienteTendenciasVitales() {
  const [range, setRange] = useState('24h');

  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Tendencias" title="Tendencias de Signos Vitales" tab="monitoreo">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <Link to="/MedPacienteMonitoreoDetallado" className="flex items-center gap-2 font-jakarta text-[14px] font-bold leading-[normal] text-primary hover:underline">
          <img className="size-4" alt="" src={imgArrowLeft4} />
          Volver a Monitoreo en Vivo
        </Link>
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
        {CHARTS.map((c) => (
          <Card key={c.title} className="flex min-w-0 flex-col gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5 leading-[normal]">
                <h2 className="font-jakarta text-[14px] font-bold text-muted">{c.title}</h2>
                <div className="flex items-center gap-1.5">
                  <img className="size-2" alt="" src={c.danger ? imgAlertTextEllipse2 : imgAlertTextEllipse} />
                  <p className={cn('font-jakarta text-[12px] font-semibold', c.danger ? 'text-danger' : 'text-warning')}>{c.status}</p>
                </div>
              </div>
              <p className="flex items-baseline gap-1 whitespace-nowrap leading-[normal]">
                <span className={cn('font-jakarta text-[28px] font-extrabold', c.danger ? 'text-danger' : 'text-ink')}>{c.value}</span>
                <span className="font-jakarta text-[14px] font-semibold text-muted">{c.unit}</span>
              </p>
            </div>
            <TrendChart label={`Tendencia de ${c.title} en ${RANGE_TEXT[range]}`} series={c.series} limits={c.limits} limitLabel={c.limitLabel} tooltip={c.tooltip} />
            <div className="flex w-full justify-between font-jakarta text-[10px] font-normal leading-[normal] text-subtle">
              {AXIS[range].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PatientLayout>
  );
}
