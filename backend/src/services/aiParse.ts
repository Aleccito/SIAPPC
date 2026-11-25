// Piezas puras del asistente IA (sin base, Redis ni LLM) para poder probarlas.

import { z } from "zod";

export const ideaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  rationale: z.string().trim().min(1).max(1000),
});

export const ideasSchema = z.object({ ideas: z.array(ideaSchema).min(1) });

export type Idea = z.infer<typeof ideaSchema>;

// Los modelos pequeños no siempre respetan la forma pedida: a veces usan las
// claves en español, devuelven el arreglo suelto o dejan una coma colgando.
const TITULO = ["title", "titulo", "título", "hipotesis", "hipótesis", "nombre"];
const MOTIVO = ["rationale", "justificacion", "justificación", "razon", "razón", "motivo", "explicacion", "explicación"];

function primero(obj: Record<string, unknown>, claves: string[]): unknown {
  for (const k of claves) if (obj[k] !== undefined) return obj[k];
  return undefined;
}

function normalizar(valor: unknown): unknown {
  const lista = Array.isArray(valor)
    ? valor
    : valor && typeof valor === "object"
      ? (primero(valor as Record<string, unknown>, ["ideas", "hipotesis", "hipótesis"]) ?? [])
      : [];
  if (!Array.isArray(lista)) return { ideas: [] };
  return {
    ideas: lista.map((i) => {
      const o = (i && typeof i === "object" ? i : {}) as Record<string, unknown>;
      return { title: primero(o, TITULO), rationale: primero(o, MOTIVO) ?? "" };
    }).filter((i) => typeof i.title === "string" && i.title.trim() !== "")
      .map((i) => ({ ...i, rationale: typeof i.rationale === "string" && i.rationale.trim() ? i.rationale : "—" })),
  };
}

/**
 * Saca las ideas de la respuesta del LLM, o null si no hay ninguna utilizable.
 * Tolera ```json ... ```, texto alrededor, arreglo suelto, claves en español y
 * comas colgantes. Con 1 idea basta: mejor algo que nada para el médico.
 */
export function extraerIdeas(texto: string): Idea[] | null {
  const ini = texto.search(/[[{]/);
  const fin = Math.max(texto.lastIndexOf("}"), texto.lastIndexOf("]"));
  if (ini < 0 || fin < ini) return null;
  const json = texto.slice(ini, fin + 1).replace(/,\s*([}\]])/g, "$1");
  try {
    const r = ideasSchema.safeParse(normalizar(JSON.parse(json)));
    return r.success ? sinRepetir(r.data.ideas).slice(0, 4) : null;
  } catch {
    return null;
  }
}

/** Corta un texto libre a `max` caracteres, marcando el recorte. */
export function recortar(texto: string, max: number): string {
  return texto.length <= max ? texto : `${texto.slice(0, max)}… [recortado]`;
}

// Topes del contexto que se manda al modelo: un modelo de 4B con ventana chica
// pierde las instrucciones si el expediente es largo.
export const MAX_CAMPO = 600;
export const MAX_CONTEXTO = 6_000;

// --- Ideas sin repetir ---------------------------------------------------------------------------------------------

