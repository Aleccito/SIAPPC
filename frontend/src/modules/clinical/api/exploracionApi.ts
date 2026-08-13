import { request } from '../../../shared/api/http'
import {
  REGIONES,
  TECNICAS,
  formularioVacio,
  type ExploracionForm,
  type Region,
  type Tecnica,
} from '../components/exploracionFisica'

// Exploración física contra `GET`/`PUT /historia/:pacienteId/exploracion-fisica`.
//
// El formulario habla en cadenas y en nombres en camelCase —es lo que teclea el
// usuario y lo que usan los componentes—; la API habla en números y en los
// valores del enum de la base. La traducción vive aquí y en ningún otro sitio,
// para que la pantalla no tenga que saber cómo se llama una región en MariaDB.

/** `cabezaCuello` en la pantalla, `cabeza_cuello` en la base. */
const REGION_API: Record<Region, string> = {
  cabezaCuello: 'cabeza_cuello',
  torax: 'torax',
  abdomen: 'abdomen',
  extremidadesSuperiores: 'extremidades_superiores',
  extremidadesInferiores: 'extremidades_inferiores',
  neurologico: 'neurologico',
}

const REGION_FORM = Object.fromEntries(
  REGIONES.map((region) => [REGION_API[region], region]),
) as Record<string, Region>

type HallazgoDto = {
  region: string
  technique: string
  state: 'normal' | 'anormal'
  text: string | null
}

export type ExploracionDto = {
  weightKg: number | null
  heightCm: number | null
  abdominalCm: number | null
  glasgow: number | null
  updatedAt: string | null
  findings: HallazgoDto[]
}

/** Número a campo de texto: `null` es campo vacío, no cero. */
const aTexto = (valor: number | null): string => (valor === null ? '' : String(valor))

/** Campo de texto a número: vacío es `null`, no cero. */
const aNumero = (texto: string): number | null => {
  const limpio = texto.trim()
  if (limpio === '') return null
  const valor = Number(limpio)
  return Number.isFinite(valor) ? valor : null
}

export function dtoAFormulario(dto: ExploracionDto): ExploracionForm {
  const form = formularioVacio()
  form.pesoKg = aTexto(dto.weightKg)
  form.tallaCm = aTexto(dto.heightCm)
  form.perimetroCm = aTexto(dto.abdominalCm)
  form.glasgow = aTexto(dto.glasgow)

  for (const hallazgo of dto.findings) {
    const region = REGION_FORM[hallazgo.region]
    const tecnica = hallazgo.technique as Tecnica
    if (!region || !TECNICAS.includes(tecnica)) continue
    form.regiones[region][tecnica] = { estado: hallazgo.state, texto: hallazgo.text ?? '' }
  }
  return form
}

function formularioADto(form: ExploracionForm) {
  const findings: HallazgoDto[] = []
  for (const region of REGIONES) {
    for (const tecnica of TECNICAS) {
      const hallazgo = form.regiones[region][tecnica]
      // Un hallazgo sin explorar NO se manda: guardarlo como `normal` sería
      // afirmar que se exploró y salió bien, que es lo contrario de no saberlo.
      if (hallazgo.estado === '') continue
      findings.push({
        region: REGION_API[region],
        technique: tecnica,
        state: hallazgo.estado,
        text: hallazgo.texto.trim() === '' ? null : hallazgo.texto.trim(),
      })
    }
  }

  return {
    weightKg: aNumero(form.pesoKg),
    heightCm: aNumero(form.tallaCm),
    abdominalCm: aNumero(form.perimetroCm),
    glasgow: aNumero(form.glasgow),
    findings,
  }
}

export async function getExploracion(pacienteId: string): Promise<ExploracionDto> {
  return request<ExploracionDto>(`/historia/${pacienteId}/exploracion-fisica`)
}

export async function saveExploracion(
  pacienteId: string,
  form: ExploracionForm,
): Promise<ExploracionDto> {
  return request<ExploracionDto>(`/historia/${pacienteId}/exploracion-fisica`, {
    method: 'PUT',
    body: JSON.stringify(formularioADto(form)),
  })
}
