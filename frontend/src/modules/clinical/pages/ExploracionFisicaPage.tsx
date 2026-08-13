import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
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
import { EXPLORACION_TABS, K, formularioVacio } from '../components/exploracionFisica'
import type { ExploracionForm, Hallazgo, Region, Tecnica } from '../components/exploracionFisica'
import { SomatometriaCard } from '../components/SomatometriaCard'
import { SignosVitalesIngresoCard } from '../components/SignosVitalesIngresoCard'
import { ExploracionRegiones } from '../components/ExploracionRegiones'
import { getPatient } from '../../patients/api/patientsApi'
import { usePageHeader } from '../../../app/pageHeader'
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

/** Fecha y hora de llegada tal como la guarda el backend (ISO). */
function formatFecha(value: string, locale: string): string {
  return new Date(value).toLocaleDateString(locale)
}

export function ExploracionFisicaPage() {
  const { t, language } = useLanguage()
  const { patientId = '' } = useParams()

  const [tab, setTab] = useState('history')
  const [activa, setActiva] = useState<Region>('cabezaCuello')
  const [form, setForm] = useState<ExploracionForm>(formularioVacio)

  const patient = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
    enabled: patientId !== '',
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
        {/* Desactivados por lo mismo que el resto: no hay endpoint de creación
            de notas SOAP desde aquí ni de generación de reportes. */}
        <Button variant="outlined" startIcon={<DescriptionOutlinedIcon />} disabled>
          {t(K.generateReport)}
        </Button>
        <Button variant="contained" startIcon={<NoteAddOutlinedIcon />} disabled>
          {t(K.newSoap)}
        </Button>
      </Stack>

      <Box sx={{ height: 4 }}>{patient.isPending && patientId !== '' && <LinearProgress />}</Box>

      {patientId === '' && <Alert severity="info">{t(K.pickPatient)}</Alert>}
      {patient.isError && <Alert severity="error">{t(K.patientError)}</Alert>}

      {patient.data && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{ width: 48, height: 48, fontSize: 20, fontWeight: 700, bgcolor: 'primary.main' }}
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
                <Chip size="small" variant="outlined" color="primary" label={patient.data.module} />
              </Stack>
              {/* Solo lo que la tabla `paciente` guarda de verdad. El mockup
                  enseña además edad, cama y diagnóstico principal; no están en el
                  esquema, y ponerlos con un valor cualquiera sería inventarle un
                  diagnóstico a un paciente. */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 0.25 }}
              >
                <span>ID {patient.data.document}</span>
                <span>·</span>
                <span>{patient.data.reason}</span>
                <span>·</span>
                <span>
                  {t(K.admitted)}: {formatFecha(patient.data.arrivedAt, language)}
                </span>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

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
          <Alert severity="info">{t(K.sinBackend)}</Alert>

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

          {/* PENDIENTE: el `onClick` es la mutación contra
              `PUT /historia/:patientId/exploracion-fisica` descrita arriba. Sin
              ruta en el backend el botón va desactivado: un «Guardar» que no
              guarda es peor que ninguno, porque el explorador cierra la pantalla
              creyendo que su exploración quedó registrada. */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" disabled>
              {t(K.save)}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  )
}
