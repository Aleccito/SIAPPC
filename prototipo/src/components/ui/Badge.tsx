import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

const tones: Record<BadgeTone, { box: string; dot: string }> = {
  danger: { box: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  warning: { box: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  success: { box: 'bg-success-soft text-success', dot: 'bg-success' },
  info: { box: 'bg-primary-soft text-primary', dot: 'bg-primary' },
  neutral: { box: 'bg-[#f1f5f9] text-muted', dot: 'bg-subtle' },
};

const sizes: Record<BadgeSize, string> = {
  sm: 'gap-1 rounded px-2 py-1 text-[10px]',
  md: 'gap-1.5 rounded-md px-2.5 py-1 text-[12px]',
};

type BadgeProps = {
  tone?: BadgeTone;
  size?: BadgeSize;
  /** Punto de color antes del texto (estado). */
  dot?: boolean;
  className?: string;
  children: ReactNode;
};

/** Etiqueta de estado: Crítico, Estable, Cama C-03… */
export function Badge({ tone = 'neutral', size = 'md', dot, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap font-jakarta font-bold leading-[normal]',
        tones[tone].box,
        sizes[size],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 shrink-0 rounded-full', tones[tone].dot)} />}
      {children}
    </span>
  );
}
