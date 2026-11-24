// Forma de los datos de los 8 pacientes del simulador.
// `SeedPaciente` es lo que trae backend/db/seed-demo.sql (ver delSeed.ts, generado).
// `Inventado` es todo lo que el seed no trae: cada archivo DEMO-000X.ts lo marca con "no viene del seed".

export type SeedCama = { codigo: string; unidad: string; tipo: string; ocupadaPor: string | null };

export type SeedPaciente = {
  cedula: string;
  nombre: string;
  nacimiento: string;
  sexo: 'M' | 'F' | 'O';
  sangre: string | null;
  contacto: string | null;
  estado: string;
  motivo: string;
  llegadaHorasAtras: number;
  expediente: { observaciones: string | null; aperturaHorasAtras: number };
  antecedentes: Array<{ tipo: string; descripcion: string; parentesco: string | null; anio: number | null }>;
  alergias: Array<{ sustancia: string; reaccion: string | null; severidad: string; estado: string }>;
  medicamentos: Array<{ nombre: string; dosis: string | null; via: string | null; frecuencia: string | null; indicacion: string | null; estado: string; inicioDiasAtras: number }>;
  diagnosticos: Array<{ cie10: string | null; descripcion: string; tipo: string; estado: string; diasAtras: number }>;
  ingreso: { tipo: string; estado: string; motivo: string; horasAtras: number; cama: string };
  dispositivo: { codigo: string; modelo: string; microcontrolador: string; estado: string; instaladoHorasAtras: number };
  /** Una lectura por minuto: la primera de hace 40 min y la última de "ahora". */
  lecturas: Record<string, number[]>;
  alertas: Array<{ variable: string; indice: number; tipo: string; severidad: string; mensaje: string; estado: string }>;
};

/** Fecha civil "AAAA-MM-DD", o días antes de hoy. */
export type Fecha = string | number;

/** Hallazgo de exploración: [estado, texto]. */
export type Hallazgo = ['normal' | 'anormal', string];
export type Region = 'cabeza_cuello' | 'torax' | 'abdomen' | 'extremidades_superiores' | 'extremidades_inferiores' | 'neurologico';
export type Tecnica = 'inspeccion' | 'palpacion' | 'percusion' | 'auscultacion';

export type NotaInventada = {
  /** Horas antes de "ahora". */
  horasAtras: number;
  autor: string;
  estado: 'firmada' | 'borrador';
  s: string;
  o: string;
  a: string;
  p: string;
};

/** Todo lo de aquí NO viene del seed: se inventó coherente con el caso de cada paciente. */
export type Inventado = {
  /** Datos que el backend no tiene en `paciente` (los muestra Datos Personales). */
  personales: {
    estadoCivil: string;
    ocupacion: string;
    escolaridad: string;
    religion: string;
    telefono: string;
    email: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    /** El nombre y el teléfono salen del `contacto_emergencia` del seed; la relación no está ahí. */
    emergencia: { relacion: string };
    seguro: { tipo: string; poliza: string };
  };
  /** Presión arterial y temperatura: el backend no las tiene (ver MonitoredVitals en types/monitoring.ts). */
  pa: { sis: number; dia: number };
  temp: number;
  /** Exploración física (`exploracion_fisica`). `null`: evaluación primaria pendiente. */
  exploracion: null | {
    pesoKg: number;
    tallaCm: number;
    abdominalCm: number | null;
    glasgow: number;
    /** Signos de la exploración de ingreso (el backend solo guarda Glasgow). */
    signosIngreso: { fc: number; fr: number; ta: string; temp: number; spo2: number };
    /** Solo lo que no es el texto normal por defecto de esa región y técnica. */
    hallazgos: Partial<Record<Region, Partial<Record<Tecnica, Hallazgo>>>>;
  };
  notasSoap: NotaInventada[];
  /** Antecedentes además de los del seed (`antecedente`). */
  antecedentes: Array<{ tipo: string; descripcion: string; parentesco: string | null; anio: number | null }>;
  /** Diagnósticos resueltos de antes (`diagnostico_clinico` con estado `resuelto`). */
  resueltos: Array<{ cie10: string; descripcion: string; fecha: Fecha }>;
  /** Fechas: "AAAA-MM-DD" o un número de días atrás. */
  hospitalizaciones: Array<{ motivo: string; servicio: string; establecimiento: string; ingreso: Fecha; egreso: Fecha; resumen: string }>;
  procedimientos: Array<{ nombre: string; codigo: string | null; fecha: Fecha; descripcion: string; resultado: string; cirujano: string }>;
  documentos: Array<{ tipo: 'laboratorio' | 'imagenologia' | 'consentimiento' | 'interconsulta' | 'receta' | 'otro'; titulo: string; descripcion: string; horasAtras: number; por: string }>;
  /** Nota de ingreso (no existe en el backend). */
  notaIngreso: { motivo: string; padecimiento: string; plan: string[]; pronostico: 'Bueno' | 'Reservado' | 'Grave' };
  /** Interrogatorio por aparatos (no existe en el backend): síntomas marcados y observaciones por aparato. */
  interrogatorio: Record<string, { marcados: string[]; notas: string }>;
  /** Indicaciones que no son fármacos (no existen en el backend). Los fármacos salen del seed. */
  indicaciones: {
    soluciones: Array<[string, string, string]>;
    dieta: string[];
    restriccion: string | null;
    cuidados: string[];
    estudios: Array<[string, string, string, 'warning' | 'info' | 'success']>;
    interconsulta: { servicio: string; motivo: string; estado: string } | null;
  };
  /** Paneles del monitoreo detallado (no existen en el backend). */
  monitoreo: {
    glasgowDetalle: string;
    pupilas: string;
    conciencia: string;
    ventilacion: string;
    peep: string;
    fio2: string;
    etco2: string;
    gasometria: { ph: string; pao2: string; paco2: string };
    diuresis: string;
    balance: string;
    cristaloides: string;
    hemoderivados: string;
    laboratorios: Array<[string, string, boolean]>;
    llenadoCapilar: string;
    vasoactivo: [string, string];
  };
  /** Nota correlativa de la pantalla de diagnósticos. */
  notaCorrelativa: string;
  /** Lo que se dice de este paciente en la entrega de turno. */
  turno: { novedad: string; pendiente: string; tono: 'danger' | 'warning' | 'success' };
};

export type PacienteDemo = { delSeed: SeedPaciente; inventado: Inventado };
