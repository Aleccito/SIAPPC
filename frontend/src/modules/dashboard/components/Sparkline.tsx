import { Box } from '@mui/material'

const WIDTH = 120
const HEIGHT = 32

/**
 * Curva de tendencia en SVG en línea.
 *
 * No se agrega una librería de gráficas por esto: el proyecto no tiene ninguna
 * (ver frontend/package.json) y el monitor de cama ya dibuja su trazo con un
 * `path` a mano. Una serie de cincuenta puntos no justifica el bulto.
 *
 * `values` llega en orden cronológico ascendente.
 */
export function Sparkline({ values, color = 'currentColor' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  // Serie plana: sin rango no hay división posible, y la línea va al centro.
  const span = max - min || 1

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * WIDTH
      const y = HEIGHT - ((value - min) / span) * HEIGHT
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{ width: '100%', height: HEIGHT, display: 'block', color }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </Box>
  )
}
