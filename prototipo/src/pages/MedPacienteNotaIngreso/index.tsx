// Pantalla "med/paciente/nota-ingreso" (Figma node 183:603) — generada desde el diseño original de Figma.
// Paso 3: motivo, padecimiento y plan terapéutico se editan con validación. Los datos de admisión son de
// solo lectura porque los registra Admisión (REVISION.md, paso 3, punto 6).
// Admisión y diagnósticos salen del ingreso y del expediente; motivo, padecimiento, plan y pronóstico no
// existen en el backend (src/api/sinBackend.ts, nota de ingreso).
import { useQueryClient } from '@tanstack/react-query';
import { getNotaIngreso, saveNotaIngreso, useExtra, type NotaIngreso } from '../../api/sinBackend';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgOptBuenoEllipse from '../../assets/opt-bueno-ellipse.svg';
import imgOptReservadoEllipse from '../../assets/opt-reservado-ellipse.svg';
import { useRef, useState } from 'react';
import { BackButton, Badge, Button, Card, FieldError, focusFirst, InfoField, PatientLayout, Table, TextArea, usePatient, useSession, useToast, useValidation, type PatientView } from '../../components';
import { fmtDateTime, staffName } from '../../lib/clinical';
import { checkText } from '../../lib/validate';
import { cn } from '../../lib/cn';

const TYPE_LABEL: Record<string, string> = { definitivo: 'Definitivo', presuntivo: 'Presuntivo', diferencial: 'Diferencial' };

// Cada pronóstico se marca con su color (Reservado es el que muestra Figma).
const PROGNOSIS = [
  { label: 'Bueno', text: 'Evolución favorable esperada', box: 'border-success bg-[rgba(16,185,129,0.06)]', ring: 'border-success' },
  { label: 'Reservado', text: 'Evolución incierta sujeta a monitoreo', box: 'border-warning bg-[rgba(245,158,11,0.06)]', ring: '' },
  { label: 'Grave', text: 'Alto riesgo de complicaciones inminentes', box: 'border-danger bg-[rgba(239,68,68,0.06)]', ring: 'border-danger' },
];

const blockLabel = 'font-jakarta text-[12px] font-bold uppercase leading-[normal] text-muted';

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotaIngreso() {
  const { view } = usePatient();
  const nota = useExtra('ingreso', view?.cedula, getNotaIngreso);
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Nota de Ingreso`} title="Nota de Ingreso" tab="historia" actions={<BackButton />}>
      {view && nota.data && <NotaIngresoForm key={view.cedula} v={view} nota={nota.data} />}
    </PatientLayout>
  );
}

function NotaIngresoForm({ v, nota }: { v: PatientView; nota: NotaIngreso }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useSession();
  const [prognosis, setPrognosis] = useState<string>(nota.pronostico);
  const [motivo, setMotivo] = useState(nota.motivo);
  const [padecimiento, setPadecimiento] = useState(nota.padecimiento);
  const [plan, setPlan] = useState(() => nota.plan.map((text, i) => ({ id: i, text })));
  const admission: Array<[string, string]> = [
    ['Fecha y Hora de Ingreso', fmtDateTime(v.assigned?.admittedAt ?? v.patient.arrivedAt)],
    ['Servicio', v.assigned?.unit ?? '—'],
    ['Cama Asignada', v.bed ?? '—'],
    ['Médico Responsable', staffName('Carlos Méndez')],
  ];
  const diagnoses = (v.expediente?.diagnosticos ?? []).filter((d) => d.status === 'activo');
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
  const save = async () => {
    form.markAll();
    const bad = (Object.keys(form.errors) as Array<keyof typeof form.errors>).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los campos marcados', 'info');
      focusFirst([bad === 'ingreso-plan' ? (badPlanId !== undefined ? `ingreso-plan-${badPlanId}` : 'ingreso-plan-agregar') : bad]);
      return;
    }
    await saveNotaIngreso(v.cedula, {
      motivo: motivo.trim(),
      padecimiento: padecimiento.trim(),
      plan: plan.map((p) => p.text.trim()).filter(Boolean),
      pronostico: prognosis as NotaIngreso['pronostico'],
    });
    await queryClient.invalidateQueries({ queryKey: ['sinBackend', 'ingreso', v.cedula] });
    toast('Nota de ingreso guardada en este navegador');
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="flex w-full flex-col gap-4">
          <CardHeading>Datos de Admisión</CardHeading>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {admission.map(([label, value]) => (
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
            {can('historia_clinica', 'crear') && (
              <Button variant="soft" size="sm" to="/MedPacienteRegistroDiagnostico">
                + Agregar Diagnóstico
              </Button>
            )}
          </div>
          <div className="w-full overflow-hidden rounded-lg border border-line bg-white">
            <Table minWidth={420}>
              <div className="flex w-full gap-3 border-b border-line bg-surface px-3 py-2.5 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                <p className="w-[100px] shrink-0">CIE-10</p>
                <p className="min-w-0 flex-1">DESCRIPCIÓN</p>
                <p className="w-[120px] shrink-0">TIPO</p>
              </div>
              {diagnoses.map((d) => (
                <div key={d.id} className="flex w-full items-center gap-3 border-b border-line p-3 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <p className="w-[100px] shrink-0 font-bold text-ink">{String(d.code ?? '—')}</p>
                  <p className="min-w-0 flex-1 font-medium text-ink">{String(d.description)}</p>
                  <div className="w-[120px] shrink-0">
                    <Badge tone={d.type === 'definitivo' ? 'success' : d.type === 'diferencial' ? 'info' : 'warning'}>{TYPE_LABEL[String(d.type)] ?? String(d.type)}</Badge>
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
          <Button size="lg" onClick={() => void save()}>
            Guardar Nota de Ingreso
          </Button>
        </div>
      </div>
    </>
  );
}
