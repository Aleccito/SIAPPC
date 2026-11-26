// Pantalla "med/paciente/notas-soap-detalle" (Figma node 217:211) — generada desde el diseño original de Figma.
// La nota sale de ?nota=<id> (GET /soap/notes/:id); sin parámetro, la más reciente del paciente.
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgSectionOEllipse from '../../assets/section-o-ellipse.svg';
import imgSectionPEllipse from '../../assets/section-p-ellipse.svg';
import imgSectionSEllipse from '../../assets/section-s-ellipse.svg';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addSoapAddendum } from '../../api/clinical';
import { ApiError } from '../../api/http';
import { useSoapNote, useSoapNotes } from '../../api/queries';
import type { SoapNote } from '../../api/types/clinical';
import { Button, CloseButton, Divider, Modal, PatientLayout, TextArea, usePatient, useSession, useToast, type PatientView } from '../../components';
import { cn } from '../../lib/cn';
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
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Notas SOAP > Detalle`} title="Detalle de Nota SOAP" tab="notas">
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

      {done && <Adendas note={entry} patientId={v.id} />}

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

const SECCIONES = [
  { key: 'subjective', letter: 'S', label: 'Subjetivo' },
  { key: 'objective', letter: 'O', label: 'Objetivo' },
  { key: 'assessment', letter: 'A', label: 'Evaluación' },
  { key: 'plan', letter: 'P', label: 'Plan' },
] as const;
type Seccion = (typeof SECCIONES)[number]['key'];

/**
 * No viene de Figma (PR de conexión 2 y 3): las adendas de una nota firmada. Una nota firmada no se edita; se corrige
 * con una adenda (POST /soap/notes/:id/addendum), que nace firmada por quien la escribe y cuelga de la nota original
 * (`parentId`). La agrega quien puede escribir notas SOAP; la enfermera solo las lee.
 */
function Adendas({ note, patientId }: { note: SoapNote; patientId: string }) {
  const { can } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const list = useSoapNotes(patientId);
  // El backend aplana: la adenda de una adenda cuelga de la nota raíz.
  const raiz = note.parentId ?? note.id;
  const adendas = (list.data ?? []).filter((n) => n.parentId === raiz && n.id !== note.id).sort((a, b) => a.at.localeCompare(b.at));
  const puede = can('notas_soap', 'crear');
  const [abierta, setAbierta] = useState(false);
  const [seccion, setSeccion] = useState<Seccion>('assessment');
  const [texto, setTexto] = useState('');
  const [guardando, setGuardando] = useState(false);
  if (!puede && adendas.length === 0) return null;

  const guardar = async () => {
    if (!texto.trim() || guardando) return;
    setGuardando(true);
    try {
      await addSoapAddendum(note.id, { [seccion]: texto.trim() });
      await queryClient.invalidateQueries({ queryKey: ['soapNotes', patientId] });
      toast('Adenda agregada y firmada');
      setTexto('');
      setAbierta(false);
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede escribir notas SOAP' : 'No se pudo guardar la adenda. Intente de nuevo.', 'info');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-ink">Adendas</p>
      {adendas.map((a) => (
        <div key={a.id} className="flex w-full flex-col gap-1.5 rounded-lg border border-line px-[14px] py-3">
          <p className="font-jakarta text-[12px] font-medium leading-[normal] text-muted">{`${fmtDateTime(a.at)} · ${staffName(a.authorName)}`}</p>
          {SECCIONES.filter((x) => a[x.key]).map((x) => (
            <p key={x.key} className="font-jakarta text-[13px] font-normal leading-[normal] text-[#334155]">
              <span className="font-semibold text-ink">{`${x.label}: `}</span>
              {a[x.key]}
            </p>
          ))}
        </div>
      ))}
      {adendas.length === 0 && <p className="font-jakarta text-[13px] leading-[normal] text-muted">Sin adendas.</p>}
      {puede && !abierta && (
        <div>
          <Button variant="secondary" size="sm" onClick={() => setAbierta(true)}>
            Agregar adenda
          </Button>
        </div>
      )}
      {puede && abierta && (
        <div className="flex w-full flex-col gap-3 rounded-lg bg-surface p-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sección de la adenda">
            {SECCIONES.map((x) => (
              <button
                key={x.key}
                type="button"
                aria-pressed={seccion === x.key}
                onClick={() => setSeccion(x.key)}
                className={cn(
                  'rounded-md border px-2.5 py-1 font-jakarta text-[12px] font-semibold leading-[normal]',
                  seccion === x.key ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-white text-muted hover:bg-surface',
                )}
              >
                {`${x.letter} · ${x.label}`}
              </button>
            ))}
          </div>
          <TextArea id="adenda-texto" label="Texto de la adenda" value={texto} onChange={setTexto} placeholder="Corrección o dato nuevo; queda firmada a su nombre." maxLength={2000} />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setAbierta(false)} disabled={guardando}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => void guardar()} disabled={guardando || !texto.trim()}>
              {guardando ? 'Guardando…' : 'Firmar adenda'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
