// Simulador de la IA (backend/src/routes/ai.ts, lib/clinicalAi.ts y services/aiAuto.ts, PRs #54–#58).
//
// - Consulta libre (POST /ai/assist/stream): exige paciente y responde SOLO lo que se pregunta, como el SYSTEM del
//   backend: un dato → una frase; "estudios" → solo estudios; una pregunta abierta → las 5 secciones. La pregunta
//   se clasifica con las mismas reglas del backend (src/lib/aiTemas.ts es copia de services/aiTemas.ts).
// - Análisis automático (GET /ai/assist/:id) para pacientes con alerta alta o crítica, e ideas a pedido
//   (POST /ai/assist/:id/ideas, severidad "solicitado"). Lo generado se guarda 15 min (AI_AUTO_TTL_SECONDS=900).
// - Interruptores (?ia=): lenta (tiempos del modelo local), caida (503 antes de empezar), corte (error a mitad),
//   sin-analisis (ningún análisis automático). ?retraso=0 quita las esperas.
// El texto clínico es inventado (mock/iaRespuestas.ts); los datos del paciente salen del simulador (seed).
import type { AiAnalysis } from '../ai';
import { detectarTemas, detectarTipo, TEMAS_CLINICOS } from '../../lib/aiTemas';
import { mockFlags } from './flags';
import { wait } from './delay';
import * as db from './db';
import { SABER_IA, type SaberIA } from './iaRespuestas';

export const MODELO = 'medgemma-4b-it (simulado)';
export const DISCLAIMER =
  'Sugerencia generada por IA. No sustituye el juicio clínico; verifique dosis, alergias e interacciones antes de indicar.';
export const NO_DISPONIBLE = 'Por ahora el asistente de IA no está disponible. Puede intentarlo de nuevo en unos minutos.';

const MIN = 60_000;
const TTL = 15 * MIN;

// --- Tiempos ----------------------------------------------------------------------------------------------

/** Cuánto "piensa" antes del primer trozo y cada cuánto llega uno. */
export function tiempos(): { pensar: number; trozo: number; ideas: number } {
  const f = mockFlags();
  if (f.ia === 'lenta') return { pensar: 30_000, trozo: 320, ideas: 40_000 };
  if (f.retraso === '0') return { pensar: 120, trozo: 4, ideas: 120 };
  return { pensar: 1_800 + Math.random() * 1_200, trozo: 45, ideas: 3_000 + Math.random() * 2_000 };
}

// --- Límite de consultas (como @fastify/rate-limit del backend) ------------------------------------------

const usos: Record<'consulta' | 'ideas', number[]> = { consulta: [], ideas: [] };
/** true si se pasó del límite por minuto (10 consultas, 5 pedidos de ideas). */
export function excedido(tipo: 'consulta' | 'ideas'): boolean {
  const ahora = Date.now();
  usos[tipo] = usos[tipo].filter((t) => ahora - t < MIN);
  if (usos[tipo].length >= (tipo === 'consulta' ? 10 : 5)) return true;
  usos[tipo].push(ahora);
  return false;
}

// --- Datos del paciente --------------------------------------------------------------------------------

