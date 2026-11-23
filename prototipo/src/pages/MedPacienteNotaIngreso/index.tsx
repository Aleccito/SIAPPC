// Pantalla "med/paciente/nota-ingreso" (Figma node 183:603) — generada desde el diseño original de Figma.
// Paso 3: motivo, padecimiento y plan terapéutico se editan con validación. Los datos de admisión son de
// solo lectura porque los registra Admisión (REVISION.md, paso 3, punto 6).
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgOptBuenoEllipse from '../../assets/opt-bueno-ellipse.svg';
import imgOptReservadoEllipse from '../../assets/opt-reservado-ellipse.svg';
import { useRef, useState } from 'react';
import { BackButton, Badge, Button, Card, FieldError, focusFirst, InfoField, PatientLayout, Table, TextArea, useToast, useValidation } from '../../components';
import { checkText } from '../../lib/validate';
import { cn } from '../../lib/cn';

const ADMISSION = [
  ['Fecha y Hora de Ingreso', '15 Oct 2025 08:30'],
  ['Servicio', 'UCI'],
  ['Cama Asignada', 'C-03'],
  ['Médico Responsable', 'Dr. Carlos Méndez'],
];

const DIAGNOSES: Array<[string, string, 'Definitivo' | 'Presuntivo']> = [
  ['I50.9', 'Insuficiencia Cardíaca Congestiva', 'Definitivo'],
  ['J81', 'Edema Pulmonar', 'Presuntivo'],
  ['I10', 'Hipertensión Arterial', 'Definitivo'],
];

const PLAN = [
  'Furosemida 40mg IV c/8h',
  'Oxígeno por mascarilla 5L/min',
  'Monitoreo hemodinámico continuo',
  'Restricción hídrica estricta 1500ml/día',
  'Ecocardiograma urgente en cama',
];

// Cada pronóstico se marca con su color (Reservado es el que muestra Figma).
const PROGNOSIS = [
  { label: 'Bueno', text: 'Evolución favorable esperada', box: 'border-success bg-[rgba(16,185,129,0.06)]', ring: 'border-success' },
  { label: 'Reservado', text: 'Evolución incierta sujeta a monitoreo', box: 'border-warning bg-[rgba(245,158,11,0.06)]', ring: '' },
  { label: 'Grave', text: 'Alto riesgo de complicaciones inminentes', box: 'border-danger bg-[rgba(239,68,68,0.06)]', ring: 'border-danger' },
];

const FIGMA_MOTIVO = 'Disnea progresiva y dificultad para respirar en reposo de 48 horas de evolución';
const FIGMA_PADECIMIENTO =
  'Paciente femenina de 67 años con antecedente de Insuficiencia Cardíaca Congestiva (ICC) que presenta disnea progresiva de 48 horas de evolución, exacerbada en decúbito (ortopnea) y acompañada de tos seca no productiva. Al ingreso se documenta taquipnea, desaturación y signos clínicos compatibles con sobrecarga hídrica aguda / edema agudo de pulmón.';

// Lo guardado se conserva mientras no se recargue la página (sin backend).
let saved: { motivo: string; padecimiento: string; plan: Array<{ id: number; text: string }>; prognosis: string } | null = null;

