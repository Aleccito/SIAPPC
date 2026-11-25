import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calcularPuntajes,
  crearPrioridad,
  datosFaltantes,
  estadoPaciente,
  extraerIdeas,
  gravedadSugerida,
  grupoSanguineo,
  haceTexto,
  nombreSigno,
  rumbo,
  textoAlertas,
  textoPuntajes,
  textoSerie,
} from "../../backend/src/services/aiParse.ts";

// Lo que el contexto del modelo recibe ya calculado y en español (backend/src/lib/clinicalAi.ts). Sin base, Redis ni LLM.

const normal = { resp: 16, spo2: 98, oxigeno: false, pas: 120, hr: 70, glasgow: 15, temp: 37 };

describe("NEWS2 (RCP 2017, escala 1 de SpO2)", () => {
  it("todo normal: 0, riesgo bajo, completo", () => {
    const { news2 } = calcularPuntajes(normal);
    assert.deepEqual([news2.total, news2.riesgo, news2.parcial], [0, "bajo", false]);
  });

  it("un solo parámetro en 3 sube a riesgo bajo-medio", () => {
    const { news2 } = calcularPuntajes({ ...normal, resp: 7 });
    assert.deepEqual([news2.total, news2.riesgo, news2.alguno3], [3, "bajo-medio", true]);
  });

  it("5 puntos: riesgo medio", () => {
    // FR 22 (2) + SpO2 95 (1) + PAS 105 (1) + FC 95 (1).
    const { news2 } = calcularPuntajes({ ...normal, resp: 22, spo2: 95, pas: 105, hr: 95 });
    assert.deepEqual([news2.total, news2.riesgo], [5, "medio"]);
  });

  it("paciente grave: 15, riesgo alto", () => {
    // FR 25 (3) + SpO2 92 (2) + O2 (2) + PAS 95 (2) + FC 115 (2) + Glasgow 14 (3) + T 38,5 (1).
    const { news2 } = calcularPuntajes({ resp: 25, spo2: 92, oxigeno: true, pas: 95, hr: 115, glasgow: 14, temp: 38.5 });
    assert.deepEqual([news2.total, news2.riesgo], [15, "alto"]);
  });

  it("límites de cada parámetro", () => {
    const solo = (d: Partial<typeof normal>) => calcularPuntajes({ ...normal, ...d }).news2.total;
    assert.deepEqual([8, 9, 11, 12, 20, 21, 24, 25].map((resp) => solo({ resp })), [3, 1, 1, 0, 0, 2, 2, 3]);
    assert.deepEqual([91, 92, 93, 94, 95, 96].map((spo2) => solo({ spo2 })), [3, 2, 2, 1, 1, 0]);
    assert.deepEqual([90, 91, 100, 101, 110, 111, 219, 220].map((pas) => solo({ pas })), [3, 2, 2, 1, 1, 0, 0, 3]);
    assert.deepEqual([40, 41, 50, 51, 90, 91, 110, 111, 130, 131].map((hr) => solo({ hr })), [3, 1, 1, 0, 0, 1, 1, 2, 2, 3]);
    assert.deepEqual([35, 35.1, 36, 36.1, 38, 38.1, 39, 39.1].map((temp) => solo({ temp })), [3, 1, 1, 0, 0, 1, 1, 2]);
  });

  it("sin PA, conciencia ni oxígeno: parcial, dice qué falta y no inventa", () => {
    // Como DEMO-0002 hoy: FR 25 (3) + SpO2 92 (2) + FC 119 (2) + T 37,6 (0).
    const p = calcularPuntajes({ hr: 119, resp: 25, spo2: 92, temp: 37.6 });
    assert.equal(p.news2.total, 7);
    assert.equal(p.news2.parcial, true);
    assert.deepEqual(p.news2.faltan, ["oxígeno suplementario", "PA sistólica", "conciencia (Glasgow)"]);
    const texto = textoPuntajes(p);
    assert.match(texto, /NEWS2 parcial 7 \(riesgo alto, algún parámetro en 3; sin oxígeno suplementario, PA sistólica, conciencia \(Glasgow\)\)/);
    assert.match(texto, /índice de shock no calculable \(sin PA\)/);
    assert.match(texto, /Gravedad sugerida por el NEWS2: alta \(puede ser mayor: el puntaje es parcial\)\.$/);
  });

  it("gravedad sugerida según el riesgo", () => {
    assert.deepEqual(
      (["bajo", "bajo-medio", "medio", "alto"] as const).map(gravedadSugerida),
      ["baja", "moderada", "moderada", "alta"],
    );
  });
});

