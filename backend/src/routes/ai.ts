// Asistente clínico con LLM local (Docker Model Runner vía LangChain).
//
// Apoyo a la decisión, NO decide: devuelve sugerencias que el médico valida.
// Nada de lo que responde se guarda en el expediente; si el médico lo adopta,
// lo escribe él en una nota SOAP firmada.
//
// El modelo corre en el mismo servidor (Docker Model Runner): los
// datos del paciente no salen del hospital.

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "../lib/prisma.ts";
import { notFound, parseOr400 } from "../lib/http.ts";
import { DATOS_NO_INSTRUCCIONES, DISCLAIMER, llm, llmNoDisponible, patientContext } from "../lib/clinicalAi.ts";
import { generarAnalisisIA, leerAnalisisIA } from "../services/aiAuto.ts";
import { TEMAS_CLINICOS, detectarTemas, type Tema } from "../services/aiTemas.ts";
import { env } from "../env.ts";

const SYSTEM = `Eres un asistente de apoyo a la decisión clínica para médicos de un hospital de trauma.
Reglas:
- Hablas con un MÉDICO, no con el paciente. Lenguaje técnico, con un tono humano, cordial y tranquilo, sin alarmismo; las banderas rojas se dicen con claridad.
- Usa SOLO los datos del paciente que se te dan. Si falta un dato crítico (peso, función renal, embarazo, etc.), dilo y no lo inventes.
- Revisa SIEMPRE alergias y medicamentos activos antes de sugerir fármacos; señala interacciones y contraindicaciones.
- Da dosis solo como rangos de referencia estándar de adulto, indicando que deben ajustarse.
- Prioriza banderas rojas y causas que amenazan la vida.
- No eres fuente definitiva: el médico tratante decide.
- ${DATOS_NO_INSTRUCCIONES}
Cómo responder (Markdown, en español):
- Responde SOLO lo que se pregunta. Si piden estudios, da solo estudios; si piden un dato, solo ese dato. No agregues secciones que no se pidieron.
- Si preguntan un dato (nombre, edad, médico a cargo, cama), responde en una frase corta y natural con el valor exacto del contexto (p. ej. "El médico a cargo es ..."). Si no lo hay, dilo con calma y amabilidad (p. ej. "Este paciente todavía no tiene un médico asignado." o "No encuentro ese dato en su expediente.").
- El contexto trae solo algunas secciones del expediente: que una no aparezca NO significa que el paciente no tenga ese dato. Di que no existe solo si el contexto lo dice.
- Sé breve y directo: viñetas cortas, una línea por punto, con el motivo en pocas palabras (p. ej. "Troponina: descartar SCA").
- Solo si la consulta es abierta (p. ej. "¿qué tiene?", "analiza al paciente"), usa: **Banderas rojas**, **Diferenciales**, **Estudios**, **Manejo**, **Datos faltantes**, cada una con 2–4 viñetas.
- Si hay una bandera roja relevante para lo preguntado, menciónala en una línea al inicio.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM],
  ["human", "CONTEXTO DEL PACIENTE:\n<datos_paciente>\n{context}\n</datos_paciente>\n\nCONSULTA DEL MÉDICO:\n{question}"],
]);

const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// Toda consulta va sobre un paciente: sin él la IA no tiene datos reales y
// respondería en el aire.
const bodySchema = z.object({
  patientId: z.coerce.number({ message: "Selecciona un paciente" }).int().positive(),
  symptoms: z.string().trim().max(5_000).optional(),
  question: z.string().trim().max(5_000).optional(),
}).refine((v) => v.symptoms || v.question, {
  message: "Escribe la consulta",
});

function marco(evento: string, datos: unknown): string {
  return `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;
}

/**
 * Quién es el paciente, quién lo atiende y dónde está. Solo para la consulta
 * del médico: el análisis automático no lo necesita para proponer hipótesis.
 */
