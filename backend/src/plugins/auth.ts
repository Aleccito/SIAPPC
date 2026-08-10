import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { RowDataPacket } from "mysql2";
import { pool } from "../../db/db.ts";
import { env } from "../env.ts";
import type { PermissionAction, Role } from "../types.ts";

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
    requirePermission: (
      modulo: string,
      accion: PermissionAction,
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
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

  // Usage: { preHandler: [app.authenticate, app.requirePermission("usuarios", "crear")] }
  //
  // El permiso se consulta contra la base en cada petición, no se mete en el
  // token: si un administrador quita un permiso, el cambio surte efecto en la
  // siguiente llamada y no cuando expire la sesión del afectado.
  app.decorate("requirePermission", (modulo: string, accion: PermissionAction) => {
    const column = `puede_${accion}`;

    return async (req: FastifyRequest, reply: FastifyReply) => {
      const [rows] = await pool.query<(RowDataPacket & { permitido: number })[]>(
        `SELECT rp.${column} AS permitido
         FROM usuario u
         JOIN rol_permiso rp ON rp.rol_id = u.rol_id
         JOIN permiso p ON p.permiso_id = rp.permiso_id
         WHERE u.usuario_id = ? AND u.activo = TRUE AND p.modulo = ?`,
        [req.user.sub, modulo],
      );

      if (!rows[0]?.permitido) {
        reply.code(403).send({ error: "Permisos insuficientes" });
      }
    };
  });
}

export default fp(authPlugin);
