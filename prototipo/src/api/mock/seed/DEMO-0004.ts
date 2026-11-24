// DEMO-0004 · Darío Vallejo Pinto · 30 años · TR-01 · politraumatismo en motocicleta.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Soltero',
    ocupacion: 'Mensajero',
    escolaridad: 'Secundaria',
    religion: 'Ninguna',
    telefono: '555-0154',
    email: 'dario.vallejo@ejemplo.com',
    direccion: 'Calle 12, San Miguelito, casa 7',
    ciudad: 'San Miguelito',
    provincia: 'Panamá',
    codigoPostal: '0819',
    emergencia: { relacion: 'Madre' },
    seguro: { tipo: 'Sin seguro (pago directo)', poliza: '—' },
  },
  pa: { sis: 88, dia: 56 },
  temp: 36.2,
  // Llegó hace 3 h: la exploración física todavía está pendiente.
  exploracion: null,
  notasSoap: [
    {
      horasAtras: 2.5,
      autor: 'Dr. Carlos Méndez',
      estado: 'borrador',
      s: 'Motociclista con casco, impacto lateral a velocidad moderada. Refiere dolor abdominal difuso y en muslo izquierdo.',
      o: 'FC 138 lpm, PA 92/58 mmHg, FR 24 rpm, SpO2 94 %. Deformidad de muslo izquierdo; abdomen doloroso con defensa en hipocondrio izquierdo. FAST positivo en espacio esplenorrenal.',
      a: 'Politraumatismo con choque hemorrágico clase II–III; probable lesión esplénica. Fractura cerrada de fémur izquierdo.',
      p: 'Ácido tranexámico 1 g IV (administrado). Transfusión de concentrados eritrocitarios. TC de abdomen si estabiliza; valoración por Cirugía General y Ortopedia. Material libre de látex.',
    },
  ],
  antecedentes: [{ tipo: 'habito', descripcion: 'Consumo ocasional de alcohol', parentesco: null, anio: null }],
  resueltos: [],
  hospitalizaciones: [],
  procedimientos: [],
  documentos: [
    { tipo: 'imagenologia', titulo: 'FAST abdominal', descripcion: 'Líquido libre en espacio esplenorrenal.', horasAtras: 2.8, por: 'Urgencias' },
    { tipo: 'imagenologia', titulo: 'Radiografía de fémur izquierdo', descripcion: 'Fractura diafisaria transversa desplazada.', horasAtras: 2.6, por: 'Radiología' },
    { tipo: 'laboratorio', titulo: 'Biometría y pruebas cruzadas', descripcion: 'Hb 9.8 g/dL. Grupo O-; 4 unidades cruzadas.', horasAtras: 2.7, por: 'Banco de sangre' },
    { tipo: 'consentimiento', titulo: 'Consentimiento de transfusión', descripcion: 'Firmado por la madre del paciente.', horasAtras: 2.5, por: 'Urgencias' },
  ],
  notaIngreso: {
    motivo: 'Accidente de motocicleta, dolor abdominal y deformidad de muslo',
    padecimiento:
      'Masculino de 30 años, motociclista, traído por ambulancia tras colisión lateral hace 3 h. Ingresa taquicárdico (FC 138 lpm) e hipotenso (92/58 mmHg), con dolor abdominal y deformidad del muslo izquierdo. FAST positivo.',
    plan: [
      'ABCDE y dos accesos venosos de grueso calibre',
      'Ácido tranexámico 1 g IV (administrado)',
      'Concentrados eritrocitarios O-',
      'Férula en miembro inferior izquierdo',
      'Material libre de látex (alergia)',
    ],
    pronostico: 'Grave',
  },
  interrogatorio: {
    'Aparato Digestivo': { marcados: ['Dolor abdominal'], notas: 'Dolor abdominal difuso, de predominio en hipocondrio izquierdo.' },
    'Sistema Músculo-esquelético': { marcados: ['Dolor', 'Deformidad'], notas: 'Dolor intenso y deformidad en muslo izquierdo; no puede apoyar.' },
  },
  indicaciones: {
    soluciones: [['Solución Hartmann 1000ml', 'Bolo 500 ml', 'Periférica']],
    dieta: ['Ayuno'],
    restriccion: null,
    cuidados: [
      'Material libre de látex (alergia)',
      'Monitoreo continuo y PA cada 5 minutos',
      'Férula en miembro inferior izquierdo',
      'Quirófano y sangre en reserva',
    ],
    estudios: [
      ['TC de abdomen', 'Imagen', 'Pendiente', 'warning'],
      ['Pruebas cruzadas', 'Laboratorio', 'Realizado', 'success'],
      ['Rx de pelvis', 'Imagen', 'Realizado', 'success'],
      ['Lactato', 'Laboratorio', 'Pendiente', 'warning'],
    ],
    interconsulta: { servicio: 'Cirugía General', motivo: 'Valorar laparotomía por lesión esplénica', estado: 'Urgente' },
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 4mm',
    conciencia: 'Alerta, con dolor',
    ventilacion: 'No (puntas nasales 4 L)',
    peep: '—',
    fio2: '36%',
    etco2: '—',
    gasometria: { ph: '7.32', pao2: '78', paco2: '34' },
    diuresis: '20 mL/h',
    balance: '+1500 mL',
    cristaloides: '1500 mL',
    hemoderivados: '2 CE',
    laboratorios: [
      ['HB', '9.8 g/dL', true],
      ['HTO', '29%', true],
      ['LACTATO', '4.6 mmol/L', true],
      ['K+', '4.1 mEq/L', false],
      ['GLUCOSA', '162 mg/dL', true],
      ['CREATININA', '1.1 mg/dL', false],
      ['INR', '1.3', true],
      ['PLAQUETAS', '168,000', false],
    ],
    llenadoCapilar: '4 seg',
    vasoactivo: ['VASOPRESOR', 'Sin vasopresor (reanimación con sangre)'],
  },
  notaCorrelativa: [
    'Politrauma con choque hemorrágico: la lesión esplénica es la fuente más probable de sangrado, y la fractura de fémur puede sumar 1 a 1.5 L de pérdida.',
    'La alergia al látex obliga a usar material libre de látex en quirófano y en la unidad.',
  ].join('\n\n'),
  turno: { novedad: 'FC 149 pese a 2 CE; FAST positivo', pendiente: 'TC de abdomen o quirófano', tono: 'danger' },
};

export const DEMO_0004: PacienteDemo = { delSeed: DEL_SEED['DEMO-0004'], inventado };
