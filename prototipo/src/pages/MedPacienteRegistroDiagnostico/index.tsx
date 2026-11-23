// Pantalla "med/paciente/registro-diagnostico" (Figma node 140:499) — generada desde el diseño original de Figma.
// Descripción, fecha y notas son dibujos (el paso 3 del plan los vuelve editables).
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import imgCalendar from '../../assets/calendar.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgRadioOptionEllipse from '../../assets/radio-option-ellipse.svg';
import imgRadioOptionEllipse2 from '../../assets/radio-option-ellipse-2.svg';
import imgSearch3 from '../../assets/search-3.svg';
import imgUploadCloud from '../../assets/upload-cloud.svg';
import { BackButton, Badge, Button, Card, Divider, PatientLayout, rowButton, Select, UploadDocumentModal, useToast } from '../../components';
import type { RegisteredState } from '../MedPacienteDiagnosticosActivos';
import { cn } from '../../lib/cn';

const SEVERITY = ['Leve', 'Moderada', 'Severa', 'Crítica'];
const TYPES = ['Diagnóstico Principal', 'Diagnóstico Secundario', 'Complicación'];
/** Códigos CIE-10 frecuentes de ejemplo; buscar escribiendo queda para el paso 3. */
const CIE10: Array<[string, string]> = [
  ['I50.9', 'Insuficiencia cardíaca, no especificada'],
  ['J81', 'Edema pulmonar'],
  ['I10', 'Hipertensión esencial (primaria)'],
  ['E11.9', 'Diabetes mellitus tipo 2 sin complicaciones'],
  ['N39.0', 'Infección de vías urinarias, sitio no especificado'],
  ['J18.9', 'Neumonía, no especificada'],
];
const CIE10_OPTIONS = CIE10.map(([code, text]) => ({ value: code, label: `${code} ${text}` }));

const PREVIOUS: Array<{ code: string; severity: string; tone: 'danger' | 'warning'; title: string; date: string; by: string }> = [
  { code: 'I50.9', severity: 'Crítica', tone: 'danger', title: 'Insuficiencia Cardíaca Congestiva descompensada', date: 'Hace 2 días', by: 'Dr. Carlos Méndez' },
  { code: 'I10', severity: 'Moderada', tone: 'warning', title: 'Hipertensión Arterial Primaria', date: '15 Oct 2025', by: 'Dra. Lucía Torres' },
  { code: 'E11.9', severity: 'Leve', tone: 'warning', title: 'Diabetes Mellitus Tipo 2', date: '12 May 2024', by: 'Dr. Carlos Méndez' },
];

const Field = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
  <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
    <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">{label}</p>
    {children}
  </div>
);

const box = 'flex w-full items-center rounded-lg border bg-white px-3 py-[10px] font-jakarta text-[14px] font-semibold leading-[normal] text-ink';

