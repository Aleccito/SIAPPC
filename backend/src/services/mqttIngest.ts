import mqtt from "mqtt";
import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { env } from "../env.ts";
import { publicarAlerta } from "../lib/eventos.ts";
import { notificarAlerta } from "../lib/notificaciones.ts";

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

// Forma de siappc/<device>/status, ver iot/src/publisher.py y
// iot/monitor/net/publisher.py. Es un mensaje retenido, y el mismo que el
// broker publica por su cuenta (Last Will) si el dispositivo desaparece.
const statusSchema = z.object({
  device: z.string().min(1).max(50),
  status: z.enum(["online", "offline"]),
});

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
  // `pr` es la misma frecuencia que `hr` medida por otra vía (los picos del
  // pletismógrafo en vez del ECG), así que van los mismos rangos. Que las dos
  // se separen es un dato clínico en sí mismo, pero eso necesita comparar dos
  // series y no una lectura suelta: no se puede resolver aquí.
  if (variable === "pr") {
    if (value < 40 || value > 140) {
      return { tipo: "pr_fuera_de_rango", severidad: "critica", mensaje: `Frecuencia de pulso ${value} bpm fuera de rango crítico` };
    }
    if (value < 50 || value > 120) {
      return { tipo: "pr_fuera_de_rango", severidad: "alta", mensaje: `Frecuencia de pulso ${value} bpm fuera de rango` };
    }
    return null;
  }
  // Los mismos límites que el monitor usa en pantalla (AlarmLimits.resp_low /
  // resp_high en iot/monitor/config.py), para que no digan cosas distintas.
  // OJO: `resp` es una estimación sacada del pletismógrafo, no una respiración
  // medida por flujo ni por impedancia. Por eso no llega a "critica": no es un
  // número sobre el que despertar a nadie.
  if (variable === "resp") {
    if (value < 8 || value > 30) {
      return { tipo: "resp_fuera_de_rango", severidad: "alta", mensaje: `Respiración estimada ${value} rpm fuera de rango` };
    }
    return null;
  }
  // El índice de perfusión no es un signo vital: dice cuánta señal le llega al
  // sensor. Por debajo de 0.2 el dedo está mal apoyado o frío, y lo que hay que
  // desconfiar es del SpO2 que sale de ahí, no del paciente. Severidad baja a
  // propósito: es calidad de señal, no una alarma clínica.
  if (variable === "perfusion") {
    if (value < 0.2) {
      return { tipo: "perfusion_baja", severidad: "baja", mensaje: `Índice de perfusión ${value}%: señal débil, el SpO2 puede no ser fiable` };
    }
    return null;
  }
  // ecg: una muestra instantánea de voltaje no dice nada por sí sola, hace
  // falta la forma de onda para detectar arritmias. Sin umbral por ahora.
  return null;
}

// Un dispositivo en `mantenimiento` o `baja` está así porque alguien lo puso a
// mano; que la Pi se conecte no es motivo para deshacer esa decisión. Solo se
// mueve entre los dos estados que describen "está o no está transmitiendo".
async function updateDeviceStatus(device: string, online: boolean, logger: FastifyBaseLogger): Promise<void> {
  const estado = online ? "activo" : "inactivo";
  const { count } = await prisma.dispositivo.updateMany({
    where: {
      codigo: device,
      estado: { in: ["activo", "inactivo"] },
      NOT: { estado },
    },
    data: { estado },
  });
  if (count > 0) {
    logger.info({ device, estado }, "mqtt: dispositivo cambió de estado");
  }
}

