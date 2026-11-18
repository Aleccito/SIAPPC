import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Chip, Paper, Stack, Typography } from '@mui/material'
import { getAiAnalysis } from '../api/aiApi'
import { ApiError } from '../../../shared/api/http'
import { suscribirEventos } from '../../../shared/api/alertStream'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { LoadingBar } from '../../../shared/LoadingBar'

/**
 * Ideas que el análisis automático de IA generó para un paciente crítico.
 *
 * Quién la ve lo decide el servidor (`notas_soap:crear`), igual que el resto
 * del módulo clínico: con 403 la tarjeta simplemente no se pinta.
 */
export function AiIdeasCard({ patientId }: { patientId: string }) {
  const { t, locale } = useLanguage()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['aiAnalysis', patientId],
    queryFn: () => getAiAnalysis(patientId),
    refetchInterval: 30_000,
    retry: (count, err) => !(err instanceof ApiError && err.status === 403) && count < 2,
  })

  // Una alerta nueva puede disparar un análisis: se vuelve a preguntar.
  useEffect(() => {
    return suscribirEventos((evento, datos) => {
      // Solo las alertas de ESTE paciente; el refetch periódico cubre el resto.
      const alertaPaciente = (datos as { patientId?: unknown } | null)?.patientId
      if (evento === 'alerta' && String(alertaPaciente) === patientId) {
        void queryClient.invalidateQueries({ queryKey: ['aiAnalysis', patientId] })
      }
    })
  }, [queryClient, patientId])

  if (query.error instanceof ApiError && query.error.status === 403) return null

  const analysis = query.data?.analysis ?? null

  return (
    <Paper sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5, mb: 1 }}>
        <Typography variant="h6">{t('aiIdeas.title')}</Typography>
        {analysis && (
          <>
            <Chip
              size="small"
              variant="outlined"
              color={analysis.severity === 'critica' ? 'error' : 'warning'}
              label={t(analysis.severity === 'critica' ? 'aiIdeas.severity.critica' : 'aiIdeas.severity.alta')}
            />
            <Typography variant="body2" color="text.secondary">
              {t('aiIdeas.generatedAt')}: {new Date(analysis.generatedAt).toLocaleString(locale)}
            </Typography>
          </>
        )}
      </Stack>

      <LoadingBar loading={query.isPending} />

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
