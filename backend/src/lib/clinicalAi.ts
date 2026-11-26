// Piezas compartidas del asistente clínico con LLM local: el cliente del
// modelo, el contexto del paciente y la prioridad de las consultas. Las usan la
// consulta manual (routes/ai.ts) y el análisis automático de pacientes
// críticos (services/aiAuto.ts).
//
// El contexto va en español clínico y ya digerido para un modelo de 4B: nombres
// de signos y no códigos, "hace 5 min" y no fechas ISO, alertas resumidas por
// tipo, puntajes calculados aquí y la lista de lo que el expediente no tiene
// (prototipo/REVISION-IA-RESPUESTAS.md, 3.3 y 4).

import { ChatOpenAI } from "@langchain/openai";
import { prisma } from "./prisma.ts";
import { ApiError, notFound } from "./http.ts";
import { env } from "../env.ts";
import {
  MAX_CAMPO,
  MAX_CONTEXTO,
  calcularPuntajes,
  crearPrioridad,
  datosFaltantes,
  estadoPaciente,
  grupoSanguineo,
  haceTexto,
  lineasRiesgo,
  nombreSigno,
  recortar,
  sexoPaciente,
  textoAlertas,
  textoPuntajes,
  textoSerie,
  type FilaSerie,
} from "../services/aiParse.ts";
import { TEMAS_CLINICOS, type Tema } from "../services/aiTemas.ts";

export const DISCLAIMER =
  "Sugerencia generada por IA. No sustituye el juicio clínico; verifique dosis, alergias e interacciones antes de indicar.";

// Las notas SOAP y demás campos libres son texto capturado por personas: se
// pasan al modelo entre <datos_paciente> y se le pide no obedecerlos.
export { DATOS_NO_INSTRUCCIONES } from "../services/aiTemas.ts";

/** Error del LLM (apagado, timeout, red) → 503 con mensaje legible. */
export function llmNoDisponible(): ApiError {
  return new ApiError(503, "Por ahora el asistente de IA no está disponible. Puede intentarlo de nuevo en unos minutos.");
}

const modelos = new Map<string, ChatOpenAI>();

/**
 * Cliente del modelo con ese tope y esa temperatura (services/aiTemas.ts,
 * PARAMETROS). Uno por combinación, reutilizado.
 */
export function modelo(p: { maxTokens: number; temperature: number }): ChatOpenAI {
  const clave = `${p.maxTokens}:${p.temperature}`;
  let m = modelos.get(clave);
  if (!m) {
    m = new ChatOpenAI({
      apiKey: "no-necesaria", // Ollama no autentica; el cliente exige un valor
      configuration: { baseURL: env.llm.url },
      model: env.llm.model,
      temperature: p.temperature,
      // Tope explícito: sin él, el servidor aplica el suyo y la respuesta puede
      // cortarse a media frase. En CPU cada token cuenta (unos 5 a 7 por segundo).
      maxTokens: p.maxTokens,
      // Sin tope, un modelo apagado deja la petición colgada (reintentos largos).
      maxRetries: 1,
      timeout: env.llm.timeoutMs,
    });
    modelos.set(clave, m);
  }
  return m;
}

/** El del análisis automático y las ideas: un JSON de 2 o 3 hipótesis cortas. */
export const llm = modelo({ maxTokens: 350, temperature: 0.2 });

/**
 * El modelo atiende de a uno: las consultas del médico van primero y el
 * análisis automático espera (services/aiAuto.ts). Vale por proceso.
 */
export const prioridad = crearPrioridad();

function edad(nacimiento: Date): number {
  return Math.floor((Date.now() - nacimiento.getTime()) / 31_557_600_000);
}

/** Horas de lecturas que se resumen. */
const VENTANA_MS = 6 * 3_600_000;
/** Un signo más viejo que esto no entra en los puntajes: sería la gravedad de otro momento. */
const VIGENCIA_PUNTAJE_MS = 60 * 60_000;
/** En el orden en que los lee un médico. El ECG es la onda, no un valor. */
const ORDEN_SIGNOS = ["hr", "pr", "spo2", "resp", "temp", "pa", "perfusion"];

