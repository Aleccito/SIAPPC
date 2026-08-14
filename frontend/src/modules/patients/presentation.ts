// Cómo se derivan al pintar los datos del paciente que la base NO guarda.
//
// Vive en un módulo sin componentes porque lo usan la cabecera del expediente
// y la lista de pacientes, y porque un archivo que exporta componentes no puede
// exportar además funciones sin romper el Fast Refresh de Vite (regla
// react/only-export-components de oxlint).

/**
 * Edad en años cumplidos a partir de la fecha de nacimiento.
 *
 * La edad NO se guarda en ninguna columna a propósito: guardada envejece mal
 * —el número queda congelado el día que se escribió— y `paciente` solo tiene la
 * fecha civil de nacimiento, que es el dato que no caduca.
 *
 * La fecha llega como "1990-05-14T00:00:00-05:00". Se parte a mano en vez de
 * pasarla por `new Date`, que leería la parte de fecha como medianoche UTC y
 * restaría un día en cualquier huso negativo: aquí solo se comparan tres
 * números.
 */
export function ageFrom(birthDate: string): number | null {
  const [year, month, day] = birthDate.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null

  const today = new Date()
  let age = today.getFullYear() - year
  // Aún no ha sido su cumpleaños este año.
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
    age -= 1
  }
  return age >= 0 ? age : null
}

/**
 * Iniciales para el avatar. No hay foto de paciente en ninguna tabla y no se va
 * a inventar una: las iniciales son lo único que se puede pintar sin mentir
 * sobre quién es la persona del renglón.
 *
 * Dos como mucho: con nombres compuestos y dos apellidos, cuatro letras no caben
 * en el círculo y dejan de leerse como iniciales.
 */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const first = words[0]!.charAt(0)
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : ''
  return (first + last).toUpperCase()
}
