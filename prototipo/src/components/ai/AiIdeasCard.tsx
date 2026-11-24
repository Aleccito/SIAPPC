// No viene de Figma: "Ideas de la IA" (REVISION-IA.md, secciones 3 y 4; C4 y C5 de la sección 10). Misma lógica
// que frontend/src/modules/clinical/components/AiIdeasCard.tsx: lee el análisis cada 30 s, se marca desactualizada
// si llega una alerta del paciente más nueva, pide ideas con "Generar ideas" y con 403 no se dibuja.
// Variantes: `full` (Resumen), `compact` (Monitoreo detallado), `collapsible` (Confirmación y nota SOAP, solo
// lectura) y `cie10` (Registro de diagnóstico: "Buscar en CIE-10" pone la hipótesis en el buscador).
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateAiIdeas, getAiAnalysis, type AiAnalysis } from '../../api/ai';
import { suscribirEventos } from '../../api/alertStream';
import { ApiError } from '../../api/http';
import { fmtAgo } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { useAiAccess } from './useAiAccess';
import { IconChevronDown, IconSearch, IconSparkles } from '../icons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AiDisclaimer } from './AiAnswer';
import { useAiPanel } from './AiPanel';
import { AI_TEXT, SEVERITY_TEXT } from './aiText';
import { TakeToNote } from './TakeToNote';

type Variant = 'full' | 'compact' | 'collapsible' | 'cie10';

type Props = {
  /** id numérico del paciente (el de las rutas de /api). */
  patientId: string;
  cedula: string;
  variant?: Variant;
  /** Solo `cie10`: pone la hipótesis en el buscador de CIE-10. */
  onSearchCie10?: (text: string) => void;
  className?: string;
};

const TTL_MIN = 15;
export const aiAnalysisKey = (patientId: string) => ['aiAnalysis', patientId] as const;

/** Las hipótesis en Markdown, para "Llevar a la nota". */
const ideasMarkdown = (a: AiAnalysis) => a.ideas.map((i, n) => `${n + 1}. **${i.title}**: ${i.rationale}`).join('\n');

export function AiIdeasCard(props: Props) {
  // Sin acceso a la IA la tarjeta no existe (y no se pide nada al servidor).
  return useAiAccess() ? <IdeasCard {...props} /> : null;
}

