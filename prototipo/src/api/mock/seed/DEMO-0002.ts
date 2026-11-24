// DEMO-0002 · Ileana Montenegro Sáez · 55 años · UCI-02 · tromboembolia pulmonar tras cirugía de cadera.
// `delSeed`: tal cual de backend/db/seed-demo.sql. `inventado`: todo lo demás — no viene del seed.
import { DEL_SEED } from './delSeed';
import type { Inventado, PacienteDemo } from './tipos';

// no viene del seed
const inventado: Inventado = {
  personales: {
    estadoCivil: 'Divorciada',
    ocupacion: 'Contadora',
    escolaridad: 'Universitaria',
    religion: 'Evangélica',
    telefono: '555-0152',
    email: 'ileana.montenegro@ejemplo.com',
    direccion: 'Vía España, Res. Bella Vista, casa 12',
    ciudad: 'Ciudad de Panamá',
    provincia: 'Panamá',
    codigoPostal: '0823',
    emergencia: { relacion: 'Hermana' },
    seguro: { tipo: 'CSS (Caja de Seguro Social)', poliza: '4-118-2207' },
  },
  pa: { sis: 98, dia: 62 },
  temp: 37.6,
  exploracion: {
    pesoKg: 74,
    tallaCm: 162,
    abdominalCm: 94,
    glasgow: 15,
    signosIngreso: { fc: 112, fr: 26, ta: '104/66', temp: 37.4, spo2: 88 },
    hallazgos: {
      cabeza_cuello: { inspeccion: ['anormal', 'Ingurgitación yugular leve a 45°.'] },
      torax: {
        inspeccion: ['anormal', 'Taquipnea con uso de músculos accesorios.'],
        auscultacion: ['anormal', 'Murmullo vesicular conservado. Taquicardia rítmica con reforzamiento del segundo ruido pulmonar.'],
      },
      extremidades_inferiores: {
        inspeccion: ['anormal', 'Herida quirúrgica de cadera derecha limpia. Aumento de volumen de pantorrilla derecha (+3 cm).'],
        palpacion: ['anormal', 'Dolor a la palpación de pantorrilla derecha; signo de Homans positivo.'],
      },
    },
  },
  notasSoap: [
    {
      horasAtras: 11,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Disnea súbita y dolor torácico pleurítico derecho al intentar sentarse, al 5.º día de osteosíntesis de cadera.',
      o: 'FC 112 lpm, FR 26 rpm, SpO2 88 % al aire, PA 104/66 mmHg. Pantorrilla derecha aumentada de volumen.',
      a: 'Tromboembolia pulmonar probable (Wells 7.5) pese a profilaxis con enoxaparina. Sin choque.',
      p: 'Angio-TC de tórax urgente y dímero D. Ecocardiograma para valorar ventrículo derecho. Anticoagulación plena tras valorar sangrado con Ortopedia. O2 para SpO2 ≥ 92 %.',
    },
    {
      horasAtras: 1,
      autor: 'Dr. Carlos Méndez',
      estado: 'firmada',
      s: 'Refiere más falta de aire; ansiosa.',
      o: 'FC 126 lpm, SpO2 83 % con mascarilla reservorio, FR 31 rpm, PA 98/62 mmHg. Angio-TC: defectos de llenado lobares derechos.',
      a: 'TEP confirmada con hipoxemia grave y tendencia a hipotensión: riesgo intermedio-alto.',
      p: 'Valorar trombólisis o trombectomía con Cardiología. Troponina y BNP. Preparar ventilación si empeora.',
    },
  ],
  antecedentes: [
    { tipo: 'familiar', descripcion: 'Trombosis venosa profunda', parentesco: 'Madre', anio: null },
    { tipo: 'ginecoobstetrico', descripcion: 'G2 P2; menopausia a los 50 años', parentesco: null, anio: 2021 },
  ],
  resueltos: [{ cie10: 'K80.2', descripcion: 'Colelitiasis sin colecistitis', fecha: '2019-03-20' }],
  hospitalizaciones: [
    {
      motivo: 'Fractura de cuello de fémur derecho por caída — osteosíntesis',
      servicio: 'Ortopedia',
      establecimiento: 'Hospital Santo Tomás',
      ingreso: 7,
      egreso: 2,
      resumen: 'Egreso al 3.er día posoperatorio con enoxaparina 40 mg SC c/24 h y andadera.',
    },
  ],
  procedimientos: [
    {
      nombre: 'Osteosíntesis de cadera derecha con tornillos canulados',
      codigo: '79.35',
      fecha: 5,
      descripcion: 'Fractura subcapital de fémur derecho, Garden II.',
      resultado: 'Reducción adecuada; herida limpia.',
      cirujano: 'Dr. Ernesto Pinzón',
    },
  ],
  documentos: [
    { tipo: 'imagenologia', titulo: 'Angio-TC de tórax — protocolo TEP', descripcion: 'Defectos de llenado en arterias lobares inferior y media derechas. Relación VD/VI 1.1.', horasAtras: 9, por: 'Radiología' },
    { tipo: 'laboratorio', titulo: 'Dímero D y gasometría arterial', descripcion: 'Dímero D 4 850 ng/mL. pH 7.47, PaO2 54 mmHg, PaCO2 30 mmHg.', horasAtras: 10, por: 'Laboratorio' },
    { tipo: 'imagenologia', titulo: 'Radiografía de cadera derecha posoperatoria', descripcion: 'Material de osteosíntesis en buena posición.', horasAtras: 130, por: 'Radiología' },
    { tipo: 'consentimiento', titulo: 'Consentimiento informado de ingreso a UCI', descripcion: 'Firmado por la paciente.', horasAtras: 11, por: 'Admisión' },
  ],
  notaIngreso: {
    motivo: 'Dolor torácico y falta de aire súbita, 5 días tras cirugía de cadera',
    padecimiento:
      'Femenina de 55 años, fumadora, al 5.º día posoperatorio de osteosíntesis de cadera derecha, con profilaxis con enoxaparina 40 mg SC, que presenta disnea súbita, dolor pleurítico derecho y taquicardia. A su ingreso, SpO2 88 % al aire y aumento de volumen de la pantorrilla derecha.',
    plan: [
      'Angio-TC de tórax urgente',
      'Anticoagulación plena tras valorar sangrado con Ortopedia',
      'Oxígeno para SpO2 ≥ 92 %',
      'Ecocardiograma: función del ventrículo derecho',
      'Troponina y BNP',
    ],
    pronostico: 'Grave',
  },
  interrogatorio: {
    'Aparato Respiratorio': { marcados: ['Disnea', 'Dolor torácico'], notas: 'Disnea súbita en reposo y dolor torácico pleurítico derecho que aumenta con la inspiración.' },
    'Aparato Cardiovascular': { marcados: ['Palpitaciones', 'Edema'], notas: 'Palpitaciones desde el inicio de la disnea; edema de la pierna derecha.' },
    'Sistema Músculo-esquelético': { marcados: ['Dolor'], notas: 'Dolor en la cadera derecha operada, controlado con paracetamol.' },
  },
  indicaciones: {
    soluciones: [['Solución salina 0.9% 500 ml', '42 ml/hr', 'Periférica']],
    dieta: ['Blanda'],
    restriccion: null,
    cuidados: [
      'Monitoreo continuo de SpO2 y ECG',
      'Reposo absoluto en cama hasta definir anticoagulación',
      'Mascarilla reservorio para SpO2 ≥ 92 %',
      'Vigilar herida quirúrgica y sangrado',
    ],
    estudios: [
      ['Angio-TC de tórax', 'Imagen', 'Realizado', 'success'],
      ['Ecocardiograma', 'Imagen', 'Prog. hoy', 'info'],
      ['Troponina y BNP', 'Laboratorio', 'Pendiente', 'warning'],
      ['Dímero D', 'Laboratorio', 'Realizado', 'success'],
    ],
    interconsulta: { servicio: 'Cardiología', motivo: 'Valorar trombólisis o trombectomía', estado: 'En espera' },
  },
  monitoreo: {
    glasgowDetalle: 'O4 V5 M6',
    pupilas: 'Isocóricas reactivas 3mm',
    conciencia: 'Alerta, ansiosa',
    ventilacion: 'No (reservorio 15 L)',
    peep: '—',
    fio2: '60%',
    etco2: '—',
    gasometria: { ph: '7.47', pao2: '54', paco2: '30' },
    diuresis: '45 mL/h',
    balance: '+600 mL',
    cristaloides: '1000 mL',
    hemoderivados: '—',
    laboratorios: [
      ['DÍMERO D', '4 850 ng/mL', true],
      ['TROPONINA I', '0.09 ng/mL', true],
      ['BNP', '410 pg/mL', true],
      ['HB', '10.9 g/dL', true],
      ['K+', '3.9 mEq/L', false],
      ['CREATININA', '0.8 mg/dL', false],
      ['INR', '1.1', false],
      ['PLAQUETAS', '212,000', false],
    ],
    llenadoCapilar: '3 seg',
    vasoactivo: ['VASOPRESOR', 'Sin vasopresor'],
  },
  notaCorrelativa: [
    'Tromboembolia pulmonar en el posoperatorio de fractura de cadera, a pesar de profilaxis con enoxaparina; el tabaquismo y la inmovilización suman riesgo.',
    'La anticoagulación plena debe equilibrarse con el riesgo de sangrado de la herida quirúrgica reciente: se coordina con Ortopedia y Cardiología.',
  ].join('\n\n'),
  turno: { novedad: 'SpO2 83 % con reservorio; FC 126', pendiente: 'Decidir trombólisis con Cardiología', tono: 'danger' },
};

export const DEMO_0002: PacienteDemo = { delSeed: DEL_SEED['DEMO-0002'], inventado };
