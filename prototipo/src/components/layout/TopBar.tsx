import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useUnreadCount } from '../../data/notifications';
import { landingFor, useSession } from '../auth/session';
import { cn } from '../../lib/cn';
import { IconArrowLeft, IconBell, IconCalendar, IconMenu } from '../icons';
import { EnVivoAviso } from './EnVivo';
import { useVolver } from './historial';
import { canOpenPath, CRUMB_LINKS } from './nav';

export type TopBarProps = {
  /** Ruta de navegación, ej. "SIAPPC > Alertas". Cada tramo, menos el último, lleva a su sección. */
  breadcrumb: ReactNode;
  /** Enlaces de los tramos propios de la pantalla (el paciente, "Historia Clínica"…), además de las secciones. */
  breadcrumbLinks?: Record<string, string>;
  /**
   * Pantalla padre. Con valor aparece "← Volver" a la izquierda del título: regresa a la pantalla anterior o, si se
   * entró por un enlace directo, a esta.
   */
  back?: string;
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

/**
 * La ruta de navegación. Cada tramo, menos el último (la pantalla actual), es un enlace a su sección si el rol puede
 * abrirla. En celular muestra solo los dos últimos niveles ("… > Historia Clínica > Antecedentes").
 */
function Breadcrumb({ text, links }: { text: ReactNode; links?: Record<string, string> }) {
  const { user, can } = useSession();
  if (typeof text !== 'string') return <>{text}</>;
  const parts = text.split(' > ');
  const n = parts.length;
  const hrefOf = (label: string, i: number) => {
    if (i === n - 1) return null;
    const to = links?.[label] ?? (label === 'SIAPPC' ? landingFor(user?.role) : CRUMB_LINKS[label]);
    return to && canOpenPath(to, user?.role, (m) => can(m, 'ver')) ? to : null;
  };
  return (
    <>
      {n > 2 && <span className="sm:hidden">{'… > '}</span>}
      {parts.map((label, i) => {
        const to = hrefOf(label, i);
        // En celular se ocultan los niveles de antes de los dos últimos, con su separador.
        const soloAncho = n > 2 && i < n - 2;
        return (
          <Fragment key={i}>
            {i > 0 && <span className={cn(soloAncho || i === n - 2 ? 'hidden sm:inline' : undefined)}>{' > '}</span>}
            {to ? (
              <Link to={to} className={cn('hover:text-primary hover:underline', soloAncho && 'hidden sm:inline')}>
                {label}
              </Link>
            ) : (
              <span className={cn(soloAncho && 'hidden sm:inline')}>{label}</span>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

/** "← Volver", a la izquierda del título. En celular, solo la flecha. */
function VolverButton({ parent }: { parent: string }) {
  const volver = useVolver(parent);
  return (
    <button
      type="button"
      onClick={volver}
      aria-label="Volver"
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 font-jakarta text-[13px] font-semibold leading-[normal] text-ink transition-colors hover:bg-surface sm:px-3"
    >
      <IconArrowLeft size={14} />
      <span className="hidden sm:inline">Volver</span>
    </button>
  );
}

export function TopBar({ breadcrumb, breadcrumbLinks, back, title, actions, notifications, onMenuClick, actionsInlineFrom = 'lg' }: TopBarProps) {
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
        {back && <VolverButton parent={back} />}
        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
          <p className="truncate font-jakarta text-[12px] font-medium text-muted">
            <Breadcrumb text={breadcrumb} links={breadcrumbLinks} />
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
