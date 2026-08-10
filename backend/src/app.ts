import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import { env } from "./env.ts";
import authPlugin from "./plugins/auth.ts";
import authRoutes from "./routes/auth.ts";
import usersRoutes from "./routes/users.ts";
import rolesRoutes from "./routes/roles.ts";
import auditRoutes from "./routes/audit.ts";
import catalogRoutes from "./routes/catalogs.ts";
import patientsRoutes from "./routes/patients.ts";
import sensorsRoutes from "./routes/sensors.ts";

export async function buildApp() {
  const app = Fastify({
    logger: true,
    // En Compose el navegador nunca habla con este proceso: nginx hace de
    // intermediario y todas las peticiones llegan con su IP. Sin esto, el
    // límite de intentos contaría a todo el hospital como un solo cliente.
    // nginx ya manda X-Forwarded-For (ver frontend/nginx.conf).
    trustProxy: true,
  });

  await app.register(sensible);
  await app.register(cors, {
    // Lista blanca del entorno; ver ALLOWED_ORIGINS en env.ts.
    origin: env.allowedOrigins,
  });

  // Techo general para toda la API. Los endpoints sensibles lo aprietan por su
  // cuenta con `config.rateLimit` — ver POST /auth/login.
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(authPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes);
  await app.register(usersRoutes);
  await app.register(rolesRoutes);
  await app.register(auditRoutes);
  await app.register(catalogRoutes);
  await app.register(patientsRoutes);
  await app.register(sensorsRoutes);

  return app;
}
