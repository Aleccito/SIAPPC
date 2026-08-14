import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import type { Patient } from '../../patients/types'
// La edad se deriva al pintar; la comparte con la lista de pacientes.
import { ageFrom } from '../../patients/presentation'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Cabecera del expediente: la ficha del paciente que encabeza todas las
// pantallas del expediente.
//
// Solo pinta lo que la tabla `paciente` guarda de verdad: nombre, cédula,
// estado, módulo, motivo de consulta, hora de llegada y —desde que
// `GET /patients` los devuelve— fecha de nacimiento, sexo, grupo sanguíneo y
// contacto de emergencia. La edad no se guarda en ninguna parte: se calcula de
// la fecha de nacimiento al pintarla, que es la única forma de que no envejezca
// mal.
//
// Siguen faltando de lo que pide el diseño la foto, la cama y el diagnóstico
// principal: la cama vive en el módulo de admisión y el diagnóstico en el
// expediente, así que no se inventan —las iniciales hacen de foto y los otros
// dos sencillamente no aparecen—.
//
// Grupo sanguíneo y contacto de emergencia son opcionales en la base: cuando
// vienen nulos se omite el dato entero, etiqueta incluida, en vez de dejar un
// guion que se lee como "no tiene".

const STATUS_COLOR = {
  waiting: 'warning',
  inService: 'error',
  discharged: 'success',
} as const

export function PatientRecordHeader({ patient }: { patient: Patient }) {
  const { t } = useLanguage()
  const locale = 'es-MX'
  const age = ageFrom(patient.birthDate)

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' } }}
      >
        <Avatar sx={{ width: 48, height: 48, fontWeight: 700, bgcolor: 'primary.main' }}>
          {patient.name.charAt(0)}
        </Avatar>

        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
          >
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              {patient.name}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              color={STATUS_COLOR[patient.status]}
              label={t(`patientStatus.${patient.status}`)}
            />
            {/* Solo los pacientes registrados cuando el alta pedía módulo lo
                tienen. Sin él no se pinta un chip vacío. */}
            {patient.module && (
              <Chip size="small" variant="outlined" color="primary" label={patient.module} />
            )}
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 0.25 }}
          >
            <span>ID {patient.document}</span>
            {age !== null && (
              <>
                <span>·</span>
                <span>{t('bed.years', { count: String(age) })}</span>
              </>
            )}
            <span>·</span>
            <span>{t(`patients.sex.${patient.sex}`)}</span>
            {patient.bloodType && (
              <>
                <span>·</span>
                <span>
                  {t('bed.field.blood')}: {patient.bloodType}
                </span>
              </>
            )}
            <span>·</span>
            <span>{patient.reason}</span>
            <span>·</span>
            <span>
              {t('antecedentes.admitted')}: {new Date(patient.arrivedAt).toLocaleString(locale)}
            </span>
            {patient.emergencyContact && (
              <>
                <span>·</span>
                <span>
                  {t('bed.field.contact')}: {patient.emergencyContact}
                </span>
              </>
            )}
          </Typography>
        </Box>

        {/* PENDIENTE: sin endpoint de generación de reportes, y la nota SOAP se
            escribe hoy en /expediente; se dejan desactivados en vez de ofrecer
            botones que no llevan a ninguna parte. */}
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DescriptionOutlinedIcon />} disabled>
            {t('antecedentes.generateReport')}
          </Button>
          <Button variant="contained" startIcon={<NoteAddOutlinedIcon />} disabled>
            {t('antecedentes.newSoap')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
