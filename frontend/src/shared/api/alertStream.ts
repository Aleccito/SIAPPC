import { getToken } from './http'

// Una sola conexión SSE para toda la aplicación, con varios oyentes.
//
// Antes el flujo lo abría directamente el hook del tablero. Al aparecer la
// campana —que está en el armazón y por tanto SIEMPRE montada— había dos
// consumidores del mismo `/api/alerts/stream`, y cada uno con su `fetch` son
// dos conexiones abiertas por pestaña: el doble de descriptores en el backend y
// en nginx, y dos latidos donde basta uno. Este módulo es el multiplexor: una
// conexión, y los marcos se reparten.
//
// NO usa `EventSource`: esa API no deja poner cabeceras y obligaría a mandar el
// token en la URL, donde acaba en los registros del servidor y del proxy. Con
// `fetch` viaja el `Authorization` de siempre. El precio es reconectar a mano.

/** Espera antes de reconectar. Ni tan corta que martillee, ni tanta que se pierda una alerta. */
const REINTENTO_MS = 3000

type Oyente = (evento: string, datos: unknown) => void

const oyentes = new Set<Oyente>()

// Estado del bucle. Vive en el módulo y no en un hook a propósito: es el
// recurso compartido, y montar o desmontar un componente no debe reiniciarlo.
let control: AbortController | null = null
let reintento: ReturnType<typeof setTimeout> | undefined
let corriendo = false

function repartir(evento: string, datos: unknown): void {
  // Copia del conjunto: un oyente que se da de baja dentro de su propia
  // llamada modificaría el Set mientras se recorre.
  for (const oyente of [...oyentes]) oyente(evento, datos)
}

function procesarMarco(marco: string): void {
  // Los comentarios (`: latido`) mantienen viva la conexión y no traen datos.
  const lineaEvento = marco.split('\n').find((linea) => linea.startsWith('event: '))
  const lineaDatos = marco.split('\n').find((linea) => linea.startsWith('data: '))
  if (!lineaEvento || !lineaDatos) return

  try {
    repartir(lineaEvento.slice(7).trim(), JSON.parse(lineaDatos.slice(6)))
  } catch {
    // Un marco partido o ilegible no puede tumbar el flujo entero: el siguiente
    // llega en unos segundos.
  }
}

async function escuchar(): Promise<void> {
  const token = getToken()
  // Sin sesión no hay nada que escuchar, y reintentar cada tres segundos
  // mientras alguien está en la pantalla de acceso es martillear por nada.
  if (!token || oyentes.size === 0) {
    corriendo = false
    return
  }

  const propio = new AbortController()
  control = propio

  try {
    const respuesta = await fetch('/api/alerts/stream', {
      headers: { Authorization: `Bearer ${token}` },
      signal: propio.signal,
    })
    // Sin permiso de `alertas` el servidor responde 403: no hay nada que
    // reintentar, y hacerlo sería martillear la API cada tres segundos.
    if (respuesta.status === 401 || respuesta.status === 403) {
      corriendo = false
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
      // Los marcos van separados por una línea en blanco. Lo que quede a medias
      // se guarda para la siguiente vuelta: un marco puede llegar partido en
      // dos trozos de red.
      const marcos = resto.split('\n\n')
      resto = marcos.pop() ?? ''
      for (const marco of marcos) procesarMarco(marco)
    }
  } catch {
    // Corte de red, backend reiniciado, pestaña dormida. Se reintenta.
  }

  if (propio.signal.aborted || oyentes.size === 0) {
    corriendo = false
    return
  }
  reintento = setTimeout(() => void escuchar(), REINTENTO_MS)
}

/**
 * Escucha los marcos del flujo. Devuelve la función que cancela la suscripción.
 *
 * El primer oyente abre la conexión y el último la cierra: en desarrollo, con
 * StrictMode montando dos veces, el conteo es lo que evita que la conexión se
 * quede huérfana o se abra por duplicado.
 */
export function suscribirEventos(oyente: Oyente): () => void {
  oyentes.add(oyente)

  if (!corriendo) {
    corriendo = true
    void escuchar()
  }

  return () => {
    oyentes.delete(oyente)
    if (oyentes.size > 0) return

    control?.abort()
    control = null
    if (reintento) clearTimeout(reintento)
    reintento = undefined
    corriendo = false
  }
}
