import { listMonitoredBeds } from './monitoringApi'
import { listSoapNotes } from '../../clinical/api/clinicalApi'
import { getPatient, listAssignments } from '../../patients/api/patientsApi'
import { ageFrom } from '../../patients/presentation'
import { clinicalState } from '../../dashboard/presentation'

// Ficha del paciente que ocupa la cama de un dispositivo.
//
// Antes esto era un objeto en duro con UN solo dispositivo (`RPI-01`), y
// cualquier otro equipo caía en `null`: la pantalla decía "este dispositivo no
// tiene paciente asignado" aunque en la base sí lo tuviera. Ahora se compone de
// tres llamadas reales, porque no hay un endpoint que devuelva esta ficha
// entera:
//
//   1. `GET /monitoring/beds` — del código de equipo al paciente, su cama y su
//      estado clínico. Es la única fuente que relaciona dispositivo con cama.
//   2. `GET /patients/:id` — grupo sanguíneo, contacto de emergencia, motivo de
//      consulta y fecha de nacimiento.
//   3. `GET /patients/:id/assignments` — quién está a cargo.
//
// CUATRO campos del diseño no existen en el esquema y salen en `null`, que la
// pantalla pinta como raya: diagnóstico principal, alergias, seguro médico y
// número de expediente con formato "PT-8821". No se inventan — un dato clínico
// falso en una ficha es peor que un hueco visible. Añadirlos es ampliar
// `paciente`, no tocar este archivo.

export type BedPatient = {
  bed: string
  name: string
  patientId: string
  /** null cuando la fecha de nacimiento no se puede interpretar. */
  age: number | null
  birthDate: string
  bloodType: string | null
  allergies: string[]
  /** Motivo de consulta: es lo que la base guarda. NO es un diagnóstico. */
  reason: string
  diagnosis: string | null
  doctor: string | null
  admittedAt: string
  emergencyContact: string | null
  insurance: string | null
  status: 'critico' | 'estable' | 'observacion'
}

export type SoapNote = {
  author: string
  at: string
  subjective: string
  objective: string
  assessment: string
  plan: string
}

// El eje clínico de la central usa `atencion`; esta pantalla lo llama
// `observacion`. Es el mismo estado con otro rótulo, así que se traduce aquí en
// vez de duplicar la regla que lo deriva de la peor alerta abierta.
const ESTADO: Record<string, BedPatient['status']> = {
  critico: 'critico',
  atencion: 'observacion',
  estable: 'estable',
}

/** `null` cuando el dispositivo no tiene paciente asignado: la pantalla lo dice. */
export async function getBedPatient(device: string): Promise<BedPatient | null> {
  const camas = await listMonitoredBeds()
  const cama = camas.find((item) => item.device === device)
  if (!cama || cama.patientId === null) return null

  // Las dos consultas restantes van en paralelo: ninguna depende de la otra y
  // esta pantalla se abre desde una alerta, con prisa.
  const [ficha, aCargo] = await Promise.all([
    getPatient(cama.patientId),
    listAssignments(cama.patientId).catch(() => []),
  ])

  return {
    bed: cama.bed,
    name: cama.patientName ?? ficha.name,
    patientId: ficha.document,
    age: ageFrom(ficha.birthDate),
    birthDate: ficha.birthDate,
    bloodType: ficha.bloodType,
    allergies: [],
    reason: ficha.reason,
    diagnosis: null,
    // Puede haber varios a cargo; se listan todos porque en una cama crítica
    // "quién responde" no es una sola persona.
    doctor: aCargo.length ? aCargo.map((a) => a.name).join(', ') : null,
    admittedAt: ficha.arrivedAt,
    emergencyContact: ficha.emergencyContact,
    insurance: null,
    status: ESTADO[clinicalState(cama.worstSeverity)] ?? 'estable',
  }
}

/**
 * La última nota SOAP del paciente de esa cama, o `null` si no tiene ninguna.
 *
 * Se muestra la más reciente por fecha, sea borrador o firmada: en la cabecera
 * de una cama interesa lo último que se escribió, no lo último que se validó.
 * El estado de la nota se ve en la pestaña de Notas SOAP, que es donde se
 * firma.
 *
 * Los cuatro apartados llegan como `null` cuando no se rellenaron —el esquema
 * los permite vacíos— y aquí se convierten en cadena vacía, que es lo que la
 * tarjeta sabe pintar.
 */
export async function getLatestSoapNote(device: string): Promise<SoapNote | null> {
  const camas = await listMonitoredBeds()
  const cama = camas.find((item) => item.device === device)
  if (!cama || cama.patientId === null) return null

  const notas = await listSoapNotes(cama.patientId)
  if (notas.length === 0) return null

  const ultima = [...notas].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0]!

  return {
    author: ultima.authorName,
    at: ultima.at,
    subjective: ultima.subjective ?? '',
    objective: ultima.objective ?? '',
    assessment: ultima.assessment ?? '',
    plan: ultima.plan ?? '',
  }
}
