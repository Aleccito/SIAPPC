import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { BedFocus } from '../components/BedFocus'
import { isOccupied, unitsOf, useMonitoredBeds } from '../queries'
import { stateHex } from '../presentation'
import { clinicalState, severityRank } from '../../dashboard/presentation'
import { LoadingBar } from '../../../shared/LoadingBar'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { useQueryParam } from '../../../shared/useQueryParam'
import { useWakeLock } from '../../../shared/useWakeLock'
import type { MonitoredBed } from '../types'

// Ronda: la pantalla de la tablet. Una cama a la vez, girando sola, saltando a
// la que acaba de abrir una alerta.
//
// Por qué existe además de la Central. La Central se deja puesta en la estación
// de enfermería y se mira DE PIE Y DE LEJOS: por eso es una rejilla de veinte
// tarjetas ordenada por gravedad, legible sin leer una sola cifra. Una tablet se
// lleva EN LA MANO a 40 cm mientras se recorre la sala, y ahí veinte tarjetas de
// 300 px no caben ni hacen falta: delante hay una cama concreta y lo que se
// quiere es su cifra grande.
//
// El orden es el mismo que el de la central —peor primero— para que las dos
// pantallas se lean igual. Consecuencia a tener presente: la lista se reordena
// cada 5 s, así que el giro automático NO recorre el pasillo sino la gravedad, y
// una cama que empeora se adelanta en la vuelta. Es lo que se quiere en
// vigilancia; si algún día hace falta recorrer camas una por una sin repetir,
// el orden tendría que ser el código de cama.

/** Cada cuánto pasa sola a la cama siguiente. */
const ROTATE_SECONDS = 20

/** Lo que se recuerda de una cama entre refrescos, para detectar el cambio. */
type Snapshot = { alerts: number; critical: boolean }

function snapshotOf(bed: MonitoredBed): Snapshot {
  return { alerts: bed.openAlerts, critical: clinicalState(bed.worstSeverity) === 'critico' }
}

