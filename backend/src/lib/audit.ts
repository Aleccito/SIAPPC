import type { prisma } from "./prisma.ts";

// Acciones que la bitácora acepta; el ENUM de `auditoria.accion` en
// prisma/schema.prisma es la fuente. LOGIN/LOGOUT/LOGIN_BLOCKED los escribe
// routes/auth.ts por su cuenta, porque no son cambios sobre un registro.
export type AuditAction = "INSERT" | "UPDATE" | "DELETE";

/**
 * El cliente de Prisma o el de dentro de una `$transaction`. Los dos exponen
 * los mismos modelos; el tipo lo pide explícito para que quien llame tenga que
 * decidir cuál de los dos usa.
 */
export type Queryable = Omit<typeof prisma, `$${string}`>;

/**
 * Escribe un renglón en `auditoria`.
 *
 * `actorId` es quien ejecuta la acción (`req.user.sub`), no a quién le pasa:
 * ese es `registroId`, junto con `entidad`. En una suspensión de cuenta son dos
 * usuarios distintos y confundirlos deja la bitácora inservible.
 *
 * Se llama SIEMPRE dentro de la misma transacción que el cambio que describe.
 * Registrarlo aparte —o tragarse el error para no fallar la petición— es
 * justamente lo que produce cambios sin rastro, que es lo que esta tabla existe
 * para evitar: si no se puede dejar constancia, el cambio no se hace.
 */
export async function recordAudit(
  db: Queryable,
  entry: {
    actorId: string | number | null;
    entidad: string;
    registroId: string | number;
    accion: AuditAction;
    observacion: string | null;
  },
): Promise<void> {
  await db.auditoria.create({
    data: {
      usuario_id: entry.actorId === null ? null : Number(entry.actorId),
      entidad: entry.entidad,
      registro_id: BigInt(entry.registroId),
      accion: entry.accion,
      observacion: entry.observacion,
    },
  });
}
