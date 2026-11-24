import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TEMAS_CLINICOS, detectarTemas } from "../../backend/src/services/aiTemas.ts";

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
