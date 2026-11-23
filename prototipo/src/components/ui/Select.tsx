import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconCheck, IconChevronDown } from '../icons';
import { Popover } from './Popover';

export type SelectOption = { value: string; label: string };

/**
 * Aspecto del botón, según dónde se usa:
 * - field: filtro de barra o tarjeta ("Severidad: Todas").
 * - stacked: filtro con etiqueta arriba ("UNIDAD / Todas").
 * - chip: valor sobre fondo gris ("UCI").
 * - soft: chip con borde sobre fondo claro ("Todos ⌄").
 * - button: igual que `Button variant="secondary" size="sm"` ("Filtrar").
 * - input / input-plain / compact: campo de formulario a todo el ancho.
 */
export type SelectVariant = 'field' | 'stacked' | 'chip' | 'soft' | 'button' | 'input' | 'input-plain' | 'compact';

const trigger: Record<SelectVariant, string> = {
  field: 'gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface',
  stacked: 'gap-3 rounded-lg border border-line bg-white px-3 py-2 text-left hover:bg-surface',
  chip: 'rounded-md bg-[#f1f5f9] px-[10px] py-1.5 text-[12px] font-bold text-ink hover:bg-line',
  soft: 'gap-2 rounded-lg border border-line bg-surface px-[10px] py-2 text-[13px] font-semibold text-muted hover:bg-white',
  button: 'justify-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-surface',
  input: 'w-full justify-between gap-2 rounded-lg border border-line bg-white px-3 py-[10px] text-left text-[14px] font-semibold text-ink hover:border-subtle',
  'input-plain': 'w-full justify-between gap-2 rounded-lg border border-line bg-white px-3 py-[10px] text-left text-[13px] font-normal text-ink hover:border-subtle',
  compact: 'w-full justify-between gap-2 rounded-md border border-line bg-white px-3 py-2 text-left text-[13px] font-semibold text-ink hover:border-subtle',
};

const chevronSize: Record<SelectVariant, number> = { field: 12, stacked: 14, chip: 10, soft: 14, button: 12, input: 14, 'input-plain': 14, compact: 14 };

type SelectProps = {
  options: Array<SelectOption | string>;
  value: string;
  onChange: (value: string) => void;
  variant?: SelectVariant;
  /** Etiqueta gris antes del valor ("Fecha:") o, en `stacked`, arriba del valor. */
  label?: ReactNode;
  /** Cómo mostrar el valor elegido (ej. `l => \`Severidad: ${l}\``). */
  format?: (label: string) => ReactNode;
  /** Ícono a la izquierda del valor. */
  icon?: ReactNode;
  /** Ícono en lugar de la flecha (ej. calendario). */
  trailingIcon?: ReactNode;
  chevron?: boolean;
  /** Borde azul de campo destacado (como el buscador de CIE-10 en Figma). Solo para `input`. */
  highlighted?: boolean;
  /** Etiqueta de formulario arriba del campo. */
  fieldLabel?: ReactNode;
  /** Texto para lectores de pantalla si el botón no tiene etiqueta visible. */
  ariaLabel?: string;
  align?: 'left' | 'right';
  className?: string;
};

const norm = (o: SelectOption | string): SelectOption => (typeof o === 'string' ? { value: o, label: o } : o);

/** Lista desplegable: muestra el valor elegido y, al tocarla, sus opciones. */
export function Select({
  options,
  value,
  onChange,
  variant = 'field',
  label,
  format,
  icon,
  trailingIcon,
  chevron = true,
  highlighted = false,
  fieldLabel,
  ariaLabel,
  align = 'left',
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const opts = options.map(norm);
  const current = opts.find((o) => o.value === value) ?? opts[0];
  const shown = format ? format(current?.label ?? '') : current?.label;

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    btn.current?.focus();
  };

  const focusOption = (delta: number) => {
    const items = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role=option]') ?? []);
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    items[(i + delta + items.length) % items.length].focus();
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => list.current?.querySelector<HTMLButtonElement>('[aria-selected=true]')?.focus());
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusOption(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusOption(-1);
    } else if (e.key === 'Tab') setOpen(false);
  };

  const button = (
    <button
      ref={btn}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-label={ariaLabel}
      aria-labelledby={fieldLabel ? `${id}-label` : undefined}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={onTriggerKey}
      className={cn(
        'flex shrink-0 items-center whitespace-nowrap font-jakarta leading-[normal] transition-colors',
        highlighted ? trigger[variant].replace('border-line', 'border-primary') : trigger[variant],
        className,
      )}
    >
      {icon}
      {variant === 'stacked' ? (
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 font-semibold">
          <span className="text-[10px] uppercase text-muted">{label}</span>
          <span className="text-[13px] text-ink">{shown}</span>
        </span>
      ) : (
        <>
          {label && <span className="text-muted">{label}</span>}
          <span className={cn('truncate', label ? 'font-bold' : undefined, variant.startsWith('input') || variant === 'compact' ? 'flex-1' : undefined)}>{shown}</span>
        </>
      )}
      {trailingIcon ?? (chevron && <IconChevronDown size={chevronSize[variant]} className={cn('text-muted transition-transform', open && 'rotate-180')} />)}
    </button>
  );

  return (
    <>
      {fieldLabel ? (
        <div className="flex min-w-0 flex-col gap-1.5">
          <span id={`${id}-label`} className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">
            {fieldLabel}
          </span>
          {button}
        </div>
      ) : (
        button
      )}
      <Popover anchor={btn} open={open} onClose={() => setOpen(false)} align={align} minWidth={160}>
        <div ref={list} role="listbox" onKeyDown={onListKey}>
          {opts.map((o) => {
            const selected = o.value === current?.value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => pick(o.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-jakarta text-[13px] leading-[normal] outline-none hover:bg-surface focus:bg-surface',
                  selected ? 'font-bold text-primary' : 'font-medium text-ink',
                )}
              >
                {o.label}
                {selected && <IconCheck size={12} />}
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
}
