import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useUnreadCount } from '../../data/notifications';
import { useSession } from '../auth/session';
import { cn } from '../../lib/cn';
import { IconBell, IconCalendar, IconMenu } from '../icons';
import { EnVivoAviso } from './EnVivo';

export type TopBarProps = {
  /** Ruta de navegación, ej. "SIAPPC > Alertas". */
  breadcrumb: ReactNode;
  title: ReactNode;
  /** Botones, buscadores o filtros de la pantalla (a la derecha). */
  actions?: ReactNode;
  /** Número en la campana. */
  notifications?: number;
  /** Abre el menú lateral en pantallas angostas. */
  onMenuClick?: () => void;
  /**
   * Desde qué ancho las acciones van en la misma fila que el título. Por defecto 1024 px (`lg`);
   * `xl` (1280 px) para pantallas con muchas acciones, así el título no se corta a 1024.
   */
  actionsInlineFrom?: 'lg' | 'xl';
};

/** En celular la ruta muestra solo los dos últimos niveles ("… > Historia Clínica > Antecedentes"). */
function Breadcrumb({ children }: { children: ReactNode }) {
  const parts = typeof children === 'string' ? children.split(' > ') : null;
  if (!parts || parts.length <= 2) return <>{children}</>;
  return (
    <>
      <span className="sm:hidden">{`… > ${parts.slice(-2).join(' > ')}`}</span>
      <span className="hidden sm:inline">{children}</span>
    </>
  );
}

export function TopBar({ breadcrumb, title, actions, notifications, onMenuClick, actionsInlineFrom = 'lg' }: TopBarProps) {
  const xl = actionsInlineFrom === 'xl';
  return (
    <header className="shrink-0 border-b border-line bg-white">
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:px-8',
          xl ? 'xl:h-[72px] xl:flex-nowrap xl:py-0' : 'lg:h-[72px] lg:flex-nowrap lg:py-0',
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface lg:hidden"
        >
          <IconMenu size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
          <p className="truncate font-jakarta text-[12px] font-medium text-muted">
            <Breadcrumb>{breadcrumb}</Breadcrumb>
          </p>
          {/* En celular el título puede ocupar dos líneas en lugar de cortarse. */}
          <h1 className="font-jakarta text-[20px] font-extrabold text-ink sm:truncate">{title}</h1>
        </div>
        {actions && (
          <div
            className={cn(
              'order-last flex w-full items-center gap-[10px] overflow-x-auto',
              xl ? 'xl:order-none xl:w-auto xl:shrink-0 xl:overflow-visible' : 'lg:order-none lg:w-auto lg:shrink-0 lg:overflow-visible',
            )}
          >
            {actions}
          </div>
        )}
        <EnVivoAviso />
        <NotificationBell count={notifications} />
      </div>
    </header>
  );
}

/** Fecha y hora con ícono de calendario, para la barra superior. */
export function TopBarDate({ children }: { children: ReactNode }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-jakarta text-[13px] font-semibold leading-[normal] text-muted">
      <IconCalendar size={14} />
      {children}
    </span>
  );
}

/** Campana de la barra superior: sin `count`, muestra las notificaciones sin leer (src/data/notifications.ts). */
export function NotificationBell({ count: fixed }: { count?: number }) {
  const { user, can } = useSession();
  // Los avisos son alertas de pacientes: sin `alertas:ver`, o siendo el admin, no hay campana.
  const visible = !!user && user.role !== 'admin' && can('alertas', 'ver');
  return visible ? <Bell fixed={fixed} /> : null;
}

function Bell({ fixed }: { fixed?: number }) {
  const live = useUnreadCount();
  const count = fixed ?? live ?? 0;
  return (
    <Link
      to="/MedNotificacionesCentro"
      aria-label={count ? `Notificaciones (${count} sin leer)` : 'Notificaciones'}
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-white"
    >
      <IconBell size={18} />
      {count > 0 && (
        <span className="absolute -right-[3px] -top-[3px] flex h-4 min-w-4 items-center justify-center rounded-lg bg-danger px-[3px] font-geist text-[10px] font-extrabold leading-[normal] text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
