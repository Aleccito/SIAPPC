// Resúmenes que alimentan los tableros por rol del frontend
// (frontend/src/modules/dashboard).
//
// Solo hay endpoint nuevo donde el tablero pide un cruce que ninguna ruta
// existente entrega: las alertas, las lecturas, los reportes, los usuarios y la
// bitácora ya tienen la suya y el tablero las consume tal cual.
//
// Los dos que sí hacían falta:
//
//   GET /dashboard/assigned-patients  quién está a mi cargo, con su equipo y
//                                     cuántas alertas sin resolver lleva.
//   GET /dashboard/devices            conectividad de los equipos a pie de cama.
//
// Ninguno escribe nada, y los dos revalidan el permiso en el servidor contra
// `rol_permiso` — llegar al tablero no es autorización.

import type { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { cached, cacheKey } from "../lib/cache.ts";
import { env } from "../env.ts";
import { alertSeverities } from "../types.ts";
import { civilDateIso } from "../lib/dates.ts";
import type {
  AdmissionType,
  AlertSeverity,
  AssignedPatient,
  DeviceState,
  DeviceStatus,
  PatientStatus,
  PatientVitals,
} from "../types.ts";

// Techo de la lista de pacientes a cargo. Un médico no lleva cien camas; el
// límite está para que un dato sucio no convierta el tablero en una descarga.
const ASSIGNED_LIMIT = 100;
const DEVICES_LIMIT = 200;

/**
 * Variables que el tablero enseña junto al paciente. Es un subconjunto de las
 * que publica la Pi: el resto (`pr`, `resp`, `perfusion`, `ecg`) son de la
 * pantalla de cama, no de una lista de doce pacientes.
 */
const VITAL_VARIABLES = ["hr", "spo2"] as const;

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

type DispositivoEstadoRow = {
  codigo: string;
  modelo: string | null;
  estado: DeviceState;
  paciente: string | null;
  sensores: bigint | number;
  sensores_activos: bigint | number | null;
  ultima_lectura: Date | null;
};

export default async function dashboardRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  // Pacientes a cargo del usuario que pregunta.
  //
  // `medico_paciente` es la tabla de asignación y no es exclusiva del médico:
  // su llave es `usuario_id`, así que enfermería usa el mismo endpoint y ve su
  // propia lista. El identificador sale del token, nunca de la query — pedir
  // "los pacientes de otro" no es expresable.
  app.get(
    "/dashboard/assigned-patients",
    { preHandler: [app.requirePermission("pacientes", "ver")] },
    async (req) => {
      const usuarioId = Number(req.user.sub);

      const asignaciones = await prisma.medicoPaciente.findMany({
        where: { usuario_id: usuarioId, activo: true, paciente: { activo: true } },
        include: {
          paciente: {
            include: {
              // Un paciente puede arrastrar equipos dados de baja; solo
              // interesa el que está midiendo ahora.
              dispositivos: {
                where: { estado: "activo" },
                orderBy: { dispositivo_id: "asc" },
                take: 1,
              },
              // Número de expediente y Glasgow. La exploración física es 1:1
              // con el expediente, así que esto no multiplica renglones.
              expediente: { include: { exploracion: { select: { glasgow: true } } } },
              // Dónde está ingresado AHORA. Un paciente acumula ingresos a lo
              // largo del tiempo; el abierto es como mucho uno.
              ingresos: {
                where: { estado: "activo" },
                include: { cama: { include: { unidad: true } } },
                orderBy: { fecha_ingreso: "desc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { fecha_asignacion: "desc" },
        take: ASSIGNED_LIMIT,
      });

      const devices = asignaciones
        .map((a) => a.paciente.dispositivos[0]?.codigo)
        .filter((codigo): codigo is string => Boolean(codigo));

      // Alertas sin resolver por equipo. Va en una segunda consulta acotada a
      // los equipos de esta lista: agregarla al JOIN anterior multiplicaría los
      // renglones de pacientes por los de alertas.
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

      // Último valor de cada signo vital por equipo.
      //
      // El `lectura_id` de la última lectura sale de una subconsulta
      // correlacionada por sensor, igual que en /dashboard/devices y por el
      // mismo motivo: `ix_lectura_sensor_fecha` la resuelve leyendo un extremo
      // del índice, mientras que un GROUP BY sobre `lectura` recorrería una
      // tabla que crece una fila por sensor y por segundo.
      //
      // El desempate por `lectura_id` importa: `fecha_hora` es DATETIME(3) y
      // dos lecturas del mismo milisegundo dejarían el LIMIT 1 a suertes.
      const porEquipoVitales = new Map<string, PatientVitals>();
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
          const acc = porEquipoVitales.get(row.codigo) ?? { hr: null, spo2: null, at: null };
          const at = row.fecha_hora.toISOString();
          if (row.variable_medida === "hr") acc.hr = Number(row.valor);
          if (row.variable_medida === "spo2") acc.spo2 = Number(row.valor);
          // La marca de tiempo es la de la lectura más reciente de las dos: es
          // lo que responde "¿de cuándo son estas cifras?".
          if (!acc.at || at > acc.at) acc.at = at;
          porEquipoVitales.set(row.codigo, acc);
        }
      }

      return asignaciones.map((a): AssignedPatient => {
        const paciente = a.paciente;
        const dispositivo = paciente.dispositivos[0] ?? null;
        const alertas = dispositivo ? porEquipo.get(dispositivo.codigo) : undefined;
        const expediente = paciente.expediente;
        const ingreso = paciente.ingresos[0] ?? null;
        const cama = ingreso?.cama ?? null;

        return {
          id: String(paciente.paciente_id),
          name: paciente.nombre,
          document: paciente.cedula,
          status: paciente.estado as PatientStatus,
          arrivedAt: paciente.fecha_llegada.toISOString(),
          reason: paciente.motivo_consulta ?? "",
          assignedAt: a.fecha_asignacion.toISOString(),
          device: dispositivo?.codigo ?? null,
          deviceState: (dispositivo?.estado as DeviceState | undefined) ?? null,
          openAlerts: alertas?.total ?? 0,
          worstSeverity: alertas?.worst ?? null,
          record: expediente ? String(expediente.expediente_id) : null,
          unit: cama?.unidad.nombre ?? null,
          bed: cama?.codigo ?? null,
          admissionId: ingreso ? String(ingreso.ingreso_id) : null,
          birthDate: civilDateIso(paciente.fecha_nacimiento),
          // El tipo de ingreso es lo ÚNICO que la base sabe sobre por qué está
          // aquí: `ingreso.tipo` ∈ {urgencia, programado, traslado}. No hay
          // columna de "traslado a UCI" ni de destino, así que la pantalla
          // rotula el tipo y no inventa un movimiento que nadie registró.
          admissionType: (ingreso?.tipo as AdmissionType | undefined) ?? null,
          admittedAt: ingreso?.fecha_ingreso.toISOString() ?? null,
          glasgow: expediente?.exploracion?.glasgow ?? null,
          examined: expediente?.exploracion != null,
          vitals: (dispositivo ? porEquipoVitales.get(dispositivo.codigo) : undefined) ?? {
            hr: null,
            spo2: null,
            at: null,
          },
        };
      });
    },
  );

  // Conectividad de los equipos: cuántos sensores tiene cada uno, cuántos
  // siguen activos y cuándo llegó su última lectura.
  //
  // La última lectura sale de una subconsulta correlacionada por sensor y no de
  // un GROUP BY sobre `lectura`: esa tabla crece una fila por sensor y por
  // segundo, y agruparla entera la recorre completa. El `MAX(fecha_hora)` por
  // sensor lo resuelve el índice `ix_lectura_sensor_fecha` leyendo un extremo
  // del índice — un acceso por sensor, no un escaneo.
  //
  // El agregado del ETL (`lectura_hora`) no sirve aquí: la pregunta es si el
  // equipo está emitiendo *ahora*, y ese agregado va por horas cerradas.
  //
  // Igual que en /sensors, la clave de caché NO lleva al usuario porque la
  // respuesta todavía no filtra por hospital. Cuando lo haga, el identificador
  // del hospital tiene que entrar en la clave.
  app.get(
    "/dashboard/devices",
    { preHandler: [app.requirePermission("dispositivos", "ver")] },
    async (req) => {
      const key = cacheKey("dashboard-devices", { limit: DEVICES_LIMIT });

      return cached(key, env.sensorsCacheTtl, req.log, async () => {
        const rows = await prisma.$queryRaw<DispositivoEstadoRow[]>`
          SELECT d.codigo, d.modelo, d.estado, p.nombre AS paciente,
                 COUNT(s.sensor_id) AS sensores,
                 SUM(s.estado = 'activo') AS sensores_activos,
                 MAX((SELECT MAX(l.fecha_hora) FROM lectura l WHERE l.sensor_id = s.sensor_id))
                   AS ultima_lectura
          FROM dispositivo d
          LEFT JOIN paciente p ON p.paciente_id = d.paciente_id
          LEFT JOIN sensor s ON s.dispositivo_id = d.dispositivo_id
          GROUP BY d.dispositivo_id, d.codigo, d.modelo, d.estado, p.nombre
          ORDER BY d.codigo ASC
          LIMIT ${DEVICES_LIMIT}
        `;

        return rows.map(
          (row): DeviceStatus => ({
            code: row.codigo,
            model: row.modelo,
            state: row.estado,
            patient: row.paciente,
            // COUNT y SUM vuelven como BigInt del driver: JSON.stringify no
            // sabe serializarlos y la respuesta saldría 500.
            sensors: Number(row.sensores),
            activeSensors: Number(row.sensores_activos ?? 0),
            lastReadingAt: row.ultima_lectura ? new Date(row.ultima_lectura).toISOString() : null,
          }),
        );
      });
    },
  );
}
