import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { getRolePermissions, listRoles, saveRolePermissions } from '../api/rolesApi'
import { permissionActions } from '../types'
import type { PermissionAction, RolePermission } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

export function PermissionMatrixPage() {
  const { t } = useLanguage()
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<RolePermission[] | null>(null)

  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })
  const permissions = useQuery({
    queryKey: ['rolePermissions', id],
    queryFn: () => getRolePermissions(id),
  })

  const role = roles.data?.find((entry) => entry.id === id)
  const locked = role?.isSystem ?? true

  // El borrador se edita en memoria y solo viaja al servidor al guardar, para
  // que marcar diez casillas no dispare diez peticiones.
  useEffect(() => {
    if (permissions.data) setDraft(permissions.data)
  }, [permissions.data])

  const mutation = useMutation({
    mutationFn: (rows: RolePermission[]) => saveRolePermissions(id, rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', id] })
      queryClient.invalidateQueries({ queryKey: ['roleChanges'] })
    },
  })

  function toggle(module: string, action: PermissionAction) {
    setDraft((rows) =>
      (rows ?? []).map((row) =>
        row.module === module ? { ...row, [action]: !row[action] } : row,
      ),
    )
  }

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        to="/admin/roles"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('matrix.back')}
      </Button>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">
            {t('matrix.title')} — {role?.label ?? ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locked ? t('matrix.lockedHint') : t('matrix.editableHint')}
          </Typography>
        </Box>
        {locked && (
          <Chip
            color="error"
            variant="outlined"
            icon={<LockOutlinedIcon />}
            label={t('matrix.locked')}
          />
        )}
      </Stack>

      {permissions.isError && <Alert severity="error">{t('matrix.loadError')}</Alert>}
      {mutation.isError && (
        <Alert severity="error">{(mutation.error as Error).message}</Alert>
      )}
      {mutation.isSuccess && <Alert severity="success">{t('matrix.saved')}</Alert>}

      <TableContainer component={Paper}>
        <Box sx={{ height: 4 }}>
          {(permissions.isPending || mutation.isPending) && <LinearProgress />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('matrix.col.module')}</TableCell>
              {permissionActions.map((action) => (
                <TableCell key={action} align="center" sx={{ width: 110 }}>
                  {t(`matrix.col.${action}` as StringKey)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {draft?.map((row) => (
              <TableRow key={row.module} hover>
                <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                {permissionActions.map((action) => (
                  <TableCell key={action} align="center">
                    <Checkbox
                      size="small"
                      checked={row[action]}
                      disabled={locked}
                      onChange={() => toggle(row.module, action)}
                      slotProps={{
                        input: {
                          'aria-label': `${row.label} — ${t(`matrix.col.${action}` as StringKey)}`,
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!locked && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button component={RouterLink} to="/admin/roles">
              {t('action.cancel')}
            </Button>
            <Button
              variant="contained"
              disabled={!draft || mutation.isPending}
              onClick={() => mutation.mutate(draft!)}
            >
              {mutation.isPending ? t('matrix.saving') : t('matrix.save')}
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}
