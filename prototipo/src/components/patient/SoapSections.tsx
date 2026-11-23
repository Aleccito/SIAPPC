import { cn } from '../../lib/cn';

export type SoapNote = { s: string; o: string; a: string; p: string };

const SECTIONS = [
  { key: 's', letter: 'S', label: 'Subjetivo', badge: 'bg-primary-soft text-primary' },
  { key: 'o', letter: 'O', label: 'Objetivo', badge: 'bg-warning-soft text-warning' },
  { key: 'a', letter: 'A', label: 'Análisis', badge: 'bg-danger-soft text-danger' },
  { key: 'p', letter: 'P', label: 'Plan', badge: 'bg-success-soft text-success' },
] as const;

/** Las cuatro secciones de una nota SOAP con su letra de color. */
export function SoapSections({ note, size = 'md', className }: { note: SoapNote; size?: 'sm' | 'md'; className?: string }) {
  return (
    <div className={cn('flex w-full flex-col', size === 'sm' ? 'gap-[10px]' : 'gap-3', className)}>
      {SECTIONS.map((s) => (
        <div key={s.key} className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', s.badge)}>{s.letter}</span>
            <p className="font-jakarta text-[11px] font-semibold leading-[normal] text-muted">{s.label}</p>
          </div>
          <p className={cn('font-jakarta font-normal leading-[1.4] text-ink', size === 'sm' ? 'text-[12px]' : 'text-[13px]')}>{note[s.key]}</p>
        </div>
      ))}
    </div>
  );
}
