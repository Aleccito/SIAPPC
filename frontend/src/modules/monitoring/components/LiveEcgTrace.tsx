import { useMemo } from 'react'
import { Box } from '@mui/material'

// El trazo de la señal REAL del equipo.
//
// A diferencia de `EcgTrace`, aquí no hay ningún dibujo prefabricado: cada punto
// es una muestra que midió el AD8232 y viajó por MQTT. Por eso este componente
// no anima nada — el movimiento lo produce que lleguen muestras nuevas.
//
// Se marca `aria-hidden` como el otro: una curva no se puede leer en voz alta, y
// anunciarla haría creer que hay algo que escuchar. Las cifras de al lado son la
// versión legible de lo mismo.

/**
 * Escala vertical: las muestras se normalizan contra SU PROPIO mínimo y máximo
 * en la ventana visible, no contra un rango fijo de voltaje.
 *
 * El AD8232 sale centrado en VCC/2 y su amplitud depende de la ganancia, de los
 * electrodos y de la persona. Con un rango fijo, un montaje daría una línea
 * plana en el centro y otro se saldría de la caja. Normalizando, la forma
 * siempre se ve.
 *
 * La contrapartida, y por eso el trazo NO es diagnóstico: se pierde la escala
 * absoluta. La altura de una onda aquí no es milivoltios, es "lo alto que fue
 * comparado con el resto de estos cuatro segundos".
 */
function normalizar(samples: number[], alto: number): string {
  if (samples.length < 2) return ''

  let min = samples[0]!
  let max = samples[0]!
  for (const valor of samples) {
    if (valor < min) min = valor
    if (valor > max) max = valor
  }

  // Señal plana: sin rango, dividir daría infinito. Se dibuja la línea en medio,
  // que es exactamente lo que hay.
  const rango = max - min
  const medio = alto / 2
  const margen = alto * 0.1
  const util = alto - margen * 2

  const paso = 100 / (samples.length - 1)
  return samples
    .map((valor, i) => {
      const x = (i * paso).toFixed(2)
      const y =
        rango === 0
          ? medio
          : // Invertido: en SVG la Y crece hacia abajo y una onda R apunta arriba.
            alto - margen - ((valor - min) / rango) * util
      return `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function LiveEcgTrace({
  samples,
  color,
  height = 96,
}: {
  samples: number[]
  color: string
  height?: number
}) {
  // El `path` se recalcula una vez por lote, no en cada render del padre: la
  // ronda repinta su tarjeta cada 5 s por el sondeo de las cifras, y rehacer
  // cientos de puntos en cada uno sería trabajo tirado.
  const d = useMemo(() => normalizar(samples, 100), [samples])

  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{ width: '100%', height, display: 'block' }}
    >
      {d && (
        <path
          d={d}
          fill="none"
          stroke={color}
          // El grosor se escala con el viewBox estirado; 0.8 da un trazo fino y
          // parejo con `preserveAspectRatio="none"`.
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      )}
    </Box>
  )
}
