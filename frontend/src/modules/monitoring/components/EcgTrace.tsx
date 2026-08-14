import { Box } from '@mui/material'

// Trazo de ECG ILUSTRATIVO: repite un complejo PQRST fijo. No dibuja la señal
// real, y no puede: `GET /sensors/readings` entrega una muestra por segundo y un
// ECG son ~250 por segundo. La Pi ni siquiera publica la onda —el backend guarda
// una fila por lectura en `lectura` y la onda no entra en ese modelo—, que es
// también la razón por la que la ingesta no evalúa alertas sobre `ecg`.
//
// Vive aquí y no dentro de VitalsMonitor porque ahora lo pintan dos pantallas —
// el monitor de una cama y las tarjetas de la central— y dos copias del mismo
// `path` acabarían siendo dos trazos distintos.
//
// Se marca `aria-hidden`: no aporta información: quien no ve la pantalla no se
// pierde nada, y anunciarlo sugeriría que hay una onda que leer.
const ECG_PATH =
  'M0 40 H60 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H140 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H240 ' +
  'l10 -6 l8 22 l10 -46 l9 34 l7 -4 H340 l10 -6 l8 22 l10 -46 l9 34 l7 -4 H480'

export function EcgTrace({ color, height = 96 }: { color: string; height?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 480 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{ width: '100%', height, display: 'block' }}
    >
      <path d={ECG_PATH} fill="none" stroke={color} strokeWidth="1.5" />
    </Box>
  )
}
