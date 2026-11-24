// Retrasos realistas del simulador. Con ?retraso=0 no hay espera (pruebas y capturas).
import { mockFlags } from './flags';

export type DelayKind = 'lista' | 'detalle' | 'escritura';

const RANGE: Record<DelayKind, [number, number]> = {
  lista: [250, 600],
  detalle: [150, 350],
  escritura: [400, 800],
};

export function delayFor(kind: DelayKind): number {
  if (mockFlags().retraso === '0') return 0;
  const [min, max] = RANGE[kind];
  return Math.round(min + Math.random() * (max - min));
}

export function wait(ms: number, signal?: AbortSignal | null): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('La petición se canceló', 'AbortError'));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('La petición se canceló', 'AbortError'));
    });
  });
}
