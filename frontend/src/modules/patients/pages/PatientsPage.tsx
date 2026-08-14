import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import SearchIcon from '@mui/icons-material/Search'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { AssignBedDialog } from '../components/AssignBedDialog'
import { AssignDoctorDialog } from '../components/AssignDoctorDialog'
import { EditPatientDialog } from '../components/EditPatientDialog'
import { NewPatientDialog } from '../components/NewPatientDialog'
import { ageFrom, initialsOf } from '../presentation'
import { KpiCard } from '../../dashboard/components/KpiCard'
import { WidgetEmpty, WidgetError } from '../../dashboard/components/WidgetMessage'
import {
  admissionTypeKey,
  clinicalState,
  clinicalStateColor,
  clinicalStateKey,
  severityColor,
  severityRank,
} from '../../dashboard/presentation'
import { useAssignedPatients, useBedOccupancy, useOpenAlerts } from '../../dashboard/queries'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { ClinicalState } from '../../dashboard/presentation'
import type { AssignedPatient } from '../../dashboard/types'
import type { AdmissionType } from '../../admissions/types'
import type { AlertSeverity } from '../../sensors/types'
import { usePageHeader } from '../../../app/pageHeader'
import { useQueryParam } from '../../../shared/useQueryParam'

// Gestión de Pacientes.
//
// De dónde sale cada cosa, porque el diseño pide más de lo que la base guarda:
//
//   - La LISTA es GET /dashboard/assigned-patients y no GET /patients. El
//     diseño dice "pacientes asignados" y "bajo su cuidado", y ese endpoint ya
//     resuelve el cruce que hace falta (paciente + ingreso activo + cama +
//     unidad + expediente + alertas abiertas + última lectura de cada signo).
//     Duplicarlo en /patients sería escribir por segunda vez la subconsulta
//     correlacionada de últimos signos vitales, con dos sitios donde
//     equivocarse. /patients sigue siendo el CRUD, y es lo que usa el alta.
//   - El ESTADO clínico y su color se DERIVAN de la peor alerta abierta
//     (dashboard/presentation.ts). No hay columna de triage ni de gravedad.
//   - La TEMPERATURA no se pinta. Ver el comentario sobre la columna omitida
//     más abajo: ningún equipo la publica.
//   - La PRESIÓN ARTERIAL tampoco: `lectura.valor` es un escalar y una PA es un
//     par sistólica/diastólica. No cabe en el modelo.
//
// Los filtros y la paginación son estado de vista y viven aquí: la lista ya
// viene acotada a los pacientes de la sesión (tope de 100 en el servidor), así
// que filtrar en el navegador evita una consulta por cada clic. NO hay nada
// personalizable ni nada que se recuerde entre sesiones: la disposición de esta
// pantalla es la misma para todo el mundo.

/** Renglones por página. El diseño enseña cinco y una paginación de dos botones. */
const PAGE_SIZE = 5

/** Rangos del filtro de admisión, en días. `null` es "cualquier fecha". */
const DATE_RANGES = [
  { value: 'any', key: 'patients.filter.anyDate' as StringKey, days: null },
  { value: '1', key: 'patients.filter.last24h' as StringKey, days: 1 },
  { value: '7', key: 'patients.filter.last7d' as StringKey, days: 7 },
  { value: '30', key: 'patients.filter.last30d' as StringKey, days: 30 },
] as const

type DateRange = (typeof DATE_RANGES)[number]['value']

const CLINICAL_STATES = ['critico', 'atencion', 'estable'] as const

// Un icono por tipo de ingreso. Son los TRES que existen en `ingreso.tipo`:
// el diseño enseña cinco etiquetas (Ingreso, Salida, Alta, Urgente, Traslado)
// y las dos que sobran no tienen origen —"Salida" y "Alta" describirían un
// egreso, y esta lista solo trae ingresos con `estado = 'activo'`, así que un
// paciente egresado no llega hasta aquí—. Se rotula lo que hay.
const ADMISSION_ICON: Record<AdmissionType, typeof ArrowOutwardOutlinedIcon> = {
  urgencia: WarningAmberOutlinedIcon,
  programado: EventAvailableOutlinedIcon,
  traslado: ArrowOutwardOutlinedIcon,
}

