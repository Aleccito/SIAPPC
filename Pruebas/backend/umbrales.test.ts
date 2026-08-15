import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { evaluarAlerta, invalidarUmbrales } from "../../backend/src/services/umbrales.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Umbrales de alerta configurables.
//
// La pregunta que estas pruebas contestan, y por la que existen, es la primera:
// SACAR LOS NÚMEROS DEL CÓDIGO NO PUEDE CAMBIAR NI UNA ALERTA. La copia literal
// de la función anterior está más abajo y sirve de oráculo: se barre el rango de
// cada variable y se exige que la tabla en su estado de semilla decida
// exactamente lo mismo —severidad, tipo y texto— que decidía el código.
//
// Lo demás comprueba lo que la tabla añade: el ajuste por paciente, la vuelta
// atrás al valor por defecto, y que la API no deje tocar pacientes ajenos.

/**
 * `evaluateAlert` tal como estaba en backend/src/services/mqttIngest.ts antes de
 * que los umbrales fueran configurables. NO se toca: es la referencia contra la
 * que se compara, y editarla para que "pase" vaciaría la prueba de sentido.
 */
function evaluateAlertAntiguo(
  variable: string,
  value: number,
): { tipo: string; severidad: string; mensaje: string } | null {
  if (variable === "hr") {
    if (value < 40 || value > 140) {
      return { tipo: "hr_fuera_de_rango", severidad: "critica", mensaje: `Frecuencia cardiaca ${value} bpm fuera de rango crítico` };
    }
    if (value < 50 || value > 120) {
      return { tipo: "hr_fuera_de_rango", severidad: "alta", mensaje: `Frecuencia cardiaca ${value} bpm fuera de rango` };
    }
    return null;
  }
  if (variable === "spo2") {
    if (value < 85) {
      return { tipo: "spo2_bajo", severidad: "critica", mensaje: `SpO2 ${value}% crítico` };
    }
    if (value < 90) {
      return { tipo: "spo2_bajo", severidad: "alta", mensaje: `SpO2 ${value}% bajo` };
    }
    return null;
  }
  if (variable === "pr") {
    if (value < 40 || value > 140) {
      return { tipo: "pr_fuera_de_rango", severidad: "critica", mensaje: `Frecuencia de pulso ${value} bpm fuera de rango crítico` };
    }
    if (value < 50 || value > 120) {
      return { tipo: "pr_fuera_de_rango", severidad: "alta", mensaje: `Frecuencia de pulso ${value} bpm fuera de rango` };
    }
    return null;
  }
  if (variable === "resp") {
    if (value < 8 || value > 30) {
      return { tipo: "resp_fuera_de_rango", severidad: "alta", mensaje: `Respiración estimada ${value} rpm fuera de rango` };
    }
    return null;
  }
  if (variable === "perfusion") {
    if (value < 0.2) {
      return { tipo: "perfusion_baja", severidad: "baja", mensaje: `Índice de perfusión ${value}%: señal débil, el SpO2 puede no ser fiable` };
    }
    return null;
  }
  return null;
}

/**
 * Valores con los que se barre cada variable.
 *
 * No son al azar: incluyen los propios límites y sus vecinos inmediatos, que es
 * donde vive el error de un `<` que debería ser `<=`. Los decimales están para
 * que el texto del mensaje también se compare con una cifra que no es entera.
 */
const BARRIDO: Record<string, number[]> = {
  hr: [0, 39, 39.9, 40, 40.1, 49, 50, 51, 100, 119, 120, 121, 139, 140, 141, 300],
  spo2: [0, 50, 84, 84.9, 85, 85.1, 89, 89.5, 90, 90.1, 99, 100],
  pr: [0, 39, 40, 41, 49, 50, 51, 100, 120, 121, 140, 141, 250],
  resp: [0, 7, 7.5, 8, 8.5, 15, 29, 30, 30.5, 31, 90],
  perfusion: [0, 0.05, 0.1, 0.19, 0.2, 0.21, 1, 5.5, 20],
  // Sin banda ni antes ni ahora: una muestra suelta de voltaje no dice nada.
  ecg: [-5, -0.1, 0, 0.1, 3],
  // En el catálogo pero sin banda, y sin ella tampoco antes: nadie las publica.
  pa: [0, 80, 120, 250],
  temp: [30, 36.5, 42],
};

