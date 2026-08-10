import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { requestReset, verifyCode } from '../api/passwordResetApi'
import { BrandMark } from '../../../shared/BrandMark'
import { useLanguage } from '../../../shared/i18n/useLanguage'

const CODE_LENGTH = 6
const RESEND_SECONDS = 45

type Step = 'email' | 'code'

export function ForgotPasswordPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step !== 'code' || resendIn === 0) return
    const id = setInterval(() => setResendIn((value) => value - 1), 1000)
    return () => clearInterval(id)
  }, [step, resendIn])

  async function handleRequestReset(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      await requestReset(email)
      setStep('code')
      setResendIn(RESEND_SECONDS)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('forgotPassword.failed'))
    } finally {
      setPending(false)
    }
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      await verifyCode(digits.join(''))
      // PHASE 2: once the backend supports setting a new password, this
      // redirect becomes a third step instead of sending the user back here.
      navigate('/login', { state: { resetSuccess: true } })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('verify.failed'))
    } finally {
      setPending(false)
    }
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleDigitKeyDown(index: number, event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const codeComplete = digits.every((digit) => digit !== '')

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box component="header" sx={{ px: { xs: 2, md: 5 }, py: 2 }}>
        <BrandMark />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'grid',
          placeItems: 'center',
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: '100%', maxWidth: 380 }}>
          <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: 'action.hover',
                color: 'primary.main',
                width: 48,
                height: 48,
              }}
            >
              {step === 'email' ? <VpnKeyOutlinedIcon /> : <ShieldOutlinedIcon />}
            </Avatar>

            <Stack spacing={0.5}>
              <Typography variant="h6">
                {step === 'email' ? t('forgotPassword.title') : t('verify.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step === 'email' ? t('forgotPassword.hint') : t('verify.hint')}
              </Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                {error}
              </Alert>
            )}

            {step === 'email' ? (
              <Stack
                component="form"
                onSubmit={handleRequestReset}
                spacing={3}
                sx={{ width: '100%' }}
              >
                <TextField
                  label={t('login.email')}
                  placeholder={t('login.emailPlaceholder')}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoFocus
                  required
                  disabled={pending}
                  fullWidth
                />

                <Alert
                  severity="warning"
                  icon={<WarningAmberOutlinedIcon fontSize="small" />}
                  sx={{ textAlign: 'left' }}
                >
                  {t('forgotPassword.warning')}
                </Alert>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={pending || !email.trim()}
                  aria-busy={pending}
                  fullWidth
                >
                  {pending ? t('forgotPassword.pending') : t('forgotPassword.submit')}
                </Button>
              </Stack>
            ) : (
              <Stack
                component="form"
                onSubmit={handleVerify}
                spacing={3}
                sx={{ width: '100%' }}
              >
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                  {digits.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el: HTMLInputElement | null) => {
                        inputRefs.current[index] = el
                      }}
                      value={digit}
                      onChange={(event) => handleDigitChange(index, event.target.value)}
                      onKeyDown={(event) => handleDigitKeyDown(index, event)}
                      disabled={pending}
                      autoFocus={index === 0}
                      slotProps={{
                        htmlInput: {
                          inputMode: 'numeric',
                          maxLength: 1,
                          'aria-label': `${t('verify.title')} ${index + 1}`,
                          sx: { textAlign: 'center', fontSize: '1.25rem', p: 1 },
                        },
                      }}
                      sx={{ width: 48 }}
                    />
                  ))}
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('verify.resendQuestion')}
                  </Typography>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    disabled={resendIn > 0}
                    onClick={async () => {
                      await requestReset(email)
                      setResendIn(RESEND_SECONDS)
                    }}
                  >
                    {t('verify.resend')}
                    {resendIn > 0 &&
                      ` (${t('verify.resendIn')} ${Math.floor(resendIn / 60)}:${String(resendIn % 60).padStart(2, '0')})`}
                  </Link>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={pending || !codeComplete}
                  aria-busy={pending}
                  fullWidth
                >
                  {pending ? t('verify.pending') : t('verify.submit')}
                </Button>
              </Stack>
            )}

            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <ArrowBackOutlinedIcon fontSize="inherit" />
              {t('forgotPassword.backToLogin')}
            </Link>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
