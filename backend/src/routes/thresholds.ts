// Umbrales de alerta: leer y ajustar las bandas de `umbral_alerta`.
//
// Escrito a mano y no con la fábrica de lib/crud.ts, por las mismas razones que
// /users y /roles: hay reglas que no caben en una configuración.
//
//   · El hospital no se alcanza por una relación simple. Una banda con paciente
//     pertenece al hospital de ese paciente; una sin paciente es el valor por
//     defecto del sistema y la ve todo el mundo. La fábrica sabe filtrar la
//     lectura con eso, pero no puede comprobar en el ALTA que el `patientId` que
//     viene en el cuerpo sea de este hospital — y sin esa comprobación se
//     podrían afinar los umbrales de un paciente ajeno.
//   · Al escribir hay que invalidar la copia en memoria que usa la ingesta
//     (services/umbrales.ts), o el cambio tardaría un minuto en notarse.
//   · El alta REACTIVA una banda dada de baja en vez de chocar contra el índice
//     único, que no distingue activas de inactivas.
//
// Permiso: el módulo `alertas`, que en db/seed.sql se describe literalmente como
// "Umbrales y eventos críticos". Qué rol puede escribirlo lo decide la matriz de
// `rol_permiso` y no este archivo.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { conflict, notFound, parseOr400 } from "../lib/http.ts";
import { invalidarUmbrales } from "../services/umbrales.ts";
import { alertSeverities } from "../types.ts";
import type { AlertSeverity, AlertThreshold } from "../types.ts";

type UmbralRow = {
  umbral_id: number;
  variable_codigo: string;
  paciente_id: number | null;
  severidad: AlertSeverity;
  valor_min: unknown;
  valor_max: unknown;
  tipo: string;
  plantilla_mensaje: string;
  activo: boolean;
};

function toThreshold(row: UmbralRow): AlertThreshold {
  return {
    id: String(row.umbral_id),
    variable: row.variable_codigo,
    patientId: row.paciente_id === null ? null : String(row.paciente_id),
    severity: row.severidad,
    // DECIMAL(12,4): el driver lo entrega como Decimal, no como number.
    min: row.valor_min === null ? null : Number(row.valor_min),
    max: row.valor_max === null ? null : Number(row.valor_max),
    type: row.tipo,
    messageTemplate: row.plantilla_mensaje,
    active: row.activo,
  };
}

// `min` y `max` nulables porque hay bandas de un solo lado. `finite` corta los
// NaN e Infinity que el JSON admite y que dejarían una banda que nunca salta sin
// que se note al leerla.
const limite = z.number().finite().nullable();

const thresholdSchema = z
  .object({
    variable: z.string().min(1).max(60),
    // Ausente o null = el valor por defecto general del sistema.
    patientId: z.coerce.number().int().positive().nullish(),
    severity: z.enum(alertSeverities),
    min: limite.default(null),
    max: limite.default(null),
    type: z.string().min(1).max(60),
    messageTemplate: z.string().min(1).max(200),
  })
  .refine((v) => v.min === null || v.max === null || v.min <= v.max, {
    message: "min no puede ser mayor que max: esa banda saltaría con cualquier valor",
    path: ["min"],
  });

// La identidad de la banda —variable, paciente, severidad— NO se modifica: eso
// sería otra fila, y cambiarla por debajo dejaría el ajuste de un paciente
// aplicándose a otro. Para mover una banda de severidad se da de baja y se crea.
const thresholdPatchSchema = z
  .object({
    min: limite,
    max: limite,
    messageTemplate: z.string().min(1).max(200),
    type: z.string().min(1).max(60),
    active: z.boolean(),
  })
  .partial();

const listQuerySchema = z.object({
  variable: z.string().min(1).max(60).optional(),
  patientId: z.coerce.number().int().positive().optional(),
});

const effectiveQuerySchema = z.object({
  patientId: z.coerce.number().int().positive().optional(),
});

const idSchema = z.coerce.number().int().positive();

/**
 * Lo que este hospital puede ver y tocar: sus pacientes, más los valores por
 * defecto generales.
 *
 * Los generales NO están acotados por hospital y es una limitación conocida, no
 * un olvido: son configuración del sistema, como el catálogo `variable` del que
 * cuelgan. Un despliegue con varios hospitales que necesite defectos distintos
 * por cada uno necesita un nivel más en la tabla (`hospital_id`), y eso es un
 * cambio de modelo. Los ajustes POR PACIENTE, que es donde está el dato
 * sensible, sí quedan acotados aquí.
 */
