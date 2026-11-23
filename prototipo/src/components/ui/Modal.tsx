import { useEffect, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconX } from '../icons';
import { Button, type ButtonVariant } from './Button';

type ModalProps = {
  /** id del título (para lectores de pantalla). */
  labelledBy: string;
  /** Si es false no se dibuja. Por defecto true (pantallas que son el modal mismo). */
  open?: boolean;
  /** Se llama con Escape o al tocar el fondo. */
  onClose?: () => void;
  /** Ancho máximo en px (por defecto 480). */
  width?: number;
  /** Color del fondo oscuro. */
  backdrop?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Ventana sobre la pantalla con fondo oscuro. Se centra y, si no cabe en alto,
 * se desplaza dentro del fondo en lugar de cortarse. Se cierra con Escape o
 * tocando el fondo cuando recibe `onClose`.
 */
export function Modal({ labelledBy, open = true, onClose, width = 480, backdrop = 'bg-[rgba(0,0,0,0.4)]', className, children }: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className={cn('fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-4 sm:items-center', backdrop)}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
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

/** Encabezado de modal: título a la izquierda y X para cerrar. */
export function ModalHeader({ id, title, onClose, icon }: { id: string; title: ReactNode; onClose: () => void; icon?: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon}
        <h2 id={id} className="font-jakarta text-[18px] font-extrabold leading-[normal] text-ink">
          {title}
        </h2>
      </div>
      <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface">
        <IconX size={12} />
      </button>
    </div>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmación corta: título, texto y Cancelar / Confirmar. */
export function ConfirmDialog({ open, title, children, confirmLabel, confirmVariant = 'primary', cancelLabel = 'Cancelar', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal labelledBy="confirm-dialog-title" open={open} onClose={onCancel} width={420} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="confirm-dialog-title" title={title} onClose={onCancel} />
      <div className="font-jakarta text-[14px] font-normal leading-[1.5] text-muted">{children}</div>
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
