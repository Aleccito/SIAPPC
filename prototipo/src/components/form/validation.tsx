import { useState } from 'react';
import type { ErrorText } from '../../lib/validate';

/**
 * Errores de un formulario. Cada regla devuelve su mensaje (o null) con los valores actuales.
 * Un error se muestra cuando el campo ya se tocó (al salir de él) o después de intentar guardar.
 */
export function useValidation<K extends string>(rules: Record<K, () => ErrorText>) {
  const [touched, setTouched] = useState<Partial<Record<K, true>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = {} as Record<K, ErrorText>;
  for (const k of Object.keys(rules) as K[]) errors[k] = rules[k]();
  return {
    errors,
    /** Mensaje visible del campo `k`. */
    show: (k: K): ErrorText => (submitted || touched[k] ? errors[k] : null),
    /** Para `onBlur`: desde ahora el campo muestra su error. */
    touch: (k: K) => setTouched((t) => (t[k] ? t : { ...t, [k]: true })),
    /** Después de intentar guardar: todos los campos muestran su error. */
    markAll: () => setSubmitted(true),
    reset: () => {
      setSubmitted(false);
      setTouched({});
    },
  };
}

/** Mueve el foco al primer campo con error (por id) y lo deja a la vista. */
export function focusFirst(ids: Array<string | false | null | undefined>) {
  const id = ids.find(Boolean);
  if (!id) return;
  const el = document.getElementById(id);
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** Atributos de accesibilidad de un campo con su mensaje de error. */
export function errorProps(id: string, error: ErrorText) {
  return error ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } : {};
}

/** Mensaje de error en rojo bajo un campo. Su id es `${forId}-error`. */
export function FieldError({ forId, error, className }: { forId: string; error: ErrorText; className?: string }) {
  if (!error) return null;
  return (
    <p id={`${forId}-error`} className={['font-jakarta text-[12px] font-semibold leading-[normal] text-danger', className].filter(Boolean).join(' ')}>
      {error}
    </p>
  );
}
