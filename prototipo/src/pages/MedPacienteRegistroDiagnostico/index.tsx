// Pantalla "med/paciente/registro-diagnostico" (Figma node 140:499) — generada desde el diseño original de Figma.
// Los campos son dibujos (paso 3 del plan los vuelve editables).
import type { ReactNode } from 'react';
import imgCalendar from '../../assets/calendar.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgRadioOptionEllipse from '../../assets/radio-option-ellipse.svg';
import imgRadioOptionEllipse2 from '../../assets/radio-option-ellipse-2.svg';
import imgSearch3 from '../../assets/search-3.svg';
import imgUploadCloud from '../../assets/upload-cloud.svg';
import { BackButton, Badge, Button, Card, Divider, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';

const SEVERITY = ['Leve', 'Moderada', 'Severa', 'Crítica'];
const SELECTED_SEVERITY = 'Severa';

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
  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica" title="Registro de Nuevo Diagnóstico" tab="historia" actions={<BackButton />}>
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Formulario de Diagnóstico Clínico</h2>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Tipo de Diagnóstico">
              <div className={cn(box, 'justify-between border-line')}>
                <span>Diagnóstico Principal</span>
                <img className="size-3.5 shrink-0" alt="" src={imgChevronDown} />
              </div>
            </Field>
            <Field label="Código CIE-10">
              <div className={cn(box, 'gap-2 border-primary')}>
                <img className="size-3.5 shrink-0" alt="" src={imgSearch3} />
                <span className="truncate">I50.9 Insuficiencia cardíaca, no especificada</span>
              </div>
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
                  <div key={s} role="radio" aria-checked={s === SELECTED_SEVERITY} className="flex items-center gap-2">
                    <img className="size-4" alt="" src={s === SELECTED_SEVERITY ? imgRadioOptionEllipse2 : imgRadioOptionEllipse} />
                    <span className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{s}</span>
                  </div>
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
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface p-4 text-center">
              <img className="size-6" alt="" src={imgUploadCloud} />
              <p className="font-jakarta text-[13px] font-bold leading-[normal] text-primary">Haga clic para subir archivos o arrástrelos aquí</p>
              <p className="font-jakarta text-[11px] font-normal leading-[normal] text-subtle">PDF, PNG, JPG hasta 10MB</p>
            </div>
          </Field>

          <div className="flex w-full flex-wrap justify-end gap-3 pt-3">
            <Button variant="secondary" size="lg">Cancelar</Button>
            <Button size="lg">Registrar Diagnóstico</Button>
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
    </PatientLayout>
  );
}
