// No viene de Figma: "Llevar a la nota" (REVISION-IA.md, sección 5, paso 1). Un menú corto: qué llevar (la
// respuesta completa o una de sus secciones, si la respuesta las trae) y a dónde (Evaluación o Plan). Abre la
// Nueva Nota SOAP de ese paciente con la bandeja "sin revisar"; no escribe nada en la nota por su cuenta.
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { useSession } from '../auth/session';
import { IconClipboard } from '../icons';
import { Button } from '../ui/Button';
import { Popover } from '../ui/Popover';
import { answerSections, plainText } from './aiText';
import { saveSuggestion, type AiSuggestion, type SoapTarget } from './aiSuggestion';

type Props = {
  cedula: string;
  origin: AiSuggestion['origin'];
  model: string | null;
  /** Markdown de la respuesta (consulta) o de las hipótesis (ideas). */
  markdown: string;
  disabled?: boolean;
  /** Se llama al ir a la nota (el panel lateral se cierra). */
  onDone?: () => void;
  size?: 'sm' | 'md';
};

export function TakeToNote({ cedula, origin, model, markdown, disabled, onDone, size = 'md' }: Props) {
  const { can } = useSession();
  const navigate = useNavigate();
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const sections = origin === 'consulta' ? answerSections(markdown) : [];
  const options = [{ what: origin === 'ideas' ? 'Hipótesis de la IA' : 'Respuesta completa', text: markdown }, ...sections.map((s) => ({ what: s.title, text: s.text }))];
  const [choice, setChoice] = useState(0);
  if (!can('notas_soap', 'crear')) return null;

  const go = (target: SoapTarget) => {
    const o = options[Math.min(choice, options.length - 1)];
    saveSuggestion({ cedula, origin, what: o.what, at: new Date().toISOString(), model, text: plainText(o.text), target });
    setOpen(false);
    onDone?.();
    navigate(patientPath('/MedPacienteNotasSoapNueva', cedula));
  };

  return (
    <span ref={anchor} className="inline-flex">
      <Button size={size} variant="secondary" icon={<IconClipboard size={14} />} disabled={disabled} onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open}>
        Llevar a la nota
      </Button>
      <Popover anchor={anchor} open={open} onClose={() => setOpen(false)} minWidth={280} className="flex w-[300px] max-w-[calc(100vw-16px)] flex-col gap-3 p-3">
        <div role="dialog" aria-label="Llevar a la nota SOAP" className="flex flex-col gap-3">
          {options.length > 1 && (
            <fieldset className="flex flex-col gap-1">
              <legend className="mb-1 font-jakarta text-[11px] font-bold uppercase text-muted">Qué llevar</legend>
              {options.map((o, i) => (
                <label key={o.what} className={cn('flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-jakarta text-[13px] text-ink', choice === i ? 'bg-primary-soft' : 'hover:bg-surface')}>
                  <input type="radio" name="ai-llevar" checked={choice === i} onChange={() => setChoice(i)} className="accent-primary" />
                  {o.what}
                </label>
              ))}
            </fieldset>
          )}
          <div className="flex flex-col gap-1">
            <p className="font-jakarta text-[11px] font-bold uppercase text-muted">A dónde</p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="soft" onClick={() => go('a')}>
                Evaluación (A)
              </Button>
              <Button size="sm" variant="soft" onClick={() => go('p')}>
                Plan (P)
              </Button>
            </div>
          </div>
          <p className="font-jakarta text-[11px] leading-[1.4] text-muted">Se abre la nota nueva con la sugerencia aparte, sin revisar. Usted decide si la inserta.</p>
        </div>
      </Popover>
    </span>
  );
}