const fecha = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "sin fecha");
const numero = (v: unknown) => Math.round(Number(v) * 10) / 10;

/**
 * Expediente en texto para el modelo. Lo mínimo de seguridad (edad, alergias,
 * medicamentos y diagnósticos activos, y lo que falta) va siempre; el resto,
 * solo si está en `temas` (ver services/aiTemas.ts).
 */
export async function patientContext(
  patientId: number,
  hospitalId: number,
  temas: Iterable<Tema> = TEMAS_CLINICOS,
): Promise<string> {
  const t = new Set(temas);
  const p = await prisma.paciente.findFirst({
    where: { paciente_id: patientId, hospital_id: hospitalId },
    include: {
      expediente: {
        include: {
          alergias: { where: { estado: "activa" } },
          medicamentos: { orderBy: { fecha_registro: "desc" } },
          diagnosticos: { orderBy: { fecha_registro: "desc" } },
          antecedentes: { where: { activo: true } },
          exploracion: { include: { hallazgos: true } },
        },
      },
    },
  });
  if (!p) throw notFound("Paciente no encontrado");

  const e = p.expediente;
  const x = e?.exploracion ?? null;
  const signos = t.has("vitales") || t.has("serie") ? await signosVitales(patientId) : null;

  const lines = [
    `Edad: ${edad(p.fecha_nacimiento)} años · Sexo: ${sexoPaciente(p.sexo)} · Grupo sanguíneo: ${grupoSanguineo(p.tipo_sangre)}`,
    `Motivo de consulta: ${recortar(p.motivo_consulta ?? "-", MAX_CAMPO)} · Estado: ${estadoPaciente(p.estado)}`,
    `Alergias activas: ${e?.alergias.map((a) => `${a.sustancia} (${a.severidad}${a.reaccion ? `: ${a.reaccion}` : ""})`).join("; ") || "ninguna registrada"}`,
    `Medicamentos activos: ${e?.medicamentos.filter((m) => m.estado === "activo").map((m) => [m.nombre, m.dosis, m.via, m.frecuencia].filter(Boolean).join(" ")).join("; ") || "ninguno registrado"}`,
    `Diagnósticos activos: ${e?.diagnosticos.filter((d) => d.estado === "activo").map((d) => `${d.descripcion}${d.cie10 ? ` [${d.cie10}]` : ""} (${d.tipo})`).join("; ") || "ninguno"}`,
    datosFaltantes({ peso: x?.peso_kg != null, glasgow: x?.glasgow != null, pa: Boolean(signos?.ultimos.pa) }),
  ];
  const agregar = (titulo: string, items: string[] | undefined) =>
    lines.push(`${titulo}: ${items?.join("; ") || "sin registros"}`);

  if (t.has("antecedentes")) {
    agregar("Antecedentes", e?.antecedentes.map((a) => `${a.tipo}: ${a.descripcion}`));
  }
  if (t.has("medicamentos")) {
    agregar("Medicamentos suspendidos o finalizados", e?.medicamentos.filter((m) => m.estado !== "activo").slice(0, 5)
      .map((m) => `${m.nombre} (${m.estado}${m.motivo_suspension ? `: ${campo(m.motivo_suspension)}` : ""})`));
  }
  if (t.has("diagnosticos")) {
    agregar("Diagnósticos resueltos o descartados", e?.diagnosticos.filter((d) => d.estado !== "activo").slice(0, 5)
      .map((d) => `${d.descripcion} (${d.estado})`));
  }
  if (signos && t.has("vitales")) {
    lines.push(signos.texto);
    // La PA de un solo número no dice si es la sistólica: no entra en los puntajes.
    const reciente = (codigo: string) => {
      const u = signos.ultimos[codigo];
      return u && Date.now() - u.fecha.getTime() <= VIGENCIA_PUNTAJE_MS ? u.valor : null;
    };
    lines.push(textoPuntajes(calcularPuntajes({
      hr: reciente("hr") ?? reciente("pr"),
      resp: reciente("resp"),
      spo2: reciente("spo2"),
      temp: reciente("temp"),
      pas: null,
      glasgow: x?.glasgow ?? null,
      oxigeno: null,
    })));
  }
  if (signos && t.has("serie")) lines.push(textoSerie(await serieHoraria(signos.sensores), signos.unidades));
  if (t.has("alertas")) lines.push(await alertas(patientId));
  if (t.has("exploracion")) lines.push(exploracion(x));

  if (t.has("procedimientos") && e) {
    const filas = await prisma.procedimiento.findMany({ where: { expediente_id: e.expediente_id }, orderBy: { fecha: "desc" }, take: 5 });
    agregar("Procedimientos", filas.map((f) => `${f.nombre} (${fecha(f.fecha)})${f.resultado ? `: ${campo(f.resultado)}` : ""}`));
  }
  if (t.has("hospitalizaciones") && e) {
    const filas = await prisma.hospitalizacion.findMany({ where: { expediente_id: e.expediente_id }, orderBy: { fecha_ingreso: "desc" }, take: 3 });
    agregar("Hospitalizaciones previas", filas.map((f) => `${fecha(f.fecha_ingreso)} a ${fecha(f.fecha_egreso)}: ${f.motivo}${f.resumen_egreso ? ` — ${campo(f.resumen_egreso)}` : ""}`));
  }
  if (t.has("evoluciones")) {
    const filas = await prisma.historiaClinica.findMany({ where: { paciente_id: patientId }, orderBy: { fecha_hora: "desc" }, take: 2 });
    agregar("Evoluciones", filas.map((f) => `${haceTexto(f.fecha_hora)}: Dx ${campo(f.diagnostico)} | Tx ${campo(f.tratamiento)} | Obs ${campo(f.observaciones)}`));
  }
  if (t.has("citas")) {
    const filas = await prisma.cita.findMany({
      where: { paciente_id: patientId, fecha_hora: { gte: new Date() }, estado: { in: ["programada", "confirmada"] } },
      orderBy: { fecha_hora: "asc" },
      take: 3,
      include: { usuario: { select: { nombre: true } } },
    });
    agregar("Próximas citas", filas.map((f) => `${fecha(f.fecha_hora)} con ${f.usuario.nombre}: ${f.motivo} (${f.estado})`));
  }
  if (t.has("documentos") && e) {
    // Solo la ficha: el modelo no lee el archivo.
    const filas = await prisma.documentoClinico.findMany({
      where: { expediente_id: e.expediente_id },
      orderBy: { fecha_registro: "desc" },
      take: 8,
      select: { tipo: true, titulo: true, fecha_documento: true },
    });
    agregar("Documentos (solo título, sin contenido)", filas.map((f) => `${f.titulo} [${f.tipo}] ${fecha(f.fecha_documento)}`));
  }
  // Al final: si se llega al tope total, se recorta la nota más vieja.
  if (t.has("notas")) {
    const notas = await prisma.notaSoap.findMany({ where: { paciente_id: patientId }, orderBy: { fecha_hora: "desc" }, take: 3 });
    if (notas.length === 0) lines.push("Notas SOAP: sin registros");
    for (const n of notas) {
      const tipo = n.nota_padre_id ? "Adenda" : "Nota SOAP";
      lines.push(`${tipo} (${haceTexto(n.fecha_hora)}, ${n.estado}): S: ${campo(n.subjetivo)} | O: ${campo(n.objetivo)} | A: ${campo(n.analisis)} | P: ${campo(n.plan)}`);
    }
  }
  return recortar(lines.join("\n"), MAX_CONTEXTO);
}

