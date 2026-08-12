import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { isTokenRevoked } from "../lib/sessions.ts";
import { env } from "../env.ts";
import { permissionActions } from "../types.ts";
import type { PermissionAction, Role } from "../types.ts";

export type JwtPayload = {
  sub: string;
  role: Role;
};

// Lo que trae el token ya verificado: la carga de arriba más lo que pone la
// firma. `jti` identifica esta sesión y `exp` es hasta cuándo vale; los dos los
// necesita la revocación al cerrar sesión (lib/sessions.ts).
export type VerifiedJwt = JwtPayload & { jti?: string; exp?: number };

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: VerifiedJwt;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    /**
     * Hospital al que pertenece la cuenta de la sesión.
     *
     * Lo pone `authenticate` desde la base, NO el cuerpo de la petición: el
     * hospital de un registro no es una preferencia del cliente. Antes cada
     * alta lo recibía del navegador —`hospitalId` en el JSON, con un 1 fijo en
     * el frontend—, así que una petición hecha a mano podía dar de alta un
     * paciente, una unidad o una cuenta en un hospital ajeno.
     *
     * Está en todas las rutas que pasan por `authenticate`, y solo en ellas.
     */
    hospitalId: number;
  }

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

  // La cuenta se comprueba contra la base en cada petición y no solo la firma
  // del token: suspender a alguien tiene que surtir efecto ya. `requirePermission`
  // ya exigía `activo = TRUE`, pero las rutas sin módulo de permiso —la sala de
  // espera, los catálogos, el tablero de sensores, /auth/me— no pasan por ahí, y
  // una cuenta dada de baja seguía entrando a todas ellas hasta que expirara el
  // token, doce horas después.
  app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "No autorizado" });
    }

    // Sesión cerrada a propósito: el token sigue bien firmado y sin vencer, y
    // esta lista es lo único que lo distingue de uno vivo.
    if (req.user.jti && (await isTokenRevoked(req.user.jti, req.log))) {
      return reply.code(401).send({ error: "No autorizado" });
    }

    // `hospital_id` viaja en la misma consulta que ya se hacía para comprobar
    // `activo`: no cuesta una ida más a la base.
    const cuenta = await prisma.usuario.findUnique({
      where: { usuario_id: Number(req.user.sub) },
      select: { activo: true, hospital_id: true },
    });

    // Mismo 401 para la cuenta suspendida y para la que ya no existe: en los dos
    // casos el token es válido y la sesión no.
    if (!cuenta?.activo) {
      return reply.code(401).send({ error: "No autorizado" });
    }

    req.hospitalId = cuenta.hospital_id;
  });

  // Usage: { preHandler: [app.authenticate, app.requirePermission("usuarios", "crear")] }
  //
  // El permiso se consulta contra la base en cada petición, no se mete en el
  // token: si un administrador quita un permiso, el cambio surte efecto en la
  // siguiente llamada y no cuando expire la sesión del afectado.
  app.decorate("requirePermission", (modulo: string, accion: PermissionAction) => {
    // Consulta cruda porque la columna a leer se decide en tiempo de ejecución
    // (`puede_ver`, `puede_crear`, …) y eso no se puede expresar con el
    // constructor de consultas: haría falta un `select` distinto por acción.
    //
    // `accion` NO es dato del usuario: viene del literal que pasa cada ruta y
    // el tipo `PermissionAction` lo limita a las cuatro columnas que existen.
    // Aun así se valida contra la lista antes de interpolarla, porque es el
    // único fragmento de SQL de todo el backend que no va parametrizado.
    if (!permissionActions.includes(accion)) {
      throw new Error(`Acción de permiso desconocida: ${accion}`);
    }
    const column = Prisma.raw(`rp.puede_${accion}`);

    return async (req: FastifyRequest, reply: FastifyReply) => {
      const rows = await prisma.$queryRaw<{ permitido: number | boolean }[]>`
        SELECT ${column} AS permitido
        FROM usuario u
        JOIN rol_permiso rp ON rp.rol_id = u.rol_id
        JOIN permiso p ON p.permiso_id = rp.permiso_id
        WHERE u.usuario_id = ${Number(req.user.sub)}
          AND u.activo = TRUE
          AND p.modulo = ${modulo}
      `;

      if (!rows[0]?.permitido) {
        reply.code(403).send({ error: "Permisos insuficientes" });
      }
    };
  });
}

export default fp(authPlugin);
