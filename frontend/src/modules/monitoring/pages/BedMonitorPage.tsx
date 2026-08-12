import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import { getBedPatient, getLatestSoapNote } from '../api/bedApi'
import { VitalsMonitor } from '../components/VitalsMonitor'
import { listReadings } from '../../sensors/api/sensorsApi'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const TABS: { value: string; label: StringKey }[] = [
  { value: 'summary', label: 'bed.tab.summary' },
  { value: 'history', label: 'bed.tab.history' },
  { value: 'soap', label: 'bed.tab.soap' },
  { value: 'monitoring', label: 'bed.tab.monitoring' },
  { value: 'documents', label: 'bed.tab.documents' },
]

const STATUS_COLOR = { critico: 'error', observacion: 'warning', estable: 'success' } as const

/**
 * Fecha sin hora (`YYYY-MM-DD`) en la zona del usuario.
 *
 * `new Date('2025-10-15')` se interpreta como medianoche UTC, y al oeste de
 * Greenwich eso retrocede un día: el ingreso del 15 de octubre salía como 14.
 * Partiendo la cadena, la fecha es la que dice el dato.
 */
function formatDateOnly(value: string, locale: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year!, month! - 1, day!).toLocaleDateString(locale)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {children}
      </Typography>
    </Stack>
  )
}

export function BedMonitorPage() {
  const { t } = useLanguage()
  const locale = 'es-MX'
  const { device = '' } = useParams()
  const [tab, setTab] = useState('summary')

  const patient = useQuery({
    queryKey: ['bedPatient', device],
    queryFn: () => getBedPatient(device),
  })
  const note = useQuery({
    queryKey: ['bedSoap', device],
    queryFn: () => getLatestSoapNote(device),
  })
  // Lecturas reales del dispositivo, por la misma ruta que alimenta Sensores.
  // `refetchInterval`: el monitor tiene que envejecer solo; la Pi publica cada
  // segundo y una pantalla de cama que hay que recargar a mano no sirve.
  const readings = useQuery({
    queryKey: ['readings', { device, limit: 60 }],
    queryFn: () => listReadings({ device, limit: 60 }),
    refetchInterval: 5000,
  })

  const bed = patient.data?.bed ?? device
  usePageHeader(
    patient.data ? `${t('bed.title')} ${bed} — ${patient.data.name}` : `${t('bed.title')} ${bed}`,
    t('bed.subtitle'),
  )

  return (
    <Stack spacing={3}>
      {/* Volver a la izquierda y las acciones a la derecha, en la misma línea.
          Antes el botón de volver ocupaba una fila entera para él solo y las
          acciones colgaban del extremo de la ficha, con un vacío enorme en
          medio; ahora esa fila lleva las tres cosas y la ficha queda compacta.
          PENDIENTE: las dos acciones no tienen backend (no hay endpoint de
          notas SOAP ni de generación de reportes), por eso van desactivadas. */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Button component={RouterLink} to="/sensors" startIcon={<ArrowBackIcon />}>
          {t('bed.back')}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" startIcon={<DescriptionOutlinedIcon />} disabled>
          {t('bed.generateReport')}
        </Button>
        <Button variant="contained" startIcon={<NoteAddOutlinedIcon />} disabled>
          {t('bed.newSoap')}
        </Button>
      </Stack>

      <Box sx={{ height: 4 }}>{patient.isPending && <LinearProgress />}</Box>

      {!patient.isPending && !patient.data && (
        <Alert severity="info">{t('bed.noPatient')}</Alert>
      )}

      {patient.data && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontSize: 20,
                fontWeight: 700,
                bgcolor: 'primary.main',
              }}
            >
              {patient.data.name.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
              >
                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                  {patient.data.name}
                </Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  color={STATUS_COLOR[patient.data.status]}
                  label={t(`bed.status.${patient.data.status}` as StringKey)}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  color="primary"
                  label={`${t('bed.title')} ${patient.data.bed}`}
                />
              </Stack>
              {/* Los datos se separan con puntos medios y envuelven en bloque:
                  a lo ancho se leen en una línea, y al estrecharse bajan enteros
                  en vez de partir "Insuficiencia Cardíaca" por la mitad. */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 0.25 }}
              >
                <span>ID {patient.data.patientId}</span>
                <span>·</span>
                <span>{t('bed.years', { count: String(patient.data.age) })}</span>
                <span>·</span>
                <span>{patient.data.diagnosis}</span>
                <span>·</span>
                <span>
                  {t('bed.admitted')}: {formatDateOnly(patient.data.admittedAt, locale)}
                </span>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      <Tabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((entry) => (
          <Tab key={entry.value} value={entry.value} label={t(entry.label)} />
        ))}
      </Tabs>

      {tab !== 'summary' && tab !== 'monitoring' && (
        <Alert severity="info">{t('bed.tabPending')}</Alert>
      )}

      {(tab === 'summary' || tab === 'monitoring') && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            // El monitor manda: en pantalla ancha ocupa la columna mayor y la
            // ficha se lee al lado; apilados, el monitor va primero.
            gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
            alignItems: 'start',
          }}
        >
          <VitalsMonitor bed={bed} device={device} readings={readings.data ?? []} />

          {tab === 'summary' && (
            <Stack spacing={2}>
              {patient.data && (
                <Paper sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {t('bed.info')}
                  </Typography>
                  <Field label={t('bed.field.name')}>{patient.data.name}</Field>
                  <Field label={t('bed.field.birth')}>
                    {formatDateOnly(patient.data.birthDate, locale)}
                  </Field>
                  <Field label={t('bed.field.blood')}>{patient.data.bloodType}</Field>
                  <Field label={t('bed.field.allergies')}>
                    {patient.data.allergies.length ? (
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        {patient.data.allergies.map((item) => (
                          <Chip key={item} size="small" color="error" variant="outlined" label={item} />
                        ))}
                      </Stack>
                    ) : (
                      t('bed.field.noAllergies')
                    )}
                  </Field>
                  <Field label={t('bed.field.doctor')}>{patient.data.doctor}</Field>
                  <Field label={t('bed.field.diagnosis')}>{patient.data.diagnosis}</Field>
                  <Field label={t('bed.field.contact')}>{patient.data.emergencyContact}</Field>
                  <Field label={t('bed.field.insurance')}>{patient.data.insurance}</Field>
                </Paper>
              )}

              {note.data && (
                <Paper sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {t('bed.lastSoap')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.data.at).toLocaleString(locale)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {note.data.author}
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Stack spacing={1.5}>
                    {(
                      [
                        ['S', 'bed.soap.subjective', note.data.subjective],
                        ['O', 'bed.soap.objective', note.data.objective],
                        ['A', 'bed.soap.assessment', note.data.assessment],
                        ['P', 'bed.soap.plan', note.data.plan],
                      ] as [string, StringKey, string][]
                    ).map(([letter, label, text]) => (
                      <Box key={letter}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: 1,
                              display: 'grid',
                              placeItems: 'center',
                              bgcolor: 'action.hover',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {letter}
                          </Box>
                          <Typography variant="subtitle2">{t(label)}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5 }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  )
}
