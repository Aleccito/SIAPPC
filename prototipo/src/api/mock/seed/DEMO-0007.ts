// DEMO-0007 · Paloma Esquivel Núñez · 39 años · P3-01 · neumonía adquirida en la comunidad, en mejoría.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Casada',
    ocupacion: 'Maestra',
    escolaridad: 'Universitaria',
    religion: 'Católica',
    telefono: '555-0157',
    email: 'paloma.esquivel@ejemplo.com',
    direccion: 'Calle 74, San Francisco, casa 31',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0807',
    emergencia: { relacion: 'Esposo' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '8-701-3349' },
  },
  pa: { sis: 116, dia: 74 },
  temp: 37.4,
  exploracion: {
    pesoKg: 63,
    tallaCm: 160,
    abdominalCm: 78,
    glasgow: 15,
    signosIngreso: { fc: 104, fr: 26, ta: '112/70', temp: 38.8, spo2: 90 },
    hallazgos: {
      torax: {
        palpacion: ['anormal', 'Vibraciones vocales aumentadas en base derecha.'],
        percusion: ['anormal', 'Matidez en base derecha.'],
        auscultacion: ['anormal', 'Estertores crepitantes y soplo tubárico en base derecha.'],
      },
    },
  },
  notasSoap: [
    {
      horasAtras: 50,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Fiebre de 38.8 °C, tos con esputo herrumbroso y dolor al respirar en hemitórax derecho de 3 días.',
      o: 'FC 104 lpm, FR 26 rpm, SpO2 90 % al aire, T 38.8 °C. Estertores en base derecha.',
      a: 'Neumonía adquirida en la comunidad lobar derecha, CURB-65 de 1.',
      p: 'Amoxicilina/clavulánico 875/125 mg c/12 h. Paracetamol para la fiebre (alergia a ibuprofeno). O2 para SpO2 ≥ 94 %.',
    },
    {
      horasAtras: 26,
      autor: 'Dra. Ana Gómez',
      estado: 'firmada',
      s: 'Menos tos y sin fiebre desde anoche.',
      o: 'FC 92 lpm, SpO2 92 % al aire, T 37.6 °C.',
      a: 'NAC en mejoría clínica.',
      p: 'Continuar antibiótico. Retirar oxígeno según tolerancia. Deambulación.',
    },
    {
      horasAtras: 4,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Se siente mejor; dolor pleurítico leve.',
      o: 'FC 88 lpm, FR 19 rpm, SpO2 93 % al aire, T 37.4 °C. Leucocitos 9.8 ×10³/µL.',
      a: 'Buena respuesta a las 48 h de antibiótico.',
      p: 'Antibiótico por vía oral completa. Valorar alta en 24–48 h.',
    },
  ],
  antecedentes: [
    { tipo: 'familiar', descripcion: 'Asma', parentesco: 'Madre', anio: null },
    { tipo: 'ginecoobstetrico', descripcion: 'G1 P1; ciclos regulares', parentesco: null, anio: 2015 },
  ],
  resueltos: [],
  hospitalizaciones: [
    {
      motivo: 'Parto eutócico',
      servicio: 'Obstetricia',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: '2015-07-18',
      egreso: '2015-07-20',
      resumen: 'Recién nacido sano; sin complicaciones.',
    },
  ],
  procedimientos: [],
  documentos: [
    { tipo: 'imagenologia', titulo: 'Radiografía de tórax PA', descripcion: 'Consolidación en lóbulo inferior derecho con broncograma aéreo.', horasAtras: 51, por: 'Radiología' },
    { tipo: 'laboratorio', titulo: 'Biometría y PCR de ingreso', descripcion: 'Leucocitos 15.2 ×10³/µL; PCR 142 mg/L.', horasAtras: 51, por: 'Laboratorio' },
    { tipo: 'laboratorio', titulo: 'Biometría de control', descripcion: 'Leucocitos 9.8 ×10³/µL; PCR 48 mg/L.', horasAtras: 4, por: 'Laboratorio' },
  ],
  notaIngreso: {
    motivo: 'Fiebre y tos con dolor al respirar',
    padecimiento:
      'Femenina de 39 años con asma leve en la infancia, que presenta fiebre de 3 días, tos con esputo herrumbroso y dolor pleurítico derecho. Ingresa con SpO2 90 % al aire y consolidación basal derecha en la radiografía.',
    plan: [
      'Amoxicilina/clavulánico 875/125 mg VO c/12 h',
      'Paracetamol 500 mg c/8 h (alergia a ibuprofeno)',
      'Oxígeno para SpO2 ≥ 94 %',
      'Hemocultivos y antígenos urinarios',
      'Biometría de control en 48 h',
    ],
    pronostico: 'Bueno',
  },
  interrogatorio: {
    'Aparato Respiratorio': { marcados: ['Tos', 'Expectoración', 'Dolor torácico'], notas: 'Tos con esputo herrumbroso y dolor al respirar en hemitórax derecho; mejoría en las últimas 24 h.' },
  },
  indicaciones: {
    soluciones: [['Solución salina 0.9% 1000ml', 'Para mantener vena', 'Periférica']],
    dieta: ['Normal'],
    restriccion: null,
    cuidados: ['Signos vitales cada 6 horas', 'Deambulación asistida', 'Incentivo respiratorio cada hora despierta'],
    estudios: [
      ['Biometría de control', 'Laboratorio', 'Realizado', 'success'],
      ['Antígenos urinarios', 'Laboratorio', 'Pendiente', 'warning'],
      ['Rx Tórax de control', 'Imagen', 'Prog. mañana', 'info'],
    ],
    interconsulta: null,
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Alerta, orientada',
    ventilacion: 'No (aire ambiente)',
    peep: '—',
    fio2: '21%',
    etco2: '—',
    gasometria: { ph: '7.43', pao2: '70', paco2: '36' },
    diuresis: '70 mL/h',
    balance: '+200 mL',
    cristaloides: '1000 mL',
    hemoderivados: '—',
    laboratorios: [
      ['LEUCOCITOS', '9.8 ×10³/µL', false],
      ['PCR', '48 mg/L', true],
      ['HB', '12.9 g/dL', false],
      ['K+', '4.0 mEq/L', false],
      ['GLUCOSA', '96 mg/dL', false],
      ['CREATININA', '0.7 mg/dL', false],
      ['PCT', '0.4 ng/mL', false],
      ['PLAQUETAS', '310,000', false],
    ],
    llenadoCapilar: '2 seg',
    vasoactivo: ['VASOPRESOR', 'Sin vasopresor'],
  },
  notaCorrelativa: [
    'Neumonía lobar derecha con buena respuesta clínica y de laboratorio a las 48 h de amoxicilina/clavulánico.',
    'El antecedente de asma no ha dado broncoespasmo. Alergia a ibuprofeno: analgesia con paracetamol.',
  ].join('\n\n'),
  turno: { novedad: 'Afebril 24 h; SpO2 93 % al aire', pendiente: 'Valorar alta en 24–48 h', tono: 'success' },
};

export const DEMO_0007: PacienteDemo = { delSeed: DEL_SEED['DEMO-0007'], inventado };
