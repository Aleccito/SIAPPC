import { Box, Stack, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

export type KpiTone = 'neutral' | 'warning' | 'critical' | 'ok'

const toneColor: Record<KpiTone, string> = {
  neutral: 'text.primary',
  ok: 'success.main',
  warning: 'warning.main',
  critical: 'error.main',
}

/**
 * Cifra suelta con su etiqueta. `value` puede ser null: eso significa "todavía
 * no se sabe" —está cargando o el endpoint no existe— y se pinta como raya,
 * nunca como cero.
 */
export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  hint,
}: {
  label: StringKey
  value: number | string | null
  icon: SvgIconComponent
  tone?: KpiTone
  hint?: string
}) {
  const { t } = useLanguage()

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.75,
        minWidth: 0,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <Icon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary" noWrap>
          {t(label)}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: toneColor[tone] }}>
        {value ?? '—'}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Box>
  )
}