const delHospital = (req: FastifyRequest) => ({
  OR: [{ paciente_id: null }, { paciente: { hospital_id: req.hospitalId } }],
});

/** Un paciente de ESTE hospital, o 404. El id viene del cliente. */
async function pacienteDelHospital(id: number, req: FastifyRequest) {
  const paciente = await prisma.paciente.findFirst({
    where: { paciente_id: id, hospital_id: req.hospitalId },
    select: { paciente_id: true, nombre: true },
  });
  if (!paciente) throw notFound(`El paciente ${id} no existe en este hospital`);
  return paciente;
}

async function umbralDelHospital(id: number, req: FastifyRequest): Promise<UmbralRow> {
  const row = await prisma.umbralAlerta.findFirst({ where: { ...delHospital(req), umbral_id: id } });
  if (!row) throw notFound(`No existe umbral con id ${id}`);
  return row as UmbralRow;
}

/** Cómo se lee la banda en la bitácora: "spo2/critica de Ana Ruiz". */
function describir(row: UmbralRow, paciente: string | null): string {
  const alcance = paciente ? `de ${paciente}` : "por defecto";
  return `${row.variable_codigo}/${row.severidad} ${alcance}`;
}

// De más grave a menos, que es el orden en el que se evalúan: la primera banda
// que salta es la que gana.
const porGravedad = { severidad: "desc" } as const;