const saber = (i: number): SaberIA => SABER_IA[db.DEMOS[i].delSeed.cedula];
/** Minúscula inicial para seguir una frase, sin tocar siglas (FC, SpO₂, TEP). */
const minus = (s: string) => (/^\p{Lu}\p{Ll}*(?![\p{L}\d])/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const vineta = (items: string[]) => items.slice(0, 4).map((x) => `- ${x}`).join('\n');
const seccion = (titulo: string, items: string[]) => `**${titulo}**\n${vineta(items)}`;
const lista = (items: string[]) => items.join('; ');

function edad(i: number): number {
  const n = new Date(db.paciente(i).birthDate ?? '');
  return Math.floor((Date.now() - n.getTime()) / 31_557_600_000);
}

function signos(i: number): string {
  const s = db.DEMOS[i].delSeed;
  const ult = db.signosUltimos(i);
  const serie = (k: string) => s.lecturas[k] ?? [];
  const cambio = (k: string, nombre: string, unidad: string) => {
    const v = serie(k);
    if (v.length < 2) return null;
    const [a, b] = [v[0], v[v.length - 1]];
    if (Math.abs(b - a) < 3) return `${nombre} estable en ${b}${unidad}`;
    return `${nombre} ${b > a ? 'subió' : 'bajó'} de ${a} a ${b}${unidad}`;
  };
  const tendencia = [cambio('hr', 'la FC', ' lpm'), cambio('spo2', 'la SpO₂', ' %'), cambio('resp', 'la FR', ' rpm')].filter(Boolean).join(', ');
  return `Últimos signos: FC ${ult.hr ?? '—'} lpm, SpO₂ ${ult.spo2 ?? '—'} %, FR ${ult.resp ?? '—'} rpm. En los últimos 40 min ${tendencia}.`;
}

function alertasAbiertas(i: number) {
  const dev = db.DEMOS[i].delSeed.dispositivo.codigo;
  return db.alertas().filter((a) => a.device === dev && a.status !== 'resuelta');
}

/** La peor severidad abierta del paciente, si es alta o crítica (lo que dispara el análisis automático). */
function severidadAuto(i: number): 'alta' | 'critica' | null {
  const abiertas = alertasAbiertas(i);
  if (abiertas.some((a) => a.severity === 'critica')) return 'critica';
  if (abiertas.some((a) => a.severity === 'alta')) return 'alta';
  return null;
}

type Entrada = Record<string, unknown>;
const activos = (i: number, cat: 'alergias' | 'medicamentos' | 'diagnosticos' | 'antecedentes') =>
  db.categoria(i, cat).filter((e: Entrada) => !e.status || e.status === 'activo' || e.status === 'activa');

/** Una frase por cada dato pedido (nombre, edad, médico a cargo, cama, alergias…). */
function datos(i: number, q: string, temas: Set<string>): string[] {
  const p = db.paciente(i);
  const s = db.DEMOS[i].delSeed;
  const inv = db.DEMOS[i].inventado;
  const out: string[] = [];
  if (/como se llama|nombre/.test(q)) out.push(`Se llama ${p.name}.`);
  if (/\bedad\b|cuantos anos/.test(q)) out.push(`Tiene ${edad(i)} años.`);
  if (/\bsexo\b/.test(q)) out.push(`Es de sexo ${p.sex === 'F' ? 'femenino' : 'masculino'}.`);
  if (/tipo de sangre|grupo sanguineo/.test(q)) out.push(p.bloodType ? `Su grupo sanguíneo es ${p.bloodType}.` : 'No encuentro el grupo sanguíneo en su expediente.');
  if (/motivo/.test(q)) out.push(`Llegó por ${minus(s.motivo)}.`);
  if (/\balergi/.test(q)) {
    const al = activos(i, 'alergias');
    out.push(al.length ? `Tiene alergia a ${lista(al.map((a) => `${minus(String(a.substance))} (${a.severity}${a.reaction ? `: ${minus(String(a.reaction))}` : ''})`))}.` : 'No tiene alergias registradas.');
  }
  if (temas.has('equipo')) out.push('El médico a cargo es Carlos Méndez (Médico). Todavía no hay nadie más asignado.');
  if (temas.has('ubicacion')) {
    const a = db.asignado(i);
    out.push(a.bed ? `Está en la cama ${a.bed} (${a.unit}); ingresó hace ${s.ingreso.horasAtras} h.` : 'Todavía no tiene una cama asignada.');
  }
  if (temas.has('vitales')) out.push(signos(i));
  if (temas.has('alertas')) {
    const ab = alertasAbiertas(i);
    out.push(ab.length ? `Tiene ${ab.length} alertas abiertas; la más reciente: ${minus(ab[0].message ?? ab[0].type)}.` : 'No tiene alertas abiertas.');
  }
  if (temas.has('medicamentos')) {
    const m = activos(i, 'medicamentos');
    out.push(m.length ? `Medicamentos activos: ${lista(m.map((x) => [x.name, x.dose, x.route, x.frequency].filter(Boolean).join(' ')))}.` : 'No tiene medicamentos activos.');
  }
  if (temas.has('diagnosticos')) {
    const d = activos(i, 'diagnosticos');
    out.push(`Diagnósticos activos: ${lista(d.map((x) => `${x.description}${x.code ? ` [${x.code}]` : ''} (${x.type})`))}.`);
  }
  if (temas.has('antecedentes')) out.push(`Antecedentes: ${lista(s.antecedentes.map((a) => `${a.tipo}: ${minus(a.descripcion)}`)) || 'sin registros'}.`);
  if (temas.has('exploracion'))
    out.push(inv.exploracion ? `Exploración: peso ${inv.exploracion.pesoKg} kg, talla ${inv.exploracion.tallaCm} cm, Glasgow ${inv.exploracion.glasgow}.` : 'La exploración física todavía está pendiente.');
  if (temas.has('notas')) {
    const n = db.notas().find((x) => x.patientId === p.id && x.status === 'firmada');
    out.push(n ? `La última nota SOAP firmada (${n.signedByName ?? n.authorName}) dice en A: ${minus(n.assessment ?? '—')} En P: ${minus(n.plan ?? '—')}` : 'No tiene notas SOAP firmadas.');
  }
  if (temas.has('documentos')) out.push(inv.documentos.length ? `Documentos: ${lista(inv.documentos.map((d) => d.titulo))}.` : 'No tiene documentos cargados.');
  if (temas.has('procedimientos')) out.push(inv.procedimientos.length ? `Procedimientos: ${lista(inv.procedimientos.map((x) => `${x.nombre} (${db.civil(x.fecha)})`))}.` : 'No encuentro procedimientos en su expediente.');
  if (temas.has('hospitalizaciones')) out.push(inv.hospitalizaciones.length ? `Hospitalizaciones previas: ${lista(inv.hospitalizaciones.map((x) => `${x.motivo} (${db.civil(x.ingreso)})`))}.` : 'No tiene hospitalizaciones previas registradas.');
  if (temas.has('citas')) out.push('No tiene citas próximas registradas.');
  if (temas.has('evoluciones')) out.push('No encuentro evoluciones registradas en su expediente.');
  return out;
}

const plano = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Qué parte del razonamiento clínico se pide (si no se pide ninguna en particular, es una pregunta abierta).
const PIDE: Array<[keyof SaberIA, string, RegExp]> = [
  ['banderas', 'Banderas rojas', /bandera|alarma|que (debo )?vigilar/],
  ['diferenciales', 'Diferenciales', /diferencial|diagnosticos? (mas )?probable|que (mas )?podria tener/],
  ['estudios', 'Estudios', /estudios?\b|laboratorio|imagen|examenes|que (le )?pido|solicit/],
  ['interacciones', 'Alergias e interacciones', /interacci|contraindic/],
  ['manejo', 'Manejo', /manejo|tratamiento|conducta|que hago|recomend/],
];
const ABIERTA = /que tiene|analiz|resum|opin|como (lo|la) ves|evalua|profundiza|explica|amplia|detalla/;
const RAZONAR = /diferencial|diagnosticos? (mas )?probable|manejo|conducta|tratamiento|bandera|riesgo|estudios?\b|solicit|recom|suger|sugier|analiz|resum|que tiene|que hago|deberia|\bdebo\b|puedo|puede|conviene|por que|indicar|administr|contraindic|interacci|pronostic|\bdosis\b|interpreta|opin/;

/** La respuesta completa a una consulta, en Markdown, como la escribiría el modelo con ese SYSTEM. */
export function responder(i: number, pregunta: string): string {
  const k = saber(i);
  const q = plano(pregunta);
  const temas = detectarTemas(pregunta);
  const pedidas = PIDE.filter(([, , re]) => re.test(q));
  const conAlertas = severidadAuto(i) !== null;
  // Gravedad y entrega de turno tienen su propio formato, como en el backend (services/aiTemas.ts, INSTRUCCION).
  const tipo = detectarTipo(pregunta);
  if (tipo === 'gravedad') {
    const sev = severidadAuto(i);
    const nivel = sev === 'critica' ? 'alta' : sev === 'alta' ? 'moderada' : 'baja';
    return [
      `**Gravedad: ${nivel}** · NEWS2 parcial (sin presión arterial ni oxígeno suplementario)`,
      `- ${signos(i)}`,
      sev ? `- Alertas ${sev === 'critica' ? 'críticas' : 'altas'} abiertas: ${minus(alertasAbiertas(i)[0]?.message ?? 'fuera de rango')}` : '- Sin alertas abiertas',
      `- Falta para afinarla: ${minus(k.faltantes[0] ?? 'presión arterial')}`,
    ].join('\n');
  }
  if (tipo === 'turno') {
    const dx = activos(i, 'diagnosticos').map((d) => String(d.description));
    const meds = activos(i, 'medicamentos').map((m) => String(m.name));
    return [
      `- **Situación:** ${dx[0] ?? minus(db.DEMOS[i].delSeed.motivo)}${severidadAuto(i) ? `, con alertas ${severidadAuto(i) === 'critica' ? 'críticas' : 'altas'} abiertas` : ', estable'}`,
      `- **Cambios recientes:** ${signos(i)}`,
      `- **Tratamiento actual:** ${lista(meds) || 'sin medicamentos activos'}`,
      `- **Pendientes:** ${minus(k.estudios[0] ?? 'sin pendientes registrados')}`,
      `- **Datos que faltan:** ${minus(k.faltantes[0] ?? 'ninguno')}`,
    ].join('\n');
  }
  const banderaPrimero = (claves: string[]) => (conAlertas && !claves.includes('banderas') ? `**Bandera roja:** ${minus(k.banderas[0])}\n\n` : '');

  // Una pregunta que no toca ningún tema (detectarTemas le da todo lo clínico) también es abierta.
  const ningunTema = temas.size === TEMAS_CLINICOS.length && TEMAS_CLINICOS.every((t) => temas.has(t));
  if (ABIERTA.test(q) || (pedidas.length === 0 && (RAZONAR.test(q) || ningunTema))) {
    return [
      seccion('Banderas rojas', k.banderas),
      seccion('Diferenciales', k.diferenciales),
      seccion('Estudios', k.estudios),
      seccion('Manejo', [...k.manejo.slice(0, 3), k.interacciones[0]]),
      seccion('Datos faltantes', k.faltantes),
    ].join('\n\n');
  }
  if (pedidas.length) {
    const claves = pedidas.map(([c]) => c);
    return banderaPrimero(claves) + pedidas.map(([clave, titulo]) => seccion(titulo, k[clave] as string[])).join('\n\n');
  }
  // Un dato puntual: una frase por cada uno.
  const frases = datos(i, q, temas);
  if (frases.length) return frases.join(' ');
  return responder(i, 'analiza al paciente');
}

/** La respuesta partida en trozos de unas 3 palabras, como llegan del modelo (conservan espacios y saltos). */
export function trozos(texto: string): string[] {
  return texto.match(/\S+\s*/g)?.reduce<string[]>((acc, palabra, n) => {
    if (n % 3 === 0) acc.push(palabra);
    else acc[acc.length - 1] += palabra;
    return acc;
  }, []) ?? [texto];
}

// --- Análisis guardados (automático y a pedido) --------------------------------------------------------

const CLAVE = 'mock.ia.analisis';
function leidos(): Record<string, AiAnalysis> {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}') as Record<string, AiAnalysis>;
  } catch {
    return {};
  }
}
function guardarAnalisis(id: string, a: AiAnalysis) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify({ ...leidos(), [id]: a }));
  } catch {
    // Sin sessionStorage dura lo que la página.
  }
}

