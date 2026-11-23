import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Padding = 'none' | 'sm' | 'md' | 'lg';

const paddings: Record<Padding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** none = 0, sm = 16 px, md = 20 px (por defecto), lg = 24 px. */
  padding?: Padding;
  /** Sombra suave como en las tarjetas destacadas de Figma. */
  raised?: boolean;
};

/** Tarjeta blanca con borde y esquinas redondeadas (12 px). */
export function Card({ padding = 'md', raised, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-line bg-white',
        paddings[padding],
        raised && 'drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Línea divisoria de 1 px que no ocupa alto (igual que las líneas de Figma). */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-0 w-full shrink-0', className)} role="separator">
      <div className="absolute inset-x-0 -top-px h-px bg-line" />
    </div>
  );
}

/** Título de sección dentro de una tarjeta (16 px, extra negrita). */
export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('font-jakarta text-[16px] font-extrabold leading-[normal] text-ink', className)}>{children}</h2>;
}

type CardHeaderProps = {
  title: ReactNode;
  /** Texto pequeño bajo el título. */
  subtitle?: ReactNode;
  /** Elementos a la derecha (botones, badges…). */
  actions?: ReactNode;
  className?: string;
};

/** Encabezado de tarjeta: título a la izquierda y acciones a la derecha. */
export function CardHeader({ title, subtitle, actions, className }: CardHeaderProps) {
  return (
    <div className={cn('flex w-full flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex min-w-0 flex-col gap-1 leading-[normal]">
        <h2 className="font-jakarta text-[16px] font-extrabold text-ink">{title}</h2>
        {subtitle && <p className="font-jakarta text-[12px] font-medium text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
