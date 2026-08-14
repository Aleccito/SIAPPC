import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import {
  addAppointment,
  addBed,
  admitPatient,
  dischargeAdmission,
  listAdmissions,
  listAppointments,
  listBeds,
  updateAdmission,
  updateBed,
} from '../api/admissionsApi'
import { admissionTypes, bedStates } from '../types'
import type { AdmissionType, BedState } from '../types'
import { BedCapacityCard } from '../components/BedCapacityCard'
import { listPatients } from '../../patients/api/patientsApi'
import { listUnits, listUsers } from '../../admin/api/usersApi'
import {
  admissionStateColor,
  admissionStateKey,
  admissionTypeKey,
  appointmentStateColor,
  appointmentStateKey,
  bedStateColor,
  bedStateKey,
} from '../../dashboard/presentation'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

// Admisión: camas, ingresos y citas en una sola pantalla con tres pestañas.
//
// Van juntas y no en tres entradas de la barra lateral porque son un solo
// trabajo: se admite a alguien, se le da una cama y se le agenda el control. En
// tres pantallas separadas, cada ingreso obliga a recorrer el menú.
//
// Quién puede escribir lo decide `rol_permiso` en el servidor. Aquí no hay
// comprobación de rol: los botones se ven, y el 403 que devuelva el backend se
// muestra tal cual. Esconder el botón y no revalidar sería lo peligroso.

const emptyBed = { code: '', unitId: '', type: '' }
const emptyAdmission = { patientId: '', bedId: '', type: 'urgencia' as AdmissionType, reason: '' }
const emptyAppointment = {
  patientId: '',
  professionalId: '',
  at: '',
  durationMin: '30',
  reason: '',
}

/**
 * De lo que da un `<input type="datetime-local">` ("2026-08-13T09:00") al ISO
 * con desfase que pide el backend. `new Date` interpreta ese texto en la zona
 * del navegador, que es la que el usuario está viendo en pantalla.
 */
function toIso(local: string): string {
  return new Date(local).toISOString()
}

