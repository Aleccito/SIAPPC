import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import AirOutlinedIcon from '@mui/icons-material/Air'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { EcgTrace } from './EcgTrace'
import { agoKey, figure, hexOf, metricsOf, stateHex } from '../presentation'
import { clinicalState, clinicalStateKey } from '../../dashboard/presentation'
import { ageFrom } from '../../patients/presentation'
import { sidebar } from '../../../shared/theme'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { Metric } from '../presentation'
import type { MonitoredBed } from './../types'

const METRIC_ICON: Record<Metric['id'], SvgIconComponent> = {
  hr: FavoriteBorderIcon,
  spo2: MonitorHeartOutlinedIcon,
  resp: AirOutlinedIcon,
  gcs: PsychologyOutlinedIcon,
}

/**
 * Una cifra, del tamaño que pide una tablet en la mano.
 *
 * Es la misma información que la celda de `BedCard`, a otra escala: aquí solo
 * hay una cama en pantalla, así que el número puede ocupar lo que en la rejilla
 * ocupaban cuatro. `clamp` contra el ancho de la ventana y no un tamaño fijo:
 * la misma pantalla se ve en una tablet de 10" en vertical y en una de 13" en
 * horizontal, y una cifra que desborda su celda es peor que una pequeña.
 */
function BigMetric({ metric }: { metric: Metric }) {
  const { t } = useLanguage()
  const Icon = METRIC_ICON[metric.id]
  const color = metric.value === null ? sidebar.textMuted : hexOf(metric.tone)

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
        <Icon sx={{ fontSize: 20, color }} />
        <Typography
          variant="caption"
          noWrap
          sx={{ color: sidebar.textMuted, fontWeight: 700, letterSpacing: '0.06em' }}
        >
          {t(metric.label)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
        {/* Ancho fijo de dígito: la cifra se refresca cada 5 s y sin esto pasar
            de 99 a 100 empuja la columna entera bajo el ojo. */}
        <Typography
          sx={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color,
          }}
        >
          {figure(metric.value)}
        </Typography>
        <Typography sx={{ fontSize: 'clamp(0.8rem, 1.6vw, 1rem)', color: sidebar.textMuted }}>
          {t(metric.unit)}
        </Typography>
      </Stack>
    </Box>
  )
}

/**
 * Una cama ocupando la pantalla entera: es la unidad de la ronda.
 *
 * Panel negro como el monitor de cabecera y como las tarjetas de la central, y
 * por la misma razón: es el fondo sobre el que los tonos de `stateHex` tienen
 * contraste. El tema claro de la aplicación deja el rojo demasiado oscuro para
 * leerlo de reojo.
 *
 * No pinta alergias ni diagnóstico aunque una ficha de cabecera los tendría:
 * `MonitoredBed` no los trae. Se enseña lo que la consulta entrega; añadirlos
 * pediría otra petición por cama, y la ronda cambia de cama cada veinte
 * segundos.
 */
export function BedFocus({ bed }: { bed: MonitoredBed }) {
  const { t } = useLanguage()
  const state = clinicalState(bed.worstSeverity)
  const accent = stateHex[state]
  const age = bed.birthDate ? ageFrom(bed.birthDate) : null
  const ago = agoKey(bed.vitals.at)

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        bgcolor: sidebar.bg,
        color: sidebar.text,
        // El borde grueso del color del estado es lo que se ve antes que nada al
        // levantar la vista de la cama a la tablet.
        border: `3px solid ${accent}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { sm: 'center' }, mb: 2 }}
      >
        <LocalHotelOutlinedIcon sx={{ color: accent, fontSize: 32 }} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, lineHeight: 1.1 }}>
            {bed.bed}
          </Typography>
          <Typography noWrap sx={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)', color: sidebar.text }}>
            {bed.patientName}
            {age !== null && (
              <Typography component="span" sx={{ color: sidebar.textMuted, fontSize: '0.85em' }}>
                {' · '}
                {t('central.years', { count: String(age) })}
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" sx={{ color: sidebar.textMuted }}>
            {bed.unit}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip
            label={t(clinicalStateKey[state])}
            sx={{
              bgcolor: accent,
              color: '#0f172a',
              fontWeight: 700,
              fontSize: 15,
              height: 36,
              px: 0.5,
            }}
          />
          <Chip
            variant="outlined"
            label={
              bed.openAlerts > 0
                ? t('rounds.openAlerts', { count: String(bed.openAlerts) })
                : t('rounds.noAlerts')
            }
            sx={{
              height: 36,
              fontSize: 14,
              fontWeight: 600,
              color: bed.openAlerts > 0 ? accent : sidebar.textMuted,
              borderColor: bed.openAlerts > 0 ? accent : sidebar.border,
            }}
          />
        </Stack>
      </Stack>

      <Box sx={{ bgcolor: '#000000', borderRadius: 3, p: { xs: 1.5, sm: 2.5 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, sm: 3 },
            // Dos columnas en vertical y cuatro en horizontal, sin puntos de
            // ruptura: la tablet se gira en la mano y la rejilla se recoloca con
            // el ancho que haya.
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          }}
        >
          {metricsOf(bed).map((metric) => (
            <BigMetric key={metric.id} metric={metric} />
          ))}
        </Box>

        {/* Barre solo si la última lectura es de este minuto: un trazo quieto
            dice que el equipo dejó de mandar, que es lo que hay que ver antes de
            fiarse de las cifras de arriba. */}
        <Box sx={{ mt: 2, border: `1px solid ${sidebar.border}`, borderRadius: 2 }}>
          <EcgTrace color={accent} height={90} animated={ago.key === 'central.ago.now'} />
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 1.5, justifyContent: 'space-between', color: sidebar.textMuted }}
      >
        <Typography variant="body2">{t(ago.key, ago.params)}</Typography>
        <Typography variant="body2">{bed.device ?? t('central.noDevice')}</Typography>
      </Stack>
    </Paper>
  )
}
