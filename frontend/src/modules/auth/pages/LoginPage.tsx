import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import LoginIcon from '@mui/icons-material/Login'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import { useAuth } from '../useAuth'
import { LanguageToggle } from '../../../shared/i18n/LanguageToggle'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const capabilities: {
  icon: typeof InsightsOutlinedIcon
  title: StringKey
  body: StringKey
}[] = [
  {
    icon: PrecisionManufacturingOutlinedIcon,
    title: 'login.cap.simulation.title',
    body: 'login.cap.simulation.body',
  },
  {
    icon: MonitorHeartOutlinedIcon,
    title: 'login.cap.patients.title',
    body: 'login.cap.patients.body',
  },
  {
    icon: InsightsOutlinedIcon,
    title: 'login.cap.reporting.title',
    body: 'login.cap.reporting.body',
  },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      await login({ email, password })
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('login.failed'))
    } finally {
      setPending(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 5 },
          py: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <HubOutlinedIcon />
          <Typography variant="subtitle1" sx={{ letterSpacing: '0.04em' }}>
            CHAMBAFINAL
          </Typography>
        </Stack>

        <LanguageToggle />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          alignItems: 'center',
          gap: { xs: 6, md: 8 },
          width: '100%',
          maxWidth: 1100,
          mx: 'auto',
          px: { xs: 2, md: 5 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={4} sx={{ order: { xs: 2, md: 1 } }}>
          <Stack spacing={2}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: '0.18em' }}
            >
              {t('login.eyebrow')}
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              {t('login.headline1')}
              <br />
              {t('login.headline2')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: '52ch' }}
            >
              {t('login.lead')}
            </Typography>
          </Stack>

          <Stack spacing={2.5}>
            {capabilities.map((capability) => (
              <Stack
                key={capability.title}
                direction="row"
                spacing={2}
                sx={{ alignItems: 'flex-start' }}
              >
                <capability.icon sx={{ mt: '2px', color: 'text.secondary' }} />
                <Box>
                  <Typography variant="subtitle2">
                    {t(capability.title)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: '48ch' }}
                  >
                    {t(capability.body)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {t('login.phaseNote')}
          </Typography>
        </Stack>

        <Fade in timeout={reduceMotion ? 0 : 220}>
          <Paper
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 400,
              justifySelf: { md: 'end' },
              order: { xs: 1, md: 2 },
            }}
          >
            <Stack spacing={3} component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={0.5}>
                <Typography variant="h6" component="h2">
                  {t('login.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('login.hint')}
                </Typography>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label={t('login.email')}
                type="email"
                value={email}
                // A failure from the previous attempt no longer describes what
                // is in the field once the user starts fixing it.
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError(null)
                }}
                autoComplete="username"
                autoFocus
                required
                disabled={pending}
                fullWidth
              />
              <TextField
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError(null)
                }}
                autoComplete="current-password"
                required
                disabled={pending}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<LoginIcon />}
                disabled={pending || !email || !password}
                aria-busy={pending}
                fullWidth
              >
                {pending ? t('login.pending') : t('action.signIn')}
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Box>
    </Box>
  )
}
