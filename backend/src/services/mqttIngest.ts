import mqtt from "mqtt";
import type { FastifyBaseLogger } from "fastify";
import type { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { env } from "../env.ts";
import type { DispositivoRow, SensorRow } from "../types.ts";

// Forma de siappc/<device>/telemetry, ver iot/src/publisher.py:build_payload.
// `variable` no es un enum cerrado: sensor.variable_medida es VARCHAR(60) y
// nuevos tipos de sensor no deberían requerir tocar el backend.
const telemetrySchema = z.object({
  device: z.string().min(1).max(50),
  variable: z.string().min(1).max(60),
  value: z.number().finite(),
  unit: z.string().min(1).max(20),
  ts: z.number().finite(),
  hash: z.string().length(64),
});

type TelemetryPayload = z.infer<typeof telemetrySchema>;

type AlertInfo = {
  tipo: string;
  severidad: "baja" | "media" | "alta" | "critica";
  mensaje: string;
};

// Umbrales fijos de arranque: no hay tabla de configuración por paciente/sensor
// todavía, así que esto es un mínimo viable, no la lógica clínica final.
function evaluateAlert(variable: string, value: number): AlertInfo | null {
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
  // ecg: una muestra instantánea de voltaje no dice nada por sí sola, hace
  // falta la forma de onda para detectar arritmias. Sin umbral por ahora.
  return null;
}

async function ingestReading(payload: TelemetryPayload, logger: FastifyBaseLogger): Promise<void> {
  const [dispRows] = await pool.query<DispositivoRow[]>(
    "SELECT dispositivo_id FROM dispositivo WHERE codigo = ?",
    [payload.device],
  );
  const dispositivo = dispRows[0];
  if (!dispositivo) {
    // Sin dispositivo dado de alta no hay hospital_id al que colgar la
    // lectura: se descarta en vez de inventar un dueño.
    logger.warn({ device: payload.device }, "mqtt: lectura descartada, dispositivo no registrado");
    return;
  }

  await pool.query(
    `INSERT INTO sensor (dispositivo_id, variable_medida, unidad)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE unidad = VALUES(unidad)`,
    [dispositivo.dispositivo_id, payload.variable, payload.unit],
  );
  const [sensorRows] = await pool.query<SensorRow[]>(
    "SELECT sensor_id FROM sensor WHERE dispositivo_id = ? AND variable_medida = ?",
    [dispositivo.dispositivo_id, payload.variable],
  );
  const sensor = sensorRows[0]!;

  // INSERT IGNORE + el índice único sobre hash_sha256 descartan reenvíos del
  // buffer local de la Pi y duplicados de QoS 1 sin lanzar error.
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT IGNORE INTO lectura (sensor_id, valor, fecha_hora, hash_sha256)
     VALUES (?, ?, ?, ?)`,
    [sensor.sensor_id, payload.value, new Date(payload.ts * 1000), payload.hash],
  );
  if (result.affectedRows === 0) {
    return;
  }

  const alert = evaluateAlert(payload.variable, payload.value);
  if (alert) {
    await pool.query(
      "INSERT INTO alerta (lectura_id, tipo, severidad, mensaje) VALUES (?, ?, ?, ?)",
      [result.insertId, alert.tipo, alert.severidad, alert.mensaje],
    );
  }
}

async function handleMessage(topic: string, payloadBuf: Buffer, logger: FastifyBaseLogger): Promise<void> {
  let raw: unknown;
  try {
    raw = JSON.parse(payloadBuf.toString("utf-8"));
  } catch {
    logger.warn({ topic }, "mqtt: payload no es JSON válido");
    return;
  }

  const parsed = telemetrySchema.safeParse(raw);
  if (!parsed.success) {
    logger.warn({ topic, issues: parsed.error.issues }, "mqtt: payload con forma inválida");
    return;
  }

  await ingestReading(parsed.data, logger);
}

// Se conecta en segundo plano: si el broker no está arriba, mqtt.js reintenta
// solo y el servidor HTTP sigue respondiendo mientras tanto.
export function startMqttIngest(logger: FastifyBaseLogger): mqtt.MqttClient {
  const tls = env.mqtt.tls;
  const options: mqtt.IClientOptions = {
    protocol: tls ? "mqtts" : "mqtt",
    host: env.mqtt.host,
    port: env.mqtt.port,
    username: env.mqtt.user,
    password: env.mqtt.password,
    clientId: `siappc-backend-${Math.random().toString(16).slice(2)}`,
    reconnectPeriod: 2000,
  };

  if (tls) {
    options.ca = tls.ca;
    options.cert = tls.cert;
    options.key = tls.key;
    // Explícito aunque sea el valor por defecto de Node: con una CA propia y
    // autofirmada es la línea que separa "cifrado" de "cifrado y autenticado",
    // y no debe desactivarse para silenciar un certificado mal emitido — hay
    // que reemitirlo con el SAN correcto (infra/mosquitto/gen-certs.sh).
    options.rejectUnauthorized = true;
  }

  const client = mqtt.connect(options);

  client.on("connect", () => {
    const scheme = tls ? "mqtts" : "mqtt";
    logger.info(`mqtt: conectado a ${scheme}://${env.mqtt.host}:${env.mqtt.port}`);
    client.subscribe(env.mqtt.telemetryTopic, { qos: 1 }, (err) => {
      if (err) logger.error({ err }, "mqtt: fallo al suscribirse");
    });
  });

  client.on("reconnect", () => logger.warn("mqtt: reconectando…"));
  client.on("error", (err) => logger.error({ err }, "mqtt: error de conexión"));

  client.on("message", (topic, payloadBuf) => {
    handleMessage(topic, payloadBuf, logger).catch((err: unknown) => {
      logger.error({ err, topic }, "mqtt: error procesando mensaje");
    });
  });

  return client;
}
