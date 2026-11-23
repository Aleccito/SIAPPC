import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export type SegmentItem = { id: string; label: string; to?: string };

type SegmentedControlProps = {
  items: SegmentItem[];
  active: string;
  onChange?: (id: string) => void;
  /** Texto para lectores de pantalla, ej. "Vista". */
  label: string;
  className?: string;
};

/** Grupo de opciones pegadas (Grid/Lista, 6h/12h/24h…). La activa va en azul. */
export function SegmentedControl({ items, active, onChange, label, className }: SegmentedControlProps) {
  return (
    <div role="group" aria-label={label} className={cn('flex shrink-0 gap-1 rounded-lg border border-line bg-white p-1', className)}>
      {items.map((item) => {
        const isActive = item.id === active;
        const classes = cn(
          'rounded-md px-[14px] py-1.5 font-jakarta text-[13px] font-semibold leading-[normal] transition-colors',
          isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface hover:text-ink',
        );
        return item.to ? (
          <Link key={item.id} to={item.to} aria-current={isActive ? 'page' : undefined} className={classes}>
            {item.label}
          </Link>
        ) : (
          <button key={item.id} type="button" aria-pressed={isActive} onClick={() => onChange?.(item.id)} className={classes}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
