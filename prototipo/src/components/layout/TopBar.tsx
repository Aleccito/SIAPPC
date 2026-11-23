import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconBell, IconCalendar, IconMenu } from '../icons';

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
};

export function TopBar({ breadcrumb, title, actions, notifications = 3, onMenuClick }: TopBarProps) {
  return (
    <header className="shrink-0 border-b border-line bg-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:px-8 lg:h-[72px] lg:flex-nowrap lg:py-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface lg:hidden"
        >
          <IconMenu size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
          <p className="truncate font-jakarta text-[12px] font-medium text-muted">{breadcrumb}</p>
          <h1 className="truncate font-jakarta text-[20px] font-extrabold text-ink">{title}</h1>
        </div>
        {actions && (
          <div className="order-last flex w-full items-center gap-[10px] overflow-x-auto lg:order-none lg:w-auto lg:shrink-0 lg:overflow-visible">
            {actions}
          </div>
        )}
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

export function NotificationBell({ count = 3 }: { count?: number }) {
  return (
    <Link
      to="/MedNotificacionesCentro"
      aria-label={count ? `Notificaciones (${count} sin leer)` : 'Notificaciones'}
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-white"
    >
      <IconBell size={18} />
      {count > 0 && (
        <span className="absolute -right-[3px] -top-[3px] flex h-4 min-w-4 items-center justify-center rounded-lg bg-danger px-[3px] font-geist text-[10px] font-extrabold leading-[normal] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