const sinTildes = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/** Quita las ideas con el mismo título (sin tildes ni mayúsculas): un modelo chico a veces repite la primera. */
export function sinRepetir(ideas: Idea[]): Idea[] {
  const vistos = new Set<string>();
  return ideas.filter((i) => {
    const k = sinTildes(i.title);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
}

// --- Puntajes de gravedad con los datos reales ----------------------------------------------------------------------
//
// El modelo de 4B no calcula bien: los puntajes llegan calculados en el contexto. Con lo que falte (hoy la PA no
// existe en el backend y la conciencia solo si hay Glasgow) el puntaje sale PARCIAL y dice qué falta; nunca se
// inventa un valor.

export type DatosPuntaje = {
  hr?: number | null;
  resp?: number | null;
  spo2?: number | null;
  temp?: number | null;
  /** Presión sistólica (mmHg). */
  pas?: number | null;
  glasgow?: number | null;
  /** true: con oxígeno suplementario; null: no se sabe. */
  oxigeno?: boolean | null;
};

export type Puntajes = {
  news2: { total: number; parcial: boolean; faltan: string[]; riesgo: "bajo" | "bajo-medio" | "medio" | "alto"; alguno3: boolean };
  qsofa: { total: number; evaluables: number; faltan: string[] };
  /** FC / PAS, o null sin PAS. */
  indiceShock: number | null;
};

const presente = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/** NEWS2 (Royal College of Physicians, 2017), escala 1 de SpO2. */
export function calcularPuntajes(d: DatosPuntaje): Puntajes {
  const faltan: string[] = [];
  const partes: number[] = [];
  const sumar = (v: number | null | undefined, nombre: string, f: (x: number) => number) => {
    if (presente(v)) partes.push(f(v));
    else faltan.push(nombre);
  };
  sumar(d.resp, "FR", (x) => (x <= 8 ? 3 : x <= 11 ? 1 : x <= 20 ? 0 : x <= 24 ? 2 : 3));
  sumar(d.spo2, "SpO2", (x) => (x <= 91 ? 3 : x <= 93 ? 2 : x <= 95 ? 1 : 0));
  if (d.oxigeno === true || d.oxigeno === false) partes.push(d.oxigeno ? 2 : 0);
  else faltan.push("oxígeno suplementario");
  sumar(d.pas, "PA sistólica", (x) => (x <= 90 ? 3 : x <= 100 ? 2 : x <= 110 ? 1 : x <= 219 ? 0 : 3));
  sumar(d.hr, "FC", (x) => (x <= 40 ? 3 : x <= 50 ? 1 : x <= 90 ? 0 : x <= 110 ? 1 : x <= 130 ? 2 : 3));
  sumar(d.glasgow, "conciencia (Glasgow)", (x) => (x >= 15 ? 0 : 3));
  sumar(d.temp, "temperatura", (x) => (x <= 35 ? 3 : x <= 36 ? 1 : x <= 38 ? 0 : x <= 39 ? 1 : 2));
  const total = partes.reduce((a, b) => a + b, 0);
  const alguno3 = partes.some((p) => p === 3);
  const riesgo = total >= 7 ? "alto" : total >= 5 ? "medio" : alguno3 ? "bajo-medio" : "bajo";

  const qFaltan: string[] = [];
  let qTotal = 0;
  let evaluables = 0;
  const q = (v: number | null | undefined, nombre: string, criterio: (x: number) => boolean) => {
    if (!presente(v)) return qFaltan.push(nombre);
    evaluables++;
    if (criterio(v)) qTotal++;
  };
  q(d.resp, "FR", (x) => x >= 22);
  q(d.pas, "PA sistólica", (x) => x <= 100);
  q(d.glasgow, "conciencia (Glasgow)", (x) => x < 15);

  return {
    news2: { total, parcial: faltan.length > 0, faltan, riesgo, alguno3 },
    qsofa: { total: qTotal, evaluables, faltan: qFaltan },
    indiceShock: presente(d.hr) && presente(d.pas) && d.pas > 0 ? Math.round((d.hr / d.pas) * 100) / 100 : null,
  };
}

/** La gravedad que sugiere el riesgo NEWS2. Calculada aquí: el modelo de 4B traducía mal el riesgo a gravedad. */
export function gravedadSugerida(riesgo: Puntajes["news2"]["riesgo"]): "alta" | "moderada" | "baja" {
  return riesgo === "alto" ? "alta" : riesgo === "bajo" ? "baja" : "moderada";
}

/** Los puntajes en una línea para el contexto del modelo, diciendo qué falta. */
export function textoPuntajes(p: Puntajes): string {
  const n = p.news2;
  const news2 = `NEWS2 ${n.parcial ? "parcial " : ""}${n.total} (riesgo ${n.riesgo}${n.alguno3 ? ", algún parámetro en 3" : ""}${n.parcial ? `; sin ${n.faltan.join(", ")}` : ""})`;
  const qsofa = p.qsofa.evaluables
    ? `qSOFA ${p.qsofa.total} de ${p.qsofa.evaluables} criterios evaluables${p.qsofa.faltan.length ? ` (sin ${p.qsofa.faltan.join(", ")})` : ""}`
    : "qSOFA no evaluable";
  const shock = p.indiceShock === null ? "índice de shock no calculable (sin PA)" : `índice de shock ${p.indiceShock}`;
  const gravedad = `Gravedad sugerida por el NEWS2: ${gravedadSugerida(n.riesgo)}${n.parcial ? " (puede ser mayor: el puntaje es parcial)" : ""}`;
  return `Puntajes calculados por el sistema: ${news2}; ${qsofa}; ${shock}. ${gravedad}.`;
}

// --- Formato del contexto para el modelo -----------------------------------------------------------------------------

const NOMBRE_SIGNO: Record<string, string> = { hr: "FC", spo2: "SpO2", resp: "FR", temp: "Temperatura", pr: "Pulso", perfusion: "Índice de perfusión", ecg: "ECG" };
/** "hr" → "FC": el modelo entiende mejor los nombres clínicos que los códigos. */
export const nombreSigno = (codigo: string) => NOMBRE_SIGNO[codigo] ?? codigo;

/** "hace 2 min", "hace 3 h", "hace 2 días": más corto y claro para el modelo que una fecha ISO. */
export function haceTexto(fecha: Date, ahora = Date.now()): string {
  const min = Math.max(0, Math.round((ahora - fecha.getTime()) / 60_000));
  if (min < 1) return "hace menos de 1 min";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 48) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} días`;
}

const SANGRE: Record<string, string> = { A_POS: "A+", A_NEG: "A-", B_POS: "B+", B_NEG: "B-", AB_POS: "AB+", AB_NEG: "AB-", O_POS: "O+", O_NEG: "O-" };
/** "A_POS" (nombre del enum de Prisma) → "A+". */
export const grupoSanguineo = (v: string | null | undefined) => (v ? (SANGRE[v] ?? v) : "sin registrar");

const ESTADO: Record<string, string> = { waiting: "en espera", inService: "en atención", discharged: "de alta" };
/** "inService" → "en atención". */
export const estadoPaciente = (v: string | null | undefined) => (v ? (ESTADO[v] ?? v) : "sin registrar");

const SEXO: Record<string, string> = { M: "masculino", F: "femenino", O: "otro" };
export const sexoPaciente = (v: string | null | undefined) => (v ? (SEXO[v] ?? v) : "sin registrar");

const SEVERIDAD: Record<string, string> = { baja: "baja", media: "media", alta: "alta", critica: "crítica" };
const ALERTA: Record<string, string> = {
  hr_fuera_de_rango: "FC fuera de rango",
  pr_fuera_de_rango: "Pulso fuera de rango",
  spo2_bajo: "SpO2 baja",
  resp_fuera_de_rango: "FR fuera de rango",
  perfusion_baja: "Perfusión baja (SpO2 poco fiable)",
};
/** "spo2_bajo" → "SpO2 baja". */
export const nombreAlerta = (tipo: string) => ALERTA[tipo] ?? tipo.replace(/_/g, " ");

const redondear = (v: number) => Math.round(v * 10) / 10;

export type GrupoAlertas = { tipo: string; severidad: string; veces: number; ultima: Date | null; mensaje: string | null };

/**
 * Las alertas resumidas por tipo. El backend crea una por lectura fuera de rango (cada 30 s mientras dure): antes se
 * mandaban las 5 últimas, que eran la misma repetida, y el total de abiertas sin decir de cuándo.
 */
export function textoAlertas(d: { abiertas: number; recientes: number; grupos: GrupoAlertas[] }, ahora = Date.now()): string {
  const grupos = [...d.grupos].sort((a, b) => (b.ultima?.getTime() ?? 0) - (a.ultima?.getTime() ?? 0));
  const detalle = grupos.map((g) =>
    `${nombreAlerta(g.tipo)} (${SEVERIDAD[g.severidad] ?? g.severidad}): ${g.veces} ${g.veces === 1 ? "vez" : "veces"}${g.ultima ? `, la última ${haceTexto(g.ultima, ahora)}` : ""}${g.mensaje ? ` («${g.mensaje}»)` : ""}`);
  const sinAtender = d.abiertas === 0
    ? "Sin alertas abiertas."
    : `Abiertas sin atender: ${d.abiertas} (${d.recientes} de los últimos 30 min; las demás son anteriores).`;
  return `Alertas de las últimas 6 h por tipo: ${detalle.join("; ") || "ninguna"}. ${sinAtender}`;
}

export type FilaSerie = { signo: string; horasAtras: number; promedio: number };

// Cambio que cuenta como "subiendo" o "bajando" entre la primera y la última hora, por signo.
const CAMBIO: Record<string, number> = { hr: 6, pr: 6, spo2: 2, resp: 3, temp: 0.4, pa: 8 };

/** subiendo | bajando | estable, con un umbral por signo y no un porcentaje (antes casi todo salía "estable"). */
export function rumbo(signo: string, antes: number, ahora: number): "subiendo" | "bajando" | "estable" {
  const umbral = CAMBIO[signo] ?? Math.abs(antes) * 0.05;
  if (ahora - antes >= umbral) return "subiendo";
  if (antes - ahora >= umbral) return "bajando";
  return "estable";
}

/** El promedio de cada hora, de la más vieja a la actual, por signo. Para preguntas de evolución y de turno. */
export function textoSerie(filas: FilaSerie[], unidades: Record<string, string> = {}): string {
  const porSigno = new Map<string, FilaSerie[]>();
  for (const f of filas) porSigno.set(f.signo, [...(porSigno.get(f.signo) ?? []), f]);
  const partes = [...porSigno].map(([signo, fs]) => {
    const orden = [...fs].sort((a, b) => b.horasAtras - a.horasAtras);
    const valores = orden.map((f) => `${f.horasAtras === 0 ? "última hora" : `hace ${f.horasAtras + 1} h`} ${redondear(f.promedio)}`);
    const r = orden.length > 1 ? `, ${rumbo(signo, orden[0].promedio, orden[orden.length - 1].promedio)}` : "";
    return `${nombreSigno(signo)}${unidades[signo] ? ` (${unidades[signo]})` : ""}: ${valores.join(" · ")}${r}`;
  });
  // El resumen también va calculado: con todo estable, el modelo concluía "mejora".
  const cambios = [...porSigno]
    .map(([signo, fs]) => {
      const orden = [...fs].sort((a, b) => b.horasAtras - a.horasAtras);
      if (orden.length < 2) return null;
      const r = rumbo(signo, orden[0].promedio, orden[orden.length - 1].promedio);
      return r === "estable" ? null : `${nombreSigno(signo)} ${r}`;
    })
    .filter(Boolean);
  const resumen = partes.length ? ` Resumen de la serie: ${cambios.length ? cambios.join(", ") : "sin cambios en 6 h"}.` : "";
  return `Serie por hora de las últimas 6 h (promedio de cada hora): ${partes.join("; ") || "sin lecturas"}.${resumen}`;
}

/**
 * Lo que el modelo necesitaría y el expediente no tiene, dicho en el contexto para que lo pida en vez de suponerlo.
 * La función renal y los laboratorios no existen en el sistema; la PA, todavía no (pedido 10 de CONEXION-BACKEND.md).
 */
export function datosFaltantes(d: { peso: boolean; glasgow: boolean; pa: boolean }): string {
  const faltan = [
    !d.peso && "peso",
    "función renal y demás laboratorios",
    !d.pa && "presión arterial",
    !d.glasgow && "Glasgow (estado de conciencia)",
    "si recibe oxígeno suplementario",
  ].filter(Boolean);
  return `Datos que no hay en el expediente: ${faltan.join(", ")}.`;
}

// --- Prioridad del modelo: las consultas del médico primero --------------------------------------------------------

/**
 * El modelo atiende de a uno. Mientras haya una consulta del médico en curso, el análisis automático espera; y si ya
 * estaba corriendo cuando llega una consulta, se le avisa para que se corte y se reintente después.
 */
export function crearPrioridad() {
  let enCurso = 0;
  let ultimoFin = 0;
  const avisos = new Set<() => void>();
  return {
    /** Una consulta empieza. Devuelve la función que la termina (se puede llamar más de una vez). */
    empieza(): () => void {
      enCurso++;
      for (const f of [...avisos]) f();
      let hecho = false;
      return () => {
        if (hecho) return;
        hecho = true;
        enCurso--;
        ultimoFin = Date.now();
      };
    },
    ocupado: () => enCurso > 0,
    /**
     * Resuelve cuando no hay consultas en curso y pasaron `calmaMs` desde la última, o a los `maxMs` como mucho. La
     * calma es porque un médico suele hacer varias preguntas seguidas: sin ella, el análisis automático arrancaba en
     * la pausa entre dos y demoraba la siguiente.
     */
    async esperarLibre(cadaMs = 500, maxMs = 10 * 60_000, calmaMs = 0): Promise<void> {
      const t0 = Date.now();
      const ocupado = () => enCurso > 0 || Date.now() - ultimoFin < calmaMs;
      while (ocupado() && Date.now() - t0 < maxMs) await new Promise((r) => setTimeout(r, cadaMs));
    },
    /** Llama a `f` cada vez que empieza una consulta. Devuelve cómo dejar de escuchar. */
    alEmpezar(f: () => void): () => void {
      avisos.add(f);
      return () => {
        avisos.delete(f);
      };
    },
  };
}
