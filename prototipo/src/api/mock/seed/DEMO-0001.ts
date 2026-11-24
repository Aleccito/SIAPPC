// DEMO-0001 · Rogelio Batista Quintero · 68 años · UCI-01 · sepsis de probable foco urinario.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Casado',
    ocupacion: 'Comerciante jubilado',
    escolaridad: 'Secundaria',
    religion: 'Católica',
    telefono: '555-0151',
    email: 'rogelio.batista@ejemplo.com',
    direccion: 'Calle 50, Edif. Los Robles, apto 4B',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0816',
    emergencia: { relacion: 'Esposa' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '8-245-1290' },
  },
  pa: { sis: 92, dia: 54 },
  temp: 38.9,
  exploracion: {
    pesoKg: 82,
    tallaCm: 170,
    abdominalCm: 102,
    glasgow: 13,
    signosIngreso: { fc: 118, fr: 24, ta: '84/50', temp: 39.2, spo2: 93 },
    hallazgos: {
      cabeza_cuello: { inspeccion: ['anormal', 'Mucosas orales secas, piel caliente al tacto.'] },
      abdomen: {
        palpacion: ['anormal', 'Dolor a la palpación profunda en flanco derecho, sin irritación peritoneal.'],
        percusion: ['anormal', 'Puñopercusión positiva en fosa renal derecha.'],
      },
      neurologico: { inspeccion: ['anormal', 'Desorientado en tiempo, obedece órdenes simples. Glasgow 13 (O3 V4 M6).'] },
    },
  },
  antecedentes: [
    { tipo: 'habito', descripcion: 'Exfumador, 20 paquetes-año', parentesco: null, anio: 2015 },
    { tipo: 'quirurgico', descripcion: 'Colecistectomía laparoscópica', parentesco: null, anio: 2016 },
  ],
  resueltos: [{ cie10: 'J18.9', descripcion: 'Neumonía adquirida en la comunidad', fecha: '2022-08-09' }],
  hospitalizaciones: [
    {
      motivo: 'Neumonía adquirida en la comunidad',
      servicio: 'Medicina Interna',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: '2022-08-03',
      egreso: '2022-08-09',
      resumen: 'Egreso por mejoría con levofloxacino (alergia a penicilina).',
    },
  ],
  procedimientos: [
    {
      nombre: 'Colecistectomía laparoscópica',
      codigo: '51.23',
      fecha: '2016-05-12',
      descripcion: 'Colecistitis crónica litiásica.',
      resultado: 'Sin complicaciones; egreso a las 24 h.',
      cirujano: 'Dr. Ernesto Pinzón',
    },
  ],
  documentos: [
    { tipo: 'laboratorio', titulo: 'Biometría y química sanguínea de ingreso', descripcion: 'Leucocitos 18.5 ×10³/µL, creatinina 1.9 mg/dL, glucosa 248 mg/dL, procalcitonina 12.4 ng/mL.', horasAtras: 19, por: 'Laboratorio' },
    { tipo: 'laboratorio', titulo: 'Examen general de orina', descripcion: 'Leucocituria abundante, nitritos positivos, bacterias +++.', horasAtras: 19, por: 'Laboratorio' },
    { tipo: 'imagenologia', titulo: 'Radiografía de tórax AP', descripcion: 'Sin consolidaciones ni derrame pleural.', horasAtras: 18, por: 'Radiología' },
    { tipo: 'consentimiento', titulo: 'Consentimiento informado de ingreso a UCI — Batista Quintero', descripcion: 'Firmado por la esposa del paciente.', horasAtras: 20, por: 'Admisión' },
  ],
  notaIngreso: {
    motivo: 'Fiebre alta, confusión y dolor lumbar derecho de 3 días de evolución',
    padecimiento:
      'Masculino de 68 años, diabético e hipertenso, que inicia hace 3 días con disuria y dolor lumbar derecho, al que se agregan fiebre de hasta 39.5 °C y confusión en las últimas 24 h. Ingresa hipotenso (84/50 mmHg), taquicárdico y febril; responde parcialmente a cristaloides.',
    plan: [
      'Hemocultivos ×2 y urocultivo antes del antibiótico',
      'Ceftriaxona 2 g IV c/24 h (alergia a penicilina)',
      'Cristaloides 30 mL/kg y reevaluar perfusión',
      'Suspender metformina y enalapril',
      'Lactato y glucemia capilar c/4 h',
    ],
    pronostico: 'Reservado',
  },
  interrogatorio: {
    'Aparato Genitourinario': { marcados: ['Disuria', 'Dolor lumbar'], notas: 'Disuria de 4 días y orina turbia; dolor lumbar derecho continuo. Niega hematuria.' },
    'Sistema Neurológico': { marcados: ['Confusión'], notas: 'Confusión y somnolencia de 24 h, referidas por la esposa.' },
    'Aparato Respiratorio': { marcados: ['Disnea'], notas: 'Disnea leve en las últimas horas, sin tos ni expectoración.' },
  },
  indicaciones: {
    soluciones: [['Solución salina 0.9% 1000 ml', '250 ml/hr', 'Periférica']],
    dieta: ['Diabética 1800 kcal'],
    restriccion: null,
    cuidados: [
      'Signos vitales y glucemia capilar cada 4 horas',
      'Control estricto de diuresis horaria por sonda vesical',
      'Medios físicos para la fiebre',
      'Cabecera a 30 grados y vigilar estado de alerta',
    ],
    estudios: [
      ['Hemocultivos ×2', 'Laboratorio', 'Pendiente', 'warning'],
      ['Ecografía renal', 'Imagen', 'Prog. hoy', 'info'],
      ['Lactato sérico', 'Laboratorio', 'Realizado', 'success'],
      ['Examen de orina', 'Laboratorio', 'Realizado', 'success'],
    ],
    interconsulta: { servicio: 'Infectología', motivo: 'Ajuste de antibiótico por alergia a penicilina', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O3 V4 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Confuso',
    ventilacion: 'No (puntas nasales 3 L)',
    peep: '—',
    fio2: '32%',
    etco2: '—',
    gasometria: { ph: '7.31', pao2: '62', paco2: '30' },
    diuresis: '25 mL/h',
    balance: '+2100 mL',
    cristaloides: '3000 mL',
    hemoderivados: '—',
    laboratorios: [
      ['LEUCOCITOS', '18.5 ×10³/µL', true],
      ['LACTATO', '3.8 mmol/L', true],
      ['CREATININA', '1.9 mg/dL', true],
      ['GLUCOSA', '248 mg/dL', true],
      ['K+', '4.6 mEq/L', false],
      ['PCT', '12.4 ng/mL', true],
      ['HB', '12.8 g/dL', false],
      ['PLAQUETAS', '118,000', true],
    ],
    llenadoCapilar: '4 seg',
    vasoactivo: ['NORADRENALINA', 'Preparada (si PAM < 65)'],
  },
  notaCorrelativa: [
    'Sepsis de foco urinario en paciente con DM2 de larga evolución, con mayor riesgo de complicación local (pionefrosis, absceso renal). La hipotensión de ingreso obligó a suspender el enalapril; la metformina se retira por riesgo de acidosis láctica.',
    'La alergia a penicilina (urticaria) limita el esquema: se mantiene ceftriaxona con vigilancia y se pidió valoración por Infectología.',
  ].join('\n\n'),
  turno: { novedad: 'Sin mejoría a 18 h de antibiótico; SpO2 88 %, más confuso', pendiente: 'Ecografía renal y lactato de control', tono: 'warning' },
};

export const DEMO_0001: PacienteDemo = { delSeed: DEL_SEED['DEMO-0001'], inventado };
