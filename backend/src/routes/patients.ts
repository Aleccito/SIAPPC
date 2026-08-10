import type { FastifyInstance } from "fastify";
import type { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../../db/db.ts";
import { recordAudit } from "../lib/audit.ts";
import { serviceModules } from "../types.ts";
import type { PacienteRow, Patient } from "../types.ts";

function toPatient(row: PacienteRow): Patient {
  return {
    id: String(row.paciente_id),
    name: row.nombre,
    document: row.cedula,
    module: (row.modulo ?? serviceModules[0]) as Patient["module"],
    status: row.estado,
    arrivedAt: new Date(row.fecha_llegada).toISOString(),
    reason: row.motivo_consulta ?? "",
  };
}

const newPatientSchema = z.object({
  name: z.string().min(1),
  document: z.string().min(1),
  module: z.enum(serviceModules),
  reason: z.string().min(1),
  hospitalId: z.number().int().positive(),
  fechaNacimiento: z.string(), // ISO date, e.g. "1990-05-14"
  sexo: z.enum(["M", "F", "O"]),
});

const SELECT_PATIENT = `
  SELECT paciente_id, nombre, cedula, modulo, estado, motivo_consulta, fecha_llegada
  FROM paciente
`;

export default async function patientsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/patients", async () => {
    const [rows] = await pool.query<PacienteRow[]>(
      `${SELECT_PATIENT} WHERE activo = TRUE ORDER BY fecha_llegada DESC`,
    );
    return rows.map(toPatient);
  });

  app.post("/patients", async (req, reply) => {
    const parsed = newPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues });
    }
    const { name, document, module, reason, hospitalId, fechaNacimiento, sexo } = parsed.data;

    // Registro y bitácora en la misma transacción: el ingreso de un paciente
    // tiene que decir quién lo admitió y a qué hora, y esa constancia no puede
    // depender de que una segunda consulta salga bien.
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO paciente
           (hospital_id, nombre, cedula, fecha_nacimiento, sexo, modulo, estado, motivo_consulta)
         VALUES (?, ?, ?, ?, ?, ?, 'waiting', ?)`,
        [hospitalId, name, document, fechaNacimiento, sexo, module, reason],
      );

      await recordAudit(connection, {
        actorId: req.user.sub,
        entidad: "paciente",
        registroId: result.insertId,
        accion: "INSERT",
        // Sin el motivo de consulta: es dato clínico y vive en `paciente`, con
        // los permisos de esa tabla. La bitácora dice quién y cuándo, no el
        // cuadro del paciente.
        observacion: `registró la llegada de ${name} (${document}) al módulo ${module}`,
      });

      await connection.commit();

      const [rows] = await connection.query<PacienteRow[]>(
        `${SELECT_PATIENT} WHERE paciente_id = ?`,
        [result.insertId],
      );
      return reply.code(201).send(toPatient(rows[0]!));
    } catch (err) {
      await connection.rollback();
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
        return reply.code(409).send({ error: "Esa cédula ya está registrada" });
      }
      throw err;
    } finally {
      connection.release();
    }
  });
}
