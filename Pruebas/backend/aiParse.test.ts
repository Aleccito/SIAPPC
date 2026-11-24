import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extraerIdeas, recortar } from "../../backend/src/services/aiParse.ts";

// Parseo de la respuesta del LLM y recorte del contexto: sin base, Redis ni LLM.
const dos = '{"ideas":[{"title":"Sepsis","rationale":"FC y T altas"},{"title":"Hipovolemia","rationale":"PA baja"}]}';

describe("aiParse: extraerIdeas", () => {
  it("acepta JSON limpio con 2 ideas", () => {
    assert.equal(extraerIdeas(dos)?.length, 2);
  });

  it("acepta JSON envuelto en ```json y con texto alrededor", () => {
    assert.equal(extraerIdeas(`Claro:\n\`\`\`json\n${dos}\n\`\`\`\nSaludos`)?.[0].title, "Sepsis");
  });

  it("rechaza JSON roto", () => {
    assert.equal(extraerIdeas('{"ideas":[{"title":"x",'), null);
  });

  it("rechaza texto sin JSON", () => {
    assert.equal(extraerIdeas("No puedo ayudar con eso."), null);
  });

  it("acepta una sola idea", () => {
    assert.equal(extraerIdeas('{"ideas":[{"title":"Sepsis","rationale":"x"}]}')?.length, 1);
  });

  it("descarta ideas sin título y conserva las demás", () => {
    assert.deepEqual(
      extraerIdeas('{"ideas":[{"title":"","rationale":"x"},{"title":"y","rationale":"z"}]}'),
      [{ title: "y", rationale: "z" }],
    );
  });

  it("rechaza si ninguna idea tiene título", () => {
    assert.equal(extraerIdeas('{"ideas":[{"title":"","rationale":"x"}]}'), null);
  });

  it("acepta claves en español", () => {
    const r = extraerIdeas('{"ideas":[{"titulo":"TEP","justificación":"SpO2 89 %"}]}');
    assert.deepEqual(r, [{ title: "TEP", rationale: "SpO2 89 %" }]);
  });

  it("acepta el arreglo suelto, sin {ideas}", () => {
    assert.equal(extraerIdeas('[{"title":"FA","rationale":"FC 148"},{"title":"SCA","rationale":"dolor"}]')?.length, 2);
  });

  it("tolera comas colgantes", () => {
    assert.equal(extraerIdeas('{"ideas":[{"title":"FA","rationale":"FC 148",},]}')?.length, 1);
  });

  it("sin justificación pone un guion", () => {
    assert.equal(extraerIdeas('{"ideas":[{"title":"FA"}]}')?.[0].rationale, "—");
  });
});

describe("aiParse: recortar", () => {
  it("deja igual un texto dentro del tope", () => {
    assert.equal(recortar("hola", 10), "hola");
  });

  it("corta y marca un texto largo", () => {
    const r = recortar("a".repeat(20), 10);
    assert.ok(r.startsWith("a".repeat(10)));
    assert.ok(r.endsWith("[recortado]"));
  });
});