const ADMISSION_COLOR: Record<AdmissionType, 'error' | 'success' | 'info'> = {
  urgencia: 'error',
  programado: 'success',
  traslado: 'info',
}

/**
 * Color del punto de severidad del panel de alertas.
 *
 * `severityColor` devuelve nombres de paleta de MUI, y `default` —la severidad
 * `baja`— no tiene `.main`: pintarlo con esa plantilla dejaría el punto
 * transparente. Se traduce al gris del texto deshabilitado, que es lo que
 * `default` significa en el resto de la aplicación.
 */
function severityDot(severity: AlertSeverity): string {
  const color = severityColor[severity]
  return color === 'default' ? 'text.disabled' : `${color}.main`
}

/** Peor primero; a igual severidad, el que tiene más alertas abiertas. */
function byGravity(a: AssignedPatient, b: AssignedPatient): number {
  const diff = severityRank(b.worstSeverity) - severityRank(a.worstSeverity)
  return diff !== 0 ? diff : b.openAlerts - a.openAlerts
}

/** Todas las unidades presentes, sin repetir y ordenadas, para el filtro. */
function unitsOf(patients: AssignedPatient[]): string[] {
  return [...new Set(patients.map((p) => p.unit).filter((u): u is string => Boolean(u)))].sort()
}

