import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import { getPatient, removePatient, updatePatient } from '../api/patientsApi'
import { bloodTypes } from '../types'
import type { BloodType } from '../types'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { AssignedPatient } from '../../dashboard/types'

// Editar la ficha de un paciente ya registrado, y darlo de baja.
//
// Los dos endpoints existían desde el principio (`PATCH` y `DELETE
// /patients/:id`) pero ninguna pantalla los ofrecía: se podía registrar a
// alguien y nunca corregirlo. El caso que lo hace urgente es el contacto de
// emergencia, que en urgencias muchas veces se apunta mal o se conoce después.
//
// Solo se editan los campos que cambian con el tiempo. El nombre, el documento
// y la fecha de nacimiento NO están aquí a propósito: corregir una identidad no
// es lo mismo que actualizar un dato de contacto, y mezclarlos en el mismo
// diálogo invita a hacerlo de pasada.
//
// La baja NO borra. El servidor la resuelve como `activo = false`
// (backend/src/lib/crud.ts), así que la historia clínica, la bitácora y los
// ingresos siguen apuntando a un registro que existe: si el paciente vuelve,
// su información está entera. Las dos operaciones quedan en la bitácora con
// quién y cuándo.

export function EditPatientDialog({
  patient,
  onClose,
}: {
  /** null = diálogo cerrado. */
  patient: AssignedPatient | null
  onClose: () => void
}) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const abierto = patient !== null

  // Confirmación de la baja en dos pasos: es irreversible desde la interfaz
  // —no hay pantalla para reactivar— y va en el mismo botón que se acaba de
  // pulsar, no en otro diálogo encima de este.
  const [confirmando, setConfirmando] = useState(false)

  const [emergencyContact, setEmergencyContact] = useState<string | null>(null)
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [reason, setReason] = useState<string | null>(null)

  const ficha = useQuery({
    queryKey: ['patients', patient?.id],
    queryFn: () => getPatient(patient!.id),
    enabled: abierto,
  })

  // Los campos arrancan en null y toman el valor del servidor la primera vez
  // que se pintan: así una respuesta que llega tarde no pisa lo que el usuario
  // ya escribió.
  const contacto = emergencyContact ?? ficha.data?.emergencyContact ?? ''
  const motivo = reason ?? ficha.data?.reason ?? ''
  const sangre = bloodType || (ficha.data?.bloodType ?? '')

  function refrescar() {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'assignedPatients'] })
  }

  const guardar = useMutation({
    mutationFn: () =>
      updatePatient(patient!.id, {
        // Cadena vacía es "no se conoce", que en la base es NULL y no "".
        contactoEmergencia: contacto.trim() === '' ? null : contacto.trim(),
        tipoSangre: sangre === '' ? null : sangre,
        reason: motivo.trim(),
      }),
    onSuccess: () => {
      refrescar()
      cerrar()
    },
  })

  const darDeBaja = useMutation({
    mutationFn: () => removePatient(patient!.id),
    onSuccess: () => {
      refrescar()
      cerrar()
    },
  })

  function cerrar() {
    setEmergencyContact(null)
    setBloodType('')
    setReason(null)
    setConfirmando(false)
    guardar.reset()
    darDeBaja.reset()
    onClose()
  }

  const error = guardar.error ?? darDeBaja.error
  const trabajando = guardar.isPending || darDeBaja.isPending

  return (
    <Dialog open={abierto} onClose={cerrar} fullWidth maxWidth="sm">
      <DialogTitle>{t('patients.edit.title')}</DialogTitle>
      <DialogContent>
        <LoadingBar loading={ficha.isPending && abierto} sx={{ mb: 2 }} />

        <Stack spacing={2} sx={{ pt: 1 }}>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              {t('patients.edit.subtitle', { patient: patient.name })}
            </Typography>
          )}

          {ficha.isError && <Alert severity="error">{t('patients.edit.loadError')}</Alert>}

          {error && (
            <Alert severity="error">
              {error instanceof ApiError ? error.message : t('patients.edit.error')}
            </Alert>
          )}

          <TextField
            label={t('patients.form.emergencyContact')}
            value={contacto}
            onChange={(event) => setEmergencyContact(event.target.value)}
            fullWidth
            disabled={ficha.isPending}
            helperText={t('patients.edit.contactHelp')}
          />

          <TextField
            select
            label={t('patients.form.bloodType')}
            value={sangre}
            onChange={(event) => setBloodType(event.target.value as BloodType | '')}
            fullWidth
            disabled={ficha.isPending}
          >
            <MenuItem value="">{t('patients.form.unknown')}</MenuItem>
            {bloodTypes.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('patients.form.reason')}
            value={motivo}
            onChange={(event) => setReason(event.target.value)}
            fullWidth
            multiline
            minRows={2}
            disabled={ficha.isPending}
          />

          {confirmando && (
            // Se dice exactamente qué hace la baja. "¿Está seguro?" no informa
            // de nada; que el registro se conserva sí cambia la decisión.
            <Alert severity="warning">{t('patients.edit.deactivateWarning')}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          color="error"
          disabled={trabajando || ficha.isPending}
          onClick={() => (confirmando ? darDeBaja.mutate() : setConfirmando(true))}
        >
          {t(confirmando ? 'patients.edit.deactivateConfirm' : 'patients.edit.deactivate')}
        </Button>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button onClick={cerrar} disabled={trabajando}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => guardar.mutate()}
            disabled={trabajando || ficha.isPending}
          >
            {t('action.save')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
