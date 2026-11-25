// La curva de un signo en el monitor de cama: sus lecturas de los últimos minutos (src/api/sinBackend.ts, getSerie),
// que avanza con cada lectura nueva. Reemplaza los trazos fijos de Figma, que eran una línea recta en diagonal.
// FC, SpO2, FR y temperatura son lecturas del monitor; la PA, simulada (pedido 10 de CONEXION-BACKEND.md).
import { cn } from '../../lib/cn';

type Curva = { puntos: Array<[number, number]>; opacidad?: number };

/**
 * `minimo`: el rango vertical más chico que se dibuja (en unidades del signo), para que el ruido de una lectura a
 * otra no parezca un cambio grande: FC 20 lpm, SpO2 6 %, FR 8 rpm, temperatura 1 °C, PA 30 mmHg.
 */
export function CurvaSigno({ curvas, minimo, label, className }: { curvas: Curva[]; minimo: number; label: string; className?: string }) {
  const todos = curvas.flatMap((c) => c.puntos);
  if (todos.length < 2) {
    return <p className={cn('flex h-full items-center justify-center font-jakarta text-[12px] font-semibold text-subtle', className)}>Sin lecturas recientes</p>;
  }
  const t0 = Math.min(...todos.map(([t]) => t));
  const t1 = Math.max(...todos.map(([t]) => t));
  let lo = Math.min(...todos.map(([, v]) => v));
  let hi = Math.max(...todos.map(([, v]) => v));
  if (hi - lo < minimo) {
    const medio = (hi + lo) / 2;
    lo = medio - minimo / 2;
    hi = medio + minimo / 2;
  }
  const x = (t: number) => ((t - t0) / Math.max(1, t1 - t0)) * 100;
  const y = (v: number) => 4 + (1 - (v - lo) / (hi - lo)) * 32;
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn('h-full w-full', className)} role="img" aria-label={label}>
      {curvas.map((c, i) => (
        <polyline
          key={i}
          points={c.puntos.map(([t, v]) => `${x(t).toFixed(2)},${y(v).toFixed(2)}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeOpacity={c.opacidad ?? 1}
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