/**
 * Las líneas de riesgo de una pregunta de gravedad o de pronóstico (services/aiParse.ts, lineasRiesgo), con los
 * datos reales: signos de la última hora, Glasgow, edad, sexo, diagnósticos activos y antecedentes. Las escribe el
 * backend antes del texto del modelo (routes/ai.ts).
 */
export async function riesgoCalculado(patientId: number, hospitalId: number, pronostico: boolean): Promise<string[]> {
  const p = await prisma.paciente.findFirst({
    where: { paciente_id: patientId, hospital_id: hospitalId },
    select: {
      fecha_nacimiento: true,
      sexo: true,
      motivo_consulta: true,
      expediente: {
        select: {
          diagnosticos: { where: { estado: "activo" }, select: { descripcion: true, cie10: true } },
          antecedentes: { where: { activo: true }, select: { descripcion: true } },
          exploracion: { select: { glasgow: true } },
        },
      },
    },
  });
  if (!p) throw notFound("Paciente no encontrado");
  const signos = await signosVitales(patientId);
  const reciente = (codigo: string) => {
    const u = signos.ultimos[codigo];
    return u && Date.now() - u.fecha.getTime() <= VIGENCIA_PUNTAJE_MS ? u.valor : null;
  };
  const diagnosticos = (p.expediente?.diagnosticos ?? []).map((d) => (d.cie10 ? `${d.descripcion} [${d.cie10}]` : d.descripcion));
  return lineasRiesgo(
    {
      hr: reciente("hr") ?? reciente("pr"),
      resp: reciente("resp"),
      spo2: reciente("spo2"),
      temp: reciente("temp"),
      // Nadie publica la PA ni dice si recibe oxígeno: el NEWS2 sale parcial y lo dice.
      pas: null,
      oxigeno: null,
      glasgow: p.expediente?.exploracion?.glasgow ?? null,
      edad: edad(p.fecha_nacimiento),
      sexo: p.sexo,
      motivo: p.motivo_consulta,
      diagnosticos,
      antecedentes: [...(p.expediente?.antecedentes ?? []).map((a) => a.descripcion), ...diagnosticos],
    },
    pronostico,
  );
}

