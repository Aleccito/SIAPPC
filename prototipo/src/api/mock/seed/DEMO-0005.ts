// DEMO-0005 · Yamileth Orozco Arce · 81 años · UCI-04 · bradicardia con digoxina, fibrilación auricular crónica.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Viuda',
    ocupacion: 'Ama de casa',
    escolaridad: 'Primaria',
    religion: 'Católica',
    telefono: '555-0155',
    email: 'yamileth.orozco@ejemplo.com',
    direccion: 'Calle 3.ª, Parque Lefevre, casa 20',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0824',
    emergencia: { relacion: 'Hija' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '3-051-0942' },
  },
  pa: { sis: 96, dia: 58 },
  temp: 36.4,
  exploracion: {
    pesoKg: 58,
    tallaCm: 152,
    abdominalCm: 84,
    glasgow: 15,
    signosIngreso: { fc: 41, fr: 16, ta: '100/60', temp: 36.5, spo2: 94 },
    hallazgos: {
      cabeza_cuello: { inspeccion: ['anormal', 'Palidez de tegumentos; ingurgitación yugular grado I.'] },
      torax: { auscultacion: ['anormal', 'Ruidos cardiacos arrítmicos y bradicárdicos; crepitantes finos bibasales.'] },
      extremidades_inferiores: { inspeccion: ['anormal', 'Edema con fóvea + en ambos tobillos.'] },
      neurologico: { inspeccion: ['anormal', 'Orientada; refiere ver halos amarillentos.'] },
    },
  },
  notasSoap: [
    {
      horasAtras: 8,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Mareo, debilidad y casi desmayo al levantarse; náuseas y visión de halos amarillos.',
      o: 'FC 41 lpm, FA con respuesta ventricular lenta; PA 100/60 mmHg; SpO2 94 %.',
      a: 'Bradicardia sintomática por probable intoxicación digitálica, potenciada por bisoprolol, en FA crónica.',
      p: 'Suspender digoxina y bisoprolol. Digoxinemia, potasio, magnesio, creatinina e INR. Atropina si se inestabiliza; marcapasos transcutáneo a la cabecera.',
    },
    {
      horasAtras: 1,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Persiste el mareo; más somnolienta.',
      o: 'FC 35 lpm, PA 96/58 mmHg, SpO2 92 %. Digoxinemia 3.1 ng/mL; K+ 5.6 mEq/L; INR 3.8.',
      a: 'Intoxicación digitálica con hiperpotasemia y anticoagulación excesiva.',
      p: 'Anticuerpos antidigoxina (Fab) si empeora. Corregir potasio sin calcio. Suspender warfarina; vitamina K oral. Evitar AINEs (alergia).',
    },
  ],
  antecedentes: [
    { tipo: 'personal', descripcion: 'Enfermedad renal crónica estadio 3a', parentesco: null, anio: 2020 },
    { tipo: 'ginecoobstetrico', descripcion: 'G4 P4; menopausia a los 49 años', parentesco: null, anio: 1992 },
  ],
  resueltos: [{ cie10: 'S52.5', descripcion: 'Fractura de radio distal izquierdo', fecha: '2018-06-01' }],
  hospitalizaciones: [
    {
      motivo: 'Insuficiencia cardíaca descompensada',
      servicio: 'Cardiología',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: '2023-11-02',
      egreso: '2023-11-10',
      resumen: 'Egreso con furosemida y ajuste de bisoprolol.',
    },
  ],
  procedimientos: [
    {
      nombre: 'Reducción cerrada de fractura de radio distal izquierdo',
      codigo: '79.02',
      fecha: '2018-04-20',
      descripcion: 'Caída desde su altura.',
      resultado: 'Consolidó sin secuelas.',
      cirujano: 'Dra. Marta Ibarra',
    },
  ],
  documentos: [
    { tipo: 'laboratorio', titulo: 'Digoxinemia y electrolitos', descripcion: 'Digoxina 3.1 ng/mL; K+ 5.6 mEq/L; Mg 1.9 mg/dL; creatinina 1.6 mg/dL.', horasAtras: 1.5, por: 'Laboratorio' },
    { tipo: 'otro', titulo: 'Electrocardiograma de 12 derivaciones', descripcion: 'FA con respuesta ventricular lenta (38 lpm) y cubeta digitálica.', horasAtras: 8, por: 'Urgencias' },
    { tipo: 'laboratorio', titulo: 'Tiempos de coagulación', descripcion: 'INR 3.8.', horasAtras: 7, por: 'Laboratorio' },
    { tipo: 'consentimiento', titulo: 'Consentimiento para marcapasos transitorio', descripcion: 'Firmado por la hija de la paciente.', horasAtras: 2, por: 'Cardiología' },
  ],
  notaIngreso: {
    motivo: 'Mareo, debilidad y casi desmayo',
    padecimiento:
      'Femenina de 81 años con fibrilación auricular crónica e insuficiencia cardíaca, en tratamiento con digoxina, bisoprolol, furosemida y warfarina, que presenta mareo, debilidad y casi síncope de 1 día, con náuseas y visión de halos amarillos. A su llegada, FC 41 lpm.',
    plan: [
      'Suspender digoxina y bisoprolol',
      'Digoxinemia, electrolitos, función renal e INR',
      'Atropina 0.5 mg IV si hay inestabilidad',
      'Marcapasos transcutáneo a la cabecera',
      'Evitar AINEs (alergia: broncoespasmo)',
    ],
    pronostico: 'Reservado',
  },
  interrogatorio: {
    'Sistema Neurológico': { marcados: ['Mareo'], notas: 'Mareo al ponerse de pie y casi desmayo; visión con halos amarillentos.' },
    'Aparato Cardiovascular': { marcados: ['Edema', 'Síncope'], notas: 'Casi síncope al incorporarse; edema leve de tobillos.' },
    'Aparato Digestivo': { marcados: ['Náuseas'], notas: 'Náuseas desde ayer, sin vómito.' },
  },
  indicaciones: {
    soluciones: [['Solución salina 0.9% 250 ml', '20 ml/hr', 'Periférica']],
    dieta: ['Blanda hiposódica'],
    restriccion: 'Restricción de líquidos: 1200 ml/día',
    cuidados: [
      'ECG continuo; marcapasos transcutáneo a la cabecera',
      'Levantarse solo con ayuda (riesgo de caída)',
      'Control de diuresis y peso diario',
      'Vigilar sangrado (INR elevado)',
    ],
    estudios: [
      ['Digoxinemia', 'Laboratorio', 'Realizado', 'success'],
      ['Electrolitos y Mg', 'Laboratorio', 'Realizado', 'success'],
      ['Ecocardiograma', 'Imagen', 'Prog. mañana', 'info'],
      ['INR de control', 'Laboratorio', 'Pendiente', 'warning'],
    ],
    interconsulta: { servicio: 'Cardiología', motivo: 'Valorar marcapasos y anticuerpos antidigoxina', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Somnolienta',
    ventilacion: 'No (aire ambiente)',
    peep: '—',
    fio2: '21%',
    etco2: '—',
    gasometria: { ph: '7.36', pao2: '68', paco2: '38' },
    diuresis: '30 mL/h',
    balance: '+250 mL',
    cristaloides: '500 mL',
    hemoderivados: '—',
    laboratorios: [
      ['DIGOXINA', '3.1 ng/mL', true],
      ['K+', '5.6 mEq/L', true],
      ['MG', '1.9 mg/dL', false],
      ['CREATININA', '1.6 mg/dL', true],
      ['INR', '3.8', true],
      ['HB', '11.4 g/dL', true],
      ['GLUCOSA', '104 mg/dL', false],
      ['BNP', '890 pg/mL', true],
    ],
    llenadoCapilar: '3 seg',
    vasoactivo: ['ATROPINA', 'Preparada (si hay inestabilidad)'],
  },
  notaCorrelativa: [
    'Bradicardia por intoxicación digitálica, favorecida por la enfermedad renal crónica, la edad y el bisoprolol. La hiperpotasemia es un marcador de gravedad.',
    'La warfarina con INR 3.8 aumenta el riesgo de sangrado si hace falta un marcapasos transvenoso. Alergia a AINEs: analgesia con paracetamol.',
  ].join('\n\n'),
  turno: { novedad: 'FC 35; digoxinemia 3.1 ng/mL', pendiente: 'Decidir Fab antidigoxina o marcapasos', tono: 'danger' },
};

export const DEMO_0005: PacienteDemo = { delSeed: DEL_SEED['DEMO-0005'], inventado };
