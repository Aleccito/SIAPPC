// DEMO-0003 · Anselmo Ruiz Cardoza · 72 años · UCI-03 · EPOC reagudizada.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Viudo',
    ocupacion: 'Agricultor retirado',
    escolaridad: 'Primaria',
    religion: 'Católica',
    telefono: '555-0153',
    email: 'anselmo.ruiz@ejemplo.com',
    direccion: 'Barriada San José, casa 45',
    ciudad: 'La Chorrera',
    provincia: 'Panamá Oeste',
    codigoPostal: '1001',
    emergencia: { relacion: 'Hijo' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '9-073-1184' },
  },
  pa: { sis: 148, dia: 86 },
  temp: 37.9,
  exploracion: {
    pesoKg: 61,
    tallaCm: 168,
    abdominalCm: 88,
    glasgow: 15,
    signosIngreso: { fc: 104, fr: 26, ta: '152/88', temp: 38.1, spo2: 86 },
    hallazgos: {
      torax: {
        inspeccion: ['anormal', 'Tórax en tonel; uso de músculos accesorios y respiración con labios fruncidos.'],
        percusion: ['anormal', 'Hiperresonancia generalizada.'],
        auscultacion: ['anormal', 'Murmullo vesicular disminuido global, sibilancias espiratorias difusas y roncus bilaterales.'],
      },
      extremidades_superiores: { inspeccion: ['anormal', 'Acropaquias y cianosis distal leve.'] },
    },
  },
  antecedentes: [
    { tipo: 'personal', descripcion: 'Cor pulmonale crónico', parentesco: null, anio: 2021 },
    { tipo: 'habito', descripcion: 'Exposición a humo de leña en la infancia', parentesco: null, anio: null },
    { tipo: 'familiar', descripcion: 'EPOC', parentesco: 'Padre', anio: null },
  ],
  resueltos: [{ cie10: 'J18.9', descripcion: 'Neumonía adquirida en la comunidad', fecha: '2023-02-11' }],
  hospitalizaciones: [
    {
      motivo: 'Exacerbación de EPOC',
      servicio: 'Neumología',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: '2024-06-10',
      egreso: '2024-06-17',
      resumen: 'Egreso con oxígeno domiciliario a 2 L/min y tiotropio.',
    },
    {
      motivo: 'Neumonía adquirida en la comunidad',
      servicio: 'Medicina Interna',
      establecimiento: 'Hospital Nicolás A. Solano',
      ingreso: '2023-02-04',
      egreso: '2023-02-11',
      resumen: 'Egreso por mejoría tras 7 días de antibiótico.',
    },
  ],
  procedimientos: [],
  documentos: [
    { tipo: 'laboratorio', titulo: 'Gasometría arterial de control', descripcion: 'pH 7.30, PaCO2 62 mmHg, PaO2 54 mmHg, HCO3 30 mEq/L.', horasAtras: 3, por: 'Laboratorio' },
    { tipo: 'imagenologia', titulo: 'Radiografía de tórax PA', descripcion: 'Hiperinsuflación y aplanamiento diafragmático; sin consolidación.', horasAtras: 28, por: 'Radiología' },
    { tipo: 'laboratorio', titulo: 'Cultivo de esputo', descripcion: 'En proceso.', horasAtras: 27, por: 'Laboratorio' },
    { tipo: 'otro', titulo: 'Espirometría (junio 2024)', descripcion: 'VEF1 38 % del predicho, VEF1/CVF 0.51 (GOLD 3).', horasAtras: 3500, por: 'Neumología' },
  ],
  notaIngreso: {
    motivo: 'Tos con expectoración purulenta y dificultad para respirar',
    padecimiento:
      'Masculino de 72 años con EPOC GOLD 3 y oxígeno domiciliario, tabaquismo de 40 paquetes-año, que acude por 4 días de aumento de disnea y de expectoración purulenta, con fiebre de 38.1 °C. Ingresa con SpO2 86 % con su oxígeno habitual y sibilancias difusas.',
    plan: [
      'Salbutamol e ipratropio nebulizados c/4 h',
      'Prednisona 40 mg VO c/24 h por 5 días',
      'Oxígeno para SpO2 88–92 % (no más)',
      'Gasometría arterial y radiografía de tórax',
      'Antibiótico sin sulfonamidas (alergia)',
    ],
    pronostico: 'Reservado',
  },
  interrogatorio: {
    'Aparato Respiratorio': { marcados: ['Disnea', 'Tos', 'Expectoración', 'Sibilancias'], notas: 'Disnea de pequeños esfuerzos, tos con esputo verdoso abundante y sibilancias.' },
    'Aparato Cardiovascular': { marcados: ['Edema'], notas: 'Edema leve maleolar bilateral.' },
  },
  indicaciones: {
    soluciones: [['Solución glucosada 5% 500 ml', '42 ml/hr', 'Periférica']],
    dieta: ['Blanda hiposódica'],
    restriccion: null,
    cuidados: [
      'Oxígeno con Venturi para SpO2 88–92 %',
      'Nebulizaciones cada 4 horas',
      'Fisioterapia respiratoria y drenaje de secreciones',
      'Vigilar somnolencia (retención de CO2)',
    ],
    estudios: [
      ['Gasometría arterial', 'Laboratorio', 'Realizado', 'success'],
      ['Cultivo de esputo', 'Laboratorio', 'Pendiente', 'warning'],
      ['Rx Tórax', 'Imagen', 'Realizado', 'success'],
      ['Ecocardiograma', 'Imagen', 'Prog. mañana', 'info'],
    ],
    interconsulta: { servicio: 'Neumología', motivo: 'Ajuste de ventilación no invasiva', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O3 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Somnoliento',
    ventilacion: 'VNI (BiPAP)',
    peep: 'EPAP 5 cmH2O',
    fio2: '28%',
    etco2: '58 mmHg',
    gasometria: { ph: '7.30', pao2: '54', paco2: '62' },
    diuresis: '55 mL/h',
    balance: '+300 mL',
    cristaloides: '500 mL',
    hemoderivados: '—',
    laboratorios: [
      ['LEUCOCITOS', '14.2 ×10³/µL', true],
      ['PCR', '86 mg/L', true],
      ['HCO3', '30 mEq/L', true],
      ['HB', '15.9 g/dL', false],
      ['K+', '3.6 mEq/L', false],
      ['GLUCOSA', '176 mg/dL', true],
      ['CREATININA', '1.0 mg/dL', false],
      ['PLAQUETAS', '265,000', false],
    ],
    llenadoCapilar: '3 seg',
    vasoactivo: ['VASOPRESOR', 'Sin vasopresor'],
  },
  notaCorrelativa: [
    'Exacerbación infecciosa de EPOC grave con insuficiencia respiratoria hipercápnica; el cor pulmonale crónico limita la tolerancia a la sobrecarga de volumen.',
    'La prednisona eleva la glucosa: vigilar glucemias. La alergia a sulfonamidas excluye trimetoprim/sulfametoxazol como antibiótico.',
  ].join('\n\n'),
  turno: { novedad: 'Acidosis respiratoria (pH 7.30); inicia BiPAP', pendiente: 'Gasometría de control en 1 h', tono: 'danger' },
};

export const DEMO_0003: PacienteDemo = { delSeed: DEL_SEED['DEMO-0003'], inventado };
