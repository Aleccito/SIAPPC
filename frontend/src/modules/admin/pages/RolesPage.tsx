import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { listRoleChanges, listRoles } from '../api/rolesApi'
import { NewRoleDialog } from '../components/NewRoleDialog'
import { useLanguage } from '../../../shared/i18n/useLanguage'

export function RolesPage() {
  const { t, language } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const locale = language === 'es' ? 'es-MX' : 'en-US'

  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })
  const changes = useQuery({ queryKey: ['roleChanges'], queryFn: listRoleChanges })

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">{t('roles.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('roles.subtitle')}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          {t('roles.new.button')}
        </Button>
      </Stack>

      {roles.isError && <Alert severity="error">{t('roles.loadError')}</Alert>}
      <Box sx={{ height: 4 }}>{roles.isPending && <LinearProgress />}</Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {roles.data?.map((role) => (
          <Paper key={role.id} sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {role.label}
                </Typography>
                {role.isSystem && <Chip size="small" label={t('roles.predefined')} />}
              </Stack>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('roles.assigned')}
                </Typography>
                <Typography variant="h6">
                  {role.userCount}{' '}
                  {t(role.userCount === 1 ? 'roles.usersCountOne' : 'roles.usersCount')}
                </Typography>
              </Box>

              <Divider />

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: 'center', flexGrow: 1, color: 'text.secondary' }}
                >
                  {role.isSystem && <LockOutlinedIcon sx={{ fontSize: 14 }} />}
                  <Typography variant="body2">
                    {role.isSystem ? t('roles.systemRole') : t('roles.customRole')}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  component={RouterLink}
                  to={`/admin/roles/${role.id}/permissions`}
                >
                  {t('roles.editPermissions')}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('roles.changes.title')}
          </Typography>
          {/* El historial completo, con filtros y paginación, vive en
              Auditoría; aquí solo caben los últimos movimientos. */}
          <Button
            size="small"
            component={RouterLink}
            to="/admin/audit"
            endIcon={<ArrowForwardIcon />}
          >
            {t('roles.changes.seeAll')}
          </Button>
        </Stack>
        <Stack divider={<Divider />}>
          {changes.data?.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              {t('roles.changes.empty')}
            </Typography>
          )}
          {changes.data?.slice(0, 3).map((change) => (
            <Stack
              key={change.id}
              direction="row"
              spacing={2}
              sx={{ alignItems: 'center', py: 1.5 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 140 }}>
                {change.author ?? '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {change.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(change.at).toLocaleString(locale)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <NewRoleDialog
        open={dialogOpen}
        roles={roles.data ?? []}
        onClose={() => setDialogOpen(false)}
      />
    </Stack>
  )
}
