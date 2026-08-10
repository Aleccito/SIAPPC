import { readFileSync } from "node:fs";

const {
  PORT = "3001",
  JWT_SECRET,
  // Orígenes del navegador autorizados, separados por coma. Obligatoria: nunca
  // `origin: true`, que acepta cualquier sitio y convierte la cookie de sesión
  // de cualquier usuario en un arma para el primero que monte una página.
  ALLOWED_ORIGINS,
  MQTT_HOST = "localhost",
  // El broker solo escucha TLS: 8883, no 1883.
  MQTT_PORT = "8883",
  MQTT_USER,
  MQTT_PASSWORD,
  // + comodín: un solo suscriptor cubre todos los dispositivos, cada uno
  // publica en su propio siappc/<device>/telemetry.
  MQTT_TELEMETRY_TOPIC = "siappc/+/telemetry",
  // Solo para apuntar a un broker heredado sin TLS. En Compose nunca se usa:
  // el broker no tiene listener en texto plano.
  MQTT_TLS = "true",
  MQTT_CA_FILE,
  // Certificado de cliente: solo si el broker exige mTLS
  // (require_certificate true). Los dos van juntos o ninguno.
  MQTT_CLIENT_CERT_FILE,
  MQTT_CLIENT_KEY_FILE,
} = process.env;

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET en el entorno (.env)");
  process.exit(1);
}

const allowedOrigins = (ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.error(
    "Falta ALLOWED_ORIGINS en el entorno (.env): lista de orígenes separados por coma, " +
      "por ejemplo http://localhost:8080,http://localhost:5173",
  );
  process.exit(1);
}

const mqttTls = MQTT_TLS !== "false";

if (mqttTls && !MQTT_CA_FILE) {
  console.error(
    "Falta MQTT_CA_FILE: con MQTT_TLS=true hace falta la CA que firma el certificado del broker",
  );
  process.exit(1);
}

if (Boolean(MQTT_CLIENT_CERT_FILE) !== Boolean(MQTT_CLIENT_KEY_FILE)) {
  console.error("MQTT_CLIENT_CERT_FILE y MQTT_CLIENT_KEY_FILE se configuran juntos");
  process.exit(1);
}

// Se leen al arrancar y no en cada conexión: un certificado que falta es un
// error de configuración, no una caída del broker. Mejor descubrirlo aquí que
// en cada reintento silencioso de mqtt.js.
function readPem(path: string, varName: string): Buffer {
  try {
    return readFileSync(path);
  } catch {
    console.error(`No se puede leer ${varName}=${path}`);
    process.exit(1);
  }
}

export const env = {
  port: Number(PORT),
  jwtSecret: JWT_SECRET,
  allowedOrigins,
  mqtt: {
    host: MQTT_HOST,
    port: Number(MQTT_PORT),
    user: MQTT_USER || undefined,
    password: MQTT_PASSWORD || undefined,
    telemetryTopic: MQTT_TELEMETRY_TOPIC,
    // null = conexión en texto plano. Con TLS activo el certificado del broker
    // se valida siempre contra esta CA: no hay interruptor para saltarse la
    // verificación, porque un `rejectUnauthorized: false` olvidado deja la
    // conexión cifrada pero suplantable.
    tls: mqttTls
      ? {
          ca: readPem(MQTT_CA_FILE!, "MQTT_CA_FILE"),
          cert: MQTT_CLIENT_CERT_FILE
            ? readPem(MQTT_CLIENT_CERT_FILE, "MQTT_CLIENT_CERT_FILE")
            : undefined,
          key: MQTT_CLIENT_KEY_FILE
            ? readPem(MQTT_CLIENT_KEY_FILE, "MQTT_CLIENT_KEY_FILE")
            : undefined,
        }
      : null,
  },
};
