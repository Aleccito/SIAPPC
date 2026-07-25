import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../modules/auth/useAuth'
import { LanguageToggle } from '../shared/i18n/LanguageToggle'
import { useLanguage } from '../shared/i18n/useLanguage'
import { modules } from '../modules/registry'

export function AppLayout() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const visibleModules = modules.filter(
    (module) => !module.requiredRole || module.requiredRole === user?.role,
  )

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <HubOutlinedIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ mr: 4 }}>
            CHAMBAFINAL
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            {visibleModules.map((module) => (
              <Button
                key={module.path}
                component={NavLink}
                to={module.path}
                startIcon={<module.icon />}
                color="inherit"
                sx={{ '&.active': { bgcolor: 'action.selected' } }}
              >
                {t(module.label)}
              </Button>
            ))}
          </Stack>

          <LanguageToggle color="inherit" />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            {t('action.signOut')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
