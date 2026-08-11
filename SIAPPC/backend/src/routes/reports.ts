// Reportes: las corridas del ETL, que es lo que lista la pantalla de Reportes.
//
// No hay una tabla de "reportes" propia porque no hay nada más que reportar
// todavía: lo que la pantalla muestra es qué proceso corrió, sobre qué fuente,
// cómo terminó y cuándo. Eso es exactamente un renglón de `etl_ejecucion` (ver
// backend/etl/README.md). El día que haya reportes de Power BI o de FlexSim con
// vida propia, se suman a esta lista sin cambiar la forma de la respuesta.

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { parseOr400 } from "../lib/http.ts";
import type { Report, ReportStatus } from "../types.ts";

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Los estados del ETL en los tres que entiende la pantalla.
const estadoAEstado: Record<"ejecutando" | "completado" | "fallido", ReportStatus> = {
  ejecutando: "running",
  completado: "ready",
  fallido: "failed",
};

// Nombre legible del proceso. El identificador técnico (`lecturas_hora`) es la
// llave con la que trabaja el ETL; esto es lo que se lee en pantalla.
const nombreDeProceso: Record<string, string> = {
  lecturas_hora: "Lecturas agregadas por hora",
  alertas_dia: "Alertas por día y severidad",
};

export default async function reportsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/reports", async (req) => {
    const { limit } = parseOr400(querySchema, req.query);

    const rows = await prisma.etlEjecucion.findMany({
      orderBy: { inicio: "desc" },
      take: limit,
    });

    return rows.map(
      (row): Report => ({
        id: String(row.ejecucion_id),
        name: nombreDeProceso[row.proceso] ?? row.proceso,
        // La fuente es de dónde salieron los datos, que es lo que la columna
        // quiere decir: estos agregados los produce el ETL contra MariaDB.
        source: "MariaDB (ETL)",
        status: estadoAEstado[row.estado],
        // Una corrida en curso todavía no tiene `fin`; su marca de tiempo es
        // cuándo empezó, o la fila saldría sin fecha.
        updatedAt: (row.fin ?? row.inicio).toISOString(),
        rowsRead: row.filas_leidas,
        rowsWritten: row.filas_escritas,
        error: row.error,
      }),
    );
  });
}
