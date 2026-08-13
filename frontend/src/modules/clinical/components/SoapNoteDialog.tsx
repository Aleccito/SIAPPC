import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getSoapNote } from '../api/soapNoteApi'
import type { SoapNote } from '../types'
import { useAuth } from '../../auth/useAuth'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  open: boolean
  /** La nota ya cargada; si no se tiene, basta con `noteId`. */
  note?: SoapNote
  noteId?: string
  onClose: () => void
  /** Sin handler no se ofrece el botón: el diálogo no edita por su cuenta. */
  onEdit?: (note: SoapNote) => void
  onAddendum?: (note: SoapNote) => void
}

// Las cuatro secciones en el orden en que se leen, con el color de su viñeta.
const SECTIONS = [
  ['subjective', 'soapDetalle.subjetivo', '#2563eb'],
  ['objective', 'soapDetalle.objetivo', '#f59e0b'],
  ['assessment', 'soapDetalle.analisis', '#ef4444'],
  ['plan', 'soapDetalle.plan', '#16a34a'],
] as const

function Meta({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color }}>
        {value}
      </Typography>
    </Box>
  )
}

export function SoapNoteDialog({ open, note, noteId, onClose, onEdit, onAddendum }: Props) {
  const { t } = useLanguage()
  const locale = 'es-MX'
  const { user } = useAuth()

  // Solo se consulta si no vino la nota entera y el diálogo está abierto.
  const id = note?.id ?? noteId
  const query = useQuery({
    queryKey: ['soapNote', id],
    queryFn: () => getSoapNote(id as string),
    enabled: open && !note && Boolean(id),
  })

  const data = note ?? query.data

  // El diseño dice "Completada"; el backend solo conoce borrador y firmada, así
  // que "Completada" es la etiqueta de `firmada` y no un tercer estado.
  const firmada = data?.status === 'firmada'
  // Solo el autor puede editar su borrador: al resto el backend le responde 403.
  const puedeEditar = Boolean(data) && !firmada && data?.authorId === user?.id

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        {t('soapDetalle.titulo')}
        <IconButton
          onClick={onClose}
          aria-label={t('action.close')}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {query.isLoading && (
          <Stack sx={{ alignItems: 'center', py: 4 }}>
            <CircularProgress />
          </Stack>
        )}

        {query.isError && <Alert severity="error">{(query.error as Error).message}</Alert>}

        {data && (
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                bgcolor: 'action.hover',
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Meta
                label={t('soapDetalle.fecha')}
                value={new Date(data.at).toLocaleString(locale)}
              />
              <Meta label={t('soapDetalle.medico')} value={data.authorName} />
              <Meta
                label={t('soapDetalle.estado')}
                value={firmada ? t('soapDetalle.estado.firmada') : t('soapDetalle.estado.borrador')}
                color={firmada ? 'success.main' : 'warning.main'}
              />
              <Meta label={t('soapDetalle.ref')} value={`SOAP-${data.id}`} />
            </Box>

            {data.parentId && (
              <Alert severity="info">{t('soapDetalle.esAdenda')}</Alert>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t('soapDetalle.progreso')}
            </Typography>

            {SECTIONS.map(([key, label, color]) => (
              <Box key={key}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color }}>
                    {t(label)}
                  </Typography>
                </Stack>
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 2, py: 1.5 }}>
                  <Typography
                    variant="body2"
                    color={data[key] ? 'text.primary' : 'text.secondary'}
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {data[key] || t('soapDetalle.sinTexto')}
                  </Typography>
                </Box>
              </Box>
            ))}

            {firmada && data.signedByName && data.signedAt && (
              <>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  {t('soapDetalle.firmadaPor')}: {data.signedByName} ·{' '}
                  {new Date(data.signedAt).toLocaleString(locale)}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('action.close')}</Button>

        {/* Una nota firmada no se edita —el backend responde 409—, se corrige
            con una adenda. Por eso el botón cambia según el estado. */}
        {data && firmada && onAddendum && (
          <Button variant="contained" onClick={() => onAddendum(data)}>
            {t('soapDetalle.adenda')}
          </Button>
        )}
        {data && puedeEditar && onEdit && (
          <Button variant="contained" onClick={() => onEdit(data)}>
            {t('soapDetalle.editar')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
