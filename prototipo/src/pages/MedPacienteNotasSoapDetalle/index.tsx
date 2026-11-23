// Pantalla "med/paciente/notas-soap-detalle" (Figma node 217:211) — generada desde el diseño original de Figma.
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgSectionOEllipse from '../../assets/section-o-ellipse.svg';
import imgSectionPEllipse from '../../assets/section-p-ellipse.svg';
import imgSectionSEllipse from '../../assets/section-s-ellipse.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BackButton, Button, CloseButton, Divider, Modal, PatientLayout } from '../../components';
import { FIGMA_NOTE_ID, SOAP_HISTORY_PATH, SOAP_NEW_PATH, soapNotes } from '../../data/soap';
import { SoapHistoryView } from '../MedPacienteNotasSoapHistorial/SoapHistoryView';

const META = [
  ['Fecha', '24 Oct 2025, 09:15', 'text-ink'],
  ['Médico', 'Dr. Carlos Méndez', 'text-ink'],
  ['Estado', 'Completada', 'text-[#16a34a]'],
  ['Ref.', 'RP-UCI-003', 'text-ink'],
];

const STYLE = [
  { dot: imgSectionSEllipse, label: 'Subjetivo (S)', color: 'text-primary' },
  { dot: imgSectionOEllipse, label: 'Objetivo (O)', color: 'text-[#eab308]' },
  { dot: imgAlertTextEllipse2, label: 'Evaluación / Análisis (A)', color: 'text-danger' },
  { dot: imgSectionPEllipse, label: 'Plan (P)', color: 'text-[#16a34a]' },
];

// Texto de Figma para la nota del 24 Oct; las demás notas (?nota=1…4) salen de data/soap.
const SECTIONS = [
  { dot: imgSectionSEllipse, label: 'Subjetivo (S)', color: 'text-primary', text: 'Paciente refiere disnea leve en reposo, refiere mejoría del dolor torácico. Dificultad para respirar en reposo. Refiere empeoramiento desde anoche.' },
  { dot: imgSectionOEllipse, label: 'Objetivo (O)', color: 'text-[#eab308]', text: 'FC 105 bpm, SpO2 91% con puntas nasales a 3L, ruidos respiratorios con estertores basales bilaterales. PA 140/92 mmHg. Temp 37.8°C.' },
  { dot: imgAlertTextEllipse2, label: 'Evaluación / Análisis (A)', color: 'text-danger', text: 'Insuficiencia cardíaca congestiva en fase de descompensación moderada estable. Edema pulmonar agudo en resolución. Hipertensión arterial no controlada.' },
  { dot: imgSectionPEllipse, label: 'Plan (P)', color: 'text-[#16a34a]', text: 'Continuar con furosemida 20mg IV cada 12 horas, mantener monitoreo continuo. Ajustar diurético IV, O2 por mascarilla. Control de balance hídrico estricto.' },
];

export default function MedPacienteNotasSoapDetalle() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const index = Number(params.get('nota') ?? 0);
  const notes = soapNotes();
  const entry = notes[index] ?? notes[0];
  const figma = entry.id === FIGMA_NOTE_ID;
  const meta = figma
    ? META
    : [
        ['Fecha', entry.date, 'text-ink'],
        ['Médico', entry.doctor, 'text-ink'],
        ['Estado', entry.done ? 'Completada' : 'En progreso', entry.done ? 'text-[#16a34a]' : 'text-warning'],
        ['Ref.', entry.ref, 'text-ink'],
      ];
  const sections = figma ? SECTIONS : STYLE.map((s, i) => ({ ...s, text: [entry.note.s, entry.note.o, entry.note.a, entry.note.p][i] }));
  const close = () => navigate(SOAP_HISTORY_PATH);

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Notas SOAP > Detalle"
      title="Detalle de Nota SOAP"
      tab="notas"
      actions={<BackButton />}
    >
      <SoapHistoryView />

      <Modal labelledBy="detalle-soap-titulo" onClose={close} width={700} backdrop="bg-[rgba(15,23,42,0.5)]" className="gap-5 px-5 py-6 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] sm:px-8 sm:py-7">
        <div className="flex w-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <span className="font-jakarta text-[16px] font-bold leading-[normal] text-primary">S</span>
          </div>
          <h2 id="detalle-soap-titulo" className="min-w-0 flex-1 font-jakarta text-[20px] font-semibold leading-[normal] text-ink">
            Nota SOAP — Detalle
          </h2>
          <CloseButton onClick={close} />
        </div>

        <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-3 rounded-lg bg-surface px-4 py-3 leading-[normal] sm:flex sm:flex-wrap">
          {meta.map(([label, value, color]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="font-jakarta text-[11px] font-medium text-subtle">{label}</dt>
              <dd className={`font-jakarta text-[13px] font-semibold ${color}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex w-full flex-col gap-4">
          <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-ink">Notas de Progreso Clínico</p>
          {sections.map((s) => (
            <div key={s.label} className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <img className="size-2" alt="" src={s.dot} />
                <p className={`font-jakarta text-[13px] font-semibold leading-[normal] ${s.color}`}>{s.label}</p>
              </div>
              <div className="w-full rounded-lg bg-surface px-[14px] py-3">
                <p className="font-jakarta text-[13px] font-normal leading-[normal] text-[#334155]">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider />
        <div className="flex w-full flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cerrar
          </Button>
          {/* Una nota firmada ya no se edita; un borrador se sigue escribiendo en Nueva Nota SOAP. */}
          {entry.done ? (
            <Button disabled title="Las notas firmadas no se pueden editar">
              Nota firmada
            </Button>
          ) : (
            <Button to={`${SOAP_NEW_PATH}?nota=${notes.indexOf(entry)}`}>Editar Nota</Button>
          )}
        </div>
      </Modal>
    </PatientLayout>
  );
}
