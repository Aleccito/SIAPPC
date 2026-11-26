// Las alertas sin atender que ya no son activas (sin un aviso nuevo en los últimos 30 min, src/lib/alerts.ts), en una
// sección plegada debajo de las activas: siguen a la vista, pero no como si pasaran ahora (docs/historial/REVISION-MEDICO.md, 3.3).
import { IconChevronRight } from '../icons';
import type { ReactNode } from 'react';
import { VIGENCIA_ALERTA_MIN } from '../../lib/alerts';
import { cn } from '../../lib/cn';

export function AnterioresSinAtender({ cantidad, children, className }: { cantidad: number; children: ReactNode; className?: string }) {
  if (cantidad === 0) return null;
  return (
    <details className={cn('group w-full', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-1 py-1 font-jakarta text-[12px] font-bold leading-[normal] text-muted hover:text-ink">
        <span className="flex transition-transform group-open:rotate-90" aria-hidden="true">
          <IconChevronRight size={12} />
        </span>
        {`Anteriores sin atender (${cantidad})`}
        <span className="font-medium text-subtle">{`· sin avisos en ${VIGENCIA_ALERTA_MIN} min`}</span>
      </summary>
      <div className="mt-2 flex w-full flex-col gap-3 opacity-80">{children}</div>
    </details>
  );
}
