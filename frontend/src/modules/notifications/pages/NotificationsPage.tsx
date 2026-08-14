import { useState } from 'react'
import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { NotificationRow } from '../components/NotificationRow'
import { dayHeading, groupByDay } from '../presentation'
import { PAGE_SIZE, useMarkAllRead, useMarkRead, useNotifications } from '../queries'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// La bandeja completa.
//
// Se quitaron los filtros por tipo y por día que tenía la maqueta. No fue una
// simplificación gratuita: la lista ahora la pagina el servidor, y un filtro
// aplicado en el navegador sobre la página que hay cargada dice "ninguna
// notificación de ese día" cuando lo cierto es "ninguna en estas veinte". Con
// dos tipos posibles el filtro de tipo además no separa gran cosa. Filtrar de
// verdad es filtrar en el WHERE; el día que haga falta, se agrega allí.

export function NotificationsPage() {
  const { t } = useLanguage()
  const locale = 'es-MX'
  usePageHeader(t('notifications.title'), t('notifications.subtitle'))

  const [page, setPage] = useState(0)
  const notifications = useNotifications(page, PAGE_SIZE)
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const data = notifications.data
  // El orden ya viene decidido por el servidor —sin leer primero, luego por
  // fecha— y NO se reordena aquí: hacerlo rompería la paginación, porque cada
  // página se ordenaría solo dentro de sí misma. Agrupar por día sí es seguro:
  // no cambia el orden, solo intercala encabezados.
  const groups = groupByDay(data?.entries ?? [])

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
  const ocupado = markRead.isPending || markAllRead.isPending

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        {/* Los dos contadores salen del servidor. Mientras no haya respuesta se
            pinta la raya: un cero aquí sería un dato inventado. */}
        <Typography variant="body2" color="text.secondary">
          {data
            ? `${t('notifications.unreadCount', { count: String(data.unread) })} · ${t(
                'notifications.total',
                { count: String(data.total) },
              )}`
            : '—'}
        </Typography>
        <Button
          startIcon={<DoneAllIcon />}
          // Sin nada por leer no hay nada que marcar: el botón se desactiva en
          // vez de desaparecer, para que no baile la fila de acciones.
          disabled={!data?.unread || ocupado}
          onClick={() => markAllRead.mutate()}
        >
          {t('notifications.markAllRead')}
        </Button>
      </Stack>

      {/* Altura reservada: al marcar todas como leídas la lista no debe saltar. */}
      <Box sx={{ height: 4 }}>
        {(notifications.isPending || notifications.isFetching || ocupado) && <LinearProgress />}
      </Box>

      {notifications.isError && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" color="error" align="center">
            {t('notifications.error')}
          </Typography>
        </Paper>
      )}

      {notifications.isSuccess && groups.length === 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('notifications.empty')}
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
            <NotificationRow
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markRead.mutate(id)}
            />
          ))}
        </Stack>
      ))}

      {/* La paginación solo aparece cuando hay más de una página: dos botones
          permanentemente deshabilitados bajo una lista corta son ruido. */}
      {data && pages > 1 && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Button size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>
            {t('notifications.prev')}
          </Button>
          <Typography variant="caption" color="text.secondary">
            {t('notifications.page', { page: String(page + 1), pages: String(pages) })}
          </Typography>
          <Button
            size="small"
            disabled={page + 1 >= pages}
            onClick={() => setPage(page + 1)}
          >
            {t('notifications.next')}
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
