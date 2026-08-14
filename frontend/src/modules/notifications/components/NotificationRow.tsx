import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import {
  kindIcon,
  kindTile,
  notificationBody,
  notificationTitle,
  relativeTime,
} from '../presentation'
import type { Notification } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Una fila de la bandeja. Se comparte con el menú de la campana para que las
// dos vistas no expliquen el mismo aviso de dos maneras distintas.
export function NotificationRow({
  notification,
  dense = false,
  onMarkRead,
}: {
  notification: Notification
  dense?: boolean
  /**
   * Sin esta función la fila no ofrece marcar como leída. El panel de la
   * campana la omite a propósito: es una vista de un vistazo, y un botón que
   * hace desaparecer lo que estás mirando no es lo que se espera al asomarse.
   */
  onMarkRead?: (id: string) => void
}) {
  const { t } = useLanguage()
  const locale = 'es-MX'
  const Icon = kindIcon(notification.kind)

  return (
    <Paper
      sx={{
        p: dense ? 1.25 : 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: dense ? 1.25 : 2,
        // Sin leer: fondo blanco y punto azul. Leído: el mismo blanco pero sin
        // punto y con el título en peso normal. Se distinguen por el punto y no
        // por el fondo porque una bandeja medio gris se lee como deshabilitada.
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          width: 8,
          flexShrink: 0,
          alignSelf: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!notification.read && (
          <Box
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }}
            // El punto es la única marca de "sin leer", así que necesita nombre:
            // de otro modo el estado no existe para un lector de pantalla.
            role="img"
            aria-label={t('notifications.unread')}
          />
        )}
      </Box>

      <Box
        sx={(theme) => ({
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          width: dense ? 32 : 40,
          height: dense ? 32 : 40,
          borderRadius: 2,
          ...kindTile(theme, notification.kind),
        })}
      >
        <Icon fontSize="small" />
      </Box>

      <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant={dense ? 'body2' : 'subtitle2'}
          sx={{ fontWeight: notification.read ? 500 : 700 }}
        >
          {notificationTitle(notification, t)}
        </Typography>
        <Typography variant={dense ? 'caption' : 'body2'} color="text.secondary">
          {notificationBody(notification, t)}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {relativeTime(notification.at, t, locale)}
        </Typography>
        {/* Solo en las que quedan por leer: sobre una ya leída el botón no
            haría nada y sería una promesa vacía en cada renglón. */}
        {onMarkRead && !notification.read && (
          <Tooltip title={t('notifications.markRead')}>
            <IconButton size="small" onClick={() => onMarkRead(notification.id)}>
              <DoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Paper>
  )
}
