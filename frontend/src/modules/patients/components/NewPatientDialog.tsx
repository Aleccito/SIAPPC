import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { addPatient } from '../api/patientsApi'
import { ageFrom } from '../presentation'
import { bloodTypes, sexes } from '../types'
import type { BloodType, Sex } from '../types'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

// El alta de paciente sale de PatientsPage a su propio archivo desde que la
// pantalla dejó de ser "una tabla y un botón": el formulario ocupaba más
// líneas que todo lo demás junto y no comparte estado con la lista, solo la
// invalida al terminar.
//
// El formulario se registra en urgencias, muchas veces con el paciente delante
// y con prisa. Eso manda sobre su diseño:
//
//   - Se piden CUATRO cosas obligatorias, no ocho. El resto se puede completar
//     después y está marcado como tal.
//   - El botón de registrar no se deshabilita en silencio. Un botón muerto sin
//     decir por qué obliga a repasar el formulario campo por campo buscando
//     cuál falta; aquí se pulsa y el formulario señala lo que le falta.
//   - Los campos se agrupan por lo que responden (quién es / por qué viene /
//     lo demás), en vez de ser una columna de ocho cajas iguales.

const emptyForm = {
  name: '',
  document: '',
  reason: '',
  fechaNacimiento: '',
  sexo: 'M' as Sex,
  // Vacío ≠ desconocido a la fuerza: se manda null y la ficha no los pinta.
  tipoSangre: '' as BloodType | '',
  contactoEmergencia: '',
}

type FormState = typeof emptyForm

const sexKey: Record<Sex, StringKey> = {
  M: 'patients.sex.M',
  F: 'patients.sex.F',
  O: 'patients.sex.O',
}

