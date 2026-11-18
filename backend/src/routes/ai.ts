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
import { leerAnalisisIA } from "../services/aiAuto.ts";
import { env } from "../env.ts";

const SYSTEM = `Eres un asistente de apoyo a la decisión clínica para médicos de un hospital de trauma.
Reglas:
- Hablas con un MÉDICO, no con el paciente. Lenguaje técnico.
- Usa SOLO los datos del paciente que se te dan. Si falta un dato crítico (peso, función renal, embarazo, etc.), dilo y no lo inventes.
- Revisa SIEMPRE alergias y medicamentos activos antes de sugerir fármacos; señala interacciones y contraindicaciones.
- Da dosis solo como rangos de referencia estándar de adulto, indicando que deben ajustarse.
- Prioriza banderas rojas y causas que amenazan la vida.
- No eres fuente definitiva: el médico tratante decide.
- ${DATOS_NO_INSTRUCCIONES}
Formato de respuesta (Markdown, en español):
1. **Banderas rojas** (si hay)
2. **Diagnósticos diferenciales** (más probable → menos, con breve justificación)
3. **Estudios sugeridos**
4. **Opciones de manejo / tratamiento** (con precauciones por alergias, interacciones, comorbilidades)
5. **Datos faltantes que cambiarían la conducta**`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM],
  ["human", "CONTEXTO DEL PACIENTE:\n<datos_paciente>\n{context}\n</datos_paciente>\n\nCONSULTA DEL MÉDICO:\n{question}"],
]);

const chain = prompt.pipe(llm).pipe(new StringOutputParser());

const bodySchema = z.object({
  patientId: z.coerce.number().int().positive().optional(),
  symptoms: z.string().trim().max(5_000).optional(),
  question: z.string().trim().max(5_000).optional(),
}).refine((v) => v.patientId || v.symptoms || v.question, {
  message: "Hace falta patientId, symptoms o question",
});

export default async function aiRoutes(app: FastifyInstance) {
  // Sin esto `req.user` queda vacío y requirePermission revienta con un 500.
  app.addHook("preHandler", app.authenticate);

  // Mismo permiso que escribir notas SOAP: en el seed, solo médicos.
  const medico = [app.requirePermission("notas_soap", "crear")];

  app.post(
    "/ai/assist",
    { preHandler: medico, config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (req) => {
      const input = parseOr400(bodySchema, req.body);

      const context = input.patientId
        ? await patientContext(input.patientId, req.hospitalId)
        : "Sin paciente asociado (consulta general).";
      const question = [
        input.symptoms && `Síntomas/hallazgos: ${input.symptoms}`,
        input.question ?? "Sugiere diferenciales y manejo para este paciente de alto riesgo.",
      ].filter(Boolean).join("\n");

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

  // Último análisis automático (services/aiAuto.ts). Se consulta por paciente y
  // no en lote: el tablero solo lo pide para los pocos pacientes críticos.
  app.get("/ai/assist/:patientId", { preHandler: medico }, async (req) => {
    const { patientId } = parseOr400(z.object({ patientId: z.coerce.number().int().positive() }), req.params);
    const existe = await prisma.paciente.count({ where: { paciente_id: patientId, hospital_id: req.hospitalId } });
    if (!existe) throw notFound("Paciente no encontrado");
    return { analysis: await leerAnalisisIA(patientId), disclaimer: DISCLAIMER };
  });
}
