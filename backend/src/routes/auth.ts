import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { revokeToken } from "../lib/sessions.ts";
import { notFound } from "../lib/http.ts";
import { costOf, verifyAgainstDummy, verifyPassword } from "../lib/passwords.ts";
import { redis } from "../lib/redis.ts";
import { toUser, USER_INCLUDE } from "./users.ts";
import type { UsuarioConRelaciones } from "./users.ts";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function attemptedEmail(req: FastifyRequest): string {
  const body = req.body as { email?: unknown } | undefined;
  return typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
}

const LOGIN_WINDOW_SECONDS = 15 * 60;

/**
 * Con qué coste de bcrypt se compara cuando el correo no existe.
 *
 * Sale de la propia base —el coste va escrito en el prefijo de cada hash— para
 * que fallar sin cuenta cueste lo mismo que fallar con ella. Fijarlo en el
 * código volvería a separar los dos tiempos en cuanto la base y `SALT_ROUNDS`
 * no coincidieran, que es exactamente lo que pasaba aquí.
 *
 * Se pregunta una vez por proceso y se guarda la promesa, no el número: así dos
 * peticiones simultáneas al arrancar comparten la misma consulta en vez de
 * lanzar una cada una. Si la consulta falla, `costOf` de una cadena vacía
 * devuelve `SALT_ROUNDS` y el login sigue funcionando.
 */
let costoSeñuelo: Promise<number> | null = null;

function dummyCost(): Promise<number> {
  costoSeñuelo ??= prisma.usuario
    .findFirst({ select: { password_hash: true }, orderBy: { usuario_id: "asc" } })
    .then((fila) => costOf(fila?.password_hash ?? ""))
    .catch(() => costOf(""));
  return costoSeñuelo;
}

/**
 * ¿Es este el PRIMER bloqueo de esta clave en esta ventana?
 *
 * `onExceeded` del plugin se dispara en CADA petición pasada del tope, no una
 * sola vez al cruzarlo. Sin esta guarda, quien siga insistiendo escribe un
 * renglón de auditoría por intento: la tabla que sirve para detectar el ataque
 * se llena con el ataque, y encima con escrituras que nadie espera (la llamada
 * va sin `await`, así que tampoco hay contrapresión). Comprobado antes del
 * arreglo: 3 peticiones bloqueadas, 3 renglones idénticos.
 *
 * `SET NX EX` sobre la misma clave del límite: el primero se la lleva y los
 * demás se van en silencio hasta que expira, igual que la ventana.
 *
 * Con Redis caído se devuelve `false`. No es una pérdida real: sin Redis el
 * límite tampoco cuenta (`skipOnError` en app.ts), así que no habría 429 ni
 * `onExceeded` que registrar; y ante la duda, perder un renglón es mejor que
 * inundar la bitácora. Sin REDIS_URL —solo `npm run dev`— se registra siempre,
 * que es lo que había.
 */
async function firstBlockInWindow(key: string): Promise<boolean> {
  if (!redis) return true;
  try {
    const won = await redis.set(
      `siappc-lb:${key}`,
      "1",
      "EX",
      LOGIN_WINDOW_SECONDS,
      "NX",
    );
    return won === "OK";
  } catch {
    return false;
  }
}

// Queda constancia del bloqueo en la misma bitácora que el resto: contar
// LOGIN_BLOCKED por IP en una ventana de tiempo es lo que permite detectar
// fuerza bruta sin montar otra tabla.
async function recordBlockedLogin(email: string, ip: string): Promise<void> {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    select: { usuario_id: true },
  });
  // Si el correo no existe no hay a quién colgarle el evento: `usuario_id` va
  // nulo y `registro_id`, que no admite nulos, va en 0.
  await prisma.auditoria.create({
    data: {
      usuario_id: usuario?.usuario_id ?? null,
      entidad: "usuario",
      registro_id: BigInt(usuario?.usuario_id ?? 0),
      accion: "LOGIN_BLOCKED",
      observacion: JSON.stringify({ ip, email }),
    },
  });
}

