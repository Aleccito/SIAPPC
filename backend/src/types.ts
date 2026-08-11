import type { Prisma } from "./generated/prisma/client.ts";

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

// Mirrors frontend/src/modules/reports/types.ts. Los tres estados son los que
// pinta la pantalla; el ETL tiene los suyos y routes/reports.ts los traduce.
export type ReportStatus = "ready" | "running" | "failed";

export type Report = {
  id: string;
  name: string;
  source: string;
  status: ReportStatus;
  updatedAt: string;
  // Campos propios del ETL: la pantalla los usa para explicar una corrida sin
  // mandar a nadie a los logs del contenedor.
  rowsRead: number;
  rowsWritten: number;
  error: string | null;
};

// Formas de los renglones que devuelven las consultas crudas ($queryRaw).
// Son snake_case y con tipos de la base a propósito: es lo que sale del SQL a
// mano. Lo que produce el ORM ya viene tipado por el cliente generado.
export type UsuarioRow = {
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

export type RolRow = {
  rol_id: number;
  nombre: string;
  etiqueta: string;
  descripcion: string | null;
  es_sistema: number;
  usuarios: number;
}

export type UnidadRow = {
  unidad_id: number;
  nombre: string;
}

export type PermisoRow = {
  modulo: string;
  nombre: string;
}

export type RolPermisoRow = {
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

export type AuditoriaRow = {
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

export type PacienteRow = {
  paciente_id: number;
  nombre: string;
  cedula: string;
  modulo: ServiceModule | null;
  estado: PatientStatus;
  motivo_consulta: string | null;
  fecha_llegada: string;
}

export type DispositivoRow = {
  dispositivo_id: number;
}

export type SensorRow = {
  sensor_id: number;
}

// `valor` es DECIMAL(12,4): no cabe en un double sin perder exactitud, así que
// el driver lo entrega como Decimal de Prisma o como texto según el camino.
// Quien lo consuma lo convierte explícitamente (ver toReading en routes/sensors).
export type LecturaRow = {
  lectura_id: number;
  valor: Prisma.Decimal | string;
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

export type AlertaRow = {
  alerta_id: number;
  lectura_id: number;
  tipo: string;
  severidad: AlertSeverity;
  mensaje: string | null;
  estado: AlertStatus;
  fecha_hora: Date;
  fecha_resolucion: Date | null;
  // Contexto de la lectura que disparó la alerta (JOIN lectura/sensor/dispositivo).
  valor: Prisma.Decimal | string;
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