describe("Umbrales de alerta configurables", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;

  before(async () => {
    await resetDatabase();
    await flushRedis();
    // La copia en memoria puede venir de otra prueba de este mismo archivo: la
    // base se acaba de recrear y hay que releerla.
    invalidarUmbrales();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  const call = (
    method: "GET" | "POST" | "PATCH" | "DELETE",
    url: string,
    payload?: object,
  ) => app.inject({ method, url, headers: admin, ...(payload ? { payload } : {}) });

  // ── Lo que no puede cambiar ───────────────────────────────────────────────

  it("con la tabla sembrada, decide exactamente lo mismo que el código anterior", async () => {
    for (const [variable, valores] of Object.entries(BARRIDO)) {
      for (const valor of valores) {
        // Sin paciente: es el caso del valor por defecto general, que es el
        // único que existía cuando los números estaban en el código.
        const ahora = await evaluarAlerta(variable, valor, null, app.log);
        const antes = evaluateAlertAntiguo(variable, valor);

        assert.deepEqual(
          ahora === null
            ? null
            : { tipo: ahora.tipo, severidad: ahora.severidad, mensaje: ahora.mensaje },
          antes,
          `${variable} = ${valor}`,
        );
      }
    }
  });

  it("un paciente sin ajustes propios alerta con el valor por defecto", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const paciente = await prisma.paciente.create({
      data: {
        hospital_id: 1,
        nombre: "Sin Ajustes",
        cedula: "C-UMB-0",
        fecha_nacimiento: new Date("1970-01-01"),
        sexo: "M",
      },
      select: { paciente_id: true },
    });

    for (const [variable, valores] of Object.entries(BARRIDO)) {
      for (const valor of valores) {
        const ahora = await evaluarAlerta(variable, valor, paciente.paciente_id, app.log);
        assert.deepEqual(
          ahora === null
            ? null
            : { tipo: ahora.tipo, severidad: ahora.severidad, mensaje: ahora.mensaje },
          evaluateAlertAntiguo(variable, valor),
          `${variable} = ${valor}`,
        );
      }
    }
  });

  it("la semilla deja `resp` sin banda crítica", async () => {
    // Es una decisión clínica, no un hueco: `resp` es una estimación sacada del
    // pletismógrafo, no una respiración medida. Que ahora sea configurable no
    // significa que la semilla la ascienda por su cuenta.
    const res = await call("GET", "/alert-thresholds?variable=resp");
    assert.equal(res.statusCode, 200, res.body);
    const bandas = res.json() as { severity: string }[];
    assert.deepEqual(
      bandas.map((b) => b.severity),
      ["alta"],
    );
  });

  // ── Lo que la tabla añade ─────────────────────────────────────────────────

  describe("ajuste por paciente", () => {
    let pacienteId: string;

    before(async () => {
      const res = await call("POST", "/patients", {
        name: "Rosa EPOC",
        document: "C-UMB-1",
        reason: "EPOC reagudizado",
        fechaNacimiento: "1948-02-20",
        sexo: "F",
      });
      assert.equal(res.statusCode, 201, res.body);
      pacienteId = res.json().id;
    });

    it("las bandas propias sustituyen a las generales de esa variable", async () => {
      // El caso que motivó todo esto: alguien con EPOC vive por debajo del 90 %
      // y con el umbral general dispara alertas todo el día. Se le baja la
      // banda entera, las dos severidades.
      for (const banda of [
        { severity: "critica", min: 80, messageTemplate: "SpO2 {valor}% crítico" },
        { severity: "alta", min: 85, messageTemplate: "SpO2 {valor}% bajo" },
      ]) {
        const res = await call("POST", "/alert-thresholds", {
          variable: "spo2",
          patientId: pacienteId,
          type: "spo2_bajo",
          ...banda,
        });
        assert.equal(res.statusCode, 201, res.body);
      }

      const id = Number(pacienteId);
      // 88 % ya no alerta para ella, y sigue alertando para cualquier otro.
      assert.equal(await evaluarAlerta("spo2", 88, id, app.log), null);
      assert.equal((await evaluarAlerta("spo2", 88, null, app.log))?.severidad, "alta");

      assert.equal((await evaluarAlerta("spo2", 83, id, app.log))?.severidad, "alta");
      assert.equal((await evaluarAlerta("spo2", 83, null, app.log))?.severidad, "critica");

      assert.equal((await evaluarAlerta("spo2", 79, id, app.log))?.severidad, "critica");
    });

    it("una variable que no se afinó sigue con el valor por defecto", async () => {
      // La sustitución es por variable, no por paciente entero: bajarle el SpO2
      // no puede dejarla sin alertas de frecuencia cardiaca.
      const alerta = await evaluarAlerta("hr", 145, Number(pacienteId), app.log);
      assert.equal(alerta?.severidad, "critica");
      assert.equal(alerta?.mensaje, "Frecuencia cardiaca 145 bpm fuera de rango crítico");
    });

    it("`/effective` enseña qué banda se aplica de verdad y de dónde sale", async () => {
      const res = await call("GET", `/alert-thresholds/effective?patientId=${pacienteId}`);
      assert.equal(res.statusCode, 200, res.body);
      const bandas = res.json() as { variable: string; severity: string; patientId: string | null; min: number | null }[];

      // Las de spo2 son suyas y no aparece ninguna general de esa variable.
      const spo2 = bandas.filter((b) => b.variable === "spo2");
      assert.equal(spo2.length, 2);
      assert.ok(spo2.every((b) => b.patientId === pacienteId));
      assert.equal(spo2.find((b) => b.severity === "critica")!.min, 80);

      // Las de hr las hereda: siguen siendo las generales.
      const hr = bandas.filter((b) => b.variable === "hr");
      assert.equal(hr.length, 2);
      assert.ok(hr.every((b) => b.patientId === null));
    });

    it("retirar el último ajuste devuelve al paciente al valor por defecto", async () => {
      const suyas = (await call("GET", `/alert-thresholds?patientId=${pacienteId}`)).json() as {
        id: string;
      }[];
      assert.equal(suyas.length, 2);

      for (const banda of suyas) {
        assert.equal((await call("DELETE", `/alert-thresholds/${banda.id}`)).statusCode, 204);
      }

      // 88 % vuelve a alertar como para cualquiera.
      assert.equal((await evaluarAlerta("spo2", 88, Number(pacienteId), app.log))?.severidad, "alta");

      // La baja es lógica: las filas siguen ahí para que la bitácora tenga a qué
      // apuntar, marcadas como inactivas.
      const todas = (await call("GET", `/alert-thresholds?patientId=${pacienteId}`)).json() as {
        active: boolean;
      }[];
      assert.equal(todas.length, 2);
      assert.ok(todas.every((b) => !b.active));
    });

    it("volver a darla de alta reactiva la fila en vez de chocar con el índice único", async () => {
      const res = await call("POST", "/alert-thresholds", {
        variable: "spo2",
        patientId: pacienteId,
        severity: "alta",
        min: 86,
        type: "spo2_bajo",
        messageTemplate: "SpO2 {valor}% bajo",
      });
      assert.equal(res.statusCode, 201, res.body);
      assert.equal(res.json().active, true);
      assert.equal(res.json().min, 86);

      // Y no se duplicó: sigue habiendo dos filas suyas de spo2.
      const suyas = (await call("GET", `/alert-thresholds?patientId=${pacienteId}`)).json() as unknown[];
      assert.equal(suyas.length, 2);
    });

    it("dar de alta una banda que ya está viva es 409, no un duplicado", async () => {
      const res = await call("POST", "/alert-thresholds", {
        variable: "spo2",
        patientId: pacienteId,
        severity: "alta",
        min: 70,
        type: "spo2_bajo",
        messageTemplate: "SpO2 {valor}% bajo",
      });
      assert.equal(res.statusCode, 409);
      assert.equal(typeof res.json().error, "string");
    });
  });

  // ── La API ────────────────────────────────────────────────────────────────

  it("PATCH mueve el límite y la ingesta lo nota en la lectura siguiente", async () => {
    const general = (await call("GET", "/alert-thresholds?variable=hr")).json() as {
      id: string;
      severity: string;
    }[];
    const alta = general.find((b) => b.severity === "alta")!;

    assert.equal((await evaluarAlerta("hr", 125, null, app.log))?.severidad, "alta");

    const res = await call("PATCH", `/alert-thresholds/${alta.id}`, { max: 130 });
    assert.equal(res.statusCode, 200, res.body);
    assert.equal(res.json().max, 130);

    // Sin esperar al TTL: la instancia que atendió la petición tira su copia.
    assert.equal(await evaluarAlerta("hr", 125, null, app.log), null);
    assert.equal((await evaluarAlerta("hr", 135, null, app.log))?.severidad, "alta");

    await call("PATCH", `/alert-thresholds/${alta.id}`, { max: 120 });
  });

  it("una banda con min por encima de max se rechaza, al crearla y al modificarla", async () => {
    const alalta = await call("POST", "/alert-thresholds", {
      variable: "temp",
      severity: "alta",
      min: 40,
      max: 35,
      type: "temp_fuera_de_rango",
      messageTemplate: "Temperatura {valor} fuera de rango",
    });
    assert.equal(alalta.statusCode, 400);

    // Y por partes: un PATCH que solo manda `min` puede dejarlo por encima del
    // `max` que ya estaba guardado. Se comprueba sobre el resultado, no sobre el
    // cuerpo.
    const respAlta = (await call("GET", "/alert-thresholds?variable=resp")).json() as { id: string }[];
    const res = await call("PATCH", `/alert-thresholds/${respAlta[0]!.id}`, { min: 45 });
    assert.equal(res.statusCode, 409, res.body);
  });

  it("la identidad de la banda no se modifica por PATCH", async () => {
    const [banda] = (await call("GET", "/alert-thresholds?variable=perfusion")).json() as {
      id: string;
      variable: string;
      severity: string;
    }[];

    // El esquema del PATCH ni siquiera declara estos campos: zod los descarta y
    // la banda se queda donde estaba. Moverla de severidad es darla de baja y
    // crear otra, no reescribir la fila.
    const res = await call("PATCH", `/alert-thresholds/${banda!.id}`, {
      variable: "hr",
      severity: "critica",
    });
    assert.equal(res.statusCode, 200, res.body);
    assert.equal(res.json().variable, "perfusion");
    assert.equal(res.json().severity, "baja");
  });

  it("no se puede afinar el umbral de un paciente de otro hospital", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const otro = await prisma.hospital.create({
      data: { nombre: "Hospital Vecino" },
      select: { hospital_id: true },
    });
    const ajeno = await prisma.paciente.create({
      data: {
        hospital_id: otro.hospital_id,
        nombre: "Paciente Ajeno",
        cedula: "C-UMB-AJENO",
        fecha_nacimiento: new Date("1980-01-01"),
        sexo: "M",
      },
      select: { paciente_id: true },
    });

    // 404 y no 403: existir en otro hospital es indistinguible de no existir.
    const alta = await call("POST", "/alert-thresholds", {
      variable: "hr",
      patientId: ajeno.paciente_id,
      severity: "alta",
      min: 30,
      max: 200,
      type: "hr_fuera_de_rango",
      messageTemplate: "Frecuencia cardiaca {valor} bpm fuera de rango",
    });
    assert.equal(alta.statusCode, 404, alta.body);

    // Y tampoco se ve el que ya tuviera: se crea uno a mano y no sale ni en la
    // lista ni por id.
    const suyo = await prisma.umbralAlerta.create({
      data: {
        variable_codigo: "hr",
        paciente_id: ajeno.paciente_id,
        severidad: "alta",
        valor_min: 30,
        valor_max: 200,
        tipo: "hr_fuera_de_rango",
        plantilla_mensaje: "Frecuencia cardiaca {valor} bpm fuera de rango",
      },
      select: { umbral_id: true },
    });
    invalidarUmbrales();

    const lista = (await call("GET", "/alert-thresholds")).json() as { id: string }[];
    assert.ok(!lista.some((b) => b.id === String(suyo.umbral_id)));
    assert.equal((await call("PATCH", `/alert-thresholds/${suyo.umbral_id}`, { min: 1 })).statusCode, 404);
    assert.equal((await call("DELETE", `/alert-thresholds/${suyo.umbral_id}`)).statusCode, 404);

    // Aun así SE APLICA: la ingesta no sabe de sesiones ni de hospitales, y el
    // ajuste es del paciente. Que la API de otro hospital no lo vea es
    // aislamiento de la administración, no de la evaluación.
    assert.equal(await evaluarAlerta("hr", 190, ajeno.paciente_id, app.log), null);
  });

  it("sin token no se llega a los umbrales", async () => {
    assert.equal((await app.inject({ method: "GET", url: "/alert-thresholds" })).statusCode, 401);
  });

  it("un id inexistente es 404 y uno que no es número es 400", async () => {
    assert.equal((await call("PATCH", "/alert-thresholds/999999", { min: 1 })).statusCode, 404);
    assert.equal((await call("PATCH", "/alert-thresholds/abc", { min: 1 })).statusCode, 400);
  });

  it("cada cambio queda en la bitácora", async () => {
    const { prisma } = await import("../../backend/src/lib/prisma.ts");
    const filas = await prisma.auditoria.findMany({
      where: { entidad: "umbral_alerta" },
      select: { accion: true, observacion: true },
    });

    assert.ok(filas.some((f) => f.accion === "INSERT"));
    assert.ok(filas.some((f) => f.accion === "UPDATE"));
    assert.ok(filas.some((f) => f.accion === "DELETE"));
    // El texto se lee tal cual en la pantalla de Auditoría: tiene que decir qué
    // banda se tocó, no solo que se tocó una.
    assert.ok(filas.every((f) => (f.observacion ?? "").length > 0));
  });
});
