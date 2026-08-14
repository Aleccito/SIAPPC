import { Alert, Box, Stack } from '@mui/material'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'
import { useAlertStream } from '../useAlertStream'
import { WidgetCard } from '../components/WidgetCard'
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
 * pantallas viven en modules/registry.ts. Esta pantalla solo resuelve el rol y
 * coloca las tarjetas.
 *
 * El tablero NO es reordenable ni personalizable: el orden que sale del
 * catálogo es el que se ve. Antes había botones de subir/bajar con el orden
 * guardado en localStorage, y se quitaron a propósito — un tablero clínico que
 * cambia de sitio según quién lo abrió no se puede describir por teléfono
 * durante un turno.
 */
export function MainPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const role = user?.role
  usePageHeader(
    t('dashboard.welcome', { name: user?.name ?? '' }),
    t((role !== undefined ? subtitleKey[role] : undefined) ?? 'dash.subtitle.generic'),
  )

  const order = dashboardFor(role)

  // Alertas en vivo. El tablero sigue repreguntando cada 15 s por su cuenta:
  // esto es lo que llega ANTES, no lo único que llega.
  const { ultima, descartar } = useAlertStream()

  return (
    <Stack spacing={2}>
      {/* Aviso empujado por el servidor. Va arriba del todo: una alerta crítica
          no se coloca donde toque, se ve. */}
      {ultima && (
        <Alert
          severity={ultima.severity === 'critica' ? 'error' : 'warning'}
          variant="filled"
          onClose={descartar}
        >
          {t('dash.live.alert', {
            patient: ultima.patientName ?? ultima.device,
            detail: ultima.message ?? `${ultima.variable} ${ultima.value} ${ultima.unit}`,
          })}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
          alignItems: 'start',
        }}
      >
        {order.map((id) => {
          const widget = widgets[id]
          // Un identificador que ya no está en el catálogo se ignora en vez de
          // reventar el tablero entero.
          if (!widget) return null

          const { Component, span = 1 } = widget

          return (
            <Box key={id} sx={{ gridColumn: { xs: 'auto', lg: `span ${span}` }, minWidth: 0 }}>
              <WidgetCard title={widget.title} icon={widget.icon}>
                <Component />
              </WidgetCard>
            </Box>
          )
        })}
      </Box>
    </Stack>
  )
}
