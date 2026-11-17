import { request } from '../../../shared/api/http'

// Espejo de backend/src/services/aiAuto.ts (AnalisisIA).
export type AiAnalysis = {
  generatedAt: string
  severity: 'alta' | 'critica'
  model: string
  ideas: { title: string; rationale: string }[]
}

export type AiAnalysisResponse = {
  analysis: AiAnalysis | null
  disclaimer: string
}

/** Último análisis automático de IA del paciente. Requiere `notas_soap:crear`. */
export async function getAiAnalysis(patientId: string): Promise<AiAnalysisResponse> {
  return request<AiAnalysisResponse>(`/ai/assist/${encodeURIComponent(patientId)}`)
}