export default async function thresholdsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/alert-thresholds",
    { preHandler: [app.requirePermission("alertas", "ver")] },
    async (req): Promise<AlertThreshold[]> => {
      const { variable, patientId } = parseOr400(listQuerySchema, req.query);
      if (patientId !== undefined) await pacienteDelHospital(patientId, req);

      const rows = await prisma.umbralAlerta.findMany({
        where: {
          ...delHospital(req),
          ...(variable !== undefined ? { variable_codigo: variable } : {}),
          ...(patientId !== undefined ? { paciente_id: patientId } : {}),
        },
        orderBy: [{ variable_codigo: "asc" }, porGravedad],
      });

      return (rows as UmbralRow[]).map(toThreshold);
    },
  );

  // Las bandas que la ingesta aplicaría AHORA a un paciente, ya resuelta la
  // vuelta atrás al valor por defecto.
  //
  // Existe porque esa resolución es por variable completa y no por banda suelta:
  // afinar solo la `alta` de `spo2` de alguien hace desaparecer la `critica`
  // general de esa variable para él, y en el listado de arriba —que enseña filas
  // sueltas— eso no se ve. Aquí sí: lo que sale es exactamente lo que va a
  // saltar. Una banda con `patientId` null es heredada; con paciente, suya.
  app.get(
    "/alert-thresholds/effective",
    { preHandler: [app.requirePermission("alertas", "ver")] },
    async (req): Promise<AlertThreshold[]> => {
      const { patientId } = parseOr400(effectiveQuerySchema, req.query);
      if (patientId !== undefined) await pacienteDelHospital(patientId, req);

      const rows = (await prisma.umbralAlerta.findMany({
        where: {
          activo: true,
          OR: [{ paciente_id: null }, ...(patientId !== undefined ? [{ paciente_id: patientId }] : [])],
        },
        orderBy: [{ variable_codigo: "asc" }, porGravedad],
      })) as UmbralRow[];

      const afinadas = new Set(
        rows.filter((row) => row.paciente_id !== null).map((row) => row.variable_codigo),
      );

      return rows
        .filter((row) => row.paciente_id !== null || !afinadas.has(row.variable_codigo))
        .map(toThreshold);
    },
  );

  app.post(
    "/alert-thresholds",
    { preHandler: [app.requirePermission("alertas", "crear")] },
    async (req, reply) => {
      const input = parseOr400(thresholdSchema, req.body);
      const pacienteId = input.patientId ?? null;
      const paciente = pacienteId === null ? null : await pacienteDelHospital(pacienteId, req);

      const datos = {
        valor_min: input.min,
        valor_max: input.max,
        tipo: input.type,
        plantilla_mensaje: input.messageTemplate,
        activo: true,
      };

      const row = await prisma.$transaction(async (tx) => {
        // La banda ya puede existir dada de baja, y `uq_umbral_variable_paciente_sev`
        // no distingue activas de inactivas: un INSERT chocaría contra el índice
        // y el alta fallaría con un 409 que no significa lo que parece. Se busca
        // primero y se reactiva. De paso, esto es lo que impide dos valores por
        // defecto de la misma banda, que el índice único no puede evitar —en
        // MariaDB dos filas con `paciente_id` NULL no chocan—.
        const previa = (await tx.umbralAlerta.findFirst({
          where: {
            variable_codigo: input.variable,
            paciente_id: pacienteId,
            severidad: input.severity,
          },
        })) as UmbralRow | null;

        if (previa?.activo) {
          throw conflict(
            `Ya hay un umbral ${describir(previa, paciente?.nombre ?? null)}: modifícalo con PATCH /alert-thresholds/${previa.umbral_id}`,
          );
        }

        const creada = (previa
          ? await tx.umbralAlerta.update({ where: { umbral_id: previa.umbral_id }, data: datos })
          : await tx.umbralAlerta.create({
              data: {
                variable_codigo: input.variable,
                paciente_id: pacienteId,
                severidad: input.severity,
                ...datos,
              },
            })) as UmbralRow;

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "umbral_alerta",
          registroId: creada.umbral_id,
          accion: "INSERT",
          observacion: `fijó el umbral ${describir(creada, paciente?.nombre ?? null)}`,
        });
        return creada;
      });

      // Después de la transacción y no dentro: si la escritura se deshace, la
      // ingesta no debe haber tirado una copia que seguía siendo la buena.
      invalidarUmbrales();

      reply.header("Location", `/alert-thresholds/${row.umbral_id}`);
      return reply.code(201).send(toThreshold(row));
    },
  );

  app.patch(
    "/alert-thresholds/:id",
    { preHandler: [app.requirePermission("alertas", "editar")] },
    async (req): Promise<AlertThreshold> => {
      const id = parseOr400(idSchema, (req.params as { id: string }).id);
      const antes = await umbralDelHospital(id, req);
      const input = parseOr400(thresholdPatchSchema, req.body);

      // La coherencia se comprueba sobre el resultado y no sobre el cuerpo: un
      // PATCH que solo manda `min` puede dejarlo por encima del `max` que ya
      // estaba guardado, y esa banda saltaría con cualquier valor.
      const min = input.min !== undefined ? input.min : (antes.valor_min as number | null);
      const max = input.max !== undefined ? input.max : (antes.valor_max as number | null);
      if (min !== null && max !== null && Number(min) > Number(max)) {
        throw conflict("min no puede ser mayor que max: esa banda saltaría con cualquier valor");
      }

      const row = await prisma.$transaction(async (tx) => {
        const actualizada = (await tx.umbralAlerta.update({
          where: { umbral_id: id },
          data: {
            ...(input.min !== undefined ? { valor_min: input.min } : {}),
            ...(input.max !== undefined ? { valor_max: input.max } : {}),
            ...(input.type !== undefined ? { tipo: input.type } : {}),
            ...(input.messageTemplate !== undefined
              ? { plantilla_mensaje: input.messageTemplate }
              : {}),
            ...(input.active !== undefined ? { activo: input.active } : {}),
          },
        })) as UmbralRow;

        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "umbral_alerta",
          registroId: id,
          accion: "UPDATE",
          observacion: `ajustó el umbral ${describir(antes, null)}`,
        });
        return actualizada;
      });

      invalidarUmbrales();
      return toThreshold(row);
    },
  );

  // Baja lógica, como el DELETE de la fábrica: la bitácora referencia el
  // `umbral_id` y una banda retirada sigue explicando las alertas que abrió.
  //
  // Quitar la ÚLTIMA banda propia de un paciente para una variable lo devuelve
  // al valor por defecto general, que es exactamente lo que se espera de
  // deshacer un ajuste. Quitar una general apaga esa banda para todo el mundo.
  app.delete(
    "/alert-thresholds/:id",
    { preHandler: [app.requirePermission("alertas", "eliminar")] },
    async (req, reply) => {
      const id = parseOr400(idSchema, (req.params as { id: string }).id);
      const antes = await umbralDelHospital(id, req);

      await prisma.$transaction(async (tx) => {
        await tx.umbralAlerta.update({ where: { umbral_id: id }, data: { activo: false } });
        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "umbral_alerta",
          registroId: id,
          accion: "DELETE",
          observacion: `retiró el umbral ${describir(antes, null)}`,
        });
      });

      invalidarUmbrales();
      return reply.code(204).send();
    },
  );
}
