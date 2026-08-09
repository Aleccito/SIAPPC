import type { RowDataPacket } from "mysql2";

// Mirrors frontend/src/modules/auth/types.ts and patients/types.ts.
// The frontend owns these shapes; the backend must produce exactly them.

// Los roles viven en la tabla `rol`, no en el código: un administrador puede
// crear roles personalizados. Por eso es string y no una unión cerrada.
export type Role = string;

// Las cuatro acciones son las cuatro columnas de la matriz de permisos.
export const permissionActions = ["ver", "crear", "editar", "eliminar"] as const;
export type PermissionAction = (typeof permissionActions)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  unit: string | null;
  phone: string | null;
  active: boolean;
  lastActivity: string | null;
};

export type Unit = {
  id: string;
  name: string;
};

export type RoleSummary = {
  id: string;
  name: string;
  label: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
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
  rol_etiqueta: string;
  unidad_nombre: string | null;
  telefono: string | null;
  ultimo_acceso: Date | null;
  activo: number;
}

export interface RolRow extends RowDataPacket {
  rol_id: number;
  nombre: string;
  etiqueta: string;
  descripcion: string | null;
  es_sistema: number;
  usuarios: number;
}

export interface UnidadRow extends RowDataPacket {
  unidad_id: number;
  nombre: string;
}

export interface PermisoRow extends RowDataPacket {
  modulo: string;
  nombre: string;
}

export interface RolPermisoRow extends RowDataPacket {
  modulo: string;
  etiqueta: string;
  puede_ver: number;
  puede_crear: number;
  puede_editar: number;
  puede_eliminar: number;
}

export type RolePermission = {
  module: string;
  label: string;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
};

export type RoleChange = {
  id: string;
  author: string | null;
  description: string;
  at: string;
};

export interface AuditoriaRow extends RowDataPacket {
  auditoria_id: number;
  entidad: string;
  registro_id: number;
  accion: string;
  fecha_hora: Date;
  observacion: string | null;
}

export type AuditEntry = {
  id: string;
  author: string | null;
  entity: string;
  recordId: string;
  action: string;
  note: string | null;
  at: string;
};

export type ActivityEntry = {
  id: string;
  entity: string;
  action: string;
  at: string;
  note: string | null;
};

export interface PacienteRow extends RowDataPacket {
  paciente_id: number;
  nombre: string;
  cedula: string;
  modulo: ServiceModule | null;
  estado: PatientStatus;
  motivo_consulta: string | null;
  fecha_llegada: string;
}

export interface DispositivoRow extends RowDataPacket {
  dispositivo_id: number;
}

export interface SensorRow extends RowDataPacket {
  sensor_id: number;
}

// valor llega como string: mysql2 no convierte DECIMAL a number por defecto.
export interface LecturaRow extends RowDataPacket {
  lectura_id: number;
  valor: string;
  fecha_hora: Date;
  variable_medida: string;
  unidad: string;
  codigo: string;
}

export type SensorReading = {
  id: string;
  device: string;
  variable: string;
  unit: string;
  value: number;
  at: string;
};

// Espejo exacto de los ENUM de la tabla `alerta`: se usan tal cual como valores
// de la API para no mantener una traducción de códigos entre capas.
export const alertSeverities = ["baja", "media", "alta", "critica"] as const;
export type AlertSeverity = (typeof alertSeverities)[number];

export const alertStatuses = ["abierta", "reconocida", "resuelta"] as const;
export type AlertStatus = (typeof alertStatuses)[number];

export interface AlertaRow extends RowDataPacket {
  alerta_id: number;
  lectura_id: number;
  tipo: string;
  severidad: AlertSeverity;
  mensaje: string | null;
  estado: AlertStatus;
  fecha_hora: Date;
  fecha_resolucion: Date | null;
  // Contexto de la lectura que disparó la alerta (JOIN lectura/sensor/dispositivo).
  valor: string;
  variable_medida: string;
  unidad: string;
  codigo: string;
}

export type SensorAlert = {
  id: string;
  readingId: string;
  device: string;
  variable: string;
  unit: string;
  value: number;
  type: string;
  severity: AlertSeverity;
  message: string | null;
  status: AlertStatus;
  at: string;
  resolvedAt: string | null;
};
