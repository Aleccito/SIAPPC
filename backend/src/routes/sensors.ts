import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { cached, cacheKey } from "../lib/cache.ts";
import { env } from "../env.ts";
import { alertSeverities, alertStatuses } from "../types.ts";
import type { AlertaRow, LecturaRow, SensorAlert, SensorReading } from "../types.ts";

function toReading(row: LecturaRow): SensorReading {
  return {
    id: String(row.lectura_id),
    device: row.codigo,
    variable: row.variable_medida,
    unit: row.unidad,
    value: Number(row.valor),
    at: new Date(row.fecha_hora).toISOString(),
  };
}

function toAlert(row: AlertaRow): SensorAlert {
  return {
    id: String(row.alerta_id),
    readingId: String(row.lectura_id),
    device: row.codigo,
    variable: row.variable_medida,
    unit: row.unidad,
    value: Number(row.valor),
    type: row.tipo,
    severity: row.severidad,
    message: row.mensaje,
    status: row.estado,
    at: new Date(row.fecha_hora).toISOString(),
    resolvedAt: row.fecha_resolucion ? new Date(row.fecha_resolucion).toISOString() : null,
  };
}

const querySchema = z.object({
  device: z.string().min(1).optional(),
  variable: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(500).optional(),
});

const alertsQuerySchema = querySchema.extend({
  severity: z.enum(alertSeverities).optional(),
  status: z.enum(alertStatuses).optional(),
});

// Lecturas y alertas que alimentan el tablero de sensores y los reportes del
// frontend; ambas se llenan desde la ingesta MQTT (services/mqttIngest.ts).
//
// Las dos van por caché en Redis (lib/cache.ts) con TTL corto. Son las únicas
// consultas del backend que barren tablas que crecen sin techo —una lectura por
// segundo y por sensor— con tres JOIN y un ORDER BY, y el tablero las repite en
// cada refresco para todos los usuarios conectados a la vez.
//
// La clave de caché NO incluye al usuario porque estas consultas todavía no
// filtran por hospital ni por unidad: la respuesta es la misma para cualquiera
// que pase el `authenticate`. El día que se agregue ese filtro, el
// identificador correspondiente tiene que entrar en la clave, o un usuario
// terminaría leyendo la respuesta cacheada de otro hospital.
export default async function sensorsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/sensors/readings", async (req, reply) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues });
    }
    const { device, variable, limit = 100 } = parsed.data;

    // Se construye desde `parsed.data`, no desde `req.query`: así la clave usa
    // los valores ya validados y normalizados por zod (`limit` es número, no la
    // cadena que vino en la URL) y una query basura nunca llega a crear clave.
    const key = cacheKey("readings", { device, variable, limit });

    return cached(key, env.sensorsCacheTtl, req.log, async () => {
      const conditions: string[] = [];
      const params: (string | number)[] = [];
      if (device) {
        conditions.push("d.codigo = ?");
        params.push(device);
      }
      if (variable) {
        conditions.push("s.variable_medida = ?");
        params.push(variable);
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

      const [rows] = await pool.query<LecturaRow[]>(
        `SELECT l.lectura_id, l.valor, l.fecha_hora, s.variable_medida, s.unidad, d.codigo
         FROM lectura l
         JOIN sensor s ON s.sensor_id = l.sensor_id
         JOIN dispositivo d ON d.dispositivo_id = s.dispositivo_id
         ${where}
         ORDER BY l.fecha_hora DESC
         LIMIT ?`,
        [...params, limit],
      );
      return rows.map(toReading);
    });
  });

  app.get("/sensors/alerts", async (req, reply) => {
    const parsed = alertsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues });
    }
    const { device, variable, severity, status, limit = 100 } = parsed.data;

    const key = cacheKey("alerts", { device, variable, severity, status, limit });

    return cached(key, env.sensorsCacheTtl, req.log, async () => {
      const conditions: string[] = [];
      const params: (string | number)[] = [];
      if (device) {
        conditions.push("d.codigo = ?");
        params.push(device);
      }
      if (variable) {
        conditions.push("s.variable_medida = ?");
        params.push(variable);
      }
      if (severity) {
        conditions.push("a.severidad = ?");
        params.push(severity);
      }
      if (status) {
        conditions.push("a.estado = ?");
        params.push(status);
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

      // alerta.fecha_hora es DATETIME (segundos), así que un lote de alertas
      // del mismo segundo empataría: alerta_id desempata por orden de
      // inserción.
      const [rows] = await pool.query<AlertaRow[]>(
        `SELECT a.alerta_id, a.lectura_id, a.tipo, a.severidad, a.mensaje, a.estado,
                a.fecha_hora, a.fecha_resolucion,
                l.valor, s.variable_medida, s.unidad, d.codigo
         FROM alerta a
         JOIN lectura l ON l.lectura_id = a.lectura_id
         JOIN sensor s ON s.sensor_id = l.sensor_id
         JOIN dispositivo d ON d.dispositivo_id = s.dispositivo_id
         ${where}
         ORDER BY a.fecha_hora DESC, a.alerta_id DESC
         LIMIT ?`,
        [...params, limit],
      );
      return rows.map(toAlert);
    });
  });
}
