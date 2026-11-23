// Notas SOAP de ejemplo de María González. Las usan el historial, el detalle y la nota nueva.
// La primera es la de Figma; las O/A/P de las demás son de ejemplo (paso 2).
import type { SoapNote } from '../components';

export type SoapEntry = {
  date: string;
  doctor: string;
  done: boolean;
  ref: string;
  /** Resumen del subjetivo que se ve en la lista. */
  summary: string;
  note: SoapNote;
};

export const SOAP_HISTORY_PATH = '/MedPacienteNotasSoapHistorial';
export const SOAP_NEW_PATH = '/MedPacienteNotasSoapNueva';

/** Ruta del detalle de una nota (la primera usa la ruta sin parámetros, como en Figma). */
export const soapDetailPath = (index: number) => (index === 0 ? '/MedPacienteNotasSoapDetalle' : `/MedPacienteNotasSoapDetalle?nota=${index}`);

export const SOAP_NOTES: SoapEntry[] = [
  {
    date: '24 Oct 2025, 09:15',
    doctor: 'Dr. Carlos Méndez',
    done: true,
    ref: 'RP-UCI-003',
    summary: 'Disnea progresiva y dificultad para respirar en reposo. Refiere empeoramiento desde anoche.',
    note: {
      s: 'Disnea progresiva y dificultad para respirar en reposo. Paciente refiere empeoramiento de la fatiga al realizar movimientos mínimos y ortopnea marcada durante la noche anterior.',
      o: 'Frecuencia Cardíaca 134 lpm, SpO2 89% con aire ambiente, Temperatura 38.5°C. Se auscultan estertores crepitantes bilaterales en bases pulmonares. Presión arterial de 140/90 mmHg.',
      a: 'Paciente con cuadro clínico compatible con descompensación aguda de Insuficiencia Cardíaca Congestiva (ICC) secundaria a probable proceso infeccioso respiratorio en evolución.',
      p: 'Ajustar dosis de diuréticos intravenosos, iniciar aporte de oxígeno por mascarilla para mantener SpO2 > 92%, solicitar radiografía de tórax urgente y paraclínicos inflamatorios.',
    },
  },
  {
    date: '22 Oct 2025, 14:30',
    doctor: 'Dra. Ana Rodríguez',
    done: true,
    ref: 'RP-UCI-002',
    summary: 'Paciente refiere mejoría parcial, menos fatiga al sentarse, pero persiste tos seca esporádica.',
    note: {
      s: 'Paciente refiere mejoría parcial, menos fatiga al sentarse, pero persiste tos seca esporádica.',
      o: 'FC 98 lpm, SpO2 93% con puntas nasales a 2 L, PA 132/84 mmHg. Estertores basales disminuidos respecto a la valoración previa.',
      a: 'ICC en mejoría progresiva con respuesta adecuada al diurético. Tos seca probablemente irritativa.',
      p: 'Mantener furosemida IV, reducir aporte de O2 según tolerancia y valorar antitusivo.',
    },
  },
  {
    date: '18 Oct 2025, 10:00',
    doctor: 'Dr. Carlos Méndez',
    done: true,
    ref: 'RP-UCI-001',
    summary: 'Dolor torácico intermitente al esfuerzo moderado. No refiere mareos ni síncope reciente.',
    note: {
      s: 'Dolor torácico intermitente al esfuerzo moderado. No refiere mareos ni síncope reciente.',
      o: 'FC 102 lpm, PA 148/94 mmHg, SpO2 92%. ECG sin cambios agudos del segmento ST.',
      a: 'Dolor torácico atípico; descartar síndrome coronario agudo. Hipertensión arterial no controlada.',
      p: 'Troponinas seriadas, ajustar antihipertensivo y mantener monitoreo continuo.',
    },
  },
  {
    date: '15 Oct 2025, 08:45',
    doctor: 'Dra. Ana Rodríguez',
    done: true,
    ref: 'RP-ING-001',
    summary: 'Disnea severa durante ingreso inicial, ortopnea marcada, sibilancias inspiratorias.',
    note: {
      s: 'Disnea severa durante ingreso inicial, ortopnea marcada, sibilancias inspiratorias.',
      o: 'FC 128 lpm, SpO2 86% al aire ambiente, FR 30 rpm, sibilancias y estertores difusos.',
      a: 'Edema agudo de pulmón por ICC descompensada. Se indica ingreso a UCI.',
      p: 'Ventilación no invasiva, furosemida en bolo, nitroglicerina IV y gasometría de control en 1 h.',
    },
  },
  {
    date: '10 Oct 2025, 16:20',
    doctor: 'Dr. Luis Peralta',
    done: false,
    ref: 'RP-CE-014',
    summary: 'Seguimiento de rutina pre-admisión. Reporta hinchazón en extremidades inferiores.',
    note: {
      s: 'Seguimiento de rutina pre-admisión. Reporta hinchazón en extremidades inferiores.',
      o: 'Edema con fóvea ++ en ambas piernas, PA 150/90 mmHg, aumento de 3 kg en una semana.',
      a: 'Sobrecarga de volumen en paciente con ICC conocida.',
      p: 'Pendiente: completar laboratorio y ajustar dosis de diurético oral.',
    },
  },
];
