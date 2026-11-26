// Asistente clínico con LLM local (Docker Model Runner vía LangChain).
//
// Apoyo a la decisión, NO decide: devuelve sugerencias que el médico valida.
// Nada de lo que responde se guarda en el expediente; si el médico lo adopta,
// lo escribe él en una nota SOAP firmada.
//
// El modelo corre en el mismo servidor (Ollama): los datos del paciente no
// salen del hospital.
//
// Cada pregunta recibe un prompt base corto más la instrucción de SU tipo
// (dato, gravedad, fármaco, turno…; services/aiTemas.ts, mensajesDe) con su
// propio tope de largo. Con un solo prompt grande, un modelo de 4B ponía la plantilla de
// análisis completo en todo (prototipo/REVISION-IA-RESPUESTAS.md).

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "../lib/prisma.ts";
import { notFound, parseOr400 } from "../lib/http.ts";
import { DISCLAIMER, llmNoDisponible, modelo, patientContext, prioridad, riesgoCalculado } from "../lib/clinicalAi.ts";
import { generarAnalisisIA, leerAnalisisIA } from "../services/aiAuto.ts";
import { PARAMETROS, detectarTemas, detectarTipo, mensajesDe, temasDelTipo, type Tema, type TipoPregunta } from "../services/aiTemas.ts";
import { estadoPaciente, haceTexto } from "../services/aiParse.ts";
import { env } from "../env.ts";

const salidaTexto = new StringOutputParser();

/** El modelo con el tope y la temperatura del tipo, ya con salida en texto. */
const cadena = (tipo: TipoPregunta) => modelo(PARAMETROS[tipo]).pipe(salidaTexto);

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
      estado: true,
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
    `Paciente: ${p.nombre} (${estadoPaciente(p.estado)})`,
    ...(temas.has("equipo") ? [
      `Médico a cargo: ${medicos || "este paciente todavía no tiene un médico asignado"}`,
      `Otro personal a cargo: ${otros || "todavía no hay nadie más asignado"}`,
    ] : []),
    ...(temas.has("ubicacion") ? [
      `Cama: ${ingreso?.cama ? `${ingreso.cama.codigo} (${ingreso.cama.unidad.nombre})` : "todavía no tiene una cama asignada"}`,
      `Ingreso activo: ${ingreso ? `desde ${haceTexto(ingreso.fecha_ingreso)}` : "no tiene un ingreso activo"}`,
    ] : []),
  ].join("\n");
  return { nombre: p.nombre, texto };
}

/** Valida el cuerpo y arma el tipo, el contexto y los mensajes. Lanza 400/404 antes de tocar el LLM. */
async function prepararConsulta(body: unknown, hospitalId: number) {
  const input = parseOr400(bodySchema, body);
  const tipo = detectarTipo(input.question ?? input.symptoms ?? "", Boolean(input.symptoms));
  // Las secciones que la pregunta nombra, más las que su tipo necesita.
  const temas = detectarTemas(input.question ?? "");
  for (const tema of temasDelTipo(tipo)) temas.add(tema);
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
  // Gravedad y pronóstico: el riesgo lo escribe el backend con los puntajes reales y el modelo solo agrega lo que más
  // pesa (prototipo/REVISION-DETALLES.md, A5). Sale primero, así el médico lo lee en el acto.
  const riesgo = tipo === "gravedad" || tipo === "pronostico"
    ? `${(await riesgoCalculado(input.patientId, hospitalId, tipo === "pronostico")).join("\n")}\n`
    : "";
  return { input, tipo, riesgo, mensajes: mensajesDe(tipo, context, question) };
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
      const { input, tipo, riesgo, mensajes } = await prepararConsulta(req.body, req.hospitalId);

      let answer: string;
      // La consulta del médico va primero: el análisis automático espera o se corta.
      const terminar = prioridad.empieza();
      try {
        answer = riesgo + (await cadena(tipo).invoke(mensajes));
      } catch (err: unknown) {
        // Sin contenido clínico en el log: solo el tipo de error.
        req.log.error({ reason: err instanceof Error ? err.name : "desconocido" }, "ai_assist: LLM no disponible");
        throw llmNoDisponible();
      } finally {
        terminar();
      }

      req.log.info({ userId: req.user.sub, patientId: input.patientId, tipo }, "ai_assist");

      return {
        model: env.llm.model,
        tipo,
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
  //   event: inicio  data: {model, tipo, disclaimer}
  //   event: trozo   data: {text}            (n veces)
  //   event: fin     data: {}
  //   event: error   data: {error}           (en lugar de `fin`)
  // Los errores de validación, permiso y paciente inexistente salen ANTES de
  // abrir el flujo, como JSON normal con su código HTTP.
  app.post(
    "/ai/assist/stream",
    { preHandler: medico, config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (req, reply) => {
      const { input, tipo, riesgo, mensajes } = await prepararConsulta(req.body, req.hospitalId);

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
      reply.raw.write(marco("inicio", { model: env.llm.model, tipo, disclaimer: DISCLAIMER }));
      if (riesgo) reply.raw.write(marco("trozo", { text: riesgo }));

      const terminar = prioridad.empieza();
      try {
        const flujo = await cadena(tipo).stream(mensajes, { signal: control.signal });
        for await (const text of flujo) {
          if (text) reply.raw.write(marco("trozo", { text }));
        }
        reply.raw.write(marco("fin", {}));
        req.log.info({ userId: req.user.sub, patientId: input.patientId, tipo }, "ai_assist_stream");
      } catch (err: unknown) {
        if (!control.signal.aborted) {
          req.log.error({ reason: err instanceof Error ? err.name : "desconocido" }, "ai_assist_stream: LLM no disponible");
          reply.raw.write(marco("error", { error: llmNoDisponible().message }));
        }
      } finally {
        terminar();
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
      // Lo pide el médico: tiene prioridad sobre el análisis automático.
      const terminar = prioridad.empieza();
      try {
        const analysis = await generarAnalisisIA(patientId, req.hospitalId);
        req.log.info({ userId: req.user.sub, patientId }, "ai_ideas");
        return { analysis, disclaimer: DISCLAIMER };
      } catch (err: unknown) {
        // El mensaje del error (timeout, conexión, "JSON inválido") no lleva datos del paciente.
        req.log.error({ patientId, reason: err instanceof Error ? `${err.name}: ${err.message.slice(0, 200)}` : "desconocido" }, "ai_ideas: falló");
        throw llmNoDisponible();
      } finally {
        terminar();
      }
    },
  );
}
