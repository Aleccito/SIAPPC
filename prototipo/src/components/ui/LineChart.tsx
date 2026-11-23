// Gráfica de líneas dibujada sobre un lienzo de tamaño fijo (el de Figma) que se
// estira al ancho disponible: las líneas se escalan y los puntos mantienen su tamaño.
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type LineSeries = {
  color: string;
  /** Puntos [x, y] en coordenadas del lienzo. */
  points: Array<[number, number]>;
  /** Imagen del punto (círculo). Sin ella no se dibujan puntos. */
  marker?: string;
  markerSize?: number;
  strokeWidth?: number;
};

type LineChartProps = {
  /** Tamaño del lienzo original (px). El alto se mantiene; el ancho se estira. */
  width: number;
  height: number;
  series: LineSeries[];
  /** Líneas horizontales de fondo (y). */
  grid?: number[];
  gridClassName?: string;
  /** Líneas de límite: y + imagen (línea punteada exportada de Figma). */
  limits?: Array<{ y: number; src: string }>;
  label: string;
  className?: string;
  /** Elementos extra posicionados sobre la gráfica (etiquetas, globos). */
  children?: ReactNode;
};

/** Convierte una x del lienzo a porcentaje del ancho (para posicionar sobre la gráfica). */
export const chartX = (x: number, width: number) => `${(x / width) * 100}%`;

export function LineChart({ width, height, series, grid = [], gridClassName = 'bg-ink-soft', limits = [], label, className, children }: LineChartProps) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)} style={{ height }} role="img" aria-label={label}>
      {grid.map((y) => (
        <div key={`g${y}`} className={cn('absolute inset-x-0 h-px', gridClassName)} style={{ top: y - 1 }} />
      ))}
      {limits.map((l) => (
        <img key={`l${l.y}`} className="absolute inset-x-0 h-0.5 w-full" style={{ top: l.y - 1 }} alt="" src={l.src} />
      ))}
      <svg className="absolute inset-0 size-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {series.map((s, i) => (
          <polyline
            key={i}
            points={s.points.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={s.strokeWidth ?? 1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {series.map((s, si) =>
        s.marker
          ? s.points.map(([x, y]) => (
              <img
                key={`${si}-${x}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: chartX(x, width), top: y, width: s.markerSize ?? 8, height: s.markerSize ?? 8 }}
                alt=""
                src={s.marker}
              />
            ))
          : null,
      )}
      {children}
    </div>
  );
}
