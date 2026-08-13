// Búsqueda global: un solo cuadro de texto que atraviesa pacientes, notas SOAP
// y documentos clínicos.
//
// Va por consulta cruda —tres, una por fuente— y no por el constructor de
// consultas por dos motivos. El primero es que cada resultado necesita datos que
// no están en su propia tabla: el paciente arrastra su cama, su diagnóstico
// activo y si tiene alertas abiertas, y eso son subconsultas correlacionadas que
// el constructor no sabe expresar sin traerse las filas y unirlas en memoria. El
// segundo es que las tres consultas son de LIKE con comodín por delante, que no
// usa índice: el `LIMIT` es lo único que las mantiene baratas y conviene tenerlo
// a la vista.
//
// El recorte por hospital es obligatorio en las tres, igual que en /patients: un
// buscador que devolviera pacientes de otro hospital sería la peor forma posible
// de filtrarlos, porque basta escribir un apellido común para listarlos.
//
// Las notas y los documentos además se piden por permiso (`notas_soap` e
// `historia_clinica`, acción `ver`). No se puede usar `requirePermission` como
// preHandler: aquí la falta de permiso no es un 403 de la petición entera, sino
// una fuente que simplemente no aporta resultados —quien no ve notas sigue
// pudiendo buscar pacientes—.

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { parseOr400 } from "../lib/http.ts";
import type {
  SearchDocumentResult,
  SearchNoteResult,
  SearchPatientResult,
  SearchResponse,
} from "../types.ts";

const querySchema = z.object({
  q: z.string().trim().min(2).max(100),
  // Por fuente, no en total: si el término empata con cien pacientes, el
  // documento que también empataba tiene que seguir apareciendo.
  limit: z.coerce.number().int().positive().max(50).default(20),
});

/**
 * El término va parametrizado, pero `%` y `_` dentro de él seguirían siendo
 * comodines para LIKE: buscar "100%" tiene que buscar ese texto y no "empieza
 * por 100". La barra invertida se escapa primero o escaparía a las siguientes.
 */
function toLikePattern(term: string): string {
  return `%${term.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

/** Longitud del extracto de la nota: una línea de tarjeta, no la nota entera. */
const EXCERPT_LENGTH = 160;

function toExcerpt(text: string | null): string {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  return flat.length > EXCERPT_LENGTH ? `${flat.slice(0, EXCERPT_LENGTH)}…` : flat;
}

/**
 * Misma consulta que `requirePermission`, pero devolviendo el booleano en vez
 * de cortar la petición: aquí el permiso decide si la fuente se consulta.
 */
async function puedeVer(usuarioId: number, modulo: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ permitido: number | boolean }[]>`
    SELECT rp.puede_ver AS permitido
    FROM usuario u
    JOIN rol_permiso rp ON rp.rol_id = u.rol_id
    JOIN permiso p ON p.permiso_id = rp.permiso_id
    WHERE u.usuario_id = ${usuarioId}
      AND u.activo = TRUE
      AND p.modulo = ${modulo}
  `;
  return Boolean(rows[0]?.permitido);
}

type PacienteHitRow = {
  paciente_id: number;
  nombre: string;
  cedula: string;
  cama: string | null;
  unidad: string | null;
  dispositivo: string | null;
  diagnostico: string | null;
  critico: number | bigint | boolean;
};

type NotaHitRow = {
  nota_id: bigint;
  paciente_id: number;
  paciente: string;
  fecha_hora: Date;
  texto: string | null;
};

type DocumentoHitRow = {
  documento_id: number;
  paciente_id: number;
  paciente: string;
  titulo: string;
  tipo: string;
  fecha: Date;
  unidad: string | null;
};

async function buscarPacientes(
  hospitalId: number,
  patron: string,
  limit: number,
): Promise<SearchPatientResult[]> {
  // El diagnóstico y el equipo van como subconsulta y no como JOIN a propósito:
  // un paciente puede tener varios de cada uno y un JOIN lo devolvería repetido,
  // que en una lista de resultados se lee como dos pacientes distintos.
  const rows = await prisma.$queryRaw<PacienteHitRow[]>`
    SELECT p.paciente_id, p.nombre, p.cedula,
           c.codigo AS cama,
           un.nombre AS unidad,
           (SELECT d.codigo FROM dispositivo d
             WHERE d.paciente_id = p.paciente_id
             ORDER BY d.dispositivo_id DESC LIMIT 1) AS dispositivo,
           (SELECT dc.descripcion
              FROM diagnostico_clinico dc
              JOIN expediente_clinico ec ON ec.expediente_id = dc.expediente_id
             WHERE ec.paciente_id = p.paciente_id AND dc.estado = 'activo'
             ORDER BY dc.fecha_registro DESC LIMIT 1) AS diagnostico,
           EXISTS (
             SELECT 1
               FROM alerta a
               JOIN lectura l ON l.lectura_id = a.lectura_id
               JOIN sensor s ON s.sensor_id = l.sensor_id
               JOIN dispositivo d2 ON d2.dispositivo_id = s.dispositivo_id
              WHERE d2.paciente_id = p.paciente_id
                AND a.estado <> 'resuelta'
                AND a.severidad IN ('alta', 'critica')
           ) AS critico
    FROM paciente p
    LEFT JOIN ingreso i ON i.paciente_id = p.paciente_id AND i.estado = 'activo'
    LEFT JOIN cama c ON c.cama_id = i.cama_id
    LEFT JOIN unidad un ON un.unidad_id = c.unidad_id
    WHERE p.activo = TRUE
      AND p.hospital_id = ${hospitalId}
      AND (p.nombre LIKE ${patron} OR p.cedula LIKE ${patron})
    ORDER BY p.nombre
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    kind: "patient" as const,
    id: String(row.paciente_id),
    name: row.nombre,
    document: row.cedula,
    // "Crítico" en la tarjeta es una lectura del monitoreo, no un campo de la
    // ficha: es tener alertas sin resolver de severidad alta o crítica.
    critical: Boolean(Number(row.critico)),
    bed: row.cama,
    unit: row.unidad,
    device: row.dispositivo,
    diagnosis: row.diagnostico,
  }));
}

