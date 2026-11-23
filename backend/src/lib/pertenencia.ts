// Comprobaciones de que un registro pertenece al hospital de la sesión.
//
// Todo lo clínico cuelga de un paciente, y el paciente es lo que lleva
// `hospital_id`. Sin esta comprobación basta cambiar el id en la URL para leer
// o escribir el expediente de un paciente de otro hospital.
//
// Responde 404 y no 403 a propósito: un 403 confirmaría que el id existe en
// otro hospital.

import { prisma } from "./prisma.ts";
import { notFound } from "./http.ts";

/** Lanza 404 si el paciente no existe o es de otro hospital. */
export async function assertPacienteDelHospital(pacienteId: number, hospitalId: number): Promise<void> {
  const n = await prisma.paciente.count({ where: { paciente_id: pacienteId, hospital_id: hospitalId } });
  if (!n) throw notFound(`No existe el paciente ${pacienteId}`);
}
