import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type InfoFieldProps = {
  /** Etiqueta en mayúsculas sobre el valor. */
  label: ReactNode;
  children: ReactNode;
  /** box: valor dentro de un recuadro gris (por defecto). plain: solo texto. */
  variant?: 'box' | 'plain';
  className?: string;
};

/** Dato de solo lectura: etiqueta pequeña y valor (fecha, servicio, cama…). */
export function InfoField({ label, children, variant = 'box', className }: InfoFieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <p className="font-jakarta text-[11px] font-semibold uppercase leading-[normal] text-muted">{label}</p>
      <div className={cn('w-full font-jakarta text-[13px] font-semibold leading-[normal] text-ink', variant === 'box' && 'rounded-lg bg-surface p-3')}>{children}</div>
    </div>
  );
}
