import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { createRole } from '../api/rolesApi'
import type { RoleSummary } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  open: boolean
  roles: RoleSummary[]
  onClose: () => void
}

const EMPTY = { label: '', description: '', baseRole: '' }

export function NewRoleDialog({ open, roles, onClose }: Props) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY)

  const mutation = useMutation({
    mutationFn: createRole,
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roleChanges'] })
      setForm(EMPTY)
      onClose()
      // El botón promete "crear y configurar": el rol nuevo se abre en su
      // matriz, que es donde el administrador termina el trabajo.
      navigate(`/admin/roles/${role.id}/permissions`)
    },
  })

  function handleClose() {
    setForm(EMPTY)
    mutation.reset()
    onClose()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    mutation.mutate({
      label: form.label.trim(),
      description: form.description.trim() || undefined,
      baseRole: form.baseRole || undefined,
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 6 }}>
        {t('roles.new.title')}
        <IconButton
          onClick={handleClose}
          aria-label={t('action.close')}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {mutation.isError && (
              <Alert severity="error">{(mutation.error as Error).message}</Alert>
            )}

            <TextField
              label={t('roles.new.name')}
              placeholder={t('roles.new.namePlaceholder')}
              value={form.label}
              onChange={(event) => setForm({ ...form, label: event.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t('roles.new.description')}
              placeholder={t('roles.new.descriptionPlaceholder')}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              multiline
              minRows={2}
              fullWidth
            />
            <TextField
              select
              label={t('roles.new.baseRole')}
              value={form.baseRole}
              onChange={(event) => setForm({ ...form, baseRole: event.target.value })}
              helperText={t('roles.new.baseRoleHint')}
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('action.cancel')}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!form.label.trim() || mutation.isPending}
          >
            {mutation.isPending ? t('roles.new.pending') : t('roles.new.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
