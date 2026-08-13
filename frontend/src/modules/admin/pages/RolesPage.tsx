import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { listRoles, updateRole } from '../api/rolesApi'
import { NewRoleDialog } from '../components/NewRoleDialog'
import { PermissionMatrix } from '../components/PermissionMatrix'
import type { RoleSummary } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import { usePageHeader } from '../../../app/pageHeader'

// Etiqueta y descripción del rol elegido. Va en el mismo panel que la matriz
// porque es la otra mitad de "editar un rol", y separarlo en su propia pantalla
// obligaría a navegar dos veces para un cambio de dos campos.
function RoleDetailsForm({ role }: { role: RoleSummary }) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [label, setLabel] = useState(role.label)
  const [description, setDescription] = useState(role.description ?? '')

  const mutation = useMutation({
    mutationFn: () =>
      updateRole(role.id, {
        label,
        // Cadena vacía es "sin descripción": la columna es NULL-able y guardar
        // "" dejaría una descripción invisible pero presente.
        description: description.trim() === '' ? null : description,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  })

  const sinCambios = label === role.label && description === (role.description ?? '')

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            size="small"
            label={t('roles.field.label')}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            sx={{ minWidth: 240 }}
          />
          <TextField
            size="small"
            label={t('roles.field.description')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </Stack>

        {mutation.isError && <Alert severity="error">{(mutation.error as Error).message}</Alert>}
        {mutation.isSuccess && (
          <Alert severity="success">{t('roles.saved')}</Alert>
        )}

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            disabled={sinCambios || label.trim() === '' || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {t('roles.save')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export function RolesPage() {
  const { t } = useLanguage()
  usePageHeader(t('roles.title'), t('roles.subtitle'))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })

  // Se preselecciona el primer rol para que el panel no arranque vacío: llegar a
  // la pantalla y ver un hueco no dice que haya que hacer clic en algo.
  // Si el rol elegido desaparece (se recarga la lista, se borra), vuelve al
  // primero en vez de quedarse apuntando a nada.
  const roleList = roles.data
  useEffect(() => {
    if (!roleList?.length) return
    setSelectedId((current) =>
      current && roleList.some((role) => role.id === current) ? current : roleList[0]!.id,
    )
  }, [roleList])

  const selectedRole = roles.data?.find((role) => role.id === selectedId)

  return (
    <Stack spacing={3}>
      {/* El rol se elige en el desplegable, junto a la acción de crear uno. La
          rejilla de tarjetas que había antes ocupaba cuatro columnas de alto
          para lo mismo que hace este control, y empujaba la matriz —que es lo
          que se viene a editar— por debajo del borde de la pantalla. */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <TextField
          select
          size="small"
          label={t('roles.selector')}
          value={selectedId ?? ''}
          onChange={(event) => setSelectedId(event.target.value)}
          disabled={!roles.data?.length}
          sx={{ minWidth: 280 }}
        >
          {roles.data?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
                {/* El candado marca el rol protegido —el único que no se puede
                    editar—, no los roles base: verlo antes de elegir ahorra
                    abrir la matriz para descubrir que está bloqueada. */}
                {role.isProtected && (
                  <LockOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                )}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {role.label}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {role.userCount}{' '}
                  {t(role.userCount === 1 ? 'roles.usersCountOne' : 'roles.usersCount')}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </TextField>

        {/* La descripción del rol elegido: era lo único que las tarjetas
            mostraban y el desplegable no puede, porque en una lista de opciones
            no cabe sin volverla ilegible. El rol protegido se queda en texto
            plano; los demás se editan aquí mismo, más abajo. */}
        {selectedRole?.isProtected && selectedRole.description && (
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
            {selectedRole.description}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ flexShrink: 0 }}
        >
          {t('roles.new.button')}
        </Button>
      </Stack>

      {roles.isError && <Alert severity="error">{t('roles.loadError')}</Alert>}
      <Box sx={{ height: 4 }}>{roles.isPending && <LinearProgress />}</Box>

      {roles.data?.length === 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('roles.empty')}
          </Typography>
        </Paper>
      )}

      {/* La ficha del rol solo aparece si se puede tocar: para el rol protegido
          no hay formulario que mostrar, y su motivo ya lo explica la matriz.
          key: al cambiar de rol se monta un formulario nuevo, así no queda el
          texto a medio escribir del rol anterior. */}
      {selectedRole && !selectedRole.isProtected && (
        <RoleDetailsForm key={selectedRole.id} role={selectedRole} />
      )}

      {/* key: al cambiar de rol se monta una matriz nueva en vez de reutilizar
          la anterior, así no queda ni un borrador a medio editar ni el aviso de
          "permisos actualizados" del rol previo. */}
      {selectedId && <PermissionMatrix key={selectedId} roleId={selectedId} />}

      {/* El historial de cambios de permisos se fue a su propia pantalla, bajo
          Reportes: aquí eran los tres últimos compitiendo con la matriz que se
          está editando, y allí caben todos. */}
      <NewRoleDialog
        open={dialogOpen}
        roles={roles.data ?? []}
        onClose={() => setDialogOpen(false)}
      />
    </Stack>
  )
}
