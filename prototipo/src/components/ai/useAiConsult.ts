// No viene de Figma: estado de una consulta libre (docs/historial/REVISION-IA.md, sección 4), con la misma lógica que
// frontend/src/modules/clinical/pages/AiConsultPage.tsx: patientId obligatorio (PR #55), "Detener" corta la
// generación y deja lo escrito, y los errores se traducen a los textos de frontend/.
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../api/http';
import { streamAiAssist } from '../../api/ai';
import { AI_TEXT, aiErrorText } from './aiText';

export type ConsultState = 'idle' | 'thinking' | 'writing' | 'done' | 'stopped' | 'error';

export function useAiConsult() {
  const [state, setState] = useState<ConsultState>('idle');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** El error llegó a mitad de la respuesta: lo escrito queda marcado como cortado. */
  const [cut, setCut] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const control = useRef<AbortController | null>(null);
  const last = useRef<{ patientId: string; question: string; patientName: string } | null>(null);

  // Salir de la pantalla (o cerrar el panel) corta la generación: el modelo es de un solo hilo.
  useEffect(() => () => control.current?.abort(), []);

  const busy = state === 'thinking' || state === 'writing';
  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [busy]);

  const ask = useCallback(async (patientId: string, patientName: string, text: string) => {
    const q = text.trim();
    if (!q || !patientId) return;
    control.current?.abort();
    const own = new AbortController();
    control.current = own;
    last.current = { patientId, question: q, patientName };
    setAsked(`${AI_TEXT.ofPatient} ${patientName}: ${q}`);
    setAnswer('');
    setError(null);
    setCut(false);
    setStartedAt(Date.now());
    setNow(Date.now());
    setState('thinking');
    let got = false;
    try {
      await streamAiAssist(
        { patientId: Number(patientId), question: q },
        {
          onStart: (info) => {
            setModel(info.model);
            setDisclaimer(info.disclaimer);
          },
          onChunk: (chunk) => {
            got = true;
            setState('writing');
            setAnswer((prev) => prev + chunk);
          },
        },
        own.signal,
      );
      if (control.current === own) setState('done');
    } catch (err) {
      if (own.signal.aborted) {
        if (control.current === own) setState('stopped');
        return;
      }
      setState('error');
      setCut(got && err instanceof ApiError && err.status === 503);
      setError(aiErrorText(err));
    }
  }, []);

  const stop = useCallback(() => control.current?.abort(), []);
  const retry = useCallback(() => {
    const l = last.current;
    if (l) void ask(l.patientId, l.patientName, l.question);
  }, [ask]);
  const reset = useCallback(() => {
    control.current?.abort();
    control.current = null;
    setState('idle');
    setAsked('');
    setAnswer('');
    setError(null);
    setCut(false);
  }, []);

  const elapsed = startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;
  return { state, busy, asked, answer, model, disclaimer, error, cut, elapsed, ask, stop, retry, reset, lastQuestion: last.current?.question ?? '' };
}

export const fmtElapsed = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
