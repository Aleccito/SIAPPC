// No viene de Figma: la consulta libre a la IA (docs/historial/REVISION-IA.md, secciones 3 y 4; C1 y C2 de la sección 10).
// La usan la pantalla Asistente IA y el panel lateral. Exige paciente, como el backend desde el PR #55.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePatientRows, type PatientRow } from '../../data/patients';
import { cn } from '../../lib/cn';
import { IconSend, IconSparkles, IconStop, IconCopy } from '../icons';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { AiAnswer, AiDisclaimer } from './AiAnswer';
import { AI_TEXT, MAX_QUESTION, QUICK_QUESTIONS, plainText } from './aiText';
import { TakeToNote } from './TakeToNote';
import { fmtElapsed, useAiConsult } from './useAiConsult';

type Props = {
  /** Cédula del paciente elegido ('' = ninguno todavía). */
  cedula: string;
  onCedulaChange: (cedula: string) => void;
  /** Pregunta que se envía sola al abrir (panel desde Indicaciones o "Preguntar más"). */
  initialQuestion?: string;
  /** La pregunta escrita, para "Lo que verá la IA". */
  onQuestionChange?: (question: string) => void;
  /** Se llama al ir a la nota (el panel se cierra). */
  onLeave?: () => void;
  variant?: 'page' | 'panel';
};

