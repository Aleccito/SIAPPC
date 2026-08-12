import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import type { NuevoAntecedente, TipoAntecedente } from '../api/antecedentesApi'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Alta de un antecedente. El tipo no se elige libremente: lo fija la sub-pestaña
// abierta, salvo en Personales Patológicos, que agrupa dos valores del enum
// (`personal` y `quirurgico`) y ahí sí hay que decir cuál de los dos.

export function NuevoAntecedenteDialog({
  open,
  types,
  saving,
  error,
  onClose,
  onSave,
}: {
  open: boolean
  /** Valores del enum que admite la sub-pestaña; el primero es el de partida. */
  types: readonly TipoAntecedente[]
  saving: boolean
  error: string | null
  onClose: () => void
  onSave: (antecedente: NuevoAntecedente) => void
}) {
  const { t } = useLanguage()
  const [type, setType] = useState<TipoAntecedente>(types[0]!)
  const [description, setDescription] = useState('')
  const [relationship, setRelationship] = useState('')
  const [year, setYear] = useState('')

  function close() {
    setType(types[0]!)
    setDescription('')
    setRelationship('')
    setYear('')
    onClose()
  }

  function save() {
    onSave({
      type,
      description: description.trim(),
      // El parentesco solo se manda cuando el antecedente es familiar: en los
      // demás la columna no significa nada.
      ...(type === 'familiar' && relationship.trim()
        ? { relationship: relationship.trim() }
        : {}),
      ...(year.trim() ? { year: Number(year) } : {}),
    })
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>{t('antecedentes.add')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {types.length > 1 && (
            <TextField
              select
              label={t('antecedentes.field.type')}
              value={type}
              onChange={(event) => setType(event.target.value as TipoAntecedente)}
            >
              {types.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`antecedentes.type.${value}`)}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            autoFocus
            multiline
            minRows={2}
            label={t('antecedentes.field.description')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {type === 'familiar' && (
            <TextField
              label={t('antecedentes.field.relationship')}
              placeholder={t('antecedentes.field.relationshipHint')}
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
            />
          )}

          <TextField
            type="number"
            label={t('antecedentes.field.year')}
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t('antecedentes.cancel')}</Button>
        <Button
          variant="contained"
          disabled={saving || description.trim() === ''}
          onClick={save}
        >
          {t('antecedentes.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
