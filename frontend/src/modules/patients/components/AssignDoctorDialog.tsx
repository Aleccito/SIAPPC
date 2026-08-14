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
import { assignCare, listAssignments, unassignCare } from '../api/patientsApi'
import { listUsers } from '../../admin/api/usersApi'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { AssignedPatient } from '../../dashboard/types'

// Poner a alguien del personal a cargo de un paciente.
//
// `medico_paciente` es lo que decide qué ve cada quien en su pantalla de
// Pacientes y a quién le llegan las notificaciones. Hasta ahora solo se leía:
// la tabla se llenaba por SQL a mano, así que la lista salía vacía para todo
// el mundo.
//
// La tabla no es exclusiva de médicos —su llave es `usuario_id`—, así que el
// desplegable ofrece también enfermería. Se filtran los inactivos: dar de baja
// a alguien y seguir pudiendo asignarle pacientes no tiene sentido.
export function AssignDoctorDialog({
  patient,
  onClose,
}: {
  /** null = diálogo cerrado. */
  patient: AssignedPatient | null
  onClose: () => void
}) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState('')
  // A quién se está a punto de quitar; null = nadie pendiente de confirmar.
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const abierto = patient !== null

  const users = useQuery({ queryKey: ['users'], queryFn: listUsers, enabled: abierto })

  const assignments = useQuery({
    queryKey: ['patients', patient?.id, 'assignments'],
    queryFn: () => listAssignments(patient!.id),
    enabled: abierto,
  })

  // Las dos mutaciones invalidan la lista del tablero: quitar o poner a alguien
  // cambia lo que ese usuario ve en su propia pantalla.
  function refrescar() {
    queryClient.invalidateQueries({ queryKey: ['patients', patient?.id, 'assignments'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'assignedPatients'] })
  }

  const assign = useMutation({
    mutationFn: (id: number) => assignCare(patient!.id, { userId: id }),
    onSuccess: () => {
      setUserId('')
      refrescar()
    },
  })

  const unassign = useMutation({
    mutationFn: (id: number) => unassignCare(patient!.id, id),
    onSuccess: () => {
      setConfirmId(null)
      refrescar()
    },
  })

  function cerrar() {
    setUserId('')
    setConfirmId(null)
    assign.reset()
    unassign.reset()
    onClose()
  }

  const yaACargo = new Set((assignments.data ?? []).map((a) => a.userId))
  // Solo personal clínico y activo, y sin los que ya están a cargo: ofrecerlos
  // otra vez solo lleva al 409 del servidor.
  const candidatos = (users.data ?? []).filter(
    (user) =>
      user.active && (user.role === 'medico' || user.role === 'enfermero') && !yaACargo.has(Number(user.id)),
  )

  const error = assign.error ?? unassign.error

  return (
    <Dialog open={abierto} onClose={cerrar} fullWidth maxWidth="xs">
      <DialogTitle>{t('patients.care.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {patient && (
            <Typography variant="body2" color="text.secondary">
              {t('patients.care.subtitle', { patient: patient.name })}
            </Typography>
          )}

          {error && (
            <Alert severity="error">
              {error instanceof ApiError ? error.message : t('patients.care.error')}
            </Alert>
          )}

          {/* Quién está a cargo ahora. Cada uno se puede quitar desde su chip:
              el diálogo es el único sitio donde se ve esta relación. */}
          {assignments.data && assignments.data.length > 0 ? (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {assignments.data.map((a) => {
                // Quitar a alguien de un paciente decide qué ve en su pantalla y
                // a quién le llegan sus alertas: un solo clic en una aspa
                // pequeña, sin vuelta atrás, es demasiado poco para eso.
                //
                // Confirmación en el propio chip y no en un segundo diálogo: es
                // el mismo patrón de dos pasos que ya usa la baja de un paciente
                // en EditPatientDialog, y abrir un diálogo encima de otro para
                // preguntar "¿seguro?" es peor que la propia aspa.
                const confirming = confirmId === a.userId
                return (
                  <Chip
                    key={a.userId}
                    color={confirming ? 'error' : 'default'}
                    label={
                      confirming
                        ? t('patients.care.confirmRemove', { name: a.name })
                        : `${a.name} · ${a.role}`
                    }
                    onDelete={() =>
                      confirming ? unassign.mutate(a.userId) : setConfirmId(a.userId)
                    }
                    disabled={unassign.isPending}
                  />
                )
              })}
            </Stack>
          ) : (
            !assignments.isLoading && (
              <Alert severity="info">{t('patients.care.none')}</Alert>
            )
          )}

          {!users.isLoading && candidatos.length === 0 ? (
            <Alert severity="info">{t('patients.care.noneFree')}</Alert>
          ) : (
            <TextField
              label={t('patients.care.field')}
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              select
              fullWidth
              disabled={users.isLoading}
            >
              {candidatos.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} · {user.roleLabel}
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
          disabled={userId === '' || assign.isPending}
          onClick={() => assign.mutate(Number(userId))}
        >
          {t('patients.care.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
