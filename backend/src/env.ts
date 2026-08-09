const {
  PORT = "3001",
  JWT_SECRET,
  MQTT_HOST = "localhost",
  MQTT_PORT = "1883",
  MQTT_USER,
  MQTT_PASSWORD,
  // + comodín: un solo suscriptor cubre todos los dispositivos, cada uno
  // publica en su propio siappc/<device>/telemetry.
  MQTT_TELEMETRY_TOPIC = "siappc/+/telemetry",
} = process.env;

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET en el entorno (.env)");
  process.exit(1);
}

export const env = {
  port: Number(PORT),
  jwtSecret: JWT_SECRET,
  mqtt: {
    host: MQTT_HOST,
    port: Number(MQTT_PORT),
    user: MQTT_USER || undefined,
    password: MQTT_PASSWORD || undefined,
    telemetryTopic: MQTT_TELEMETRY_TOPIC,
  },
};
