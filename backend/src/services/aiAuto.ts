// Análisis automático con IA para pacientes críticos.
//
// Cuando la ingesta crea una alerta `alta` o `critica` para un paciente, se
// encola un análisis: el LLM local propone al menos dos hipótesis de qué podría
// tener el paciente según sus datos. El resultado vive SOLO en Redis (o en
// memoria sin REDIS_URL) con TTL; no se escribe nada en la base ni en el
// expediente.
//
// Los datos llegan seguido y pueden generar muchas alertas, así que:
// - Enfriamiento por paciente (AI_AUTO_COOLDOWN_SECONDS), salvo que la
//   severidad escale de `alta` a `critica`.
// - Una sola consulta al LLM a la vez y, como mucho, un pendiente por paciente.
// - Nunca bloquea ni hace fallar la ingesta: todo es fire-and-forget.
//
// El enfriamiento y la cola son de este proceso: con varias instancias del
// backend, cada una analizaría por su cuenta.

import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DATOS_NO_INSTRUCCIONES, llm, patientContext } from "../lib/clinicalAi.ts";
import { redis } from "../lib/redis.ts";
import { env } from "../env.ts";
import { debeDisparar, type Severidad } from "./aiCooldown.ts";

export { debeDisparar, type Severidad };

// AJUSTAR: el usuario afina aquí qué debe/no debe generar la IA.
const AUTO_SYSTEM = `Eres un asistente de apoyo a la decisión clínica. Hablas con un médico.
El paciente acaba de generar una alerta de severidad alta o crítica en su monitoreo.
Con SOLO los datos que se te dan, propón entre 2 y 4 hipótesis de qué podría tener el paciente, de más a menos probable.
No inventes datos. ${DATOS_NO_INSTRUCCIONES}
Responde ÚNICAMENTE con JSON válido, en español, con esta forma:
{"ideas":[{"title":"hipótesis breve","rationale":"justificación breve basada en los datos"}]}`;

const ideaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  rationale: z.string().trim().min(1).max(1000),
});

const ideasSchema = z.object({ ideas: z.array(ideaSchema).min(2) });

const analisisSchema = z.object({
  generatedAt: z.string(),
  severity: z.enum(["alta", "critica"]),
  model: z.string(),
  ideas: z.array(ideaSchema),
});

export type AnalisisIA = z.infer<typeof analisisSchema>;

const NAMESPACE = "siappc-ai:auto:";
const ultimoDisparo = new Map<number, { at: number; severity: Severidad }>();
const pendientes = new Map<number, { hospitalId: number; severity: Severidad }>();
const memoria = new Map<number, { valor: AnalisisIA; expira: number }>();
let corriendo = false;

/** Encola un análisis para el paciente. Nunca lanza ni espera al LLM. */
export function encolarAnalisisIA(
  patientId: number,
  hospitalId: number,
  severity: Severidad,
  logger: FastifyBaseLogger,
): void {
  try {
    const now = Date.now();
    const cooldownMs = env.aiAuto.cooldownSeconds * 1000;
    podar(now, cooldownMs);
    if (!debeDisparar(ultimoDisparo.get(patientId), severity, now, cooldownMs)) return;
    ultimoDisparo.set(patientId, { at: now, severity });

    // Sin acumulación: si ya hay uno pendiente, solo se sube su severidad.
    const pendiente = pendientes.get(patientId);
    if (pendiente) {
      if (severity === "critica") pendiente.severity = "critica";
      return;
    }
    pendientes.set(patientId, { hospitalId, severity });
    void drenar(logger);
  } catch (err: unknown) {
    logger.error({ patientId, reason: err instanceof Error ? err.name : "desconocido" }, "ai_auto: no se pudo encolar");
  }
}

// Como mucho una pasada por minuto: quita disparos ya fuera de enfriamiento y
// análisis en memoria expirados, para que los mapas no crezcan sin límite.
let ultimaPoda = 0;
function podar(now: number, cooldownMs: number): void {
  if (now - ultimaPoda < 60_000) return;
  ultimaPoda = now;
  for (const [id, d] of ultimoDisparo) {
    if (now - d.at >= cooldownMs && !pendientes.has(id)) ultimoDisparo.delete(id);
  }
  for (const [id, m] of memoria) {
    if (m.expira <= now) memoria.delete(id);
  }
}

async function drenar(logger: FastifyBaseLogger): Promise<void> {
  if (corriendo) return;
  corriendo = true;
  try {
    for (const [patientId, job] of pendientes) {
      pendientes.delete(patientId);
      try {
        await analizar(patientId, job.hospitalId, job.severity);
        logger.info({ patientId, severity: job.severity }, "ai_auto: análisis guardado");
      } catch (err: unknown) {
        // Sin marca de disparo: la próxima alerta del paciente reintenta en
        // vez de esperar todo el enfriamiento sin análisis.
        ultimoDisparo.delete(patientId);
        // Sin contenido clínico en el log: solo el tipo de error.
        logger.error({ patientId, reason: err instanceof Error ? err.name : "desconocido" }, "ai_auto: análisis fallido");
      }
    }
  } finally {
    corriendo = false;
  }
}

const parser = new StringOutputParser();

async function pedirIdeas(context: string): Promise<AnalisisIA["ideas"] | null> {
  const texto = await llm.pipe(parser).invoke([
    ["system", AUTO_SYSTEM],
    ["human", `CONTEXTO DEL PACIENTE:\n<datos_paciente>\n${context}\n</datos_paciente>`],
  ]);
  // Los modelos pequeños suelen envolver el JSON en ```json ... ```.
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

async function analizar(patientId: number, hospitalId: number, severity: Severidad): Promise<void> {
  const context = await patientContext(patientId, hospitalId);
  const ideas = (await pedirIdeas(context)) ?? (await pedirIdeas(context));
  if (!ideas) throw new Error("JSON inválido del LLM");
  await guardar(patientId, {
    generatedAt: new Date().toISOString(),
    severity,
    model: env.llm.model,
    ideas,
  });
}

async function guardar(patientId: number, valor: AnalisisIA): Promise<void> {
  const ttl = env.aiAuto.ttlSeconds;
  if (redis) {
    await redis.set(`${NAMESPACE}${patientId}`, JSON.stringify(valor), "EX", ttl);
    return;
  }
  memoria.set(patientId, { valor, expira: Date.now() + ttl * 1000 });
}

/** Último análisis vigente del paciente, o null si no hay o expiró. */
export async function leerAnalisisIA(patientId: number): Promise<AnalisisIA | null> {
  if (redis) {
    const hit = await redis.get(`${NAMESPACE}${patientId}`);
    if (!hit) return null;
    try {
      const r = analisisSchema.safeParse(JSON.parse(hit));
      return r.success ? r.data : null;
    } catch {
      return null;
    }
  }
  const m = memoria.get(patientId);
  if (!m) return null;
  if (m.expira <= Date.now()) {
    memoria.delete(patientId);
    return null;
  }
  return m.valor;
}
