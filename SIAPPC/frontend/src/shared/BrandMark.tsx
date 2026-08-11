import { Stack, Typography } from '@mui/material'
import { BrandLogo } from './BrandLogo'
import { useLanguage } from './i18n/useLanguage'

export function BrandMark({
  withTagline = true,
  // Se reenvía al logo: sobre el azul marino del login hace falta la placa
  // azul, no la blanca.
  variant = 'light',
}: {
  withTagline?: boolean
  variant?: 'light' | 'onBlue'
}) {
  const { t } = useLanguage()

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <BrandLogo size={36} variant={variant} />
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
