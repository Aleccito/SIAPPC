import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { ErrorText } from '../../lib/validate';
import { errorProps } from './validation';

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Decimales permitidos al escribir (0 = solo enteros). */
  decimals?: number;
  /** Acepta "/" (tensión arterial "120/80"). */
  pressure?: boolean;
  /**
   * box: caja chica centrada (Mín/Máx de umbrales).
   * inline: se ve como el texto que reemplaza (hereda letra y color) y muestra borde al tocarlo.
   */
  appearance?: 'box' | 'inline';
  error?: ErrorText;
  className?: string;
};

/** Quita todo lo que no sea número (y un separador decimal o la barra de la presión). */
function sanitize(raw: string, decimals: number, pressure: boolean) {
  let v = raw.replace(',', '.');
  v = v.replace(pressure ? /[^\d/]/g : decimals ? /[^\d.]/g : /\D/g, '');
  if (pressure) {
    const [a, b = ''] = v.split('/');
    return v.includes('/') ? `${a.slice(0, 3)}/${b.replace(/\//g, '').slice(0, 3)}` : a.slice(0, 3);
  }
  const [int, ...rest] = v.split('.');
  return rest.length ? `${int}.${rest.join('')}` : int;
}

/** Campo numérico: solo deja escribir números; el rango lo valida el formulario. */
export function NumberField({ id, value, onChange, decimals = 0, pressure = false, appearance = 'box', error, className, ...rest }: NumberFieldProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode={decimals ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(sanitize(e.target.value, decimals, pressure))}
      className={cn(
        appearance === 'box'
          ? 'w-20 rounded-md border bg-white px-3 py-2 text-center font-jakarta text-[13px] font-semibold leading-[normal] text-ink outline-none transition-colors placeholder:text-subtle focus:border-primary'
          : 'min-w-[1ch] rounded-sm bg-transparent p-0 text-inherit outline-none transition-shadow [field-sizing:content] [font:inherit] placeholder:text-subtle hover:ring-1 hover:ring-line focus:ring-2 focus:ring-primary/40',
        appearance === 'box' && (error ? 'border-danger' : 'border-line'),
        appearance === 'inline' && error && 'ring-2 ring-danger/60 hover:ring-danger/60',
        className,
      )}
      {...errorProps(id, error ?? null)}
      {...rest}
    />
  );
}
