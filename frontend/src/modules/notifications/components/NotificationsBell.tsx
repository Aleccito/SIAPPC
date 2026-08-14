import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Badge, Box, Button, Divider, IconButton, Popover, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { NotificationRow } from './NotificationRow'
import { PREVIEW_SIZE, useNotificationStream, useNotifications } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'

export function NotificationsBell() {
  const { t } = useLanguage()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  // La primera página, que es a la vez el contenido del panel y —por el campo
  // `unread` que viaja con ella— el número de la campana. Una sola petición
  // para las dos cosas: partirlas dejaría al contador y a la lista pudiendo
  // discrepar entre sí.
  const notifications = useNotifications(0, PREVIEW_SIZE)

  // La campana está en el armazón, así que esta suscripción vive mientras dure
  // la sesión: es el único sitio de la aplicación desde el que el contador se
  // entera de una notificación nueva sin que el usuario haga nada.
  useNotificationStream()

  const page = notifications.data
  const recent = page?.entries ?? []

  return (
    <>
      <IconButton
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={t('layout.notifications')}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
      >
        {/* Mientras no se sepa el número no se pinta ninguno. Un 0 de relleno
            durante la carga diría "no tienes nada", que es justo lo contrario
            de lo que la campana existe para comunicar si resulta que sí hay. */}
        <Badge badgeContent={page?.unread ?? 0} color="error" invisible={!page?.unread}>
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 420, maxWidth: '100vw' } } }}
      >
        <Stack spacing={1.5} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle2">{t('notifications.title')}</Typography>
            {page && page.unread > 0 && (
              <Typography variant="caption" color="text.secondary">
                {t('notifications.unreadCount', { count: String(page.unread) })}
              </Typography>
            )}
          </Stack>

          {/* Tres estados distintos y ningún atajo entre ellos: cargando no es
              lo mismo que vacío, y un fallo de red no puede parecer una bandeja
              limpia. */}
          {notifications.isPending && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              —
            </Typography>
          )}
          {notifications.isError && (
            <Typography variant="body2" color="error" sx={{ py: 2 }}>
              {t('notifications.error')}
            </Typography>
          )}
          {notifications.isSuccess && recent.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              {t('notifications.empty')}
            </Typography>
          )}

          {recent.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} dense />
          ))}
        </Stack>

        <Divider />
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            component={RouterLink}
            to="/notifications"
            endIcon={<ArrowForwardIcon />}
            // Cerrar al navegar: sin esto el panel se queda abierto encima de la
            // pantalla a la que acaba de llevar.
            onClick={() => setAnchor(null)}
          >
            {t('notifications.viewAll')}
          </Button>
        </Box>
      </Popover>
    </>
  )
}
