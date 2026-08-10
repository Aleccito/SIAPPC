import { Box, Paper, Stack, Typography } from '@mui/material'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const placeholders: {
  icon: SvgIconComponent
  title: StringKey
  body: StringKey
}[] = [
  {
    icon: InsightsOutlinedIcon,
    title: 'dashboard.powerbi.title',
    body: 'dashboard.powerbi.body',
  },
  {
    icon: PrecisionManufacturingOutlinedIcon,
    title: 'dashboard.flexsim.title',
    body: 'dashboard.flexsim.body',
  },
  {
    icon: StorageOutlinedIcon,
    title: 'dashboard.data.title',
    body: 'dashboard.data.body',
  },
]

export function MainPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <Stack spacing={3}>
      <Typography variant="h5">
        {t('dashboard.welcome', { name: user?.name ?? '' })}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {placeholders.map(({ icon: Icon, title, body }) => (
          <Paper key={title} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Icon color="action" />
              <Typography variant="subtitle1">{t(title)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t(body)}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  )
}
