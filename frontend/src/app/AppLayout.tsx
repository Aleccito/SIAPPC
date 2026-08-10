import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { useAuth } from '../modules/auth/useAuth'
import { LanguageToggle } from '../shared/i18n/LanguageToggle'
import { useLanguage } from '../shared/i18n/useLanguage'
import { sidebar } from '../shared/theme'
import { modules } from '../modules/registry'
import { usePageHeaderValue } from './pageHeader'
import { PageHeaderProvider } from './PageHeaderProvider'

// El proveedor va por fuera para que la barra superior y el <Outlet/> queden
// dentro del mismo contexto: las pantallas escriben el encabezado y la barra lo
// lee. Si estuviera dentro de AppLayoutInner, ese componente no podría leer lo
// que él mismo provee.
export function AppLayout() {
  return (
    <PageHeaderProvider>
      <AppLayoutInner />
    </PageHeaderProvider>
  )
}

const COLLAPSED_KEY = 'app.sidebarCollapsed'

function AppLayoutInner() {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const header = usePageHeaderValue()

  // Se recuerda entre recargas, como el idioma: si alguien trabaja con la barra
  // plegada, no quiere volver a plegarla en cada visita.
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_KEY) === 'true',
  )

  function toggleSidebar() {
    setCollapsed((value) => {
      localStorage.setItem(COLLAPSED_KEY, String(!value))
      return !value
    })
  }

  const width = collapsed ? sidebar.collapsedWidth : sidebar.width
  const visibleModules = modules.filter(
    (module) => !module.requiredRole || module.requiredRole === user?.role,
  )
  const today = new Date().toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Columna normal del flex, no un <Drawer>. El papel del Drawer es
          `position: fixed` y MUI le fija el ancho por dentro: plegarlo exigía
          pelear con esa anchura desde fuera y el resultado era una barra que
          ocultaba el texto pero no se encogía. Aquí el ancho es una propiedad
          de esta caja y nada más lo toca.
          `position: sticky` + `height: 100dvh` conservan lo único que aportaba
          el Drawer: que la barra se quede fija mientras el contenido baja. */}
      <Box
        component="aside"
        style={{ width }}
        sx={{
          flexShrink: 0,
          alignSelf: 'flex-start',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: sidebar.bg,
          color: sidebar.text,
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 180ms ease',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', p: 2, justifyContent: collapsed ? 'center' : undefined }}
          >
            <Avatar
              variant="rounded"
              sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 700 }}
            >
              S
            </Avatar>
            {!collapsed && (
              <Stack spacing={0}>
                <Typography variant="subtitle1" noWrap sx={{ lineHeight: 1.2, fontWeight: 700 }}>
                  {t('brand.name')}
                </Typography>
                {user && (
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: sidebar.textMuted,
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                      textTransform: 'uppercase',
                    }}
                  >
                    {user.roleLabel}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>

          <List
            id="app-sidebar"
            component="nav"
            aria-label={t('layout.mainNav')}
            sx={{ px: 1.5 }}
          >
            {visibleModules.map((module) => (
              // Plegada, el icono es lo único que queda: el tooltip es lo que
              // impide tener que adivinar qué es cada uno. Desplegada estorba,
              // así que se desactiva con `disableHoverListener`.
              <Tooltip
                key={module.path}
                title={t(module.label)}
                placement="right"
                disableHoverListener={!collapsed}
                disableFocusListener={!collapsed}
                disableTouchListener={!collapsed}
              >
                <ListItemButton
                  component={NavLink}
                  to={module.path}
                  end={module.path === '/'}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: sidebar.textMuted,
                    justifyContent: collapsed ? 'center' : undefined,
                    px: collapsed ? 1 : undefined,
                    '&:hover': { bgcolor: sidebar.hoverBg, color: sidebar.text },
                    '&.active': {
                      bgcolor: sidebar.activeBg,
                      color: '#ffffff',
                      '&:hover': { bgcolor: sidebar.activeBg },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: 'inherit', minWidth: collapsed ? 0 : 36 }}
                  >
                    <module.icon fontSize="small" />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={t(module.label)}
                      slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Box>

        <Stack
          direction={collapsed ? 'column' : 'row'}
          spacing={1.5}
          sx={{
            alignItems: 'center',
            p: 2,
            borderTop: `1px solid ${sidebar.border}`,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: sidebar.hoverBg,
              color: sidebar.textMuted,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {user?.name.charAt(0)}
          </Avatar>
          {!collapsed && (
            <Stack spacing={0} sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: sidebar.textMuted }}>
                {user?.email}
              </Typography>
            </Stack>
          )}
          <Tooltip
            title={t('action.signOut')}
            placement="right"
            disableHoverListener={!collapsed}
          >
            <IconButton
              onClick={handleLogout}
              aria-label={t('action.signOut')}
              sx={{ color: sidebar.textMuted, '&:hover': { color: sidebar.text } }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            gap: 2,
            py: 1.5,
          }}
        >
          {/* El encabezado de la pantalla vive aquí y en ningún otro sitio: lo
              pone cada página con usePageHeader(). Antes la barra mostraba la
              etiqueta del menú y además cada pantalla abría con su propio
              título, y en seis de las nueve el texto era idéntico —«Pacientes»
              sobre «Pacientes»—. */}
          <IconButton
            onClick={toggleSidebar}
            aria-label={t('layout.toggleNav')}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar"
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {header.title}
            </Typography>
            {header.description && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {header.description}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {today}
            </Typography>
          </Stack>

          <LanguageToggle />
          <IconButton aria-label={t('layout.notifications')}>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
        </Toolbar>

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
