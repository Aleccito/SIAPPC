import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

type PopoverProps = {
  /** Elemento junto al que se abre (el botón que lo abre). */
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  /** Alinear con el borde izquierdo (por defecto) o derecho del botón. */
  align?: 'left' | 'right';
  minWidth?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Capa flotante bajo un botón (listas desplegables y menús). Se dibuja en `body` con
 * posición fija para que no la recorte un contenedor con desplazamiento, se voltea
 * hacia arriba si no cabe abajo y se cierra con Escape o al tocar fuera.
 */
export function Popover({ anchor, open, onClose, align = 'left', minWidth = 0, className, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const a = anchor.current;
      const p = ref.current;
      if (!a || !p) return;
      const r = a.getBoundingClientRect();
      const w = Math.max(p.offsetWidth, minWidth, r.width);
      const h = p.offsetHeight;
      let left = align === 'right' ? r.right - w : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
      let top = r.bottom + 4;
      if (top + h > window.innerHeight - 8 && r.top - h - 4 > 8) top = r.top - h - 4;
      setPos({ top, left, width: r.width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchor, align, minWidth]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchor.current?.contains(t)) onClose();
    };
    // En captura y deteniendo la propagación: Escape cierra solo la lista, no el modal de atrás.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        anchor.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open, onClose, anchor]);

  if (!open) return null;
  return createPortal(
    <div
      ref={ref}
      style={{ position: 'fixed', top: pos?.top ?? -9999, left: pos?.left ?? -9999, minWidth: Math.max(minWidth, pos?.width ?? 0) }}
      className={cn('z-popover max-h-72 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-lg', className)}
    >
      {children}
    </div>,
    document.body,
  );
}
