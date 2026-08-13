import {
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import {
  K,
  REGIONES,
  REGION_KEY,
  TECNICAS,
  TECNICA_KEY,
} from './exploracionFisica'
import type { Hallazgo, Region, RegionHallazgos, Tecnica } from './exploracionFisica'
import { useLanguage } from '../../../shared/i18n/useLanguage'

type Props = {
  activa: Region
  onSelect: (region: Region) => void
  hallazgos: Record<Region, RegionHallazgos>
  onChange: (region: Region, tecnica: Tecnica, hallazgo: Hallazgo) => void
}

/** Cuenta de técnicas ya calificadas: sirve de avance visible en la lista. */
function exploradas(region: RegionHallazgos): number {
  return TECNICAS.filter((tecnica) => region[tecnica].estado !== '').length
}

/** Una columna: la técnica, su calificación normal/anormal y el hallazgo. */
function ColumnaTecnica({
  tecnica,
  hallazgo,
  onChange,
}: {
  tecnica: Tecnica
  hallazgo: Hallazgo
  onChange: (hallazgo: Hallazgo) => void
}) {
  const { t } = useLanguage()

  return (
    <Stack spacing={1}>
      <Typography
        variant="overline"
        sx={{ lineHeight: 1.4, color: 'text.secondary', fontWeight: 700 }}
      >
        {t(TECNICA_KEY[tecnica])}
      </Typography>

      {/* Exclusivo y deseleccionable: si el explorador se equivoca de botón,
          puede volver a «sin explorar» en vez de quedarse con una calificación
          que no hizo. */}
      <ToggleButtonGroup
        exclusive
        size="small"
        value={hallazgo.estado === '' ? null : hallazgo.estado}
        onChange={(_, valor: 'normal' | 'anormal' | null) =>
          onChange({ ...hallazgo, estado: valor ?? '' })
        }
      >
        <ToggleButton value="normal" color="success" sx={{ flex: 1, py: 0.25 }}>
          {t(K.hallazgoNormal)}
        </ToggleButton>
        <ToggleButton value="anormal" color="error" sx={{ flex: 1, py: 0.25 }}>
          {t(K.hallazgoAnormal)}
        </ToggleButton>
      </ToggleButtonGroup>

      <TextField
        multiline
        minRows={5}
        size="small"
        value={hallazgo.texto}
        placeholder={t(K.hallazgoPlaceholder)}
        onChange={(event) => onChange({ ...hallazgo, texto: event.target.value })}
      />
    </Stack>
  )
}

/**
 * Regiones a la izquierda, detalle de la activa a la derecha.
 *
 * Una sola región visible a la vez y no las seis desplegadas: son 24 campos de
 * texto en total, y todos juntos convierten la pantalla en un formulario
 * interminable donde se pierde en cuál se estaba escribiendo.
 */
export function ExploracionRegiones({ activa, onSelect, hallazgos, onChange }: Props) {
  const { t } = useLanguage()

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
        alignItems: 'start',
      }}
    >
      <Paper sx={{ p: 1 }}>
        <List disablePadding>
          {REGIONES.map((region) => {
            const hechas = exploradas(hallazgos[region])
            return (
              <ListItemButton
                key={region}
                selected={region === activa}
                onClick={() => onSelect(region)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText
                  primary={t(REGION_KEY[region])}
                  slotProps={{
                    primary: {
                      variant: 'body2',
                      fontWeight: region === activa ? 700 : 400,
                      color: region === activa ? 'primary.main' : 'text.primary',
                    },
                  }}
                />
                {hechas > 0 && (
                  <Chip size="small" variant="outlined" label={`${hechas}/${TECNICAS.length}`} />
                )}
              </ListItemButton>
            )
          })}
        </List>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 2 }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t(K.detalle, { region: t(REGION_KEY[activa]) })}
          </Typography>
          <Chip size="small" color="primary" variant="outlined" label={t(K.regionActiva)} />
        </Stack>

        {/* Cuatro columnas en pantalla ancha, dos en tableta y una en el móvil:
            los hallazgos son párrafos y a una columna estrecha no se leen. */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
          }}
        >
          {TECNICAS.map((tecnica) => (
            <ColumnaTecnica
              key={tecnica}
              tecnica={tecnica}
              hallazgo={hallazgos[activa][tecnica]}
              onChange={(hallazgo) => onChange(activa, tecnica, hallazgo)}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
