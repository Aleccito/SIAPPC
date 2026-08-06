import { Avatar, Stack, Typography } from '@mui/material'
import { useLanguage } from './i18n/useLanguage'

export function BrandMark({ withTagline = true }: { withTagline?: boolean }) {
  const { t } = useLanguage()

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Avatar
        variant="rounded"
        sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 700 }}
      >
        S
      </Avatar>
      <Stack spacing={0}>
        <Typography variant="subtitle1" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
          {t('brand.name')}
        </Typography>
        {withTagline && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: '0.02em', lineHeight: 1.2 }}
          >
            {t('brand.tagline')}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
