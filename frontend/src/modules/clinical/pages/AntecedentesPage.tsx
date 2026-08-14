import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { createAntecedente, listAntecedentes } from '../api/antecedentesApi'
import type { NuevoAntecedente, TipoAntecedente } from '../api/antecedentesApi'
import { AntecedentesTable } from '../components/AntecedentesTable'
import { NuevoAntecedenteDialog } from '../components/NuevoAntecedenteDialog'
import { PatientRecordHeader } from '../components/PatientRecordHeader'
import { getPatient } from '../../patients/api/patientsApi'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

// Antecedentes Completos.
//
// Las cuatro sub-pestañas del diseño no son cuatro tablas: son una sola —
// `antecedente`— agrupada por su columna `tipo`, que es justo para lo que se
// hizo así (ver el comentario del modelo en prisma/schema.prisma). El mapeo
// contra el enum `TipoAntecedente`:
//
//   Heredofamiliares         → familiar
//   Personales Patológicos   → personal + quirurgico   (dos valores, una pestaña:
//                              el propio diseño dice que la sección incluye las
//                              cirugías previas)
//   No Patológicos           → habito
//   Gineco-obstétricos       → ginecoobstetrico
//
// Al pie, la tarjeta que anuncia la sección siguiente: son las mismas cuatro en
// círculo, así que la siguiente sale del índice y no de una lista aparte.

type SubPestana = {
  id: string
  label: StringKey
  /** Valores del enum que caen en esta sub-pestaña. */
  types: readonly TipoAntecedente[]
  /** Lo que la tarjeta del pie dice de esta sección cuando es la siguiente. */
  hint: StringKey
}

const SUBTABS: SubPestana[] = [
  {
    id: 'heredofamiliares',
    label: 'antecedentes.tab.family',
    types: ['familiar'],
    hint: 'antecedentes.hint.family',
  },
  {
    id: 'personales',
    label: 'antecedentes.tab.personal',
    types: ['personal', 'quirurgico'],
    hint: 'antecedentes.hint.personal',
  },
  {
    id: 'noPatologicos',
    label: 'antecedentes.tab.habits',
    types: ['habito'],
    hint: 'antecedentes.hint.habits',
  },
  {
    id: 'ginecoobstetricos',
    label: 'antecedentes.tab.obstetric',
    types: ['ginecoobstetrico'],
    hint: 'antecedentes.hint.obstetric',
  },
]

// Las pestañas del expediente. Solo Historia Clínica tiene pantalla; las otras
// cuatro no existen todavía, así que se muestran desactivadas en vez de
// enlazarlas a una ruta que no está. Reutilizan las etiquetas de la pantalla de
// cama, que son literalmente las mismas cinco.
const RECORD_TABS: { value: string; label: StringKey }[] = [
  { value: 'summary', label: 'bed.tab.summary' },
  { value: 'history', label: 'bed.tab.history' },
  { value: 'soap', label: 'bed.tab.soap' },
  { value: 'monitoring', label: 'bed.tab.monitoring' },
  { value: 'documents', label: 'bed.tab.documents' },
]

export function AntecedentesPage() {
  const { t } = useLanguage()
  const { pacienteId = '' } = useParams()
  const queryClient = useQueryClient()
  const [subtab, setSubtab] = useState(SUBTABS[0]!.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  usePageHeader(t('antecedentes.title'), t('antecedentes.subtitle'))

  const patient = useQuery({
    queryKey: ['patient', pacienteId],
    queryFn: () => getPatient(pacienteId),
    enabled: pacienteId !== '',
  })

  // Una sola lectura para las cuatro sub-pestañas: la categoría entera cabe en
  // una llamada y cambiar de pestaña no tiene por qué ir al servidor.
  const antecedentes = useQuery({
    queryKey: ['antecedentes', pacienteId],
    queryFn: () => listAntecedentes(pacienteId),
    enabled: pacienteId !== '',
  })

  const guardar = useMutation({
    mutationFn: (nuevo: NuevoAntecedente) => createAntecedente(pacienteId, nuevo),
    onSuccess: () => {
      setError(null)
      setDialogOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['antecedentes', pacienteId] })
      // El expediente completo trae esta misma categoría dentro.
      void queryClient.invalidateQueries({ queryKey: ['expediente', pacienteId] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const indice = SUBTABS.findIndex((entry) => entry.id === subtab)
  const actual = SUBTABS[indice === -1 ? 0 : indice]!
  const siguiente = SUBTABS[(SUBTABS.indexOf(actual) + 1) % SUBTABS.length]!

  // Los dados de baja no se listan: el expediente los conserva, la pantalla
  // enseña lo vigente.
  const filas = (antecedentes.data ?? []).filter(
    (row) => row.active && actual.types.includes(row.type),
  )

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Button component={RouterLink} to="/patients" startIcon={<ArrowBackIcon />}>
          {t('antecedentes.back')}
        </Button>
      </Stack>

      {pacienteId === '' && <Alert severity="info">{t('antecedentes.noPatient')}</Alert>}

      <LoadingBar loading={patient.isFetching || antecedentes.isFetching} />

      {patient.isError && <Alert severity="error">{t('antecedentes.error')}</Alert>}
      {patient.data && <PatientRecordHeader patient={patient.data} />}

      <Tabs
        value="history"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {RECORD_TABS.map((entry) => (
          <Tab
            key={entry.value}
            value={entry.value}
            label={t(entry.label)}
            disabled={entry.value !== 'history'}
          />
        ))}
      </Tabs>

      <Paper sx={{ px: 1 }}>
        <Tabs
          value={actual.id}
          onChange={(_, next: string) => setSubtab(next)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {SUBTABS.map((entry) => (
            <Tab key={entry.id} value={entry.id} label={t(entry.label)} />
          ))}
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {antecedentes.isError && <Alert severity="error">{t('antecedentes.error')}</Alert>}

      <Paper sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { sm: 'center' }, mb: 1.5 }}
        >
          <Typography variant="h6">{t(actual.label)}</Typography>
          <Chip
            size="small"
            variant="outlined"
            label={t('antecedentes.count', { count: String(filas.length) })}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={pacienteId === ''}
            onClick={() => {
              setError(null)
              setDialogOpen(true)
            }}
          >
            {t('antecedentes.add')}
          </Button>
        </Stack>

        {filas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('antecedentes.empty')}
          </Typography>
        ) : (
          <AntecedentesTable rows={filas} />
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('antecedentes.next')}: {t(siguiente.label)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(siguiente.hint)}
            </Typography>
          </Box>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => setSubtab(siguiente.id)}
          >
            {t('antecedentes.seeSection')}
          </Link>
        </Stack>
      </Paper>

      <NuevoAntecedenteDialog
        // Al remontar con la sub-pestaña, el formulario nace con el tipo de la
        // pestaña abierta y sin lo que se hubiera escrito antes.
        key={actual.id}
        open={dialogOpen}
        types={actual.types}
        saving={guardar.isPending}
        error={error}
        onClose={() => setDialogOpen(false)}
        onSave={(nuevo) => guardar.mutate(nuevo)}
      />
    </Stack>
  )
}
