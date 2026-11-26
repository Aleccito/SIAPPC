// No viene de Figma: la bandeja "Sugerencia de la IA — sin revisar" de la nota SOAP (docs/historial/REVISION-IA.md, sección 5,
// pasos 3 y 4). Muestra de dónde vino, cuándo y con qué modelo; "Insertar" agrega el texto al final de la sección
// elegida y no guarda nada. Lo que se firma lo escribe (o edita) el médico.
import { fmtTime } from '../../lib/clinical';
import { IconSparkles } from '../icons';
import { Button } from '../ui/Button';
import { AiDisclaimer } from './AiAnswer';
import type { AiSuggestion, SoapTarget } from './aiSuggestion';

const ORIGIN = { consulta: 'Consulta a la IA', ideas: 'Ideas de la IA' } as const;

export function AiSuggestionTray({ suggestion, onInsert, onDiscard }: { suggestion: AiSuggestion; onInsert: (target: SoapTarget) => void; onDiscard: () => void }) {
  return (
    <section aria-label="Sugerencia de la IA sin revisar" className="flex w-full flex-col gap-3 rounded-xl border border-dashed border-primary/50 bg-primary-soft/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-jakarta text-[14px] font-extrabold text-ink">
          <IconSparkles size={16} className="text-primary" />
          Sugerencia de la IA — sin revisar
        </p>
        <p className="font-jakarta text-[11px] text-muted">{`${ORIGIN[suggestion.origin]} · ${suggestion.what} · ${fmtTime(suggestion.at)}${suggestion.model ? ` · ${suggestion.model}` : ''}`}</p>
      </div>
      <p className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-white px-3 py-2 font-jakarta text-[13px] leading-[1.5] text-ink">{suggestion.text}</p>
      <AiDisclaimer />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={suggestion.target === 'a' ? 'primary' : 'secondary'} onClick={() => onInsert('a')}>
          Insertar en Evaluación (A)
        </Button>
        <Button size="sm" variant={suggestion.target === 'p' ? 'primary' : 'secondary'} onClick={() => onInsert('p')}>
          Insertar en Plan (P)
        </Button>
        <Button size="sm" variant="ghost" onClick={onDiscard}>
          Descartar
        </Button>
      </div>
    </section>
  );
}
