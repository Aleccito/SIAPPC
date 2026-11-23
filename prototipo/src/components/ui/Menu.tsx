import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Popover } from './Popover';

export type MenuItem = {
  label: string;
  /** Pantalla a la que lleva. */
  to?: string;
  onSelect?: () => void;
  tone?: 'default' | 'danger';
};

type MenuProps = {
  /** Contenido del botón que abre el menú (ej. el ícono "•••"). */
  trigger: ReactNode;
  /** Texto para lectores de pantalla. */
  label: string;
  items: MenuItem[];
  align?: 'left' | 'right';
  className?: string;
};

/** Menú de acciones que se abre al tocar un botón (ej. "•••" de una fila). */
export function Menu({ trigger, label, items, align = 'right', className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onListKey = (e: KeyboardEvent) => {
    const els = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role=menuitem]') ?? []);
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      els[(i + 1) % els.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      els[(i - 1 + els.length) % els.length]?.focus();
    } else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((o) => !o);
          requestAnimationFrame(() => list.current?.querySelector<HTMLButtonElement>('[role=menuitem]')?.focus());
        }}
        className={cn('flex items-center justify-center rounded-md p-1 hover:bg-line', className)}
      >
        {trigger}
      </button>
      <Popover anchor={btn} open={open} onClose={() => setOpen(false)} align={align} minWidth={180}>
        <div ref={list} role="menu" aria-label={label} onKeyDown={onListKey}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onSelect?.();
                if (item.to) navigate(item.to);
              }}
              className={cn(
                'flex w-full px-3 py-2 text-left font-jakarta text-[13px] font-medium leading-[normal] outline-none hover:bg-surface focus:bg-surface',
                item.tone === 'danger' ? 'text-danger' : 'text-ink',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
