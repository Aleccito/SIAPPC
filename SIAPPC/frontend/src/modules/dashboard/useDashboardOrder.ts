import { useCallback, useMemo, useState } from 'react'

const STORAGE_PREFIX = 'dashboard.order.'

/**
 * Orden de los widgets, por usuario.
 *
 * Es la personalización ligera que pide el punto 7 de la especificación, y sale
 * casi gratis del catálogo: el tablero ya es una lista de identificadores, así
 * que personalizarlo es reordenar esa lista y guardarla.
 *
 * Vive en localStorage y no en el servidor a propósito: no hay tabla de
 * preferencias, y añadirla es esquema —que este cambio no toca—. La
 * consecuencia es que el orden no viaja entre navegadores; el precio de la
 * alternativa era una migración.
 *
 * `defaults` manda sobre lo guardado: si el catálogo cambia, los widgets nuevos
 * aparecen y los que ya no existen se caen solos, en vez de dejar el tablero
 * congelado en la versión del día que alguien lo reordenó.
 */
export function useDashboardOrder(storageKey: string, defaults: string[]) {
  const key = `${STORAGE_PREFIX}${storageKey}`

  const [stored, setStored] = useState<string[] | null>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : null
    } catch {
      // Un valor corrupto no puede dejar el tablero en blanco: se ignora.
      return null
    }
  })

  const order = useMemo(() => {
    if (!stored) return defaults
    const known = stored.filter((id) => defaults.includes(id))
    const added = defaults.filter((id) => !known.includes(id))
    return [...known, ...added]
  }, [stored, defaults])

  const move = useCallback(
    (id: string, delta: -1 | 1) => {
      const from = order.indexOf(id)
      const to = from + delta
      if (from < 0 || to < 0 || to >= order.length) return

      const next = [...order]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved!)

      setStored(next)
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // Almacenamiento lleno o bloqueado: el orden vale para esta sesión.
      }
    },
    [key, order],
  )

  const reset = useCallback(() => {
    setStored(null)
    localStorage.removeItem(key)
  }, [key])

  return { order, move, reset, customized: stored !== null }
}
