import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../backend/src/app.ts";
import { authHeader, closeConnections, flushRedis, loginAsAdmin, resetDatabase } from "./helpers.ts";

// Admisión: camas, ingresos, egresos y citas.
//
// Lo que se comprueba son las reglas que el esquema no puede sostener por sí
// solo, porque MariaDB no tiene índices parciales y todas son unicidad "entre
// los activos":
//
//   - una cama ocupada no admite un segundo ingreso,
//   - un paciente no está internado dos veces a la vez,
//   - el egreso cierra el ingreso Y libera la cama, o no hace ninguna de las dos,
//   - la agenda de un profesional no se solapa,
//   - y `?date=today` lo resuelve el servidor, no el navegador.
//
// El recuento de ocupación se mira contra `GET /beds/occupancy` y no contra la
// tabla: es la cifra que pinta el tablero administrativo, y es ahí donde un
// cambio de estado mal propagado se nota.

const PACIENTE = {
  reason: "Politraumatismo",
  fechaNacimiento: "1980-01-15",
  sexo: "M",
} as const;

/** La UCI del seed. Las camas se crean sobre ella en cada prueba. */
const UNIDAD_UCI = 1;

describe("Admisión — camas, ingresos y citas", () => {
  let app: FastifyInstance;
  let admin: Record<string, string>;
  let administrativo: Record<string, string>;
  let medico: Record<string, string>;
  let medicoId: string;

  async function cuenta(
    role: string,
    email: string,
  ): Promise<{ headers: Record<string, string>; id: string }> {
    const creada = await app.inject({
      method: "POST",
      url: "/users",
      headers: admin,
      payload: { name: `Prueba ${email}`, email, role },
    });
    assert.equal(creada.statusCode, 201, creada.body);

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email, password: creada.json().tempPassword },
    });
    assert.equal(login.statusCode, 200, login.body);
    // POST /users responde `{ user, tempPassword }`: el identificador está
    // dentro de `user`, no en la raíz.
    return { headers: authHeader(login.json().token as string), id: String(creada.json().user.id) };
  }

  async function nuevoPaciente(document: string, name: string): Promise<string> {
    const res = await app.inject({
      method: "POST",
      url: "/patients",
      headers: administrativo,
      payload: { ...PACIENTE, name, document },
    });
    assert.equal(res.statusCode, 201, res.body);
    return res.json().id as string;
  }

  async function nuevaCama(code: string): Promise<string> {
    const res = await app.inject({
      method: "POST",
      url: "/beds",
      headers: administrativo,
      payload: { unitId: UNIDAD_UCI, code },
    });
    assert.equal(res.statusCode, 201, res.body);
    return res.json().id as string;
  }

  async function estadoCama(id: string): Promise<string> {
    const res = await app.inject({ method: "GET", url: `/beds/${id}`, headers: administrativo });
    assert.equal(res.statusCode, 200, res.body);
    return res.json().state as string;
  }

  /** La fila de ocupación de la UCI, tal como la lee el tablero. */
  async function ocupacionUci(): Promise<{ total: number; occupied: number; available: number }> {
    const res = await app.inject({
      method: "GET",
      url: "/beds/occupancy",
      headers: administrativo,
    });
    assert.equal(res.statusCode, 200, res.body);
    const fila = (res.json() as { unitId: string }[]).find(
      (u) => u.unitId === String(UNIDAD_UCI),
    );
    assert.ok(fila, "la UCI tiene que aparecer en la ocupación");
    return fila as unknown as { total: number; occupied: number; available: number };
  }

  before(async () => {
    await resetDatabase();
    await flushRedis();
    app = await buildApp();
    await app.ready();
    admin = authHeader(await loginAsAdmin(app));

    administrativo = (await cuenta("administrativo", "admision@institucion.org")).headers;
    const m = await cuenta("medico", "consulta@institucion.org");
    medico = m.headers;
    medicoId = m.id;
  });

  after(async () => {
    await app.close();
    await closeConnections();
  });

  describe("camas y ocupación", () => {
    it("una unidad sin camas aparece en la ocupación con total 0", async () => {
      // Antes de crear ninguna cama: la unidad tiene que salir igual, porque es
      // justo la que hay que dar de alta.
      const uci = await ocupacionUci();
      assert.equal(uci.total, 0);
      assert.equal(uci.occupied, 0);
    });

    it("la cama nueva nace disponible y suma al total de su unidad", async () => {
      const camaId = await nuevaCama("UCI-01");
      assert.equal(await estadoCama(camaId), "disponible");

      const uci = await ocupacionUci();
      assert.equal(uci.total, 1);
      assert.equal(uci.available, 1);
      assert.equal(uci.occupied, 0);
    });

    it("dos camas con el mismo código en la misma unidad chocan", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/beds",
        headers: administrativo,
        payload: { unitId: UNIDAD_UCI, code: "UCI-01" },
      });
      assert.equal(res.statusCode, 409, res.body);
    });

    it("sin el módulo `admisiones` no se ven las camas", async () => {
      // El médico sí lo tiene en modo lectura; quien no lo tenga en absoluto es
      // un rol nuevo sin casillas. Se crea uno para comprobarlo.
      const rol = await app.inject({
        method: "POST",
        url: "/roles",
        headers: admin,
        payload: { name: "celador", label: "Celador", description: "Sin admisiones" },
      });
      assert.equal(rol.statusCode, 201, rol.body);

      const celador = await cuenta("celador", "celador@institucion.org");
      const res = await app.inject({
        method: "GET",
        url: "/beds",
        headers: celador.headers,
      });
      assert.equal(res.statusCode, 403, res.body);
    });
  });

  describe("ingresos", () => {
    it("admitir con cama la deja ocupada y lo cuenta en la ocupación", async () => {
      const pacienteId = await nuevoPaciente("C-ING-1", "Luis Prado");
      const camaId = await nuevaCama("UCI-02");

      const res = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(pacienteId), bedId: Number(camaId), reason: "Choque" },
      });
      assert.equal(res.statusCode, 201, res.body);
      assert.equal(res.json().state, "activo");
      assert.equal(res.json().bedCode, "UCI-02");
      assert.equal(res.json().unit, "UCI");

      assert.equal(await estadoCama(camaId), "ocupada");
      const uci = await ocupacionUci();
      assert.equal(uci.occupied, 1);
    });

    it("una cama ocupada no admite un segundo ingreso", async () => {
      const otro = await nuevoPaciente("C-ING-2", "Sara Ruiz");
      const camaOcupada = (
        await app.inject({ method: "GET", url: "/beds", headers: administrativo })
      )
        .json()
        .find((c: { code: string }) => c.code === "UCI-02") as { id: string };

      const res = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(otro), bedId: Number(camaOcupada.id), reason: "Fractura" },
      });
      assert.equal(res.statusCode, 409, res.body);

      // Y el ingreso rechazado no dejó rastro: el paciente sigue sin ingreso.
      const suyos = await app.inject({
        method: "GET",
        url: "/admissions",
        headers: administrativo,
      });
      const deSara = (suyos.json() as { patientId: string }[]).filter((a) => a.patientId === otro);
      assert.equal(deSara.length, 0);
    });

    it("el mismo paciente no se interna dos veces a la vez", async () => {
      const pacienteId = await nuevoPaciente("C-ING-3", "Iván Mora");

      const primero = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(pacienteId), reason: "Observación" },
      });
      assert.equal(primero.statusCode, 201, primero.body);
      // Sin cama: se admite igual, que es el caso de urgencias.
      assert.equal(primero.json().bedId, null);

      const segundo = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(pacienteId), reason: "Otra vez" },
      });
      assert.equal(segundo.statusCode, 409, segundo.body);
    });

    it("el egreso cierra el ingreso y manda la cama a limpieza", async () => {
      const pacienteId = await nuevoPaciente("C-ING-4", "Nora Cifuentes");
      const camaId = await nuevaCama("UCI-03");

      const alta = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(pacienteId), bedId: Number(camaId), reason: "Postoperatorio" },
      });
      assert.equal(alta.statusCode, 201, alta.body);
      const ingresoId = alta.json().id as string;

      const egreso = await app.inject({
        method: "POST",
        url: `/admissions/${ingresoId}/discharge`,
        headers: administrativo,
        payload: { summary: "Evolución favorable" },
      });
      assert.equal(egreso.statusCode, 200, egreso.body);
      assert.equal(egreso.json().state, "egresado");
      assert.ok(egreso.json().dischargedAt, "el egreso tiene que datar la salida");

      // La cama no vuelve a `disponible` de un salto: pasa por limpieza.
      assert.equal(await estadoCama(camaId), "limpieza");
    });

    it("un ingreso ya cerrado no se reabre", async () => {
      const cerrados = await app.inject({
        method: "GET",
        url: "/discharges",
        headers: administrativo,
      });
      assert.equal(cerrados.statusCode, 200, cerrados.body);
      const ingresoId = (cerrados.json() as { id: string }[])[0]!.id;

      const otra = await app.inject({
        method: "POST",
        url: `/admissions/${ingresoId}/discharge`,
        headers: administrativo,
        payload: {},
      });
      assert.equal(otra.statusCode, 409, otra.body);

      const patch = await app.inject({
        method: "PATCH",
        url: `/admissions/${ingresoId}`,
        headers: administrativo,
        payload: { reason: "Corregido" },
      });
      assert.equal(patch.statusCode, 409, patch.body);
    });

    it("cancelar devuelve la cama a disponible, sin pasar por limpieza", async () => {
      const pacienteId = await nuevoPaciente("C-ING-5", "Elsa Prieto");
      const camaId = await nuevaCama("UCI-04");

      const alta = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(pacienteId), bedId: Number(camaId), reason: "Ingreso erróneo" },
      });
      assert.equal(alta.statusCode, 201, alta.body);

      const cancelado = await app.inject({
        method: "PATCH",
        url: `/admissions/${alta.json().id}`,
        headers: administrativo,
        payload: { state: "cancelado" },
      });
      assert.equal(cancelado.statusCode, 200, cancelado.body);
      assert.equal(cancelado.json().state, "cancelado");
      assert.equal(await estadoCama(camaId), "disponible");
    });

    it("los ingresos del día son los de hoy y `today` lo resuelve el servidor", async () => {
      const hoy = await app.inject({
        method: "GET",
        url: "/admissions?date=today",
        headers: administrativo,
      });
      assert.equal(hoy.statusCode, 200, hoy.body);
      const ids = (hoy.json() as { id: string }[]).map((a) => a.id);
      assert.ok(ids.length > 0, "los ingresos de esta prueba son de hoy");

      // Un día en el que no se creó nada tiene que salir vacío, y con el mismo
      // total en la cabecera: si el filtro se ignorara, saldrían los de hoy.
      const otroDia = await app.inject({
        method: "GET",
        url: "/admissions?date=2001-01-01",
        headers: administrativo,
      });
      assert.equal(otroDia.statusCode, 200, otroDia.body);
      assert.deepEqual(otroDia.json(), []);
      assert.equal(otroDia.headers["x-total-count"], "0");
    });

    it("una fecha que no existe se rechaza con 400", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/admissions?date=2026-02-31",
        headers: administrativo,
      });
      assert.equal(res.statusCode, 400, res.body);
    });

    it("admitir es de Admisión: el médico solo mira", async () => {
      const pacienteId = await nuevoPaciente("C-ING-6", "Tomás Vera");
      const res = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: medico,
        payload: { patientId: Number(pacienteId), reason: "No debería" },
      });
      assert.equal(res.statusCode, 403, res.body);

      const lectura = await app.inject({
        method: "GET",
        url: "/admissions?date=today",
        headers: medico,
      });
      assert.equal(lectura.statusCode, 200, lectura.body);
    });
  });

  // PUT /beds/capacity: cuántas camas tiene la unidad, como un número.
  //
  // Se comprueba lo que distingue a este endpoint de repetir POST /beds: que es
  // idempotente, que rellena los huecos de numeración en vez de seguir
  // contando, y que NO se lleva por delante una cama con paciente dentro.
  //
  // Va sobre Trauma y no sobre la UCI a propósito: las pruebas de arriba dejan
  // camas en la UCI —`resetDatabase` corre una vez por archivo, no por prueba—
  // y estas afirmaciones son sobre el total exacto de la unidad.
  describe("capacidad de camas", () => {
    const UNIDAD = 2;

    async function fijar(total: number) {
      return app.inject({
        method: "PUT",
        url: "/beds/capacity",
        headers: administrativo,
        payload: { unitId: UNIDAD, total },
      });
    }

    /** Los códigos de las camas activas de la unidad, ordenados. */
    async function codigos(): Promise<string[]> {
      const res = await app.inject({ method: "GET", url: "/beds", headers: administrativo });
      assert.equal(res.statusCode, 200, res.body);
      return (res.json() as { unitId: string; code: string }[])
        .filter((cama) => cama.unitId === String(UNIDAD))
        .map((cama) => cama.code)
        .sort();
    }

    it("crea las camas que faltan y es idempotente", async () => {
      const res = await fijar(4);
      assert.equal(res.statusCode, 200, res.body);
      assert.equal(res.json().total, 4);
      assert.deepEqual(await codigos(), ["C-01", "C-02", "C-03", "C-04"]);

      // La misma petición otra vez deja 4, no 8: es el caso real de pulsarlo
      // dos veces porque la primera respuesta tardó.
      const otra = await fijar(4);
      assert.equal(otra.json().total, 4);
      assert.deepEqual(await codigos(), ["C-01", "C-02", "C-03", "C-04"]);
    });

    it("reducir da de baja las libres, y el hueco lo reutiliza la siguiente", async () => {
      await fijar(3);
      assert.deepEqual(await codigos(), ["C-01", "C-02", "C-03"]);

      await fijar(2);
      assert.deepEqual(await codigos(), ["C-01", "C-02"], "se quita la de código más alto");

      // Al volver a subir NO aparece una C-04: el hueco de la C-03 se rellena
      // primero, que es lo que mantiene la numeración sin agujeros.
      await fijar(3);
      assert.deepEqual(await codigos(), ["C-01", "C-02", "C-03"]);
    });

    it("no deja sin cama a un paciente ingresado", async () => {
      await fijar(2);
      const res = await app.inject({ method: "GET", url: "/beds", headers: administrativo });
      const cama = (res.json() as { id: string; unitId: string }[]).find(
        (c) => c.unitId === String(UNIDAD),
      );
      assert.ok(cama);

      const paciente = await nuevoPaciente("8-777-7777", "Ocupa Cama");
      const ingreso = await app.inject({
        method: "POST",
        url: "/admissions",
        headers: administrativo,
        payload: { patientId: Number(paciente), bedId: Number(cama.id), reason: "Politrauma" },
      });
      assert.equal(ingreso.statusCode, 201, ingreso.body);

      // Pedir menos camas de las ocupadas se rechaza ENTERO: el servidor no
      // decide por su cuenta a qué paciente deja fuera.
      const rechazo = await fijar(0);
      assert.equal(rechazo.statusCode, 409, rechazo.body);
      assert.deepEqual(await codigos(), ["C-01", "C-02"], "no se tocó ninguna cama");
    });

    it("la capacidad la fija quien puede editar admisiones, no cualquiera", async () => {
      const res = await app.inject({
        method: "PUT",
        url: "/beds/capacity",
        headers: medico,
        payload: { unitId: UNIDAD, total: 5 },
      });
      assert.equal(res.statusCode, 403, res.body);
    });
  });

  describe("citas", () => {
    /** Mañana a las 09:00 en la zona del servidor, en ISO con desfase. */
    function manana(hora: number, minuto = 0): string {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(hora, minuto, 0, 0);
      return d.toISOString();
    }

    let pacienteCita: string;

    before(async () => {
      pacienteCita = await nuevoPaciente("C-CITA-1", "Berta Salas");
    });

    it("agendar devuelve la cita con paciente y profesional resueltos", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/appointments",
        headers: administrativo,
        payload: {
          patientId: Number(pacienteCita),
          professionalId: Number(medicoId),
          at: manana(9),
          durationMin: 60,
          reason: "Control",
        },
      });
      assert.equal(res.statusCode, 201, res.body);
      assert.equal(res.json().patientName, "Berta Salas");
      assert.equal(res.json().state, "programada");
      assert.equal(res.json().durationMin, 60);
    });

    it("dos citas del mismo profesional que se pisan chocan", async () => {
      // Empieza media hora después de una de sesenta minutos: no comparten hora
      // de inicio y aun así es la misma persona en dos sitios.
      const res = await app.inject({
        method: "POST",
        url: "/appointments",
        headers: administrativo,
        payload: {
          patientId: Number(pacienteCita),
          professionalId: Number(medicoId),
          at: manana(9, 30),
          durationMin: 30,
          reason: "Solapada",
        },
      });
      assert.equal(res.statusCode, 409, res.body);
    });

    it("pegada a la anterior, sin solaparse, sí entra", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/appointments",
        headers: administrativo,
        payload: {
          patientId: Number(pacienteCita),
          professionalId: Number(medicoId),
          at: manana(10),
          durationMin: 30,
          reason: "Siguiente",
        },
      });
      assert.equal(res.statusCode, 201, res.body);
    });

    it("cancelar libera el hueco de la agenda", async () => {
      const agenda = await app.inject({
        method: "GET",
        url: "/appointments",
        headers: administrativo,
      });
      const primera = (agenda.json() as { id: string; at: string }[])[0]!;

      const cancelada = await app.inject({
        method: "PATCH",
        url: `/appointments/${primera.id}`,
        headers: administrativo,
        payload: { state: "cancelada" },
      });
      assert.equal(cancelada.statusCode, 200, cancelada.body);

      // El hueco de las 9 vuelve a estar libre.
      const res = await app.inject({
        method: "POST",
        url: "/appointments",
        headers: administrativo,
        payload: {
          patientId: Number(pacienteCita),
          professionalId: Number(medicoId),
          at: manana(9),
          durationMin: 60,
          reason: "Reprogramada",
        },
      });
      assert.equal(res.statusCode, 201, res.body);
    });

    it("la agenda del día viene en orden ascendente", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/appointments?date=today",
        headers: administrativo,
      });
      assert.equal(res.statusCode, 200, res.body);
      // Las de esta prueba son de mañana: hoy tiene que salir vacío.
      assert.deepEqual(res.json(), []);

      const todas = await app.inject({
        method: "GET",
        url: "/appointments",
        headers: administrativo,
      });
      const horas = (todas.json() as { at: string }[]).map((c) => c.at);
      assert.deepEqual([...horas].sort(), horas, "la agenda se lee de la próxima a la última");
    });
  });
});
