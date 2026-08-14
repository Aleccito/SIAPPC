import type { Prisma } from "./generated/prisma/client.ts";
import type { TipoSangre as PrismaTipoSangre } from "./generated/prisma/enums.ts";

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

// Los "módulos de atención" (KY-001, KY-004…) se retiraron de la aplicación.
// Eran una lista fija de códigos que NO decía dónde está el paciente, y lo que
// hace falta saber de él es su cama (`ingreso` → `cama` → `unidad`).
//
// La columna `paciente.modulo` sigue en la base con lo que se registró en su
// día —borrarla es una migración que destruye ese histórico— pero no se pide al
// registrar, no se escribe y ya no sale en ninguna respuesta.
//
// OJO al leer este archivo: los `modulo` de `PermisoRow`, `RolPermisoRow` y
// `RolePermission` son otra cosa por completo (pacientes, alertas, reportes…),
// son los módulos de la matriz de permisos y no tienen nada que ver.

export type PatientStatus = "waiting" | "inService" | "discharged";

/** Espejo del ENUM `sexo` de la tabla `paciente`: los valores son los de la base. */
export const sexes = ["M", "F", "O"] as const;
export type Sex = (typeof sexes)[number];

// Los grupos sanguíneos viajan tal como los guarda MariaDB ("A+", "O-"), no con
// el nombre que Prisma les da en TypeScript (`A_POS`, `O_NEG`): ese nombre es un
// apaño del generador —un identificador no puede llevar '+'— y no un dato.
export const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodType = (typeof bloodTypes)[number];

