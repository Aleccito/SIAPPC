import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { listNotifications, markAllRead } from '../api/notificationsApi'
import { NotificationRow } from '../components/NotificationRow'
import { dayHeading, dayKey, groupByDay } from '../presentation'
import { notificationKinds } from '../types'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const ALL = '__all__'

export function NotificationsPage() {
  const { t } = useLanguage()
  const locale = 'es-MX'
  usePageHeader(t('notifications.title'), t('notifications.subtitle'))
  const queryClient = useQueryClient()
  const [kind, setKind] = useState(ALL)
  // Vacío = todos los días. Formato `YYYY-MM-DD`, el mismo que emite el input y
  // el que devuelve `dayKey`, así que el filtro es una comparación de cadenas.
  const [day, setDay] = useState('')

  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
  })

  const mutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const groups = useMemo(() => {
    const all = notifications.data ?? []
    const filtered = all.filter(
      (entry) =>
        (kind === ALL || entry.kind === kind) && (!day || dayKey(entry.at) === day),
    )
    // Más reciente primero dentro de cada día; `groupByDay` ordena los días.
    const sorted = [...filtered].sort((a, b) => b.at.localeCompare(a.at))
    return groupByDay(sorted)
  }, [notifications.data, kind, day])

  // Límite del selector de fecha: no hay notificaciones del futuro, y dejar
  // elegirlas solo lleva a una pantalla vacía.
  const todayKey = dayKey(new Date())

  const unread = (notifications.data ?? []).filter((entry) => !entry.read).length

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'flex-end' }}
      >
        <Button
          startIcon={<DoneAllIcon />}
          // Sin nada por leer no hay nada que marcar: el botón se desactiva en
          // vez de desaparecer, para que no baile la fila de acciones.
          disabled={!unread || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {t('notifications.markAllRead')}
        </Button>
        <TextField
          type="date"
          size="small"
          label={t('notifications.filter.day')}
          value={day}
          onChange={(event) => setDay(event.target.value)}
          // El input de fecha nativo evita traer un selector de calendario
          // entero como dependencia, y ya viene traducido y accesible.
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayKey } }}
          sx={{ minWidth: 170 }}
        />
        {/* Solo aparece cuando hay algo que limpiar: un botón permanentemente
            deshabilitado al lado del campo es ruido. */}
        {day && (
          <Button size="small" onClick={() => setDay('')}>
            {t('notifications.filter.clearDay')}
          </Button>
        )}
        <TextField
          select
          size="small"
          label={t('notifications.filter.kind')}
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value={ALL}>{t('notifications.filter.all')}</MenuItem>
          {notificationKinds.map((name) => (
            <MenuItem key={name} value={name}>
              {t(`notifications.kind.${name}` as StringKey)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Altura reservada: al marcar todas como leídas la lista no debe saltar. */}
      <Box sx={{ height: 4 }}>
        {(notifications.isPending || mutation.isPending) && <LinearProgress />}
      </Box>

      {groups.length === 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {notifications.data?.length
              ? t('notifications.noMatches')
              : t('notifications.empty')}
          </Typography>
        </Paper>
      )}

      {groups.map(([key, items]) => (
        <Stack key={key} spacing={1.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: '0.08em' }}
          >
            {dayHeading(key, t, locale)}
          </Typography>
          {items.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
