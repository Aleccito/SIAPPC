import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { getRolePermissions, listRoles, saveRolePermissions } from '../api/rolesApi'
import { permissionActions } from '../types'
import type { PermissionAction, RolePermission } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

// La matriz de permisos de un rol, sin cabecera de página ni navegación: la usan
// tanto el panel dentro de Roles y Permisos como la ruta directa
// /admin/roles/:id/permissions, que sigue existiendo para enlaces guardados.
export function PermissionMatrix({ roleId }: { roleId: string }) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<RolePermission[] | null>(null)

  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })
  const permissions = useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => getRolePermissions(roleId),
  })

  const role = roles.data?.find((entry) => entry.id === roleId)
  const locked = role?.isSystem ?? true

  // El borrador se edita en memoria y solo viaja al servidor al guardar, para
  // que marcar diez casillas no dispare diez peticiones.
  //
  // `roleId` en las dependencias: al cambiar de rol seleccionado sin desmontar
  // el componente, sin él la tabla seguiría mostrando el borrador del anterior.
  useEffect(() => {
    setDraft(permissions.data ?? null)
  }, [permissions.data, roleId])

  const mutation = useMutation({
    mutationFn: (rows: RolePermission[]) => saveRolePermissions(roleId, rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', roleId] })
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
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {t('matrix.title')} — {role?.label ?? ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locked ? t('matrix.lockedHint') : t('matrix.editableHint')}
          </Typography>
        </Box>
        {locked && (
          <Chip
            size="small"
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
                          // El nombre accesible tiene que decir módulo Y acción:
                          // sin él son cuarenta casillas llamadas "checkbox".
                          'aria-label': `${role?.label ?? ''} — ${row.label} — ${t(`matrix.col.${action}` as StringKey)}`,
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
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={!draft || mutation.isPending}
            onClick={() => mutation.mutate(draft!)}
          >
            {mutation.isPending ? t('matrix.saving') : t('matrix.save')}
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
