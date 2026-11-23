import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconCheck } from '../icons';

type Tone = 'success' | 'info';
type ToastItem = { id: number; message: string; tone: Tone };
type ShowToast = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ShowToast>(() => {});
let counter = 0;

/**
 * Avisos cortos de confirmación ("Nota guardada"). Va fuera de las rutas en App.tsx,
 * así que un aviso sigue visible aunque la acción cambie de pantalla.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback<ShowToast>((message, tone = 'success') => {
    const id = ++counter;
    setItems((xs) => [...xs.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg bg-ink px-4 py-3 font-jakarta text-[13px] font-semibold leading-[normal] text-white shadow-lg"
          >
            <span className={cn('flex size-5 shrink-0 items-center justify-center rounded-full', t.tone === 'success' ? 'bg-success' : 'bg-primary')}>
              <IconCheck size={12} />
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Devuelve `toast(mensaje)` para mostrar un aviso corto. */
export function useToast(): ShowToast {
  return useContext(ToastContext);
}
