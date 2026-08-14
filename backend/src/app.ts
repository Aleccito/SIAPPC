import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import { env } from "./env.ts";
import { registerErrorHandler } from "./lib/http.ts";
import { redis, registerRedisLogging } from "./lib/redis.ts";
import authPlugin from "./plugins/auth.ts";
import authRoutes from "./routes/auth.ts";
import usersRoutes from "./routes/users.ts";
import rolesRoutes from "./routes/roles.ts";
import auditRoutes from "./routes/audit.ts";
import catalogRoutes from "./routes/catalogs.ts";
import patientsRoutes from "./routes/patients.ts";
import sensorsRoutes from "./routes/sensors.ts";
import soapRoutes from "./routes/soap.ts";
import historiaRoutes from "./routes/historia.ts";
import reportsRoutes from "./routes/reports.ts";
import dashboardRoutes from "./routes/dashboard.ts";
import bedsRoutes from "./routes/beds.ts";
import monitoringRoutes from "./routes/monitoring.ts";
import admissionsRoutes from "./routes/admissions.ts";
import appointmentsRoutes from "./routes/appointments.ts";
import alertsStreamRoutes from "./routes/alertsStream.ts";
import reportesCsvRoutes from "./routes/reportesCsv.ts";
import searchRoutes from "./routes/search.ts";
import notificationsRoutes from "./routes/notifications.ts";

export async function buildApp() {
  const app = Fastify({
    // `silent` solo lo usan las pruebas (.env.test): trece casos con el log de
    // peticiones a nivel info entierran el resultado de la suite.
    logger: { level: process.env.LOG_LEVEL ?? "info" },
    // En Compose el navegador nunca habla con este proceso: nginx hace de
    // intermediario y todas las peticiones llegan con su IP. Sin esto, el
    // límite de intentos contaría a todo el hospital como un solo cliente.
    // nginx ya manda X-Forwarded-For (ver frontend/nginx.conf).
    trustProxy: true,
  });

  // Forma única de los errores para toda la API, incluidos los que lanza
  // Prisma (llave duplicada, referencia rota, registro inexistente).
  registerErrorHandler(app);

  await app.register(sensible);
  await app.register(cors, {
    // Lista blanca del entorno; ver ALLOWED_ORIGINS en env.ts.
    origin: env.allowedOrigins,
    // Sin esto el navegador entrega la respuesta pero esconde estas dos
    // cabeceras: el total de una lista (lib/crud.ts) y la URL del recurso recién
    // creado. Las pruebas usan `inject()`, que no aplica CORS, así que la falta
    // solo se ve desde el navegador.
    exposedHeaders: ["X-Total-Count", "Location"],
  });

  registerRedisLogging(app.log);

  // Techo general para toda la API. Los endpoints sensibles lo aprietan por su
  // cuenta con `config.rateLimit` — ver POST /auth/login.
  await app.register(rateLimit, {
    max: env.rateLimitMax,
    timeWindow: "1 minute",
    // Con el contador en memoria, cada réplica del backend dejaba pasar el
    // límite completo por su cuenta: dos instancias = el doble de intentos de
    // login, y un reinicio borraba los bloqueos. En Redis el contador es uno
    // solo para todas, y sobrevive al reinicio del proceso.
    //
    // `redis` a null hace que el plugin use su store en memoria — es el camino
    // de `npm run dev` sin REDIS_URL, no el de Compose.
    redis: redis ?? undefined,
    // Prefijo propio para que `FLUSHDB` no haga falta nunca y las claves del
    // rate limit no se confundan con las de la caché (ver lib/cache.ts).
    nameSpace: "siappc-rl:",
    // Si Redis falla, la petición pasa en vez de responder 500. Es la política
    // por defecto del plugin y aquí se deja explícita porque tiene un costo
    // real: mientras Redis esté caído NO hay límite de peticiones, ni siquiera
    // en /auth/login. Por eso el backend depende de `service_healthy` en
    // docker-compose.yml y el error queda en el log — un Redis caído es un
    // incidente de operación, no un modo de funcionamiento.
    skipOnError: true,
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
  await app.register(soapRoutes);
  await app.register(historiaRoutes);
  await app.register(reportsRoutes);
  await app.register(dashboardRoutes);
  await app.register(bedsRoutes);
  await app.register(monitoringRoutes);
  await app.register(admissionsRoutes);
  await app.register(appointmentsRoutes);
  await app.register(alertsStreamRoutes);
  await app.register(reportesCsvRoutes);
  await app.register(searchRoutes);
  await app.register(notificationsRoutes);

  return app;
}
