import { cn } from '../../lib/cn';
import { Button } from './Button';

type EmptyStateProps = {
  message?: string;
  /** Si se pasa, muestra el botón "Quitar filtros". */
  onReset?: () => void;
  className?: string;
};

/** Mensaje cuando un filtro deja una lista vacía. */
export function EmptyState({ message = 'Sin resultados con estos filtros.', onReset, className }: EmptyStateProps) {
  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-3 px-4 py-10 text-center', className)}>
      <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-muted">{message}</p>
      {onReset && (
        <Button variant="secondary" size="sm" onClick={onReset}>
          Quitar filtros
        </Button>
      )}
    </div>
  );
}
