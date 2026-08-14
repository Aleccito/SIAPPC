import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { suscribirEventos } from '../../shared/api/alertStream'
import { listNotifications, markAllRead, markRead } from './api/notificationsApi'

// Consultas y mutaciones de la bandeja. Viven aquí y no junto a la campana ni a
// la pantalla porque un archivo que exporta componentes no puede exportar
// además hooks sin romper el Fast Refresh de Vite (regla
// react/only-export-components de oxlint), y porque las dos vistas comparten
// clave: marcar como leída en una actualiza el contador de la otra sin que
// ninguna sepa de la existencia de la otra.

/** Cuántas caben en el panel de la campana sin desplazarse. */
export const PREVIEW_SIZE = 5

/** Filas por página de la bandeja completa. */
export const PAGE_SIZE = 20

const RAIZ = ['notifications'] as const

export function useNotifications(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['notifications', page, pageSize],
    queryFn: () => listNotifications(page, pageSize),
    // Al pasar de página, seguir enseñando la anterior mientras llega la nueva:
    // sin esto la lista se vacía y la pantalla salta en cada clic.
    placeholderData: (anterior) => anterior,
  })
}

/**
 * Refresca la bandeja cuando el servidor avisa de que hay algo NUEVO PARA TI.
 *
 * Va por el flujo SSE que ya existe y NO por sondeo periódico, y la razón no es
 * el ahorro: es que el sondeo obliga a elegir entre dos cosas malas. Un
 * intervalo corto —los 15 s del tablero— es una petición cada quince segundos
 * por pestaña abierta y por usuario durante toda la guardia, casi siempre para
 * enterarse de que no hay nada; uno largo deja la campana mintiendo minutos
 * enteros, y una campana que va con retraso es exactamente la que un clínico
 * aprende a no mirar. El servidor ya sabe el instante en que la notificación se
 * creó y ya tiene una conexión abierta a esta pestaña para las alertas: pedirle
 * que lo diga cuesta un marco vacío.
 *
 * El evento no trae la notificación, solo el aviso de que la hay. Así el
 * contador y las filas salen siempre de `GET /notifications` y no hay dos
 * caminos por los que el mismo número pueda llegar distinto.
 *
 * Lo que el flujo NO cubre: lo ocurrido mientras la pestaña estuvo cerrada o
 * sin red. De eso se encarga la consulta normal, que se rehace al montar y al
 * volver el foco a la ventana.
 */
export function useNotificationStream(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    return suscribirEventos((evento) => {
      if (evento !== 'notificacion') return
      void queryClient.invalidateQueries({ queryKey: RAIZ })
    })
  }, [queryClient])
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markRead,
    // Se invalida la raíz y no la página concreta: marcar una cambia el
    // contador global y el orden (las no leídas van primero), así que la página
    // siguiente tampoco es ya la misma.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RAIZ }),
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RAIZ }),
  })
}