describe("qSOFA e índice de shock", () => {
  it("los tres criterios", () => {
    const p = calcularPuntajes({ resp: 22, pas: 100, glasgow: 14 });
    assert.deepEqual([p.qsofa.total, p.qsofa.evaluables], [3, 3]);
  });

  it("ninguno", () => {
    const p = calcularPuntajes({ resp: 21, pas: 101, glasgow: 15 });
    assert.deepEqual([p.qsofa.total, p.qsofa.evaluables], [0, 3]);
  });

  it("solo con FR: 1 de 1 evaluable, dice qué falta", () => {
    const p = calcularPuntajes({ resp: 28 });
    assert.deepEqual([p.qsofa.total, p.qsofa.evaluables, p.qsofa.faltan], [1, 1, ["PA sistólica", "conciencia (Glasgow)"]]);
    assert.match(textoPuntajes(p), /qSOFA 1 de 1 criterios evaluables \(sin PA sistólica, conciencia \(Glasgow\)\)/);
  });

  it("índice de shock = FC / PAS", () => {
    assert.equal(calcularPuntajes({ hr: 120, pas: 100 }).indiceShock, 1.2);
    assert.equal(calcularPuntajes({ hr: 120 }).indiceShock, null);
  });
});

describe("contexto en español clínico", () => {
  it("nombres y valores internos", () => {
    assert.deepEqual(["hr", "spo2", "resp", "temp"].map(nombreSigno), ["FC", "SpO2", "FR", "Temperatura"]);
    assert.equal(grupoSanguineo("A_POS"), "A+");
    assert.equal(grupoSanguineo(null), "sin registrar");
    assert.equal(estadoPaciente("inService"), "en atención");
  });

  it("tiempo relativo en vez de ISO", () => {
    const ahora = Date.parse("2026-11-25T12:00:00Z");
    assert.equal(haceTexto(new Date(ahora - 20_000), ahora), "hace menos de 1 min");
    assert.equal(haceTexto(new Date(ahora - 5 * 60_000), ahora), "hace 5 min");
    assert.equal(haceTexto(new Date(ahora - 3 * 3_600_000), ahora), "hace 3 h");
    assert.equal(haceTexto(new Date(ahora - 3 * 86_400_000), ahora), "hace 3 días");
  });

  it("alertas resumidas por tipo y no repetidas", () => {
    const ahora = Date.parse("2026-11-25T12:00:00Z");
    const t = textoAlertas({
      abiertas: 58,
      recientes: 12,
      grupos: [{ tipo: "spo2_bajo", severidad: "alta", veces: 52, ultima: new Date(ahora - 60_000), mensaje: "SpO2 89% bajo" }],
    }, ahora);
    assert.equal(t, "Alertas de las últimas 6 h por tipo: SpO2 baja (alta): 52 veces, la última hace 1 min («SpO2 89% bajo»). Abiertas sin atender: 58 (12 de los últimos 30 min; las demás son anteriores).");
    assert.match(textoAlertas({ abiertas: 0, recientes: 0, grupos: [] }), /ninguna\. Sin alertas abiertas\./);
  });

  it("rumbo con umbral por signo", () => {
    assert.equal(rumbo("hr", 108, 119), "subiendo");
    assert.equal(rumbo("spo2", 93, 92), "estable");
    assert.equal(rumbo("spo2", 94, 90), "bajando");
    assert.equal(rumbo("temp", 37.2, 37.5), "estable");
  });

  it("serie por hora de la más vieja a la actual", () => {
    const t = textoSerie([
      { signo: "hr", horasAtras: 0, promedio: 119.04 },
      { signo: "hr", horasAtras: 2, promedio: 108 },
      { signo: "hr", horasAtras: 1, promedio: 112.5 },
    ], { hr: "lpm" });
    assert.equal(t, "Serie por hora de las últimas 6 h (promedio de cada hora): FC (lpm): hace 3 h 108 · hace 2 h 112.5 · última hora 119, subiendo. Resumen de la serie: FC subiendo.");
  });

  it("serie sin cambios: lo dice el resumen, no el modelo", () => {
    const t = textoSerie([
      { signo: "spo2", horasAtras: 0, promedio: 91 },
      { signo: "spo2", horasAtras: 3, promedio: 91.4 },
    ]);
    assert.match(t, /Resumen de la serie: sin cambios en 6 h\.$/);
  });

  it("dice lo que no hay en el expediente", () => {
    assert.equal(datosFaltantes({ peso: false, glasgow: false, pa: false }),
      "Datos que no hay en el expediente: peso, función renal y demás laboratorios, presión arterial, Glasgow (estado de conciencia), si recibe oxígeno suplementario.");
    assert.doesNotMatch(datosFaltantes({ peso: true, glasgow: true, pa: false }), /peso|Glasgow/);
  });
});

