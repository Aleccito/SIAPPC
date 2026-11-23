import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Badge, type BadgeTone } from './Badge';

type KpiTone = 'default' | 'danger' | 'warning' | 'success' | 'info';

const valueColor: Record<KpiTone, string> = {
  default: 'text-ink',
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
  info: 'text-primary',
};

const tintBg: Record<'none' | 'danger' | 'warning' | 'success', string> = {
  none: 'bg-white',
  danger: 'bg-danger-soft',
  warning: 'bg-warning-soft',
  success: 'bg-success-soft',
};

type KpiCardProps = {
  label: ReactNode;
  value: ReactNode;
  /** Unidad pequeña junto al valor (ej. "min"). */
  unit?: ReactNode;
  tone?: KpiTone;
  /** Etiqueta a la derecha del valor. */
  badge?: ReactNode;
  badgeTone?: BadgeTone;
  /** Texto gris a la derecha del valor (si no hay badge). */
  note?: ReactNode;
  /** Fondo de color suave para resaltar la tarjeta. */
  tint?: 'none' | 'danger' | 'warning' | 'success';
  /** Ícono a la derecha de la etiqueta. */
  icon?: ReactNode;
  className?: string;
};

/** Tarjeta de indicador: etiqueta, número grande y estado. */
export function KpiCard({ label, value, unit, tone = 'default', badge, badgeTone, note, tint = 'none', icon, className }: KpiCardProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2 rounded-xl border border-line p-5', tintBg[tint], className)}>
      <div className="flex w-full items-center justify-between gap-2">
        <p className="font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">{label}</p>
        {icon}
      </div>
      <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
        <p className={cn('whitespace-nowrap font-jakarta font-extrabold leading-[normal]', valueColor[tone])}>
          <span className="text-[32px]">{value}</span>
          {unit && <span className="ml-1 text-[18px] font-semibold">{unit}</span>}
        </p>
        {badge ? (
          <Badge size="sm" tone={badgeTone ?? (tone === 'default' ? 'neutral' : tone)}>
            {badge}
          </Badge>
        ) : (
          note && <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">{note}</p>
        )}
      </div>
    </div>
  );
}
