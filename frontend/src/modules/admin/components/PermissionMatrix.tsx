import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
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
import { LoadingBar } from '../../../shared/LoadingBar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { getRolePermissions, listRoles, saveRolePermissions } from '../api/rolesApi'
import { permissionActions } from '../types'
import type { PermissionAction, RolePermission } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'

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
  // Solo el rol protegido va en solo lectura. Mientras la lista de roles no ha
  // llegado se bloquea por defecto, para no ofrecer guardar algo que el
  // servidor podría rechazar.
  const locked = role?.isProtected ?? true

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
            {/* El motivo del bloqueo va escrito, no solo insinuado por las
                casillas grises: el candado dice que no se puede, el texto dice
                por qué. */}
            {locked
              ? t('roles.matrixProtectedHint')
              : t('matrix.editableHint')}
          </Typography>
        </Box>
        {locked && (
          <Chip
            size="small"
            color="error"
            variant="outlined"
            icon={<LockOutlinedIcon />}
            label={t('roles.matrixProtected')}
          />
        )}
      </Stack>

      {permissions.isError && <Alert severity="error">{t('matrix.loadError')}</Alert>}
      {mutation.isError && (
        <Alert severity="error">{(mutation.error as Error).message}</Alert>
      )}
      {mutation.isSuccess && <Alert severity="success">{t('matrix.saved')}</Alert>}

      <TableContainer component={Paper}>
        <LoadingBar loading={permissions.isPending || mutation.isPending} />
        <Table aria-label={t('matrix.title')} size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('matrix.col.module')}</TableCell>
              {permissionActions.map((action) => (
                <TableCell key={action} align="center" sx={{ width: 110 }}>
                  {t(`matrix.col.${action}`)}
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
                          'aria-label': `${role?.label ?? ''} — ${row.label} — ${t(`matrix.col.${action}`)}`,
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