type Sensor = { sensor_id: number; variable_medida: string };

/** Último valor de cada signo y su rango en las horas previas. */
async function signosVitales(patientId: number) {
  const todos = await prisma.sensor.findMany({
    where: { dispositivo: { paciente_id: patientId }, variable_medida: { in: ORDEN_SIGNOS } },
    include: { variable: true, lecturas: { orderBy: { fecha_hora: "desc" }, take: 1 } },
  });
  const sensores = todos
    .filter((s) => s.lecturas[0])
    .sort((a, b) => ORDEN_SIGNOS.indexOf(a.variable_medida) - ORDEN_SIGNOS.indexOf(b.variable_medida));
  const ultimos: Record<string, { valor: number; fecha: Date }> = {};
  const unidades: Record<string, string> = {};
  const partes = await Promise.all(sensores.map(async (s) => {
    const ultima = s.lecturas[0];
    const valor = numero(ultima.valor);
    ultimos[s.variable_medida] = { valor, fecha: ultima.fecha_hora };
    unidades[s.variable_medida] = s.variable.unidad;
    const desde = new Date(ultima.fecha_hora.getTime() - VENTANA_MS);
    const r = await prisma.lectura.aggregate({
      where: { sensor_id: s.sensor_id, fecha_hora: { gte: desde, lte: ultima.fecha_hora } },
      _min: { valor: true },
      _max: { valor: true },
    });
    const rango = r._min.valor !== null && r._max.valor !== null ? `; últimas 6 h entre ${numero(r._min.valor)} y ${numero(r._max.valor)}` : "";
    return `${nombreSigno(s.variable_medida)} ${valor} ${s.variable.unidad} (${haceTexto(ultima.fecha_hora)}${rango})`;
  }));
  return {
    texto: `Signos vitales del monitor (último valor): ${partes.join("; ") || "sin lecturas"}`,
    ultimos,
    unidades,
    sensores: sensores.map((s): Sensor => ({ sensor_id: s.sensor_id, variable_medida: s.variable_medida })),
  };
}