export function PatientsPage() {
  const { t } = useLanguage()
  usePageHeader(t('patients.title'), t('patients.subtitle'))
  const navigate = useNavigate()

  const patients = useAssignedPatients()
  const alerts = useOpenAlerts()
  const beds = useBedOccupancy()

  // Los cuatro filtros y la página van en la URL. Con `useState` la pantalla no
  // se podía enviar —"los críticos de UCI" era una explicación en vez de un
  // enlace—, Atrás salía de Pacientes en lugar de deshacer el último filtro, y
  // recargar devolvía a la lista completa.
  //
  // Los diálogos NO: cuál está abierto es estado efímero, y una dirección que
  // reabre un formulario a medio rellenar no es lo que nadie espera al pegarla.
  const [unit, setUnit] = useQueryParam('unidad', 'all')
  const [stateParam, setState] = useQueryParam('estado', 'all')
  const [rangeParam, setRange] = useQueryParam('desde', 'any')
  const [term, setTerm] = useQueryParam('q', '')
  const [pageParam, setPageParam] = useQueryParam('pagina', '1')
  const [formOpen, setFormOpen] = useState(false)

  // La URL la puede escribir cualquiera: un valor que no está en la lista se
  // trata como "sin filtrar" en vez de dejar la pantalla vacía sin explicar por
  // qué. La página va 1-based de cara fuera —`?pagina=1` es la primera— y
  // 0-based por dentro, que es lo que necesita `slice`.
  const state = (CLINICAL_STATES as readonly string[]).includes(stateParam)
    ? (stateParam as ClinicalState)
    : 'all'
  const range = (DATE_RANGES.some((r) => r.value === rangeParam)
    ? rangeParam
    : 'any') as DateRange
  const page = Math.max(0, (Number(pageParam) || 1) - 1)
  const setPage = (next: number) => setPageParam(String(next + 1))
  // Paciente al que se le está asignando cama; null = dialogo cerrado.
  const [bedFor, setBedFor] = useState<AssignedPatient | null>(null)
  // Paciente al que se le está asignando personal; null = dialogo cerrado.
  const [careFor, setCareFor] = useState<AssignedPatient | null>(null)
  // Paciente cuya ficha se está editando; null = dialogo cerrado.
  const [editing, setEditing] = useState<AssignedPatient | null>(null)

  // Los memos dependen de `patients.data` y no de una copia con `?? []`: ese
  // literal sería un array nuevo en cada render y los recalcularía siempre.
  const data = patients.data
  const units = useMemo(() => unitsOf(data ?? []), [data])

  const filtered = useMemo(() => {
    const days = DATE_RANGES.find((r) => r.value === range)?.days ?? null
    const since = days === null ? null : Date.now() - days * 24 * 60 * 60 * 1000
    const needle = term.trim().toLowerCase()

    return [...(data ?? [])]
      .filter((p) => {
        if (unit !== 'all' && p.unit !== unit) return false
        if (state !== 'all' && clinicalState(p.worstSeverity) !== state) return false
        // Sin ingreso abierto no hay fecha de admisión que comparar: quien no
        // la tiene queda fuera de cualquier rango acotado, y no dentro por
        // omisión.
        if (since !== null && (!p.admittedAt || new Date(p.admittedAt).getTime() < since)) {
          return false
        }
        if (needle) {
          const record = p.record ? `hc-${p.record}` : ''
          if (
            !p.name.toLowerCase().includes(needle) &&
            !record.includes(needle) &&
            !p.document.toLowerCase().includes(needle)
          ) {
            return false
          }
        }
        return true
      })
      .sort(byGravity)
  }, [data, unit, state, range, term])

  // La página se recorta al total en vez de guardarse corregida: si un filtro
  // deja tres renglones estando en la página 4, se muestra la última que existe
  // sin necesidad de un efecto que persiga al estado.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const shown = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  const criticos = data?.filter((p) => clinicalState(p.worstSeverity) === 'critico').length ?? null

  // Camas: el total de TODAS las unidades del hospital, no solo las del médico.
  // `beds` puede venir en error (403 si el rol no tiene `admisiones:ver`); en
  // ese caso las tarjetas pintan raya, nunca un cero que se leería como "no
  // quedan camas".
  const occupancy = beds.data
  const bedTotal = occupancy?.reduce((sum, u) => sum + u.total, 0) ?? null
  const bedFree = occupancy?.reduce((sum, u) => sum + u.available, 0) ?? null

  // Cambiar un filtro vuelve a la primera página: quedarse en la 4 de una lista
  // que ahora tiene dos deja la pantalla en blanco sin decir por qué.
  //
  // Las dos escrituras caen sobre la misma URL y no se pisan: `useQueryParam`
  // actualiza en forma funcional, así que la segunda parte del estado que dejó
  // la primera.
  function resetPage<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value)
      setPage(0)
    }
  }

  return (
    <Stack spacing={3}>
      {/* Barra de filtros. Los tres son campos de vista: no viajan al servidor.
          El título y el breadcrumb los pinta AppLayout desde usePageHeader; aquí
          solo va la acción, que es de esta pantalla y comparte fila con los
          filtros. */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
        >
          <TextField
            select
            size="small"
            label={t('patients.filter.unit')}
            value={unit}
            onChange={(event) => resetPage(setUnit)(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">{t('patients.filter.allUnits')}</MenuItem>
            {units.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label={t('patients.filter.state')}
            value={state}
            onChange={(event) => resetPage(setState)(event.target.value as ClinicalState | 'all')}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">{t('patients.filter.allStates')}</MenuItem>
            {CLINICAL_STATES.map((value) => (
              <MenuItem key={value} value={value}>
                {t(clinicalStateKey[value])}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label={t('patients.filter.admitted')}
            value={range}
            onChange={(event) => resetPage(setRange)(event.target.value as DateRange)}
            sx={{ minWidth: 200 }}
          >
            {DATE_RANGES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.key)}
              </MenuItem>
            ))}
          </TextField>

          {/* Separador elástico: el `spacing` del Stack pone margin-left a cada
              hijo con un selector descendente que gana al `ml: auto` del sx del
              botón. Un hueco que crece sí empuja. Solo en md+: en columna no
              hay derecha a la que pegarse. */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('patients.add')}
          </Button>
        </Stack>
      </Paper>

      {/* Las cuatro cifras del diseño. Las cuatro salen de una consulta real:
          ninguna lleva un número de relleno, y la que no se puede resolver
          —camas sin permiso de admisiones— sale como raya. */}
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        }}
      >
        <KpiCard
          label="patients.kpi.active"
          value={data?.length ?? null}
          icon={GroupsOutlinedIcon}
          hint={
            bedTotal === null
              ? undefined
              : t('patients.kpi.capacity', { total: String(bedTotal) })
          }
        />
        <KpiCard
          label="patients.kpi.critical"
          value={criticos}
          icon={ReportProblemOutlinedIcon}
          tone={criticos ? 'critical' : 'ok'}
          hint={t('patients.kpi.criticalHint')}
        />
        {/* "Alertas activas" son las abiertas, no las de los últimos 15 minutos
            que dice el diseño: `alerta` no se cierra sola con el tiempo y una
            ventana de 15 min escondería una crítica de hace media hora que
            sigue sin atender. El rótulo dice lo que se está contando. */}
        <KpiCard
          label="patients.kpi.alerts"
          value={alerts.data?.length ?? null}
          icon={NotificationsActiveOutlinedIcon}
          tone={alerts.data?.length ? 'warning' : 'ok'}
          hint={t('patients.kpi.alertsHint')}
        />
        <KpiCard
          label="patients.kpi.beds"
          value={
            bedFree === null || bedTotal === null
              ? null
              : t('patients.kpi.bedsValue', {
                  available: String(bedFree),
                  total: String(bedTotal),
                })
          }
          icon={BedOutlinedIcon}
          hint={
            bedFree === null || !bedTotal
              ? undefined
              : t('patients.kpi.bedsHint', {
                  percent: String(Math.round((bedFree / bedTotal) * 100)),
                })
          }
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
        }}
      >
        <Paper sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="h6">{t('patients.list.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('patients.list.subtitle')}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ mt: 2, mb: 1, justifyContent: 'flex-end', alignItems: { sm: 'center' } }}
          >
            <TextField
              size="small"
              type="search"
              value={term}
              onChange={(event) => resetPage(setTerm)(event.target.value)}
              placeholder={t('patients.search')}
              aria-label={t('patients.search')}
              // Un buscador no es una credencial: sin esto el gestor de
              // contraseñas se ofrece a rellenarlo en cada visita.
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: { xs: '100%', sm: 320 } }}
            />
            {/* El buscador de arriba filtra ESTA lista, que son los pacientes a
                cargo. La búsqueda global —notas, documentos, pacientes de otro
                médico— es otra pantalla, y este es su único acceso: sin este
                enlace, /search queda inalcanzable. */}
            {term.trim().length >= 2 && (
              <Button
                size="small"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term.trim())}`)}
              >
                {t('patients.searchGlobal')}
              </Button>
            )}
          </Stack>

          <LoadingBar loading={patients.isPending} />

          {patients.isError ? (
            <WidgetError message="patients.error" />
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table aria-label={t('patients.list.title')} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('patients.col.patient')}</TableCell>
                    <TableCell>{t('patients.col.status')}</TableCell>
                    <TableCell>{t('patients.col.admission')}</TableCell>
                    <TableCell>{t('patients.col.bed')}</TableCell>
                    {/* Esta tabla NO lleva signos vitales. Ni FC, ni SpO2, ni la
                        TEMP (°C) del diseño —esa además no la publica ningún
                        equipo: `temp` está en el catálogo sembrado, pero
                        iot/src/main.py emite hr, spo2 y ecg,
                        iot/monitor/net/publisher.py añade pr, perfusion y resp,
                        y mqttIngest.ts no tiene umbral para ella—.
                        Las cifras se refrescan en la central y en el monitor de
                        cada cama, que es donde se vigilan; aquí eran una foto
                        que envejecía sin avisar, y una FC de hace veinte
                        minutos leída como si fuera de ahora es peor que no
                        enseñarla. Esta pantalla es gestión: quién está a cargo
                        de quién, en qué cama y desde cuándo. El ESTADO clínico
                        de la columna correspondiente ya resume la gravedad, y
                        el menú de cada renglón lleva al monitor en un clic. */}
                    <TableCell padding="checkbox" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map((patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onAssignBed={setBedFor}
                      onAssignCare={setCareFor}
                      onEdit={setEditing}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {data && data.length === 0 && <WidgetEmpty message="patients.empty" />}
          {data && data.length > 0 && filtered.length === 0 && (
            <WidgetEmpty message="patients.noMatch" />
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('patients.showingOf', {
                shown: String(shown.length),
                total: String(filtered.length),
              })}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                {t('patients.prev')}
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                {t('patients.next')}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <RecentAlertsPanel patients={data} />
      </Box>

      <NewPatientDialog open={formOpen} onClose={() => setFormOpen(false)} />
      <AssignBedDialog patient={bedFor} onClose={() => setBedFor(null)} />
      <AssignDoctorDialog patient={careFor} onClose={() => setCareFor(null)} />
      <EditPatientDialog patient={editing} onClose={() => setEditing(null)} />
    </Stack>
  )
}

function PatientRow({
  patient,
  onAssignBed,
  onAssignCare,
  onEdit,
}: {
  patient: AssignedPatient
  onAssignBed: (patient: AssignedPatient) => void
  onAssignCare: (patient: AssignedPatient) => void
  onEdit: (patient: AssignedPatient) => void
}) {
  const { t } = useLanguage()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const estado = clinicalState(patient.worstSeverity)
  const age = ageFrom(patient.birthDate)
  // El diseño escribe "PT-8821". Ese prefijo no corresponde a ninguna columna:
  // se usa el número de expediente (`expediente_clinico.expediente_id`) con el
  // mismo formato HC-… que ya pinta el tablero, porque tener dos códigos para
  // el mismo paciente según la pantalla es peor que no parecerse al diseño.
  const identity = [
    patient.record ? t('dash.recordNumber', { number: patient.record }) : t('dash.noRecord'),
    age === null ? t('patients.noAge') : t('patients.age', { count: String(age) }),
  ].join(' · ')

  const AdmissionIcon = patient.admissionType ? ADMISSION_ICON[patient.admissionType] : null

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {/* No hay foto de paciente en ninguna tabla: las iniciales la hacen. */}
          <Avatar sx={{ width: 34, height: 34, fontSize: 13 }}>
            {initialsOf(patient.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {patient.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {identity}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          variant="outlined"
          label={t(clinicalStateKey[estado])}
          color={clinicalStateColor[estado]}
        />
      </TableCell>

      <TableCell>
        {patient.admissionType && AdmissionIcon ? (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <AdmissionIcon
              fontSize="small"
              sx={{ color: `${ADMISSION_COLOR[patient.admissionType]}.main` }}
            />
            <Typography variant="body2">
              {t(admissionTypeKey[patient.admissionType])}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption" color="text.disabled">
            {t('patients.noAdmission')}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {patient.bed ? (
          <Typography variant="body2">{t('patients.bedCode', { bed: patient.bed })}</Typography>
        ) : (
          <Typography variant="caption" color="text.disabled">
            {t('dash.noBed')}
          </Typography>
        )}
        {patient.unit && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {patient.unit}
          </Typography>
        )}
      </TableCell>

      <TableCell padding="checkbox">
        <IconButton
          size="small"
          aria-label={t('patients.rowMenu')}
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        {/* El menú solo ofrece lo que existe: colocar al paciente en una cama,
            el monitor de su equipo y su exploración física. No hay "dar de
            alta" ni "trasladar" porque eso es Admisión, y un elemento de menú
            que abre un 403 es peor que no estar. */}
        <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
          <MenuItem
            onClick={() => {
              setAnchor(null)
              onAssignBed(patient)
            }}
          >
            {t(patient.bed ? 'patients.action.changeBed' : 'patients.action.assignBed')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null)
              onAssignCare(patient)
            }}
          >
            {t('patients.action.assignCare')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null)
              onEdit(patient)
            }}
          >
            {t('patients.action.edit')}
          </MenuItem>
          {patient.device && (
            <MenuItem
              component={RouterLink}
              to={`/monitoring/${patient.device}`}
              onClick={() => setAnchor(null)}
            >
              {t('patients.action.monitor')}
            </MenuItem>
          )}
          <MenuItem
            component={RouterLink}
            to={`/expediente/${patient.id}/exploracion-fisica`}
            onClick={() => setAnchor(null)}
          >
            {t('patients.action.record')}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
}

/** Cuánto hace, redondeado hacia abajo. Menos de un minuto no se cuenta. */
function agoLabel(at: string, t: (key: StringKey, values?: Record<string, string>) => string): string {
  const mins = Math.floor((Date.now() - new Date(at).getTime()) / 60000)
  if (mins < 1) return t('patients.alerts.ago.now')
  if (mins < 60) return t('patients.alerts.ago.min', { count: String(mins) })
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('patients.alerts.ago.hours', { count: String(hours) })
  return t('patients.alerts.ago.days', { count: String(Math.floor(hours / 24)) })
}

/**
 * Panel lateral de alertas recientes.
 *
 * El chip "Hoy" del diseño no es decoración: el panel muestra SOLO las alertas
 * abiertas de hoy, que es lo que el chip dice. Las anteriores siguen contando en
 * la tarjeta de "alertas activas" —no desaparecen— pero no son "recientes".
 *
 * La cama sale de cruzar el equipo de la alerta (`alerta → lectura → sensor →
 * dispositivo`) con el paciente asignado que lleva ese equipo. `SensorAlert` no
 * trae la cama y no se le añade: el cruce ya está resuelto en la lista que esta
 * pantalla tiene delante. Si el equipo no es de ninguno de sus pacientes, se
 * enseña el código del equipo, que es un dato real, en vez de una cama supuesta.
 */
function RecentAlertsPanel({ patients }: { patients: AssignedPatient[] | undefined }) {
  const { t } = useLanguage()
  const { data, isError } = useOpenAlerts()

  const bedByDevice = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of patients ?? []) {
      if (p.device && p.bed) map.set(p.device, p.bed)
    }
    return map
  }, [patients])

  const today = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return [...(data ?? [])]
      .filter((alert) => new Date(alert.at).getTime() >= start.getTime())
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 8)
  }, [data])

  return (
    <Paper sx={{ p: 2, minWidth: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t('patients.alerts.title')}
        </Typography>
        <Chip size="small" color="error" variant="outlined" label={t('patients.alerts.today')} />
      </Stack>

      {isError && <WidgetError message="patients.alerts.error" />}
      {!isError && today.length === 0 && <WidgetEmpty message="patients.alerts.empty" />}

      <Stack spacing={1.25} divider={<Divider flexItem />}>
        {today.map((alert) => {
          const bed = bedByDevice.get(alert.device)
          return (
            <Stack key={alert.id} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
              {/* El punto de color es la severidad, la misma tabla que usa el
                  resto de la aplicación. */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  mt: 0.75,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor: severityDot(alert.severity),
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                {/* El mensaje se pinta tal como lo guardó la ingesta. */}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {alert.message ?? alert.type}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Link
                    component={RouterLink}
                    to={`/monitoring/${alert.device}`}
                    variant="caption"
                    sx={{ fontWeight: 600 }}
                  >
                    {bed ? t('patients.bedCode', { bed }) : alert.device}
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    {agoLabel(alert.at, t)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          )
        })}
      </Stack>
    </Paper>
  )
}
