import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { keyframes } from '@emotion/react'
import { Badge, Box, Button, Divider, IconButton, Popover, Stack, Typography } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { NotificationRow } from './NotificationRow'
import { PREVIEW_SIZE, useNotificationStream, useNotifications } from '../queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { motion } from '../../../shared/theme'

// Dos toques y para. El contador de la campana sube SOLO —lo empuja el flujo de
// eventos, sin que nadie toque nada—, así que un número que cambia en una
// esquina no lo ve nadie que esté mirando una cama. Este es el único aviso de
// que acaba de entrar algo.
//
// Se agota a propósito en vez de repetirse: una campana que late sin parar hasta
// que la abras es una alarma, y esta pantalla ya tiene las suyas.
const bellRing = keyframes`
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.18); }
  50% { transform: scale(1); }
  75% { transform: scale(1.12); }
`

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

  // Solo cuando SUBE. Bajar es haber marcado algo como leído, y eso lo hizo el
  // propio usuario: no hay nada que anunciarle.
  //
  // El primer valor conocido no cuenta como subida: al cargar la pantalla se
  // pasa de "no sé" a "hay siete", y siete avisos de ayer no son novedad.
  const [ringing, setRinging] = useState(false)
  const previous = useRef<number | null>(null)
  const unread = page?.unread ?? null

  useEffect(() => {
    if (unread === null) return
    const before = previous.current
    previous.current = unread
    if (before === null || unread <= before) return

    setRinging(true)
    const timer = setTimeout(() => setRinging(false), 900)
    return () => clearTimeout(timer)
  }, [unread])

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
        <Badge
          badgeContent={page?.unread ?? 0}
          color="error"
          invisible={!page?.unread}
          sx={{
            animation: ringing ? `${bellRing} 900ms ${motion.enter} 1` : 'none',
            // El contador sigue subiendo y sigue en rojo: quien pidió menos
            // movimiento no se queda sin enterarse, se queda sin el meneo.
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      {/* El contador sube solo, empujado por el flujo de eventos: es el único
          cambio de esta aplicación que nadie provoca. Sin región viva, quien no
          ve la pantalla no se entera nunca de que entró un aviso.
          `polite` y no `assertive`: una notificación no interrumpe lo que el
          lector esté leyendo, espera a que termine la frase. */}
      <Box aria-live="polite" sx={visuallyHidden}>
        {unread === null || unread === 0
          ? ''
          : t('notifications.unreadCount', { count: String(unread) })}
      </Box>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        // El botón anuncia `aria-haspopup="dialog"`, así que lo que abre tiene
        // que SER un diálogo y tener nombre: sin esto el lector prometía un
        // diálogo y entregaba un contenedor anónimo.
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': t('notifications.title'),
            sx: { width: 420, maxWidth: '100vw' },
          },
        }}
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

          {recent.length > 0 && (
            <Stack
              component="ul"
              spacing={1.5}
              sx={{ listStyle: 'none', m: 0, p: 0 }}
              aria-label={t('notifications.title')}
            >
              {recent.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} dense />
              ))}
            </Stack>
          )}
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
