import { useQuery } from '@tanstack/react-query'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { getEmbedConfig } from '../api/powerbiApi'
import { useLanguage } from '../../../shared/i18n/useLanguage'

export function PowerBiPage() {
  const { t } = useLanguage()
  const { data, error, isPending } = useQuery({
    queryKey: ['powerbi', 'embed-config'],
    queryFn: getEmbedConfig,
    retry: false,
  })

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('powerbi.title')}</Typography>

      {error && <Alert severity="info">{t('powerbi.unavailable')}</Alert>}

      <Paper sx={{ height: 600 }}>
        {/* PHASE 2: swap this placeholder for <PowerBIEmbed> from
            powerbi-client-react, fed by `data`. */}
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
