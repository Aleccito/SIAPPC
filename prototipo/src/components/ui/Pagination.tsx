import { cn } from '../../lib/cn';

type PaginationProps = {
  /** Texto a la izquierda, ej. "Mostrando 1-6 de 24 entregas". */
  summary: string;
  page: number;
  pages: number;
  onChange?: (page: number) => void;
  className?: string;
};

const pill = 'rounded-md border px-3 py-1.5 font-jakarta text-[12px] leading-[normal] transition-colors';

/** Paginación: resumen a la izquierda, botones de página a la derecha. */
export function Pagination({ summary, page, pages, onChange, className }: PaginationProps) {
  const visible = pages <= 4 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, 'gap' as const, pages];
  return (
    <div className={cn('flex w-full flex-wrap items-center justify-between gap-3', className)}>
      <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">{summary}</p>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Paginación">
        <button type="button" className={cn(pill, 'border-line px-2.5 font-semibold text-muted hover:bg-surface')} onClick={() => onChange?.(Math.max(1, page - 1))}>
          Anterior
        </button>
        {visible.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="font-jakarta text-[12px] text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange?.(p)}
              className={cn(pill, p === page ? 'border-primary bg-primary font-bold text-white' : 'border-line font-semibold text-muted hover:bg-surface')}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" className={cn(pill, 'border-line px-2.5 font-semibold text-muted hover:bg-surface')} onClick={() => onChange?.(Math.min(pages, page + 1))}>
          Siguiente
        </button>
      </nav>
    </div>
  );
}
