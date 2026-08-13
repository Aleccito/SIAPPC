import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getToken } from '../../shared/api/http'

// Alertas empujadas por el servidor, sin esperar al siguiente sondeo.
//
// NO usa `EventSource`: esa API no deja poner cabeceras, así que el token
// tendría que viajar en la URL —donde acaba en los registros del servidor y del
// proxy—. Con `fetch` se manda el `Authorization` de siempre y se lee el cuerpo
// como flujo.
//
// A cambio hay que reconectar a mano: `EventSource` lo hace solo, `fetch` no.

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

/** Espera antes de reconectar. Ni tan corta que martillee, ni tanta que se pierda una alerta. */
const REINTENTO_MS = 3000

export function useAlertStream(): { ultima: AlertaEnVivo | null; descartar: () => void } {
  const [ultima, setUltima] = useState<AlertaEnVivo | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const control = new AbortController()
    let reintento: ReturnType<typeof setTimeout> | undefined
    let vivo = true

    async function escuchar() {
      const token = getToken()
      if (!token) return

      try {
        const respuesta = await fetch('/api/alerts/stream', {
          headers: { Authorization: `Bearer ${token}` },
          signal: control.signal,
        })
        // Sin permiso de `alertas` el servidor responde 403: no hay nada que
        // reintentar, y hacerlo sería martillear la API cada tres segundos.
        if (respuesta.status === 401 || respuesta.status === 403) return
        if (!respuesta.ok || !respuesta.body) throw new Error(String(respuesta.status))

        const lector = respuesta.body.getReader()
        const decodificador = new TextDecoder()
        let resto = ''

        while (vivo) {
          const { done, value } = await lector.read()
          if (done) break

          resto += decodificador.decode(value, { stream: true })
          // Los marcos van separados por una línea en blanco. Lo que quede a
          // medias se guarda para la siguiente vuelta: un marco puede llegar
          // partido en dos trozos de red.
          const marcos = resto.split('\n\n')
          resto = marcos.pop() ?? ''

          for (const marco of marcos) {
            // Los comentarios (`: latido`) mantienen viva la conexión y no traen datos.
            if (!marco.startsWith('event: alerta')) continue
            const datos = marco.split('\n').find((linea) => linea.startsWith('data: '))
            if (!datos) continue

            const alerta = JSON.parse(datos.slice(6)) as AlertaEnVivo
            setUltima(alerta)
            // El aviso trae lo justo para el cartel; las listas del tablero se
            // refrescan desde su fuente en vez de que cada widget adivine cómo
            // encajar este objeto en su propia forma.
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          }
        }
      } catch {
        // Corte de red, backend reiniciado, pestaña dormida. Se reintenta.
      }

      if (vivo && !control.signal.aborted) {
        reintento = setTimeout(() => void escuchar(), REINTENTO_MS)
      }
    }

    void escuchar()

    return () => {
      vivo = false
      control.abort()
      if (reintento) clearTimeout(reintento)
    }
  }, [queryClient])

  return { ultima, descartar: () => setUltima(null) }
}