export function RoundsPage() {
  const { t } = useLanguage()
  const beds = useMonitoredBeds()

  // La unidad va en la URL, como en la Central: la tablet de una sala se deja
  // abierta en su unidad y recargar no debe devolverla al hospital entero.
  const [unitId, setUnitId] = useQueryParam('unidad', '')

  // Qué cama se está mirando, por ID y NO por índice. La lista se refresca cada
  // 5 s y un alta o un ingreso la corren entera: con un índice, dar de alta a
  // alguien te cambiaba de paciente sin tocar nada.
  const [focusId, setFocusId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  /** Cama a la que se saltó por una alerta; se muestra hasta que se navega. */
  const [jumpedTo, setJumpedTo] = useState<string | null>(null)

  // Mientras esta pantalla esté abierta, la tablet no se apaga sola. Va atado a
  // la vista y no a la aplicación: la ronda es la única que se deja puesta.
  const screenOn = useWakeLock(true)

  const units = useMemo(() => unitsOf(beds.data ?? []), [beds.data])

  // Solo camas CON paciente. Una cama vacía no se monitorea: no tiene signos y
  // en una ronda solo obliga a pulsar "siguiente".
  //
  // El orden es EL MISMO que el de la central —peor primero, a igual estado más
  // alertas abiertas, y el código de cama para desempatar— y no el del pasillo:
  // las dos pantallas enseñan las mismas camas y ordenarlas distinto obligaría a
  // reaprenderse cuál va antes al cambiar de una a la otra.
  //
  // El desempate por código es lo que impide que la rejilla baile entre
  // refrescos: sin él, dos camas igual de graves podrían intercambiarse cada 5 s
  // y el giro automático repetiría una y se saltaría la otra.
  const ronda = useMemo(() => {
    return (beds.data ?? [])
      .filter(isOccupied)
      .filter((bed) => !unitId || bed.unitId === unitId)
      .sort((a, b) => {
        const gravedad = severityRank(b.worstSeverity) - severityRank(a.worstSeverity)
        if (gravedad !== 0) return gravedad
        if (b.openAlerts !== a.openAlerts) return b.openAlerts - a.openAlerts
        return a.bed.localeCompare(b.bed)
      })
  }, [beds.data, unitId])

  // El índice sale del ID. Si la cama que se miraba desapareció —alta, traslado,
  // cambio de unidad—, se cae a la primera en vez de dejar la pantalla vacía.
  const index = Math.max(0, ronda.findIndex((bed) => bed.id === focusId))
  const actual = ronda[index]

  // Lo que se sabía de cada cama en el refresco anterior. En un ref y no en
  // estado: cambiarlo no tiene que repintar nada, solo sirve para comparar.
  const previo = useRef<Map<string, Snapshot> | null>(null)

  // Salto automático a la cama que ACABA de empeorar.
  //
  // Se dispara con el CAMBIO, nunca con el valor: saltar a "toda cama crítica"
  // dejaría la ronda clavada para siempre en la primera crítica, que es la que
  // menos falta hace mirar porque ya se sabe. Lo que interesa es lo que no se
  // sabía hace cinco segundos.
  //
  // La primera respuesta solo siembra el mapa y no salta: al abrir la pantalla
  // todas las camas son "nuevas" y saltaría a una al azar.
  useEffect(() => {
    if (!beds.data) return

    const ahora = new Map(ronda.map((bed) => [bed.id, snapshotOf(bed)]))
    const antes = previo.current
    previo.current = ahora
    if (!antes) return

    const empeoro = ronda.find((bed) => {
      const anterior = antes.get(bed.id)
      if (!anterior) return false
      const actualSnap = snapshotOf(bed)
      // Dos motivos, y basta con uno: abrió una alerta más, o cruzó a crítico.
      return (
        actualSnap.alerts > anterior.alerts ||
        (actualSnap.critical && !anterior.critical)
      )
    })
    if (!empeoro) return

    // Se detiene el giro además de saltar. Si siguiera girando, la cama que
    // motivó el salto se iría de la pantalla a los veinte segundos, que es justo
    // lo contrario de lo que se pide al saltar hasta ella.
    setFocusId(empeoro.id)
    setJumpedTo(empeoro.bed)
    setPaused(true)
  }, [beds.data, ronda])

  // Giro automático. El temporizador se reinicia con cada cambio de cama —está
  // en las dependencias—, así que cada una se ve sus veinte segundos completos,
  // también cuando el cambio lo hizo una persona.
  useEffect(() => {
    if (paused || ronda.length < 2) return
    const id = setInterval(() => {
      setFocusId(ronda[(index + 1) % ronda.length]!.id)
    }, ROTATE_SECONDS * 1000)
    return () => clearInterval(id)
  }, [paused, index, ronda])

  function irA(siguiente: number) {
    if (!ronda.length) return
    // Da la vuelta por los dos extremos: en una ronda, después de la última cama
    // viene la primera.
    const destino = (siguiente + ronda.length) % ronda.length
    setFocusId(ronda[destino]!.id)
    // Navegar a mano cancela el aviso de salto: ya se vio.
    setJumpedTo(null)
  }

  usePageHeader(t('rounds.title'), t('rounds.subtitle'))

  return (
    <Stack spacing={2}>
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
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{t('central.allUnits')}</MenuItem>
          {units.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ flexGrow: 1 }} />

        {screenOn && (
          <Chip
            size="small"
            variant="outlined"
            icon={<LightModeOutlinedIcon />}
            label={t('rounds.screenOn')}
          />
        )}
        <Typography variant="body2" color="text.secondary">
          {paused ? t('rounds.paused') : t('rounds.auto', { seconds: String(ROTATE_SECONDS) })}
        </Typography>
        <Button
          variant="outlined"
          startIcon={paused ? <PlayArrowIcon /> : <PauseIcon />}
          onClick={() => setPaused((value) => !value)}
          // 48 px de alto: es una pantalla que se usa con el pulgar y de pie.
          sx={{ minHeight: 48 }}
        >
          {paused ? t('rounds.resume') : t('rounds.pause')}
        </Button>
      </Stack>

      <LoadingBar loading={beds.isPending} />

      {beds.isError && <Alert severity="error">{t('rounds.error')}</Alert>}

      {beds.data && ronda.length === 0 && <Alert severity="info">{t('rounds.empty')}</Alert>}

      {/* El salto se anuncia y no solo se hace: la pantalla cambia sola de
          paciente, y quien la tenga en la mano necesita saber por qué dejó de
          ver la cama que estaba mirando. Es `assertive` —a diferencia del resto
          de la aplicación— porque interrumpe: acaba de abrirse una alerta. */}
      {jumpedTo && (
        <Alert severity="warning" role="alert" onClose={() => setJumpedTo(null)}>
          {t('rounds.jumped', { bed: jumpedTo })}
        </Alert>
      )}

      {actual && (
        <>
          <BedFocus bed={actual} />

          {/* Región viva discreta: al girar solo, el cambio de cama no lo
              provoca nadie y sin esto un lector de pantalla se queda callado. */}
          <Box aria-live="polite" sx={visuallyHidden}>
            {t('rounds.position', {
              current: String(index + 1),
              total: String(ronda.length),
            })}
            {` — ${actual.bed} — ${actual.patientName ?? ''}`}
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={() => irA(index - 1)}
              aria-label={t('rounds.prev')}
              disabled={ronda.length < 2}
              sx={{ width: 64, height: 64, border: 1, borderColor: 'divider' }}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>

            <Stack sx={{ flexGrow: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('rounds.position', {
                  current: String(index + 1),
                  total: String(ronda.length),
                })}
              </Typography>
              {/* Tira de camas: además de decir por dónde va la ronda, deja
                  saltar a una concreta sin recorrer el resto. Cada punto lleva
                  el color de su estado, así que de un vistazo se ve si queda
                  alguna en rojo por delante. */}
              <Stack
                direction="row"
                spacing={0.75}
                component="ul"
                aria-label={t('rounds.bedList')}
                sx={{ listStyle: 'none', m: 0, p: 0, mt: 0.5, flexWrap: 'wrap', rowGap: 0.75 }}
              >
                {ronda.map((bed, posicion) => (
                  <Box component="li" key={bed.id} sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => irA(posicion)}
                      aria-label={t('rounds.goToBed', { bed: bed.bed })}
                      aria-current={posicion === index ? 'true' : undefined}
                      // 44x44 de zona de toque aunque el punto mida 12: por
                      // debajo de eso, con la tablet en la mano se falla.
                      sx={{ width: 44, height: 44, p: 0 }}
                    >
                      <Box
                        sx={{
                          width: posicion === index ? 18 : 12,
                          height: posicion === index ? 18 : 12,
                          borderRadius: '50%',
                          bgcolor: stateHex[clinicalState(bed.worstSeverity)],
                          outline: posicion === index ? '2px solid' : 'none',
                          outlineColor: 'text.primary',
                          outlineOffset: 2,
                        }}
                      />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Stack>

            <IconButton
              onClick={() => irA(index + 1)}
              aria-label={t('rounds.next')}
              disabled={ronda.length < 2}
              sx={{ width: 64, height: 64, border: 1, borderColor: 'divider' }}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </Stack>

          {/* El monitor completo de la cama, para cuando la cifra grande no
              basta. Solo si hay equipo: sin `device` la ruta no lleva a ningún
              sitio. */}
          {actual.device && (
            <Button
              component={RouterLink}
              to={`/monitoring/${actual.device}`}
              startIcon={<OpenInFullIcon />}
              variant="outlined"
              sx={{ alignSelf: 'flex-start', minHeight: 48 }}
            >
              {t('rounds.openMonitor')}
            </Button>
          )}
        </>
      )}
    </Stack>
  )
}
