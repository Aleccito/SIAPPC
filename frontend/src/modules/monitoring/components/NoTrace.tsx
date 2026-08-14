import { Box, Typography } from '@mui/material'
import { sidebar } from '../../../shared/theme'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

/**
 * Ocupa el hueco del trazo cuando no hay onda que dibujar.
 *
 * Dos decisiones, y las dos son clínicas y no de diseño:
 *
 * **No se dibuja una línea plana.** Sería lo obvio para rellenar, y en un ECG
 * una línea plana es asistolia: un hallazgo, no una ausencia. La falta de datos
 * se dice con palabras.
 *
 * **Se reserva el mismo alto que el trazo.** Si el hueco se encogiera, la
 * tarjeta cambiaría de tamaño cada vez que un equipo pierde y recupera la
 * señal, y en una rejilla de veinte camas eso las hace bailar todas.
 */
export function NoTrace({ reason, height = 96 }: { reason: StringKey; height?: number }) {
  const { t } = useLanguage()

  return (
    <Box
      sx={{
        height,
        display: 'grid',
        placeItems: 'center',
        px: 1,
        border: `1px dashed ${sidebar.border}`,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="caption"
        align="center"
        sx={{ color: sidebar.textMuted, lineHeight: 1.3 }}
      >
        {t(reason)}
      </Typography>
    </Box>
  )
}