export function AdmissionsPage() {
  const { t, locale } = useLanguage()
  usePageHeader(t('admissions.title'), t('admissions.subtitle'))
  const queryClient = useQueryClient()
  const [tab, setTab] = useState(0)

  // Catálogos de los formularios. Las unidades las lee cualquiera con sesión;
  // la lista de usuarios exige permiso de `usuarios`, así que un administrativo
  // puede recibir 403 aquí: el selector de profesional se queda vacío y el
  // aviso lo dice, en vez de fallar la pantalla entera.
  const units = useQuery({ queryKey: ['units'], queryFn: listUnits })
  const patients = useQuery({ queryKey: ['patients'], queryFn: () => listPatients() })
  const staff = useQuery({ queryKey: ['users'], queryFn: listUsers, retry: false })

  const beds = useQuery({ queryKey: ['beds'], queryFn: listBeds })
  const admissions = useQuery({
    queryKey: ['admissions'],
    queryFn: () => listAdmissions(),
  })
  const appointments = useQuery({
    queryKey: ['appointments'],
    queryFn: () => listAppointments(),
  })

  const [bedForm, setBedForm] = useState(emptyBed)
  const [bedOpen, setBedOpen] = useState(false)
  const [admissionForm, setAdmissionForm] = useState(emptyAdmission)
  const [admissionOpen, setAdmissionOpen] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment)
  const [appointmentOpen, setAppointmentOpen] = useState(false)

  /** Todo lo que toca una cama invalida también la ocupación del tablero. */
  function refresh(...keys: string[]) {
    for (const key of [...keys, 'dashboard']) {
      queryClient.invalidateQueries({ queryKey: [key] })
    }
  }

  const createBed = useMutation({
    mutationFn: addBed,
    onSuccess: () => {
      setBedForm(emptyBed)
      setBedOpen(false)
      refresh('beds')
    },
  })

  const changeBedState = useMutation({
    mutationFn: ({ id, state }: { id: string; state: BedState }) => updateBed(id, { state }),
    onSuccess: () => refresh('beds'),
  })

  const admit = useMutation({
    mutationFn: admitPatient,
    onSuccess: () => {
      setAdmissionForm(emptyAdmission)
      setAdmissionOpen(false)
      refresh('admissions', 'beds')
    },
  })

  const discharge = useMutation({
    mutationFn: (id: string) => dischargeAdmission(id),
    onSuccess: () => refresh('admissions', 'beds'),
  })

  const cancel = useMutation({
    mutationFn: (id: string) => updateAdmission(id, { state: 'cancelado' }),
    onSuccess: () => refresh('admissions', 'beds'),
  })

  const schedule = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      setAppointmentForm(emptyAppointment)
      setAppointmentOpen(false)
      refresh('appointments')
    },
  })

  function submitBed(event: FormEvent) {
    event.preventDefault()
    createBed.mutate({
      unitId: Number(bedForm.unitId),
      code: bedForm.code.trim(),
      type: bedForm.type.trim() || null,
    })
  }

  function submitAdmission(event: FormEvent) {
    event.preventDefault()
    admit.mutate({
      patientId: Number(admissionForm.patientId),
      bedId: admissionForm.bedId ? Number(admissionForm.bedId) : null,
      type: admissionForm.type,
      reason: admissionForm.reason.trim(),
    })
  }

  function submitAppointment(event: FormEvent) {
    event.preventDefault()
    schedule.mutate({
      patientId: Number(appointmentForm.patientId),
      professionalId: Number(appointmentForm.professionalId),
      at: toIso(appointmentForm.at),
      durationMin: Number(appointmentForm.durationMin),
      reason: appointmentForm.reason.trim(),
    })
  }

  // Solo las camas libres se ofrecen al admitir: el backend rechaza una ocupada
  // con 409, y ofrecerla sería enseñar un error evitable.
  const freeBeds = (beds.data?.items ?? []).filter((bed) => bed.state === 'disponible')

  const loading =
    beds.isPending || admissions.isPending || appointments.isPending || patients.isPending

  return (
    <Stack spacing={3}>
      <Tabs value={tab} onChange={(_, value: number) => setTab(value)}>
        <Tab label={t('admissions.tab.admissions')} />
        <Tab label={t('admissions.tab.beds')} />
        <Tab label={t('admissions.tab.appointments')} />
      </Tabs>

      {(createBed.isError || admit.isError || schedule.isError) && (
        <Alert severity="error">
          {(createBed.error ?? admit.error ?? schedule.error)?.message}
        </Alert>
      )}
      {(discharge.isError || cancel.isError || changeBedState.isError) && (
        <Alert severity="error">
          {(discharge.error ?? cancel.error ?? changeBedState.error)?.message}
        </Alert>
      )}

      {tab === 0 && (
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<LoginOutlinedIcon />}
            onClick={() => setAdmissionOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('admissions.new')}
          </Button>

          <TableContainer component={Paper}>
            <LoadingBar loading={loading} />
            <Table aria-label={t('admissions.tab.admissions')} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('admissions.col.patient')}</TableCell>
                  <TableCell>{t('admissions.col.bed')}</TableCell>
                  <TableCell>{t('admissions.col.type')}</TableCell>
                  <TableCell>{t('admissions.col.admittedAt')}</TableCell>
                  <TableCell>{t('admissions.col.state')}</TableCell>
                  <TableCell align="right">{t('admissions.col.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('admissions.empty')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {admissions.data?.items.map((admission) => (
                  <TableRow key={admission.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {admission.patientName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {admission.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {admission.bedCode ? (
                        `${admission.bedCode} · ${admission.unit ?? ''}`
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {t('admissions.noBed')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{t(admissionTypeKey[admission.type])}</TableCell>
                    <TableCell>{new Date(admission.admittedAt).toLocaleString(locale)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t(admissionStateKey[admission.state])}
                        color={admissionStateColor[admission.state]}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {admission.state === 'activo' && (
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            onClick={() => discharge.mutate(admission.id)}
                            disabled={discharge.isPending}
                          >
                            {t('admissions.discharge')}
                          </Button>
                          <Button
                            size="small"
                            color="warning"
                            onClick={() => cancel.mutate(admission.id)}
                            disabled={cancel.isPending}
                          >
                            {t('admissions.cancel')}
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {tab === 1 && (
        <Stack spacing={2}>
          {/* Primero cuántas camas hay —la pregunta que se hace al montar la
              unidad—, y luego la tabla para tocar una cama concreta. */}
          <BedCapacityCard onSaved={() => refresh('beds', 'bedOccupancy')} />

          <Button
            variant="contained"
            startIcon={<BedOutlinedIcon />}
            onClick={() => setBedOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('beds.new')}
          </Button>

          <TableContainer component={Paper}>
            <LoadingBar loading={loading} />
            <Table aria-label={t('admissions.tab.beds')} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('beds.col.code')}</TableCell>
                  <TableCell>{t('beds.col.unit')}</TableCell>
                  <TableCell>{t('beds.col.type')}</TableCell>
                  <TableCell>{t('beds.col.patient')}</TableCell>
                  <TableCell>{t('beds.col.state')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beds.data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('beds.empty')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {beds.data?.items.map((bed) => (
                  <TableRow key={bed.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{bed.code}</TableCell>
                    <TableCell>{bed.unit}</TableCell>
                    <TableCell>{bed.type ?? '—'}</TableCell>
                    <TableCell>
                      {bed.patientName ?? (
                        <Typography variant="caption" color="text.secondary">
                          {t('beds.free')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {/* Una cama ocupada no cambia de estado desde aquí: la
                          suelta el egreso, y dejarla libre a mano dejaría el
                          ingreso apuntando a una cama de otro. */}
                      {bed.state === 'ocupada' ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={t(bedStateKey[bed.state])}
                          color={bedStateColor[bed.state]}
                        />
                      ) : (
                        <Select
                          size="small"
                          value={bed.state}
                          onChange={(event) =>
                            changeBedState.mutate({
                              id: bed.id,
                              state: event.target.value as BedState,
                            })
                          }
                          sx={{ minWidth: 150 }}
                        >
                          {bedStates
                            .filter((state) => state !== 'ocupada')
                            .map((state) => (
                              <MenuItem key={state} value={state}>
                                {t(bedStateKey[state])}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {tab === 2 && (
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<EventNoteOutlinedIcon />}
            onClick={() => setAppointmentOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('appointments.new')}
          </Button>
          {staff.isError && <Alert severity="info">{t('appointments.staffForbidden')}</Alert>}

          <TableContainer component={Paper}>
            <LoadingBar loading={loading} />
            <Table aria-label={t('admissions.tab.appointments')} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('appointments.col.at')}</TableCell>
                  <TableCell>{t('appointments.col.patient')}</TableCell>
                  <TableCell>{t('appointments.col.professional')}</TableCell>
                  <TableCell>{t('appointments.col.reason')}</TableCell>
                  <TableCell>{t('appointments.col.state')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('appointments.empty')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {appointments.data?.items.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      {new Date(appointment.at).toLocaleString(locale)}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {t('appointments.minutes', { minutes: String(appointment.durationMin) })}
                      </Typography>
                    </TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.professionalName}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t(appointmentStateKey[appointment.state])}
                        color={appointmentStateColor[appointment.state]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {/* --- Alta de ingreso --- */}
      <Dialog open={admissionOpen} onClose={() => setAdmissionOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={submitAdmission}>
          <DialogTitle>{t('admissions.new')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                required
                label={t('admissions.col.patient')}
                value={admissionForm.patientId}
                onChange={(event) =>
                  setAdmissionForm({ ...admissionForm, patientId: event.target.value })
                }
              >
                {(patients.data?.items ?? []).map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name} · {patient.document}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={t('admissions.col.bed')}
                value={admissionForm.bedId}
                onChange={(event) =>
                  setAdmissionForm({ ...admissionForm, bedId: event.target.value })
                }
                helperText={t('admissions.bedOptional')}
              >
                <MenuItem value="">{t('admissions.noBed')}</MenuItem>
                {freeBeds.map((bed) => (
                  <MenuItem key={bed.id} value={bed.id}>
                    {bed.code} · {bed.unit}
                  </MenuItem>
                ))}
              </TextField>

              {/* Sin camas `disponible` el desplegable solo ofrece "sin cama", y
                  eso se lee como si la pantalla estuviera rota. Casi siempre lo
                  que pasa es que las camas están en `limpieza`: el egreso las
                  deja ahí y solo vuelven a estar libres a mano, desde la
                  pestaña Camas. Decirlo aquí evita buscar el fallo donde no
                  está. */}
              {!beds.isPending && freeBeds.length === 0 && (
                <Alert severity="info">
                  {t('admissions.noFreeBeds', { total: String(beds.data?.items.length ?? 0) })}
                </Alert>
              )}

              <TextField
                select
                label={t('admissions.col.type')}
                value={admissionForm.type}
                onChange={(event) =>
                  setAdmissionForm({
                    ...admissionForm,
                    type: event.target.value as AdmissionType,
                  })
                }
              >
                {admissionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(admissionTypeKey[type])}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                label={t('admissions.reason')}
                value={admissionForm.reason}
                onChange={(event) =>
                  setAdmissionForm({ ...admissionForm, reason: event.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdmissionOpen(false)}>{t('action.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={admit.isPending}>
              {t('admissions.admit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --- Alta de cama --- */}
      <Dialog open={bedOpen} onClose={() => setBedOpen(false)} fullWidth maxWidth="xs">
        <form onSubmit={submitBed}>
          <DialogTitle>{t('beds.new')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                required
                label={t('beds.col.code')}
                value={bedForm.code}
                onChange={(event) => setBedForm({ ...bedForm, code: event.target.value })}
              />
              <TextField
                select
                required
                label={t('beds.col.unit')}
                value={bedForm.unitId}
                onChange={(event) => setBedForm({ ...bedForm, unitId: event.target.value })}
              >
                {(units.data ?? []).map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('beds.col.type')}
                value={bedForm.type}
                onChange={(event) => setBedForm({ ...bedForm, type: event.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBedOpen(false)}>{t('action.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={createBed.isPending}>
              {t('beds.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --- Alta de cita --- */}
      <Dialog
        open={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={submitAppointment}>
          <DialogTitle>{t('appointments.new')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                required
                label={t('appointments.col.patient')}
                value={appointmentForm.patientId}
                onChange={(event) =>
                  setAppointmentForm({ ...appointmentForm, patientId: event.target.value })
                }
              >
                {(patients.data?.items ?? []).map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name} · {patient.document}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                label={t('appointments.col.professional')}
                value={appointmentForm.professionalId}
                onChange={(event) =>
                  setAppointmentForm({ ...appointmentForm, professionalId: event.target.value })
                }
              >
                {(staff.data ?? []).map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} · {user.roleLabel}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                type="datetime-local"
                label={t('appointments.col.at')}
                value={appointmentForm.at}
                onChange={(event) =>
                  setAppointmentForm({ ...appointmentForm, at: event.target.value })
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                required
                type="number"
                label={t('appointments.duration')}
                value={appointmentForm.durationMin}
                onChange={(event) =>
                  setAppointmentForm({ ...appointmentForm, durationMin: event.target.value })
                }
                slotProps={{ htmlInput: { min: 5, max: 480, step: 5 } }}
              />

              <TextField
                required
                label={t('appointments.col.reason')}
                value={appointmentForm.reason}
                onChange={(event) =>
                  setAppointmentForm({ ...appointmentForm, reason: event.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAppointmentOpen(false)}>{t('action.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={schedule.isPending}>
              {t('appointments.schedule')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  )
}
