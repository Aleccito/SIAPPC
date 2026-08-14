import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

/**
 * Marco de un widget: cabecera y cuerpo.
 *
 * El cuerpo del widget no lo pinta —eso es cosa del componente que registra el
 * catálogo—, así que un widget nuevo no tiene que repetir la cabecera.
 *
 * El tablero es fijo: su composición y su orden los decide el rol en
 * widgets/registry.ts, y no hay forma de reordenarlo desde la pantalla. Todos
 * los usuarios de un mismo rol ven lo mismo en el mismo sitio, que es lo que
 * hace que un turno pueda señalar "la tarjeta de arriba" y se entienda.
 */
export function WidgetCard({
  title,
  icon: Icon,
  children,
}: {
  title: StringKey
  icon: SvgIconComponent
  children: ReactNode
}) {
  const { t } = useLanguage()

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 2, pt: 2 }}>
        <Icon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {t(title)}
        </Typography>
      </Stack>

      <Box sx={{ px: 2, pt: 1.5, pb: 2, flexGrow: 1 }}>{children}</Box>
    </Paper>
  )
}
