import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { historiaCategories } from '../types'
import type { Expediente, HistoriaCategory, HistoriaEntry } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { dictionaries, type StringKey } from '../../../shared/i18n/dictionary'

/** Un renglón de cualquier categoría: pares campo/valor, sin los vacíos. */
function EntryFields({ entry, locale }: { entry: HistoriaEntry; locale: string }) {
  const { t } = useLanguage()
  const fields = Object.entries(entry).filter(
    ([key, value]) => key !== 'id' && value !== null && value !== undefined && value !== '',
  )
  return (
    <Stack spacing={0.25}>
      {fields.map(([key, value]) => (
        <Typography key={key} variant="body2">
          <Box component="span" sx={{ color: 'text.secondary' }}>
            {etiqueta(key)}:{' '}
          </Box>
          {valor(key, value, t, locale)}
        </Typography>
      ))}
    </Stack>
  )
}

// Las claves del DTO van en inglés; en pantalla, su nombre en español. Una
// clave sin traducir se muestra tal cual para no ocultar el dato.
function etiqueta(key: string): string {
  const k = `historia.field.${key}`
  return k in dictionaries.es ? dictionaries.es[k as StringKey] : key
}

const FECHA = /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/

function valor(key: string, value: unknown, t: (key: StringKey) => string, locale: string): string {
  // Tipo de documento: el ENUM va sin tildes (`imagenologia`); se muestra su nombre.
  if (key === 'type' && typeof value === 'string' && `docType.${value}` in dictionaries.es) {
    return t(`docType.${value}` as StringKey)
  }
  if (typeof value === 'boolean') return t(value ? 'historia.field.yes' : 'historia.field.no')
  if (typeof value === 'string' && FECHA.test(value)) {
    // Solo fecha: se lee como UTC para que no se corra un día por la zona horaria.
    const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value)
    return value.length === 10
      ? d.toLocaleDateString(locale, { timeZone: 'UTC' })
      : d.toLocaleString(locale)
  }
  if (typeof value === 'string' && /^[a-z_]+$/.test(value)) return formal(value)
  return String(value)
}

// Los ENUM de la base van en minúscula y sin tildes (`critica`, `quirurgico`).
// En pantalla: con tilde y mayúscula inicial, para que se lea formal.
const TILDES: Record<string, string> = {
  critica: 'crítica',
  quirurgico: 'quirúrgico',
  ginecoobstetrico: 'gineco-obstétrico',
  habito: 'hábito',
  imagenologia: 'imagenología',
  torax: 'tórax',
  neurologico: 'neurológico',
  cabeza_cuello: 'cabeza y cuello',
  inspeccion: 'inspección',
  palpacion: 'palpación',
  percusion: 'percusión',
  auscultacion: 'auscultación',
  modificacion: 'modificación',
  leido: 'leído',
  no_asistio: 'no asistió',
}

function formal(codigo: string): string {
  const texto = TILDES[codigo] ?? codigo.replaceAll('_', ' ')
  return texto.charAt(0).toLocaleUpperCase('es') + texto.slice(1)
}

/**
 * La parte de solo lectura del expediente: cabecera del paciente y las ocho
 * categorías en acordeones.
 *
 * Vive aparte porque la pintan dos pantallas —el Expediente Clínico y la
 * pestaña de Historia Clínica del monitor de cama— y solo el Expediente añade
 * lo que se escribe (observaciones e historial de cambios).
 */
export function ExpedienteResumen({ expediente, locale }: { expediente: Expediente; locale: string }) {
  const { t } = useLanguage()

  return (
    <>
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6">{expediente.patientName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {expediente.document}
          {expediente.openedAt
            ? ` · ${t('historia.openedAt')} ${new Date(expediente.openedAt).toLocaleDateString(locale)}`
            : ''}
        </Typography>
      </Paper>

      {historiaCategories.map((category: HistoriaCategory) => {
        const entries = expediente[category] ?? []
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
                    <EntryFields key={entry.id} entry={entry} locale={locale} />
                  ))}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}
