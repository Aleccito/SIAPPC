import { useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  addSoapAddendum,
  createSoapNote,
  getExpediente,
  listHistoriaChanges,
  listSoapNotes,
  saveObservaciones,
  signSoapNote,
} from '../api/clinicalApi'
// La lista de pacientes sale del módulo de pacientes: comparte la clave de
// caché ['patients'] con las demás pantallas, así que debe ser la misma
// función y la misma forma de respuesta ({ items, total }).
import { listPatients } from '../../patients/api/patientsApi'
import { SoapNoteDialog } from '../components/SoapNoteDialog'
import { historiaCategories } from '../types'
import type { HistoriaCategory, HistoriaEntry, SoapNote } from '../types'
import { useAuth } from '../../auth/useAuth'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

// Las cuatro secciones, en el orden que les da nombre.
const SECTIONS = [
  ['subjective', 'soap.subjective'],
  ['objective', 'soap.objective'],
  ['assessment', 'soap.assessment'],
  ['plan', 'soap.plan'],
] as const

type SectionKey = (typeof SECTIONS)[number][0]
type Draft = Record<SectionKey, string>

const EMPTY_DRAFT: Draft = { subjective: '', objective: '', assessment: '', plan: '' }

/** Un renglón de cualquier categoría: pares campo/valor, sin los vacíos. */
function EntryFields({ entry }: { entry: HistoriaEntry }) {
  const fields = Object.entries(entry).filter(
    ([key, value]) => key !== 'id' && value !== null && value !== undefined && value !== '',
  )
  return (
    <Stack spacing={0.25}>
      {fields.map(([key, value]) => (
        <Typography key={key} variant="body2">
          <Box component="span" sx={{ color: 'text.secondary' }}>
            {key}:{' '}
          </Box>
          {String(value)}
        </Typography>
      ))}
    </Stack>
  )
}

