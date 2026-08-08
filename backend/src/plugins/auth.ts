import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../env.ts";
import type { Role } from "../types.ts";

export type JwtPayload = {
  sub: string;
  role: Role;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (role: Role) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function authPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: "12h" },
  });

  app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      reply.code(401).send({ error: "No autorizado" });
    }
  });

  // Usage: { preHandler: [app.authenticate, app.requireRole("admin")] }
  app.decorate("requireRole", (role: Role) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (req.user?.role !== role) {
        reply.code(403).send({ error: "Permisos insuficientes" });
      }
    };
  });
}

export default fp(authPlugin);
