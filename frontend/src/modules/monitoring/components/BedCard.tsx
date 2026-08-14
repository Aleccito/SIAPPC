import { Box, Chip, Link, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import AirOutlinedIcon from '@mui/icons-material/Air'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { EcgTrace } from './EcgTrace'
import { agoKey, figure, hexOf, metricsOf, stateHex } from '../presentation'
import { isOccupied } from '../queries'
import { clinicalState, clinicalStateColor, clinicalStateKey } from '../../dashboard/presentation'
import { ageFrom } from '../../patients/presentation'
import { sidebar } from '../../../shared/theme'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { Metric } from '../presentation'
import type { MonitoredBed } from '../types'

const METRIC_ICON: Record<Metric['id'], SvgIconComponent> = {
  hr: FavoriteBorderIcon,
  spo2: MonitorHeartOutlinedIcon,
  resp: AirOutlinedIcon,
  gcs: PsychologyOutlinedIcon,
}

/**
 * Una cifra del panel negro: rótulo con icono y punto de color arriba, número
 * grande abajo.
 *
 * El punto repite en color lo que ya dice el número, y no sobra: a la distancia
 * a la que se mira una central —de pie, desde el pasillo— el punto se ve antes
 * que el dígito, y quien no distingue rojo de ámbar todavía tiene el número.
 */
function MetricCell({ metric }: { metric: Metric }) {
  const { t } = useLanguage()
  const Icon = METRIC_ICON[metric.id]
  const color = metric.value === null ? sidebar.textMuted : hexOf(metric.tone)

  return (
    <Box>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.25 }}>
        <Icon sx={{ fontSize: 14, color }} />
        <Typography variant="caption" sx={{ color: sidebar.textMuted, fontWeight: 600 }}>
          {t(metric.label)}
        </Typography>
        {metric.hint && (
          <Tooltip title={t(metric.hint)}>
            <InfoOutlinedIcon sx={{ fontSize: 12, color: sidebar.textMuted }} />
          </Tooltip>
        )}
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
        {/* Dígitos de ancho fijo: la cifra se refresca cada 5 s y sin esto pasar
            de 99 a 100 mueve la columna entera bajo el ojo. */}
        <Typography
          sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums', color }}
        >
          {figure(metric.value)}
        </Typography>
        <Typography variant="caption" sx={{ color: sidebar.textMuted }}>
          {t(metric.unit)}
        </Typography>
      </Stack>
    </Box>
  )
}

export function BedCard({ bed }: { bed: MonitoredBed }) {
  const { t } = useLanguage()
  const occupied = isOccupied(bed)
  const state = clinicalState(bed.worstSeverity)
  const accent = stateHex[state]
  const age = bed.birthDate ? ageFrom(bed.birthDate) : null
  const ago = agoKey(bed.vitals.at)

  // Cama libre: tarjeta gris y nada más. No lleva panel de cifras porque no hay
  // nadie de quien medirlas, y un panel lleno de rayas invitaría a mirarlo.
  if (!occupied) {
    return (
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', minHeight: 220 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
          <LocalHotelOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {bed.bed}
          </Typography>
          <Chip size="small" color="info" variant="outlined" label={t('central.available')} />
        </Stack>
        <Stack spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {t('central.available')}
          </Typography>
          <Typography variant="body2">{t('central.noPatient')}</Typography>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 3, borderWidth: 2, borderColor: accent }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <LocalHotelOutlinedIcon fontSize="small" sx={{ color: accent }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* El enlace al monitor de la cama solo existe si hay equipo: sin
              `dispositivo.codigo` la ruta /monitoring/:device no lleva a
              ninguna parte, y un enlace muerto es peor que ninguno. */}
          {bed.device ? (
            <Link
              component={RouterLink}
              to={`/monitoring/${bed.device}`}
              underline="hover"
              color="inherit"
              aria-label={`${t('central.openMonitor')} ${bed.bed}`}
            >
              {bed.bed}
            </Link>
          ) : (
            bed.bed
          )}
        </Typography>
        <Chip
          size="small"
          variant="outlined"
          color={clinicalStateColor[state]}
          label={t(clinicalStateKey[state])}
        />
      </Stack>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
        {bed.patientName}
        {age !== null && (
          <Typography component="span" variant="body2" color="text.secondary">
            {' · '}
            {t('central.years', { count: String(age) })}
          </Typography>
        )}
      </Typography>

      <Box sx={{ bgcolor: '#000000', borderRadius: 2, p: 1.5, mt: 1.5 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            // Tres columnas y no cuatro: con cuatro, "36.5" y su unidad se parten
            // en dos líneas en cuanto la tarjeta baja de ~320 px, que es el ancho
            // que tienen en un portátil con tres columnas de tarjetas.
            gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
          }}
        >
          {metricsOf(bed).map((metric) => (
            <MetricCell key={metric.id} metric={metric} />
          ))}
        </Box>
        {/* Trazo ilustrativo, no la señal: ver el comentario de EcgTrace. Se
            colorea con el estado de la cama para que el barrido visual de la
            rejilla funcione sin leer una sola cifra. */}
        <Box sx={{ mt: 1.5, border: `1px solid ${sidebar.border}`, borderRadius: 1 }}>
          <EcgTrace color={accent} height={52} />
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {t(ago.key, ago.params)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {bed.device ?? t('central.noDevice')}
        </Typography>
      </Stack>
    </Paper>
  )
}
