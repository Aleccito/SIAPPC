import { Box, Paper, TextField, Typography } from '@mui/material'
import { K } from './exploracionFisica'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  glasgow: string
  onChange: (valor: string) => void
}

/**
 * Signos vitales de ingreso.
 *
 * Solo Glasgow. El resto de constantes (frecuencia cardíaca, saturación,
 * tensión) no se captura a mano aquí: llega del monitor por `GET
 * /sensors/readings`, y ofrecer una segunda casilla para lo mismo crearía dos
 * cifras distintas del mismo momento en el expediente.
 */
export function SignosVitalesIngresoCard({ glasgow, onChange }: Props) {
  const { t } = useLanguage()

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t(K.signosVitales)}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <TextField
          size="small"
          type="number"
          label={t(K.glasgow)}
          value={glasgow}
          onChange={(event) => onChange(event.target.value)}
          helperText={t(K.glasgowHelp)}
          // La escala de Glasgow va de 3 a 15: no existe un 0, y el mínimo del
          // control evita que se registre un valor que no es puntuable.
          slotProps={{ htmlInput: { min: 3, max: 15, step: 1 }, input: { endAdornment: '/ 15' } }}
          sx={{ width: 180 }}
        />
      </Box>
    </Paper>
  )
}
