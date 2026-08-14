import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Breadcrumbs,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import { BedCard } from '../components/BedCard'
import { BedTable } from '../components/BedTable'
import { countByState, unitsOf, useMonitoredBeds } from '../queries'
import { stateHex } from '../presentation'
import { clinicalStateKey } from '../../dashboard/presentation'
import type { ClinicalState } from '../../dashboard/presentation'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Central de monitoreo: todas las camas de una unidad, en rejilla o en lista.
//
// Por qué la rejilla es la vista por defecto: esta pantalla se deja puesta en la
// estación de enfermería y se mira de pie, desde el pasillo. En rejilla el
// estado de cada cama es un borde de color y un trazo, legible sin leer una sola
// cifra; en lista hay que recorrer una columna a la altura de los ojos. La lista
// gana cuando hay que COMPARAR camas —quién tiene la SpO2 más baja— y por eso
// existe, pero esa es la tarea del segundo minuto, no la del primero.
//
// El conmutador NO se recuerda entre visitas: es estado de vista, y la
// disposición de esta aplicación no es personalizable ni persistente.

/** Las tres del eje clínico, de peor a mejor: es el orden en que se leen. */
const LEGEND: ClinicalState[] = ['estable', 'atencion', 'critico']

type ViewMode = 'grid' | 'list'

export function CentralMonitorPage() {
  const { t } = useLanguage()
  const [view, setView] = useState<ViewMode>('grid')
  // Vacío = todas las unidades. La elección inicial la decide la respuesta (ver
  // más abajo): no se escribe "UCI" en el código, porque es el nombre que un
  // hospital puede renombrar o no tener.
  const [unitId, setUnitId] = useState('')

  // La consulta va SIN unidad y el filtro se aplica al pintar. Es a propósito:
  // la lista de unidades que ofrece el selector sale de la propia respuesta, y
  // pidiendo ya filtrado no habría de dónde sacarla. El techo del servidor son
  // 200 camas, así que filtrar aquí no es un problema de volumen.
  const beds = useMonitoredBeds()

  const units = useMemo(() => unitsOf(beds.data ?? []), [beds.data])
  const visible = useMemo(
    () => (beds.data ?? []).filter((bed) => !unitId || bed.unitId === unitId),
    [beds.data, unitId],
  )
  const counts = useMemo(() => countByState(visible), [visible])
  const occupied = counts.critico + counts.atencion + counts.estable
  const unitName = units.find((unit) => unit.id === unitId)?.name ?? t('central.allUnits')

  usePageHeader(`${t('central.title')} — ${unitName}`, t('central.subtitle'))

  return (
    <Stack spacing={2}>
      <Breadcrumbs aria-label={t('central.breadcrumb')}>
        <Typography variant="body2" color="text.secondary">
          {t('brand.name')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('central.breadcrumb')}
        </Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <TextField
          select
          size="small"
          label={t('central.unit')}
          value={unitId}
          onChange={(event) => setUnitId(event.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">{t('central.allUnits')}</MenuItem>
          {units.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          // `next` es null cuando se vuelve a pulsar el botón ya activo. Sin
          // esta guarda, ese clic dejaría la pantalla sin ninguna vista.
          onChange={(_, next: ViewMode | null) => next && setView(next)}
          aria-label={t('central.view')}
        >
          <ToggleButton value="grid" aria-label={t('central.view.grid')}>
            <GridViewOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('central.view.grid')}
          </ToggleButton>
          <ToggleButton value="list" aria-label={t('central.view.list')}>
            <ViewListOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('central.view.list')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ height: 4 }}>{beds.isPending && <LinearProgress />}</Box>

      {/* El 403 de `monitoreo:ver` llega aquí como error de la consulta: la
          pantalla enseña lo que respondió el servidor y no una lista vacía, que
          se confundiría con "no hay camas". */}
      {beds.isError && <Alert severity="error">{t('central.error')}</Alert>}

      {beds.data && (
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { md: 'center' } }}
          >
            <Typography variant="body2">
              {t('central.summary', { count: String(occupied), unit: unitName })}
              {LEGEND.map((state) => (
                <Typography key={state} component="span" variant="body2" color="text.secondary">
                  {` • ${counts[state]} ${t(clinicalStateKey[state])}`}
                </Typography>
              ))}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1.5}>
              {LEGEND.map((state) => (
                <Stack key={state} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stateHex[state] }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t(clinicalStateKey[state])}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}

      {beds.data && visible.length === 0 && (
        <Alert severity="info">{t('central.empty')}</Alert>
      )}

      {visible.length > 0 &&
        (view === 'grid' ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              // Se ajusta al ancho disponible en vez de fijar un número de
              // columnas por punto de ruptura: una central se mira lo mismo en
              // un monitor de pared que en el portátil del pase de visita.
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {visible.map((bed) => (
              <BedCard key={bed.id} bed={bed} />
            ))}
          </Box>
        ) : (
          <BedTable beds={visible} />
        ))}
    </Stack>
  )
}
