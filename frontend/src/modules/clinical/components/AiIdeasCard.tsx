import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { generateAiIdeas, getAiAnalysis } from '../api/aiApi'
import { ApiError } from '../../../shared/api/http'
import { suscribirEventos } from '../../../shared/api/alertStream'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { LoadingBar } from '../../../shared/LoadingBar'

/**
 * Ideas que el análisis automático de IA generó para un paciente crítico.
 *
 * Quién la ve lo decide el servidor (`asistente_ia:ver`), igual que el resto
 * del módulo clínico: con 403 la tarjeta simplemente no se pinta.
 */
export function AiIdeasCard({ patientId }: { patientId: string }) {
  const { t, locale } = useLanguage()
  const queryClient = useQueryClient()
  // Hora de la última alerta de este paciente vista en vivo: si el análisis es
  // anterior, se marca como desactualizado mientras llega el nuevo.
  const [ultimaAlerta, setUltimaAlerta] = useState<number | null>(null)
  // Re-render cada minuto para que "hace N min" avance solo.
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const query = useQuery({
    queryKey: ['aiAnalysis', patientId],
    queryFn: () => getAiAnalysis(patientId),
    refetchInterval: 30_000,
    retry: (count, err) => !(err instanceof ApiError && err.status === 403) && count < 2,
  })

  // A pedido del médico: ideas cortas aunque el paciente no tenga alertas.
  const generar = useMutation({
    mutationFn: () => generateAiIdeas(patientId),
    onSuccess: (data) => queryClient.setQueryData(['aiAnalysis', patientId], data),
  })

  // Una alerta nueva puede disparar un análisis: se vuelve a preguntar.
  useEffect(() => {
    return suscribirEventos((evento, datos) => {
      // Solo las alertas de ESTE paciente; el refetch periódico cubre el resto.
      const alerta = datos as { patientId?: unknown; at?: unknown } | null
      if (evento === 'alerta' && String(alerta?.patientId) === patientId) {
        const at = typeof alerta?.at === 'string' ? Date.parse(alerta.at) : Date.now()
        setUltimaAlerta(Number.isNaN(at) ? Date.now() : at)
        void queryClient.invalidateQueries({ queryKey: ['aiAnalysis', patientId] })
      }
    })
  }, [queryClient, patientId])

  if (query.error instanceof ApiError && query.error.status === 403) return null

  const analysis = query.data?.analysis ?? null
  const generado = analysis ? Date.parse(analysis.generatedAt) : null
  const desactualizado = generado !== null && ultimaAlerta !== null && generado < ultimaAlerta

  return (
    // aria-live: un lector de pantalla anuncia cuando llegan ideas nuevas.
    <Paper sx={{ p: 2.5 }} aria-live="polite" aria-busy={query.isFetching}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5, mb: 1 }}>
        <Typography variant="h6">{t('aiIdeas.title')}</Typography>
        {analysis && (
          <>
            <Chip
              size="small"
              variant="outlined"
              color={analysis.severity === 'critica' ? 'error' : analysis.severity === 'alta' ? 'warning' : 'default'}
              label={t(`aiIdeas.severity.${analysis.severity}`)}
            />
            <Typography variant="body2" color="text.secondary">
              <span title={new Date(analysis.generatedAt).toLocaleString(locale)}>
                {t('aiIdeas.generatedAt')}: {haceCuanto(generado ?? ahora, ahora, locale)}
              </span>
            </Typography>
            {desactualizado && (
              <Chip size="small" color="default" label={t('aiIdeas.stale')} />
            )}
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="small"
          startIcon={<AutoAwesomeOutlinedIcon />}
          onClick={() => generar.mutate()}
          disabled={generar.isPending}
        >
          {t(generar.isPending ? 'aiIdeas.generating' : analysis ? 'aiIdeas.refresh' : 'aiIdeas.generate')}
        </Button>
      </Stack>

      <LoadingBar loading={query.isPending || generar.isPending} />

      {generar.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {generar.error instanceof ApiError && generar.error.status === 429
            ? t('aiConsult.rateLimited')
            : t('aiConsult.unavailable')}
        </Alert>
      )}

      {query.isError && (
        <Typography variant="body2" color="text.secondary">
          {t('aiIdeas.error')}
        </Typography>
      )}

      {query.isSuccess && !analysis && (
        <Typography variant="body2" color="text.secondary">
          {t('aiIdeas.empty')}
        </Typography>
      )}

      {analysis && (
        <Stack component="ol" spacing={1} sx={{ pl: 2.5, my: 0 }}>
          {analysis.ideas.map((idea, i) => (
            <li key={i}>
              <Typography variant="subtitle2">{idea.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {idea.rationale}
              </Typography>
            </li>
          ))}
        </Stack>
      )}

      <Alert severity="warning" sx={{ mt: 1.5 }}>
        {query.data?.disclaimer ?? t('aiIdeas.disclaimer')}
      </Alert>
    </Paper>
  )
}

const RANGOS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

/** "hace 12 minutos" en el idioma de la interfaz. */
function haceCuanto(desde: number, ahora: number, locale: string): string {
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diff = desde - ahora
  for (const [unidad, ms] of RANGOS) {
    if (Math.abs(diff) >= ms) return fmt.format(Math.round(diff / ms), unidad)
  }
  return fmt.format(0, 'minute')
}
