// Piezas puras del asistente IA (sin base, Redis ni LLM) para poder probarlas.

import { z } from "zod";

export const ideaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  rationale: z.string().trim().min(1).max(1000),
});

export const ideasSchema = z.object({ ideas: z.array(ideaSchema).min(1) });

export type Idea = z.infer<typeof ideaSchema>;

// Los modelos pequeños no siempre respetan la forma pedida: a veces usan las
// claves en español, devuelven el arreglo suelto o dejan una coma colgando.
const TITULO = ["title", "titulo", "título", "hipotesis", "hipótesis", "nombre"];
const MOTIVO = ["rationale", "justificacion", "justificación", "razon", "razón", "motivo", "explicacion", "explicación"];

function primero(obj: Record<string, unknown>, claves: string[]): unknown {
  for (const k of claves) if (obj[k] !== undefined) return obj[k];
  return undefined;
}

function normalizar(valor: unknown): unknown {
  const lista = Array.isArray(valor)
    ? valor
    : valor && typeof valor === "object"
      ? (primero(valor as Record<string, unknown>, ["ideas", "hipotesis", "hipótesis"]) ?? [])
      : [];
  if (!Array.isArray(lista)) return { ideas: [] };
  return {
    ideas: lista.map((i) => {
      const o = (i && typeof i === "object" ? i : {}) as Record<string, unknown>;
      return { title: primero(o, TITULO), rationale: primero(o, MOTIVO) ?? "" };
    }).filter((i) => typeof i.title === "string" && i.title.trim() !== "")
      .map((i) => ({ ...i, rationale: typeof i.rationale === "string" && i.rationale.trim() ? i.rationale : "—" })),
  };
}

/**
 * Saca las ideas de la respuesta del LLM, o null si no hay ninguna utilizable.
 * Tolera ```json ... ```, texto alrededor, arreglo suelto, claves en español y
 * comas colgantes. Con 1 idea basta: mejor algo que nada para el médico.
 */
export function extraerIdeas(texto: string): Idea[] | null {
  const ini = texto.search(/[[{]/);
  const fin = Math.max(texto.lastIndexOf("}"), texto.lastIndexOf("]"));
  if (ini < 0 || fin < ini) return null;
  const json = texto.slice(ini, fin + 1).replace(/,\s*([}\]])/g, "$1");
  try {
    const r = ideasSchema.safeParse(normalizar(JSON.parse(json)));
    return r.success ? r.data.ideas.slice(0, 4) : null;
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
