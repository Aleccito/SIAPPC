import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'
import { motion } from '../../../shared/theme'

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

// Ancho del patrón en unidades del viewBox. El trazo se pinta DOS veces, la
// segunda copia corrida justo este ancho, y el grupo se desplaza de 0 a -480:
// cuando la primera copia termina de salir, la segunda está exactamente donde
// estaba la primera al empezar, así que el bucle no tiene costura. El trazo vale
// 40 en los dos extremos, que es lo que hace que el empalme no dé un salto.
const PATTERN = 480

const sweep = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-${PATTERN}px); }
`

/**
 * @param animated Barrido continuo. Es la única señal de que el trazo está
 *   VIVO: sin lecturas recientes se queda quieto, y una línea congelada se lee
 *   de lejos como "este equipo no está mandando nada". Moverlo siempre diría lo
 *   contrario justo cuando importa que no.
 */
export function EcgTrace({
  color,
  height = 96,
  animated = false,
}: {
  color: string
  height?: number
  animated?: boolean
}) {
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${PATTERN} 80`}
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{ width: '100%', height, display: 'block' }}
    >
      <Box
        component="g"
        sx={{
          // `transform` sobre un <g>: es lo único que se anima, corre en el
          // compositor y no repinta nada. Con veinte tarjetas en la central eso
          // es la diferencia entre una pantalla de pared fluida y una que come
          // el hilo principal que también atiende el refresco de las cifras.
          // Sin esto, el navegador toma como caja de referencia el lienzo SVG
          // entero y no el trazo, y el origen de la transformación queda en un
          // sitio distinto en cada tarjeta según lo que mida su panel.
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: animated ? `${sweep} ${motion.sweep} linear infinite` : 'none',
          // Movimiento constante y periférico: es exactamente lo que marea a
          // quien pidió menos movimiento. Se queda el trazo, se va el barrido.
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <path d={ECG_PATH} fill="none" stroke={color} strokeWidth="1.5" />
        <path
          d={ECG_PATH}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          transform={`translate(${PATTERN} 0)`}
        />
      </Box>
    </Box>
  )
}
