import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { useAuth } from '../modules/auth/useAuth'
import { LanguageToggle } from '../shared/i18n/LanguageToggle'
import { useLanguage } from '../shared/i18n/useLanguage'
import { sidebar } from '../shared/theme'
import { modules } from '../modules/registry'

export function AppLayout() {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const visibleModules = modules.filter(
    (module) => !module.requiredRole || module.requiredRole === user?.role,
  )
  const currentModule = visibleModules.find((module) => module.path === pathname)
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
      <Drawer
        variant="permanent"
        sx={{
          width: sidebar.width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebar.width,
            bgcolor: sidebar.bg,
            color: sidebar.text,
            borderRight: 'none',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', p: 2 }}>
            <Avatar
              variant="rounded"
              sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 700 }}
            >
              S
            </Avatar>
            <Stack spacing={0}>
              <Typography variant="subtitle1" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
                {t('brand.name')}
              </Typography>
              {user && (
                <Typography
                  variant="caption"
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
          </Stack>

          <List component="nav" aria-label={t('layout.mainNav')} sx={{ px: 1.5 }}>
            {visibleModules.map((module) => (
              <ListItemButton
                key={module.path}
                component={NavLink}
                to={module.path}
                end={module.path === '/'}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: sidebar.textMuted,
                  '&:hover': { bgcolor: sidebar.hoverBg, color: sidebar.text },
                  '&.active': {
                    bgcolor: sidebar.activeBg,
                    color: '#ffffff',
                    '&:hover': { bgcolor: sidebar.activeBg },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <module.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={t(module.label)}
                  slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Stack
          direction="row"
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
          <Stack spacing={0} sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: sidebar.textMuted }}>
              {user?.email}
            </Typography>
          </Stack>
          <IconButton
            onClick={handleLogout}
            aria-label={t('action.signOut')}
            sx={{ color: sidebar.textMuted, '&:hover': { color: sidebar.text } }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Drawer>

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
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            {currentModule ? t(currentModule.label) : t('brand.name')}
          </Typography>

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
