import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import StopIcon from '@mui/icons-material/Stop'
import { LoadingBar } from '../../../shared/LoadingBar'
import { ApiError } from '../../../shared/api/http'
import { listPatients } from '../../patients/api/patientsApi'
import { streamAiAssist } from '../api/aiApi'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

// Preguntas frecuentes de un clic. Llenan el cuadro y se envían; el médico
// puede editarlas antes con Mayús+clic si quiere afinarlas.
const QUICK: StringKey[] = [
  'aiConsult.quick.differentials',
  'aiConsult.quick.redFlags',
  'aiConsult.quick.studies',
  'aiConsult.quick.interactions',
  'aiConsult.quick.management',
]

const MAX_PREGUNTA = 5_000

type Estado = 'idle' | 'streaming' | 'done' | 'stopped' | 'error'

/**
 * Consulta libre al asistente clínico (POST /ai/assist/stream).
 *
 * La respuesta no se guarda en ningún lado: si el médico la adopta, la pasa él
 * a una nota SOAP firmada. Quién entra lo decide el servidor
 * (`asistente_ia:ver`); con 403 se muestra el aviso y nada más.
 */
export function AiConsultPage() {
  const { t } = useLanguage()
  usePageHeader(t('aiConsult.title'), t('aiConsult.subtitle'))

  // Mismo patrón que el expediente: `/ai?patientId=12` abre con el paciente.
  const [searchParams, setSearchParams] = useSearchParams()
  const patientId = searchParams.get('patientId') ?? ''
  const setPatientId = (id: string) =>
    setSearchParams(id === '' ? {} : { patientId: id }, { replace: true })

  const patients = useQuery({ queryKey: ['patients'], queryFn: () => listPatients() })
  const nombrePaciente =
    patients.data?.items.find((p) => String(p.id) === patientId)?.name ?? `#${patientId}`

  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState('')
  const [answer, setAnswer] = useState('')
  const [model, setModel] = useState<string | null>(null)
  const [disclaimer, setDisclaimer] = useState<string | null>(null)
  const [estado, setEstado] = useState<Estado>('idle')
  const [error, setError] = useState<string | null>(null)
  const control = useRef<AbortController | null>(null)

  // Salir de la pantalla corta la generación: el LLM es de un solo hilo.
  useEffect(() => () => control.current?.abort(), [])

  async function preguntar(texto: string) {
    const q = texto.trim()
    if (!q || !patientId || estado === 'streaming') return

    control.current?.abort()
    const propio = new AbortController()
    control.current = propio

    setAsked(`${t('aiConsult.ofPatient')} ${nombrePaciente}: ${q}`)
    setAnswer('')
    setError(null)
    setEstado('streaming')

    try {
      await streamAiAssist(
        { patientId: Number(patientId), question: q },
        {
          onStart: (info) => {
            setModel(info.model)
            setDisclaimer(info.disclaimer)
          },
          onChunk: (trozo) => setAnswer((prev) => prev + trozo),
        },
        propio.signal,
      )
      setEstado('done')
    } catch (err: unknown) {
      if (propio.signal.aborted) {
        setEstado('stopped')
        return
      }
      setEstado('error')
      if (err instanceof ApiError && err.status === 403) setError(t('aiConsult.forbidden'))
      else if (err instanceof ApiError && err.status === 429) setError(t('aiConsult.rateLimited'))
      else if (err instanceof ApiError && err.status === 503) setError(t('aiConsult.unavailable'))
      else setError(err instanceof Error ? err.message : t('aiConsult.unavailable'))
    }
  }

  function detener() {
    control.current?.abort()
  }

  const generando = estado === 'streaming'
  const sinPaciente = patientId === ''

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <TextField
            select
            size="small"
            label={t('aiConsult.patient')}
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            disabled={generando}
            sx={{ maxWidth: 420 }}
            helperText={t('aiConsult.patientHelp')}
          >
            {(patients.data?.items ?? []).map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} — {patient.document}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('aiConsult.quickTitle')}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              {QUICK.map((key) => (
                <Chip
                  key={key}
                  label={t(key)}
                  variant="outlined"
                  color="primary"
                  disabled={generando || sinPaciente}
                  // Clic = enviar ya. Mayús+clic = solo copiar al cuadro para editarla.
                  onClick={(event) => {
                    if (event.shiftKey) setQuestion(t(key))
                    else {
                      setQuestion(t(key))
                      void preguntar(t(key))
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault()
              void preguntar(question)
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
              label={t('aiConsult.question')}
              placeholder={t('aiConsult.placeholder')}
              value={question}
              onChange={(event) => setQuestion(event.target.value.slice(0, MAX_PREGUNTA))}
              onKeyDown={(event) => {
                // Ctrl/Cmd+Enter envía; Enter solo hace salto de línea.
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault()
                  void preguntar(question)
                }
              }}
              disabled={generando || sinPaciente}
              helperText={`${question.length}/${MAX_PREGUNTA} · ${t('aiConsult.shortcut')}`}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
              {/* `key` distinta en cada botón: si React reutilizara el mismo
                  <button>, al terminar el clic en Detener ya sería type="submit"
                  y el formulario se reenviaría, reiniciando la respuesta. */}
              {generando ? (
                <Button
                  key="detener"
                  type="button"
                  variant="outlined"
                  color="inherit"
                  startIcon={<StopIcon />}
                  onClick={detener}
                >
                  {t('aiConsult.stop')}
                </Button>
              ) : (
                <Button
                  key="enviar"
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={!question.trim() || sinPaciente}
                >
                  {t('aiConsult.send')}
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {sinPaciente && <Alert severity="info">{t('aiConsult.pickPatient')}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {(asked || generando) && (
        <Paper sx={{ p: 2.5 }} aria-live="polite" aria-busy={generando}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
            <Typography variant="h6">{t('aiConsult.answer')}</Typography>
            {model && <Chip size="small" variant="outlined" label={model} />}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {asked}
          </Typography>

          <LoadingBar loading={generando && answer === ''} />

          {/* Texto plano con saltos de línea: el modelo responde en Markdown, y
              pintarlo como HTML abriría la puerta a contenido inyectado. */}
          <Typography
            component="div"
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}
          >
            {answer}
            {generando && answer !== '' && <Box component="span" sx={{ opacity: 0.6 }}>▍</Box>}
          </Typography>

          {estado === 'stopped' && (
            <Typography variant="body2" color="text.secondary">
              {t('aiConsult.stopped')}
            </Typography>
          )}

          <Alert severity="warning" sx={{ mt: 2 }}>
            {disclaimer ?? t('aiIdeas.disclaimer')}
          </Alert>
        </Paper>
      )}
    </Stack>
  )
}
