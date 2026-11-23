// Gráfica de tendencia de signos vitales (lienzo de 512×110 como en Figma).
import imgChartCanvasLinePng from '../../assets/chart-canvas-line.png';
import { chartX, LineChart, type LineSeries } from '../../components/ui/LineChart';

const W = 512;
const H = 110;

export type TrendSeries = LineSeries;

type TrendChartProps = {
  series: TrendSeries[];
  /** Alturas (px dentro del lienzo) de las líneas de límite. */
  limits: number[];
  limitLabel?: { text: string; y: number };
  /** Último valor, en la esquina derecha. */
  tooltip?: { text: string; y: number };
  label: string;
};

export function TrendChart({ series, limits, limitLabel, tooltip, label }: TrendChartProps) {
  return (
    <LineChart
      width={W}
      height={H}
      series={series}
      grid={[37, 73]}
      limits={limits.map((y) => ({ y, src: imgChartCanvasLinePng }))}
      label={label}
      className="rounded-lg bg-ink"
    >
      {limitLabel && (
        <p className="absolute left-[10px] whitespace-nowrap font-jakarta text-[9px] font-bold leading-[normal] text-danger" style={{ top: limitLabel.y }}>
          {limitLabel.text}
        </p>
      )}
      {tooltip && (
        <span className="absolute rounded bg-primary px-1.5 py-0.5 font-jakarta text-[10px] font-bold leading-[normal] text-white" style={{ left: chartX(452, W), top: tooltip.y }}>
          {tooltip.text}
        </span>
      )}
    </LineChart>
  );
}
