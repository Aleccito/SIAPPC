import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  INSTRUCCION,
  PARAMETROS,
  PROMPT_BASE,
  PROMPT_IDEAS,
  TEMAS_CLINICOS,
  detectarTemas,
  detectarTipo,
  mensajesDe,
  promptDe,
  temasDelTipo,
  type TipoPregunta,
} from "../../backend/src/services/aiTemas.ts";

const temas = (pregunta: string) => [...detectarTemas(pregunta)].sort();
const incluyeClinico = (pregunta: string) => {
  const t = detectarTemas(pregunta);
  return TEMAS_CLINICOS.every((c) => t.has(c));
};

describe("detectarTemas: preguntas puntuales mandan solo su sección", () => {
  const casos: [string, string[]][] = [
    ["¿Cuántos años tiene el paciente?", ["basico"]],
    ["que medico esta a cargo de este paciente? ( nombre)", ["equipo"]],
    ["¿En qué cama está?", ["ubicacion"]],
    ["¿Qué alertas tuvo hoy?", ["alertas"]],
    ["¿Cuánto pesa?", ["exploracion"]],
    ["¿Cuál es su Glasgow?", ["exploracion"]],
    ["¿Cuándo es su próxima cita?", ["citas"]],
    ["¿Qué cirugías tiene?", ["procedimientos"]],
    ["¿Cómo va su saturación?", ["vitales"]],
  ];
  for (const [pregunta, esperado] of casos) {
    it(pregunta, () => assert.deepEqual(temas(pregunta), esperado));
  }

  it("ignora tildes y mayúsculas", () => {
    assert.deepEqual(temas("MÉDICO A CARGO"), temas("medico a cargo"));
  });

  it("combina varios temas", () => {
    assert.deepEqual(temas("¿Qué médico lo atiende y en qué cama está?"), ["equipo", "ubicacion"]);
  });
});

describe("detectarTemas: ante la duda, todo lo clínico", () => {
  const abiertas = [
    // Las 5 preguntas rápidas de la pantalla.
    "¿Cuáles son los diagnósticos diferenciales más probables?",
    "¿Qué banderas rojas debo vigilar en este paciente?",
    "¿Qué estudios de laboratorio e imagen solicitarías?",
    "Revisa alergias e interacciones de sus medicamentos activos.",
    "¿Cuál sería el manejo inicial recomendado?",
    // Nombran un tema puntual pero piden razonar.
    "¿Puede tomar ibuprofeno a su edad?",
    "¿Por qué tiene alertas?",
    // Sin nada reconocible.
    "hola",
    "",
  ];
  for (const pregunta of abiertas) {
    it(pregunta || "(vacía)", () => assert.ok(incluyeClinico(pregunta)));
  }
});

// --- Tipo de respuesta ----------------------------------------------------------------------------------------------

describe("detectarTipo: cada pregunta recibe la forma de respuesta que pide", () => {
  // Las 15 del set de prototipo/REVISION-IA-RESPUESTAS.md, más las preguntas rápidas de la pantalla.
  const casos: [string, TipoPregunta][] = [
    ["¿Gravedad de este paciente?", "gravedad"],
    ["¿Cuáles son los diagnósticos diferenciales más probables?", "diferenciales"],
    ["¿Cuál sería el manejo inicial?", "manejo"],
    ["¿Cómo han evolucionado sus signos en las últimas horas?", "evolucion"],
    ["¿Cuál es su última saturación?", "dato"],
    ["¿Qué dosis de enoxaparina le corresponde?", "farmaco"],
    ["¿Qué tiene este paciente?", "analisis"],
    ["¿Qué estudios solicitarías?", "estudios"],
    ["Revisa alergias e interacciones", "farmaco"],
    ["Resumen para entregar el turno", "turno"],
    ["¿Qué medicamentos tiene indicados?", "dato"],
    ["¿Está grave?", "gravedad"],
    ["¿Qué banderas rojas vigilar?", "banderas"],
    ["¿Puedo darle tramadol?", "farmaco"],
    ["¿Qué alergias tiene?", "dato"],
    // Preguntas rápidas (prototipo/src/components/ai/aiText.ts).
    ["¿Qué tan grave está este paciente?", "gravedad"],
    ["¿Qué banderas rojas debo vigilar en este paciente?", "banderas"],
    ["¿Qué estudios de laboratorio e imagen solicitarías?", "estudios"],
    ["Revisa alergias e interacciones de sus medicamentos activos.", "farmaco"],
    ["¿Cuál sería el manejo inicial recomendado?", "manejo"],
    ["Resumen para entregar el turno.", "turno"],
    // Otras formas comunes.
    ["¿Está estable?", "gravedad"],
    ["¿Puede tomar ibuprofeno a su edad?", "farmaco"],
    ["¿Debo suspender la enoxaparina?", "farmaco"],
    ["¿Quién es el médico a cargo?", "dato"],
    ["¿En qué cama está?", "dato"],
    ["Analiza al paciente", "analisis"],
    // Riesgo y pronóstico (prototipo/REVISION-DETALLES.md, A5): antes caían en "dato" o en el análisis completo.
    ["¿Cuál es la probabilidad de muerte de este paciente?", "pronostico"],
    ["¿Cuál es su pronóstico?", "pronostico"],
    ["¿Qué riesgo de mortalidad tiene?", "pronostico"],
    ["¿Qué probabilidad tiene de sobrevivir?", "pronostico"],
    ["¿Se va a morir?", "pronostico"],
    ["¿Qué riesgo tiene?", "gravedad"],
    ["¿Cuál es su riesgo de deterioro?", "gravedad"],
    // "Probabilidad" sola no es pronóstico.
    ["¿Qué probabilidad hay de que sea un TEP?", "dato"],
  ];
  for (const [pregunta, tipo] of casos) {
    it(`${pregunta} → ${tipo}`, () => assert.equal(detectarTipo(pregunta), tipo));
  }

  it("con síntomas escritos y sin tipo reconocible, es un análisis", () => {
    assert.equal(detectarTipo("dolor torácico y disnea", true), "analisis");
  });

  it("una pregunta que pide razonar sin tipo reconocible es un análisis, no un dato", () => {
    assert.equal(detectarTipo("¿Por qué tiene alertas?"), "analisis");
  });
});

