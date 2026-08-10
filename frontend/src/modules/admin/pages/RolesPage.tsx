import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { listRoleChanges, listRoles } from '../api/rolesApi'
import { NewRoleDialog } from '../components/NewRoleDialog'
import { PermissionMatrix } from '../components/PermissionMatrix'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

export function RolesPage() {
  const { t, language } = useLanguage()
  usePageHeader(t('roles.title'), t('roles.subtitle'))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const locale = language === 'es' ? 'es-MX' : 'en-US'

  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })
  const changes = useQuery({ queryKey: ['roleChanges'], queryFn: listRoleChanges })

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

  return (
    <Stack spacing={3}>
      {/* Título y descripción se fueron a la barra superior (usePageHeader);
          queda la acción, alineada a la derecha como estaba. */}
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          {t('roles.new.button')}
        </Button>
      </Stack>

      {roles.isError && <Alert severity="error">{t('roles.loadError')}</Alert>}
      <Box sx={{ height: 4 }}>{roles.isPending && <LinearProgress />}</Box>

      {/* Rejilla de roles: cada tarjeta selecciona, y la matriz de abajo cambia
          sin salir de la pestaña. Antes había que navegar a otra página y
          volver para comparar dos roles. */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {roles.data?.map((role) => {
          const selected = role.id === selectedId
          return (
            <Card
              key={role.id}
              variant="outlined"
              sx={{
                // El borde de color es lo que marca la selección; el fondo
                // teñido solo la refuerza. Con fondo a secas, en una fila de
                // cuatro tarjetas no se distingue cuál está activa.
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: (theme) =>
                  selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                transition: 'border-color 160ms, background-color 160ms',
              }}
            >
              <CardActionArea
                onClick={() => setSelectedId(role.id)}
                // aria-pressed y no aria-selected: esto es un botón de
                // alternancia, no una opción dentro de un listbox.
                aria-pressed={selected}
                sx={{ p: 2, height: '100%', alignItems: 'stretch' }}
              >
                <Stack spacing={1} sx={{ height: '100%' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
                      {role.label}
                    </Typography>
                    {role.isSystem && (
                      <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    )}
                  </Stack>

                  {/* La descripción distingue dos roles de nombre parecido; la
                      API siempre la tuvo y la pantalla no la mostraba. */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexGrow: 1, minHeight: '2.4em' }}
                  >
                    {role.description ?? t('roles.noDescription')}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={role.isSystem ? 'default' : 'primary'}
                      label={role.isSystem ? t('roles.predefined') : t('roles.customRole')}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {role.userCount}{' '}
                      {t(role.userCount === 1 ? 'roles.usersCountOne' : 'roles.usersCount')}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          )
        })}
      </Box>

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