async function datosAdministrativos(patientId: number, hospitalId: number, temas: Set<Tema>) {
  const p = await prisma.paciente.findFirst({
    where: { paciente_id: patientId, hospital_id: hospitalId },
    select: {
      nombre: true,
      medicos: {
        where: { activo: true },
        orderBy: { fecha_asignacion: "desc" },
        select: { motivo: true, usuario: { select: { nombre: true, rol: { select: { nombre: true, etiqueta: true } } } } },
      },
      ingresos: {
        where: { estado: "activo" },
        orderBy: { fecha_ingreso: "desc" },
        take: 1,
        select: { fecha_ingreso: true, cama: { select: { codigo: true, unidad: { select: { nombre: true } } } } },
      },
    },
  });
  if (!p) throw notFound("Paciente no encontrado");

  // En `medico_paciente` también hay enfermería: no cuenta como médico a cargo.
  const listar = (filas: typeof p.medicos) =>
    filas.map(({ usuario, motivo }) =>
      `${usuario.nombre} (${[usuario.rol.etiqueta, motivo].filter(Boolean).join(", ")})`).join("; ");
  const medicos = listar(p.medicos.filter((m) => m.usuario.rol.nombre === "medico"));
  const otros = listar(p.medicos.filter((m) => m.usuario.rol.nombre !== "medico"));
  const ingreso = p.ingresos[0];
  const texto = [
    `Paciente: ${p.nombre}`,
    ...(temas.has("equipo") ? [
      `Médico a cargo: ${medicos || "este paciente todavía no tiene un médico asignado"}`,
      `Otro personal a cargo: ${otros || "todavía no hay nadie más asignado"}`,
    ] : []),
    ...(temas.has("ubicacion") ? [
      `Cama: ${ingreso?.cama ? `${ingreso.cama.codigo} (${ingreso.cama.unidad.nombre})` : "todavía no tiene una cama asignada"}`,
      `Ingreso activo: ${ingreso ? ingreso.fecha_ingreso.toISOString() : "no tiene un ingreso activo"}`,
    ] : []),
  ].join("\n");
  return { nombre: p.nombre, texto };
}

/** Valida el cuerpo y arma contexto + pregunta. Lanza 400/404 antes de tocar el LLM. */
async function prepararConsulta(body: unknown, hospitalId: number) {
  const input = parseOr400(bodySchema, body);
  // Solo las secciones que la pregunta toca. Con síntomas hay que razonar.
  const temas = detectarTemas(input.question ?? "");
  if (input.symptoms) for (const tema of TEMAS_CLINICOS) temas.add(tema);
  const [clinico, admin] = await Promise.all([
    patientContext(input.patientId, hospitalId, temas),
    datosAdministrativos(input.patientId, hospitalId, temas),
  ]);
  const context = `${admin.texto}\n${clinico}`;
  const consulta = [
    input.symptoms && `Síntomas/hallazgos: ${input.symptoms}`,
    input.question,
  ].filter(Boolean).join("\n");
  const question = `Del paciente ${admin.nombre}: ${consulta}`;
  return { input, context, question };
}

