// DEMO-0008 · Cristian Barrios Tello · 47 años · P3-02 · pancreatitis aguda.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Unión libre',
    ocupacion: 'Mecánico',
    escolaridad: 'Secundaria',
    religion: 'Ninguna',
    telefono: '555-0158',
    email: 'cristian.barrios@ejemplo.com',
    direccion: 'Calle Principal, Pedregal, casa 18',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0820',
    emergencia: { relacion: 'Pareja' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '8-455-9021' },
  },
  pa: { sis: 128, dia: 80 },
  temp: 37.8,
  exploracion: {
    pesoKg: 88,
    tallaCm: 175,
    abdominalCm: 104,
    glasgow: 15,
    signosIngreso: { fc: 112, fr: 22, ta: '134/82', temp: 38.0, spo2: 95 },
    hallazgos: {
      cabeza_cuello: { inspeccion: ['anormal', 'Mucosas orales secas.'] },
      abdomen: {
        inspeccion: ['anormal', 'Abdomen distendido, sin equimosis periumbilical ni en flancos.'],
        palpacion: ['anormal', 'Dolor intenso en epigastrio irradiado en cinturón; defensa voluntaria.'],
        auscultacion: ['anormal', 'Peristalsis disminuida.'],
      },
    },
  },
  antecedentes: [
    { tipo: 'habito', descripcion: 'Tabaquismo, 10 cigarrillos al día', parentesco: null, anio: null },
    { tipo: 'familiar', descripcion: 'Cirrosis hepática', parentesco: 'Padre', anio: null },
  ],
  resueltos: [{ cie10: 'K35.8', descripcion: 'Apendicitis aguda', fecha: '2001-09-17' }],
  hospitalizaciones: [
    {
      motivo: 'Apendicitis aguda — apendicectomía',
      servicio: 'Cirugía General',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: '2001-09-14',
      egreso: '2001-09-17',
      resumen: 'Sin complicaciones.',
    },
  ],
  procedimientos: [
    {
      nombre: 'Apendicectomía abierta',
      codigo: '47.09',
      fecha: '2001-09-14',
      descripcion: 'Apendicitis aguda fase II.',
      resultado: 'Sin complicaciones.',
      cirujano: 'Dr. Rubén Saldaña',
    },
  ],
  documentos: [
    { tipo: 'laboratorio', titulo: 'Lipasa, enzimas hepáticas y triglicéridos', descripcion: 'Lipasa 1 840 U/L; triglicéridos 210 mg/dL; GGT 312 U/L.', horasAtras: 39, por: 'Laboratorio' },
    { tipo: 'imagenologia', titulo: 'Ecografía abdominal', descripcion: 'Páncreas edematoso; sin litiasis vesicular.', horasAtras: 36, por: 'Radiología' },
    { tipo: 'laboratorio', titulo: 'Química sanguínea de control', descripcion: 'BUN 18 mg/dL, creatinina 0.9 mg/dL, calcio 8.4 mg/dL.', horasAtras: 6, por: 'Laboratorio' },
  ],
  notaIngreso: {
    motivo: 'Dolor abdominal intenso con vómitos',
    padecimiento:
      'Masculino de 47 años con consumo frecuente de alcohol, que presenta dolor epigástrico intenso irradiado en cinturón, náuseas y vómitos de 12 h, tras ingesta abundante de alcohol. Lipasa 12 veces el valor normal; ecografía sin litiasis.',
    plan: [
      'Ayuno y Hartmann 125 mL/h',
      'Tramadol 50 mg IV c/8 h',
      'Omeprazol 40 mg IV c/24 h',
      'Tiamina 100 mg IV y escala CIWA-Ar',
      'BUN y hematocrito a las 24 h',
    ],
    pronostico: 'Bueno',
  },
  interrogatorio: {
    'Aparato Digestivo': { marcados: ['Náuseas', 'Vómito', 'Dolor abdominal'], notas: 'Dolor epigástrico en cinturón 8/10 al ingreso; vómitos de contenido gástrico.' },
  },
  indicaciones: {
    soluciones: [],
    dieta: ['Líquidos claros'],
    restriccion: null,
    cuidados: ['Escala CIWA-Ar cada 4 horas', 'Control del dolor con escala numérica', 'Balance hídrico estricto', 'Glucemia capilar cada 6 horas'],
    estudios: [
      ['TC de abdomen', 'Imagen', 'Prog. 72 h', 'info'],
      ['BUN y hematocrito', 'Laboratorio', 'Realizado', 'success'],
      ['Triglicéridos', 'Laboratorio', 'Realizado', 'success'],
      ['Calcio sérico', 'Laboratorio', 'Pendiente', 'warning'],
    ],
    interconsulta: { servicio: 'Salud Mental', motivo: 'Programa de consumo de alcohol', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Alerta, tembloroso',
    ventilacion: 'No (aire ambiente)',
    peep: '—',
    fio2: '21%',
    etco2: '—',
    gasometria: { ph: '7.38', pao2: '80', paco2: '34' },
    diuresis: '80 mL/h',
    balance: '+1800 mL',
    cristaloides: '3000 mL',
    hemoderivados: '—',
    laboratorios: [
      ['LIPASA', '1 840 U/L', true],
      ['HTO', '44%', false],
      ['BUN', '18 mg/dL', false],
      ['CALCIO', '8.4 mg/dL', true],
      ['GLUCOSA', '142 mg/dL', true],
      ['CREATININA', '0.9 mg/dL', false],
      ['TRIGLICÉRIDOS', '210 mg/dL', true],
      ['GGT', '312 U/L', true],
    ],
    llenadoCapilar: '2 seg',
    vasoactivo: ['VASOPRESOR', 'Sin vasopresor'],
  },
  notaCorrelativa: [
    'Pancreatitis aguda alcohólica sin falla orgánica (BISAP 1). La hidratación temprana es la medida principal: vigilar BUN y hematocrito.',
    'Riesgo de síndrome de abstinencia: tiamina antes de cualquier glucosa y escala CIWA-Ar.',
  ].join('\n\n'),
  turno: { novedad: 'Dolor 5/10; tolera líquidos', pendiente: 'Vigilar abstinencia (CIWA-Ar)', tono: 'success' },
};

export const DEMO_0008: PacienteDemo = { delSeed: DEL_SEED['DEMO-0008'], inventado };
