import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Collapse,
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
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../modules/auth/useAuth'
import { NotificationsBell } from '../modules/notifications/components/NotificationsBell'
import { BrandLogo } from '../shared/BrandLogo'
import { useLanguage } from '../shared/i18n/useLanguage'
import { sidebar } from '../shared/theme'
import { isNavGroup, modules } from '../modules/registry'
import type { AppModule, NavGroup } from '../modules/registry'
import type { StringKey } from '../shared/i18n/dictionary'
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

// Todas las rutas que aparecen en el menú, cabeceras de sección aparte.
const NAV_PATHS = modules.flatMap((entry) =>
  isNavGroup(entry) ? entry.children.map((child) => child.path) : [entry.path],
)

/** ¿Alguna otra entrada del menú cuelga de esta ruta? */
function hasNavDescendant(path: string): boolean {
  return NAV_PATHS.some((other) => other !== path && other.startsWith(`${path}/`))
}

// Una fila del menú. La usan por igual las entradas de primer nivel y las
// anidadas, para que el estado activo y el hover no se dupliquen en dos sitios
// que luego se separan.
function NavRow({
  module,
  collapsed = false,
  nested = false,
  t,
}: {
  module: AppModule
  collapsed?: boolean
  nested?: boolean
  t: (key: StringKey) => string
}) {
  return (
    // Plegada, el icono es lo único que queda: el tooltip es lo que impide
    // tener que adivinar qué es cada uno. Desplegada estorba, así que se
    // desactiva con `disableHoverListener`.
    <Tooltip
      title={t(module.label)}
      placement="right"
      disableHoverListener={!collapsed}
      disableFocusListener={!collapsed}
      disableTouchListener={!collapsed}
    >
      <ListItemButton
        component={NavLink}
        to={module.path}
        // `end` exige coincidencia exacta. Hace falta cuando otra entrada del
        // menú cuelga de esta ruta: `/reports` es prefijo de
        // `/reports/permissions`, y sin esto "Listado" se marcaba activo a la
        // vez que "Permisos". La raíz lo lleva siempre, o quedaría activa en
        // todas las pantallas.
        //
        // No se pone a ciegas en todas: `/admin/roles` tiene que seguir activo
        // dentro de `/admin/roles/:id/permissions`, que es una ruta de detalle
        // y no una entrada del menú.
        end={module.path === '/' || hasNavDescendant(module.path)}
        sx={{
          borderRadius: 2,
          mb: 0.5,
          color: sidebar.textMuted,
          justifyContent: collapsed ? 'center' : undefined,
          px: collapsed ? 1 : undefined,
          // El hover solo se aplica con ratón: en táctil el navegador lo dispara
          // al tocar y se queda pegado hasta que se toca otra cosa.
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { bgcolor: sidebar.hoverBg, color: sidebar.text },
          },
          '&.active': {
            bgcolor: sidebar.activeBg,
            color: '#ffffff',
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { bgcolor: sidebar.activeBg },
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : nested ? 30 : 36 }}>
          {/* El hijo lleva el icono más pequeño: la sangría sola no basta para
              leer la jerarquía de un vistazo. */}
          <module.icon fontSize={nested ? 'inherit' : 'small'} />
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={t(module.label)}
            slotProps={{
              primary: { sx: { fontSize: nested ? 13 : 14, fontWeight: 600 } },
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  )
}

function AppLayoutInner() {
  const { user, logout } = useAuth()
  const { t, locale } = useLanguage()
  const navigate = useNavigate()
  const { pathname } = useLocation()
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

  // Grupos abiertos o cerrados a mano. Sin entrada aquí, un grupo se muestra
  // abierto si la pantalla actual es uno de sus hijos.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  // Entrar en una pantalla hija borra lo que se hubiera decidido a mano para su
  // grupo, con lo que vuelve a mandar la regla de "abierto si estoy dentro".
  //
  // Sin esto: cierras Reportes, pulsas "Ver historial completo" en Roles —que
  // lleva a Auditoría— y acabas en una pantalla cuyo elemento de menú está
  // escondido, sin nada marcado como activo. Cerrarlo estando dentro sigue
  // funcionando; lo que no persiste es esa decisión hasta la siguiente
  // navegación.
  useEffect(() => {
    setOpenGroups((current) => {
      const stale = Object.keys(current).filter((groupId) => {
        const group = modules.find((entry) => isNavGroup(entry) && entry.id === groupId)
        return (
          group &&
          isNavGroup(group) &&
          group.children.some((child) => pathname.startsWith(child.path))
        )
      })
      if (!stale.length) return current
      const next = { ...current }
      for (const key of stale) delete next[key]
      return next
    })
  }, [pathname])

  function isGroupOpen(group: NavGroup): boolean {
    const manual = openGroups[group.id]
    if (manual !== undefined) return manual
    return group.children.some((child) => pathname.startsWith(child.path))
  }

  function toggleGroup(group: NavGroup) {
    const next = !isGroupOpen(group)
    setOpenGroups((current) => ({ ...current, [group.id]: next }))
  }

  const visibleModules = modules.filter(
    (entry) => !entry.requiredRole || entry.requiredRole === user?.role,
  )
  const today = new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {/* Primer elemento tabulable de la página, e invisible hasta que recibe el
          foco. Sin él, llegar al contenido con el teclado obliga a recorrer las
          quince entradas del menú EN CADA PANTALLA: el menú es idéntico en
          todas, así que se retabula lo mismo una y otra vez.
          Es un enlace de verdad y no un botón: lleva a un sitio de esta página,
          y los lectores de pantalla lo anuncian entre los enlaces de salto. */}
      <Box
        component="a"
        href="#contenido"
        sx={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: (theme) => theme.zIndex.tooltip,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
          // Fuera de pantalla, no `display: none`: lo que está oculto del todo no
          // recibe foco y el enlace no existiría para el teclado.
          transform: 'translateY(-200%)',
          transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
          '&:focus-visible': { transform: 'none' },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        {t('layout.skipToContent')}
      </Box>

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
          // Llegar al final del menú no debe arrastrar la página de detrás: el
          // menú es una columna propia y su desplazamiento se queda en ella.
          overscrollBehavior: 'contain',
          // El menú va pegado al borde izquierdo y llega hasta abajo: en un
          // móvil con muesca o barra de gestos, el botón de cerrar sesión queda
          // debajo del sistema sin esto.
          pl: 'env(safe-area-inset-left)',
          pb: 'env(safe-area-inset-bottom)',
          transition: 'width 180ms cubic-bezier(0.23, 1, 0.32, 1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', p: 2, justifyContent: collapsed ? 'center' : undefined }}
          >
            <BrandLogo size={36} variant="onBlue" />
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
            {visibleModules.map((entry) => {
              if (!isNavGroup(entry)) {
                return <NavRow key={entry.path} module={entry} collapsed={collapsed} t={t} />
              }

              const children = entry.children.filter(
                (child) => !child.requiredRole || child.requiredRole === user?.role,
              )

              // Plegada la barra, los hijos se dibujan como filas sueltas y la
              // cabecera desaparece: no hay sitio para sangrar ni para un
              // desplegable, y una cabecera que solo abre un grupo invisible no
              // haría nada. Así ninguna pantalla queda inalcanzable.
              if (collapsed) {
                return children.map((child) => (
                  <NavRow key={child.path} module={child} collapsed t={t} />
                ))
              }

              const open = isGroupOpen(entry)
              const groupId = `nav-grupo-${entry.id}`

              return (
                <Box key={entry.id}>
                  {/* Toda la fila es el control: no navega, solo abre y cierra.
                      Sin `component={NavLink}` queda como ButtonBase, es decir
                      role="button" y tabIndex 0, que responde a Enter y Espacio.
                      Un enlace estaría mal: no lleva a ninguna parte, y se
                      anunciaría como enlace e invitaría a abrirlo en otra
                      pestaña. */}
                  <ListItemButton
                    onClick={() => toggleGroup(entry)}
                    aria-expanded={open}
                    aria-controls={groupId}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      color: sidebar.textMuted,
                      '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': { bgcolor: sidebar.hoverBg, color: sidebar.text },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                      <entry.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(entry.label)}
                      slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                    />
                    {open ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </ListItemButton>
                  <Collapse in={open} unmountOnExit>
                    <List id={groupId} disablePadding sx={{ pl: 2.5 }}>
                      {children.map((child) => (
                        <NavRow key={child.path} module={child} nested t={t} />
                      ))}
                    </List>
                  </Collapse>
                </Box>
              )
            })}
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
              sx={{
                color: sidebar.textMuted,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { color: sidebar.text },
                },
              }}
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

          <NotificationsBell />
        </Toolbar>

        {/* El landmark principal de la aplicación, y el destino del enlace de
            salto. `scrollMarginTop` deja aire por debajo de la barra superior
            cuando el navegador salta hasta aquí. */}
        <Box
          component="main"
          id="contenido"
          aria-label={t('layout.mainContent')}
          sx={{
            p: 3,
            scrollMarginTop: 16,
            pr: 'calc(24px + env(safe-area-inset-right))',
            pb: 'calc(24px + env(safe-area-inset-bottom))',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
