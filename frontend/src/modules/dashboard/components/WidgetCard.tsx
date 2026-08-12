import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined'
import type { ReactNode } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

/**
 * Marco de un widget: cabecera, barra de carga y los botones de reordenar.
 *
 * El cuerpo del widget no lo pinta —eso es cosa del componente que registra el
 * catálogo—, así que un widget nuevo no tiene que repetir la cabecera ni saber
 * que el tablero se puede reordenar.
 */
export function WidgetCard({
  title,
  icon: Icon,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: StringKey
  icon: SvgIconComponent
  /** Ausente = ya está en el extremo; el botón se deshabilita, no desaparece. */
  onMoveUp?: () => void
  onMoveDown?: () => void
  children: ReactNode
}) {
  const { t } = useLanguage()
  const reorderable = onMoveUp !== undefined || onMoveDown !== undefined

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 2, pt: 2 }}>
        <Icon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {t(title)}
        </Typography>
        {reorderable && (
          <>
            <Tooltip title={t('dash.moveUp')}>
              <span>
                <IconButton size="small" disabled={!onMoveUp} onClick={onMoveUp}>
                  <ArrowUpwardOutlinedIcon fontSize="inherit" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('dash.moveDown')}>
              <span>
                <IconButton size="small" disabled={!onMoveDown} onClick={onMoveDown}>
                  <ArrowDownwardOutlinedIcon fontSize="inherit" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Stack>

      <Box sx={{ px: 2, pt: 1.5, pb: 2, flexGrow: 1 }}>{children}</Box>
    </Paper>
  )
}
