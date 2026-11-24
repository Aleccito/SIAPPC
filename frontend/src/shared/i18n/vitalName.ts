import { dictionaries, type StringKey } from './dictionary'

// Los sensores guardan la variable con un código corto (`hr`, `spo2`, `pa`…).
// En pantalla siempre va su nombre en español; un código desconocido se
// muestra tal cual para no ocultar el dato.
export function nombreVital(codigo: string): string {
  const key = `vital.${codigo}`
  return key in dictionaries.es ? dictionaries.es[key as StringKey] : codigo
}
