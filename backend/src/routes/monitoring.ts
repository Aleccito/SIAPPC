// Central de monitoreo: el estado de TODAS las camas de una unidad a la vez.
//
// ¿Por qué una ruta nueva y no /dashboard/assigned-patients?
//
// Porque la pregunta es otra. El tablero contesta "¿quién está a mi cargo?" y
// parte de `medico_paciente`, así que una cama vacía —o la de un paciente que
// no es mío— sencillamente no existe en su respuesta. La central contesta
// "¿cómo está la unidad?": parte de `cama`, incluye las libres (que es lo que
// se busca cuando llega un ingreso) y no filtra por quién pregunta. Forzar las
// dos preguntas en un endpoint habría obligado a inventar filas de paciente
// para camas sin nadie dentro.
//
// Lo que sí se copia del tablero es la MECÁNICA de las consultas: la peor
// alerta abierta por equipo en una consulta aparte, y el último valor de cada
// variable con una subconsulta correlacionada sobre `ix_lectura_sensor_fecha`.
// Ver el comentario largo en routes/dashboard.ts: un GROUP BY sobre `lectura`
// recorrería una tabla que crece una fila por sensor y por segundo.

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { alertSeverities } from "../types.ts";
import { civilDateIso } from "../lib/dates.ts";
import type {
  AlertSeverity,
  BedState,
  DeviceState,
  MonitoredBed,
  MonitoredVitals,
} from "../types.ts";

// Techo de camas por respuesta. Una unidad de cuidado crítico no tiene
// doscientas camas; el límite está para que un dato sucio no convierta la
// central en una descarga.
const BEDS_LIMIT = 200;

/**
 * Variables que la central pinta.
 *
 * Son EXACTAMENTE las que un publicador emite (`VARIABLES` en
 * iot/monitor/net/publisher.py, y `UNITS` en iot/src/main.py). `pr` y
 * `perfusion` también se publican pero no entran: la primera es la misma
 * frecuencia por otra vía y la segunda es calidad de señal, no un signo vital
 * — ninguna de las dos es una columna del mockup.
 *
 * `pa` y `temp` NO están y no es un olvido: nadie las publica. Ver el comentario
 * de `MonitoredVitals` en types.ts.
 */
const VITAL_VARIABLES = ["hr", "spo2", "resp"] as const;

/** Orden de gravedad, de menor a mayor: el índice compara severidades. */
const severityRank = new Map<AlertSeverity, number>(alertSeverities.map((s, i) => [s, i]));

function worseOf(a: AlertSeverity | null, b: AlertSeverity): AlertSeverity {
  if (!a) return b;
  return (severityRank.get(b) ?? 0) > (severityRank.get(a) ?? 0) ? b : a;
}

type AlertaAbiertaRow = { codigo: string; severidad: AlertSeverity; total: bigint | number };

type LecturaUltimaRow = {
  codigo: string;
  variable_medida: string;
  /** `lectura.valor` es DECIMAL: el driver lo entrega como Decimal, no number. */
  valor: Prisma.Decimal;
  fecha_hora: Date;
};

// El filtro es opcional a propósito: sin él la central enseña todas las camas
// del hospital, que es lo que ve un turno de noche con una sola unidad abierta.
// Se filtra por identificador y no por nombre porque "UCI" es un rótulo que un
// hospital puede repetir o renombrar, y el id no.
const querySchema = z.object({
  unitId: z.coerce.number().int().positive().optional(),
});

