import { Box, Paper, Stack, TextField, Typography } from '@mui/material'
import { K, calcularImc, colorImc } from './exploracionFisica'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  pesoKg: string
  tallaCm: string
  perimetroCm: string
  onChange: (campo: 'pesoKg' | 'tallaCm' | 'perimetroCm', valor: string) => void
}

/**
 * Somatometría de ingreso: peso, talla, perímetro abdominal y el IMC.
 *
 * Los tres primeros se capturan; el IMC no se teclea, se calcula. Dejarlo
 * escribible permitiría guardar un IMC que no cuadra con el peso y la talla de
 * al lado, y en el expediente eso es una contradicción imposible de auditar.
 */
export function SomatometriaCard({ pesoKg, tallaCm, perimetroCm, onChange }: Props) {
  const { t } = useLanguage()
  const imc = calcularImc(pesoKg, tallaCm)

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t(K.somatometria)}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
        }}
      >
        <TextField
          size="small"
          type="number"
          label={t(K.peso)}
          value={pesoKg}
          onChange={(event) => onChange('pesoKg', event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 400, step: 0.1 }, input: { endAdornment: 'kg' } }}
        />
        <TextField
          size="small"
          type="number"
          label={t(K.talla)}
          value={tallaCm}
          onChange={(event) => onChange('tallaCm', event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 250, step: 1 }, input: { endAdornment: 'cm' } }}
        />

        {/* El IMC es una casilla de lectura, no un campo: por eso va como bloque
            y no como TextField deshabilitado, que se leería como capturable. */}
        <Box sx={{ px: 1.5, py: 1, borderRadius: 1, bgcolor: 'action.hover' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t(K.imc)}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
              {imc ? imc.valor.toFixed(1) : '—'}
            </Typography>
            {imc && (
              <Typography variant="caption" sx={{ color: colorImc(imc.clase), fontWeight: 600 }}>
                {t(imc.clase)}
              </Typography>
            )}
          </Stack>
        </Box>

        <TextField
          size="small"
          type="number"
          label={t(K.perimetro)}
          value={perimetroCm}
          onChange={(event) => onChange('perimetroCm', event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 250, step: 1 }, input: { endAdornment: 'cm' } }}
        />
      </Box>
    </Paper>
  )
}