describe("ideas sin repetir", () => {
  it("quita la misma hipótesis escrita igual o con otras tildes y mayúsculas", () => {
    const ideas = extraerIdeas('{"ideas":[{"title":"Descompensación de IC","rationale":"a"},{"title":"descompensacion de  IC","rationale":"b"},{"title":"Neumonía","rationale":"c"}]}');
    assert.deepEqual(ideas?.map((i) => i.title), ["Descompensación de IC", "Neumonía"]);
  });
});

describe("prioridad: la consulta del médico va primero", () => {
  it("avisa al empezar una consulta y libera al terminar", async () => {
    const p = crearPrioridad();
    let avisos = 0;
    const dejar = p.alEmpezar(() => avisos++);
    assert.equal(p.ocupado(), false);

    const terminar = p.empieza();
    assert.equal(p.ocupado(), true);
    assert.equal(avisos, 1, "el análisis automático en curso se entera y se corta");

    let libre = false;
    const espera = p.esperarLibre(5).then(() => {
      libre = true;
    });
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(libre, false, "el análisis automático espera mientras haya una consulta");

    terminar();
    terminar(); // terminar dos veces no deja el contador en negativo
    await espera;
    assert.equal(libre, true);
    assert.equal(p.ocupado(), false);

    dejar();
    p.empieza()();
    assert.equal(avisos, 1, "después de dejar de escuchar no avisa");
  });

  it("dos consultas a la vez: libre solo cuando terminan las dos", () => {
    const p = crearPrioridad();
    const a = p.empieza();
    const b = p.empieza();
    a();
    assert.equal(p.ocupado(), true);
    b();
    assert.equal(p.ocupado(), false);
  });

  it("con calma, espera además un rato después de la última consulta", async () => {
    const p = crearPrioridad();
    p.empieza()();
    const t0 = Date.now();
    await p.esperarLibre(5, 2000, 60);
    assert.ok(Date.now() - t0 >= 50, "no arranca en la pausa entre dos preguntas");
  });

  it("la espera tiene un tope", async () => {
    const p = crearPrioridad();
    p.empieza();
    const t0 = Date.now();
    await p.esperarLibre(5, 40);
    assert.ok(Date.now() - t0 < 1000);
  });
});