/**
 * Promedio de cada una de las últimas 6 horas, por signo. Una consulta por hora
 * y sensor sobre el índice (sensor_id, fecha_hora): evita traer miles de
 * lecturas y no depende de la zona horaria de la base.
 */
async function serieHoraria(sensores: Sensor[]): Promise<FilaSerie[]> {
  const ahora = Date.now();
  const filas = await Promise.all(sensores.flatMap((s) => Array.from({ length: 6 }, async (_, i) => {
    const r = await prisma.lectura.aggregate({
      where: { sensor_id: s.sensor_id, fecha_hora: { gte: new Date(ahora - (i + 1) * 3_600_000), lt: new Date(ahora - i * 3_600_000) } },
      _avg: { valor: true },
    });
    return r._avg.valor === null ? null : { signo: s.variable_medida, horasAtras: i, promedio: Number(r._avg.valor) };
  })));
  return filas.filter((f): f is FilaSerie => f !== null);
}

/** Alertas de las últimas 6 h agrupadas por tipo, y cuántas siguen sin atender. */
async function alertas(patientId: number): Promise<string> {
  const where = { lectura: { sensor: { dispositivo: { paciente_id: patientId } } } };
  const ahora = Date.now();
  const [abiertas, recientes, grupos] = await Promise.all([
    prisma.alerta.count({ where: { ...where, estado: "abierta" } }),
    prisma.alerta.count({ where: { ...where, estado: "abierta", fecha_hora: { gte: new Date(ahora - 30 * 60_000) } } }),
    prisma.alerta.groupBy({
      by: ["tipo", "severidad"],
      where: { ...where, fecha_hora: { gte: new Date(ahora - VENTANA_MS) } },
      _count: { _all: true },
      _max: { fecha_hora: true },
    }),
  ]);
  const detalle = await Promise.all(grupos.map(async (g) => {
    const ultima = await prisma.alerta.findFirst({
      where: { ...where, tipo: g.tipo, severidad: g.severidad },
      orderBy: { fecha_hora: "desc" },
      select: { mensaje: true },
    });
    return { tipo: g.tipo, severidad: g.severidad, veces: g._count._all, ultima: g._max.fecha_hora, mensaje: ultima?.mensaje ?? null };
  }));
  return textoAlertas({ abiertas, recientes, grupos: detalle }, ahora);
}

type Exploracion = {
  peso_kg: unknown;
  talla_cm: unknown;
  perimetro_abdominal_cm: unknown;
  glasgow: number | null;
  actualizado_en: Date;
  hallazgos: Array<{ region: string; tecnica: string; estado: string; descripcion: string | null }>;
};

function exploracion(x: Exploracion | null): string {
  if (!x) return "Exploración física: sin registros";
  const medidas = [
    x.peso_kg != null && `peso ${numero(x.peso_kg)} kg`,
    x.talla_cm != null && `talla ${numero(x.talla_cm)} cm`,
    x.perimetro_abdominal_cm != null && `perímetro abdominal ${numero(x.perimetro_abdominal_cm)} cm`,
    x.glasgow != null && `Glasgow ${x.glasgow}`,
  ].filter(Boolean);
  // Los normales sin comentario no aportan: se omiten para ahorrar texto.
  const hallazgos = x.hallazgos
    .filter((h) => h.estado === "anormal" || h.descripcion)
    .map((h) => `${h.region}/${h.tecnica} ${h.estado}${h.descripcion ? `: ${recortar(h.descripcion, 150)}` : ""}`);
  return `Exploración física (${haceTexto(x.actualizado_en)}): ${[...medidas, ...hallazgos].join("; ") || "sin hallazgos anormales"}`;
}

function campo(v: string | null): string {
  return v ? recortar(v, MAX_CAMPO) : "-";
}
