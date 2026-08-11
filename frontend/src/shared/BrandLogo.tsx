import { brandBlue } from './theme'

// Cruz médica con trazo de electrocardiograma. Va en SVG y no como imagen: se
// usa a 36 px en la barra lateral y a 16 px en el favicon, y así no hay que
// mantener un PNG por tamaño ni se ve borroso en pantallas de mucha densidad.
//
// Dos versiones, porque una sola no funciona en los dos fondos de la aplicación:
//
//   'light'  placa blanca, trazo azul  — para el contenido, que es blanco
//   'onBlue' placa azul, trazo blanco  — para la barra lateral y el panel del
//            login, que son azul marino: ahí la placa blanca era un recuadro
//            luminoso pegado en una superficie oscura
//
// El azul sale de `brandBlue` (shared/theme.ts), el mismo que usan los botones y
// el elemento activo del menú, para que no puedan desincronizarse.
const TILE_LIGHT = '#ffffff'
const OUTLINE_LIGHT = '#cfe0ef'
// Sobre la placa azul la cruz se dibuja en blanco translúcido: a plena opacidad
// competía con el trazo del pulso, que es lo que tiene que leerse primero.
const OUTLINE_ON_BLUE = 'rgba(255,255,255,0.45)'

// Cruz de esquinas redondeadas: márgenes en 4/44, brazo de 16 de ancho
// (16→32), radio 3. Las esquinas cóncavas van con barrido 0 y las convexas con
// 1, que es lo que les da el aspecto de placa recortada.
const CROSS =
  'M19 4 H29 A3 3 0 0 1 32 7 V13 A3 3 0 0 0 35 16 H41 A3 3 0 0 1 44 19 ' +
  'V29 A3 3 0 0 1 41 32 H35 A3 3 0 0 0 32 35 V41 A3 3 0 0 1 29 44 ' +
  'H19 A3 3 0 0 1 16 41 V35 A3 3 0 0 0 13 32 H7 A3 3 0 0 1 4 29 ' +
  'V19 A3 3 0 0 1 7 16 H13 A3 3 0 0 0 16 13 V7 A3 3 0 0 1 19 4 Z'

// Línea de base, complejo QRS y vuelta a la base. Cruza la cruz de lado a lado
// para que el pulso se lea como una sola pieza con ella.
const TRACE_POINTS = '9,24 18,24 20.5,17 23,31 25.5,19.5 27.5,24 39,24'

export function BrandLogo({
  size = 36,
  variant = 'light',
}: {
  size?: number
  variant?: 'light' | 'onBlue'
}) {
  const onBlue = variant === 'onBlue'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      // Decorativo: el nombre de la marca ya va en texto al lado, y repetirlo
      // aquí lo haría sonar dos veces en un lector de pantalla.
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="11" fill={onBlue ? brandBlue : TILE_LIGHT} />
      <path
        d={CROSS}
        fill="none"
        stroke={onBlue ? OUTLINE_ON_BLUE : OUTLINE_LIGHT}
        strokeWidth="1.6"
      />
      <polyline
        points={TRACE_POINTS}
        fill="none"
        stroke={onBlue ? '#ffffff' : brandBlue}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
