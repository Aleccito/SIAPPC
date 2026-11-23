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

/** Recuadro de texto largo de solo lectura (motivo, padecimiento, notas). */
export function TextBlock({ label, children, className }: { label?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label && <p className="font-jakarta text-[12px] font-bold uppercase leading-[normal] text-muted">{label}</p>}
      <div className="min-h-14 w-full rounded-lg border border-line bg-surface p-[14px] font-jakarta text-[13px] font-normal leading-[1.5] text-ink">{children}</div>
    </div>
  );
}
