import { Alert, Box, Stack, Typography } from '@mui/material'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

/** Sin datos todavía. No es un error y no se pinta como tal. */
export function WidgetEmpty({ message }: { message: StringKey }) {
  const { t } = useLanguage()
  return (
    <Box sx={{ py: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {t(message)}
      </Typography>
    </Box>
  )
}

export function WidgetError({ message }: { message: StringKey }) {
  const { t } = useLanguage()
  return (
    <Alert severity="error" variant="outlined" sx={{ mt: 1 }}>
      {t(message)}
    </Alert>
  )
}

/**
 * El widget está construido pero el endpoint que lo alimenta todavía no existe.
 *
 * Dice cuál falta, con su nombre, en vez de enseñar un número inventado: un
 * cero de mentira en un tablero clínico se lee como un dato.
 */
export function WidgetPending({ message, endpoint }: { message: StringKey; endpoint: string }) {
  const { t } = useLanguage()
  return (
    <Stack spacing={1} sx={{ py: 3, alignItems: 'center', textAlign: 'center' }}>
      <ScheduleOutlinedIcon color="disabled" />
      <Typography variant="body2" color="text.secondary">
        {t(message)}
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
        {t('dash.pendingEndpoint', { endpoint })}
      </Typography>
    </Stack>
  )
}
