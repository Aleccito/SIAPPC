// Pantalla "med/paciente/interrogatorio-aparatos" (Figma node 183:6) — generada desde el diseño original de Figma.
// Paso 3: las observaciones se escriben. Son obligatorias (10 a 1000 caracteres) en los aparatos con
// síntomas marcados (REVISION.md, paso 3, punto 8).
import { useState } from 'react';
import imgActivity3 from '../../assets/activity-3.svg';
import imgBone from '../../assets/bone.svg';
import imgBrain from '../../assets/brain.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgCircleX from '../../assets/circle-x.svg';
import imgDroplet from '../../assets/droplet.svg';
import imgIconWrapper from '../../assets/icon-wrapper.svg';
import imgSparkles from '../../assets/sparkles.svg';
import { BackButton, Badge, Button, Card, Divider, focusFirst, PatientLayout, rowButton, TextArea, useToast, useValidation } from '../../components';
import { checkText } from '../../lib/validate';
import { cn } from '../../lib/cn';

type System = { icon: string; title: string; symptoms: string[]; checked: string[]; notes: string };

// Respiratorio y Cardiovascular vienen abiertos y con hallazgos, como en Figma; los
// síntomas de los demás aparatos son de ejemplo (sin marcar).
const SYSTEMS: System[] = [
  {
    icon: imgCircleX,
    title: 'Aparato Respiratorio',
    symptoms: ['Disnea', 'Tos', 'Expectoración', 'Hemoptisis', 'Dolor torácico', 'Sibilancias'],
    checked: ['Disnea', 'Tos', 'Dolor torácico', 'Sibilancias'],
    notes: 'Paciente refiere disnea de medianos esfuerzos que progresa a pequeños esfuerzos. Tos esporádica no productiva, acompañada de sibilancias inspiratorias ocasionales y dolor torácico opresivo leve.',
  },
  {
    icon: imgIconWrapper,
    title: 'Aparato Cardiovascular',
    symptoms: ['Dolor precordial', 'Palpitaciones', 'Edema', 'Disnea de esfuerzo', 'Claudicación'],
    checked: ['Dolor precordial', 'Palpitaciones', 'Edema', 'Disnea de esfuerzo'],
    notes: 'Se constata edema bilateral de miembros inferiores, grado II. Paciente refiere palpitaciones recurrentes tras mínimos esfuerzos y ortopnea.',
  },
  { icon: imgCircleX, title: 'Aparato Digestivo', symptoms: ['Náuseas', 'Vómito', 'Dolor abdominal', 'Diarrea', 'Estreñimiento'], checked: [], notes: '' },
  { icon: imgDroplet, title: 'Aparato Genitourinario', symptoms: ['Disuria', 'Poliuria', 'Hematuria', 'Oliguria'], checked: [], notes: '' },
  { icon: imgBone, title: 'Sistema Músculo-esquelético', symptoms: ['Artralgias', 'Mialgias', 'Rigidez', 'Debilidad'], checked: [], notes: '' },
  { icon: imgBrain, title: 'Sistema Neurológico', symptoms: ['Cefalea', 'Mareo', 'Convulsiones', 'Parestesias'], checked: [], notes: '' },
  { icon: imgActivity3, title: 'Sistema Endocrino', symptoms: ['Polidipsia', 'Intolerancia al frío', 'Intolerancia al calor', 'Cambios de peso'], checked: [], notes: '' },
  { icon: imgSparkles, title: 'Piel y Anexos', symptoms: ['Prurito', 'Exantema', 'Cambios de coloración', 'Lesiones'], checked: [], notes: '' },
];

const FindingsBadge = ({ count }: { count: number }) => (count > 0 ? <Badge tone="warning">Con hallazgos</Badge> : <Badge tone="success">Normal</Badge>);

