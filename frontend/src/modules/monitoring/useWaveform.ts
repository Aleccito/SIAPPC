import { useEffect, useRef, useState } from 'react'
import { getToken } from '../../shared/api/http'

// La onda real de una cama, leída del flujo SSE del backend.
//
// No reutiliza `shared/api/alertStream.ts` a propósito: aquel es UNA conexión
// para toda la aplicación con varios oyentes, porque las alertas son las mismas
// para todos. Esto es lo contrario — una conexión por cama, la de la pantalla
// que se está mirando, y se cierra al cambiar de cama.

/** Segundos de onda que se conservan. Es lo que cabe en pantalla. */
const VENTANA_S = 4

/** Espera antes de reconectar. */
const REINTENTO_MS = 3000

/**
 * Si en este tiempo no llega ni un lote, se considera que el equipo no está
 * mandando onda. No es lo mismo que no tener conexión: el flujo puede estar
 * abierto y el equipo apagado, y hay que poder distinguirlo.
 */
const SIN_ONDA_MS = 3000

export type Onda = {
  /** Muestras más recientes, la última al final. Vacío mientras no llegue nada. */
  samples: number[]
  hz: number
  /** El flujo está abierto Y están llegando lotes. */
  live: boolean
}

export function useWaveform(device: string | null): Onda {
  const [samples, setSamples] = useState<number[]>([])
  const [hz, setHz] = useState(0)
  const [live, setLive] = useState(false)

  // El buffer vive en un ref y no en el estado: llega un lote por segundo y
  // cada uno traería un render del componente entero. El repintado del trazo lo
  // dispara el `setSamples` de abajo, que es lo único que necesita repintarse.
  const buffer = useRef<number[]>([])
  const ultimoLote = useRef<number>(0)

  useEffect(() => {
    if (!device) return

    buffer.current = []
    setSamples([])
    setLive(false)

    let cancelado = false
    let control: AbortController | null = null
    let reintento: ReturnType<typeof setTimeout> | undefined

    // Vigila el silencio. Sin esto, un equipo que se apaga deja el último trozo
    // de onda congelado en pantalla pareciendo una señal plana, que en un ECG
    // es un hallazgo clínico y no una ausencia de datos.
    const vigilante = setInterval(() => {
      if (Date.now() - ultimoLote.current > SIN_ONDA_MS) {
        setLive(false)
        if (buffer.current.length > 0) {
          buffer.current = []
          setSamples([])
        }
      }
    }, 1000)

    async function escuchar(): Promise<void> {
      const token = getToken()
      if (!token || cancelado) return

      const propio = new AbortController()
      control = propio

      try {
        const respuesta = await fetch(`/api/monitoring/${encodeURIComponent(device!)}/waveform`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: propio.signal,
        })
        // 403 sin permiso de monitoreo, 404 equipo de otro hospital. Ninguno se
        // arregla reintentando cada tres segundos.
        if (respuesta.status === 401 || respuesta.status === 403 || respuesta.status === 404) {
          return
        }
        if (!respuesta.ok || !respuesta.body) throw new Error(String(respuesta.status))

        const lector = respuesta.body.getReader()
        const decodificador = new TextDecoder()
        let resto = ''

        while (!propio.signal.aborted) {
          const { done, value } = await lector.read()
          if (done) break

          resto += decodificador.decode(value, { stream: true })
          const marcos = resto.split('\n\n')
          resto = marcos.pop() ?? ''

          for (const marco of marcos) {
            const lineaEvento = marco.split('\n').find((l) => l.startsWith('event: '))
            const lineaDatos = marco.split('\n').find((l) => l.startsWith('data: '))
            if (lineaEvento?.slice(7).trim() !== 'onda' || !lineaDatos) continue

            try {
              const lote = JSON.parse(lineaDatos.slice(6)) as { hz: number; samples: number[] }
              ultimoLote.current = Date.now()

              // Ventana deslizante: se añaden las nuevas y se tiran las que ya
              // no caben. El corte se hace aquí y no al dibujar para que el
              // array no crezca sin techo si nadie mira la pantalla.
              const tope = Math.max(1, Math.round(lote.hz * VENTANA_S))
              const siguiente = [...buffer.current, ...lote.samples]
              buffer.current = siguiente.slice(-tope)

              setHz(lote.hz)
              setSamples(buffer.current)
              setLive(true)
            } catch {
              // Un marco partido no puede tumbar el flujo.
            }
          }
        }
      } catch {
        // Corte de red, backend reiniciado, pestaña dormida.
      }

      if (!cancelado && !propio.signal.aborted) {
        reintento = setTimeout(() => void escuchar(), REINTENTO_MS)
      }
    }

    void escuchar()

    return () => {
      cancelado = true
      clearInterval(vigilante)
      control?.abort()
      if (reintento) clearTimeout(reintento)
    }
  }, [device])

  return { samples, hz, live }
}