export function AiConsult({ cedula, onCedulaChange, initialQuestion, onQuestionChange, onLeave, variant = 'page' }: Props) {
  const toast = useToast();
  const { rows } = usePatientRows();
  const row: PatientRow | undefined = rows.find((r) => r.document === cedula);
  const c = useAiConsult();
  const [question, setQuestionState] = useState(initialQuestion ?? '');
  const setQuestion = (q: string) => {
    setQuestionState(q);
    onQuestionChange?.(q);
  };
  const noPatient = !row;

  const send = (text = question) => {
    if (!row || !text.trim() || c.busy) return;
    void c.ask(row.id, row.name, text.slice(0, MAX_QUESTION));
  };

  // La pregunta que trae el panel se envía sola, una vez, cuando ya se sabe quién es el paciente. Cambiar de
  // paciente después no la reenvía. Al desmontar se olvida: en desarrollo, StrictMode desmonta y vuelve a montar
  // (y el desmontaje corta la consulta), así que el segundo montaje la envía de nuevo.
  const autoSent = useRef<string | null>(null);
  useEffect(
    () => () => {
      autoSent.current = null;
    },
    [],
  );
  useEffect(() => {
    if (autoSent.current !== null || !initialQuestion || !row) return;
    autoSent.current = row.id;
    onQuestionChange?.(initialQuestion);
    void c.ask(row.id, row.name, initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.id, initialQuestion]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plainText(c.answer));
      toast('Respuesta copiada');
    } catch {
      toast('No se pudo copiar', 'info');
    }
  };
  const options = [{ value: '', label: 'Elija un paciente…' }, ...rows.map((r) => ({ value: r.document, label: `${r.name} — ${r.document}` }))];
  const showAnswer = c.state !== 'idle';

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Select
          variant="input"
          fieldLabel="Paciente"
          ariaLabel="Paciente de la consulta"
          options={options}
          value={row ? cedula : ''}
          onChange={(v) => {
            c.reset();
            onCedulaChange(v);
          }}
          className={cn(c.busy && 'pointer-events-none opacity-60')}
        />
        <p className="font-jakarta text-[12px] leading-[1.4] text-muted">{AI_TEXT.patientHelp}</p>
      </div>

      {noPatient && <p className="rounded-lg bg-primary-soft px-3 py-2 font-jakarta text-[13px] font-medium text-primary">{AI_TEXT.pickPatient}</p>}

      <div className="flex flex-col gap-2">
        <p className="font-jakarta text-[12px] font-bold uppercase text-muted">Preguntas rápidas</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q.label}
              type="button"
              title={`${q.text} (Mayús+clic: solo copiarla al cuadro)`}
              disabled={c.busy || noPatient}
              onClick={(e) => {
                setQuestion(q.text);
                if (!e.shiftKey) send(q.text);
              }}
              className="rounded-full border border-primary/40 px-3 py-1.5 font-jakarta text-[12px] font-semibold text-primary transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:border-line disabled:text-subtle disabled:hover:bg-transparent"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor={`ai-pregunta-${variant}`} className="font-jakarta text-[12px] font-bold uppercase text-muted">
          Pregunta
        </label>
        <textarea
          id={`ai-pregunta-${variant}`}
          value={question}
          maxLength={MAX_QUESTION}
          rows={variant === 'panel' ? 3 : 4}
          disabled={noPatient}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKey}
          placeholder="Describa síntomas, hallazgos o la duda clínica…"
          className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2.5 font-jakarta text-[13px] leading-[1.5] text-ink outline-none placeholder:text-subtle focus:border-primary disabled:bg-surface"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-jakarta text-[11px] text-muted">{`Ctrl+Enter para enviar · ${question.length}/${MAX_QUESTION}`}</p>
          {c.busy ? (
            // `key` distinta: si React reusara el botón, al soltar "Detener" ya sería "submit" (como en frontend/).
            <Button key="detener" type="button" variant="secondary" icon={<IconStop size={14} />} onClick={c.stop}>
              Detener
            </Button>
          ) : (
            <Button key="enviar" type="submit" icon={<IconSend size={14} />} disabled={noPatient || !question.trim()}>
              Consultar
            </Button>
          )}
        </div>
      </form>

      {!showAnswer && row && (
        <p className="font-jakarta text-[13px] leading-[1.5] text-muted">{`La IA usará el expediente, los signos vitales y las notas recientes de ${row.name}. No guarda nada en el expediente.`}</p>
      )}

      {showAnswer && (
        <section aria-live="polite" aria-busy={c.busy} className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4">
          <div className="flex items-start gap-2">
            <IconSparkles size={16} className="mt-0.5 text-primary" />
            <p className="min-w-0 flex-1 break-words font-jakarta text-[12px] font-semibold leading-[1.45] text-muted">{c.asked}</p>
          </div>

          {c.state === 'thinking' && (
            <div className="flex flex-col gap-2">
              <p className="font-jakarta text-[13px] font-bold text-ink">{`Pensando… ${fmtElapsed(c.elapsed)}`}</p>
              {[92, 78, 64].map((w) => (
                <span key={w} className="h-3 animate-pulse rounded bg-line" style={{ width: `${w}%` }} />
              ))}
              <p className="font-jakarta text-[12px] text-muted">El modelo local tarda entre 30 s y 1,5 min.</p>
            </div>
          )}

          {(c.state === 'writing' || c.state === 'done' || c.state === 'stopped' || (c.state === 'error' && c.answer)) && (
            <AiAnswer text={c.answer} streaming={c.state === 'writing'} cut={c.cut} />
          )}
          {c.state === 'writing' && <p className="font-jakarta text-[12px] text-muted">{`Escribiendo… ${fmtElapsed(c.elapsed)}`}</p>}

          {c.state === 'stopped' && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-jakarta text-[13px] font-semibold text-[#92400e]">{AI_TEXT.stopped}</p>
              <Button size="sm" variant="secondary" onClick={c.retry}>
                Volver a preguntar
              </Button>
            </div>
          )}

          {c.state === 'error' && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-danger-soft px-3 py-2">
              <p role="alert" className="min-w-0 flex-1 font-jakarta text-[13px] font-semibold text-danger">
                {c.error}
              </p>
              <Button size="sm" variant="secondary" onClick={c.retry}>
                Reintentar
              </Button>
            </div>
          )}

          {(c.state === 'done' || c.state === 'stopped') && (
            <>
              {c.model && <p className="font-jakarta text-[11px] text-muted">{`Modelo: ${c.model}`}</p>}
              <AiDisclaimer text={c.disclaimer} />
              <div className="flex flex-wrap gap-2">
                {row && (
                  <TakeToNote cedula={row.document} origin="consulta" model={c.model} markdown={c.answer} disabled={c.state !== 'done' || !c.answer.trim()} onDone={onLeave} size="sm" />
                )}
                <Button size="sm" variant="secondary" icon={<IconCopy size={14} />} onClick={() => void copy()} disabled={!c.answer.trim()}>
                  Copiar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    c.reset();
                    setQuestion('');
                  }}
                >
                  Nueva consulta
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