export default async function monitoringRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/monitoring/beds",
    { preHandler: [app.requirePermission("monitoreo", "ver")] },
    async (req): Promise<MonitoredBed[]> => {
      const { unitId } = querySchema.parse(req.query);

      const camas = await prisma.cama.findMany({
        where: {
          activo: true,
          // La cama no guarda `hospital_id`: lo alcanza por su unidad. Mismo
          // criterio que /beds, y por el mismo motivo.
          unidad: { hospital_id: req.hospitalId, activo: true },
          ...(unitId !== undefined ? { unidad_id: unitId } : {}),
        },
        include: {
          unidad: { select: { nombre: true } },
          // Solo el ingreso activo: una cama arrastra todos los que pasaron por
          // ella, y el que importa aquí es el que no ha egresado.
          ingresos: {
            where: { estado: "activo" },
            orderBy: { fecha_ingreso: "desc" },
            take: 1,
            select: {
              paciente: {
                select: {
                  paciente_id: true,
                  nombre: true,
                  fecha_nacimiento: true,
                  // Un paciente puede arrastrar equipos dados de baja; solo
                  // interesa el que está midiendo ahora.
                  dispositivos: {
                    where: { estado: "activo" },
                    orderBy: { dispositivo_id: "asc" },
                    take: 1,
                    select: { codigo: true, estado: true },
                  },
                  // Glasgow. La exploración física es 1:1 con el expediente, así
                  // que esto no multiplica renglones.
                  expediente: { select: { exploracion: { select: { glasgow: true } } } },
                },
              },
            },
          },
        },
        orderBy: [{ unidad_id: "asc" }, { codigo: "asc" }],
        take: BEDS_LIMIT,
      });

      const devices = camas
        .map((c) => c.ingresos[0]?.paciente.dispositivos[0]?.codigo)
        .filter((codigo): codigo is string => Boolean(codigo));

      // Alertas sin resolver por equipo. Va en una consulta aparte acotada a los
      // equipos de esta lista: unirla al include anterior multiplicaría los
      // renglones de camas por los de alertas.
      const porEquipo = new Map<string, { total: number; worst: AlertSeverity | null }>();
      if (devices.length > 0) {
        const rows = await prisma.$queryRaw<AlertaAbiertaRow[]>`
          SELECT d.codigo, a.severidad, COUNT(*) AS total
          FROM alerta a
          JOIN lectura l ON l.lectura_id = a.lectura_id
          JOIN sensor s ON s.sensor_id = l.sensor_id
          JOIN dispositivo d ON d.dispositivo_id = s.dispositivo_id
          WHERE a.estado <> 'resuelta'
            AND d.codigo IN (${Prisma.join(devices)})
          GROUP BY d.codigo, a.severidad
        `;
        for (const row of rows) {
          const acc = porEquipo.get(row.codigo) ?? { total: 0, worst: null };
          acc.total += Number(row.total);
          acc.worst = worseOf(acc.worst, row.severidad);
          porEquipo.set(row.codigo, acc);
        }
      }

      // Último valor de cada variable por equipo. El `lectura_id` sale de una
      // subconsulta correlacionada por sensor: `ix_lectura_sensor_fecha` la
      // resuelve leyendo un extremo del índice, un acceso por sensor y no un
      // escaneo de la tabla entera.
      //
      // El desempate por `lectura_id` importa: `fecha_hora` es DATETIME(3) y dos
      // lecturas del mismo milisegundo dejarían el LIMIT 1 a suertes.
      const porEquipoVitales = new Map<string, MonitoredVitals>();
      if (devices.length > 0) {
        const rows = await prisma.$queryRaw<LecturaUltimaRow[]>`
          SELECT d.codigo, s.variable_medida, l.valor, l.fecha_hora
          FROM dispositivo d
          JOIN sensor s ON s.dispositivo_id = d.dispositivo_id
          JOIN lectura l ON l.lectura_id = (
            SELECT l2.lectura_id
            FROM lectura l2
            WHERE l2.sensor_id = s.sensor_id
            ORDER BY l2.fecha_hora DESC, l2.lectura_id DESC
            LIMIT 1
          )
          WHERE d.codigo IN (${Prisma.join(devices)})
            AND s.variable_medida IN (${Prisma.join(VITAL_VARIABLES)})
        `;
        for (const row of rows) {
          const acc = porEquipoVitales.get(row.codigo) ?? {
            hr: null,
            spo2: null,
            resp: null,
            at: null,
          };
          const at = row.fecha_hora.toISOString();
          if (row.variable_medida === "hr") acc.hr = Number(row.valor);
          if (row.variable_medida === "spo2") acc.spo2 = Number(row.valor);
          if (row.variable_medida === "resp") acc.resp = Number(row.valor);
          // La marca de tiempo es la de la lectura más reciente de las tres: es
          // lo que responde "¿de cuándo son estas cifras?".
          if (!acc.at || at > acc.at) acc.at = at;
          porEquipoVitales.set(row.codigo, acc);
        }
      }

      return camas.map((cama): MonitoredBed => {
        const paciente = cama.ingresos[0]?.paciente ?? null;
        const dispositivo = paciente?.dispositivos[0] ?? null;
        const alertas = dispositivo ? porEquipo.get(dispositivo.codigo) : undefined;

        return {
          id: String(cama.cama_id),
          bed: cama.codigo,
          unitId: String(cama.unidad_id),
          unit: cama.unidad.nombre,
          bedState: cama.estado as BedState,
          patientId: paciente ? String(paciente.paciente_id) : null,
          patientName: paciente?.nombre ?? null,
          birthDate: paciente ? civilDateIso(paciente.fecha_nacimiento) : null,
          device: dispositivo?.codigo ?? null,
          deviceState: (dispositivo?.estado as DeviceState | undefined) ?? null,
          openAlerts: alertas?.total ?? 0,
          worstSeverity: alertas?.worst ?? null,
          glasgow: paciente?.expediente?.exploracion?.glasgow ?? null,
          // Sin equipo no hay telemetría, y la cama sale con los huecos a la
          // vista. Un cero aquí se leería como "midió cero", que es lo contrario
          // de lo que pasa.
          vitals: (dispositivo ? porEquipoVitales.get(dispositivo.codigo) : undefined) ?? {
            hr: null,
            spo2: null,
            resp: null,
            at: null,
          },
        };
      });
    },
  );
}
