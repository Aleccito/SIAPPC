// Liberar el monitor de un paciente. Lo usan routes/devices.ts (liberar a mano) y routes/admissions.ts (egreso y
// cancelación del ingreso): un monitor no se queda pegado a alguien que ya se fue.
import { recordAudit, type Queryable } from "./audit.ts";

/**
 * Deja sin paciente todos los monitores de `pacienteId`, dentro de la transacción de quien llama, y lo deja en la
 * bitácora. Devuelve los códigos liberados, para avisarles por MQTT DESPUÉS de confirmar la transacción.
 */
export async function liberarMonitoresDe(
  tx: Queryable,
  pacienteId: number,
  actorId: string | number,
  motivo: string,
): Promise<string[]> {
  const equipos = await tx.dispositivo.findMany({
    where: { paciente_id: pacienteId },
    select: { dispositivo_id: true, codigo: true },
  });
  if (!equipos.length) return [];
  await tx.dispositivo.updateMany({
    where: { dispositivo_id: { in: equipos.map((e) => e.dispositivo_id) } },
    data: { paciente_id: null },
  });
  for (const e of equipos) {
    await recordAudit(tx, {
      actorId,
      entidad: "dispositivo",
      registroId: e.dispositivo_id,
      accion: "UPDATE",
      observacion: `liberó el monitor ${e.codigo} (${motivo})`,
    });
  }
  return equipos.map((e) => e.codigo);
}