const blockLabel = 'font-jakarta text-[12px] font-bold uppercase leading-[normal] text-muted';

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotaIngreso() {
  const toast = useToast();
  const [prognosis, setPrognosis] = useState(() => saved?.prognosis ?? 'Reservado');
  const [motivo, setMotivo] = useState(() => saved?.motivo ?? FIGMA_MOTIVO);
  const [padecimiento, setPadecimiento] = useState(() => saved?.padecimiento ?? FIGMA_PADECIMIENTO);
  const [plan, setPlan] = useState(() => saved?.plan ?? PLAN.map((text, i) => ({ id: i, text })));
  const nextId = useRef(plan.length);
  const form = useValidation({
    'ingreso-motivo': () => checkText(motivo, { required: true, min: 10, max: 300, requiredMessage: 'Escriba el motivo de ingreso' }),
    'ingreso-padecimiento': () => checkText(padecimiento, { required: true, min: 30, max: 2000, requiredMessage: 'Describa el padecimiento actual' }),
    'ingreso-plan': () => {
      if (!plan.some((p) => p.text.trim())) return 'Agregue al menos una indicación';
      const bad = plan.find((p) => checkText(p.text, { min: 3, max: 120 }));
      return bad ? `Indicación ${plan.indexOf(bad) + 1}: ${checkText(bad.text, { min: 3, max: 120 })?.toLowerCase()}` : null;
    },
  });
  const planError = form.show('ingreso-plan');
  const badPlanId = planError ? plan.find((p) => !p.text.trim() || checkText(p.text, { min: 3, max: 120 }))?.id : undefined;

  const addItem = () => {
    const id = nextId.current++;
    setPlan((all) => [...all, { id, text: '' }]);
    requestAnimationFrame(() => document.getElementById(`ingreso-plan-${id}`)?.focus());
  };
  const save = () => {
    form.markAll();
    const bad = (Object.keys(form.errors) as Array<keyof typeof form.errors>).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los campos marcados', 'info');
      focusFirst([bad === 'ingreso-plan' ? (badPlanId !== undefined ? `ingreso-plan-${badPlanId}` : 'ingreso-plan-agregar') : bad]);
      return;
    }
    saved = { motivo, padecimiento, plan: plan.filter((p) => p.text.trim()), prognosis };
    toast('Nota de ingreso guardada');
  };

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Nota de Ingreso"
      title="Nota de Ingreso"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col gap-4">
        <Card className="flex w-full flex-col gap-4">
          <CardHeading>Datos de Admisión</CardHeading>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ADMISSION.map(([label, value]) => (
              <InfoField key={label} label={label}>
                {value}
              </InfoField>
            ))}
          </div>
        </Card>

        <Card className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="ingreso-motivo" className={blockLabel}>
              Motivo de Ingreso
            </label>
            <TextArea
              id="ingreso-motivo"
              value={motivo}
              onChange={setMotivo}
              onBlur={() => form.touch('ingreso-motivo')}
              tone="surface"
              padding="lg"
              leading="relaxed"
              minHeight={56}
              maxLength={300}
              aria-required
              error={form.show('ingreso-motivo')}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="ingreso-padecimiento" className={blockLabel}>
              Padecimiento Actual
            </label>
            <TextArea
              id="ingreso-padecimiento"
              value={padecimiento}
              onChange={setPadecimiento}
              onBlur={() => form.touch('ingreso-padecimiento')}
              tone="surface"
              padding="lg"
              leading="relaxed"
              minHeight={56}
              maxLength={2000}
              aria-required
              error={form.show('ingreso-padecimiento')}
            />
          </div>
        </Card>

        <Card className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Diagnósticos de Ingreso</CardHeading>
            <Button variant="soft" size="sm" to="/MedPacienteRegistroDiagnostico">
              + Agregar Diagnóstico
            </Button>
          </div>
          <div className="w-full overflow-hidden rounded-lg border border-line bg-white">
            <Table minWidth={420}>
              <div className="flex w-full gap-3 border-b border-line bg-surface px-3 py-2.5 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                <p className="w-[100px] shrink-0">CIE-10</p>
                <p className="min-w-0 flex-1">DESCRIPCIÓN</p>
                <p className="w-[120px] shrink-0">TIPO</p>
              </div>
              {DIAGNOSES.map(([code, description, type]) => (
                <div key={code} className="flex w-full items-center gap-3 border-b border-line p-3 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <p className="w-[100px] shrink-0 font-bold text-ink">{code}</p>
                  <p className="min-w-0 flex-1 font-medium text-ink">{description}</p>
                  <div className="w-[120px] shrink-0">
                    <Badge tone={type === 'Definitivo' ? 'success' : 'warning'}>{type}</Badge>
                  </div>
                </div>
              ))}
            </Table>
          </div>
        </Card>

        <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
          <Card className="flex w-full min-w-0 flex-col gap-3 lg:flex-1">
            <CardHeading>Plan Terapéutico Inicial</CardHeading>
            {/* Cada indicación se edita en su lugar; una vacía se quita al salir de ella. */}
            <ul className="flex w-full flex-col gap-[10px]">
              {plan.map((item, i) => (
                <li key={item.id} className="flex w-full items-center gap-2">
                  <img className="size-1.5 shrink-0" alt="" src={imgBulletItemEllipse} />
                  <input
                    id={`ingreso-plan-${item.id}`}
                    value={item.text}
                    maxLength={120}
                    aria-label={`Indicación ${i + 1} del plan terapéutico`}
                    aria-invalid={badPlanId === item.id || undefined}
                    aria-describedby={badPlanId === item.id ? 'ingreso-plan-error' : undefined}
                    onChange={(e) => setPlan((all) => all.map((p) => (p.id === item.id ? { ...p, text: e.target.value } : p)))}
                    onBlur={() => {
                      if (!item.text.trim() && plan.length > 1) setPlan((all) => all.filter((p) => p.id !== item.id));
                      form.touch('ingreso-plan');
                    }}
                    placeholder="Nueva indicación"
                    className={cn(
                      'min-w-0 flex-1 rounded-sm bg-transparent font-jakarta text-[13px] font-medium leading-[normal] text-ink outline-none transition-shadow placeholder:text-subtle hover:ring-1 hover:ring-line focus:ring-2 focus:ring-primary/40',
                      badPlanId === item.id && 'ring-2 ring-danger/60',
                    )}
                  />
                </li>
              ))}
            </ul>
            <FieldError forId="ingreso-plan" error={planError} />
            <Button id="ingreso-plan-agregar" variant="link" size="sm" className="self-start" onClick={addItem}>
              + Agregar indicación
            </Button>
          </Card>
          <Card className="flex w-full min-w-0 flex-col gap-4 lg:w-[400px] lg:shrink-0">
            <CardHeading>Pronóstico de Ingreso</CardHeading>
            <div className="flex w-full flex-col gap-[10px]" role="radiogroup" aria-label="Pronóstico de ingreso">
              {PROGNOSIS.map((p) => {
                const selected = p.label === prognosis;
                return (
                <button
                  key={p.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPrognosis(p.label)}
                  className={cn('flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors', selected ? p.box : 'border-line bg-surface hover:bg-white')}
                >
                  {selected && p.ring ? (
                    <span className={cn('size-4 shrink-0 rounded-full border-2 bg-white', p.ring)} />
                  ) : (
                    <img className="size-4 shrink-0" alt="" src={selected ? imgOptReservadoEllipse : imgOptBuenoEllipse} />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[14px] font-bold text-ink">{p.label}</p>
                    <p className="font-jakarta text-[11px] font-medium text-muted">{p.text}</p>
                  </div>
                </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="flex w-full justify-end">
          <Button size="lg" onClick={save}>
            Guardar Nota de Ingreso
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}
