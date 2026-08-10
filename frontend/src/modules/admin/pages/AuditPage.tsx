import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
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
import { listAudit, listAuditEntities } from '../api/auditApi'
import { listUsers } from '../api/usersApi'
import { auditActions } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const ALL = '__all__'

const RANGES = [
  { value: '1', label: 'audit.range.24h' },
  { value: '7', label: 'audit.range.7d' },
  { value: '30', label: 'audit.range.30d' },
  { value: ALL, label: 'audit.range.all' },
] as const satisfies readonly { value: string; label: StringKey }[]

// Cada acción tiene un color propio: en una lista larga el color es lo que deja
// localizar un borrado entre cientos de inicios de sesión.
const ACTION_COLOR: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  LOGIN: 'default',
  LOGOUT: 'default',
  INSERT: 'success',
  UPDATE: 'warning',
  DELETE: 'error',
}

export function AuditPage() {
  const { t, language } = useLanguage()
  const locale = language === 'es' ? 'es-MX' : 'en-US'

  const [userId, setUserId] = useState(ALL)
  const [entity, setEntity] = useState(ALL)
  const [action, setAction] = useState(ALL)
  const [range, setRange] = useState<string>('30')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)

  const users = useQuery({ queryKey: ['users'], queryFn: listUsers })
  const entities = useQuery({ queryKey: ['auditEntities'], queryFn: listAuditEntities })

  const filters = {
    userId: userId === ALL ? undefined : userId,
    entity: entity === ALL ? undefined : entity,
    action: action === ALL ? undefined : action,
    days: range === ALL ? undefined : Number(range),
    page,
    pageSize,
  }

  const audit = useQuery({
    queryKey: ['audit', filters],
    queryFn: () => listAudit(filters),
    // Al cambiar de página la tabla anterior se queda en pantalla en vez de
    // vaciarse, así la lista no salta.
    placeholderData: keepPreviousData,
  })

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(0)
    }
  }

  const filtersActive = userId !== ALL || entity !== ALL || action !== ALL || range !== '30'

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">{t('audit.title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('audit.subtitle')}
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label={t('audit.filter.user')}
            value={userId}
            onChange={(event) => change(setUserId)(event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={ALL}>{t('audit.filter.all')}</MenuItem>
            {users.data?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('audit.filter.entity')}
            value={entity}
            onChange={(event) => change(setEntity)(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('audit.filter.all')}</MenuItem>
            {entities.data?.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('audit.filter.action')}
            value={action}
            onChange={(event) => change(setAction)(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={ALL}>{t('audit.filter.all')}</MenuItem>
            {auditActions.map((name) => (
              <MenuItem key={name} value={name}>
                {t(`audit.${name}` as StringKey)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('audit.filter.range')}
            value={range}
            onChange={(event) => change(setRange)(event.target.value)}
            sx={{ minWidth: 160 }}
          >
            {RANGES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.label)}
              </MenuItem>
            ))}
          </TextField>

          {filtersActive && (
            <Button
              onClick={() => {
                setUserId(ALL)
                setEntity(ALL)
                setAction(ALL)
                setRange('30')
                setPage(0)
              }}
            >
              {t('audit.clearFilters')}
            </Button>
          )}
        </Stack>
      </Paper>

      {audit.isError && <Alert severity="error">{t('audit.error')}</Alert>}

      <TableContainer component={Paper}>
        <Box sx={{ height: 4 }}>{audit.isFetching && <LinearProgress />}</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>{t('audit.col.when')}</TableCell>
              <TableCell sx={{ width: 180 }}>{t('audit.col.author')}</TableCell>
              <TableCell sx={{ width: 150 }}>{t('audit.col.action')}</TableCell>
              <TableCell sx={{ width: 140 }}>{t('audit.col.entity')}</TableCell>
              <TableCell>{t('audit.col.detail')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audit.data?.entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('audit.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {audit.data?.entries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {new Date(entry.at).toLocaleString(locale)}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{entry.author ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={ACTION_COLOR[entry.action] ?? 'default'}
                    label={t(`audit.${entry.action}` as StringKey)}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{entry.entity}</TableCell>
                <TableCell>{entry.note ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={audit.data?.total ?? 0}
          page={page}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[25, 50, 100]}
          onRowsPerPageChange={(event) => {
            setPageSize(Number(event.target.value))
            setPage(0)
          }}
          labelRowsPerPage={t('users.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            `${t('users.showing')} ${from}–${to} ${t('users.of')} ${count}`
          }
        />
      </TableContainer>
    </Stack>
  )
}
