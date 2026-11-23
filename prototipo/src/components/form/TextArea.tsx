import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { ErrorText } from '../../lib/validate';
import { errorProps, FieldError } from './validation';

type Tone = 'white' | 'surface' | 'gray';
type Size = 12 | 13 | 14;
type Leading = 'normal' | 'snug' | 'relaxed' | 'loose';
type Pad = 'sm' | 'md' | 'lg';

const TONE: Record<Tone, string> = { white: 'bg-white', surface: 'bg-surface', gray: 'bg-[#f1f5f9]' };
const SIZE: Record<Size, string> = { 12: 'text-[12px]', 13: 'text-[13px]', 14: 'text-[14px]' };
/** normal = como Figma ("normal"), snug = 1.4, relaxed = 1.5, loose = 20 px (14 px de letra). */
const LEADING: Record<Leading, string> = { normal: 'leading-[normal]', snug: 'leading-[1.4]', relaxed: 'leading-[1.5]', loose: 'leading-5' };
const PAD: Record<Pad, string> = { sm: 'p-[10px]', md: 'p-3', lg: 'p-[14px]' };

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Etiqueta simple arriba (para ventanas nuevas). Las pantallas de Figma ponen su propia etiqueta. */
  label?: ReactNode;
  error?: ErrorText;
  /** Aspecto del dibujo de Figma que reemplaza. */
  tone?: Tone;
  textSize?: Size;
  leading?: Leading;
  padding?: Pad;
  /** Color del texto de ayuda (gris medio o gris claro, según el dibujo). */
  placeholderTone?: 'muted' | 'subtle';
  /** Alto mínimo en px (crece con el texto). */
  minHeight?: number;
  /** El contador "420 / 500" aparece al pasar el 80 % de `maxLength`. */
  maxLength?: number;
  className?: string;
};

/**
 * Campo de texto largo: crece con el texto, muestra su error debajo y reproduce los distintos
 * dibujos de Figma (fondo, tamaño de letra, interlineado y relleno) para no cambiar la vista.
 */
export function TextArea({
  id,
  value,
  onChange,
  label,
  error,
  tone = 'white',
  textSize = 13,
  leading = 'normal',
  padding = 'md',
  placeholderTone = 'subtle',
  minHeight = 80,
  maxLength,
  className,
  ...rest
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Alto = el del texto (como el recuadro de Figma), nunca menos que `minHeight`.
  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(minHeight, el.scrollHeight + 2)}px`;
  }, [minHeight]);
  useLayoutEffect(fit, [value, fit]);
  // Se vuelve a medir cuando cambia el ancho y cuando termina de cargar la fuente (cambia el largo de las líneas).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let width = el.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth !== width) {
        width = el.offsetWidth;
        fit();
      }
    });
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [fit]);

  const near = maxLength && value.length >= maxLength * 0.8;
  const area = (
    <textarea
      ref={ref}
      id={id}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={cn(
        'block w-full min-w-0 resize-none overflow-hidden rounded-lg border font-jakarta font-normal text-ink outline-none transition-colors focus:border-primary',
        TONE[tone],
        SIZE[textSize],
        LEADING[leading],
        PAD[padding],
        placeholderTone === 'muted' ? 'placeholder:text-muted' : 'placeholder:text-subtle',
        error ? 'border-danger' : 'border-line',
        className,
      )}
      {...errorProps(id, error ?? null)}
      {...rest}
    />
  );
  const extras = (error || near) && (
    <div className="flex w-full items-start justify-between gap-3">
      <FieldError forId={id} error={error ?? null} />
      {near && <p className="ml-auto shrink-0 font-jakarta text-[11px] font-medium leading-[normal] text-muted">{`${value.length} / ${maxLength}`}</p>}
    </div>
  );
  // Siempre el mismo envoltorio: si cambiara al aparecer el error, el campo perdería el foco.
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">
          {label}
        </label>
      )}
      {area}
      {extras}
    </div>
  );
}
