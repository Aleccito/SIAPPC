import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import type { Patient } from '../../patients/types'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Cabecera del expediente: la ficha del paciente que encabeza todas las
// pantallas del expediente.
//
// Solo pinta lo que la tabla `paciente` guarda de verdad: nombre, cédula,
// estado, módulo, motivo de consulta y hora de llegada. El diseño pide además
// foto, cama, edad y diagnóstico principal, y ninguno de esos cuatro sale de la
// API de pacientes hoy —la cama vive en el módulo de admisión y la edad exige
// `fecha_nacimiento`, que `GET /patients` no devuelve—, así que no se inventan:
// las iniciales hacen de foto y los demás sencillamente no aparecen.

const STATUS_COLOR = {
  waiting: 'warning',
  inService: 'error',
  discharged: 'success',
} as const

export function PatientRecordHeader({ patient }: { patient: Patient }) {
  const { t } = useLanguage()
  const locale = 'es-MX'

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
            <Chip size="small" variant="outlined" color="primary" label={patient.module} />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 0.25 }}
          >
            <span>ID {patient.document}</span>
            <span>·</span>
            <span>{patient.reason}</span>
            <span>·</span>
            <span>
              {t('antecedentes.admitted')}: {new Date(patient.arrivedAt).toLocaleString(locale)}
            </span>
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
