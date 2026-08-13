import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { search } from '../api/searchApi'
import type {
  SearchDocumentResult,
  SearchNoteResult,
  SearchPatientResult,
  SearchResult,
} from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

// Búsqueda global: pacientes, notas SOAP y documentos en una sola pantalla.
//
// El término vive en la URL (`?q=`) y no solo en el estado del componente: así
// un resultado se comparte por enlace y el botón de atrás del navegador vuelve a
// la búsqueda anterior en vez de a un cuadro vacío.
//
// La consulta se dispara al enviar el formulario, no en cada tecla. El LIKE con
// comodín por delante que hay detrás no usa índice (ver backend/src/routes/
// search.ts) y lanzarlo por pulsación sería una consulta cara por letra escrita.

/** Mínimo que exige el servidor; por debajo ni se pide. */
const MIN_LENGTH = 2

/**
 * Las claves de esta pantalla todavía no están en el diccionario compartido:
 * se integran aparte para no pisar el archivo, que tocan varias pantallas a la
 * vez. Cuando estén, este ayudante sobra y `t` las acepta directamente.
 */

function tabIndexOf(result: SearchResult): number {
  if (result.kind === 'patient') return 1
  return result.kind === 'soapNote' ? 2 : 3
}

export function SearchPage() {
  const { t, language } = useLanguage()
  usePageHeader(t('busqueda.title'), t('busqueda.subtitle'))

  const [params, setParams] = useSearchParams()
  const term = (params.get('q') ?? '').trim()
  const [draft, setDraft] = useState(term)
  const [tab, setTab] = useState(0)

  const enabled = term.length >= MIN_LENGTH
  const { data, isFetching } = useQuery({
    queryKey: ['search', term],
    queryFn: () => search(term),
    enabled,
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = draft.trim()
    // `replace` no: cada búsqueda es un paso del historial, que es lo que hace
    // útil el botón de atrás aquí.
    setParams(next ? { q: next } : {})
    setTab(0)
  }

  const patients = data?.patients ?? []
  const notes = data?.notes ?? []
  const documents = data?.documents ?? []

  // La pestaña "Todos" respeta el orden de las fuentes: pacientes primero, que
  // es lo que se busca casi siempre.
  const all: SearchResult[] = [...patients, ...notes, ...documents]
  const visible = all.filter((result) => tab === 0 || tabIndexOf(result) === tab)

  return (
    <Stack spacing={3}>
      {/* `aria-label` además del marcador de posición: el marcador desaparece
          al escribir y un lector de pantalla se quedaría sin qué anunciar. */}
      <Box component="form" role="search" onSubmit={submit}>
        <TextField
          fullWidth
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('busqueda.placeholder')}
          aria-label={t('busqueda.placeholder')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {!enabled && <Alert severity="info">{t('busqueda.prompt')}</Alert>}

      {enabled && (
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {t('busqueda.results', { q: data?.query ?? term })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('busqueda.count', { count: String(data?.total ?? 0) })}
            </Typography>
          </Box>

          <Tabs value={tab} onChange={(_, value: number) => setTab(value)}>
            <Tab label={`${t('busqueda.tab.all')} (${all.length})`} />
            <Tab label={`${t('busqueda.tab.patients')} (${patients.length})`} />
            <Tab label={`${t('busqueda.tab.notes')} (${notes.length})`} />
            <Tab label={`${t('busqueda.tab.documents')} (${documents.length})`} />
          </Tabs>

          {/* Altura reservada para que un refetch no salte la lista entera. */}
          <Box sx={{ height: 4 }}>{isFetching && <LinearProgress />}</Box>

          {visible.length === 0 && !isFetching && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4 }} align="center">
              {t('busqueda.empty')}
            </Typography>
          )}

          {visible.map((result) => {
            if (result.kind === 'patient') {
              return <PatientCard key={`p-${result.id}`} patient={result} />
            }
            if (result.kind === 'soapNote') {
              return <NoteCard key={`n-${result.id}`} note={result} language={language} />
            }
            return <DocumentCard key={`d-${result.id}`} document={result} language={language} />
          })}
        </Stack>
      )}
    </Stack>
  )
}

/** Marco común de las tres tarjetas: mismo alto de icono, mismo reparto. */
function ResultCard(props: {
  icon: ReactNode
  children: ReactNode
  actions: ReactNode
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        >
          {props.icon}
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>{props.children}</Box>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {props.actions}
        </Stack>
      </Stack>
    </Paper>
  )
}

function PatientCard({ patient }: { patient: SearchPatientResult }) {
  const { t } = useLanguage()

  return (
    <ResultCard
      icon={<PersonOutlineOutlinedIcon color="primary" fontSize="small" />}
      actions={
        <>
          <Button
            size="small"
            variant="outlined"
            component={RouterLink}
            to={`/expediente?patientId=${patient.id}`}
          >
            {t('busqueda.viewProfile')}
          </Button>
          {/* Sin equipo asignado no hay nada que monitorear: la ruta de
              monitoreo se identifica por el código del dispositivo. */}
          <Button
            size="small"
            variant="contained"
            disabled={patient.device === null}
            component={RouterLink}
            to={`/monitoring/${patient.device ?? ''}`}
          >
            {t('busqueda.monitoring')}
          </Button>
        </>
      }
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {patient.name}
        </Typography>
        <Chip
          size="small"
          variant="outlined"
          color={patient.critical ? 'error' : 'success'}
          label={t(patient.critical ? 'busqueda.state.critical' : 'busqueda.state.stable')}
        />
        {patient.bed !== null && (
          <Chip
            size="small"
            variant="outlined"
            color="info"
            label={[patient.unit, patient.bed].filter(Boolean).join(' ')}
          />
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {t('busqueda.hc')} <strong>{patient.document}</strong>
        {'   '}
        {t('busqueda.diagnosis')}{' '}
        <strong>{patient.diagnosis ?? t('busqueda.noDiagnosis')}</strong>
      </Typography>
    </ResultCard>
  )
}

function NoteCard({ note, language }: { note: SearchNoteResult; language: string }) {
  const { t } = useLanguage()

  return (
    <ResultCard
      icon={<AssignmentOutlinedIcon color="warning" fontSize="small" />}
      actions={
        <Button
          size="small"
          variant="outlined"
          component={RouterLink}
          to={`/expediente?patientId=${note.patientId}&nota=${note.id}`}
        >
          {t('busqueda.viewNote')}
        </Button>
      }
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t('busqueda.note')} — {note.patientName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(note.at).toLocaleDateString(language)}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" noWrap>
        «{note.excerpt}»
      </Typography>
    </ResultCard>
  )
}

function DocumentCard({
  document,
  language,
}: {
  document: SearchDocumentResult
  language: string
}) {
  const { t } = useLanguage()

  return (
    <ResultCard
      icon={<DescriptionOutlinedIcon color="error" fontSize="small" />}
      actions={
        // El archivo todavía no se sirve: `documento_clinico` guarda la ficha y
        // no el binario. El botón lleva al expediente, que es donde el documento
        // vive, y no a una descarga que no existe.
        <Button
          size="small"
          variant="outlined"
          component={RouterLink}
          to={`/expediente?patientId=${document.patientId}`}
        >
          {t('busqueda.viewDocument')}
        </Button>
      }
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {document.title}
        </Typography>
        <Chip size="small" variant="outlined" color="error" label={document.type} />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {t('busqueda.uploadedOn', {
          date: new Date(document.at).toLocaleDateString(language),
        })}
        {document.unit !== null && ` • ${document.unit}`}
      </Typography>
    </ResultCard>
  )
}