async function buscarNotas(
  hospitalId: number,
  patron: string,
  limit: number,
): Promise<SearchNoteResult[]> {
  const rows = await prisma.$queryRaw<NotaHitRow[]>`
    SELECT n.nota_id, n.paciente_id, p.nombre AS paciente, n.fecha_hora,
           CONCAT_WS(' ', n.subjetivo, n.objetivo, n.analisis, n.plan) AS texto
    FROM nota_soap n
    JOIN paciente p ON p.paciente_id = n.paciente_id
    WHERE p.hospital_id = ${hospitalId}
      AND (n.subjetivo LIKE ${patron}
        OR n.objetivo LIKE ${patron}
        OR n.analisis LIKE ${patron}
        OR n.plan LIKE ${patron})
    ORDER BY n.fecha_hora DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    kind: "soapNote" as const,
    id: String(row.nota_id),
    patientId: String(row.paciente_id),
    patientName: row.paciente,
    at: new Date(row.fecha_hora).toISOString(),
    excerpt: toExcerpt(row.texto),
  }));
}

async function buscarDocumentos(
  hospitalId: number,
  patron: string,
  limit: number,
): Promise<SearchDocumentResult[]> {
  // `fecha_documento` es la fecha del estudio y `fecha_registro` la de cuando se
  // subió la ficha. La tarjeta muestra la primera si existe, que es la que le
  // importa a quien lo busca.
  const rows = await prisma.$queryRaw<DocumentoHitRow[]>`
    SELECT dc.documento_id, ec.paciente_id, p.nombre AS paciente,
           dc.titulo, dc.tipo,
           COALESCE(dc.fecha_documento, dc.fecha_registro) AS fecha,
           un.nombre AS unidad
    FROM documento_clinico dc
    JOIN expediente_clinico ec ON ec.expediente_id = dc.expediente_id
    JOIN paciente p ON p.paciente_id = ec.paciente_id
    LEFT JOIN ingreso i ON i.paciente_id = p.paciente_id AND i.estado = 'activo'
    LEFT JOIN cama c ON c.cama_id = i.cama_id
    LEFT JOIN unidad un ON un.unidad_id = c.unidad_id
    WHERE p.hospital_id = ${hospitalId}
      AND dc.titulo LIKE ${patron}
    ORDER BY fecha DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    kind: "document" as const,
    id: String(row.documento_id),
    patientId: String(row.paciente_id),
    patientName: row.paciente,
    title: row.titulo,
    type: row.tipo,
    at: new Date(row.fecha).toISOString(),
    unit: row.unidad,
  }));
}

export default async function searchRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/search", async (req): Promise<SearchResponse> => {
    const { q, limit } = parseOr400(querySchema, req.query);
    const patron = toLikePattern(q);
    const usuarioId = Number(req.user.sub);

    const [verNotas, verDocumentos] = await Promise.all([
      puedeVer(usuarioId, "notas_soap"),
      puedeVer(usuarioId, "historia_clinica"),
    ]);

    const [patients, notes, documents] = await Promise.all([
      buscarPacientes(req.hospitalId, patron, limit),
      verNotas ? buscarNotas(req.hospitalId, patron, limit) : Promise.resolve([]),
      verDocumentos ? buscarDocumentos(req.hospitalId, patron, limit) : Promise.resolve([]),
    ]);

    return {
      query: q,
      patients,
      notes,
      documents,
      total: patients.length + notes.length + documents.length,
    };
  });
}
