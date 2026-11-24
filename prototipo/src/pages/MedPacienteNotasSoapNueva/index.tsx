// Pantalla "med/paciente/notas-soap-nueva" (Figma node 29:1881) — generada desde el diseño original de Figma.
// Paso 3: S/O/A/P son campos reales. "Guardar borrador" pide al menos una sección; "Guardar y firmar"
// pide las cuatro (10 a 2000 caracteres) y confirma antes de firmar (REVISION.md, paso 3, punto 1).
// Guarda con POST /soap/notes (o PUT + /sign si sigue un borrador) para el paciente de la URL.
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgHeaderRowFrame2 from '../../assets/header-row-frame-2.svg';
import imgModalHeaderFrame from '../../assets/modal-header-frame.svg';
import imgWave from '../../assets/wave.svg';
import imgWave2 from '../../assets/wave-2.svg';
import imgWave3 from '../../assets/wave-3.svg';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createSoapNote, signSoapNote } from '../../api/clinical';
import { ApiError, request } from '../../api/http';
import { useMonitoredBeds, useSoapNote, useSoapNotes } from '../../api/queries';
import { getSignosExtra, useExtra } from '../../api/sinBackend';
import type { SoapNote as ApiSoapNote } from '../../api/types/clinical';
import {
  BackButton,
  Badge,
  Button,
  Card,
  CloseButton,
  ConfirmDialog,
  Divider,
  FieldError,
  focusFirst,
  Modal,
  PatientLayout,
  TextArea,
  useDisplayUser,
  usePatient,
  useToast,
  useValidation,
  type PatientView,
} from '../../components';
import { SOAP_HISTORY_PATH } from '../../data/soap';
import { fmtAgo, fmtDateTime, staffName } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { usePatientNavigate } from '../../lib/patientLink';
import { checkText } from '../../lib/validate';

const SIGNALS = [
  { key: 'hr', label: 'ECG II', unit: 'bpm', color: 'text-[#22c55e]', wave: imgWave, icon: imgHeaderRowFrame, iconNextToLabel: true, border: 'border border-white' },
  { key: 'spo2', label: 'SpO2', unit: '%', color: 'text-[#06b6d4]', wave: imgWave2, icon: imgHeaderRowFrame2, iconNextToLabel: false, border: 'border-l-[3px] border-white' },
  { key: 'pa', label: 'PA', unit: 'mmHg', color: 'text-[#eab308]', wave: imgWave3, icon: imgHeaderRowFrame2, iconNextToLabel: false, border: 'border-l-[3px] border-white' },
] as const;

type Key = 's' | 'o' | 'a' | 'p';

