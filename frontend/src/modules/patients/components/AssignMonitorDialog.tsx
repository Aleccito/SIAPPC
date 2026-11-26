import { useState } from 'react'
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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { assignMonitor, getPatientMonitor, listFreeMonitors, releaseMonitor } from '../api/patientsApi'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { AssignedPatient } from '../../dashboard/types'
import type { Monitor } from '../types'

// El monitor a pie de cama de un paciente (backend/src/routes/devices.ts).
//
// `dispositivo.paciente_id` decide de quién son las lecturas que ven el
// tablero, la central y el expediente, y hasta ahora solo se llenaba por SQL.
// Mismo diálogo que el de la cama: lo que tiene ahora, la lista de libres y
// "Asignar". Liberar va en el chip del monitor actual, en dos pasos, como quitar
// a alguien del personal a cargo.
//
// El monitor va en la cama: sin cama, el diálogo lo dice y no ofrece la lista
// (el servidor también lo rechaza con 409). El egreso libera el monitor solo.
export function AssignMonitorDialog({
  patient,
  onClose,
}: {
  /** null = diálogo cerrado. */
  patient: AssignedPatient | null
  onClose: () => void
}) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [deviceId, setDeviceId] = useState('')
  const [confirmRelease, setConfirmRelease] = useState(false)

  const abierto = patient !== null
  const current = useQuery({
    queryKey: ['patients', patient?.id, 'monitor'],
    queryFn: () => getPatientMonitor(patient!.id),
    enabled: abierto,
  })
  const free = useQuery({ queryKey: ['monitors', 'free'], queryFn: listFreeMonitors, enabled: abierto })

  // Cambiar el monitor cambia qué lecturas ve cada pantalla del paciente.
  function refrescar() {
    queryClient.invalidateQueries({ queryKey: ['patients', patient?.id, 'monitor'] })
    queryClient.invalidateQueries({ queryKey: ['monitors', 'free'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'assignedPatients'] })
  }

  const assign = useMutation({
    mutationFn: (id: number) => assignMonitor(patient!.id, id),
    onSuccess: () => {
      setDeviceId('')
      refrescar()
    },
  })

  const release = useMutation({
    mutationFn: () => releaseMonitor(patient!.id),
    onSuccess: () => {
      setConfirmRelease(false)
      refrescar()
    },
  })

  function cerrar() {
    setDeviceId('')
    setConfirmRelease(false)
    assign.reset()
    release.reset()
    onClose()
  }

  const label = (m: Monitor) =>
    [m.code, m.model, t(`patients.monitor.state.${m.state}` as StringKey)].filter(Boolean).join(' · ')

  const sinCama = patient !== null && !patient.bed
  const error = assign.error ?? release.error ?? free.error
  const errorText =
    error instanceof ApiError
      ? error.status === 403
        ? t('patients.monitor.forbidden')
        : error.message
      : error
        ? t(free.error ? 'patients.monitor.loadError' : 'patients.monitor.error')
        : null

  const monitor = current.data ?? null
  const libres = free.data ?? []

  return (
    <Dialog open={abierto} onClose={cerrar} fullWidth maxWidth="xs">
      <DialogTitle>{t('patients.monitor.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              {t('patients.monitor.subtitle', { patient: patient.name })}
            </Typography>
          )}

          {errorText && <Alert severity="error">{errorText}</Alert>}

          {monitor ? (
            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                {t('patients.monitor.current')}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  color={confirmRelease ? 'error' : 'default'}
                  label={confirmRelease ? t('patients.monitor.confirmRelease', { code: monitor.code }) : label(monitor)}
                  onDelete={() => (confirmRelease ? release.mutate() : setConfirmRelease(true))}
                  disabled={release.isPending}
                />
              </Stack>
            </Stack>
          ) : (
            !current.isLoading && <Alert severity="info">{t('patients.monitor.none')}</Alert>
          )}

          {sinCama ? (
            <Alert severity="warning">{t('patients.monitor.needsBed')}</Alert>
          ) : !free.isLoading && libres.length === 0 ? (
            <Alert severity="info">{t('patients.monitor.noneFree')}</Alert>
          ) : (
            <TextField
              label={t(monitor ? 'patients.monitor.change' : 'patients.monitor.field')}
              value={deviceId}
              onChange={(event) => setDeviceId(event.target.value)}
              select
              fullWidth
              disabled={free.isLoading}
            >
              {libres.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {label(m)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={cerrar} disabled={assign.isPending}>
          {t('action.close')}
        </Button>
        <Button
          variant="contained"
          disabled={deviceId === '' || sinCama || assign.isPending}
          onClick={() => assign.mutate(Number(deviceId))}
        >
          {t('patients.monitor.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
