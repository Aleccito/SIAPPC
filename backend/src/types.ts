import type { RowDataPacket } from "mysql2";

// Mirrors frontend/src/modules/auth/types.ts and patients/types.ts.
// The frontend owns these shapes; the backend must produce exactly them.

export type Role = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const serviceModules = ["KY-001", "KY-004", "KY-012", "KY-019"] as const;
export type ServiceModule = (typeof serviceModules)[number];

export type PatientStatus = "waiting" | "inService" | "discharged";

export type Patient = {
  id: string;
  name: string;
  document: string;
  module: ServiceModule;
  status: PatientStatus;
  arrivedAt: string;
  reason: string;
};

// Row shapes as they come back from mysql2 (snake_case, DB-native types).
// Extending RowDataPacket is what lets pool.query<T[]>() accept these.
export interface UsuarioRow extends RowDataPacket {
  usuario_id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol_nombre: Role;
  activo: number;
}

export interface PacienteRow extends RowDataPacket {
  paciente_id: number;
  nombre: string;
  cedula: string;
  modulo: ServiceModule | null;
  estado: PatientStatus;
  motivo_consulta: string | null;
  fecha_llegada: string;
}
