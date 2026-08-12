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

// --- Expediente clínico: Notas SOAP e Historia Clínica General ---------------
//
// Las claves van en inglés camelCase como el resto de la API (Patient, User,
// AuditEntry); los VALORES de los enumerados van tal cual están en la base, en
// español, igual que se hizo con las severidades de alerta: traducir códigos
// entre capas solo agrega un sitio donde equivocarse.

export const soapStatuses = ["borrador", "firmada"] as const;
export type SoapStatus = (typeof soapStatuses)[number];

export type SoapNote = {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  /// No nulo = la nota es un addendum de esa otra.
  parentId: string | null;
  at: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  status: SoapStatus;
  signedById: string | null;
  signedByName: string | null;
  signedAt: string | null;
};

/** Las categorías del expediente, tal como las nombra la URL. */
export const historiaCategorias = [
  "antecedentes",
  "alergias",
  "medicamentos",
  "diagnosticos",
  "hospitalizaciones",
  "procedimientos",
  "documentos",
] as const;
export type HistoriaCategoria = (typeof historiaCategorias)[number];

export type HistoriaEntry = {
  id: string;
  category: HistoriaCategoria;
  recordedAt: string;
  recordedById: string | null;
  // El resto de las columnas de cada categoría. Se declara abierto porque las
  // siete tienen campos distintos y la pantalla las pinta por categoría.
  [campo: string]: unknown;
};

/** Una nota de evolución: la tabla `historia_clinica` de siempre. */
export type EvolucionEntry = {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  at: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
};

/** Un renglón del historial de cambios del expediente. */
export type HistoriaChange = {
  id: string;
  category: string;
  recordId: string;
  action: "alta" | "modificacion" | "baja";
  authorId: string | null;
  authorName: string | null;
  at: string;
  detail: string | null;
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

// ---------------------------------------------------------------------------
// Tableros por rol (routes/dashboard.ts). Espejo de
// frontend/src/modules/dashboard/types.ts.
// ---------------------------------------------------------------------------

/** Estado del equipo tal como lo guarda `dispositivo.estado`. */
export const deviceStates = ["activo", "inactivo", "mantenimiento", "baja"] as const;
export type DeviceState = (typeof deviceStates)[number];

/**
 * Un paciente a cargo del usuario que pregunta, con el resumen que el tablero
 * necesita para ordenarlos por gravedad sin abrir la ficha de cada uno.
 */
export type AssignedPatient = {
  id: string;
  name: string;
  document: string;
  module: ServiceModule | null;
  status: PatientStatus;
  arrivedAt: string;
  reason: string;
  assignedAt: string;
  /** `dispositivo.codigo` de la cama, o null si no tiene equipo asignado. */
  device: string | null;
  deviceState: DeviceState | null;
  /** Alertas sin resolver de ese equipo, y la peor severidad entre ellas. */
  openAlerts: number;
  worstSeverity: AlertSeverity | null;
};

/** Conectividad de un equipo a pie de cama, para el tablero del administrador. */
export type DeviceStatus = {
  code: string;
  model: string | null;
  state: DeviceState;
  /** Nombre del paciente asignado, o null si el equipo está libre. */
  patient: string | null;
  sensors: number;
  activeSensors: number;
  /** Última lectura recibida de cualquiera de sus sensores. */
  lastReadingAt: string | null;
};

// ---------------------------------------------------------------------------
// Admisión: camas, ingresos y citas (routes/beds.ts, admissions.ts,
// appointments.ts). Espejo de frontend/src/modules/admissions/types.ts.
//
// Igual que en las notas SOAP: claves en inglés camelCase, valores de los
// enumerados tal cual están en la base, en español.
// ---------------------------------------------------------------------------

export const bedStates = ["disponible", "ocupada", "limpieza", "mantenimiento"] as const;
export type BedState = (typeof bedStates)[number];

export type Bed = {
  id: string;
  unitId: string;
  unit: string;
  code: string;
  type: string | null;
  state: BedState;
  /** Ingreso que la ocupa ahora mismo, o null. */
  patientId: string | null;
  patientName: string | null;
};

/** Una fila de `GET /beds/occupancy`: el resumen por unidad. */
export type BedOccupancy = {
  unitId: string;
  unit: string;
  total: number;
  occupied: number;
  available: number;
  /** Fuera de servicio: limpieza y mantenimiento juntas. */
  outOfService: number;
  /** Ocupadas sobre el total, 0–1. `total` en cero da 0 y no una división. */
  rate: number;
};

export const admissionTypes = ["urgencia", "programado", "traslado"] as const;
export type AdmissionType = (typeof admissionTypes)[number];

export const admissionStates = ["activo", "egresado", "cancelado"] as const;
export type AdmissionState = (typeof admissionStates)[number];

export type Admission = {
  id: string;
  patientId: string;
  patientName: string;
  patientDocument: string;
  bedId: string | null;
  bedCode: string | null;
  unitId: string | null;
  unit: string | null;
  type: AdmissionType;
  state: AdmissionState;
  reason: string;
  admittedAt: string;
  dischargedAt: string | null;
  dischargeSummary: string | null;
  recordedById: string | null;
  recordedByName: string | null;
};

export const appointmentStates = [
  "programada",
  "confirmada",
  "atendida",
  "cancelada",
  "no_asistio",
] as const;
export type AppointmentState = (typeof appointmentStates)[number];

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  patientDocument: string;
  /** Con quién es la cita, no quién la agendó. */
  professionalId: string;
  professionalName: string;
  unitId: string | null;
  unit: string | null;
  at: string;
  durationMin: number;
  reason: string;
  state: AppointmentState;
  notes: string | null;
};

// ---------------------------------------------------------------------------
// Búsqueda global (routes/search.ts). Espejo de
// frontend/src/modules/search/types.ts.
//
// Los resultados van en tres listas y no en una sola mezclada porque la pantalla
// los presenta por pestañas: unirlos aquí obligaría a volver a separarlos allá.
// `kind` viaja igual para que la pestaña "Todos" pueda pintarlos en una lista.
// ---------------------------------------------------------------------------

export type SearchPatientResult = {
  kind: "patient";
  id: string;
  name: string;
  document: string;
  /** Tiene alertas sin resolver de severidad alta o crítica. */
  critical: boolean;
  /** Código de la cama del ingreso activo, o null si no está ingresado. */
  bed: string | null;
  unit: string | null;
  /** `dispositivo.codigo` con el que se abre el monitoreo, o null. */
  device: string | null;
  /** Diagnóstico activo más reciente del expediente, o null. */
  diagnosis: string | null;
};

export type SearchNoteResult = {
  kind: "soapNote";
  id: string;
  patientId: string;
  patientName: string;
  at: string;
  /** Primeras líneas de las cuatro secciones juntas, ya recortadas. */
  excerpt: string;
};

export type SearchDocumentResult = {
  kind: "document";
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  /** `documento_clinico.tipo`: laboratorio, imagenologia, receta, … */
  type: string;
  at: string;
  /** Unidad donde está ingresado el paciente, o null. */
  unit: string | null;
};

export type SearchResult = SearchPatientResult | SearchNoteResult | SearchDocumentResult;

export type SearchResponse = {
  /** El término tal como lo interpretó el servidor, para el título de la pantalla. */
  query: string;
  patients: SearchPatientResult[];
  notes: SearchNoteResult[];
  documents: SearchDocumentResult[];
  total: number;
};
