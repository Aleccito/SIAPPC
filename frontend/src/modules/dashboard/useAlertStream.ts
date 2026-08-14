import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { suscribirEventos } from '../../shared/api/alertStream'

// Alertas empujadas por el servidor, sin esperar al siguiente sondeo.
//
// La conexión ya no la abre este hook: la sirve `shared/api/alertStream.ts`,
// que la comparte con la campana del armazón. Aquí queda solo lo propio del
// tablero —quedarse con la última alerta para el cartel— porque dos `fetch` al
// mismo flujo por pestaña era el doble de conexiones para el mismo dato.

export type AlertaEnVivo = {
  alertId: string
  device: string
  patientId: string | null
  patientName: string | null
  variable: string
  value: number
  unit: string
  severity: 'baja' | 'media' | 'alta' | 'critica'
  type: string
  message: string | null
  at: string
}

export function useAlertStream(): { ultima: AlertaEnVivo | null; descartar: () => void } {
  const [ultima, setUltima] = useState<AlertaEnVivo | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    return suscribirEventos((evento, datos) => {
      if (evento !== 'alerta') return
      setUltima(datos as AlertaEnVivo)
      // El aviso trae lo justo para el cartel; las listas del tablero se
      // refrescan desde su fuente en vez de que cada widget adivine cómo
      // encajar este objeto en su propia forma.
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      // Y la central de monitoreo, que deriva el estado de cada cama de la peor
      // alerta abierta: una alerta nueva cambia el color del borde, y esperar al
      // siguiente sondeo sería enseñar en verde una cama por la que el servidor
      // acaba de avisar.
      queryClient.invalidateQueries({ queryKey: ['monitoring'] })
    })
  }, [queryClient])

  return { ultima, descartar: () => setUltima(null) }
}
