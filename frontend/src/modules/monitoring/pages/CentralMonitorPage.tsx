import { useMemo } from 'react'
import {
  Alert,
  Box,
  Breadcrumbs,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import { BedCard } from '../components/BedCard'
import { BedTable } from '../components/BedTable'
import { countByState, isOccupied, unitsOf, useMonitoredBeds } from '../queries'
import { stateHex } from '../presentation'
import { clinicalStateKey, severityRank } from '../../dashboard/presentation'
import type { ClinicalState } from '../../dashboard/presentation'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { motion } from '../../../shared/theme'
import { useQueryParam } from '../../../shared/useQueryParam'

// Central de monitoreo: todas las camas de una unidad, en rejilla o en lista.
//
// Por qué la rejilla es la vista por defecto: esta pantalla se deja puesta en la
// estación de enfermería y se mira de pie, desde el pasillo. En rejilla el
// estado de cada cama es un borde de color y un trazo, legible sin leer una sola
// cifra; en lista hay que recorrer una columna a la altura de los ojos. La lista
// gana cuando hay que COMPARAR camas —quién tiene la SpO2 más baja— y por eso
// existe, pero esa es la tarea del segundo minuto, no la del primero.
//
// Ni el conmutador ni el filtro se guardan por usuario: la disposición de esta
// aplicación no es personalizable. Sí viajan en la URL, que es otra cosa —no es
// una preferencia guardada, es la dirección de lo que estás viendo ahora mismo,
// y por eso se puede enviar a alguien.

/** Las tres del eje clínico, de peor a mejor: es el orden en que se leen. */
const LEGEND: ClinicalState[] = ['estable', 'atencion', 'critico']

type ViewMode = 'grid' | 'list'

// Las tarjetas no caen todas de golpe: entran en cascada, unos milisegundos una
// detrás de otra. La cascada es corta a propósito —35 ms de separación y 12
// tarjetas de tope— porque su trabajo no es lucirse, es que la rejilla se
// asiente en vez de aparecer de un salto cuando responde el servidor.
//
// Solo corre al montar. Los refrescos cada 5 s reordenan el DOM por clave, no lo
// recrean, así que ninguna tarjeta vuelve a entrar salvo la que de verdad es
// nueva —que es justo cuando la entrada dice algo.
const CARD_ENTER = 12
const cardEnterSx = {
  // El servidor entrega hasta 200 camas y cada tarjeta lleva su panel de cifras
  // y su trazo: sin esto el navegador dibuja las doscientas, incluidas las
  // ciento ochenta que están fuera de la ventana.
  //
  // `content-visibility: auto` se salta el dibujado de lo que no se ve, y
  // `contain-intrinsic-size: auto 320px` le da la altura que debe reservar
  // mientras tanto —320 px es lo que mide una tarjeta ocupada—; el `auto`
  // delante hace que recuerde la altura REAL una vez la ha pintado, así que la
  // barra de desplazamiento no da tirones al subir y bajar.
  //
  // Se elige esto y no virtualizar la lista: la rejilla se ajusta al ancho
  // disponible (`auto-fill`), y un virtualizador necesita saber cuántas
  // columnas hay para calcular filas. Esto no necesita saberlo.
  contentVisibility: 'auto',
  containIntrinsicSize: 'auto 320px',
  opacity: 0,
  animation: `bedCardEnter 180ms ${motion.enter} forwards`,
  '@keyframes bedCardEnter': {
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: 1, transform: 'none' },
  },
  ...Object.fromEntries(
    Array.from({ length: CARD_ENTER }, (_, index) => [
      `&:nth-of-type(${index + 1})`,
      { animationDelay: `${index * 35}ms` },
    ]),
  ),
  // Sin cascada y sin desplazamiento: la tarjeta simplemente está.
  '@media (prefers-reduced-motion: reduce)': { opacity: 1, animation: 'none' },
} as const

