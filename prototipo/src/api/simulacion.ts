// SIMULADO: lo que el backend todavía no tiene, pero vivo (docs/CONEXION-BACKEND.md, sección 11).
//
// 1. Deriva en el tiempo. PA, temperatura, tendencias y los paneles del monitoreo detallado no son números fijos:
//    cambian poco a poco alrededor del valor de cada caso (una suma de senos con fases propias de cada paciente y
//    signo; nada aleatorio, así dos pantallas abiertas a la vez dicen lo mismo).
// 2. Perfiles por diagnóstico. Los pacientes de la base que no son los 8 del simulador (DEMO-0009 en adelante, o
//    cualquiera que se dé de alta) no tienen nada inventado a mano: se les genera un perfil plausible según su
//    diagnóstico, su motivo de consulta y la gravedad de sus alertas. Todo lo que sale de aquí es simulado.
import type { Inventado } from './mock/seed/tipos';

const MIN = 60_000;

/** Número entero estable para un texto. */
export function hashTexto(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Ruido suave entre -1 y 1 que cambia poco a poco: tarda unos `periodoMin` minutos en ir de un lado al otro. */
export function deriva(clave: string, periodoMin: number, t = Date.now()): number {
  const h = hashTexto(clave);
  const x = t / (periodoMin * MIN);
  const fase = (n: number) => (((h >>> n) % 1000) / 1000) * 2 * Math.PI;
  return 0.55 * Math.sin(2 * Math.PI * x + fase(0)) + 0.3 * Math.sin(2 * Math.PI * 2.31 * x + fase(7)) + 0.15 * Math.sin(2 * Math.PI * 3.73 * x + fase(13));
}

/** `base` que oscila ±`amplitud` con su propio ritmo. */
export const vivo = (base: number, amplitud: number, clave: string, periodoMin: number, t?: number) => base + amplitud * deriva(clave, periodoMin, t);

/**
 * El primer número de un texto ("32%", "+2100 mL", "18.5 ×10³/µL", "118,000", "4 850 ng/mL"), movido ±`relativa`
 * con el tiempo; conserva los decimales, el signo, el separador de miles (coma o espacio) y el formato. Un texto sin
 * números se queda igual.
 */
export function vivoTexto(texto: string, clave: string, relativa: number, periodoMin: number, t?: number): string {
  const m = /([+-]?)(\d{1,3}(?:[ ,]\d{3})+|\d+(?:\.\d+)?)/.exec(texto);
  if (!m) return texto;
  const [entero, signo, num] = m;
  const separador = num.includes(',') ? ',' : num.includes(' ') ? ' ' : null;
  const valor = Number(num.replace(/[ ,]/g, ''));
  const decimales = separador ? 0 : (num.split('.')[1] ?? '').length;
  const nuevo = Math.max(0, vivo(valor, Math.abs(valor) * relativa, clave, periodoMin, t));
  let texto2 = nuevo.toFixed(decimales);
  if (separador) texto2 = Math.round(nuevo).toLocaleString('en-US').replace(/,/g, separador);
  return texto.slice(0, m.index) + signo + texto2 + texto.slice(m.index + entero.length);
}

/**
 * Un resultado de laboratorio simulado. No se mueve de a poco como un monitor: cambia solo cuando "llega" un resultado
 * nuevo, cada 60 a 120 minutos según el estudio y el paciente, y se sabe a qué hora llegó (docs/historial/REVISION-MEDICO.md, 4).
 */
export function resultadoLab(texto: string, clave: string, relativa: number, t = Date.now()): { texto: string; at: number } {
  const h = hashTexto(clave);
  const periodo = (60 + (h % 61)) * MIN;
  const desfase = (h >>> 8) % periodo;
  const at = Math.floor((t - desfase) / periodo) * periodo + desfase;
  return { texto: vivoTexto(texto, clave, relativa, 6 * 60, at), at };
}

// --- Signos simulados vivos (PA y temperatura) ---------------------------------------------------------------

export type SignosBase = { pa: { sis: number; dia: number }; temp: number };

/** PA y temperatura de ahora (o del instante `t`), oscilando alrededor de la base del caso. */
export function signosVivos(cedula: string, base: SignosBase, t?: number) {
  const sis = Math.round(vivo(base.pa.sis, 5, `${cedula}:sis`, 9, t));
  const dia = Math.round(vivo(base.pa.dia, 3, `${cedula}:dia`, 11, t));
  const temp = Math.round(vivo(base.temp, 0.25, `${cedula}:temp`, 25, t) * 10) / 10;
  return { pa: { sis, dia }, temp, pam: Math.round((sis + 2 * dia) / 3) };
}

/** Los paneles del monitoreo con la hora de cada resultado: el 4.º elemento de cada laboratorio y `gasometriaAt`. */
export type MonitoreoVivo = Omit<Inventado['monitoreo'], 'laboratorios'> & {
  laboratorios: Array<[string, string, boolean, number]>;
  gasometriaAt: number;
};

/**
 * Los paneles del monitoreo detallado con sus números al día: lo que se mide en la cama (FiO2, EtCO2, diuresis,
 * balance, llenado capilar) se mueve de a poco; los laboratorios y la gasometría son resultados: cambian solo cuando
 * llega uno nuevo y dicen a qué hora llegó.
 */
export function monitoreoVivo(m: Inventado['monitoreo'], cedula: string, t = Date.now()): MonitoreoVivo {
  const v = (texto: string, nombre: string, rel: number, periodo: number) => vivoTexto(texto, `${cedula}:${nombre}`, rel, periodo, t);
  const gas = resultadoLab('', `${cedula}:gasometria`, 0, t).at;
  return {
    ...m,
    fio2: v(m.fio2, 'fio2', 0.05, 15),
    etco2: v(m.etco2, 'etco2', 0.06, 10),
    gasometria: {
      ph: vivoTexto(m.gasometria.ph, `${cedula}:ph`, 0.004, 6 * 60, gas),
      pao2: vivoTexto(m.gasometria.pao2, `${cedula}:pao2`, 0.06, 6 * 60, gas),
      paco2: vivoTexto(m.gasometria.paco2, `${cedula}:paco2`, 0.06, 6 * 60, gas),
    },
    gasometriaAt: gas,
    diuresis: v(m.diuresis, 'diuresis', 0.15, 20),
    balance: v(m.balance, 'balance', 0.05, 45),
    cristaloides: v(m.cristaloides, 'cristaloides', 0.04, 60),
    laboratorios: m.laboratorios.map(([nombre, valor, alterado]) => {
      const r = resultadoLab(valor, `${cedula}:lab:${nombre}`, 0.06, t);
      return [nombre, r.texto, alterado, r.at] as [string, string, boolean, number];
    }),
    llenadoCapilar: v(m.llenadoCapilar, 'llenado', 0.12, 20),
  };
}

// --- Perfiles por diagnóstico (pacientes sin nada inventado a mano) -----------------------------------------

export type Contexto = {
  cedula: string;
  nombre: string;
  /** `paciente.motivo_consulta`: de aquí sale la categoría (y con ella los números). */
  motivo: string;
  edad: number | null;
  sexo: string | null;
  /** La peor alerta abierta del paciente. */
  severidad: string | null;
  /**
   * Solo para los textos (nota de ingreso, interrogatorio): las observaciones del expediente y los diagnósticos
   * activos. No cambian los números, así la PA de una lista y la de la ficha son la misma aunque la lista no los pida.
   */
  observaciones?: string | null;
  diagnosticos?: string[];
};

type Categoria = 'cardio' | 'respiratorio' | 'infeccion' | 'trauma' | 'obstetrico' | 'abdominal' | 'metabolico' | 'neuro' | 'musculo' | 'general';

const plano = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** De qué es el caso, por su motivo de consulta (el orden importa: el primero que coincide gana). */
export function categoriaDe(motivo: string): Categoria {
  const t = plano(motivo);
  if (/embaraz|gestac|obstetr|semanas de/.test(t)) return 'obstetrico';
  if (/sepsis|septic|pielonefr|infeccion urin|fiebre alta/.test(t)) return 'infeccion';
  if (/fractur|trauma|caida|accidente|herida|contusion|golpe/.test(t)) return 'trauma';
  if (/insuficiencia cardiaca|arritmi|fibrilacion|taquicard|bradicard|infarto|palpitacion|opresion en el pecho|hinchazon de piernas|edema|al acostarse|ortopnea|desmayo|sincope/.test(t)) return 'cardio';
  if (/asma|epoc|neumon|disnea|sibilanc|silbido|falta de aire|dificultad para respirar|\btos\b/.test(t)) return 'respiratorio';
  if (/apendic|colecist|pancreat|abdom|iliaca|postoperatori|posoperatori|vomito/.test(t)) return 'abdominal';
  if (/hipoglucem|cetoacidosis|diabet|glucemia|glucosa/.test(t)) return 'metabolico';
  if (/cefalea|dolor de cabeza|convulsi|ictus|neurolog|migran|confusion/.test(t)) return 'neuro';
  if (/lumbalgia|contractura|esguince|dolor lumbar|espalda/.test(t)) return 'musculo';
  if (/fiebre|infecc/.test(t)) return 'infeccion';
  return 'general';
}

type Plantilla = {
  pa: [number, number];
  temp: number;
  ingreso: { fc: number; fr: number; spo2: number };
  plan: string[];
  aparatos: Record<string, string[]>;
  dieta: string;
  cuidados: string[];
  estudios: Array<[string, string]>;
  interconsulta: [string, string] | null;
  ventilacion: string;
  fio2: string;
  labs: Array<[string, string, boolean]>;
  vasoactivo: [string, string];
  diuresis: string;
  novedad: string;
  pendiente: string;
};

const PLANTILLAS: Record<Categoria, Plantilla> = {
  cardio: {
    pa: [142, 88], temp: 36.7, ingreso: { fc: 104, fr: 24, spo2: 91 },
    plan: ['Monitoreo cardíaco continuo', 'Diurético IV y balance hídrico estricto', 'ECG y troponina seriados', 'Ecocardiograma'],
    aparatos: { 'Aparato Cardiovascular': ['Palpitaciones', 'Edema', 'Disnea de esfuerzo'], 'Aparato Respiratorio': ['Disnea'] },
    dieta: 'Hiposódica, restricción hídrica 1.5 L/día', cuidados: ['Cabecera a 45 grados', 'Peso diario en ayunas', 'Balance de líquidos cada turno'],
    estudios: [['BNP', 'Laboratorio'], ['Ecocardiograma', 'Imagen']], interconsulta: ['Cardiología', 'Ajuste de tratamiento'],
    ventilacion: 'No (puntas nasales 2 L)', fio2: '28%',
    labs: [['BNP', '1250 pg/mL', true], ['CREATININA', '1.4 mg/dL', true], ['K+', '4.1 mEq/L', false], ['HB', '12.1 g/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '60 mL/h', novedad: 'Disnea en mejoría con diurético', pendiente: 'Control de electrolitos y peso',
  },
  respiratorio: {
    pa: [128, 78], temp: 37.4, ingreso: { fc: 108, fr: 26, spo2: 90 },
    plan: ['Oxígeno para SpO2 ≥ 92 %', 'Broncodilatadores nebulizados', 'Radiografía de tórax', 'Gasometría arterial'],
    aparatos: { 'Aparato Respiratorio': ['Disnea', 'Tos', 'Sibilancias'] },
    dieta: 'Normal, fraccionada', cuidados: ['Oximetría continua', 'Fisioterapia respiratoria', 'Cabecera a 30 grados'],
    estudios: [['Radiografía de tórax', 'Imagen'], ['Gasometría arterial', 'Laboratorio']], interconsulta: ['Neumología', 'Valoración'],
    ventilacion: 'No (mascarilla 6 L)', fio2: '35%',
    labs: [['LEUCOCITOS', '11.2 ×10³/µL', true], ['PCR', '38 mg/L', true], ['HB', '13.4 g/dL', false], ['K+', '3.9 mEq/L', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '55 mL/h', novedad: 'Mejor mecánica respiratoria', pendiente: 'Reevaluar flujo pico y oxígeno',
  },
  infeccion: {
    pa: [98, 58], temp: 38.6, ingreso: { fc: 116, fr: 24, spo2: 93 },
    plan: ['Hemocultivos y cultivo del foco antes del antibiótico', 'Antibiótico empírico', 'Cristaloides y reevaluar perfusión', 'Lactato seriado'],
    aparatos: { 'Sistema Músculo-esquelético': ['Mialgias', 'Debilidad'], 'Sistema Neurológico': ['Mareo'] },
    dieta: 'Blanda', cuidados: ['Control de temperatura cada 4 horas', 'Medios físicos para la fiebre', 'Diuresis horaria'],
    estudios: [['Hemocultivos ×2', 'Laboratorio'], ['Lactato', 'Laboratorio']], interconsulta: ['Infectología', 'Ajuste de antibiótico'],
    ventilacion: 'No', fio2: '21%',
    labs: [['LEUCOCITOS', '16.8 ×10³/µL', true], ['LACTATO', '2.9 mmol/L', true], ['PCT', '6.2 ng/mL', true], ['CREATININA', '1.3 mg/dL', true]],
    vasoactivo: ['NORADRENALINA', 'Preparada (si PAM < 65)'], diuresis: '35 mL/h', novedad: 'Fiebre persistente con antibiótico', pendiente: 'Resultado de cultivos',
  },
  trauma: {
    pa: [112, 70], temp: 36.6, ingreso: { fc: 102, fr: 20, spo2: 96 },
    plan: ['Analgesia escalonada', 'Inmovilización del segmento afectado', 'Radiografías de control', 'Valoración por Ortopedia'],
    aparatos: { 'Sistema Músculo-esquelético': ['Dolor', 'Deformidad'] },
    dieta: 'Normal', cuidados: ['Vigilar pulsos distales y llenado capilar', 'Elevación del miembro afectado', 'Escala de dolor cada 4 horas'],
    estudios: [['Radiografía del segmento', 'Imagen'], ['Hemoglobina de control', 'Laboratorio']], interconsulta: ['Ortopedia', 'Manejo definitivo'],
    ventilacion: 'No', fio2: '21%',
    labs: [['HB', '12.6 g/dL', false], ['PLAQUETAS', '210,000', false], ['CREATININA', '0.9 mg/dL', false], ['K+', '4.0 mEq/L', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '70 mL/h', novedad: 'Dolor controlado con analgesia', pendiente: 'Programación quirúrgica',
  },
  obstetrico: {
    pa: [118, 74], temp: 36.8, ingreso: { fc: 92, fr: 18, spo2: 98 },
    plan: ['Monitoreo fetal continuo', 'Examen general de orina', 'Vigilar actividad uterina', 'Valoración por Ginecología'],
    aparatos: { 'Aparato Digestivo': ['Dolor abdominal'] },
    dieta: 'Normal', cuidados: ['Frecuencia cardíaca fetal cada hora', 'Decúbito lateral izquierdo', 'Vigilar sangrado y pérdida de líquido'],
    estudios: [['Ecografía obstétrica', 'Imagen'], ['Examen de orina', 'Laboratorio']], interconsulta: ['Ginecología', 'Valoración obstétrica'],
    ventilacion: 'No', fio2: '21%',
    labs: [['HB', '11.6 g/dL', false], ['LEUCOCITOS', '9.8 ×10³/µL', false], ['PLAQUETAS', '232,000', false], ['GLUCOSA', '92 mg/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '80 mL/h', novedad: 'Sin actividad uterina', pendiente: 'Reporte de ecografía',
  },
  abdominal: {
    pa: [124, 76], temp: 37.6, ingreso: { fc: 104, fr: 20, spo2: 96 },
    plan: ['Ayuno e hidratación IV', 'Analgesia', 'Ecografía abdominal', 'Valoración por Cirugía'],
    aparatos: { 'Aparato Digestivo': ['Dolor abdominal', 'Náuseas'] },
    dieta: 'Ayuno', cuidados: ['Vigilar dolor y signos peritoneales', 'Balance de líquidos', 'Control de temperatura'],
    estudios: [['Ecografía abdominal', 'Imagen'], ['Hemograma y PCR', 'Laboratorio']], interconsulta: ['Cirugía General', 'Valoración quirúrgica'],
    ventilacion: 'No', fio2: '21%',
    labs: [['LEUCOCITOS', '13.1 ×10³/µL', true], ['PCR', '42 mg/L', true], ['LIPASA', '64 U/L', false], ['HB', '13.9 g/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '65 mL/h', novedad: 'Dolor abdominal en descenso', pendiente: 'Decisión quirúrgica',
  },
  metabolico: {
    pa: [126, 80], temp: 36.5, ingreso: { fc: 98, fr: 18, spo2: 97 },
    plan: ['Glucemia capilar cada hora', 'Dextrosa IV si glucemia < 70 mg/dL', 'Revisar esquema de insulina', 'Educación al paciente'],
    aparatos: { 'Sistema Neurológico': ['Confusión', 'Mareo'] },
    dieta: 'Para diabético, colaciones', cuidados: ['Glucemia capilar cada hora', 'Vigilar estado de alerta'],
    estudios: [['Glucemia central', 'Laboratorio'], ['HbA1c', 'Laboratorio']], interconsulta: ['Endocrinología', 'Ajuste de insulina'],
    ventilacion: 'No', fio2: '21%',
    labs: [['GLUCOSA', '118 mg/dL', false], ['K+', '3.8 mEq/L', false], ['CREATININA', '1.0 mg/dL', false], ['HB', '13.2 g/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '75 mL/h', novedad: 'Glucemias estables tras dextrosa', pendiente: 'Ajuste de insulina',
  },
  neuro: {
    pa: [132, 84], temp: 36.7, ingreso: { fc: 84, fr: 16, spo2: 98 },
    plan: ['Analgesia y antiemético', 'Vigilar signos de alarma neurológica', 'TC de cráneo si empeora', 'Reevaluar en 1 hora'],
    aparatos: { 'Sistema Neurológico': ['Cefalea'], 'Aparato Digestivo': ['Náuseas'] },
    dieta: 'Normal', cuidados: ['Escala de Glasgow cada 4 horas', 'Ambiente con poca luz y ruido'],
    estudios: [['TC de cráneo', 'Imagen'], ['Electrolitos', 'Laboratorio']], interconsulta: ['Neurología', 'Valoración'],
    ventilacion: 'No', fio2: '21%',
    labs: [['NA+', '139 mEq/L', false], ['K+', '4.2 mEq/L', false], ['GLUCOSA', '101 mg/dL', false], ['HB', '14.0 g/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '70 mL/h', novedad: 'Cefalea en descenso', pendiente: 'Reevaluación neurológica',
  },
  musculo: {
    pa: [124, 78], temp: 36.6, ingreso: { fc: 82, fr: 16, spo2: 98 },
    plan: ['Analgesia y relajante muscular', 'Calor local', 'Movilización según tolerancia'],
    aparatos: { 'Sistema Músculo-esquelético': ['Dolor', 'Rigidez'] },
    dieta: 'Normal', cuidados: ['Escala de dolor cada 6 horas', 'Movilización progresiva'],
    estudios: [['Radiografía lumbar', 'Imagen']], interconsulta: null,
    ventilacion: 'No', fio2: '21%',
    labs: [['HB', '14.2 g/dL', false], ['LEUCOCITOS', '7.4 ×10³/µL', false], ['CREATININA', '0.9 mg/dL', false], ['K+', '4.1 mEq/L', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '80 mL/h', novedad: 'Dolor controlado', pendiente: 'Alta con indicaciones',
  },
  general: {
    pa: [122, 76], temp: 36.8, ingreso: { fc: 88, fr: 18, spo2: 96 },
    plan: ['Monitoreo de signos vitales', 'Laboratorios de control', 'Reevaluación clínica'],
    aparatos: {},
    dieta: 'Normal', cuidados: ['Signos vitales cada 4 horas'],
    estudios: [['Laboratorios de control', 'Laboratorio']], interconsulta: null,
    ventilacion: 'No', fio2: '21%',
    labs: [['HB', '13.5 g/dL', false], ['LEUCOCITOS', '8.2 ×10³/µL', false], ['CREATININA', '0.9 mg/dL', false], ['GLUCOSA', '98 mg/dL', false]],
    vasoactivo: ['NINGUNO', '—'], diuresis: '70 mL/h', novedad: 'Sin cambios', pendiente: 'Reevaluación',
  },
};

const elegir = <T,>(lista: T[], cedula: string, n = 0) => lista[(hashTexto(`${cedula}:${n}`) % lista.length + lista.length) % lista.length];

export type PerfilGenerado = Pick<Inventado, 'personales' | 'pa' | 'temp' | 'monitoreo' | 'notaIngreso' | 'interrogatorio' | 'indicaciones' | 'turno'> & {
  signosIngreso: NonNullable<Inventado['exploracion']>['signosIngreso'];
  categoria: Categoria;
};

/** El perfil SIMULADO de un paciente sin datos inventados a mano, coherente con su diagnóstico y la gravedad de sus alertas. */
export function perfilGenerado(ctx: Contexto): PerfilGenerado {
  const c = categoriaDe(ctx.motivo);
  const p = PLANTILLAS[c];
  const grave = ctx.severidad === 'critica';
  const alta = ctx.severidad === 'alta';
  // Variación propia de cada paciente para que dos del mismo diagnóstico no den lo mismo.
  const d = (n: number, k: string) => Math.round(((hashTexto(`${ctx.cedula}:${k}`) % 1000) / 1000 - 0.5) * 2 * n);
  // Con alerta crítica, la perfusión empeora en los cuadros que lo hacen (infección, trauma); en los demás, sube.
  const choque = grave && (c === 'infeccion' || c === 'trauma');
  const sis = p.pa[0] + d(6, 'sis') + (choque ? -16 : grave ? 8 : 0);
  const dia = p.pa[1] + d(4, 'dia') + (choque ? -10 : grave ? 4 : 0);
  const temp = Math.round((p.temp + d(2, 'temp') / 10) * 10) / 10;
  const nombre = ctx.nombre.split(' ')[0];
  const diag = ctx.diagnosticos?.[0] ?? ctx.motivo;
  return {
    categoria: c,
    personales: {
      estadoCivil: elegir(ctx.sexo === 'F' ? ['Casada', 'Soltera', 'Unión libre', 'Divorciada', 'Viuda'] : ['Casado', 'Soltero', 'Unión libre', 'Divorciado', 'Viudo'], ctx.cedula, 1),
      ocupacion: elegir(['Comerciante', 'Docente', 'Conductor', 'Oficinista', 'Ama de casa', 'Técnico', 'Jubilado'], ctx.cedula, 2),
      escolaridad: elegir(['Primaria', 'Secundaria', 'Técnica', 'Universitaria'], ctx.cedula, 3),
      religion: elegir(['Católica', 'Evangélica', 'Ninguna'], ctx.cedula, 4),
      telefono: `555-${1000 + (hashTexto(ctx.cedula) % 9000)}`,
      email: `${plano(nombre)}.${ctx.cedula.toLowerCase().replace(/[^a-z0-9]/g, '')}@ejemplo.com`,
      direccion: `${elegir(['Calle 50', 'Vía España', 'Av. Balboa', 'Calle 12 Este', 'Vía Porras'], ctx.cedula, 5)}, casa ${hashTexto(ctx.cedula) % 90 + 10}`,
      ciudad: 'Ciudad de Panamá',
      provincia: 'Panamá',
      codigoPostal: '0819',
      emergencia: { relacion: elegir(['Esposo(a)', 'Hijo(a)', 'Hermano(a)', 'Madre'], ctx.cedula, 6) },
      seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: `${hashTexto(ctx.cedula) % 9}-${hashTexto(ctx.cedula + 'p') % 900 + 100}-${hashTexto(ctx.cedula + 'q') % 9000 + 1000}` },
    },
    pa: { sis, dia },
    temp,
    signosIngreso: { fc: p.ingreso.fc + d(8, 'fc'), fr: p.ingreso.fr + d(2, 'fr'), ta: `${sis + 6}/${dia + 4}`, temp, spo2: Math.min(100, p.ingreso.spo2 + d(2, 'spo2')) },
    monitoreo: {
      glasgowDetalle: grave ? 'O3 V4 M6' : 'O4 V5 M6',
      pupilas: 'Isocóricas reactivas 3mm',
      conciencia: grave ? 'Somnoliento' : 'Alerta',
      ventilacion: p.ventilacion,
      peep: '—',
      fio2: p.fio2,
      etco2: '—',
      gasometria: { ph: choque ? '7.32' : '7.39', pao2: c === 'respiratorio' ? '64' : '88', paco2: c === 'respiratorio' ? '46' : '38' },
      diuresis: choque ? '30 mL/h' : p.diuresis,
      balance: choque ? '+1800 mL' : '+350 mL',
      cristaloides: choque ? '2500 mL' : '1000 mL',
      hemoderivados: c === 'trauma' && grave ? '2 CE' : '—',
      laboratorios: p.labs,
      llenadoCapilar: choque ? '4 seg' : '2 seg',
      vasoactivo: choque ? ['NORADRENALINA', 'Preparada (si PAM < 65)'] : p.vasoactivo,
    },
    notaIngreso: {
      motivo: ctx.motivo,
      padecimiento: [
        `${ctx.sexo === 'F' ? 'Femenina' : 'Masculino'}${ctx.edad !== null ? ` de ${ctx.edad} años` : ''} que acude por ${ctx.motivo.charAt(0).toLowerCase()}${ctx.motivo.slice(1)}.`,
        ctx.observaciones ?? '',
        `Impresión diagnóstica: ${diag}.`,
      ].filter(Boolean).join(' '),
      plan: p.plan,
      pronostico: grave ? 'Grave' : alta ? 'Reservado' : 'Bueno',
    },
    interrogatorio: Object.fromEntries(Object.entries(p.aparatos).map(([aparato, marcados]) => [aparato, { marcados, notas: `Referido por el paciente al ingreso (${diag.toLowerCase()}).` }])),
    indicaciones: {
      soluciones: [[c === 'infeccion' ? 'Solución salina 0.9% 1000 ml' : 'Solución Hartmann 1000 ml', choque ? '250 ml/hr' : '80 ml/hr', 'Periférica']],
      dieta: [p.dieta],
      restriccion: null,
      cuidados: p.cuidados,
      estudios: p.estudios.map(([nombre2, area], i) => [nombre2, area, i === 0 ? 'Pendiente' : 'Realizado', i === 0 ? 'warning' : 'success']),
      interconsulta: p.interconsulta ? { servicio: p.interconsulta[0], motivo: p.interconsulta[1], estado: 'En espera' } : null,
    },
    turno: { novedad: grave ? `${p.novedad.replace(/en mejoría|en descenso|estables?|controlado/i, 'sin mejoría')}` : p.novedad, pendiente: p.pendiente, tono: grave ? 'danger' : alta ? 'warning' : 'success' },
  };
}
