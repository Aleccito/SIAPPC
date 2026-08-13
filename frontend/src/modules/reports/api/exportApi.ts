import { getToken } from '../../../shared/api/http'

// Descarga de informes en CSV.
//
// No se puede usar un `<a href>` normal: la API exige la cabecera
// `Authorization`, y un enlace no la manda. Se pide el archivo con `fetch`, se
// convierte en blob y se dispara la descarga con un enlace temporal.
//
// El nombre del archivo lo decide el SERVIDOR en `Content-Disposition`. Aquí
// solo se lee: repetir el nombre en el navegador es garantizar que un día
// digan cosas distintas.

const NOMBRE_POR_DEFECTO = 'informe.csv'

function nombreDeCabecera(cabecera: string | null): string {
  if (!cabecera) return NOMBRE_POR_DEFECTO
  const encontrado = /filename="?([^"]+)"?/.exec(cabecera)
  return encontrado?.[1] ?? NOMBRE_POR_DEFECTO
}

export async function descargarActividadClinica(desde: string, hasta: string): Promise<void> {
  const token = getToken()
  const respuesta = await fetch(
    `/api/reports/actividad-clinica.csv?desde=${desde}&hasta=${hasta}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  )

  if (!respuesta.ok) {
    // El backend responde `{ error }` también aquí; se propaga tal cual para
    // que la pantalla enseñe el motivo y no un fallo genérico.
    const cuerpo = (await respuesta.json().catch(() => null)) as { error?: unknown } | null
    throw new Error(
      typeof cuerpo?.error === 'string' ? cuerpo.error : `Error ${respuesta.status}`,
    )
  }

  const blob = await respuesta.blob()
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreDeCabecera(respuesta.headers.get('Content-Disposition'))
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  // Sin esto el blob queda en memoria hasta que se recargue la página.
  URL.revokeObjectURL(url)
}
