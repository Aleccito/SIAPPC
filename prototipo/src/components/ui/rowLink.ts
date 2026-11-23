import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Props para que una fila (un `div` con botones adentro) lleve a otra pantalla al
 * tocarla o con Enter, sin anidar enlaces. Los botones de la fila deben detener la
 * propagación (`e.stopPropagation()`).
 */
export function useRowLink() {
  const navigate = useNavigate();
  return (to: string, state?: unknown) => ({
    role: 'link' as const,
    tabIndex: 0,
    onClick: () => navigate(to, { state }),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter') navigate(to, { state });
    },
  });
}

/**
 * Props para que una fila abra algo en la misma pantalla (modal, vista previa) al
 * tocarla o con Enter. Igual que `useRowLink`, los botones de adentro detienen la propagación.
 */
export function rowButton(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter') onActivate();
    },
  };
}

/** Clases para que una fila tocable se note al pasar el mouse o con el teclado. */
export const rowLinkClass = 'cursor-pointer outline-none transition-colors hover:bg-surface focus-visible:bg-primary-soft';
