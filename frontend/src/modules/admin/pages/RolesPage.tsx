import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { listRoles } from '../api/rolesApi'
import { NewRoleDialog } from '../components/NewRoleDialog'
import { PermissionMatrix } from '../components/PermissionMatrix'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

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
                {/* El candado marca los roles del sistema, que son los que no
                    se pueden editar: verlo antes de elegir ahorra abrir la
                    matriz para descubrir que está bloqueada. */}
                {role.isSystem && (
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
            no cabe sin volverla ilegible. */}
        {selectedRole?.description && (
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