export default async function authRoutes(app: FastifyInstance) {
  const loginRateLimit = {
    max: 5,
    timeWindow: LOGIN_WINDOW_SECONDS * 1000,
    // La clave junta IP y correo intentado. Solo con la IP, un atacante desde
    // otra red deja fuera al usuario legítimo; solo con el correo, basta rotar
    // direcciones. El techo global de 100/min cubre el caso de una sola IP
    // probando muchos correos distintos.
    //
    // `preHandler` en vez del `onRequest` por defecto porque en onRequest el
    // cuerpo todavía no está parseado y `req.body` sería undefined.
    hook: "preHandler" as const,
    keyGenerator: (req: FastifyRequest) => `${req.ip}|${attemptedEmail(req)}`,
    onExceeded: (req: FastifyRequest, key: string) => {
      firstBlockInWindow(key)
        .then((primero) => {
          if (!primero) return;
          return recordBlockedLogin(attemptedEmail(req), req.ip);
        })
        .catch((err: unknown) => {
          req.log.error({ err }, "auth: no se pudo registrar el bloqueo de login");
        });
    },
  };

  app.post("/auth/login", { config: { rateLimit: loginRateLimit } }, async (req, reply) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Email y contraseña son requeridos" });
    }
    const { email, password } = parsed.data;

    // Es la única consulta que lee `password_hash`; el resto usa el mismo
    // `USER_INCLUDE` sin él.
    const row = await prisma.usuario.findUnique({
      where: { email },
      include: USER_INCLUDE,
    });

    // Same error for "no existe" and "clave incorrecta": don't leak which one
    // failed. El mensaje ya era igual; lo que delataba la diferencia era el
    // TIEMPO — sin usuario no se llegaba a bcrypt y la respuesta salía en 8 ms
    // en vez de 110. Sin cuenta se compara igualmente contra un hash de mentira
    // (ver verifyAgainstDummy) para que las dos ramas cuesten lo mismo.
    //
    // La cuenta suspendida entra por la misma puerta y a propósito: si se
    // cortara antes de comparar, volvería a haber dos tiempos distintos y
    // "suspendida" sería distinguible de "no existe".
    const passwordOk = row
      ? await verifyPassword(password, row.password_hash)
      : await verifyAgainstDummy(password, await dummyCost());

    if (!row || !row.activo || !passwordOk) {
      return reply.code(401).send({ error: "Credenciales inválidas" });
    }

    // Alimenta la columna "Última Actividad" de la administración de usuarios.
    await prisma.$transaction([
      prisma.usuario.update({
        where: { usuario_id: row.usuario_id },
        data: { ultimo_acceso: new Date() },
      }),
      prisma.auditoria.create({
        data: {
          usuario_id: row.usuario_id,
          entidad: "usuario",
          registro_id: BigInt(row.usuario_id),
          accion: "LOGIN",
          observacion: null,
        },
      }),
    ]);

    // El `jti` es lo que hace revocable esta sesión: identifica a ESTE token, no
    // al usuario, así que cerrar sesión aquí no toca las demás sesiones abiertas
    // de la misma persona (ver lib/sessions.ts).
    const token = await reply.jwtSign(
      { sub: String(row.usuario_id), role: row.rol.nombre },
      { jti: randomUUID() },
    );
    return { token, user: toUser(row) };
  });

  // Cierra la sesión de verdad: el token queda en la lista de revocados y deja
  // de pasar `authenticate` aunque le falten horas para vencer. Es por token, no
  // por usuario — salir en un dispositivo no echa a nadie de los otros.
  //
  // Y deja el renglón LOGOUT en la bitácora, la otra mitad del par LOGIN/LOGOUT:
  // sin él no se puede reconstruir cuánto duró una sesión.
  app.post("/auth/logout", { preHandler: [app.authenticate] }, async (req, reply) => {
    // Sin `jti` —un token firmado antes de que existiera la revocación— no hay
    // qué revocar. La sesión termina igual del lado del navegador y la salida
    // sigue quedando anotada; caduca sola en lo que le reste de las 12 h.
    if (req.user.jti && req.user.exp) {
      const revocado = await revokeToken(req.user.jti, req.user.exp, req.log);
      if (!revocado) {
        // Pasa sin Redis o con Redis caído. El usuario ve una salida normal y su
        // navegador tira el token, pero una copia de ese token seguiría sirviendo:
        // queda en el log porque es lo que hay que ver al investigar después.
        req.log.warn(
          { usuario: req.user.sub },
          "auth: sesión cerrada SIN revocar el token — el token sigue siendo válido",
        );
      }
    }

    await prisma.auditoria.create({
      data: {
        usuario_id: Number(req.user.sub),
        entidad: "usuario",
        registro_id: BigInt(req.user.sub),
        accion: "LOGOUT",
        observacion: null,
      },
    });
    return reply.code(204).send();
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (req) => {
    const row = (await prisma.usuario.findUnique({
      where: { usuario_id: Number(req.user.sub) },
      include: USER_INCLUDE,
    })) as UsuarioConRelaciones | null;
    if (!row) throw notFound("Usuario no encontrado");
    return toUser(row);
  });
}
