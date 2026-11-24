// Pantalla "med/paciente/notas-soap-detalle" (Figma node 217:211) — generada desde el diseño original de Figma.
// La nota sale de ?nota=<id> (GET /soap/notes/:id); sin parámetro, la más reciente del paciente.
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgSectionOEllipse from '../../assets/section-o-ellipse.svg';
import imgSectionPEllipse from '../../assets/section-p-ellipse.svg';
import imgSectionSEllipse from '../../assets/section-s-ellipse.svg';
import { useSearchParams } from 'react-router-dom';
import { useSoapNote, useSoapNotes } from '../../api/queries';
import { BackButton, Button, CloseButton, Divider, Modal, PatientLayout, usePatient, useSession, type PatientView } from '../../components';
import { noteRef, SOAP_HISTORY_PATH, SOAP_NEW_PATH } from '../../data/soap';
import { fmtDateTime, staffName } from '../../lib/clinical';
import { usePatientNavigate } from '../../lib/patientLink';
import { SoapHistoryView } from '../MedPacienteNotasSoapHistorial/SoapHistoryView';

const STYLE = [
  { dot: imgSectionSEllipse, label: 'Subjetivo (S)', color: 'text-primary' },
  { dot: imgSectionOEllipse, label: 'Objetivo (O)', color: 'text-[#eab308]' },
  { dot: imgAlertTextEllipse2, label: 'Evaluación / Análisis (A)', color: 'text-danger' },
  { dot: imgSectionPEllipse, label: 'Plan (P)', color: 'text-[#16a34a]' },
];

export default function MedPacienteNotasSoapDetalle() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Notas SOAP > Detalle`} title="Detalle de Nota SOAP" tab="notas" actions={<BackButton />}>
      {view && (
        <>
          <SoapHistoryView v={view} />
          <Detalle v={view} />
        </>
      )}
    </PatientLayout>
  );
}

function Detalle({ v }: { v: PatientView }) {
  const navigate = usePatientNavigate();
  const { user } = useSession();
  const [params] = useSearchParams();
  const noteId = params.get('nota') ?? undefined;
  const byId = useSoapNote(noteId);
  const list = useSoapNotes(v.id);
  // Una nota de otro paciente (?nota= de otro expediente) no se muestra aquí.
  const entry = noteId ? (byId.data?.patientId === v.id ? byId.data : undefined) : list.data?.[0];
  const close = () => navigate(SOAP_HISTORY_PATH);
  if (!entry) return null;

  const done = entry.status === 'firmada';
  const meta: Array<[string, string, string]> = [
    ['Fecha', fmtDateTime(entry.at), 'text-ink'],
    ['Médico', staffName(entry.authorName), 'text-ink'],
    ['Estado', done ? 'Completada' : 'En progreso', done ? 'text-[#16a34a]' : 'text-warning'],
    ['Ref.', noteRef(entry), 'text-ink'],
  ];
  const sections = STYLE.map((s, i) => ({ ...s, text: [entry.subjective, entry.objective, entry.assessment, entry.plan][i] ?? '—' }));
  // Solo el autor sigue escribiendo su borrador (el backend responde 403 a los demás).
  const canEdit = !done && entry.authorId === user?.id;

  return (
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
        {done ? (
          <Button disabled title="Las notas firmadas no se pueden editar">
            Nota firmada
          </Button>
        ) : canEdit ? (
          <Button to={`${SOAP_NEW_PATH}?nota=${entry.id}`}>Editar Nota</Button>
        ) : (
          <Button disabled title="Solo el autor puede seguir su borrador">
            Borrador de otro médico
          </Button>
        )}
      </div>
    </Modal>
  );
}
