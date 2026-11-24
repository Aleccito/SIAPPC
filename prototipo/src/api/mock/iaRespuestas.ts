// no viene del seed: lo que "sabe" la IA simulada de cada paciente, escrito a partir de sus datos del seed
// (alergias, medicamentos, diagnósticos, lecturas y su nota SOAP). El motor (mock/ai.ts) arma con esto la
// respuesta que pide cada pregunta, en el formato del backend (backend/src/routes/ai.ts, SYSTEM):
// solo lo que se pregunta y, en preguntas abiertas, las 5 secciones con 2 a 4 viñetas.
// `ideas` imita al análisis automático (services/aiAuto.ts, PROMPT_VERSION auto-v2): 2 o 3 hipótesis,
// título de hasta 6 palabras y justificación de hasta 15 que cita el dato.

export type Idea = { title: string; rationale: string };

export type SaberIA = {
  banderas: string[];
  diferenciales: string[];
  estudios: string[];
  manejo: string[];
  interacciones: string[];
  faltantes: string[];
  ideas: Idea[];
};

export const SABER_IA: Record<string, SaberIA> = {
  'DEMO-0001': {
    banderas: [
      'FC 132, SpO₂ 88 % y FR 30 con fiebre y confusión: cumple qSOFA ≥ 2.',
      'Hipotenso al ingreso (PA 92/58): vigilar evolución a choque séptico.',
    ],
    diferenciales: [
      'Pielonefritis complicada con sepsis: fiebre, dolor lumbar y puñopercusión positiva.',
      'Pionefrosis o absceso renal: diabético; descartar si no mejora en 48–72 h.',
      'Neumonía asociada: SpO₂ en descenso y FR 30.',
    ],
    estudios: [
      'Lactato y gasometría: hipoperfusión y acidosis.',
      'Hemocultivos ×2 y urocultivo: ajustar el antibiótico.',
      'Creatinina, electrolitos y glucemia: función renal y control metabólico.',
      'Ecografía renal: obstrucción o absceso.',
    ],
    manejo: [
      'Cristaloides 30 mL/kg si persiste la hipoperfusión; reevaluar la respuesta.',
      'Noradrenalina si la PAM queda < 65 mmHg pese al volumen.',
      'Mantener ceftriaxona y ajustar según cultivos.',
      'O₂ para SpO₂ ≥ 92 %; vigilar el estado de alerta.',
    ],
    interacciones: [
      'Alergia a penicilina (urticaria): la ceftriaxona tiene reactividad cruzada baja; vigilar.',
      'Metformina: suspender por sepsis e hipoperfusión (riesgo de acidosis láctica).',
      'Enalapril: suspender mientras haya hipotensión y riesgo de lesión renal.',
    ],
    faltantes: ['Peso actual, para calcular el volumen.', 'Creatinina basal y lactato.', 'Presión arterial actual.'],
    ideas: [
      { title: 'Sepsis de foco urinario', rationale: 'FC 132, FR 30, fiebre y puñopercusión derecha positiva.' },
      { title: 'Evolución a choque séptico', rationale: 'PA 92/58 al ingreso y SpO₂ 88 %.' },
      { title: 'Pionefrosis o absceso renal', rationale: 'Diabético con dolor lumbar que persiste con antibiótico.' },
    ],
  },
  'DEMO-0002': {
    banderas: ['SpO₂ 83 % con FR 31 y FC 126: hipoxemia grave.', 'TEP posoperatorio: riesgo de inestabilidad hemodinámica; vigilar la PA.'],
    diferenciales: [
      'Tromboembolia pulmonar posoperatoria: disnea súbita y pantorrilla edematizada a 5 días de la cirugía.',
      'Neumonía posoperatoria: menos probable sin fiebre ni esputo.',
      'Síndrome coronario agudo: descartar con ECG y troponina.',
    ],
    estudios: [
      'Angio-TC de tórax: confirmar el TEP.',
      'Troponina y BNP: estratificar el riesgo.',
      'Ecocardiograma: sobrecarga del ventrículo derecho.',
      'Gasometría arterial: gravedad de la hipoxemia.',
    ],
    manejo: [
      'O₂ para SpO₂ > 92 %; preparar ventilación si empeora.',
      'Anticoagulación terapéutica si se confirma, según el riesgo de sangrado.',
      'Valorar trombólisis o trombectomía con Cardiología si hay inestabilidad.',
    ],
    interacciones: [
      'Sin alergias registradas.',
      'Enoxaparina 40 mg es dosis profiláctica: pasar a dosis terapéutica por peso si se confirma el TEP.',
      'Herida quirúrgica de 5 días: sopesar el sangrado antes de trombolizar.',
    ],
    faltantes: ['Peso, para dosificar la anticoagulación.', 'Función renal (aclaramiento) para la enoxaparina.', 'Presión arterial actual.'],
    ideas: [
      { title: 'Tromboembolia pulmonar posoperatoria', rationale: 'SpO₂ 83 %, FR 31, cirugía de cadera hace 5 días.' },
      { title: 'TEP de riesgo intermedio-alto', rationale: 'FC 126 con hipoxemia; faltan troponina y ecocardiograma.' },
      { title: 'Neumonía posoperatoria', rationale: 'Menos probable: sin fiebre ni esputo registrados.' },
    ],
  },
  'DEMO-0003': {
    banderas: ['SpO₂ 85 % con FR 28 y musculatura accesoria: riesgo de fatiga respiratoria.', 'Vigilar hipercapnia: somnolencia o confusión.'],
    diferenciales: [
      'Exacerbación de EPOC de causa infecciosa: esputo purulento.',
      'Neumonía: descartar con radiografía.',
      'TEP o neumotórax si no responde al tratamiento.',
    ],
    estudios: ['Gasometría arterial: PaCO₂ y pH.', 'Radiografía de tórax: neumonía o neumotórax.', 'Hemograma y PCR: infección.', 'Cultivo de esputo.'],
    manejo: [
      'O₂ controlado con meta de SpO₂ 88–92 %.',
      'Broncodilatadores nebulizados (salbutamol ± ipratropio).',
      'Mantener prednisona 40 mg por 5 días.',
      'VMNI si el pH < 7.35 con PaCO₂ elevada.',
    ],
    interacciones: [
      'Alergia a sulfonamidas: evitar trimetoprim-sulfametoxazol.',
      'Prednisona: vigilar la glucemia.',
      'Salbutamol a dosis altas: vigilar taquicardia (FC 114) e hipopotasemia.',
    ],
    faltantes: ['Gasometría actual (PaCO₂).', 'FEV₁ basal.', 'Saturación habitual en casa.'],
    ideas: [
      { title: 'Exacerbación infecciosa de EPOC', rationale: 'SpO₂ 85 %, FR 28 y esputo purulento.' },
      { title: 'Insuficiencia respiratoria hipercápnica', rationale: 'EPOC grave con FR 28; falta gasometría.' },
      { title: 'Neumonía asociada', rationale: 'Tos productiva purulenta; radiografía pendiente.' },
    ],
  },
  'DEMO-0004': {
    banderas: ['FC 149 con PA 98/60: choque hemorrágico probable.', 'Abdomen con defensa: posible lesión intraabdominal.'],
    diferenciales: [
      'Lesión de víscera sólida (bazo o hígado): abdomen con defensa y taquicardia.',
      'Sangrado por la fractura de fémur: puede perder 1 a 1.5 L.',
      'Lesión torácica asociada: SpO₂ 91 %, descartar neumotórax.',
    ],
    estudios: ['FAST seriado y TC corporal si estabiliza.', 'Hemoglobina, lactato y pruebas cruzadas.', 'Tiempos de coagulación y fibrinógeno.', 'Radiografía de fémur y pelvis.'],
    manejo: [
      'Protocolo de transfusión masiva si sigue inestable.',
      'Hipotensión permisiva (PAS 80–90) hasta controlar el sangrado.',
      'Inmovilizar el fémur con tracción.',
      'Valoración inmediata por Cirugía y Ortopedia.',
    ],
    interacciones: [
      'Alergia al látex: guantes, sondas y equipo sin látex.',
      'Ácido tranexámico ya dado: segunda dosis de 1 g en 8 h si aplica.',
      'Morfina: vigilar la PA; puede empeorar la hipotensión.',
    ],
    faltantes: ['Hemoglobina y lactato.', 'Resultado del FAST.', 'Peso estimado.'],
    ideas: [
      { title: 'Choque hemorrágico clase II–III', rationale: 'FC 149 con PA 98/60 tras el trauma.' },
      { title: 'Lesión de víscera sólida abdominal', rationale: 'Abdomen doloroso con defensa.' },
      { title: 'Sangrado por fractura femoral', rationale: 'Deformidad de fémur; pérdida oculta probable.' },
    ],
  },
  'DEMO-0005': {
    banderas: ['FC 35 con casi síncope: bradicardia sintomática.', 'Riesgo de intoxicación digitálica con furosemida (hipopotasemia).'],
    diferenciales: [
      'Intoxicación por digoxina: digoxina con bisoprolol y diurético.',
      'Bloqueo AV de alto grado por enfermedad del nodo.',
      'Hiperpotasemia o hipotiroidismo: menos probables.',
    ],
    estudios: ['ECG de 12 derivaciones: grado de bloqueo.', 'Digoxinemia, potasio, magnesio y creatinina.', 'INR: está con warfarina.', 'TSH.'],
    manejo: [
      'Suspender digoxina y bisoprolol.',
      'Atropina 0.5–1 mg IV si hay inestabilidad; marcapasos transcutáneo listo.',
      'Fab antidigoxina si hay arritmia grave o potasio alto.',
      'Corregir potasio y magnesio.',
    ],
    interacciones: [
      'Alergia a AINEs (broncoespasmo): no indicar ninguno para el dolor.',
      'Digoxina + bisoprolol: efecto aditivo sobre el nodo AV.',
      'Furosemida: la hipopotasemia potencia la toxicidad de la digoxina.',
      'Warfarina: revisar el INR antes de un marcapasos.',
    ],
    faltantes: ['Digoxinemia y potasio.', 'INR actual.', 'Función renal.'],
    ideas: [
      { title: 'Intoxicación digitálica', rationale: 'FC 35 con digoxina, bisoprolol y furosemida.' },
      { title: 'Bloqueo AV de alto grado', rationale: 'Bradicardia extrema con casi síncope.' },
      { title: 'Hipopotasemia por diurético', rationale: 'Furosemida diaria; potencia la toxicidad de la digoxina.' },
    ],
  },
  'DEMO-0006': {
    banderas: ['FC 150 con opresión torácica: descartar síndrome coronario agudo.', 'Sudoración fría al inicio: vigilar inestabilidad.'],
    diferenciales: [
      'Fibrilación auricular con respuesta ventricular rápida: FC 148 irregular en la nota.',
      'Flutter auricular 2:1: FC fija cerca de 150.',
      'Síndrome coronario agudo con arritmia: padre con infarto a los 52 años.',
    ],
    estudios: ['ECG de 12 derivaciones: regularidad y ancho del QRS.', 'Troponina seriada: descartar SCA.', 'Electrolitos y TSH.', 'Ecocardiograma.'],
    manejo: [
      'Si está inestable: cardioversión eléctrica sincronizada.',
      'Complejo estrecho regular y estable: maniobras vagales y adenosina.',
      'Si es FA: control de frecuencia y anticoagulación según CHA₂DS₂-VASc.',
      'Monitor continuo.',
    ],
    interacciones: [
      'Sin alergias registradas.',
      'Amlodipino: sumar diltiazem o un betabloqueador puede bajar la PA.',
      'Ácido acetilsalicílico: tenerlo en cuenta si se anticoagula (sangrado).',
    ],
    faltantes: ['ECG de 12 derivaciones.', 'Troponina.', 'Duración del episodio: si pasa de 48 h, anticoagular antes de cardiovertir.'],
    ideas: [
      { title: 'Fibrilación auricular con respuesta rápida', rationale: 'FC 150 irregular con palpitaciones.' },
      { title: 'Síndrome coronario agudo', rationale: 'Opresión torácica, HTA, dislipidemia y padre con infarto.' },
      { title: 'Flutter auricular 2:1', rationale: 'FC fija cerca de 150.' },
    ],
  },
  'DEMO-0007': {
    banderas: ['Sin banderas rojas activas: FC 88, SpO₂ 93 %, FR 19.'],
    diferenciales: [
      'Neumonía adquirida en la comunidad en mejoría.',
      'Derrame paraneumónico si persiste el dolor pleurítico.',
      'Broncoespasmo por el asma previa.',
    ],
    estudios: ['Radiografía de tórax de control si no mejora en 48–72 h.', 'Hemograma y PCR de control.', 'Saturación en reposo y al caminar.'],
    manejo: [
      'Completar amoxicilina con ácido clavulánico.',
      'Paracetamol para fiebre y dolor.',
      'Hidratación y fisioterapia respiratoria.',
      'Valorar el alta si sigue estable.',
    ],
    interacciones: ['Alergia a ibuprofeno: no indicar AINEs; usar paracetamol.', 'Sin interacciones relevantes entre amoxicilina/clavulánico y paracetamol.'],
    faltantes: ['Radiografía de control.', 'Temperatura de las últimas 24 h.'],
    ideas: [
      { title: 'Neumonía comunitaria en mejoría', rationale: 'FR 19 y SpO₂ 93 % con antibiótico.' },
      { title: 'Derrame paraneumónico', rationale: 'Dolor pleurítico; vigilar si persiste.' },
    ],
  },
  'DEMO-0008': {
    banderas: ['FC 111 y FR 23: vigilar evolución a pancreatitis grave (SIRS).'],
    diferenciales: [
      'Pancreatitis aguda alcohólica: consumo frecuente de alcohol.',
      'Pancreatitis biliar: descartar litiasis con ecografía.',
      'Úlcera perforada: menos probable sin irritación peritoneal.',
    ],
    estudios: ['Lipasa y perfil hepático.', 'Ecografía abdominal: litiasis biliar.', 'Triglicéridos y calcio.', 'BUN y hematocrito a las 24 h (pronóstico).'],
    manejo: [
      'Hidratación con Hartmann guiada por la diuresis.',
      'Analgesia con tramadol; valorar opioide si no cede.',
      'Nutrición enteral temprana cuando tolere.',
      'Tiamina por el consumo de alcohol.',
    ],
    interacciones: [
      'Sin alergias registradas.',
      'Tramadol: riesgo de convulsiones si hay abstinencia alcohólica.',
      'Omeprazol: sin interacciones relevantes con lo indicado.',
    ],
    faltantes: ['Lipasa y triglicéridos.', 'Ecografía biliar.', 'Último consumo de alcohol.'],
    ideas: [
      { title: 'Pancreatitis aguda alcohólica', rationale: 'Dolor en cinturón y consumo frecuente de alcohol.' },
      { title: 'Riesgo de pancreatitis grave', rationale: 'FC 111 y FR 23 (criterios de SIRS).' },
    ],
  },
};