export default function MedPacienteRegistroDiagnostico() {
  const navigate = useNavigate();
  const toast = useToast();
  const [type, setType] = useState(TYPES[0]);
  const [code, setCode] = useState(CIE10[0][0]);
  const [severity, setSeverity] = useState('Severa');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const chevron = <img className="size-3.5 shrink-0" alt="" src={imgChevronDown} />;

  const register = () => {
    const [, text] = CIE10.find(([c]) => c === code) ?? CIE10[0];
    const state: RegisteredState = { registered: { code, description: text } };
    toast(`Diagnóstico registrado · ${code}`);
    navigate('/MedPacienteDiagnosticosActivos', { state });
  };

  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica" title="Registro de Nuevo Diagnóstico" tab="historia" actions={<BackButton />}>
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Formulario de Diagnóstico Clínico</h2>

          <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
            <Field label="Tipo de Diagnóstico">
              <Select variant="input" options={TYPES} value={type} onChange={setType} trailingIcon={chevron} ariaLabel="Tipo de Diagnóstico" />
            </Field>
            <Field label="Código CIE-10">
              <Select
                variant="input"
                highlighted
                options={CIE10_OPTIONS}
                value={code}
                onChange={setCode}
                icon={<img className="size-3.5 shrink-0" alt="" src={imgSearch3} />}
                chevron={false}
                ariaLabel="Código CIE-10"
              />
            </Field>
          </div>

          <Field label="Descripción / Hallazgos Clínicos">
            <div className="min-h-20 w-full rounded-lg border border-line bg-white p-3 font-jakarta text-[14px] font-normal leading-5 text-ink">
              Paciente femenina de 67 años con historial de insuficiencia cardíaca congestiva que ingresa con disnea en reposo notable, ortopnea y estertores basales crepitantes bilaterales.
            </div>
          </Field>

          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
            <Field label="Severidad" className="gap-[10px] md:flex-1">
              <div className="flex flex-wrap items-center gap-4" role="radiogroup" aria-label="Severidad">
                {SEVERITY.map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={s === severity} onClick={() => setSeverity(s)} className="flex items-center gap-2">
                    <img className="size-4" alt="" src={s === severity ? imgRadioOptionEllipse2 : imgRadioOptionEllipse} />
                    <span className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{s}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Fecha de Registro" className="md:w-[200px] md:shrink-0">
              <div className={cn(box, 'justify-between border-line')}>
                <span>02 Ago 2026</span>
                <img className="size-3.5 shrink-0" alt="" src={imgCalendar} />
              </div>
            </Field>
          </div>

          <Field label="Notas Adicionales / Plan de Manejo Inicial">
            <div className="min-h-[60px] w-full rounded-lg border border-line bg-white p-3 font-jakarta text-[14px] font-normal leading-[normal] text-subtle">
              Iniciar protocolo de diuréticos IV y control estricto de balance hídrico...
            </div>
          </Field>

          <Field label="Estudios Adjuntos (Rayos X, Labs, ECG)">
            <div
              {...rowButton(() => setUploadOpen(true))}
              aria-label="Subir estudios adjuntos"
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface p-4 text-center outline-none transition-colors hover:bg-primary-soft focus-visible:border-primary"
            >
              <img className="size-6" alt="" src={imgUploadCloud} />
              <p className="font-jakarta text-[13px] font-bold leading-[normal] text-primary">Haga clic para subir archivos o arrástrelos aquí</p>
              <p className="font-jakarta text-[11px] font-normal leading-[normal] text-subtle">PDF, PNG, JPG hasta 10MB</p>
            </div>
            {files.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {files.map((f) => (
                  <li key={f}>
                    <Badge tone="info" size="sm">
                      {f}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <div className="flex w-full flex-wrap justify-end gap-3 pt-3">
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button size="lg" onClick={register}>
              Registrar Diagnóstico
            </Button>
          </div>
        </Card>

        <Card className="flex w-full min-w-0 flex-col gap-4 xl:w-[340px] xl:shrink-0">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Diagnósticos Previos</h2>
          <Divider />
          <ul className="flex w-full flex-col gap-3">
            {PREVIOUS.map((d) => (
              <li key={d.code} className="flex w-full flex-col gap-2 rounded-lg border border-line p-3">
                <div className="flex w-full items-center justify-between">
                  <Badge tone="neutral" size="sm">{d.code}</Badge>
                  <Badge tone={d.tone} size="sm">{d.severity}</Badge>
                </div>
                <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">{d.title}</p>
                <div className="flex w-full justify-between gap-3 text-[11px] leading-[normal] text-muted">
                  <p className="font-jakarta font-normal">{d.date}</p>
                  <p className="font-jakarta font-medium">{d.by}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={({ name }) => {
          setUploadOpen(false);
          setFiles((f) => (f.includes(name) ? f : [...f, name]));
          toast(`Archivo adjuntado · ${name}`);
        }}
      />
    </PatientLayout>
  );
}
