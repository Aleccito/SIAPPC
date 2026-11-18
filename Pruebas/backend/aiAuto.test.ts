import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { debeDisparar } from "../../backend/src/services/aiCooldown.ts";

// Solo la regla de enfriamiento/escalada: no toca base, Redis ni el LLM.
const COOLDOWN = 300_000;

describe("aiAuto: enfriamiento por paciente", () => {
  it("dispara si el paciente no tiene análisis previo", () => {
    assert.equal(debeDisparar(undefined, "alta", 0, COOLDOWN), true);
  });

  it("no relanza dentro del enfriamiento con la misma severidad", () => {
    assert.equal(debeDisparar({ at: 0, severity: "alta" }, "alta", COOLDOWN - 1, COOLDOWN), false);
    assert.equal(debeDisparar({ at: 0, severity: "critica" }, "critica", 1_000, COOLDOWN), false);
  });

  it("no relanza si baja de crítica a alta dentro del enfriamiento", () => {
    assert.equal(debeDisparar({ at: 0, severity: "critica" }, "alta", 1_000, COOLDOWN), false);
  });

  it("relanza dentro del enfriamiento si escala de alta a crítica", () => {
    assert.equal(debeDisparar({ at: 0, severity: "alta" }, "critica", 1_000, COOLDOWN), true);
  });

  it("relanza al cumplirse el enfriamiento", () => {
    assert.equal(debeDisparar({ at: 0, severity: "critica" }, "alta", COOLDOWN, COOLDOWN), true);
  });
});
