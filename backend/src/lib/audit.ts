import type { Pool, PoolConnection } from "mysql2/promise";

// Acciones que la bitácora acepta; el ENUM de `auditoria.accion` en
// db/schema.sql es la fuente. LOGIN/LOGOUT/LOGIN_BLOCKED los escribe
// routes/auth.ts por su cuenta, porque no son cambios sobre un registro.
export type AuditAction = "INSERT" | "UPDATE" | "DELETE";

// Pool y PoolConnection comparten `query`, así que el mismo helper sirve suelto
// o dentro de una transacción. El tipo lo pide explícito para que quien llame
// tenga que decidir cuál de los dos usa.
type Queryable = Pick<Pool | PoolConnection, "query">;

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
  await db.query(
    `INSERT INTO auditoria (usuario_id, entidad, registro_id, accion, observacion)
     VALUES (?, ?, ?, ?, ?)`,
    [entry.actorId, entry.entidad, entry.registroId, entry.accion, entry.observacion],
  );
}
