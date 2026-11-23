/** Une clases de Tailwind ignorando valores vacíos: cn('a', cond && 'b'). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
