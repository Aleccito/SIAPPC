import { useEffect, useState } from 'react'

/**
 * ¿Conviene enfocar solo un campo al cargar la pantalla?
 *
 * `autoFocus` en una pantalla completa es cómodo con teclado y molesto en un
 * móvil: al entrar salta el teclado en pantalla, se come media vista y tapa el
 * mensaje que explica qué hay que hacer, todo antes de que a nadie le haya dado
 * tiempo de leerlo.
 *
 * Se decide por `pointer: fine`, que es "hay un ratón o un lápiz", y no por el
 * ancho de la ventana: una tableta con teclado acoplado responde `fine` y ahí el
 * foco automático sí ayuda, mientras que un móvil en horizontal puede ser tan
 * ancho como un portátil y seguir teniendo teclado en pantalla.
 *
 * Se calcula en un efecto y no durante el render para que el primer render sea
 * igual en todas partes; en la práctica se resuelve antes de que el campo se
 * pinte.
 *
 * NO se usa en los diálogos: ahí el foco tiene que entrar en el diálogo sí o sí,
 * en cualquier dispositivo, o el teclado se queda detrás en la pantalla que el
 * diálogo tapa.
 */
export function useDesktopAutoFocus(): boolean {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(window.matchMedia('(pointer: fine)').matches)
  }, [])

  return allowed
}
