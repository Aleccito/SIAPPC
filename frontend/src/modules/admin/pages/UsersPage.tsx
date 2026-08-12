import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import HistoryIcon from '@mui/icons-material/History'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import { listUnits, listUsers, updateUser } from '../api/usersApi'
import { listRoles } from '../api/rolesApi'
import { ActivityDialog } from '../components/ActivityDialog'
import { NewUserDialog } from '../components/NewUserDialog'
import { useAuth } from '../../auth/useAuth'
import type { User } from '../../auth/types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

const ALL = '__all__'

export function UsersPage() {
  const { t } = useLanguage()
  usePageHeader(t('users.title'), t('users.subtitle'))
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const locale = 'es-MX'

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(ALL)
  const [unitFilter, setUnitFilter] = useState(ALL)
  const [statusFilter, setStatusFilter] = useState(ALL)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [menu, setMenu] = useState<{ anchor: HTMLElement; user: User } | null>(null)
  const [newUserOpen, setNewUserOpen] = useState(false)
  const [activityUser, setActivityUser] = useState<User | null>(null)

  const users = useQuery({ queryKey: ['users'], queryFn: listUsers })
  const roles = useQuery({ queryKey: ['roles'], queryFn: listRoles })
  const units = useQuery({ queryKey: ['units'], queryFn: listUnits })

  const mutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateUser(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (users.data ?? []).filter((user) => {
      if (term && !`${user.name} ${user.email}`.toLowerCase().includes(term)) return false
      if (roleFilter !== ALL && user.role !== roleFilter) return false
      if (unitFilter !== ALL && user.unit !== unitFilter) return false
      if (statusFilter !== ALL && String(user.active) !== statusFilter) return false
      return true
    })
  }, [users.data, search, roleFilter, unitFilter, statusFilter])

  // Filtrar puede dejar la página actual fuera de rango; se corrige al vuelo en
  // vez de con un efecto, que provocaría un render extra con la tabla vacía.
  const safePage = page * rowsPerPage >= filtered.length ? 0 : page
  const visible = filtered.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)

  function resetPageAnd<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(0)
    }
  }

  return (
    <Stack spacing={3}>

      {mutation.isError && (
        <Alert severity="error">{(mutation.error as Error).message}</Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            placeholder={t('users.search')}
            value={search}
            onChange={(event) => resetPageAnd(setSearch)(event.target.value)}
            sx={{ flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            label={t('users.filter.role')}
            value={roleFilter}
            onChange={(event) => resetPageAnd(setRoleFilter)(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('users.filter.all')}</MenuItem>
            {roles.data?.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('users.filter.unit')}
            value={unitFilter}
            onChange={(event) => resetPageAnd(setUnitFilter)(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('users.filter.all')}</MenuItem>
            {units.data?.map((unit) => (
              <MenuItem key={unit.id} value={unit.name}>
                {unit.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('users.filter.status')}
            value={statusFilter}
            onChange={(event) => resetPageAnd(setStatusFilter)(event.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value={ALL}>{t('users.filter.all')}</MenuItem>
            <MenuItem value="true">{t('users.status.active')}</MenuItem>
            <MenuItem value="false">{t('users.status.suspended')}</MenuItem>
          </TextField>
          {/* La acción cierra la fila de filtros en vez de ocupar una propia,
              que quedaba vacía de lado a lado. `ml: auto` la empuja al extremo
              en pantalla ancha; apilada, se queda donde caiga. */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewUserOpen(true)}
            sx={{ ml: { md: 'auto' }, flexShrink: 0 }}
          >
            {t('users.new.button')}
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        {/* Altura reservada: al cambiar un estado la tabla no debe saltar. */}
        <Box sx={{ height: 4 }}>
          {(users.isPending || mutation.isPending) && <LinearProgress />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('users.col.name')}</TableCell>
              <TableCell>{t('users.col.email')}</TableCell>
              <TableCell>{t('users.col.role')}</TableCell>
              <TableCell>{t('users.col.unit')}</TableCell>
              <TableCell>{t('users.col.status')}</TableCell>
              <TableCell>{t('users.col.lastActivity')}</TableCell>
              <TableCell align="right">{t('users.col.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {users.data?.length ? t('users.noMatches') : t('users.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {visible.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{user.name}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                <TableCell>
                  <Chip size="small" label={user.roleLabel} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{user.unit ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.active ? t('users.status.active') : t('users.status.suspended')}
                    color={user.active ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {user.lastActivity
                    ? new Date(user.lastActivity).toLocaleString(locale)
                    : t('users.never')}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={t('users.action.menu')}
                    onClick={(event) => setMenu({ anchor: event.currentTarget, user })}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={safePage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          labelRowsPerPage={t('users.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            `${t('users.showing')} ${from}–${to} ${t('users.of')} ${count} ${t('users.usersLabel')}`
          }
        />
      </TableContainer>

      <Menu anchorEl={menu?.anchor} open={Boolean(menu)} onClose={() => setMenu(null)}>
        <MenuItem
          onClick={() => {
            setActivityUser(menu!.user)
            setMenu(null)
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('users.action.history')}</ListItemText>
        </MenuItem>
        <MenuItem
          // Suspenderse a sí mismo cierra la sesión en curso; el servidor
          // además rechaza suspender al último administrador.
          disabled={menu?.user.id === currentUser?.id}
          onClick={() => {
            mutation.mutate({ id: menu!.user.id, active: !menu!.user.active })
            setMenu(null)
          }}
        >
          <ListItemIcon>
            {menu?.user.active ? (
              <BlockIcon fontSize="small" />
            ) : (
              <CheckCircleOutlineIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {menu?.user.active ? t('users.action.suspend') : t('users.action.activate')}
          </ListItemText>
        </MenuItem>
      </Menu>

      <NewUserDialog
        open={newUserOpen}
        roles={roles.data ?? []}
        units={units.data ?? []}
        onClose={() => setNewUserOpen(false)}
      />
      <ActivityDialog user={activityUser} onClose={() => setActivityUser(null)} />
    </Stack>
  )
}
