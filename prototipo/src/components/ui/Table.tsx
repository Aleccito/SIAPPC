import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type TableProps = {
  children: ReactNode;
  /**
   * Ancho mínimo de la tabla (px). Si la pantalla es más angosta, la tabla
   * se desplaza de lado dentro de su tarjeta en lugar de cortarse.
   */
  minWidth?: number;
  className?: string;
};

/** Contenedor de tabla con desplazamiento horizontal propio. */
export function Table({ children, minWidth = 720, className }: TableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="flex w-full flex-col" style={{ minWidth }}>
        {children}
      </div>
    </div>
  );
}

/** Fila de encabezado de tabla (texto pequeño en mayúsculas). */
export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full items-center border-b border-line bg-surface px-5 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Fila de datos de tabla. */
export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex w-full items-center border-b border-line px-5 py-4 last:border-b-0', className)}>{children}</div>;
}
