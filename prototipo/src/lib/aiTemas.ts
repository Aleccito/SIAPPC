// Copia de backend/src/services/aiTemas.ts: de qué trata una pregunta a la IA. Lo usan "Lo que verá la IA"
// (qué secciones del expediente recibe el modelo con esa pregunta) y el simulador, para responder solo lo que se pregunta.
// De qué trata una pregunta al asistente, para mandarle al modelo solo esas
// secciones del expediente. Pieza pura: sin base, Redis ni LLM.
//
// Lo mínimo de seguridad (edad, alergias, medicamentos y diagnósticos activos)
// va SIEMPRE y no depende de esto. Ante la duda se manda de más: una pregunta
// que no se reconoce recibe todo lo clínico.

export type Tema =
  | "basico"
  | "equipo"
  | "ubicacion"
  | "vitales"
  | "alertas"
  | "exploracion"
  | "medicamentos"
  | "diagnosticos"
  | "antecedentes"
  | "procedimientos"
  | "hospitalizaciones"
  | "evoluciones"
  | "notas"
  | "citas"
  | "documentos";

/** Lo que hace falta para razonar sobre el caso (y para el análisis automático). */
export const TEMAS_CLINICOS: readonly Tema[] = [
  "vitales", "alertas", "exploracion", "antecedentes", "notas",
];

// Se comparan contra el texto en minúscula y SIN tildes.
const PATRONES: Record<Tema, RegExp> = {
  basico: /\bedad\b|cuantos anos|\bsexo\b|tipo de sangre|grupo sanguineo|como se llama|nombre del paciente|motivo de (la )?(consulta|llegada)|\balergi/,
  equipo: /\bmedic[oa]s?\b|\bdoctor|\benfermer|a cargo|\btratante|quien (lo|la|le)? ?atiende|responsable/,
  ubicacion: /\bcamas?\b|\bunidad\b|\bsala\b|donde esta|ubicaci|\bingres|\binternad|desde cuando esta/,
  vitales: /signos? vital|\bvitales\b|frecuencia|\bpulso\b|satura|\bspo2\b|oxigen|\bpresion\b|\btension\b|temperatura|\bfiebre\b|\bfc\b|\bfr\b|\bpa\b|tendencia|empeor|mejor(a|o|ando)\b|evolucion|estable|perfusion|monitor/,
  alertas: /\balert|\balarma/,
  exploracion: /explora|\bpeso\b|\bpesa\b|\btalla\b|\bmide\b|estatura|\bimc\b|perimetro|glasgow|hallazgo|\btorax\b|abdomen|extremidad|neurolog|ausculta|palpa/,
  medicamentos: /medicament|medicina|farmac|\bdosis\b|\btoma\b|suspend|interacci|receta|\bquit(o|aron)\b/,
  diagnosticos: /diagnos|descart|resuelt|\bcie\b/,
  antecedentes: /anteceden|familiar|\bprevi[oa]s?\b|cronic|habito|\bfuma|\bheredit/,
  procedimientos: /procedimient|cirugi|operaci|\boperad|quirurg/,
  hospitalizaciones: /hospitaliz|internamient|\begreso|\balta medica|ya estuvo/,
  evoluciones: /evolucion|tratamiento (previo|anterior)|se le indico|observacion/,
  notas: /\bnotas?\b|\bsoap\b|subjetiv|objetiv/,
  citas: /\bcitas?\b|\bconsulta proxima|proxima consulta|agenda/,
  documentos: /document|archivo|laboratorio|\blabs?\b|imagenolog|radiograf|consentimiento|interconsulta/,
};

// Preguntas que piden razonar, no leer un dato: necesitan todo lo clínico
// aunque además nombren un tema concreto.
const RAZONAR = /diferencial|diagnosticos? (mas )?probable|manejo|conducta|tratamiento|bandera|riesgo|estudios?\b|solicit|recom|suger|sugier|analiz|resum|que tiene|que hago|deberia|\bdebo\b|puedo|puede|conviene|por que|indicar|administr|contraindic|interacci|pronostic|\bdosis\b|interpreta|opin/;

function plano(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Temas de la pregunta. Si no reconoce ninguno, o pide razonar, incluye lo clínico. */
export function detectarTemas(pregunta: string): Set<Tema> {
  const texto = plano(pregunta);
  const temas = new Set<Tema>();
  for (const [tema, patron] of Object.entries(PATRONES) as [Tema, RegExp][]) {
    if (patron.test(texto)) temas.add(tema);
  }
  if (temas.size === 0 || RAZONAR.test(texto)) {
    for (const tema of TEMAS_CLINICOS) temas.add(tema);
  }
  return temas;
}
