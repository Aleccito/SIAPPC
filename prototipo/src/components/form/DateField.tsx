import { IconCalendar } from '../icons';
import { useRef } from 'react';
import { cn } from '../../lib/cn';
import { formatDate, type ErrorText } from '../../lib/validate';
import { errorProps } from './validation';

type DateFieldProps = {
  id: string;
  /** Fecha ISO (aaaa-mm-dd) o vacío. */
  value: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  /** Límites del calendario (ISO). */
  min?: string;
  max?: string;
  label: string;
  error?: ErrorText;
};

/**
 * Campo de fecha con el aspecto de Figma ("02 Ago 2026" y un ícono de calendario). Al tocarlo
 * (o con Enter) abre el calendario del navegador.
 */
export function DateField({ id, value, onChange, onBlur, min, max, label, error }: DateFieldProps) {
  const native = useRef<HTMLInputElement>(null);
  const open = () => {
    const el = native.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  };
  return (
    <div className="relative w-full">
      <button
        type="button"
        id={id}
        onClick={open}
        onBlur={onBlur}
        aria-label={`${label}: ${value ? formatDate(value) : 'sin fecha'}. Cambiar fecha`}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-[10px] text-left font-jakarta text-[14px] font-semibold leading-[normal] outline-none transition-colors focus-visible:border-primary',
          value ? 'text-ink' : 'text-subtle',
          error ? 'border-danger' : 'border-line',
        )}
        {...errorProps(id, error ?? null)}
      >
        <span>{value ? formatDate(value) : 'Elegir fecha'}</span>
        <IconCalendar size={14} className="text-muted" />
      </button>
      {/* Calendario del navegador: invisible, pegado al borde inferior para que se abra debajo. */}
      <input
        ref={native}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full opacity-0"
      />
    </div>
  );
}