export default function MedPacienteInterrogatorioAparatos() {
  const toast = useToast();
  const [open, setOpen] = useState(() => new Set(SYSTEMS.slice(0, 2).map((s) => s.title)));
  const [checked, setChecked] = useState(() => new Map(SYSTEMS.map((s) => [s.title, new Set(s.checked)])));

  const toggleOpen = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  const toggleSymptom = (title: string, name: string) =>
    setChecked((prev) => {
      const next = new Map(prev);
      const set = new Set(next.get(title));
      if (set.has(name)) set.delete(name);
      else set.add(name);
      next.set(title, set);
      return next;
    });

  const [notes, setNotes] = useState(() => SYSTEMS.map((s) => s.notes));
  // Observaciones obligatorias solo en los aparatos con algún síntoma marcado.
  const form = useValidation(
    Object.fromEntries(
      SYSTEMS.map((s, i) => [
        `obs-${i}`,
        () => checkText(notes[i], { required: (checked.get(s.title)?.size ?? 0) > 0, min: 10, max: 1000, requiredMessage: 'Describa los hallazgos de los síntomas marcados' }),
      ]),
    ) as Record<string, () => string | null>,
  );
  const save = () => {
    form.markAll();
    const bad = SYSTEMS.findIndex((_, i) => form.errors[`obs-${i}`]);
    if (bad >= 0) {
      // Si el error está en un aparato plegado, se despliega para mostrarlo.
      setOpen((prev) => new Set(prev).add(SYSTEMS[bad].title));
      toast('Revise los campos marcados', 'info');
      requestAnimationFrame(() => focusFirst([`obs-${bad}`]));
      return;
    }
    toast('Interrogatorio guardado');
  };

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Interrogatorio"
      title="Interrogatorio por Aparatos y Sistemas"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col gap-3">
        {SYSTEMS.map((s, i) => {
          const marks = checked.get(s.title) ?? new Set<string>();
          if (!open.has(s.title)) {
            return (
              <div
                key={s.title}
                {...rowButton(() => toggleOpen(s.title))}
                aria-expanded={false}
                aria-label={`Desplegar ${s.title}`}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-line bg-white p-4 outline-none transition-colors hover:bg-surface focus-visible:bg-primary-soft"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img className="size-6 shrink-0" alt="" src={s.icon} />
                  <p className="font-jakarta text-[14px] font-bold leading-[normal] text-ink">{s.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <FindingsBadge count={marks.size} />
                  <span className="flex size-7 items-center justify-center rounded-full border border-[#dbeafe] bg-[#f1f5f9]">
                    <img className="size-4 rotate-180" alt="" src={imgChevronDown2} />
                  </span>
                </div>
              </div>
            );
          }
          return (
            <Card key={s.title} className="flex w-full flex-col gap-4">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img className="size-6 shrink-0" alt="" src={s.icon} />
                  <h2 className="font-jakarta text-[16px] font-bold leading-[normal] text-ink">{s.title}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <FindingsBadge count={marks.size} />
                  <button type="button" onClick={() => toggleOpen(s.title)} aria-expanded aria-label={`Plegar ${s.title}`} className="flex rounded-full hover:opacity-80">
                    <img className="size-7" alt="" src={imgChevronDown2} />
                  </button>
                </div>
              </div>
              <Divider />
              <ul className="flex w-full flex-wrap gap-x-4 gap-y-2">
                {s.symptoms.map((name) => {
                  const on = marks.has(name);
                  return (
                    <li key={name}>
                      <button type="button" role="checkbox" aria-checked={on} onClick={() => toggleSymptom(s.title, name)} className="flex items-center gap-2">
                        <span className={cn('size-[18px] shrink-0 rounded', on ? 'bg-primary' : 'border border-line')} />
                        <span className={cn('font-jakarta text-[14px] font-medium leading-[normal]', on ? 'text-ink' : 'text-muted')}>{name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex w-full flex-col gap-2">
                <label htmlFor={`obs-${i}`} className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">
                  OBSERVACIONES
                </label>
                <TextArea
                  id={`obs-${i}`}
                  value={notes[i]}
                  onChange={(v) => setNotes((all) => all.map((n, j) => (j === i ? v : n)))}
                  onBlur={() => form.touch(`obs-${i}`)}
                  placeholder="Sin hallazgos."
                  tone="surface"
                  textSize={14}
                  minHeight={0}
                  maxLength={1000}
                  error={form.show(`obs-${i}`)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button size="lg" onClick={save}>
          Guardar Interrogatorio
        </Button>
      </div>
    </PatientLayout>
  );
}
