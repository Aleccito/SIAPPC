import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ModalProps = {
  /** id del título (para lectores de pantalla). */
  labelledBy: string;
  /** Ancho máximo en px (por defecto 480). */
  width?: number;
  /** Color del fondo oscuro. */
  backdrop?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Ventana sobre la pantalla con fondo oscuro. Se centra y, si no cabe en alto,
 * se desplaza dentro del fondo en lugar de cortarse.
 */
export function Modal({ labelledBy, width = 480, backdrop = 'bg-[rgba(0,0,0,0.4)]', className, children }: ModalProps) {
  return (
    <div className={cn('fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-4 sm:items-center', backdrop)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn('my-auto flex w-full flex-col rounded-2xl bg-white', className)}
        style={{ maxWidth: width }}
      >
        {children}
      </div>
    </div>
  );
}
