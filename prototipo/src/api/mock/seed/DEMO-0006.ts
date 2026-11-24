// DEMO-0006 · Teodoro Lasso Mejía · 60 años · UCI-05 · taquicardia paroxística con opresión torácica.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Casado',
    ocupacion: 'Bodeguero',
    escolaridad: 'Secundaria',
    religion: 'Católica',
    telefono: '555-0156',
    email: 'teodoro.lasso@ejemplo.com',
    direccion: 'Av. Ricardo J. Alfaro, Edif. Altos 2, apto 9',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0819',
    emergencia: { relacion: 'Esposa' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '8-312-5567' },
  },
  pa: { sis: 108, dia: 70 },
  temp: 36.7,
  // Llegó hace 6 h: la exploración física todavía está pendiente.
  exploracion: null,
  notasSoap: [
    {
      horasAtras: 5.5,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Palpitaciones de inicio brusco durante esfuerzo, con opresión torácica y sudoración fría; 2 h de evolución.',
      o: 'FC 150 lpm regular, PA 112/72 mmHg, SpO2 95 %. ECG: taquicardia regular de QRS estrecho sin ondas P visibles.',
      a: 'Taquicardia supraventricular paroxística probable; descartar flutter 2:1 y síndrome coronario agudo (antecedente familiar).',
      p: 'Maniobras vagales; adenosina 6 mg IV en bolo rápido si persiste, con registro de ECG. Troponinas seriadas y electrolitos.',
    },
    {
      horasAtras: 1.5,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Persisten las palpitaciones; opresión leve.',
      o: 'FC 150 lpm sin cambios tras maniobras vagales y adenosina 6 y 12 mg (bloqueo transitorio); PA 108/70 mmHg.',
      a: 'Probable flutter auricular 2:1, desenmascarado con adenosina.',
      p: 'Control de frecuencia con diltiazem IV (suspender amlodipino). Cardioversión eléctrica si hay inestabilidad. Ecocardiograma. Anticoagulación según CHA2DS2-VASc.',
    },
  ],
  antecedentes: [{ tipo: 'habito', descripcion: 'Exfumador, 15 paquetes-año', parentesco: null, anio: 2018 }],
  resueltos: [],
  hospitalizaciones: [],
  procedimientos: [],
  documentos: [
    { tipo: 'otro', titulo: 'Electrocardiograma de 12 derivaciones', descripcion: 'Taquicardia regular de QRS estrecho a 150 lpm.', horasAtras: 5.5, por: 'Urgencias' },
    { tipo: 'laboratorio', titulo: 'Troponina I (0 h)', descripcion: '0.03 ng/mL (normal).', horasAtras: 5, por: 'Laboratorio' },
    { tipo: 'otro', titulo: 'Tira de ritmo con adenosina', descripcion: 'Ondas F de flutter visibles durante el bloqueo transitorio.', horasAtras: 2, por: 'UCI' },
  ],
  notaIngreso: {
    motivo: 'Palpitaciones y opresión en el pecho',
    padecimiento:
      'Masculino de 60 años, hipertenso y dislipidémico, con padre fallecido por infarto a los 52 años, que inicia de forma brusca palpitaciones, opresión torácica y sudoración fría mientras cargaba cajas. A su llegada, FC 150 lpm regular y PA 112/72 mmHg.',
    plan: [
      'ECG de 12 derivaciones y monitoreo continuo',
      'Maniobras vagales y adenosina si persiste',
      'Troponinas seriadas a las 0 y 3 h',
      'Electrolitos y TSH',
      'Ecocardiograma',
    ],
    pronostico: 'Reservado',
  },
  interrogatorio: {
    'Aparato Cardiovascular': { marcados: ['Dolor precordial', 'Palpitaciones'], notas: 'Palpitaciones rápidas y regulares de inicio súbito; opresión precordial leve, sin irradiación.' },
    'Piel y Anexos': { marcados: ['Cambios de coloración'], notas: 'Palidez y sudoración fría al inicio del cuadro.' },
  },
  indicaciones: {
    soluciones: [['Solución salina 0.9% 500 ml', '42 ml/hr', 'Periférica']],
    dieta: ['Ayuno hasta definir cardioversión'],
    restriccion: null,
    cuidados: [
      'ECG continuo y tira de ritmo con cada fármaco',
      'Desfibrilador a la cabecera',
      'Reposo en cama',
      'Avisar si hay dolor torácico o PA < 90/60',
    ],
    estudios: [
      ['Troponina 3 h', 'Laboratorio', 'Pendiente', 'warning'],
      ['Ecocardiograma', 'Imagen', 'Prog. hoy', 'info'],
      ['TSH', 'Laboratorio', 'Pendiente', 'warning'],
      ['Electrolitos', 'Laboratorio', 'Realizado', 'success'],
    ],
    interconsulta: { servicio: 'Cardiología', motivo: 'Valorar cardioversión y anticoagulación', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Alerta, ansioso',
    ventilacion: 'No (aire ambiente)',
    peep: '—',
    fio2: '21%',
    etco2: '—',
    gasometria: { ph: '7.41', pao2: '82', paco2: '36' },
    diuresis: '60 mL/h',
    balance: '+400 mL',
    cristaloides: '500 mL',
    hemoderivados: '—',
    laboratorios: [
      ['TROPONINA I', '0.03 ng/mL', false],
      ['K+', '3.4 mEq/L', true],
      ['MG', '1.8 mg/dL', false],
      ['TSH', 'Pendiente', false],
      ['GLUCOSA', '118 mg/dL', false],
      ['CREATININA', '0.9 mg/dL', false],
      ['HB', '14.6 g/dL', false],
      ['LDL', '142 mg/dL', true],
    ],
    llenadoCapilar: '2 seg',
    vasoactivo: ['ANTIARRÍTMICO', 'Diltiazem en valoración'],
  },
  notaCorrelativa: [
    'Taquicardia regular de QRS estrecho a 150 lpm: la respuesta a la adenosina orienta a flutter auricular 2:1. La opresión torácica y el antecedente familiar obligan a descartar isquemia con troponinas seriadas.',
    'Si se inicia diltiazem, suspender el amlodipino (dos calcioantagonistas).',
  ].join('\n\n'),
  turno: { novedad: 'FC 150 tras adenosina; probable flutter 2:1', pendiente: 'Troponina de 3 h y decidir cardioversión', tono: 'danger' },
};

export const DEMO_0006: PacienteDemo = { delSeed: DEL_SEED['DEMO-0006'], inventado };
