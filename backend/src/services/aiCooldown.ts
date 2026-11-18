// Regla de enfriamiento del análisis IA automático (ver services/aiAuto.ts).
// Módulo sin dependencias para poder probarlo sin base, Redis ni LLM.

export type Severidad = "alta" | "critica";

/**
 * Decide si una alerta nueva debe encolar un análisis, dado el último disparo
 * de ese paciente.
 */
export function debeDisparar(
  previo: { at: number; severity: Severidad } | undefined,
  severity: Severidad,
  now: number,
  cooldownMs: number,
): boolean {
  if (!previo) return true;
  if (previo.severity === "alta" && severity === "critica") return true;
  return now - previo.at >= cooldownMs;
}
