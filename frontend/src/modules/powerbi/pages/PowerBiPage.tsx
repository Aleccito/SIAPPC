import { useQuery } from '@tanstack/react-query'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { getEmbedConfig } from '../api/powerbiApi'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

export function PowerBiPage() {
  const { t } = useLanguage()
  usePageHeader(t('powerbi.title'))
  const { data, error, isPending } = useQuery({
    queryKey: ['powerbi', 'embed-config'],
    queryFn: getEmbedConfig,
    retry: false,
  })

  return (
    <Stack spacing={3}>
      {error && <Alert severity="info">{t('powerbi.unavailable')}</Alert>}

      <Paper sx={{ height: 600 }}>
        {/* PENDIENTE: sustituir este marcador por <PowerBIEmbed> de
            powerbi-client-react, alimentado con `data`. */}
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <InsightsOutlinedIcon fontSize="large" color="action" />
            <Typography variant="body2">
              {isPending
                ? t('powerbi.loading')
                : data
                  ? t('powerbi.report', { id: data.reportId })
                  : t('powerbi.placeholder')}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