const FIELDS: Array<{ key: Key; letter: string; label: string; badge: string; placeholder: string }> = [
  { key: 's', letter: 'S', label: 'Subjetivo (S)', badge: 'bg-primary-soft text-primary', placeholder: 'Ej. Paciente refiere disnea leve en reposo, refiere mejoría del dolor torácico...' },
  { key: 'o', letter: 'O', label: 'Objetivo (O)', badge: 'bg-warning-soft text-[#eab308]', placeholder: 'Ej. FC 120 lpm, SpO2 91% con puntas nasales a 2L, ruidos respiratorios con estertores basales...' },
  { key: 'a', letter: 'A', label: 'Evaluación / Análisis (A)', badge: 'bg-danger-soft text-danger', placeholder: 'Ej. Insuficiencia cardíaca congestiva en fase de descompensación moderada estable...' },
  { key: 'p', letter: 'P', label: 'Plan (P)', badge: 'bg-success-soft text-success', placeholder: 'Ej. Continuar con furosemida 20mg IV cada 12 horas, mantener monitoreo continuo...' },
];

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotasSoapNueva() {
  const patient = usePatient();
  const v = patient.view;
  const [params] = useSearchParams();
  // "Editar Nota" de un borrador llega con ?nota=<id> y sigue escribiendo esa nota.
  const noteId = params.get('nota') ?? undefined;
  const draftQuery = useSoapNote(noteId);
  const draft = draftQuery.data && draftQuery.data.status === 'borrador' ? draftQuery.data : null;
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${v?.name ?? '…'} > Notas SOAP > Nueva`} title="Nueva Nota SOAP" tab="notas" actions={<BackButton />}>
      {/* La key reinicia el formulario cuando llega el borrador. */}
      {v && (!noteId || !draftQuery.isPending) && <NuevaNota key={draft?.id ?? 'nueva'} v={v} draft={draft} />}
    </PatientLayout>
  );
}

function NuevaNota({ v, draft }: { v: PatientView; draft: ApiSoapNote | null }) {
  const navigate = usePatientNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const me = useDisplayUser();
  const [saving, setSaving] = useState(false);
  const beds = useMonitoredBeds();
  const vitals = beds.data?.find((b) => b.patientId === v.id)?.vitals;
  const signos = useExtra('signos', v.cedula, getSignosExtra);
  const notes = useSoapNotes(v.id);
  const last = notes.data?.find((n) => n.id !== draft?.id);
  const value = (key: (typeof SIGNALS)[number]['key']) =>
    key === 'pa' ? (signos.data ? `${signos.data.pa.sis}/${signos.data.pa.dia}` : '—') : String(vitals?.[key] ?? '—');

  const initial = { s: draft?.subjective ?? '', o: draft?.objective ?? '', a: draft?.assessment ?? '', p: draft?.plan ?? '' };
  const [text, setText] = useState<Record<Key, string>>(initial);
  const [mode, setMode] = useState<'draft' | 'sign'>('draft');
  const [confirmSign, setConfirmSign] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const empty = FIELDS.every((f) => !text[f.key].trim());
  const dirty = FIELDS.some((f) => text[f.key] !== initial[f.key]);
  const fieldRule = (k: Key, m: 'draft' | 'sign') => () => checkText(text[k], m === 'sign' ? { required: true, min: 10, max: 2000 } : { max: 2000 });
  const rulesFor = (m: 'draft' | 'sign') => ({
    s: fieldRule('s', m),
    o: fieldRule('o', m),
    a: fieldRule('a', m),
    p: fieldRule('p', m),
    any: () => (m === 'draft' && empty ? 'Escriba al menos una sección' : null),
  });
  const form = useValidation(rulesFor(mode));

  /** Valida con las reglas del botón tocado; si hay errores los muestra y lleva el cursor al primero. */
  const check = (m: 'draft' | 'sign') => {
    setMode(m);
    form.markAll();
    const rules = rulesFor(m);
    const bad = FIELDS.find((f) => rules[f.key]());
    if (bad || rules.any()) {
      toast('Revise los campos marcados', 'info');
      focusFirst([bad ? `soap-${bad.key}` : 'soap-s']);
      return false;
    }
    return true;
  };

  const store = async (done: boolean) => {
    if (saving) return;
    setSaving(true);
    const body = { subjective: text.s.trim(), objective: text.o.trim(), assessment: text.a.trim(), plan: text.p.trim() };
    try {
      if (draft) {
        // Seguir un borrador: PUT con las cuatro secciones y, si se firma, POST /sign.
        await request<ApiSoapNote>(`/soap/notes/${draft.id}`, { method: 'PUT', body: JSON.stringify(body) });
        if (done) await signSoapNote(draft.id);
      } else {
        await createSoapNote({ patientId: Number(v.id), ...body, sign: done });
      }
      await queryClient.invalidateQueries({ queryKey: ['soapNotes', v.id] });
      if (draft) await queryClient.invalidateQueries({ queryKey: ['soapNote', draft.id] });
      toast(done ? 'Nota firmada' : 'Borrador guardado');
      navigate(SOAP_HISTORY_PATH);
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede escribir notas SOAP' : 'No se pudo guardar la nota. Intente de nuevo.', 'info');
    } finally {
      setSaving(false);
    }
  };

  // Salir con texto escrito pregunta antes de descartarlo.
  const close = () => (dirty ? setConfirmDiscard(true) : navigate(SOAP_HISTORY_PATH));
  const onModalClose = () => {
    if (!confirmSign && !confirmDiscard) close();
  };

  return (
    <>
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[580px] xl:shrink-0">
          <CardHeading>{`Monitor de Cama - Cama ${v.bed ?? '—'}`}</CardHeading>
          {SIGNALS.map((s) => (
            <div key={s.label} className={cn('flex w-full flex-col gap-[10px] rounded-[10px] bg-[#0b1220] p-3', s.border)}>
              <div className="flex w-full items-center justify-between leading-[normal]">
                <div className="flex items-center gap-2">
                  <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{s.label}</p>
                  {s.iconNextToLabel && <img className="size-3.5" alt="" src={s.icon} />}
                </div>
                <div className={cn('flex items-baseline gap-1.5', s.color)}>
                  <p className="font-jakarta text-[22px] font-extrabold">{value(s.key)}</p>
                  <p className="font-jakarta text-[12px] font-bold">{s.unit}</p>
                  {!s.iconNextToLabel && <img className="size-3.5 self-center" alt="" src={s.icon} />}
                </div>
              </div>
              <div className="relative h-14 w-full overflow-hidden rounded-lg bg-[#0b1220]">
                <img className="absolute left-0 top-[10px] h-9 w-[380px] max-w-full object-fill" alt="" src={s.wave} />
              </div>
            </div>
          ))}
        </Card>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <CardHeading>Última Nota SOAP</CardHeading>
              {last && <Badge tone="neutral" size="sm">{fmtDateTime(last.at)}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
              <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">{last ? staffName(last.authorName) : 'Sin notas previas'}</p>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {[
                ['S', 'bg-primary-soft text-primary', last?.subjective ?? '—'],
                ['O', 'bg-warning-soft text-[#eab308]', last?.objective ?? '—'],
              ].map(([letter, badge, line]) => (
                <div key={letter} className="flex w-full max-w-[344px] items-center gap-1.5">
                  <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', badge)}>{letter}</span>
                  <p className="min-w-0 flex-1 truncate font-jakarta text-[13px] font-normal leading-[normal] text-ink">{line}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <CardHeading>Dispositivo IoT</CardHeading>
              <Badge tone="success" size="sm" dot>
                En línea
              </Badge>
            </div>
            <Divider />
            <div className="flex w-full items-center justify-between gap-3 text-[13px] leading-[normal]">
              <p className="font-jakarta font-normal text-muted">ID del dispositivo</p>
              <p className="font-jakarta font-bold text-ink">{v.assigned?.device ?? '—'}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-3 text-[13px] leading-[normal]">
              <p className="font-jakarta font-normal text-muted">Última lectura</p>
              <p className="font-jakarta font-bold text-ink">{fmtAgo(vitals?.at)}</p>
            </div>
          </Card>
        </div>
      </div>

      <Modal labelledBy="nueva-nota-soap-titulo" onClose={onModalClose} width={680} backdrop="bg-[rgba(15,23,42,0.5)]" className="gap-6 p-5 drop-shadow-[0px_20px_20px_rgba(15,23,42,0.15)] sm:p-8">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img className="size-9 shrink-0" alt="" src={imgModalHeaderFrame} />
            <h2 id="nueva-nota-soap-titulo" className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">
              {draft ? 'Editar borrador SOAP' : 'Nueva Nota SOAP'}
            </h2>
          </div>
          <CloseButton onClick={close} />
        </div>
        <Divider />
        <div className="flex w-full flex-col gap-4">
          <p className="font-jakarta text-[14px] font-bold uppercase leading-[normal] text-ink">Notas de Progreso Clínico</p>
          <div className="flex w-full flex-col gap-[14px]">
            {FIELDS.map((f) => (
              <div key={f.letter} className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', f.badge)}>{f.letter}</span>
                  <label htmlFor={`soap-${f.key}`} className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">
                    {f.label}
                  </label>
                </div>
                <TextArea
                  id={`soap-${f.key}`}
                  value={text[f.key]}
                  onChange={(val) => setText((t) => ({ ...t, [f.key]: val }))}
                  onBlur={() => form.touch(f.key)}
                  placeholder={f.placeholder}
                  placeholderTone="muted"
                  leading="snug"
                  maxLength={2000}
                  aria-required={mode === 'sign'}
                  error={form.show(f.key)}
                />
              </div>
            ))}
            <FieldError forId="soap-any" error={form.show('any')} />
          </div>
        </div>
        <Divider />
        <div className="flex w-full flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={() => check('draft') && void store(false)}>
            Guardar borrador
          </Button>
          <Button onClick={() => check('sign') && setConfirmSign(true)}>Guardar y firmar</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmSign}
        title="¿Firmar la nota?"
        confirmLabel="Firmar"
        onCancel={() => setConfirmSign(false)}
        onConfirm={() => {
          setConfirmSign(false);
          void store(true);
        }}
      >
        {`Se firmará como ${me.name}. Una vez firmada, la nota no se puede editar.`}
      </ConfirmDialog>
      <ConfirmDialog
        open={confirmDiscard}
        title="¿Descartar la nota?"
        confirmLabel="Descartar"
        confirmVariant="danger"
        cancelLabel="Seguir escribiendo"
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => navigate(SOAP_HISTORY_PATH)}
      >
        Se perderá lo que escribió en esta nota.
      </ConfirmDialog>
    </>
  );
}
