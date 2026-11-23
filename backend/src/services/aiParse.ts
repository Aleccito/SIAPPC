// Piezas puras del asistente IA (sin base, Redis ni LLM) para poder probarlas.

import { z } from "zod";

export const ideaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  rationale: z.string().trim().min(1).max(1000),
});

export const ideasSchema = z.object({ ideas: z.array(ideaSchema).min(2) });

export type Idea = z.infer<typeof ideaSchema>;

/**
 * Saca las ideas de la respuesta del LLM, o null si no es JSON válido con al
 * menos 2. Los modelos pequeños suelen envolver el JSON en ```json ... ```.
 */
export function extraerIdeas(texto: string): Idea[] | null {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio < 0 || fin < inicio) return null;
  try {
    const r = ideasSchema.safeParse(JSON.parse(texto.slice(inicio, fin + 1)));
    return r.success ? r.data.ideas : null;
  } catch {
    return null;
  }
}

/** Corta un texto libre a `max` caracteres, marcando el recorte. */
export function recortar(texto: string, max: number): string {
  return texto.length <= max ? texto : `${texto.slice(0, max)}… [recortado]`;
}

// Topes del contexto que se manda al modelo: un modelo de 4B con ventana chica
// pierde las instrucciones si el expediente es largo.
export const MAX_CAMPO = 600;
export const MAX_CONTEXTO = 6_000;
