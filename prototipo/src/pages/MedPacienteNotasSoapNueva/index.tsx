// Pantalla "med/paciente/notas-soap-nueva" (Figma node 29:1881) — generada desde el diseño original de Figma.
// Paso 3: S/O/A/P son campos reales. "Guardar borrador" pide al menos una sección; "Guardar y firmar"
// pide las cuatro (10 a 2000 caracteres) y confirma antes de firmar (REVISION.md, paso 3, punto 1).
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgHeaderRowFrame2 from '../../assets/header-row-frame-2.svg';
import imgModalHeaderFrame from '../../assets/modal-header-frame.svg';
import imgWave from '../../assets/wave.svg';
import imgWave2 from '../../assets/wave-2.svg';
import imgWave3 from '../../assets/wave-3.svg';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  useToast,
  useValidation,
} from '../../components';
import { nowLabel, saveSoapNote, SOAP_HISTORY_PATH, soapNotes } from '../../data/soap';
import { cn } from '../../lib/cn';
import { checkText } from '../../lib/validate';

const SIGNALS = [
  { label: 'ECG II', value: '134', unit: 'bpm', color: 'text-[#22c55e]', wave: imgWave, icon: imgHeaderRowFrame, iconNextToLabel: true, border: 'border border-white' },
  { label: 'SpO2', value: '89', unit: '%', color: 'text-[#06b6d4]', wave: imgWave2, icon: imgHeaderRowFrame2, border: 'border-l-[3px] border-white' },
  { label: 'PA', value: '140/90', unit: 'mmHg', color: 'text-[#eab308]', wave: imgWave3, icon: imgHeaderRowFrame2, border: 'border-l-[3px] border-white' },
];

type Key = 's' | 'o' | 'a' | 'p';

const FIELDS: Array<{ key: Key; letter: string; label: string; badge: string; placeholder: string }> = [
  { key: 's', letter: 'S', label: 'Subjetivo (S)', badge: 'bg-primary-soft text-primary', placeholder: 'Ej. Paciente refiere disnea leve en reposo, refiere mejoría del dolor torácico...' },
  { key: 'o', letter: 'O', label: 'Objetivo (O)', badge: 'bg-warning-soft text-[#eab308]', placeholder: 'Ej. FC 120 lpm, SpO2 91% con puntas nasales a 2L, ruidos respiratorios con estertores basales...' },
  { key: 'a', letter: 'A', label: 'Evaluación / Análisis (A)', badge: 'bg-danger-soft text-danger', placeholder: 'Ej. Insuficiencia cardíaca congestiva en fase de descompensación moderada estable...' },
  { key: 'p', letter: 'P', label: 'Plan (P)', badge: 'bg-success-soft text-success', placeholder: 'Ej. Continuar con furosemida 20mg IV cada 12 horas, mantener monitoreo continuo...' },
];

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotasSoapNueva() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  // "Editar Nota" de un borrador llega con ?nota=índice y sigue escribiendo esa nota.
  const draft = (() => {
    const n = soapNotes()[Number(params.get('nota'))];
    return params.has('nota') && n && !n.done ? n : null;
  })();
  const initial = { s: draft?.note.s ?? '', o: draft?.note.o ?? '', a: draft?.note.a ?? '', p: draft?.note.p ?? '' };
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

  const store = (done: boolean) => {
    const note = { s: text.s.trim(), o: text.o.trim(), a: text.a.trim(), p: text.p.trim() };
    saveSoapNote({
      id: draft?.id ?? `nueva-${Date.now()}`,
      date: nowLabel(),
      doctor: 'Dr. Carlos Méndez',
      done,
      ref: draft?.ref ?? `RP-UCI-${String(Math.floor(Date.now() / 1000) % 1000).padStart(3, '0')}`,
      summary: note.s || note.o || note.a || note.p,
      note,
    });
    toast(done ? 'Nota firmada' : 'Borrador guardado');
    navigate(SOAP_HISTORY_PATH);
  };

  // Salir con texto escrito pregunta antes de descartarlo.
  const close = () => (dirty ? setConfirmDiscard(true) : navigate(SOAP_HISTORY_PATH));
  const onModalClose = () => {
    if (!confirmSign && !confirmDiscard) close();
  };

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Notas SOAP > Nueva"
      title="Nueva Nota SOAP"
      tab="notas"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[580px] xl:shrink-0">
          <CardHeading>Monitor de Cama - Cama 03</CardHeading>
          {SIGNALS.map((s) => (
            <div key={s.label} className={cn('flex w-full flex-col gap-[10px] rounded-[10px] bg-[#0b1220] p-3', s.border)}>
              <div className="flex w-full items-center justify-between leading-[normal]">
                <div className="flex items-center gap-2">
                  <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{s.label}</p>
                  {s.iconNextToLabel && <img className="size-3.5" alt="" src={s.icon} />}
                </div>
                <div className={cn('flex items-baseline gap-1.5', s.color)}>
                  <p className="font-jakarta text-[22px] font-extrabold">{s.value}</p>
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
              <Badge tone="neutral" size="sm">24 Oct 2025, 08:15</Badge>
            </div>
            <div className="flex items-center gap-2">
              <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
              <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">Dr. Carlos Méndez</p>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {[
                ['S', 'bg-primary-soft text-primary', 'Disnea progresiva y dificultad para respirar en reposo.'],
                ['O', 'bg-warning-soft text-[#eab308]', 'FC 134, SpO2 89%, estertores bilaterales.'],
              ].map(([letter, badge, text]) => (
                <div key={letter} className="flex w-full max-w-[344px] items-center gap-1.5">
                  <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', badge)}>{letter}</span>
                  <p className="min-w-0 flex-1 truncate font-jakarta text-[13px] font-normal leading-[normal] text-ink">{text}</p>
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
              <p className="font-jakarta font-bold text-ink">RPi-UCI-003</p>
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
                  onChange={(v) => setText((t) => ({ ...t, [f.key]: v }))}
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
          <Button variant="secondary" onClick={() => check('draft') && store(false)}>
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
          store(true);
        }}
      >
        Se firmará como Dr. Carlos Méndez. Una vez firmada, la nota no se puede editar.
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
    </PatientLayout>
  );
}