describe("tipos: temas, topes y prompts", () => {
  const tipos = Object.keys(PARAMETROS) as TipoPregunta[];

  it("un dato no agrega secciones; los demás tipos, todo lo clínico", () => {
    assert.deepEqual(temasDelTipo("dato"), []);
    for (const t of tipos.filter((x) => x !== "dato")) {
      assert.ok(TEMAS_CLINICOS.every((c) => temasDelTipo(t).includes(c)), t);
    }
  });

  it("evolución y turno reciben la serie por hora", () => {
    assert.ok(temasDelTipo("evolucion").includes("serie"));
    assert.ok(temasDelTipo("turno").includes("serie"));
  });

  it("los topes van de corto (dato) a largo (análisis)", () => {
    // Gravedad y pronóstico: el riesgo lo escribe el backend y el modelo solo agrega una línea.
    assert.ok(PARAMETROS.gravedad.maxTokens <= PARAMETROS.dato.maxTokens);
    assert.equal(PARAMETROS.pronostico.maxTokens, PARAMETROS.gravedad.maxTokens);
    assert.ok(PARAMETROS.dato.maxTokens < PARAMETROS.turno.maxTokens);
    assert.ok(tipos.every((t) => PARAMETROS[t].maxTokens <= PARAMETROS.analisis.maxTokens));
  });

  it("la plantilla de 5 secciones solo está en el análisis completo", () => {
    for (const t of tipos) {
      const tiene = /\*\*Banderas rojas\*\*[\s\S]*\*\*Diferenciales\*\*[\s\S]*\*\*Estudios\*\*/.test(promptDe(t));
      assert.equal(tiene, t === "analisis", t);
    }
  });

  // Un modelo chico copia los ejemplos: antes salían "Dr. Pérez" y "SpO2 86 %, FR 28" en pacientes que no los tenían.
  const prompts: [string, string][] = [...tipos.map((t): [string, string] => [t, promptDe(t)]), ["ideas", PROMPT_IDEAS]];
  for (const [nombre, texto] of prompts) {
    it(`el prompt de ${nombre} no trae valores ni nombres que copiar`, () => {
      assert.doesNotMatch(texto, /\d+([.,]\d+)?\s*(%|lpm|rpm|mmHg|°C|kg|mg|ml|mEq)/i);
      assert.doesNotMatch(texto, /\b(SpO2|FC|FR|PA|T)\s*[:=]?\s*\d/);
      assert.doesNotMatch(texto, /\bDra?\.\s|P[eé]rez|M[eé]ndez/);
      assert.match(texto, /<datos_paciente>/);
    });
  }

  it("el mensaje de sistema es el mismo para todos los tipos y la instrucción va al final", () => {
    // Así Ollama reutiliza lo ya leído entre dos preguntas del mismo paciente.
    const sistemas = new Set(tipos.map((t) => mensajesDe(t, "ctx", "preg")[0][1]));
    assert.equal(sistemas.size, 1);
    for (const t of tipos) {
      const [[rolS], [rolH, humano]] = mensajesDe(t, "ctx", "preg");
      assert.deepEqual([rolS, rolH], ["system", "human"]);
      assert.ok(humano.endsWith(INSTRUCCION[t]), t);
      assert.ok(humano.indexOf("ctx") < humano.indexOf("preg"), t);
    }
  });

  it("el prompt base pide el peso antes de una dosis que depende de él", () => {
    assert.match(PROMPT_BASE, /dosis que depende del peso/i);
    assert.match(promptDe("farmaco"), /NO des la dosis/);
  });
});
