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
import {
  admitPatient,
  listBeds,
  updateAdmission,
} from '../../admissions/api/admissionsApi'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { AssignedPatient } from '../../dashboard/types'

// Colocar a un paciente en una cama, desde su propia fila.
//
// Sustituye al "módulo de atención" (KY-001…), que era una lista fija de
// códigos que no decía dónde estaba el paciente. La cama sí lo dice, y además
// existe de verdad: sale de las que el administrador dio de alta en la unidad.
//
// Dos caminos, según el paciente tenga o no un ingreso abierto:
//
//   - Con ingreso: se le cambia la cama (`PATCH /admissions/:id`). El servidor
//     ocupa la nueva y manda la anterior a limpieza, en ese orden.
//   - Sin ingreso: colocarlo en una cama ES admitirlo, así que se crea el
//     ingreso (`POST /admissions`). El motivo se hereda del que se registró al
//     darlo de alta, que es el mismo dato y evita pedirlo dos veces.

export function AssignBedDialog({
  patient,
  onClose,
}: {
  /** null = diálogo cerrado. Se pasa el paciente entero, no su id, porque hace falta su ingreso y su motivo. */
  patient: AssignedPatient | null
  onClose: () => void
}) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [bedId, setBedId] = useState('')

  const beds = useQuery({ queryKey: ['beds'], queryFn: listBeds, enabled: patient !== null })

  const assign = useMutation({
    mutationFn: async (targetBedId: string) => {
      if (patient === null) return
      // Los identificadores viajan como número en la API de admisión, aunque
      // los DTO los entreguen como texto (ver modules/admissions/types.ts).
      if (patient.admissionId) {
        await updateAdmission(patient.admissionId, { bedId: Number(targetBedId) })
        return
      }
      await admitPatient({
        patientId: Number(patient.id),
        bedId: Number(targetBedId),
        type: 'urgencia',
        // El motivo de consulta del registro. Si viniera vacío el servidor lo
        // rechaza —lo exige—, así que se manda un texto neutro y no una
        // invención sobre por qué ingresa.
        reason: patient.reason || t('patients.bed.defaultReason'),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'assignedPatients'] })
      queryClient.invalidateQueries({ queryKey: ['beds'] })
      queryClient.invalidateQueries({ queryKey: ['bedOccupancy'] })
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      cerrar()
    },
  })

  function cerrar() {
    setBedId('')
    assign.reset()
    onClose()
  }

  // Solo las que están libres de verdad: `disponible` descarta las de limpieza
  // y mantenimiento, y `patientId` descarta la que ya tiene a alguien aunque su
  // estado se haya quedado atrás.
  const libres = (beds.data?.items ?? []).filter(
    (bed) => bed.state === 'disponible' && bed.patientId === null,
  )

  return (
    <Dialog open={patient !== null} onClose={cerrar} fullWidth maxWidth="xs">
      <DialogTitle>{t('patients.bed.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              {patient.bed
                ? t('patients.bed.moving', {
                    patient: patient.name,
                    bed: patient.bed,
                  })
                : t('patients.bed.placing', { patient: patient.name })}
            </Typography>
          )}

          {assign.isError && (
            <Alert severity="error">
              {assign.error instanceof ApiError ? assign.error.message : t('patients.bed.error')}
            </Alert>
          )}

          {beds.isError && <Alert severity="error">{t('patients.bed.loadError')}</Alert>}

          {!beds.isLoading && libres.length === 0 ? (
            // Sin camas libres no se ofrece un desplegable vacío: se dice qué
            // pasa y dónde se arregla.
            <Alert severity="info">{t('patients.bed.noneFree')}</Alert>
          ) : (
            <TextField
              label={t('patients.bed.field')}
              value={bedId}
              onChange={(event) => setBedId(event.target.value)}
              select
              fullWidth
              disabled={beds.isLoading}
            >
              {libres.map((bed) => (
                <MenuItem key={bed.id} value={bed.id}>
                  {t('dash.bedAt', { unit: bed.unit, bed: bed.code })}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={cerrar} disabled={assign.isPending}>
          {t('action.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => assign.mutate(bedId)}
          disabled={!bedId || assign.isPending}
        >
          {t('patients.bed.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