export default async function aiRoutes(app: FastifyInstance) {
  // Sin esto `req.user` queda vacío y requirePermission revienta con un 500.
  app.addHook("preHandler", app.authenticate);

  // Permiso propio del asistente: en el seed, médico y administrador. Es
  // aparte de `notas_soap` para no tener que darle al admin escritura de notas
  // (podría firmar contenido clínico) solo para que consulte a la IA.
  const medico = [app.requirePermission("asistente_ia", "ver")];

  app.post(
    "/ai/assist",
    { preHandler: medico, config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (req) => {
      const { input, context, question } = await prepararConsulta(req.body, req.hospitalId);

      let answer: string;
      try {
        answer = await chain.invoke({ context, question });
      } catch (err: unknown) {
        // Sin contenido clínico en el log: solo el tipo de error.
        req.log.error({ reason: err instanceof Error ? err.name : "desconocido" }, "ai_assist: LLM no disponible");
        throw llmNoDisponible();
      }

      req.log.info({ userId: req.user.sub, patientId: input.patientId }, "ai_assist");

      return {
        model: env.llm.model,
        answer,
        disclaimer: DISCLAIMER,
      };
    },
  );

  // Misma consulta que POST /ai/assist, pero la respuesta llega por SSE a
  // medida que el modelo la genera: en CPU tarda más de un minuto y así el
  // médico empieza a leer en segundos. Es POST (lleva cuerpo), así que el
  // navegador lo lee con fetch y no con EventSource.
  //
  // Marcos:
  //   event: inicio  data: {model, disclaimer}
  //   event: trozo   data: {text}            (n veces)
  //   event: fin     data: {}
  //   event: error   data: {error}           (en lugar de `fin`)
  // Los errores de validación, permiso y paciente inexistente salen ANTES de
  // abrir el flujo, como JSON normal con su código HTTP.
  app.post(
    "/ai/assist/stream",
    { preHandler: medico, config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (req, reply) => {
      const { input, context, question } = await prepararConsulta(req.body, req.hospitalId);

      // Si el médico cierra la pestaña se corta también la generación: el LLM
      // es de un solo hilo y no debe seguir ocupado para nadie.
      const control = new AbortController();
      reply.raw.on("close", () => control.abort());

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        // Sin esto nginx guarda los trozos y el médico no ve nada hasta el final.
        "X-Accel-Buffering": "no",
      });
      reply.raw.write(marco("inicio", { model: env.llm.model, disclaimer: DISCLAIMER }));

      try {
        const flujo = await chain.stream({ context, question }, { signal: control.signal });
        for await (const text of flujo) {
          if (text) reply.raw.write(marco("trozo", { text }));
        }
        reply.raw.write(marco("fin", {}));
        req.log.info({ userId: req.user.sub, patientId: input.patientId }, "ai_assist_stream");
      } catch (err: unknown) {
        if (!control.signal.aborted) {
          req.log.error({ reason: err instanceof Error ? err.name : "desconocido" }, "ai_assist_stream: LLM no disponible");
          reply.raw.write(marco("error", { error: llmNoDisponible().message }));
        }
      } finally {
        reply.raw.end();
      }
      return reply;
    },
  );

  // Último análisis automático (services/aiAuto.ts). Se consulta por paciente y
  // no en lote: el tablero solo lo pide para los pocos pacientes críticos.
  app.get("/ai/assist/:patientId", { preHandler: medico }, async (req) => {
    const { patientId } = parseOr400(z.object({ patientId: z.coerce.number().int().positive() }), req.params);
    const existe = await prisma.paciente.count({ where: { paciente_id: patientId, hospital_id: req.hospitalId } });
    if (!existe) throw notFound("Paciente no encontrado");
    return { analysis: await leerAnalisisIA(patientId), disclaimer: DISCLAIMER };
  });

  // Ideas a pedido: el médico las genera desde el expediente aunque el
  // paciente no tenga alertas. Mismo formato corto que el análisis automático.
  app.post(
    "/ai/assist/:patientId/ideas",
    { preHandler: medico, config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (req) => {
      const { patientId } = parseOr400(z.object({ patientId: z.coerce.number().int().positive() }), req.params);
      const existe = await prisma.paciente.count({ where: { paciente_id: patientId, hospital_id: req.hospitalId } });
      if (!existe) throw notFound("Paciente no encontrado");
      try {
        const analysis = await generarAnalisisIA(patientId, req.hospitalId);
        req.log.info({ userId: req.user.sub, patientId }, "ai_ideas");
        return { analysis, disclaimer: DISCLAIMER };
      } catch (err: unknown) {
        // El mensaje del error (timeout, conexión, "JSON inválido") no lleva datos del paciente.
        req.log.error({ patientId, reason: err instanceof Error ? `${err.name}: ${err.message.slice(0, 200)}` : "desconocido" }, "ai_ideas: falló");
        throw llmNoDisponible();
      }
    },
  );
}
