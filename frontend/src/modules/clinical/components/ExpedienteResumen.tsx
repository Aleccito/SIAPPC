import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { historiaCategories } from '../types'
import type { Expediente, HistoriaCategory, HistoriaEntry } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

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
                    <EntryFields key={entry.id} entry={entry} />
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
