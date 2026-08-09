import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import authPlugin from "./plugins/auth.ts";
import authRoutes from "./routes/auth.ts";
import usersRoutes from "./routes/users.ts";
import rolesRoutes from "./routes/roles.ts";
import auditRoutes from "./routes/audit.ts";
import catalogRoutes from "./routes/catalogs.ts";
import patientsRoutes from "./routes/patients.ts";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(sensible);
  await app.register(cors, {
    // Vite dev server default; tighten this once the frontend has a real origin.
    origin: ["http://localhost:5173"],
  });
  await app.register(authPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes);
  await app.register(usersRoutes);
  await app.register(rolesRoutes);
  await app.register(auditRoutes);
  await app.register(catalogRoutes);
  await app.register(patientsRoutes);

  return app;
}