/** DEMO-0004 llegó hace poco: su primer análisis automático tarda un minuto desde que se mira (REVISION-IA.md). */
function primerVistazo(id: string): number {
  const clave = `mock.ia.visto.${id}`;
  try {
    const previo = sessionStorage.getItem(clave);
    if (previo) return Number(previo);
    sessionStorage.setItem(clave, String(Date.now()));
  } catch {
    // Sin sessionStorage: cuenta desde la carga.
  }
  return Date.now();
}

/** GET /ai/assist/:id → el análisis vigente, o null. */
export function analisisVigente(i: number): AiAnalysis | null {
  const id = db.idDe(i);
  const ahora = Date.now();
  const guardado = leidos()[id];
  if (guardado && ahora - Date.parse(guardado.generatedAt) < TTL) return guardado;
  if (mockFlags().ia === 'sin-analisis') return null;
  const severity = severidadAuto(i);
  if (!severity) return null;
  if (db.DEMOS[i].delSeed.cedula === 'DEMO-0004' && ahora - primerVistazo(id) < MIN) return null;
  // Las alertas siguen llegando: el backend vuelve a analizar cuando pasa el enfriamiento (5 min) y el análisis
  // nunca llega a caducar. Aquí se renueva cada 10 min, empezando "hace 4 min" (distinto por paciente).
  const base = db.AHORA - (4 * MIN + i * 37_000);
  const periodo = 10 * MIN;
  const generado = base + Math.max(0, Math.floor((ahora - base) / periodo)) * periodo;
  return { generatedAt: new Date(generado).toISOString(), severity, model: MODELO, ideas: saber(i).ideas.slice(0, 3) };
}

