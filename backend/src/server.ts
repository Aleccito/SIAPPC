import { buildApp } from "./app.ts";
import { env } from "./env.ts";
import { startMqttIngest } from "./services/mqttIngest.ts";

const app = await buildApp();

// No bloqueante: si el broker no está arriba, mqtt.js reintenta solo y el
// servidor HTTP sigue respondiendo mientras tanto.
startMqttIngest(app.log);

app.listen({ port: env.port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
