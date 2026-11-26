// Monitores a pie de cama: cuáles están libres y cuál tiene cada paciente.
//
// `dispositivo.paciente_id` ya decía qué monitor tiene cada paciente, y el tablero, la central y el expediente ya lo
// leían; pero solo se podía escribir por SQL. Estas rutas son las que lo escriben, con las reglas que el esquema no
// puede sostener solo:
//
//   - un monitor es de un paciente a la vez: asignar uno ocupado es 409 (y la escritura lleva la condición, así dos
//     asignaciones simultáneas no se lo quedan las dos);
//   - el monitor va en una cama: sin ingreso activo con cama, 409;
//   - uno en mantenimiento o de baja no se asigna;
//   - cambiar de monitor libera el anterior en la misma transacción;
//   - el hospital acota paciente y monitor: un id ajeno es 404, no 403.
//
// El egreso y la cancelación del ingreso también liberan el monitor (routes/admissions.ts). Cada cambio se avisa al
// equipo por MQTT (services/mqttAsignacion.ts).
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { recordAudit } from "../lib/audit.ts";
import { conflict, notFound, parseOr400 } from "../lib/http.ts";
import { liberarMonitoresDe } from "../lib/monitores.ts";
import { prisma } from "../lib/prisma.ts";
import { avisarAsignacion } from "../services/mqttAsignacion.ts";
import type { DeviceState, Monitor } from "../types.ts";

const MONITOR_SELECT = { dispositivo_id: true, codigo: true, modelo: true, estado: true } as const;

type MonitorRow = { dispositivo_id: number; codigo: string; modelo: string | null; estado: DeviceState };

const toMonitor = (row: MonitorRow): Monitor => ({
  id: String(row.dispositivo_id),
  code: row.codigo,
  model: row.modelo,
  state: row.estado,
});

/** Los que se pueden asignar: `activo` (transmitiendo) o `inactivo` (apagado, a la espera). */
const ASIGNABLES = ["activo", "inactivo"] as const;

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });
const assignSchema = z.object({ deviceId: z.coerce.number().int().positive() });

export default async function devicesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  /** El paciente tiene que ser de este hospital y estar activo; si no, 404. */
  async function pacienteDelHospital(id: number, hospitalId: number) {
    const paciente = await prisma.paciente.findFirst({
      where: { paciente_id: id, activo: true, hospital_id: hospitalId },
      select: { paciente_id: true, nombre: true },
    });
    if (!paciente) throw notFound(`No existe paciente con id ${id}`);
    return paciente;
  }

  app.get("/devices/free", { preHandler: [app.requirePermission("dispositivos", "ver")] }, async (req) => {
    const rows = await prisma.dispositivo.findMany({
      where: { hospital_id: req.hospitalId, paciente_id: null, estado: { in: [...ASIGNABLES] } },
      select: MONITOR_SELECT,
      orderBy: { codigo: "asc" },
      take: 200,
    });
    return rows.map(toMonitor);
  });

  // El monitor del paciente aunque no esté transmitiendo (el tablero solo enseña los `activo`).
  app.get("/patients/:id/device", { preHandler: [app.requirePermission("dispositivos", "ver")] }, async (req) => {
    const { id } = parseOr400(paramsSchema, req.params);
    await pacienteDelHospital(id, req.hospitalId);
    const row = await prisma.dispositivo.findFirst({
      where: { paciente_id: id, hospital_id: req.hospitalId },
      select: MONITOR_SELECT,
      orderBy: { dispositivo_id: "asc" },
    });
    // En un objeto y no `null` suelto: un cuerpo `null` es ambiguo para quien lo lee.
    return { monitor: row ? toMonitor(row) : null };
  });

  app.put("/patients/:id/device", { preHandler: [app.requirePermission("dispositivos", "editar")] }, async (req) => {
    const { id } = parseOr400(paramsSchema, req.params);
    const { deviceId } = parseOr400(assignSchema, req.body);
    const paciente = await pacienteDelHospital(id, req.hospitalId);

    const ingreso = await prisma.ingreso.findFirst({
      where: { paciente_id: id, estado: "activo" },
      select: { cama: { select: { codigo: true } } },
    });
    if (!ingreso?.cama) throw conflict(`${paciente.nombre} no tiene cama: asígnele una antes del monitor`);

    const monitor = await prisma.dispositivo.findFirst({
      where: { dispositivo_id: deviceId, hospital_id: req.hospitalId },
      select: { ...MONITOR_SELECT, paciente_id: true },
    });
    if (!monitor) throw notFound(`No existe monitor con id ${deviceId}`);
    if (monitor.paciente_id === id) return toMonitor(monitor);
    if (monitor.paciente_id !== null) throw conflict(`El monitor ${monitor.codigo} ya está con otro paciente`);
    if (!(ASIGNABLES as readonly string[]).includes(monitor.estado)) {
      throw conflict(`El monitor ${monitor.codigo} está en ${monitor.estado}: no se puede asignar`);
    }

    const liberados = await prisma.$transaction(async (tx) => {
      // Primero el anterior: un paciente lleva un monitor.
      const anteriores = await liberarMonitoresDe(tx, id, req.user.sub, `cambio de monitor de ${paciente.nombre}`);
      // La condición `paciente_id: null` en la escritura es la que resuelve dos asignaciones a la vez: la segunda
      // no encuentra el renglón libre y responde 409.
      const { count } = await tx.dispositivo.updateMany({
        where: { dispositivo_id: deviceId, paciente_id: null },
        data: { paciente_id: id, fecha_instalacion: new Date() },
      });
      if (count === 0) throw conflict(`El monitor ${monitor.codigo} ya está con otro paciente`);
      await recordAudit(tx, {
        actorId: req.user.sub,
        entidad: "dispositivo",
        registroId: deviceId,
        accion: "UPDATE",
        observacion: `puso el monitor ${monitor.codigo} a ${paciente.nombre} (cama ${ingreso.cama!.codigo})`,
      });
      return anteriores;
    });

    await avisarAsignacion([monitor.codigo, ...liberados], req.log);
    return toMonitor(monitor);
  });

  app.delete("/patients/:id/device", { preHandler: [app.requirePermission("dispositivos", "editar")] }, async (req, reply) => {
    const { id } = parseOr400(paramsSchema, req.params);
    const paciente = await pacienteDelHospital(id, req.hospitalId);
    const liberados = await prisma.$transaction((tx) => liberarMonitoresDe(tx, id, req.user.sub, `de ${paciente.nombre}`));
    if (!liberados.length) throw notFound(`${paciente.nombre} no tiene monitor`);
    await avisarAsignacion(liberados, req.log);
    return reply.code(204).send();
  });
}
