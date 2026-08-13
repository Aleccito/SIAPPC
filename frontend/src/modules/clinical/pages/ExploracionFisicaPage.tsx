import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { EXPLORACION_TABS, K, formularioVacio } from '../components/exploracionFisica'
import type { ExploracionForm, Hallazgo, Region, Tecnica } from '../components/exploracionFisica'
import { SomatometriaCard } from '../components/SomatometriaCard'
import { SignosVitalesIngresoCard } from '../components/SignosVitalesIngresoCard'
import { ExploracionRegiones } from '../components/ExploracionRegiones'
import { getPatient } from '../../patients/api/patientsApi'
import { usePageHeader } from '../../../app/pageHeader'
import { getExploracion, saveExploracion, dtoAFormulario } from '../api/exploracionApi'
import { PatientRecordHeader } from '../components/PatientRecordHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Exploración Física — pestaña «Historia Clínica» del expediente del paciente.
//
// DECISIÓN: opción (b), formulario en estado local sin endpoint.
//
// `backend/prisma/schema.prisma` no tiene ninguna tabla de exploración física ni
// de somatometría (están `expediente_clinico`, `antecedente`, `diagnostico`,
// `nota_soap`… pero nada de peso, talla, Glasgow ni hallazgos por región). Se
// eligió no crear el modelo ni la migración porque hay más gente trabajando el
// esquema en paralelo y una migración añadida a la vez que las suyas obliga a
// resolver el conflicto en la base de datos, no solo en el archivo. La pantalla
// queda completa y lista para conectar en cuanto exista la ruta.
//
// PENDIENTE (lo único que falta): dos llamadas en
// `frontend/src/modules/clinical/api/clinicalApi.ts`, contra
// `GET /historia/:patientId/exploracion-fisica` y
// `PUT /historia/:patientId/exploracion-fisica`, con el cuerpo de
// `ExploracionForm`. Aquí se enchufan en `useQuery` para la carga y en una
// `useMutation` en `guardar()`.
//
// No hay datos de ejemplo en el formulario, ni siquiera los del mockup: en una
// aplicación clínica un peso o un Glasgow de relleno se lee como una medición
// real del paciente que se tiene delante.


export function ExploracionFisicaPage() {
  const { t } = useLanguage()
  const { patientId = '' } = useParams()

  const [tab, setTab] = useState('history')
  const [activa, setActiva] = useState<Region>('cabezaCuello')
  const [form, setForm] = useState<ExploracionForm>(formularioVacio)

  const patient = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
    enabled: patientId !== '',
  })

  const exploracion = useQuery({
    queryKey: ['exploracion', patientId],
    queryFn: () => getExploracion(patientId),
    enabled: patientId !== '',
  })

  // Lo guardado llena el formulario una vez, cuando llega. No se sincroniza en
  // cada render: sobrescribiría lo que el explorador está escribiendo.
  useEffect(() => {
    if (exploracion.data) setForm(dtoAFormulario(exploracion.data))
  }, [exploracion.data])

  const queryClient = useQueryClient()
  const guardar = useMutation({
    mutationFn: () => saveExploracion(patientId, form),
    onSuccess: (dto) => {
      setForm(dtoAFormulario(dto))
      queryClient.invalidateQueries({ queryKey: ['exploracion', patientId] })
    },
  })

  usePageHeader(
    patient.data ? `${t(K.title)} — ${patient.data.name}` : t(K.title),
    t(K.subtitle),
  )

  function cambiarMedida(campo: 'pesoKg' | 'tallaCm' | 'perimetroCm', valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  function cambiarHallazgo(region: Region, tecnica: Tecnica, hallazgo: Hallazgo) {
    setForm((actual) => ({
      ...actual,
      regiones: {
        ...actual.regiones,
        [region]: { ...actual.regiones[region], [tecnica]: hallazgo },
      },
    }))
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Button component={RouterLink} to="/expediente" startIcon={<ArrowBackIcon />}>
          {t(K.back)}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>

      <Box sx={{ height: 4 }}>{patient.isPending && patientId !== '' && <LinearProgress />}</Box>

      {patientId === '' && <Alert severity="info">{t(K.pickPatient)}</Alert>}
      {patient.isError && <Alert severity="error">{t(K.patientError)}</Alert>}

      {patient.data && <PatientRecordHeader patient={patient.data} />}

      <Tabs
        value={tab}
        onChange={(_, next: string) => setTab(next)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {EXPLORACION_TABS.map((entry) => (
          <Tab key={entry.value} value={entry.value} label={t(entry.label)} />
        ))}
      </Tabs>

      {tab !== 'history' && <Alert severity="info">{t(K.tabPending)}</Alert>}

      {tab === 'history' && (
        <>
          {guardar.isError && <Alert severity="error">{guardar.error.message}</Alert>}

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              // La somatometría son cuatro casillas y los signos vitales una
              // sola: a lo ancho la primera se queda con la mitad mayor.
              gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
              alignItems: 'stretch',
            }}
          >
            <SomatometriaCard
              pesoKg={form.pesoKg}
              tallaCm={form.tallaCm}
              perimetroCm={form.perimetroCm}
              onChange={cambiarMedida}
            />
            <SignosVitalesIngresoCard
              glasgow={form.glasgow}
              onChange={(valor) => setForm((actual) => ({ ...actual, glasgow: valor }))}
            />
          </Box>

          <ExploracionRegiones
            activa={activa}
            onSelect={setActiva}
            hallazgos={form.regiones}
            onChange={cambiarHallazgo}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => guardar.mutate()}
              disabled={patientId === '' || guardar.isPending}
            >
              {t(K.save)}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  )
}
