import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import TuneOutlinedIcon from '@mui/icons-material/Tune'
import { levelColor, levelOf, vitals } from '../vitals'
import { sidebar } from '../../../shared/theme'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { SensorReading } from '../../sensors/types'

// Trazo de ECG decorativo: repite un complejo PQRST. No dibuja la señal real —
// `GET /sensors/readings` entrega una muestra por segundo, no la onda completa,
// que es también la razón por la que la ingesta no evalúa alertas sobre `ecg`.
const ECG_PATH =
  'M0 40 H60 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H140 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H240 ' +
  'l10 -6 l8 22 l10 -46 l9 34 l7 -4 H340 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H480'

export function VitalsMonitor({
  bed,
  readings,
  device,
}: {
  bed: string
  readings: SensorReading[]
  device: string
}) {
  const { t } = useLanguage()
  const locale = 'es-MX'

  // La más reciente de cada variable. `readings` llega ordenado por fecha
  // descendente desde el servidor, así que la primera de cada una es la buena.
  const latest = new Map<string, SensorReading>()
  for (const reading of readings) {
    if (!latest.has(reading.variable)) latest.set(reading.variable, reading)
  }

  const newest = readings[0]

  return (
    <Paper
      sx={{
        p: 2.5,
        bgcolor: sidebar.bg,
        color: sidebar.text,
        border: 'none',
        borderRadius: 3,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {t('monitor.title')} — {bed}
        </Typography>
        <Chip
          size="small"
          label={newest ? t('monitor.live') : t('monitor.noSignal')}
          sx={{
            bgcolor: 'transparent',
            color: newest ? '#4ade80' : sidebar.textMuted,
            fontWeight: 600,
          }}
        />
        <Button
          size="small"
          startIcon={<TuneOutlinedIcon />}
          // PENDIENTE: los umbrales viven en código (modules/monitoring/vitals.ts
          // y la ingesta del backend). Configurarlos por paciente pide una tabla
          // que todavía no existe, así que el botón queda desactivado en vez de
          // abrir un formulario que no guardaría nada.
          disabled
          sx={{ color: sidebar.textMuted }}
        >
          {t('monitor.thresholds')}
        </Button>
      </Stack>

      <Box
        sx={{
          bgcolor: '#000000',
          borderRadius: 2,
          p: 1.5,
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: sidebar.textMuted }}>
            ECG II
          </Typography>
          <Typography variant="caption" sx={{ color: '#4ade80' }}>
            {t('monitor.ecgDecorative')}
          </Typography>
        </Stack>
        <Box
          component="svg"
          viewBox="0 0 480 80"
          preserveAspectRatio="none"
          aria-hidden="true"
          sx={{ width: '100%', height: 96, display: 'block' }}
        >
          <path d={ECG_PATH} fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        }}
      >
        {vitals.map((spec) => {
          const reading = latest.get(spec.variable)
          const level = reading ? levelOf(spec, reading.value) : 'normal'

          return (
            <Box
              key={spec.variable}
              sx={{
                border: `1px solid ${sidebar.border}`,
                borderRadius: 2,
                p: 1.75,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: sidebar.textMuted, letterSpacing: '0.06em' }}
              >
                {t(spec.label)}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
                <Typography
                  sx={{
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: reading ? levelColor[level] : sidebar.textMuted,
                  }}
                >
                  {/* Sin sensor no se inventa un número: el hueco dice que falta
                      la medición, que es distinto de estar en rango. */}
                  {reading ? reading.value : '—'}
                </Typography>
                <Typography variant="caption" sx={{ color: sidebar.textMuted }}>
                  {reading ? reading.unit : spec.unit}
                </Typography>
              </Stack>
            </Box>
          )
        })}
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', mt: 2, color: sidebar.textMuted }}
      >
        <Typography variant="caption">
          {newest
            ? `${t('monitor.updated')}: ${new Date(newest.at).toLocaleString(locale)}`
            : t('monitor.noReadings')}
        </Typography>
        <Typography variant="caption">Ref: {device}</Typography>
      </Stack>
    </Paper>
  )
}
