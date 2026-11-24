// No viene de Figma: el panel lateral de la IA (REVISION-IA.md, secciones 3 y 4). 480 px a la derecha, sobre la
// pantalla actual (pantalla completa en celular), con la misma consulta que /MedAsistenteIa y el contexto plegado.
// Se abre desde cualquier pantalla con useAiPanel().open({ cedula, question? }).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { usePatientRows } from '../../data/patients';
import { useAiAccess } from './useAiAccess';
import { IconSparkles } from '../icons';
import { CloseButton } from '../ui/Modal';
import { AiConsult } from './AiConsult';
import { AiContext } from './AiContext';

type OpenArgs = { cedula: string; question?: string };
type PanelApi = { open: (args: OpenArgs) => void; close: () => void; available: boolean };

const Ctx = createContext<PanelApi>({ open: () => undefined, close: () => undefined, available: false });

export const useAiPanel = () => useContext(Ctx);

export function AiPanelProvider({ children }: { children: ReactNode }) {
  const available = useAiAccess();
  // `key` nueva en cada apertura: la consulta empieza limpia y la pregunta inicial se envía una sola vez.
  const [state, setState] = useState<(OpenArgs & { key: number }) | null>(null);
  const open = useCallback((args: OpenArgs) => setState({ ...args, key: Date.now() }), []);
  const close = useCallback(() => setState(null), []);
  const { pathname } = useLocation();
  // Cambiar de pantalla (por ejemplo, "Llevar a la nota") lo cierra.
  useEffect(() => setState(null), [pathname]);
  useEffect(() => {
    if (!available) setState(null);
  }, [available]);
  const api = useMemo(() => ({ open, close, available }), [open, close, available]);
  return (
    <Ctx.Provider value={api}>
      {children}
      {state && available && <Panel key={state.key} initial={state} onClose={close} />}
    </Ctx.Provider>
  );
}

function Panel({ initial, onClose }: { initial: OpenArgs; onClose: () => void }) {
  const [cedula, setCedula] = useState(initial.cedula);
  const [question, setQuestion] = useState(initial.question ?? '');
  const { rows } = usePatientRows();
  const row = rows.find((r) => r.document === cedula);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-modal flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onMouseDown={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-panel-titulo"
        className="relative flex h-full w-full flex-col bg-surface shadow-2xl sm:w-[480px]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <IconSparkles size={16} />
            </span>
            <div className="flex min-w-0 flex-col">
              <h2 id="ai-panel-titulo" className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">
                Consultar IA
              </h2>
              <p className="truncate font-jakarta text-[12px] text-muted">Apoyo a la decisión clínica · no guarda nada en el expediente</p>
            </div>
          </div>
          <CloseButton onClick={onClose} label="Cerrar panel de IA" />
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
          <AiConsult variant="panel" cedula={cedula} onCedulaChange={setCedula} initialQuestion={initial.question} onQuestionChange={setQuestion} onLeave={onClose} />
          <details className="rounded-xl border border-line bg-white p-4">
            <summary className="cursor-pointer font-jakarta text-[13px] font-bold text-ink">Lo que verá la IA</summary>
            <AiContext row={row} question={question} className="mt-3" />
          </details>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
