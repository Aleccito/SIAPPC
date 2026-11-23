import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { IconChevronDown, IconSearch } from '../icons';

const field =
  'flex min-w-0 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 font-jakarta text-[13px] leading-[normal] text-ink';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  icon?: ReactNode;
  containerClassName?: string;
};

/** Campo de texto con etiqueta opcional. */
export function Input({ label, icon, className, containerClassName, id, ...rest }: InputProps) {
  const input = (
    <span className={cn(field, 'focus-within:border-primary', containerClassName)}>
      {icon}
      <input id={id} className={cn('w-full min-w-0 bg-transparent outline-none placeholder:text-subtle', className)} {...rest} />
    </span>
  );
  if (!label) return input;
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
      <span className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{label}</span>
      {input}
    </label>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode };

export function TextArea({ label, className, id, ...rest }: TextAreaProps) {
  const area = (
    <textarea
      id={id}
      className={cn(
        'w-full min-w-0 resize-y rounded-lg border border-line bg-white p-3 font-jakarta text-[13px] leading-[normal] text-ink outline-none placeholder:text-subtle focus:border-primary',
        className,
      )}
      {...rest}
    />
  );
  if (!label) return area;
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
      <span className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{label}</span>
      {area}
    </label>
  );
}

type SearchBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Ancho en pantallas grandes (px). En pantallas angostas ocupa lo disponible. */
  width?: number;
  tone?: 'white' | 'surface';
  containerClassName?: string;
  /** Si se indica, el buscador es un enlace a la pantalla de búsqueda. */
  to?: string;
};

/** Buscador con lupa. */
export function SearchBox({ width = 260, tone = 'surface', className, containerClassName, to, ...rest }: SearchBoxProps) {
  const box = cn(field, tone === 'surface' ? 'bg-surface' : 'bg-white', 'w-full focus-within:border-primary', containerClassName);
  if (to) {
    return (
      <Link to={to} className={cn(box, 'hover:border-subtle')} style={{ maxWidth: width, minWidth: Math.min(width, 200) }}>
        <IconSearch size={14} className="text-muted" />
        <span className={cn('truncate font-medium', rest.value ? 'text-ink' : 'text-subtle')}>{rest.value ?? rest.placeholder}</span>
      </Link>
    );
  }
  return (
    <span className={box} style={{ maxWidth: width, minWidth: Math.min(width, 200) }}>
      <IconSearch size={14} className="text-muted" />
      <input
        type="search"
        className={cn('w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-subtle', className)}
        {...rest}
      />
    </span>
  );
}

type SelectProps = {
  /** Texto del filtro, ej. "Severidad: Todas". */
  children: ReactNode;
  /** Etiqueta gris antes del valor, ej. "Fecha:". */
  label?: ReactNode;
  icon?: ReactNode;
  /** Muestra la flecha hacia abajo (por defecto sí). */
  chevron?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * Filtro desplegable (por ahora solo visual: muestra el valor elegido).
 * En el paso 3 del plan se le agregan opciones.
 */
export function Select({ children, label, icon, chevron = true, className, onClick }: SelectProps) {
  return (
    <button type="button" onClick={onClick} className={cn(field, 'shrink-0 whitespace-nowrap font-semibold hover:bg-surface', className)}>
      {icon}
      {label && <span className="text-muted">{label}</span>}
      <span className={label ? 'font-bold' : undefined}>{children}</span>
      {chevron && <IconChevronDown size={12} className="text-muted" />}
    </button>
  );
}