/** POST /ai/assist/:id/ideas → ideas a pedido, guardadas como el análisis vigente. */
export function generarIdeas(i: number): AiAnalysis {
  const a: AiAnalysis = { generatedAt: new Date().toISOString(), severity: 'solicitado', model: MODELO, ideas: saber(i).ideas.slice(0, 3) };
  guardarAnalisis(db.idDe(i), a);
  return a;
}

// --- Flujo SSE ----------------------------------------------------------------------------------------

const marco = (evento: string, datos: unknown) => `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;

/** El cuerpo SSE de POST /ai/assist/stream: inicio, trozos, fin (o error a mitad con ?ia=corte). */
export function flujo(texto: string, signal?: AbortSignal | null): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  const partes = trozos(texto);
  const corte = mockFlags().ia === 'corte' ? Math.floor(partes.length / 2) : -1;
  const t = tiempos();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const cerrar = () => {
        try {
          controller.close();
        } catch {
          // Ya cerrado.
        }
      };
      try {
        controller.enqueue(enc.encode(marco('inicio', { model: MODELO, disclaimer: DISCLAIMER })));
        await wait(t.pensar, signal);
        for (let n = 0; n < partes.length; n++) {
          if (n === corte) {
            controller.enqueue(enc.encode(marco('error', { error: NO_DISPONIBLE })));
            cerrar();
            return;
          }
          controller.enqueue(enc.encode(marco('trozo', { text: partes[n] })));
          await wait(t.trozo, signal);
        }
        controller.enqueue(enc.encode(marco('fin', {})));
      } catch {
        // Cancelada: el backend corta la generación y cierra.
      }
      cerrar();
    },
  });
}