export function ExpedientePage() {
  const { t } = useLanguage()
  const locale = 'es-MX'
  const { user } = useAuth()
  const queryClient = useQueryClient()
  usePageHeader(t('clinical.title'), t('clinical.subtitle'))

  // El paciente puede venir en la URL (`/expediente?patientId=12`): es como
  // aterrizan los enlaces "Ver Perfil" de la búsqueda global. Sin esto, el
  // enlace abría el expediente con el selector vacío.
  const [searchParams, setSearchParams] = useSearchParams()
  const patientId = searchParams.get('patientId') ?? ''
  const setPatientId = (id: string) =>
    setSearchParams(id === '' ? {} : { patientId: id }, { replace: true })
  const [tab, setTab] = useState<'soap' | 'history'>('soap')
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  // No nulo = lo que se está escribiendo es un addendum de esa nota firmada.
  const [addendumOf, setAddendumOf] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  // La nota abierta en el diálogo de detalle, si hay alguna.
  const [detalle, setDetalle] = useState<SoapNote | null>(null)
  const [error, setError] = useState<string | null>(null)

  const patients = useQuery({ queryKey: ['patients'], queryFn: () => listPatients() })

  const soap = useQuery({
    queryKey: ['soapNotes', patientId],
    queryFn: () => listSoapNotes(patientId),
    enabled: patientId !== '',
  })

  const expediente = useQuery({
    queryKey: ['expediente', patientId],
    queryFn: () => getExpediente(patientId),
    enabled: patientId !== '',
  })

  const changes = useQuery({
    queryKey: ['expedienteCambios', patientId],
    queryFn: () => listHistoriaChanges(patientId),
    enabled: patientId !== '',
  })

  function refreshSoap() {
    setDraft(EMPTY_DRAFT)
    setAddendumOf(null)
    setError(null)
    void queryClient.invalidateQueries({ queryKey: ['soapNotes', patientId] })
  }

  const saveNote = useMutation({
    mutationFn: ({ sign }: { sign: boolean }) => {
      const sections = Object.fromEntries(
        SECTIONS.map(([key]) => [key, draft[key]]).filter(([, value]) => String(value).trim()),
      )
      return addendumOf
        ? addSoapAddendum(addendumOf, sections)
        : createSoapNote({ patientId: Number(patientId), ...sections, sign })
    },
    onSuccess: refreshSoap,
    onError: (err: Error) => setError(err.message),
  })

  const sign = useMutation({
    mutationFn: signSoapNote,
    onSuccess: refreshSoap,
    onError: (err: Error) => setError(err.message),
  })

  const saveNotes = useMutation({
    mutationFn: () => saveObservaciones(patientId, notes),
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: ['expediente', patientId] })
      void queryClient.invalidateQueries({ queryKey: ['expedienteCambios', patientId] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const draftHasText = SECTIONS.some(([key]) => draft[key].trim().length > 0)

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1.5 }}
        >
          <TextField
            select
            size="small"
            label={t('clinical.patient')}
            value={patientId}
            onChange={(event) => {
              setPatientId(event.target.value)
              setDraft(EMPTY_DRAFT)
              setAddendumOf(null)
              setNotes('')
              setError(null)
              setDetalle(null)
            }}
            sx={{ minWidth: 320 }}
          >
            {(patients.data?.items ?? []).map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} — {patient.document}
              </MenuItem>
            ))}
          </TextField>

          {/* Las dos pantallas cuelgan de un paciente concreto: sin uno
              elegido la URL no existe, así que el enlace tampoco se ofrece. */}
          {patientId !== '' && (
            <>
              <Button
                component={RouterLink}
                to={`/expediente/${patientId}/exploracion-fisica`}
              >
                {t('exploracion.title')}
              </Button>
              <Button component={RouterLink} to={`/expediente/${patientId}/antecedentes`}>
                {t('antecedentes.title')}
              </Button>
            </>
          )}
        </Stack>
      </Paper>

      {patientId === '' && <Alert severity="info">{t('clinical.pickPatient')}</Alert>}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {patientId !== '' && (
        <>
          <Tabs
            value={tab}
            onChange={(_, next: 'soap' | 'history') => setTab(next)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value="soap" label={t('clinical.tab.soap')} />
            <Tab value="history" label={t('clinical.tab.history')} />
          </Tabs>

          <Box sx={{ height: 4 }}>
            {(soap.isFetching || expediente.isFetching) && <LinearProgress />}
          </Box>

          {tab === 'soap' && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  {addendumOf ? t('soap.newAddendum') : t('soap.new')}
                </Typography>
                <Stack spacing={2}>
                  {SECTIONS.map(([key, label]) => (
                    <TextField
                      key={key}
                      multiline
                      minRows={2}
                      label={t(label)}
                      value={draft[key]}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, [key]: event.target.value }))
                      }
                    />
                  ))}
                  <Stack direction="row" spacing={1}>
                    {/* Un addendum nace firmado —lo decide el backend—, así que
                        cuando se está corrigiendo una nota no se ofrece
                        guardarlo como borrador. */}
                    {!addendumOf && (
                      <Button
                        disabled={!draftHasText || saveNote.isPending}
                        onClick={() => saveNote.mutate({ sign: false })}
                      >
                        {t('soap.saveDraft')}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      disabled={!draftHasText || saveNote.isPending}
                      onClick={() => saveNote.mutate({ sign: true })}
                    >
                      {addendumOf ? t('soap.saveAddendum') : t('soap.signAndSave')}
                    </Button>
                    {addendumOf && (
                      <Button onClick={() => setAddendumOf(null)}>{t('soap.cancel')}</Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>

              {soap.isError && <Alert severity="error">{t('clinical.error')}</Alert>}
              {soap.data?.length === 0 && <Alert severity="info">{t('soap.empty')}</Alert>}

              {soap.data?.map((note: SoapNote) => (
                <Paper key={note.id} sx={{ p: 2.5 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5, mb: 1 }}
                  >
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {note.authorName} · {new Date(note.at).toLocaleString(locale)}
                    </Typography>
                    {note.parentId && (
                      <Chip size="small" variant="outlined" label={t('soap.addendum')} />
                    )}
                    <Chip
                      size="small"
                      color={note.status === 'firmada' ? 'success' : 'warning'}
                      variant={note.status === 'firmada' ? 'filled' : 'outlined'}
                      label={t(`soap.${note.status}` as StringKey)}
                    />
                  </Stack>

                  <Divider sx={{ mb: 1.5 }} />

                  <Stack spacing={1}>
                    {SECTIONS.map(([key, label]) =>
                      note[key] ? (
                        <Box key={key}>
                          <Typography variant="subtitle2">{t(label)}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {note[key]}
                          </Typography>
                        </Box>
                      ) : null,
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
                    {note.signedAt && (
                      <Typography variant="caption" color="text.secondary">
                        {t('soap.signedBy')} {note.signedByName} ·{' '}
                        {new Date(note.signedAt).toLocaleString(locale)}
                      </Typography>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Button size="small" onClick={() => setDetalle(note)}>
                      {t('busqueda.viewNote')}
                    </Button>
                    {/* Firmar solo aparece en el borrador propio: el backend
                        rechaza el resto, y ofrecer un botón que va a fallar es
                        peor que no ofrecerlo. */}
                    {note.status === 'borrador' && note.authorId === user?.id && (
                      <Button size="small" variant="contained" onClick={() => sign.mutate(note.id)}>
                        {t('soap.sign')}
                      </Button>
                    )}
                    {note.status === 'firmada' && !note.parentId && (
                      <Button
                        size="small"
                        onClick={() => {
                          setAddendumOf(note.id)
                          setDraft(EMPTY_DRAFT)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        {t('soap.addAddendum')}
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          {tab === 'history' && (
            <Stack spacing={2}>
              {expediente.isError && <Alert severity="error">{t('clinical.error')}</Alert>}

              {expediente.data && (
                <>
                  <Paper sx={{ p: 2.5 }}>
                    <Typography variant="h6">{expediente.data.patientName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {expediente.data.document}
                      {expediente.data.openedAt
                        ? ` · ${t('historia.openedAt')} ${new Date(
                            expediente.data.openedAt,
                          ).toLocaleDateString(locale)}`
                        : ''}
                    </Typography>
                  </Paper>

                  {historiaCategories.map((category: HistoriaCategory) => {
                    const entries = expediente.data[category] ?? []
                    return (
                      <Accordion key={category} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography sx={{ flexGrow: 1 }}>
                            {t(`historia.cat.${category}` as StringKey)}
                          </Typography>
                          <Chip size="small" label={entries.length} />
                        </AccordionSummary>
                        <AccordionDetails>
                          {entries.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              {t('historia.empty')}
                            </Typography>
                          ) : (
                            <Stack spacing={1.5} divider={<Divider flexItem />}>
                              {entries.map((entry) => (
                                <EntryFields key={entry.id} entry={entry} />
                              ))}
                            </Stack>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}

                  {/* Observaciones: lo único del expediente que enfermería
                      escribe. Quien no tenga permiso recibe 403 del servidor y
                      el mensaje sale en la alerta de arriba. */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{t('historia.notes')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1.5}>
                        <TextField
                          multiline
                          minRows={3}
                          value={notes || (expediente.data.notes ?? '')}
                          onChange={(event) => setNotes(event.target.value)}
                        />
                        <Box>
                          <Button
                            variant="contained"
                            disabled={saveNotes.isPending || notes.trim() === ''}
                            onClick={() => saveNotes.mutate()}
                          >
                            {t('historia.saveNotes')}
                          </Button>
                        </Box>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ flexGrow: 1 }}>{t('historia.changes')}</Typography>
                      <Chip size="small" label={changes.data?.length ?? 0} />
                    </AccordionSummary>
                    <AccordionDetails>
                      {changes.data?.length ? (
                        <Stack spacing={1} divider={<Divider flexItem />}>
                          {changes.data.map((change) => (
                            <Box key={change.id}>
                              <Typography variant="body2">{change.detail}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {change.authorName ?? '—'} ·{' '}
                                {new Date(change.at).toLocaleString(locale)}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('historia.noChanges')}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </Stack>
          )}
        </>
      )}

      {/* El diálogo no edita ni redacta por su cuenta: la adenda se escribe en
          el formulario de arriba, que es el que ya sabe hacerlo. No se le pasa
          `onEdit` porque no existe endpoint para modificar un borrador; lo
          único que hoy se puede hacer con una nota firmada es la adenda. */}
      <SoapNoteDialog
        open={detalle !== null}
        note={detalle ?? undefined}
        onClose={() => setDetalle(null)}
        onAddendum={(note) => {
          setAddendumOf(note.id)
          setDraft(EMPTY_DRAFT)
          setDetalle(null)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </Stack>
  )
}
