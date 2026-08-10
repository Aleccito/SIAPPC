export type BedPatient = {
  bed: string
  name: string
  patientId: string
  age: number
  birthDate: string
  bloodType: string
  allergies: string[]
  diagnosis: string
  doctor: string
  admittedAt: string
  emergencyContact: string
  insurance: string
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

// PENDIENTE: ficha del paciente y nota SOAP de ejemplo. La tabla `paciente` del
// esquema guarda nombre, cédula, módulo y motivo de consulta, pero no
// diagnóstico principal, grupo sanguíneo, alergias, médico responsable ni
// seguro; y `historia_clinica` / `notas_soap` no tienen endpoint todavía.
// Conectarlo pide ampliar el esquema y añadir las rutas — la forma de estos
// tipos es la definitiva.
//
// Los signos vitales del monitor NO son de ejemplo: salen de
// `GET /sensors/readings` del dispositivo, que es la ingesta MQTT real.
const patients: Record<string, BedPatient> = {
  'RPI-01': {
    bed: 'C-03',
    name: 'María González',
    patientId: 'PT-8821',
    age: 67,
    birthDate: '1959-05-14',
    bloodType: 'A+ (Positivo)',
    allergies: ['Penicilina'],
    diagnosis: 'Insuficiencia Cardíaca Congestiva',
    doctor: 'Dr. Carlos Méndez',
    admittedAt: '2025-10-15',
    emergencyContact: 'Juan González — +52 55 1234 5678',
    insurance: 'IMSS — Póliza #4821903',
    status: 'critico',
  },
}

const notes: Record<string, SoapNote> = {
  'RPI-01': {
    author: 'Dr. Carlos Méndez',
    at: '2025-10-24T08:15:00Z',
    subjective: 'Disnea progresiva y dificultad para respirar en reposo.',
    objective: 'FC 134, SpO2 89%, estertores bilaterales.',
    assessment: 'Descompensación aguda ICC.',
    plan: 'Ajustar diurético IV, O2 por mascarilla.',
  },
}

/** `null` cuando el dispositivo no tiene paciente asignado: la pantalla lo dice. */
export async function getBedPatient(device: string): Promise<BedPatient | null> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return patients[device] ?? null
}

export async function getLatestSoapNote(device: string): Promise<SoapNote | null> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return notes[device] ?? null
}
