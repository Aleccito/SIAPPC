import { ApiError, request, send } from '../../../shared/api/http'

// Espejo de backend/src/services/aiAuto.ts (AnalisisIA).
export type AiAnalysis = {
  generatedAt: string
  severity: 'alta' | 'critica' | 'solicitado'
  model: string
  ideas: { title: string; rationale: string }[]
}

export type AiAnalysisResponse = {
  analysis: AiAnalysis | null
  disclaimer: string
}

/** Último análisis automático de IA del paciente. Requiere `asistente_ia:ver`. */
export async function getAiAnalysis(patientId: string): Promise<AiAnalysisResponse> {
  return request<AiAnalysisResponse>(`/ai/assist/${encodeURIComponent(patientId)}`)
}

/** Genera ideas a pedido (botón del expediente). Tarda lo que tarde el LLM. */
export async function generateAiIdeas(patientId: string): Promise<AiAnalysisResponse> {
  return request<AiAnalysisResponse>(`/ai/assist/${encodeURIComponent(patientId)}/ideas`, {
    method: 'POST',
  })
}

export type AiAssistInput = {
  patientId: number
  symptoms?: string
  question?: string
}

export type AiStreamHandlers = {
  onStart?: (info: { model: string; disclaimer: string }) => void
  onChunk: (text: string) => void
}

/**
 * Consulta al asistente con la respuesta en streaming (POST /ai/assist/stream).
 * Resuelve al terminar; lanza ApiError si el servidor rechaza la consulta
 * (400/403/404/429) o si el LLM falla a mitad (503). Cancelable con `signal`.
 */
export async function streamAiAssist(
  input: AiAssistInput,
  handlers: AiStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const response = await send('/ai/assist/stream', {
    method: 'POST',
    body: JSON.stringify(input),
    signal,
  })
  if (!response.body) throw new ApiError(503, 'Respuesta sin cuerpo')

  const lector = response.body.getReader()
  const decodificador = new TextDecoder()
  let resto = ''
  let terminado = false

  const procesar = (marco: string) => {
    const lineas = marco.split('\n')
    const evento = lineas.find((l) => l.startsWith('event: '))?.slice(7).trim()
    const datos = lineas.find((l) => l.startsWith('data: '))?.slice(6)
    if (!evento || datos === undefined) return
    const valor = JSON.parse(datos) as Record<string, string>
    if (evento === 'inicio') handlers.onStart?.({ model: valor.model, disclaimer: valor.disclaimer })
    else if (evento === 'trozo') handlers.onChunk(valor.text)
    else if (evento === 'fin') terminado = true
    else if (evento === 'error') throw new ApiError(503, valor.error)
  }

  for (;;) {
    const { done, value } = await lector.read()
    if (done) break
    // Un marco puede llegar partido en dos trozos de red: lo incompleto espera.
    resto += decodificador.decode(value, { stream: true })
    const marcos = resto.split('\n\n')
    resto = marcos.pop() ?? ''
    for (const marco of marcos) procesar(marco)
  }
  if (!terminado) throw new ApiError(503, 'La respuesta de la IA se cortó')
}
