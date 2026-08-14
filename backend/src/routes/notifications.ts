import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { notFound, parseOr400 } from "../lib/http.ts";
import type { Notification, NotificacionRow, NotificationPage } from "../types.ts";

// La bandeja del usuario de la sesión.
//
// TODO lo que sale de aquí está recortado por `usuario_id = req.user.sub`. No
// hay —ni debe haber— un parámetro para pedir las de otra persona: si el
// identificador viniera de la query, "las notificaciones del jefe de servicio"
// sería una URL que cualquiera puede escribir. El token es la única fuente.
//
// Por eso tampoco pasa por la caché de Redis (lib/cache.ts): la clave de esas
// respuestas no lleva usuario, y una bandeja cacheada se la serviría al
// siguiente que preguntara.

const querySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const idSchema = z.object({
  // BIGINT: se valida como entero positivo y se convierte a BigInt para la
  // consulta. Un id que no cabe en un Number seguro nunca existirá aquí antes
  // que la tabla se llene de otras cosas, pero el `coerce` a número igual se
  // hace sobre un valor acotado.
  id: z.coerce.number().int().positive(),
});

function toNotification(row: NotificacionRow): Notification {
  return {
    id: String(row.notificacion_id),
    // La única distinción que la bandeja hace de un vistazo. Ver
    // `notificationKinds` en types.ts: solo se notifican `alta` y `critica`.
    kind: row.severidad === "critica" ? "alertaCritica" : "alertaTemprana",
    alertId: String(row.alerta_id),
    patientId: row.paciente_id === null ? null : String(row.paciente_id),
    patientName: row.paciente_nombre,
    device: row.codigo,
    variable: row.variable_medida,
    unit: row.unidad,
    value: Number(row.valor),
    type: row.tipo,
    severity: row.severidad,
    message: row.mensaje,
    at: new Date(row.fecha_envio).toISOString(),
    read: row.estado_envio === "leido",
  };
}

export default async function notificationsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  // `alertas:ver` en las tres rutas, incluidas las que escriben.
  //
  // Marcar como leída NO es `alertas:editar`: esa acción es reconocer o
  // resolver la alerta, un acto clínico que el médico no tiene por defecto en
  // seed.sql y el enfermero sí. Leer un aviso propio no cambia nada del hecho
  // clínico —solo deja de contarse en la campana de quien lo leyó—, y exigir
  // `editar` dejaría al médico sin poder vaciar su propia bandeja.
  const puedeVer = { preHandler: [app.requirePermission("alertas", "ver")] };

  app.get("/notifications", puedeVer, async (req): Promise<NotificationPage> => {
    const { page, pageSize } = parseOr400(querySchema, req.query);
    const usuarioId = Number(req.user.sub);

    // Consulta cruda: son cinco JOIN para reconstruir el contexto de la alerta
    // (lectura → sensor → variable → dispositivo → paciente) y un orden que
    // depende de una expresión, no de una columna. Con el constructor de
    // consultas el `ORDER BY` de abajo no se puede expresar.
    const [totales, filas] = await Promise.all([
      prisma.$queryRaw<{ total: bigint; sin_leer: bigint }[]>`
        SELECT COUNT(*) AS total,
               SUM(n.estado_envio <> 'leido') AS sin_leer
        FROM notificacion n
        WHERE n.usuario_id = ${usuarioId}
      `,
      prisma.$queryRaw<NotificacionRow[]>`
        SELECT n.notificacion_id, n.alerta_id, n.estado_envio, n.fecha_envio,
               a.tipo, a.severidad, a.mensaje,
               l.valor, s.variable_medida, v.unidad, d.codigo,
               p.paciente_id, p.nombre AS paciente_nombre
        FROM notificacion n
        JOIN alerta a ON a.alerta_id = n.alerta_id
        JOIN lectura l ON l.lectura_id = a.lectura_id
        JOIN sensor s ON s.sensor_id = l.sensor_id
        JOIN variable v ON v.codigo = s.variable_medida
        JOIN dispositivo d ON d.dispositivo_id = s.dispositivo_id
        LEFT JOIN paciente p ON p.paciente_id = d.paciente_id
        WHERE n.usuario_id = ${usuarioId}
        ORDER BY (n.estado_envio = 'leido') ASC, n.fecha_envio DESC, n.notificacion_id DESC
        LIMIT ${pageSize} OFFSET ${page * pageSize}
      `,
    ]);

    // El paciente se lee del dispositivo, que es donde vive el vínculo, así que
    // sale el paciente que TIENE el equipo ahora y no el que lo tenía cuando
    // saltó la alerta. Es un desfase real y aceptado: la alternativa sería
    // congelar el paciente en la notificación, y eso es una columna nueva para
    // un caso —reasignar la cama con avisos sin leer encima— que ocurre poco y
    // en el que además interesa saber a quién hay que ir a ver ahora.

    return {
      total: Number(totales[0]?.total ?? 0),
      // SUM() sobre cero filas devuelve NULL, no 0.
      unread: Number(totales[0]?.sin_leer ?? 0),
      entries: filas.map(toNotification),
    };
  });

  app.post("/notifications/:id/read", puedeVer, async (req, reply) => {
    const { id } = parseOr400(idSchema, req.params);

    // `updateMany` con el usuario en el WHERE y no `update` por llave primaria:
    // así la propiedad se revalida DENTRO de la misma sentencia. Leer primero y
    // comprobar después deja una carrera y, sobre todo, deja el filtro en un
    // `if` que alguien puede quitar sin darse cuenta.
    const { count } = await prisma.notificacion.updateMany({
      where: { notificacion_id: BigInt(id), usuario_id: Number(req.user.sub) },
      data: { estado_envio: "leido" },
    });

    // 404 y no 403 cuando no es suya: distinguirlos confirmaría que la
    // notificación existe y es de otro. Marcar dos veces la misma sí devuelve
    // 204 —`count` es 1 aunque el valor no cambie en MariaDB con updateMany
    // sobre una fila que coincide—, que es lo correcto para una operación
    // idempotente.
    if (count === 0) throw notFound("Notificación no encontrada");

    return reply.code(204).send();
  });

  app.post("/notifications/read-all", puedeVer, async (req) => {
    const { count } = await prisma.notificacion.updateMany({
      where: { usuario_id: Number(req.user.sub), NOT: { estado_envio: "leido" } },
      data: { estado_envio: "leido" },
    });
    // Devuelve cuántas cambiaron en vez de 204 para que la pantalla pueda decir
    // algo cierto: "no había nada que marcar" y "se marcaron 12" no son lo mismo.
    return { updated: count };
  });
}