/** Hoy en formato civil, para que el selector no ofrezca fechas futuras. */
function todayIso(): string {
  const now = new Date()
  const mes = String(now.getMonth() + 1).padStart(2, '0')
  const dia = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${mes}-${dia}`
}

/**
 * Qué le falta al formulario para poder enviarse.
 *
 * Devuelve las claves con problema en vez de un booleano: es lo que permite
 * marcar el campo concreto en vez de dar un "revise los datos" que obliga a
 * buscarlo a ojo.
 */
function problemsOf(form: FormState): Partial<Record<keyof FormState, StringKey>> {
  const problems: Partial<Record<keyof FormState, StringKey>> = {}

  if (!form.name.trim()) problems.name = 'patients.form.required'
  if (!form.document.trim()) problems.document = 'patients.form.required'
  if (!form.reason.trim()) problems.reason = 'patients.form.required'

  if (!form.fechaNacimiento) {
    problems.fechaNacimiento = 'patients.form.required'
  } else if (form.fechaNacimiento > todayIso()) {
    // Un dedo de más en el año ("2205") pasaría la validación del servidor
    // —es una fecha válida— y dejaría al paciente con una edad imposible.
    problems.fechaNacimiento = 'patients.form.futureDate'
  }

  return problems
}

export function NewPatientDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(emptyForm)
  // Los errores no se pintan mientras se escribe, solo después de intentar
  // enviar: señalar en rojo un campo que el usuario todavía no ha tocado es
  // regañarle por no haber terminado.
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      // Las dos listas que el alta deja obsoletas: la de la sala de espera y la
      // de pacientes asignados que alimenta esta pantalla y el tablero.
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'assignedPatients'] })
      cerrarYLimpiar()
    },
  })

  function cerrarYLimpiar() {
    setForm(emptyForm)
    setSubmitted(false)
    mutation.reset()
    onClose()
  }

  // Cerrar a medio escribir pierde lo tecleado, así que el clic fuera del
  // diálogo no cierra: solo el botón de cancelar, que es un gesto deliberado.
  function handleClose(_event: unknown, motivo?: string) {
    if (motivo === 'backdropClick' || mutation.isPending) return
    cerrarYLimpiar()
  }

  const problems = problemsOf(form)
  const incomplete = Object.keys(problems).length > 0

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (incomplete) return

    // Se recorta al enviar y no al teclear: recortar mientras se escribe impide
    // separar nombre y apellido con un espacio.
    mutation.mutate({
      name: form.name.trim(),
      document: form.document.trim(),
      reason: form.reason.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo,
      // Vacío viaja como null: el servidor distingue "no se sabe" de "".
      tipoSangre: form.tipoSangre === '' ? null : form.tipoSangre,
      contactoEmergencia: form.contactoEmergencia.trim() || null,
    })
  }

  /** Texto de ayuda de un campo obligatorio, ya traducido, o el de reserva. */
  function helperFor(field: keyof FormState, fallback?: string): string | undefined {
    const problem = submitted ? problems[field] : undefined
    return problem ? t(problem) : fallback
  }

  const edad = form.fechaNacimiento ? ageFrom(form.fechaNacimiento) : null

  // Un documento repetido es el único fallo que el usuario puede corregir sin
  // ayuda de nadie, así que se nombra en vez de esconderlo tras el error
  // genérico: el servidor responde 409 por la restricción única de `cedula`.
  const duplicado = mutation.error instanceof ApiError && mutation.error.status === 409

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('patients.form.title')}</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {mutation.isError && (
              <Alert severity="error">
                {duplicado ? t('patients.form.duplicate') : t('patients.addError')}
              </Alert>
            )}
            {submitted && incomplete && (
              <Alert severity="warning">{t('patients.form.incomplete')}</Alert>
            )}

            <Typography variant="overline" color="text.secondary">
              {t('patients.form.section.identity')}
            </Typography>

            <TextField
              label={t('patients.form.name')}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={submitted && problems.name !== undefined}
              helperText={helperFor('name')}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label={t('patients.form.document')}
              value={form.document}
              onChange={(event) => setForm({ ...form, document: event.target.value })}
              error={submitted && (problems.document !== undefined || duplicado)}
              helperText={helperFor('document', t('patients.form.documentHelp'))}
              required
              fullWidth
            />

            {/* Fecha y sexo caben en una línea: son cortos y se responden
                juntos. En móvil la rejilla los apila sola. */}
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <TextField
                label={t('patients.form.birthDate')}
                type="date"
                value={form.fechaNacimiento}
                onChange={(event) => setForm({ ...form, fechaNacimiento: event.target.value })}
                // La edad de vuelta es la confirmación de que la fecha tecleada
                // es la que se quería: "1990" y "1900" se parecen mucho a las
                // tres de la mañana, pero "35 años" y "125 años" no.
                helperText={helperFor(
                  'fechaNacimiento',
                  edad !== null ? t('patients.form.age', { age: String(edad) }) : undefined,
                )}
                error={submitted && problems.fechaNacimiento !== undefined}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayIso() } }}
                required
                fullWidth
              />
              <TextField
                label={t('patients.form.sex')}
                value={form.sexo}
                onChange={(event) => setForm({ ...form, sexo: event.target.value as Sex })}
                select
                fullWidth
              >
                {sexes.map((value) => (
                  <MenuItem key={value} value={value}>
                    {t(sexKey[value])}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Divider />
            <Typography variant="overline" color="text.secondary">
              {t('patients.form.section.admission')}
            </Typography>

            <TextField
              label={t('patients.form.reason')}
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              error={submitted && problems.reason !== undefined}
              helperText={helperFor('reason', t('patients.form.reasonHelp'))}
              required
              multiline
              minRows={2}
              fullWidth
            />

            <Divider />
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                {t('patients.form.section.optional')}
              </Typography>
              {/* Estos dos NO son obligatorios: de un paciente inconsciente
                  pueden no saberse al ingresarlo, y exigirlos impediría
                  registrar justo al más grave. Decirlo evita que alguien
                  invente un grupo sanguíneo para poder continuar. */}
              <Typography variant="caption" color="text.secondary">
                {t('patients.form.optionalHint')}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <TextField
                label={t('patients.form.bloodType')}
                value={form.tipoSangre}
                onChange={(event) =>
                  setForm({ ...form, tipoSangre: event.target.value as BloodType | '' })
                }
                select
                fullWidth
              >
                <MenuItem value="">{t('patients.form.unknown')}</MenuItem>
                {bloodTypes.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('patients.form.emergencyContact')}
                value={form.contactoEmergencia}
                onChange={(event) => setForm({ ...form, contactoEmergencia: event.target.value })}
                fullWidth
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cerrarYLimpiar} disabled={mutation.isPending}>
            {t('action.cancel')}
          </Button>
          {/* Solo se deshabilita mientras se envía, para no mandarlo dos veces.
              Con campos sin llenar SÍ se puede pulsar: es la pulsación la que
              revela cuáles faltan. */}
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
            startIcon={
              mutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined
            }
          >
            {t(mutation.isPending ? 'patients.form.submitting' : 'patients.form.submit')}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}
