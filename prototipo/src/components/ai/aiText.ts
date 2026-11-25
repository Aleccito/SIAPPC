// No viene de Figma: textos y utilidades de la IA (PR 3). Los mensajes son los de frontend/
// (shared/i18n/dictionary.ts, claves aiConsult.* y aiIdeas.*, PRs #54–#58).
import { ApiError } from '../../api/http';

export const AI_TEXT = {
  disclaimer: 'Sugerencia generada por IA. No sustituye el juicio clínico; verifique dosis, alergias e interacciones antes de indicar.',
  pickPatient: 'Para empezar, elija el paciente sobre el que quiere consultar.',
  patientHelp: 'La IA responde con el expediente, signos vitales y notas recientes del paciente.',
  ofPatient: 'Del paciente',
  stopped: 'Detuvo la consulta. Aquí queda lo que se alcanzó a responder.',
  forbidden: 'Su cuenta todavía no tiene acceso al asistente de IA. Un administrador puede habilitarlo.',
  rateLimited: 'Se hicieron varias consultas seguidas. Espere un minuto y podrá continuar.',
  unavailable: 'Por ahora el asistente de IA no está disponible. Puede intentarlo de nuevo en unos minutos.',
  notFound: 'No se encontró al paciente. Elija otro de la lista.',
  cut: 'La respuesta se cortó: lo de arriba está incompleto.',
  ideasEmpty: 'Todavía no hay ideas para este paciente. Puede pedirlas con «Generar ideas».',
  ideasError: 'No pudimos cargar las ideas en este momento. Puede intentarlo de nuevo en unos minutos.',
  ideasStale: 'Hay una alerta más reciente; esperando análisis nuevo',
};

/**
 * Las preguntas rápidas: las 5 de frontend/ (aiConsult.quick.*) más gravedad y entrega de turno. Cada texto es uno que
 * el backend reconoce como su tipo de respuesta (backend/src/services/aiTemas.ts, detectarTipo; lo prueba
 * Pruebas/backend/aiTemas.test.ts).
 */
export const QUICK_QUESTIONS = [
  { label: 'Gravedad', text: '¿Qué tan grave está este paciente?' },
  { label: 'Diferenciales', text: '¿Cuáles son los diagnósticos diferenciales más probables?' },
  { label: 'Banderas rojas', text: '¿Qué banderas rojas debo vigilar en este paciente?' },
  { label: 'Estudios', text: '¿Qué estudios de laboratorio e imagen solicitarías?' },
  { label: 'Alergias e interacciones', text: 'Revisa alergias e interacciones de sus medicamentos activos.' },
  { label: 'Manejo inicial', text: '¿Cuál sería el manejo inicial recomendado?' },
  { label: 'Entrega de turno', text: 'Resumen para entregar el turno.' },
];
export const INTERACTIONS_QUESTION = QUICK_QUESTIONS.find((q) => q.label === 'Alergias e interacciones')!.text;

export const SEVERITY_TEXT = {
  critica: { label: 'Disparado por alerta crítica', tone: 'danger' },
  alta: { label: 'Disparado por alerta alta', tone: 'warning' },
  solicitado: { label: 'A solicitud', tone: 'neutral' },
} as const;

export const MAX_QUESTION = 5_000;

/** Mensaje para el médico según el error de la API (mismo criterio que frontend/AiConsultPage). */
export function aiErrorText(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 403) return AI_TEXT.forbidden;
    if (err.status === 429) return AI_TEXT.rateLimited;
    if (err.status === 404) return AI_TEXT.notFound;
    if (err.status === 400) return err.message;
  }
  return AI_TEXT.unavailable;
}

export type AnswerSection = { title: string; text: string };

/** Las secciones "**Título**" de una respuesta abierta; vacío si la respuesta no las trae (C2). */
export function answerSections(markdown: string): AnswerSection[] {
  const parts = markdown.split(/\n(?=\*\*[^*\n]+\*\*\s*\n)/);
  const out: AnswerSection[] = [];
  for (const p of parts) {
    const m = /^\*\*([^*\n]+)\*\*\s*\n([\s\S]*)$/.exec(p.trim());
    if (m) out.push({ title: m[1].trim(), text: m[2].trim() });
  }
  return out.length >= 2 ? out : [];
}

/** Texto plano para la nota: sin negritas ni marcas de Markdown; las viñetas quedan como "- ". */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[*•]\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
