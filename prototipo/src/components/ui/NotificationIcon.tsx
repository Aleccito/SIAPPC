// Ícono de cada tipo de aviso, el mismo en la bandeja (Notificaciones, Figma 48:447) y en el Centro
// (MedNotificacionesCentro, Figma 333:4). Antes eran SVG exportados de Figma: en el Centro el dibujo era más grande
// que su caja y se recortaba (a la campana le quedaba una rayita por badajo), y en la bandeja el trazo de 2 px en
// 16 px volvía el badajo una gota; además cada pantalla usaba un ícono distinto para el mismo aviso
// (docs/CONEXION-BACKEND.md, 9.6). Ahora son los de icons.tsx, con el color del tema.
import type { ComponentType } from 'react';
import type { FeedKind } from '../../data/notifications';
import { cn } from '../../lib/cn';
import { IconBell, IconClipboard, IconCpu, IconFileText, IconUsers, type IconProps } from '../icons';

const STYLE: Record<FeedKind, { icon: ComponentType<IconProps>; box: string }> = {
  alertaCritica: { icon: IconBell, box: 'bg-danger-soft text-danger' },
  alertaTemprana: { icon: IconBell, box: 'bg-warning-soft text-warning' },
  asignacion: { icon: IconUsers, box: 'bg-primary-soft text-primary' },
  laboratorio: { icon: IconFileText, box: 'bg-success-soft text-success' },
  imagen: { icon: IconFileText, box: 'bg-success-soft text-success' },
  recordatorio: { icon: IconClipboard, box: 'bg-warning-soft text-warning' },
  sistema: { icon: IconCpu, box: 'bg-[#f1f5f9] text-muted' },
};

/**
 * `md`: círculo de 36 px (bandeja); `sm`: 32 px (Centro). El ícono va a 18 px, como la campana de la barra superior:
 * a 16 px el badajo de la campana de Lucide (un arco de 2 px) se empasta.
 */
export function NotificationIcon({ kind, size = 'md' }: { kind: FeedKind; size?: 'sm' | 'md' }) {
  const { icon: Icon, box } = STYLE[kind];
  return (
    <span aria-hidden="true" className={cn('flex shrink-0 items-center justify-center rounded-full', size === 'md' ? 'size-9' : 'size-8', box)}>
      <Icon size={18} />
    </span>
  );
}