export function CentralMonitorPage() {
  const { t } = useLanguage()
  // Unidad y vista viajan en la URL. Esta pantalla se pasa de una persona a
  // otra —"mira la UCI"— y con el filtro en `useState` eso era una instrucción
  // hablada; ahora es un enlace. También sobrevive a recargar, que en una
  // pantalla de pared que lleva días encendida deja de ser un detalle.
  const [viewParam, setView] = useQueryParam('vista', 'grid')
  const view: ViewMode = viewParam === 'list' ? 'list' : 'grid'
  // Vacío = todas las unidades. La elección inicial la decide la respuesta (ver
  // más abajo): no se escribe "UCI" en el código, porque es el nombre que un
  // hospital puede renombrar o no tener.
  const [unitId, setUnitId] = useQueryParam('unidad', '')

  // La consulta va SIN unidad y el filtro se aplica al pintar. Es a propósito:
  // la lista de unidades que ofrece el selector sale de la propia respuesta, y
  // pidiendo ya filtrado no habría de dónde sacarla. El techo del servidor son
  // 200 camas, así que filtrar aquí no es un problema de volumen.
  const beds = useMonitoredBeds()

  const units = useMemo(() => unitsOf(beds.data ?? []), [beds.data])
  const deLaUnidad = useMemo(
    () => (beds.data ?? []).filter((bed) => !unitId || bed.unitId === unitId),
    [beds.data, unitId],
  )

  // Solo camas CON paciente, y las críticas primero.
  //
  // Una cama vacía no se monitorea: no tiene signos, no tiene alertas y ocupa
  // sitio en una pantalla que se mira de pie y de lejos. Cuántas quedan libres
  // sí interesa —es capacidad—, pero eso es una cifra en la barra de resumen,
  // no una tarjeta por cada una.
  //
  // El orden es el de urgencia y no el del número de cama: en una central con
  // veinte camas, la que se está descompensando no puede depender de dónde
  // cayó alfabéticamente. A igual estado, más alertas abiertas primero; y a
  // igualdad de todo, por código de cama, para que la rejilla no baile entre
  // refrescos.
  const visible = useMemo(() => {
    return deLaUnidad
      .filter(isOccupied)
      .sort((a, b) => {
        const gravedad = severityRank(b.worstSeverity) - severityRank(a.worstSeverity)
        if (gravedad !== 0) return gravedad
        if (b.openAlerts !== a.openAlerts) return b.openAlerts - a.openAlerts
        return a.bed.localeCompare(b.bed)
      })
  }, [deLaUnidad])

  const counts = useMemo(() => countByState(deLaUnidad), [deLaUnidad])
  const occupied = counts.critico + counts.atencion + counts.estable
  const libres = deLaUnidad.length - occupied
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
          // La URL la escribe cualquiera: `?vista=cualquier-cosa` no puede dejar
          // los dos botones apagados y la pantalla sin rejilla ni lista.
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

      <LoadingBar loading={beds.isPending} />

      {/* El 403 de `monitoreo:ver` llega aquí como error de la consulta: la
          pantalla enseña lo que respondió el servidor y no una lista vacía, que
          se confundiría con "no hay camas". */}
      {beds.isError && <Alert severity="error">{t('central.error')}</Alert>}

      {beds.data && (
        // La única frase de la pantalla que resume el estado de la unidad, y la
        // que cambia sola cada 5 s cuando una cama pasa a crítica. Como región
        // viva, ese cambio se anuncia; sin ella, quien no ve la pantalla solo se
        // enteraría recorriendo las tarjetas una por una.
        <Paper variant="outlined" sx={{ p: 1.5 }} role="status" aria-live="polite">
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
              {/* Las libres no se pintan como tarjeta, pero su número es
                  capacidad y hace falta de un vistazo. */}
              <Typography component="span" variant="body2" color="text.secondary">
                {` • ${t('central.free', { count: String(libres) })}`}
              </Typography>
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
        // Dos vacíos distintos: la unidad no tiene camas, o las tiene y todas
        // están libres. Decir "no hay camas" cuando hay diez desocupadas manda
        // a buscar el fallo donde no está.
        <Alert severity="info">
          {deLaUnidad.length === 0 ? t('central.empty') : t('central.allFree')}
        </Alert>
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
              <Box key={bed.id} sx={cardEnterSx}>
                <BedCard bed={bed} />
              </Box>
            ))}
          </Box>
        ) : (
          <BedTable beds={visible} />
        ))}
    </Stack>
  )
}