function IdeasCard({ patientId, cedula, variant = 'full', onSearchCie10, className }: Props) {
  const queryClient = useQueryClient();
  const panel = useAiPanel();
  const [lastAlert, setLastAlert] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const query = useQuery({
    queryKey: aiAnalysisKey(patientId),
    queryFn: () => getAiAnalysis(patientId),
    refetchInterval: 30_000,
    retry: (count, err) => !(err instanceof ApiError && [403, 404].includes(err.status)) && count < 2,
  });
  const generate = useMutation({
    mutationFn: () => generateAiIdeas(patientId),
    onSuccess: (data) => queryClient.setQueryData(aiAnalysisKey(patientId), data),
  });

  // Una alerta nueva de este paciente puede disparar un análisis: se vuelve a preguntar.
  useEffect(
    () =>
      suscribirEventos((evento, datos) => {
        const alerta = datos as { patientId?: unknown; at?: unknown } | null;
        if (evento === 'alerta' && String(alerta?.patientId) === patientId) {
          const at = typeof alerta?.at === 'string' ? Date.parse(alerta.at) : Date.now();
          setLastAlert(Number.isNaN(at) ? Date.now() : at);
          void queryClient.invalidateQueries({ queryKey: aiAnalysisKey(patientId) });
        }
      }),
    [queryClient, patientId],
  );

  if (query.error instanceof ApiError && query.error.status === 403) return null;

  const analysis = query.data?.analysis ?? null;
  const generatedAt = analysis ? Date.parse(analysis.generatedAt) : null;
  const stale = generatedAt !== null && lastAlert !== null && generatedAt < lastAlert;
  // Mismo redondeo que "hace N min" (fmtAgo), para que las dos cifras sumen los 15 min del backend.
  const left = generatedAt !== null ? Math.max(0, TTL_MIN - Math.round((now - generatedAt) / 60_000)) : null;
  const sev = analysis ? SEVERITY_TEXT[analysis.severity] : null;
  const compact = variant === 'compact';
  const readOnly = variant === 'collapsible';

  const generateButton = !readOnly && (
    <Button size="sm" variant="soft" icon={<IconSparkles size={14} />} onClick={() => generate.mutate()} disabled={generate.isPending}>
      {generate.isPending ? 'Generando…' : analysis ? 'Actualizar' : 'Generar ideas'}
    </Button>
  );

  const body = (
    <div className="flex flex-col gap-3" aria-live="polite" aria-busy={query.isFetching || generate.isPending}>
      {analysis && sev && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Badge tone={sev.tone} size="sm">
            {sev.label}
          </Badge>
          <span className="font-jakarta text-[12px] text-muted" title={new Date(analysis.generatedAt).toLocaleString('es-PA')}>
            {`Análisis ${fmtAgo(analysis.generatedAt, now)}${left !== null ? ` · caduca en ${left} min` : ''}`}
          </span>
          {stale && (
            <Badge tone="neutral" size="sm">
              {AI_TEXT.ideasStale}
            </Badge>
          )}
        </div>
      )}

      {(query.isPending || (generate.isPending && !analysis)) && (
        <div className="flex flex-col gap-2" aria-label="Cargando ideas">
          {[90, 75, 60].map((w) => (
            <span key={w} className="h-3 animate-pulse rounded bg-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {generate.isError && (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 font-jakarta text-[13px] font-semibold text-danger">
          {generate.error instanceof ApiError && generate.error.status === 429 ? AI_TEXT.rateLimited : AI_TEXT.unavailable}
        </p>
      )}

      {query.isError && !analysis && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="min-w-0 flex-1 font-jakarta text-[13px] text-muted">{AI_TEXT.ideasError}</p>
          <Button size="sm" variant="secondary" onClick={() => void query.refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {query.isSuccess && !analysis && !generate.isPending && <p className="font-jakarta text-[13px] leading-[1.5] text-muted">{AI_TEXT.ideasEmpty}</p>}

      {analysis && (
        <ol className={cn('flex list-decimal flex-col pl-5', compact ? 'gap-1.5' : 'gap-2.5')}>
          {analysis.ideas.map((idea) => (
            <li key={idea.title} className="font-jakarta leading-[1.45]">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                <div className="min-w-0 flex-1">
                  <p className={cn('font-bold text-ink', compact ? 'text-[13px]' : 'text-[14px]')}>{idea.title}</p>
                  <p className="text-[12px] text-muted">{idea.rationale}</p>
                </div>
                {variant === 'cie10' && onSearchCie10 && (
                  <Button size="sm" variant="ghost" icon={<IconSearch size={12} />} onClick={() => onSearchCie10(idea.title)}>
                    Buscar en CIE-10
                  </Button>
                )}
                {variant === 'full' && panel.available && (
                  <Button size="sm" variant="ghost" onClick={() => panel.open({ cedula, question: `Profundiza en: ${idea.title}` })}>
                    Preguntar más
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {analysis && !compact && <p className="font-jakarta text-[11px] text-muted">{`Modelo: ${analysis.model}`}</p>}
      <AiDisclaimer text={query.data?.disclaimer} className={compact ? 'text-[11px]' : undefined} />
      {analysis && variant === 'full' && (
        <div className="flex flex-wrap gap-2">
          <TakeToNote cedula={cedula} origin="ideas" model={analysis.model} markdown={ideasMarkdown(analysis)} size="sm" />
        </div>
      )}
    </div>
  );

  if (readOnly) {
    return (
      <details className={cn('group rounded-xl border border-line bg-white', className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-jakarta text-[13px] font-bold text-ink [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <IconSparkles size={14} className="text-primary" />
            {`Ideas de la IA para este paciente${analysis ? ` (${analysis.ideas.length})` : ''}`}
          </span>
          <IconChevronDown size={12} className="text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-line px-4 py-3">{body}</div>
      </details>
    );
  }

  const title = variant === 'cie10' ? 'Hipótesis de la IA (sin confirmar)' : 'Ideas de la IA';
  return (
    <section className={cn('flex w-full flex-col gap-3 rounded-xl border border-line bg-white', compact ? 'p-4' : 'p-5', className)} aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={cn('flex items-center gap-2 font-jakarta font-extrabold leading-[normal] text-ink', compact ? 'text-[14px]' : 'text-[15px]')}>
          <IconSparkles size={16} className="text-primary" />
          {title}
        </h2>
        {generateButton}
      </div>
      {body}
    </section>
  );
}