export type Patient = {
  id: string;
  name: string;
  document: string;
  status: PatientStatus;
  arrivedAt: string;
  reason: string;
  /// Fecha civil sin hora ("1990-05-14"): la columna es DATE y no guarda hora.
  birthDate: string;
  sex: Sex;
  bloodType: BloodType | null;
  emergencyContact: string | null;
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
  estado: PatientStatus;
  motivo_consulta: string | null;
  fecha_llegada: string;
  // Lo que entrega el cliente de Prisma: DATE como Date y el enumerado con su
  // nombre de TypeScript (`A_POS`), que routes/patients.ts traduce al valor real.
  fecha_nacimiento: Date;
  sexo: Sex;
  tipo_sangre: PrismaTipoSangre | null;
  contacto_emergencia: string | null;
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
// Bandeja de notificaciones (routes/notifications.ts). Espejo de
// frontend/src/modules/notifications/types.ts.
// ---------------------------------------------------------------------------

/**
 * De qué habla el aviso. De ahí salen su icono y su color en la bandeja.
 *
 * Son DOS y no siete. La pantalla se diseñó con siete —asignación, reporte,
 * sistema, nota clínica, mantenimiento— pero `notificacion.alerta_id` es NOT
 * NULL: en este esquema una notificación no puede existir sin una alerta que la
 * origine, y ninguno de esos otros cinco sucesos crea alertas. Sostenerlos
 * exigiría hacer `alerta_id` nulable y agregar tipo/título/cuerpo propios, que
 * es un cambio de modelo, no un ajuste de pantalla.
 *
 * No es la severidad: es el par de niveles que sí se notifican (ver
 * lib/notificaciones.ts), separados porque en la bandeja tienen que
 * distinguirse de un vistazo.
 */
export const notificationKinds = ["alertaCritica", "alertaTemprana"] as const;
export type NotificationKind = (typeof notificationKinds)[number];

/**
 * Una fila de la bandeja.
 *
 * No trae título ni cuerpo redactados: trae los DATOS del hecho (paciente,
 * equipo, variable, valor) y el frontend arma la frase con su diccionario. Si
 * el servidor mandara el texto ya hecho, la pantalla tendría cadenas en español
 * que `t()` no puede traducir y que ningún idioma nuevo alcanzaría.
 */
export type Notification = {
  id: string;
  kind: NotificationKind;
  /** La alerta que lo originó, para poder ir a ella desde la bandeja. */
  alertId: string;
  patientId: string | null;
  patientName: string | null;
  device: string;
  variable: string;
  unit: string;
  value: number;
  /** `alerta.tipo`: `hr_fuera_de_rango`, `spo2_bajo`, … */
  type: string;
  severity: AlertSeverity;
  /** `alerta.mensaje` tal como lo redactó la ingesta. Puede faltar. */
  message: string | null;
  at: string;
  read: boolean;
};

export type NotificacionRow = {
  notificacion_id: bigint;
  alerta_id: bigint;
  estado_envio: string;
  fecha_envio: Date;
  tipo: string;
  severidad: AlertSeverity;
  mensaje: string | null;
  valor: Prisma.Decimal | string;
  variable_medida: string;
  unidad: string;
  codigo: string;
  paciente_id: number | null;
  paciente_nombre: string | null;
};

/**
 * Lo que devuelve `GET /notifications`.
 *
 * El total de no leídas viaja CON la página y no en un endpoint aparte: la
 * campana necesita las dos cosas a la vez —el número y las últimas filas— y
 * partirlo en dos llamadas son dos viajes que además pueden discrepar entre sí
 * si algo se marca leído en medio.
 */
export type NotificationPage = {
  total: number;
  unread: number;
  entries: Notification[];
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
  /**
   * `expediente_clinico.expediente_id`. Null mientras nadie haya escrito nada
   * clínico: el expediente se crea al primer apunte, no al admitir.
   */
  record: string | null;
  /** Unidad y cama del ingreso activo; null si no lo tiene o si no hay cama. */
  unit: string | null;
  bed: string | null;
  /**
   * Ingreso abierto del paciente, o null si no tiene ninguno. Va en el DTO
   * porque es lo que permite cambiarle la cama desde la lista de pacientes sin
   * volver a pedir sus ingresos: `PATCH /admissions/:id` necesita este id.
   */
  admissionId: string | null;
  /**
   * Fecha civil de nacimiento ("1990-05-14T00:00:00-05:00"). La EDAD no viaja:
   * no se guarda en ninguna columna y calcularla en el servidor la congelaría
   * en la respuesta cacheada; se deriva al pintarla.
   */
  birthDate: string;
  /**
   * Tipo y fecha del ingreso ACTIVO (`ingreso.tipo`, `ingreso.fecha_ingreso`),
   * o null si el paciente no tiene ninguno abierto. El estado no viaja porque
   * la consulta ya filtra `estado = 'activo'`: sería una constante.
   */
  admissionType: AdmissionType | null;
  admittedAt: string | null;
  /** Escala de Glasgow (3 a 15) de la exploración física, si está registrada. */
  glasgow: number | null;
  /**
   * Si el paciente ya tiene exploración física. `false` es "evaluación
   * primaria sin completar", que es lo que cuenta el KPI del tablero médico.
   */
  examined: boolean;
  /** Última lectura de cada signo que el monitor publica. */
  vitals: PatientVitals;
};

/**
 * Los signos vitales de la cabecera del tablero, no la serie: solo el último
 * valor de cada variable.
 *
 * Son únicamente las que la Raspberry publica de verdad (ver
 * src/services/mqttIngest.ts). La presión arterial NO está: `lectura.valor` es
 * un escalar y una PA es un par sistólica/diastólica, así que no cabe en el
 * modelo — mostrarla exigiría dos variables nuevas y alguien que las publique.
 */
export type PatientVitals = {
  /** Frecuencia cardíaca en lpm. */
  hr: number | null;
  /** Saturación de oxígeno en %. */
  spo2: number | null;
  /** Momento de la más reciente de las lecturas anteriores. */
  at: string | null;
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
// Central de monitoreo (routes/monitoring.ts). Espejo de
// frontend/src/modules/monitoring/types.ts.
//
// La unidad de la fila es la CAMA y no el paciente, que es lo que la distingue
// de /dashboard/assigned-patients: la central enseña el mapa físico de la
// unidad —incluidas las camas vacías, que son justamente lo que se busca cuando
// llega un ingreso— y no la lista de "mis pacientes". Colgarla del endpoint del
// tablero habría obligado a inventar filas para las camas sin nadie dentro.
// ---------------------------------------------------------------------------

/**
 * Último valor de cada variable que la central pinta por cama.
 *
 * Las tres son las que un publicador emite de verdad (`hr`, `spo2` y `resp` en
 * iot/monitor/net/publisher.py). NO hay presión arterial ni temperatura:
 *
 *  - `pa` está en el catálogo de `variable` que siembra db/seed.sql, pero ningún
 *    publicador la manda, y aunque lo hiciera `lectura.valor` es un escalar
 *    DECIMAL: una PA es un par sistólica/diastólica y no cabe en una fila. La
 *    PAM, que se calcula a partir de ese par, tampoco existe por lo mismo.
 *  - `temp` no la emite nadie. Lo único parecido en el equipo es `die_temp_c`,
 *    la temperatura del encapsulado del MAX30102 (~30 °C), que es la del chip y
 *    no la del paciente: enseñarla como fiebre sería una mentira clínica.
 *
 * `resp` sí viaja, pero es una ESTIMACIÓN sacada de cómo la respiración mueve
 * la línea de base del pletismógrafo, no una respiración medida por flujo ni
 * por impedancia. La pantalla la rotula como estimada por eso mismo.
 */
export type MonitoredVitals = {
  /** Frecuencia cardíaca en lpm. */
  hr: number | null;
  /** Saturación de oxígeno en %. */
  spo2: number | null;
  /** Frecuencia respiratoria ESTIMADA del pletismógrafo, en rpm. */
  resp: number | null;
  /** Momento de la más reciente de las lecturas anteriores. */
  at: string | null;
};

/** Una cama de la central de monitoreo, con o sin paciente dentro. */
export type MonitoredBed = {
  id: string;
  /** `cama.codigo`: "C-01". */
  bed: string;
  unitId: string;
  unit: string;
  /** `cama.estado`. `disponible` es lo que la pantalla pinta como cama libre. */
  bedState: BedState;
  /** Datos del ocupante; todo null cuando la cama no tiene ingreso activo. */
  patientId: string | null;
  patientName: string | null;
  /** Fecha civil de nacimiento; la edad se calcula al pintar, nunca se guarda. */
  birthDate: string | null;
  /** `dispositivo.codigo` con el que se abre el monitor de esa cama, o null. */
  device: string | null;
  deviceState: DeviceState | null;
  openAlerts: number;
  /**
   * Peor alerta sin resolver del equipo. De aquí SALE el estado clínico
   * (Crítico / Monitoreo / Estable) que pinta la pantalla: no existe ninguna
   * columna que lo diga, se deriva — igual que en el tablero.
   */
  worstSeverity: AlertSeverity | null;
  /**
   * `exploracion_fisica.glasgow` (3–15), o null si no hay exploración.
   *
   * NO es telemetría: lo escribe un clínico al explorar y no cambia solo. Viaja
   * junto a los signos vitales porque en la cabecera de la cama se lee junto a
   * ellos, pero la pantalla tiene que dejar claro que no se actualiza en vivo.
   */
  glasgow: number | null;
  vitals: MonitoredVitals;
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

/** Lo que devuelve PUT /beds/capacity: cuántas camas tiene la unidad al final. */
export type BedCapacity = {
  unitId: string;
  unit: string;
  total: number;
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
