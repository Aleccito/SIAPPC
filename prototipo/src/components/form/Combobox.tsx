import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { matches } from '../../lib/text';
import type { ErrorText } from '../../lib/validate';
import { IconCheck } from '../icons';
import { Popover } from '../ui/Popover';
import { errorProps } from './validation';

export type ComboOption = { value: string; label: string };

type ComboboxProps = {
  id: string;
  options: ComboOption[];
  /** Valor elegido (o el texto escrito, con `freeText`). Vacío = nada elegido. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Permite un valor que no está en la lista (se guarda el texto escrito). */
  freeText?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  /** Borde azul (como el buscador de CIE-10 de Figma). */
  highlighted?: boolean;
  label: string;
  error?: ErrorText;
  /** Abre la búsqueda con este texto ya escrito; `seq` distinto para repetirla (PR 3: "Buscar en CIE-10"). */
  search?: { text: string; seq: number } | null;
};

/**
 * Lista con búsqueda: cerrada se ve como un campo con el valor elegido (el texto baja a otra
 * línea si no cabe); al tocarla se escribe para filtrar, sin importar tildes ni mayúsculas.
 * Flechas para moverse, Enter para elegir y Escape para cerrar.
 */
export function Combobox({ id, options, value, onChange, onBlur, freeText = false, placeholder = 'Buscar…', icon, highlighted, label, error, search }: ComboboxProps) {
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  // Texto escrito y no elegido (sin `freeText`): se muestra en rojo hasta que se elija algo.
  const [pending, setPending] = useState('');

  const current = options.find((o) => o.value === value);
  const shown = current?.label ?? (freeText ? value : pending);
  const results = options.filter((o) => matches(query, o.label, o.value));
  const listId = `${id}-lista`;

  // El foco va cuando el buscador ya está abierto (el campo existe solo mientras se edita).
  const focusOnOpen = useRef(false);
  useEffect(() => {
    if (!search) return;
    setQuery(search.text);
    setActive(0);
    setEditing(true);
    focusOnOpen.current = true;
  }, [search]);
  useEffect(() => {
    if (!editing || !focusOnOpen.current || !input.current) return;
    focusOnOpen.current = false;
    input.current.focus();
    input.current.scrollIntoView({ block: 'center' });
  }, [editing, search]);

  const start = () => {
    setQuery(freeText ? value : pending);
    setActive(0);
    setEditing(true);
    requestAnimationFrame(() => input.current?.select());
  };
  const choose = (o: ComboOption) => {
    onChange(o.value);
    setPending('');
    setEditing(false);
  };
  const finish = () => {
    if (!editing) return;
    setEditing(false);
    const text = query.trim();
    if (freeText) {
      if (text !== value) onChange(text);
    } else if (text && !(current && text === current.label)) {
      setPending(text);
      onChange('');
    }
    onBlur?.();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) choose(results[active]);
      else finish();
    } else if (e.key === 'Tab') {
      finish();
    }
  };

  return (
    <>
      <div
        ref={box}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-[10px] font-jakarta text-[14px] font-semibold leading-[normal] text-ink transition-colors focus-within:border-primary',
          error ? 'border-danger' : highlighted ? 'border-primary' : 'border-line',
        )}
      >
        {icon}
        {editing ? (
          <input
            ref={input}
            id={id}
            role="combobox"
            aria-label={label}
            aria-expanded
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            onBlur={finish}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:font-normal placeholder:text-subtle"
            {...errorProps(id, error ?? null)}
          />
        ) : (
          <button
            type="button"
            id={id}
            onClick={start}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                start();
              }
            }}
            aria-haspopup="listbox"
            aria-label={`${label}: ${shown || 'sin elegir'}`}
            className={cn('min-w-0 flex-1 text-left outline-none', !shown && 'font-normal text-subtle', pending && !current && 'text-danger')}
            {...errorProps(id, error ?? null)}
          >
            {shown || placeholder}
          </button>
        )}
      </div>
      {/* Tocar fuera o Escape cierran igual que salir del campo (si no se pudiera, el texto se perdería). */}
      <Popover anchor={box} open={editing} onClose={finish} minWidth={240}>
        <div id={listId} role="listbox" aria-label={label}>
          {results.map((o, i) => {
            const selected = o.value === value;
            return (
              <div
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                // mousedown en lugar de click: así el campo no pierde el foco antes de elegir.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(o);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left font-jakarta text-[13px] leading-[normal]',
                  i === active && 'bg-surface',
                  selected ? 'font-bold text-primary' : 'font-medium text-ink',
                )}
              >
                {o.label}
                {selected && <IconCheck size={12} />}
              </div>
            );
          })}
          {results.length === 0 && (
            <p className="px-3 py-2 font-jakarta text-[13px] font-medium leading-[normal] text-muted">
              {freeText && query.trim() ? `Sin coincidencias: se usará "${query.trim()}"` : 'Sin resultados'}
            </p>
          )}
        </div>
      </Popover>
    </>
  );
}
