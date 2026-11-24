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
// Con varias instancias del backend, el enfriamiento local filtra el grueso y
// un candado en Redis (SET NX por paciente y severidad) evita que dos
// instancias analicen al mismo paciente a la vez. Sin Redis no hay candado:
// solo vale para una instancia.

import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DATOS_NO_INSTRUCCIONES, llm, patientContext } from "../lib/clinicalAi.ts";
import { redis } from "../lib/redis.ts";
import { env } from "../env.ts";
import { debeDisparar, type Severidad } from "./aiCooldown.ts";
import { extraerIdeas, ideaSchema } from "./aiParse.ts";

export { debeDisparar, type Severidad };

// Subir al cambiar AUTO_SYSTEM: viaja con cada análisis para comparar resultados.
export const PROMPT_VERSION = "auto-v2";

// AJUSTAR: el usuario afina aquí qué debe/no debe generar la IA.
const AUTO_SYSTEM = `Eres un asistente de apoyo a la decisión clínica. Hablas con un médico.
Con SOLO los datos que se te dan, propón entre 2 y 3 hipótesis de qué podría tener el paciente, de más a menos probable.
Sé puntual y directo: el médico lo lee de un vistazo.
- "title": máximo 6 palabras.
- "rationale": máximo 15 palabras, citando el dato que lo sostiene (p. ej. "SpO2 86 %, FR 28").
No inventes datos. ${DATOS_NO_INSTRUCCIONES}
Responde ÚNICAMENTE con JSON válido, en español, con esta forma:
{"ideas":[{"title":"hipótesis breve","rationale":"dato que lo sostiene"}]}`;

const analisisSchema = z.object({
  generatedAt: z.string(),
  // `solicitado`: lo pidió el médico desde el expediente, sin alerta de por medio.
  severity: z.enum(["alta", "critica", "solicitado"]),
  model: z.string(),
  // Opcional: los análisis guardados antes de existir el campo no lo traen.
  promptVersion: z.string().optional(),
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
      const candado = `${NAMESPACE}lock:${patientId}:${job.severity}`;
      try {
        if (!(await tomarCandado(candado))) {
          logger.info({ patientId }, "ai_auto: otra instancia ya lo analiza");
          continue;
        }
        await analizar(patientId, job.hospitalId, job.severity);
        logger.info({ patientId, severity: job.severity }, "ai_auto: análisis guardado");
      } catch (err: unknown) {
        // Sin marca de disparo: la próxima alerta del paciente reintenta en
        // vez de esperar todo el enfriamiento sin análisis.
        ultimoDisparo.delete(patientId);
        await soltarCandado(candado);
        // Sin contenido clínico en el log: solo el tipo de error.
        logger.error({ patientId, reason: err instanceof Error ? err.name : "desconocido" }, "ai_auto: análisis fallido");
      }
    }
  } finally {
    corriendo = false;
  }
}

/** true si este proceso puede analizar; sin Redis siempre true. */
async function tomarCandado(clave: string): Promise<boolean> {
  if (!redis) return true;
  try {
    // Dura lo que el enfriamiento: cubre el análisis y evita que otra
    // instancia relance al mismo paciente en esa ventana.
    const ok = await redis.set(clave, "1", "EX", Math.max(env.aiAuto.cooldownSeconds, 1), "NX");
    return ok === "OK";
  } catch {
    // Redis caído: mejor analizar de más que dejar al paciente sin análisis.
    return true;
  }
}

async function soltarCandado(clave: string): Promise<void> {
  if (!redis) return;
  await redis.del(clave).catch(() => undefined);
}

const parser = new StringOutputParser();

async function pedirIdeas(context: string): Promise<AnalisisIA["ideas"] | null> {
  const texto = await llm.pipe(parser).invoke([
    ["system", AUTO_SYSTEM],
    ["human", `CONTEXTO DEL PACIENTE:\n<datos_paciente>\n${context}\n</datos_paciente>`],
  ]);
  return extraerIdeas(texto);
}

async function analizar(patientId: number, hospitalId: number, severity: AnalisisIA["severity"]): Promise<AnalisisIA> {
  const context = await patientContext(patientId, hospitalId);
  const ideas = (await pedirIdeas(context)) ?? (await pedirIdeas(context));
  if (!ideas) throw new Error("JSON inválido del LLM");
  const valor: AnalisisIA = {
    generatedAt: new Date().toISOString(),
    severity,
    model: env.llm.model,
    promptVersion: PROMPT_VERSION,
    ideas,
  };
  await guardar(patientId, valor);
  return valor;
}

const enCurso = new Map<number, Promise<AnalisisIA>>();

/**
 * Análisis a pedido del médico (botón del expediente). Si ya hay uno en curso
 * para ese paciente se reutiliza la misma promesa: dos clics no hacen dos
 * consultas al LLM. Lanza si el LLM falla o no devuelve JSON válido.
 */
export function generarAnalisisIA(patientId: number, hospitalId: number): Promise<AnalisisIA> {
  const previo = enCurso.get(patientId);
  if (previo) return previo;
  const promesa = analizar(patientId, hospitalId, "solicitado").finally(() => enCurso.delete(patientId));
  enCurso.set(patientId, promesa);
  return promesa;
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
