import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/**
 * Para contenedores con desplazamiento horizontal (tablas, pestañas): devuelve la ref del
 * contenedor y si hay más contenido a la izquierda o a la derecha.
 */
export function useScrollEdges<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft > 1;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);
  return [ref, edges] as const;
}

/** Sombras en los bordes que avisan que hay más contenido de lado. Van dentro de un padre `relative`. */
export function ScrollShadows({ left, right }: { left: boolean; right: boolean }) {
  const base = 'pointer-events-none absolute inset-y-0 z-10 w-6 transition-opacity duration-150';
  return (
    <>
      <span aria-hidden="true" className={cn(base, 'left-0 bg-gradient-to-r from-[rgba(15,23,42,0.12)] to-transparent', left ? 'opacity-100' : 'opacity-0')} />
      <span aria-hidden="true" className={cn(base, 'right-0 bg-gradient-to-l from-[rgba(15,23,42,0.12)] to-transparent', right ? 'opacity-100' : 'opacity-0')} />
    </>
  );
}
