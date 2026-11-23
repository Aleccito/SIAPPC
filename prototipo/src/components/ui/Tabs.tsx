import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ScrollShadows, useScrollEdges } from './ScrollShadows';

export type TabItem = {
  id: string;
  label: string;
  /** Pantalla a la que lleva la pestaña. Sin `to` se dibuja como botón. */
  to?: string;
};

type TabsProps = {
  items: TabItem[];
  active: string;
  onChange?: (id: string) => void;
  /** underline: subrayado azul (por defecto). pills: botones dentro de una tarjeta (subsecciones). */
  variant?: 'underline' | 'pills';
  className?: string;
};

const styles = {
  underline: {
    bar: 'gap-2 border-b border-line',
    item: '-mb-px border-b-2 px-4 py-3 text-[14px]',
    active: 'border-primary font-bold text-primary',
    idle: 'border-transparent font-medium text-muted hover:text-ink',
  },
  pills: {
    bar: 'min-h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 py-1',
    item: 'rounded-md px-3 py-1.5 text-[13px]',
    active: 'bg-primary-soft font-bold text-primary',
    idle: 'font-medium text-muted hover:bg-surface hover:text-ink',
  },
};

/**
 * Barra de pestañas. Si no cabe se desplaza de lado: una sombra avisa que hay más pestañas y la
 * pestaña activa se acomoda a la vista al abrir la pantalla.
 */
export function Tabs({ items, active, onChange, variant = 'underline', className }: TabsProps) {
  const s = styles[variant];
  const [ref, edges] = useScrollEdges<HTMLDivElement>();

  useEffect(() => {
    const list = ref.current;
    const tab = list?.querySelector<HTMLElement>('[aria-selected=true]');
    if (!list || !tab) return;
    const start = tab.offsetLeft - list.offsetLeft;
    const end = start + tab.offsetWidth;
    if (start < list.scrollLeft || end > list.scrollLeft + list.clientWidth) list.scrollLeft = start - (list.clientWidth - tab.offsetWidth) / 2;
  }, [active, ref]);

  return (
    <div className="relative w-full">
      <ScrollShadows {...edges} />
      <div ref={ref} role="tablist" className={cn('flex w-full overflow-x-auto', s.bar, className)}>
      {items.map((item) => {
        const isActive = item.id === active;
        const classes = cn('shrink-0 whitespace-nowrap font-jakarta leading-[normal] transition-colors', s.item, isActive ? s.active : s.idle);
        return item.to ? (
          <Link key={item.id} to={item.to} role="tab" aria-selected={isActive} className={classes}>
            {item.label}
          </Link>
        ) : (
          <button key={item.id} type="button" role="tab" aria-selected={isActive} onClick={() => onChange?.(item.id)} className={classes}>
            {item.label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