async function ingestReading(payload: TelemetryPayload, logger: FastifyBaseLogger): Promise<void> {
  const dispositivo = await prisma.dispositivo.findUnique({
    where: { codigo: payload.device },
    select: { dispositivo_id: true },
  });
  if (!dispositivo) {
    // Sin dispositivo dado de alta no hay hospital_id al que colgar la
    // lectura: se descarta en vez de inventar un dueño.
    logger.warn({ device: payload.device }, "mqtt: lectura descartada, dispositivo no registrado");
    return;
  }

  // La variable tiene que existir en el catálogo antes que el sensor: es de
  // ahí de donde sale la unidad, y `sensor.variable_medida` es una FK contra
  // ella. Una variable que nadie dio de alta se registra con la unidad que
  // reporta el equipo; la primera en llegar es la que queda.
  const variable = await prisma.variable.findUnique({
    where: { codigo: payload.variable },
    select: { unidad: true },
  });

  if (!variable) {
    await prisma.variable.create({
      data: { codigo: payload.variable, unidad: payload.unit },
    });
    logger.info(
      { variable: payload.variable, unidad: payload.unit },
      "mqtt: variable nueva dada de alta en el catálogo",
    );
  } else if (variable.unidad !== payload.unit) {
    // Manda el catálogo. Aceptar la del equipo es lo que antes dejaba la misma
    // constante vital escrita con dos unidades distintas según qué Pi la
    // publicara. La lectura se guarda igual —el valor no se descarta por una
    // etiqueta— pero queda el aviso para corregir el equipo o el catálogo.
    logger.warn(
      { variable: payload.variable, esperada: variable.unidad, recibida: payload.unit },
      "mqtt: unidad distinta a la del catálogo, se ignora la del equipo",
    );
  }

  // El sensor se crea la primera vez que ese dispositivo reporta la variable.
  const sensor = await prisma.sensor.upsert({
    where: {
      dispositivo_id_variable_medida: {
        dispositivo_id: dispositivo.dispositivo_id,
        variable_medida: payload.variable,
      },
    },
    create: {
      dispositivo_id: dispositivo.dispositivo_id,
      variable_medida: payload.variable,
    },
    // Nada que actualizar: la unidad ya no vive aquí y el resto de las columnas
    // del sensor no las decide una lectura.
    update: {},
    select: { sensor_id: true },
  });

  // INSERT IGNORE + el índice único sobre hash_sha256 descartan reenvíos del
  // buffer local de la Pi y duplicados de QoS 1 sin lanzar error. Se hace con
  // SQL crudo porque Prisma no expone IGNORE: la alternativa sería un SELECT
  // previo por cada lectura —una por segundo y por sensor— y aun así quedaría
  // la carrera entre el SELECT y el INSERT.
  const insertadas = await prisma.$executeRaw`
    INSERT IGNORE INTO lectura (sensor_id, valor, fecha_hora, hash_sha256)
    VALUES (${sensor.sensor_id}, ${payload.value}, ${new Date(payload.ts * 1000)}, ${payload.hash})
  `;
  if (insertadas === 0) {
    return;
  }

  const alert = evaluateAlert(payload.variable, payload.value);
  if (alert) {
    // El id de la lectura recién insertada se busca por su hash, que es único:
    // `$executeRaw` devuelve el número de renglones, no LAST_INSERT_ID().
    const lectura = await prisma.lectura.findUnique({
      where: { hash_sha256: payload.hash },
      select: { lectura_id: true },
    });
    if (lectura) {
      const creada = await prisma.alerta.create({
        data: {
          lectura_id: lectura.lectura_id,
          tipo: alert.tipo,
          severidad: alert.severidad,
          mensaje: alert.mensaje,
        },
        select: { alerta_id: true, fecha_hora: true },
      });

      // Aviso en vivo al tablero. Va DESPUÉS de guardar y nunca antes: si el
      // proceso muriera entre el aviso y el INSERT, habría avisado de algo que
      // no existe. Y va fuera de cualquier transacción porque no puede
      // deshacer la alerta si falla.
      const contexto = await prisma.dispositivo.findUnique({
        where: { dispositivo_id: dispositivo.dispositivo_id },
        select: {
          hospital_id: true,
          paciente: { select: { paciente_id: true, nombre: true } },
          hospital: { select: { hospital_id: true } },
        },
      });

      if (contexto) {
        // La bandeja se llena ANTES de empujar el aviso en vivo, y no después:
        // el evento SSE le dice a la campana "vuelve a preguntar", así que si
        // saliera primero, el navegador consultaría /notifications y no
        // encontraría todavía la fila. Un aviso que al pulsarlo no lleva a nada
        // es peor que uno que llega medio segundo más tarde.
        const notificados = await notificarAlerta(
          {
            alertaId: creada.alerta_id,
            dispositivoId: dispositivo.dispositivo_id,
            pacienteId: contexto.paciente?.paciente_id ?? null,
            tipo: alert.tipo,
            severidad: alert.severidad,
          },
          logger,
        );

        publicarAlerta({
          alertId: String(creada.alerta_id),
          hospitalId: contexto.hospital_id,
          device: payload.device,
          patientId: contexto.paciente ? String(contexto.paciente.paciente_id) : null,
          patientName: contexto.paciente?.nombre ?? null,
          variable: payload.variable,
          value: payload.value,
          unit: variable?.unidad ?? payload.unit,
          severity: alert.severidad,
          type: alert.tipo,
          message: alert.mensaje,
          at: creada.fecha_hora.toISOString(),
          notificados,
        });
      }
    }
  }
}

async function handleMessage(topic: string, payloadBuf: Buffer, logger: FastifyBaseLogger): Promise<void> {
  // Al borrar un retenido el broker reparte un mensaje vacío. No es un error ni
  // hay nada que ingerir.
  if (payloadBuf.length === 0) {
    return;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(payloadBuf.toString("utf-8"));
  } catch {
    logger.warn({ topic }, "mqtt: payload no es JSON válido");
    return;
  }

  if (topic.endsWith("/status")) {
    const parsed = statusSchema.safeParse(raw);
    if (!parsed.success) {
      logger.warn({ topic, issues: parsed.error.issues }, "mqtt: estado con forma inválida");
      return;
    }
    await updateDeviceStatus(parsed.data.device, parsed.data.status === "online", logger);
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
    // Los dos temas de una vez. Al suscribirse al de estado el broker entrega
    // los retenidos, así que el backend se pone al día con los equipos que ya
    // estaban conectados (o caídos) antes de que él arrancara.
    client.subscribe([env.mqtt.telemetryTopic, env.mqtt.statusTopic], { qos: 1 }, (err) => {
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
