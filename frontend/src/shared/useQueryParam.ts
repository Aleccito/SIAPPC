import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Un trozo de estado de vista que vive en la barra de direcciones.
 *
 * Sustituye a `useState` en filtros, pestañas y paginación. Lo que se gana:
 *
 *  - La pantalla se puede ENVIAR. "Mira las camas críticas de UCI" pasa de ser
 *    una frase con instrucciones a ser un enlace. En un hospital eso es la
 *    diferencia entre explicar por teléfono qué hay que pulsar y pegar una URL.
 *  - Atrás vuelve al filtro anterior en vez de salir de la pantalla, que es lo
 *    que el botón parece prometer.
 *  - Recargar —o que se caiga la sesión y se vuelva a entrar— no borra dónde
 *    estabas.
 *
 * El valor por defecto NO se escribe en la URL: la dirección limpia es la de la
 * pantalla sin tocar, y así no aparecen `?unidad=&vista=grid` recién entrando.
 *
 * `replace: true` es deliberado: cada tecleo de un buscador dejaría una entrada
 * en el historial, y volver atrás obligaría a deshacer el texto letra a letra.
 *
 * El actualizador funcional de `setSearchParams` es lo que permite que varios de
 * estos convivan en la misma pantalla: cada uno toca su clave sobre el estado
 * más reciente en vez de sobreescribir la instantánea que leyó al renderizar.
 */
export function useQueryParam(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback

  const set = useCallback(
    (next: string) => {
      setParams(
        (current) => {
          const copy = new URLSearchParams(current)
          if (next === fallback) copy.delete(key)
          else copy.set(key, next)
          return copy
        },
        { replace: true },
      )
    },
    [key, fallback, setParams],
  )

  return [value, set]
}
