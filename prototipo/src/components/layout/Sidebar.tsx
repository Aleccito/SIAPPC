import { Link, useLocation } from 'react-router-dom';
import avatar from '../../assets/avatar-2.png';
import { cn } from '../../lib/cn';
import { IconLogOut } from '../icons';
import { CURRENT_USER, NAV_ITEMS, sectionForPath } from './nav';

type SidebarProps = {
  className?: string;
  /** Se llama al elegir un enlace (para cerrar el menú en pantallas angostas). */
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { pathname } = useLocation();
  const active = sectionForPath(pathname);

  return (
    <aside
      className={cn('flex h-full w-sidebar flex-col justify-between overflow-y-auto border-r border-ink-soft bg-ink px-4 py-6', className)}
      aria-label="Menú principal"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="font-jakarta text-[14px] font-extrabold leading-[normal] text-white">S</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap leading-[normal]">
            <p className="font-jakarta text-[16px] font-extrabold text-white">SIAPPC</p>
            <p className="font-jakarta text-[10px] font-semibold uppercase text-muted">Cuidado crítico</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ section, label, to, icon: Icon }) => {
            const isActive = section === active;
            return (
              <Link
                key={section}
                to={to}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive ? 'bg-primary/15' : 'hover:bg-white/5',
                )}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-muted'} />
                <span
                  className={cn(
                    'whitespace-nowrap font-jakarta text-[14px] leading-[normal]',
                    isActive ? 'font-bold text-white' : 'font-medium text-subtle',
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 flex flex-col">
        <Link
          to="/MedAyudaSoporte"
          onClick={onNavigate}
          aria-label="Ayuda y soporte"
          title="Ayuda y soporte"
          className="relative mb-3 ml-1 block size-[18px] text-muted opacity-25 transition-opacity hover:opacity-70"
        >
          <svg className="absolute -inset-[4.17%]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9.75" cy="9.75" r="9" strokeWidth="1.5" stroke="currentColor" />
          </svg>
          <span className="absolute left-[5.5px] top-[1.5px] font-geist text-[11px] font-bold leading-[normal]">?</span>
        </Link>
        <div className="flex flex-col gap-4">
          <div className="relative h-0 w-full">
            <div className="absolute inset-x-0 -top-px h-px bg-white/15" />
          </div>
          <Link to="/MedPerfilMiPerfil" onClick={onNavigate} className="flex w-full items-center gap-3">
            <img src={avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap leading-[normal]">
              <p className="truncate font-jakarta text-[13px] font-bold text-white">{CURRENT_USER.name}</p>
              <p className="truncate font-jakarta text-[11px] font-medium text-muted">{CURRENT_USER.role}</p>
            </div>
            <IconLogOut size={18} className="text-muted" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
