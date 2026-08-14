import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import {
  alLlegarOnda,
  hayOyentes,
  repartirOnda,
  waveformSchema,
} from "../../backend/src/services/waveform.ts";
import type { WaveformBatch } from "../../backend/src/services/waveform.ts";
import {
  authHeader,
  closeConnections,
  flushRedis,
  loginAsAdmin,
  resetDatabase,
} from "./helpers.ts";

// La onda del ECG: de MQTT al navegador sin tocar la base.
//
// Lo que se comprueba aquí es lo que puede romperse en silencio: que un lote
// llegue a la cama equivocada, que no se guarde nada, y que un oyente que se va
// no quede colgado. Nada de eso se nota mirando la pantalla —el trazo se dibuja
// igual— y todo tiene consecuencias: enseñar el ECG de otro paciente, llenar la
// base, o dejar el proceso goteando memoria por cada cama visitada.

const LOTE: WaveformBatch = {
  device: "RPI-SIM-01",
  variable: "ecg",
  hz: 250,
  ts: 1_700_000_000,
  samples: [0, 0.1, -0.2, 1.0, -0.3, 0],
};

describe("onda del ECG", () => {
  let app: FastifyInstance;
  let token: string;

  before(async () => {
    await resetDatabase();
    // Imprescindible antes de cualquier login: el contador de intentos vive en
    // Redis y sobrevive a `resetDatabase`. Sin esto, esta suite hereda los cinco
    // intentos que gastó rate-limit.test.ts contra el MISMO correo y desde la
    // misma IP, y `loginAsAdmin` se lleva un 429 — que es lo que pasó al
    // añadirla. Corriendo el archivo suelto no se nota: solo falla en la suite
    // completa, y según el orden.
    await flushRedis();
    app = await buildApp();
    await app.ready();
    token = await loginAsAdmin(app);
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  it("el lote llega solo a quien mira ESA cama", () => {
    const recibidosA: WaveformBatch[] = [];
    const recibidosB: WaveformBatch[] = [];

    const cancelarA = alLlegarOnda("RPI-SIM-01", (lote) => recibidosA.push(lote));
    const cancelarB = alLlegarOnda("OTRA-CAMA", (lote) => recibidosB.push(lote));

    repartirOnda(LOTE);

    // El de la otra cama no debe ver nada: es el ECG de otro paciente.
    assert.equal(recibidosA.length, 1);
    assert.equal(recibidosB.length, 0);
    assert.deepEqual(recibidosA[0]!.samples, LOTE.samples);

    cancelarA();
    cancelarB();
  });

  it("cancelar deja de recibir y limpia el registro", () => {
    const recibidos: WaveformBatch[] = [];
    const cancelar = alLlegarOnda("RPI-SIM-01", (lote) => recibidos.push(lote));

    assert.equal(hayOyentes("RPI-SIM-01"), true);
    cancelar();
    // Sin este false, cada cama que la ronda visita dejaría una entrada viva:
    // con el giro automático son tres por minuto durante todo el turno.
    assert.equal(hayOyentes("RPI-SIM-01"), false);

    repartirOnda(LOTE);
    assert.equal(recibidos.length, 0);
  });

  it("sin oyentes no falla: el lote se descarta", () => {
    assert.equal(hayOyentes("NADIE-MIRA"), false);
    // Es el caso normal —veinte camas publicando y nadie con esa abierta—, así
    // que tiene que ser barato y silencioso, no una excepción.
    assert.doesNotThrow(() => repartirOnda({ ...LOTE, device: "NADIE-MIRA" }));
  });

  it("el esquema rechaza lo que ese hardware no puede producir", () => {
    // 250 Hz es el techo del ADS1115. Más que eso significa que alguien está
    // mandando algo que no salió de este equipo.
    assert.equal(waveformSchema.safeParse({ ...LOTE, hz: 5000 }).success, false);
    // Un lote de más de dos segundos no es un lote, es un volcado.
    assert.equal(
      waveformSchema.safeParse({ ...LOTE, samples: new Array(501).fill(0) }).success,
      false,
    );
    assert.equal(waveformSchema.safeParse({ ...LOTE, samples: [] }).success, false);
    // NaN e Infinity rompen el dibujo del trazo sin dar ningún error.
    assert.equal(waveformSchema.safeParse({ ...LOTE, samples: [0, NaN] }).success, false);
  });

  it("la onda NO se guarda en ninguna tabla", async () => {
    const cancelar = alLlegarOnda("RPI-SIM-01", () => {});
    for (let i = 0; i < 20; i++) repartirOnda(LOTE);
    cancelar();
    await sleep(100);

    // 250 Hz son 21,6 millones de filas por día y por cama: la onda se
    // retransmite, nunca se persiste. Si algún día alguien la escribe en
    // `lectura`, esta prueba es la que lo dice.
    const res = await app.inject({
      method: "GET",
      url: "/sensors/readings?device=RPI-SIM-01&limit=50",
      headers: authHeader(token),
    });
    assert.equal(res.statusCode, 200);
    const filas = res.json() as { variable: string }[];
    assert.equal(filas.some((f) => f.variable === "ecg"), false);
  });

  it("el flujo exige sesión", async () => {
    const res = await app.inject({ method: "GET", url: "/monitoring/RPI-SIM-01/waveform" });
    assert.equal(res.statusCode, 401);
  });

  it("un equipo que no existe da 404 y no abre el flujo", async () => {
    // Con sesión pero pidiendo un código inventado. Sin esta comprobación,
    // cualquiera con cuenta podría escuchar la onda de un equipo de otro
    // hospital sabiendo su código.
    const res = await app.inject({
      method: "GET",
      url: "/monitoring/NO-EXISTE-99/waveform",
      headers: authHeader(token),
    });
    assert.equal(res.statusCode, 404);
  });
});
