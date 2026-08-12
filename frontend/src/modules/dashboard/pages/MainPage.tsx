import { useMemo } from 'react'
import { Box, Button, Stack } from '@mui/material'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'
import { WidgetCard } from '../components/WidgetCard'
import { useDashboardOrder } from '../useDashboardOrder'
import { dashboardFor, widgets } from '../widgets/registry'
import type { StringKey } from '../../../shared/i18n/dictionary'

// Subtítulo por rol: dice de qué va este tablero, que no es el mismo para dos
// personas distintas.
const subtitleKey: Record<string, StringKey> = {
  medico: 'dash.subtitle.medico',
  enfermero: 'dash.subtitle.enfermero',
  administrativo: 'dash.subtitle.administrativo',
  admin: 'dash.subtitle.admin',
}

/**
 * Ruta `/`. No hay un tablero: hay cuatro, y cuál se pinta lo decide el rol de
 * la sesión.
 *
 * La composición no vive aquí sino en widgets/registry.ts, igual que las
 * pantallas viven en modules/registry.ts. Esta pantalla solo resuelve el rol,
 * aplica el orden que el usuario haya guardado y coloca las tarjetas.
 */
export function MainPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const role = user?.role
  usePageHeader(
    t('dashboard.welcome', { name: user?.name ?? '' }),
    t((role !== undefined ? subtitleKey[role] : undefined) ?? 'dash.subtitle.generic'),
  )

  // `defaults` tiene que ser estable entre renders o el orden se recalcularía
  // en cada uno.
  const defaults = useMemo(() => dashboardFor(role), [role])
  const { order, move, reset, customized } = useDashboardOrder(role ?? 'default', defaults)

  return (
    <Stack spacing={2}>
      {customized && (
        <Button
          size="small"
          startIcon={<RestartAltOutlinedIcon />}
          onClick={reset}
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('dash.resetOrder')}
        </Button>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
          alignItems: 'start',
        }}
      >
        {order.map((id, index) => {
          const widget = widgets[id]
          // Un identificador que ya no está en el catálogo se ignora en vez de
          // reventar el tablero entero.
          if (!widget) return null

          const { Component, span = 1 } = widget

          return (
            <Box key={id} sx={{ gridColumn: { xs: 'auto', lg: `span ${span}` }, minWidth: 0 }}>
              <WidgetCard
                title={widget.title}
                icon={widget.icon}
                onMoveUp={index > 0 ? () => move(id, -1) : undefined}
                onMoveDown={index < order.length - 1 ? () => move(id, 1) : undefined}
              >
                <Component />
              </WidgetCard>
            </Box>
          )
        })}
      </Box>
    </Stack>
  )
}
