import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { createUser } from '../api/usersApi'
import type { CreatedUser, RoleSummary, Unit } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  open: boolean
  roles: RoleSummary[]
  units: Unit[]
  onClose: () => void
}

const EMPTY = { name: '', email: '', phone: '', role: '', unitId: '' }

export function NewUserDialog({ open, roles, units, onClose }: Props) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY)
  const [created, setCreated] = useState<CreatedUser | null>(null)
  const [copied, setCopied] = useState(false)

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (result) => {
      setCreated(result)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  function handleClose() {
    // El diálogo se reinicia al cerrar, no al abrir: así la contraseña
    // temporal sigue visible mientras el administrador la copia.
    setForm(EMPTY)
    setCreated(null)
    setCopied(false)
    mutation.reset()
    onClose()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    mutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      role: form.role,
      unitId: form.unitId ? Number(form.unitId) : undefined,
    })
  }

  async function handleCopy() {
    if (!created) return
    await navigator.clipboard.writeText(created.tempPassword)
    setCopied(true)
  }

  const canSubmit = form.name.trim() && form.email.trim() && form.role

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 6 }}>
        {created ? t('users.new.created') : t('users.new.title')}
        <IconButton
          onClick={handleClose}
          aria-label={t('action.close')}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {created ? (
        <>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body2">
                {created.user.name} · {created.user.email}
              </Typography>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('users.new.tempPassword')}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 600 }}
                  >
                    {created.tempPassword}
                  </Typography>
                  <Tooltip title={copied ? t('users.new.copied') : t('users.new.copy')}>
                    <IconButton onClick={handleCopy} aria-label={t('users.new.copy')}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Alert severity="warning">{t('users.new.tempPasswordHint')}</Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              {t('users.new.done')}
            </Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              {mutation.isError && (
                <Alert severity="error">{(mutation.error as Error).message}</Alert>
              )}

              <TextField
                label={t('users.new.name')}
                placeholder={t('users.new.namePlaceholder')}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                fullWidth
              />
              <TextField
                label={t('users.new.email')}
                placeholder={t('users.new.emailPlaceholder')}
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                fullWidth
              />
              <TextField
                label={`${t('users.new.phone')} ${t('users.new.phoneOptional')}`}
                placeholder={t('users.new.phonePlaceholder')}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                fullWidth
              />
              <TextField
                select
                label={t('users.new.role')}
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                required
                fullWidth
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={t('users.new.unit')}
                value={form.unitId}
                onChange={(event) => setForm({ ...form, unitId: event.target.value })}
                fullWidth
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* La casilla del diseño queda deshabilitada hasta que exista
                  servicio de correo: marcarla no enviaría nada. */}
              <Tooltip title={t('users.new.sendCredentialsDisabled')}>
                <FormControlLabel
                  control={<Checkbox disabled />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      {t('users.new.sendCredentials')}
                    </Typography>
                  }
                />
              </Tooltip>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('action.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={!canSubmit || mutation.isPending}>
              {mutation.isPending ? t('users.new.pending') : t('users.new.submit')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}
