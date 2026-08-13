import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { parseOr400 } from "../lib/http.ts";

// Informes descargables como hoja de cálculo.
//
// La consulta vive en un procedimiento almacenado (`sp_rep_*`, ver
// backend/db/extra.sql) y no aquí: un informe es una agregación pesada sobre
// varias tablas, y hacerla junto al dato evita traer a Node filas que solo
// existen para reducirse. La ruta se limita a llamar y a dar formato.
//
// CSV y no XLSX a propósito: un XLSX de verdad exige una biblioteca y solo
// compensa con varias hojas o formato. Un CSV bien hecho lo abre Excel de dos
// clics y lo lee cualquier otra herramienta.

/**
 * Tres decisiones de formato, y las tres son para que Excel abra el archivo
 * bien a la primera en un equipo en español:
 *
 *   BOM         sin él, Excel en Windows interpreta el archivo como ANSI y
 *               "Médico" aparece como "MÃ©dico".
 *   `;`         Excel en configuración regional española espera punto y coma;
 *               con coma mete la fila entera en una sola columna.
 *   coma decimal  por lo mismo: 70.5 con punto se lee como texto, no número.
 */
const BOM = "﻿";
const SEPARADOR = ";";

/** Comilla el campo solo si lo necesita, que es lo que hace un CSV legible. */
function campo(valor: unknown): string {
  if (valor === null || valor === undefined) return "";

  if (typeof valor === "number") {
    return String(valor).replace(".", ",");
  }

  // Los DECIMAL del driver llegan como objeto; su `toString` da el número.
  const texto = String(valor);
  const necesitaComillas = texto.includes(SEPARADOR) || texto.includes('"') || /[\r\n]/.test(texto);
  return necesitaComillas ? `"${texto.replaceAll('"', '""')}"` : texto;
}

function aCsv(filas: Record<string, unknown>[]): string {
  if (filas.length === 0) return BOM;
  const columnas = Object.keys(filas[0]!);
  const cabecera = columnas.join(SEPARADOR);
  const cuerpo = filas.map((fila) => columnas.map((c) => campo(fila[c])).join(SEPARADOR));
  // CRLF: es lo que espera Excel, y no molesta a nadie más.
  return BOM + [cabecera, ...cuerpo].join("\r\n") + "\r\n";
}

const rangoSchema = z
  .object({
    desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((r) => r.desde <= r.hasta, { message: "`desde` no puede ser posterior a `hasta`" });

export default async function reportesCsvRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get(
    "/reports/actividad-clinica.csv",
    { preHandler: [app.requirePermission("reportes", "ver")] },
    async (req, reply) => {
      const { desde, hasta } = parseOr400(rangoSchema, req.query);

      // Se consulta la VISTA y no el procedimiento del mismo nombre: el
      // adaptador de MariaDB de Prisma devuelve las filas de un `CALL` sin
      // nombres de columna, así que `sp_rep_actividad_clinica` sirve desde el
      // cliente de la base o desde Power BI, pero no desde aquí.
      //
      // El LEFT JOIN contra `usuario` es lo que mantiene en el informe a los
      // médicos que NO escribieron nada en el periodo: un informe de actividad
      // que solo lista a quien trabajó no deja ver quién no lo hizo.
      //
      // El corte superior es `< hasta + 1 día` y no `<= hasta`: si no, se
      // pierde todo lo escrito ese último día después de medianoche.
      //
      // El hospital sale de la sesión, nunca de la petición: un informe es la
      // vía más cómoda para sacar datos de otra institución de una sola vez.
      const filas = await prisma.$queryRaw<Record<string, unknown>[]>(Prisma.sql`
        SELECT
          u.nombre AS medico,
          r.etiqueta AS rol,
          COALESCE(un.nombre, '') AS unidad,
          COUNT(v.nota_id) AS notas_total,
          COUNT(CASE WHEN v.estado = 'firmada' THEN 1 END) AS notas_firmadas,
          COUNT(CASE WHEN v.estado = 'borrador' THEN 1 END) AS notas_borrador,
          COUNT(CASE WHEN v.es_adenda THEN 1 END) AS adendas,
          COUNT(DISTINCT v.paciente_id) AS pacientes_distintos,
          ROUND(AVG(v.minutos_hasta_firma), 1) AS minutos_hasta_firma
        FROM usuario u
        JOIN rol r ON r.rol_id = u.rol_id
        LEFT JOIN unidad un ON un.unidad_id = u.unidad_id
        LEFT JOIN v_rep_actividad_clinica v
          ON v.usuario_id = u.usuario_id
         AND v.fecha_hora >= ${desde}
         AND v.fecha_hora < DATE_ADD(${hasta}, INTERVAL 1 DAY)
        WHERE u.hospital_id = ${req.hospitalId}
        GROUP BY u.usuario_id, u.nombre, r.etiqueta, r.nombre, un.nombre
        HAVING notas_total > 0 OR MAX(r.nombre) = 'medico'
        ORDER BY notas_total DESC, medico ASC
      `);

      const nombre = `actividad-clinica_${desde}_a_${hasta}.csv`;
      return reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header("Content-Disposition", `attachment; filename="${nombre}"`)
        .send(aCsv(filas));
    },
  );
}
