import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { LogoutDialog } from '../auth/LogoutDialog';
import { IconX } from '../icons';
import { useEnVivo } from './EnVivo';
import { Sidebar } from './Sidebar';
import { TopBar, type TopBarProps } from './TopBar';

type AppLayoutProps = Omit<TopBarProps, 'onMenuClick'> & {
  children: ReactNode;
  /** Clases extra para el contenedor del contenido. */
  className?: string;
};

/**
 * Estructura de todas las pantallas: menú lateral + barra superior + contenido.
 * Desde 1024 px el menú queda fijo a la izquierda; en pantallas más angostas
 * se pliega y se abre con el botón de la barra superior.
 */
export function AppLayout({ children, className, ...topBar }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { pathname } = useLocation();
  // La confirmación vive aquí y no en el menú: en celular el menú se cierra (y se desmonta)
  // al tocar "Cerrar sesión", y la confirmación queda sola sobre la pantalla.
  const askLogout = () => {
    setMenuOpen(false);
    setConfirmLogout(true);
  };

  // Alertas en vivo: refrescan las pantallas y la campana al llegar (src/components/layout/EnVivo.tsx).
  useEnVivo();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar onLogout={askLogout} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMenuOpen(false)} />
          <Sidebar className="relative shadow-xl" onNavigate={() => setMenuOpen(false)} onLogout={askLogout} />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="absolute left-[252px] top-4 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow"
          >
            <IconX size={14} />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar {...topBar} onMenuClick={() => setMenuOpen(true)} />
        <main className={cn('flex min-w-0 flex-1 flex-col', className)}>{children}</main>
      </div>

      <LogoutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </div>
  );
}

/** Contenedor estándar del contenido de una pantalla (márgenes y separación). */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8', className)}>{children}</div>;
}
