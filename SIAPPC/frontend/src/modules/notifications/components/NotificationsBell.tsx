import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { Badge, Box, Button, Divider, IconButton, Popover, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { listNotifications } from '../api/notificationsApi'
import { NotificationRow } from './NotificationRow'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Cuántas caben en el panel sin que haya que desplazarse. El resto está en la
// bandeja completa, que es a donde lleva el pie.
const PREVIEW = 4

export function NotificationsBell() {
  const { t } = useLanguage()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  // Misma queryKey que la bandeja: marcar todas como leídas allí actualiza el
  // contador de aquí sin que ninguna de las dos sepa de la otra.
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
  })

  const all = notifications.data ?? []
  const unread = all.filter((entry) => !entry.read).length
  const recent = [...all].sort((a, b) => b.at.localeCompare(a.at)).slice(0, PREVIEW)

  return (
    <>
      <IconButton
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={t('layout.notifications')}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
      >
        <Badge badgeContent={unread} color="error">
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
          <Typography variant="subtitle2">{t('notifications.title')}</Typography>

          {recent.length === 0 && (
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
