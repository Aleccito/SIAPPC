import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { listBedOccupancy, setBedCapacity } from '../api/admissionsApi'
import { ApiError } from '../../../shared/api/http'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { BedOccupancy } from '../types'

// Cuántas camas tiene cada unidad, como un número que se edita.
//
// Es la respuesta a "¿de cuántas camas dispone la UCI?", que es la pregunta que
// se hace al montar una unidad. Darlas de alta de una en una con su código
// sigue existiendo abajo, en la tabla: sirve para añadir UNA cama concreta, no
// para decir que hay doce.
//
// El campo arranca con el total que hay ahora y solo se envía si cambia, así
// que la tarjeta se puede mirar sin miedo a tocar nada.

/** Una unidad con su cifra editable. */
function UnitCapacity({
  occupancy,
  onSaved,
}: {
  occupancy: BedOccupancy
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [value, setValue] = useState(String(occupancy.total))

  const save = useMutation({
    mutationFn: (total: number) => setBedCapacity(occupancy.unitId, total),
    onSuccess: onSaved,
  })

  const total = Number(value)
  const valido = Number.isInteger(total) && total >= 0 && total <= 500
  // Reducir por debajo de las ocupadas lo rechaza el servidor con un 409, pero
  // se avisa antes: es mejor no dejar pulsar un botón que ya se sabe que va a
  // fallar que explicar el fallo después.
  const porDebajo = valido && total < occupancy.occupied
  const cambiado = valido && total !== occupancy.total

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'flex-start', flexWrap: 'wrap', rowGap: 1 }}
    >
      <Box sx={{ minWidth: 160, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {occupancy.unit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('beds.capacity.current', {
            occupied: String(occupancy.occupied),
            total: String(occupancy.total),
          })}
        </Typography>
      </Box>

      <TextField
        label={t('beds.capacity.field')}
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/[^0-9]/g, ''))}
        error={porDebajo}
        helperText={
          porDebajo
            ? t('beds.capacity.belowOccupied', { occupied: String(occupancy.occupied) })
            : undefined
        }
        size="small"
        sx={{ width: 120 }}
        slotProps={{ htmlInput: { inputMode: 'numeric', 'aria-label': occupancy.unit } }}
      />

      <Button
        variant="outlined"
        size="medium"
        onClick={() => save.mutate(total)}
        disabled={!cambiado || porDebajo || save.isPending}
      >
        {t('action.save')}
      </Button>

      {save.isError && (
        <Alert severity="error" sx={{ flexBasis: '100%' }}>
          {save.error instanceof ApiError ? save.error.message : t('beds.capacity.error')}
        </Alert>
      )}
    </Stack>
  )
}

export function BedCapacityCard({ onSaved }: { onSaved: () => void }) {
  const { t } = useLanguage()
  // La ocupación trae TODAS las unidades, incluidas las que aún no tienen
  // camas: son justamente las que hay que poder montar desde aquí.
  const occupancy = useQuery({ queryKey: ['bedOccupancy'], queryFn: listBedOccupancy })

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ height: 4, mb: 1 }}>{occupancy.isFetching && <LinearProgress />}</Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {t('beds.capacity.title')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('beds.capacity.hint')}
      </Typography>

      <Stack spacing={2.5} sx={{ mt: 2 }}>
        {occupancy.data?.map((unit) => (
          // La clave lleva el total: si el guardado cambia la cifra, React
          // remonta la fila y el campo arranca con el valor nuevo en vez de
          // quedarse enseñando el que se acaba de sustituir.
          <UnitCapacity key={`${unit.unitId}:${unit.total}`} occupancy={unit} onSaved={onSaved} />
        ))}
        {occupancy.data?.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('beds.capacity.noUnits')}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
