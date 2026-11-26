// Flecha de tendencia junto a un signo vital ("FC 132 ↑"). Era el carácter ↑ / ↓, que depende de la fuente del sistema;
// ahora es un SVG en línea (REVISION-DETALLES.md, A2). Para lectores de pantalla dice "alto" o "bajo".
import { IconArrowDown, IconArrowUp } from '../icons';

export type Direccion = 'up' | 'down' | null;

export function Flecha({ dir, size = 12 }: { dir: Direccion; size?: number }) {
  if (!dir) return null;
  const Icon = dir === 'up' ? IconArrowUp : IconArrowDown;
  return (
    <span className="inline-flex items-center align-[-1px]">
      <Icon size={size} />
      <span className="sr-only">{dir === 'up' ? ' (alto)' : ' (bajo)'}</span>
    </span>
  );
}

/** FC alta (> 100) o baja (< 60); SpO2 baja (< 95). Las mismas reglas que tenían las flechas de texto. */
export const direccionFc = (hr: number | null | undefined): Direccion => (hr == null ? null : hr > 100 ? 'up' : hr < 60 ? 'down' : null);
export const direccionSpo2 = (spo2: number | null | undefined): Direccion => (spo2 != null && spo2 < 95 ? 'down' : null);
