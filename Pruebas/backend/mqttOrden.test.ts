import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ColaPorClave, clasificarLectura, topicCompartido } from "../../backend/src/services/mqttOrden.ts";

// Consistencia en tiempo real de la ingesta MQTT, con datos de prueba
// generados: sin base, Redis ni broker.

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Generador determinista (LCG) para que una falla se pueda reproducir.
function aleatorio(semilla: number) {
  let s = semilla;
  return () => ((s = (s * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
}

describe("ColaPorClave: orden por equipo", () => {
  it("procesa los mensajes de un equipo en orden aunque cada uno tarde distinto", async () => {
    const cola = new ColaPorClave();
    const azar = aleatorio(42);
    const procesados: number[] = [];

    // 50 lecturas de la misma cama; las primeras tardan MÁS: sin la cola,
    // terminarían al revés.
    const trabajos = Array.from({ length: 50 }, (_, i) =>
      cola.encolar("CAMA-01", async () => {
        await espera(Math.floor(azar() * 5) + (50 - i) / 10);
        procesados.push(i);
      }, assert.fail),
    );
    await Promise.all(trabajos);

    assert.deepEqual(procesados, Array.from({ length: 50 }, (_, i) => i));
  });

  it("mantiene el orden dentro de cada equipo con varios equipos mezclados", async () => {
    const cola = new ColaPorClave();
    const azar = aleatorio(7);
    const equipos = ["CAMA-01", "CAMA-02", "CAMA-03", "CAMA-04"];
    const porEquipo = new Map<string, number[]>(equipos.map((e) => [e, []]));
    const contador = new Map<string, number>(equipos.map((e) => [e, 0]));

    // 200 mensajes intercalados al azar entre 4 camas.
    const trabajos = Array.from({ length: 200 }, () => {
      const equipo = equipos[Math.floor(azar() * equipos.length)];
      const seq = contador.get(equipo)!;
      contador.set(equipo, seq + 1);
      const demora = Math.floor(azar() * 4);
      return cola.encolar(equipo, async () => {
        await espera(demora);
        porEquipo.get(equipo)!.push(seq);
      }, assert.fail);
    });
    await Promise.all(trabajos);

    for (const [equipo, seqs] of porEquipo) {
      assert.deepEqual(seqs, [...seqs].sort((a, b) => a - b), `desorden en ${equipo}`);
      assert.equal(seqs.length, contador.get(equipo));
    }
  });

  it("equipos distintos corren en paralelo, no uno detrás de otro", async () => {
    const cola = new ColaPorClave();
    const inicio = Date.now();
    await Promise.all(
      ["A", "B", "C", "D", "E"].map((e) => cola.encolar(e, () => espera(100), assert.fail)),
    );
    // En serie serían ~500 ms.
    assert.ok(Date.now() - inicio < 300, `tardó ${Date.now() - inicio} ms`);
  });

  it("un mensaje que falla no frena a los siguientes del mismo equipo", async () => {
    const cola = new ColaPorClave();
    const errores: unknown[] = [];
    const procesados: number[] = [];
    await Promise.all([
      cola.encolar("X", async () => { procesados.push(1); }, (e) => errores.push(e)),
      cola.encolar("X", async () => { throw new Error("lectura mala"); }, (e) => errores.push(e)),
      cola.encolar("X", async () => { procesados.push(3); }, (e) => errores.push(e)),
    ]);
    assert.deepEqual(procesados, [1, 3]);
    assert.equal(errores.length, 1);
  });

  it("libera la entrada del equipo al vaciarse su cola", async () => {
    const cola = new ColaPorClave();
    await cola.encolar("CAMA-09", () => espera(1), assert.fail);
    await espera(5);
    assert.equal(cola.pendientes, 0);
  });
});

describe("clasificarLectura: atrasadas y futuras", () => {
  const AHORA = Date.UTC(2026, 10, 22, 12, 0, 0);
  const ATRASO = 60_000;
  const ADELANTO = 5_000;
  const clasificar = (desfaseMs: number) =>
    clasificarLectura((AHORA + desfaseMs) / 1000, AHORA, ATRASO, ADELANTO);

  it("en vivo: de ahora y hasta el límite de atraso", () => {
    assert.equal(clasificar(0), "en_vivo");
    assert.equal(clasificar(-59_999), "en_vivo");
    assert.equal(clasificar(-60_000), "en_vivo");
  });

  it("atrasada: más vieja que el límite (buffer de la Pi tras un corte)", () => {
    assert.equal(clasificar(-60_001), "atrasada");
    assert.equal(clasificar(-3_600_000), "atrasada");
  });

  it("futura: reloj adelantado más allá de la tolerancia", () => {
    assert.equal(clasificar(5_000), "en_vivo");
    assert.equal(clasificar(5_001), "futura");
    assert.equal(clasificar(86_400_000), "futura");
  });

  it("simulación: corte de 5 min y vaciado del buffer", () => {
    // Una lectura por segundo durante 6 min; la red cae del minuto 0 al 5 y al
    // volver la Pi manda todo de golpe en el instante AHORA.
    const lecturas = Array.from({ length: 360 }, (_, i) => AHORA - (360 - i) * 1000);
    const clases = lecturas.map((ms) => clasificarLectura(ms / 1000, AHORA, ATRASO, ADELANTO));
    assert.equal(clases.filter((c) => c === "en_vivo").length, 60);
    assert.equal(clases.filter((c) => c === "atrasada").length, 300);
    assert.equal(clases.filter((c) => c === "futura").length, 0);
  });
});

describe("topicCompartido", () => {
  it("sin grupo deja el topic igual", () => {
    assert.equal(topicCompartido("siappc/+/telemetry", undefined), "siappc/+/telemetry");
  });

  it("con grupo antepone $share", () => {
    assert.equal(topicCompartido("siappc/+/telemetry", "backend"), "$share/backend/siappc/+/telemetry");
  });
});
