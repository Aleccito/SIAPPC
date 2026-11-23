// Pantalla "med/paciente/interrogatorio-aparatos" (Figma node 183:6) — generada desde el diseño original de Figma.
// Las casillas son dibujos (paso 3 del plan las vuelve marcables).
import imgActivity3 from '../../assets/activity-3.svg';
import imgBone from '../../assets/bone.svg';
import imgBrain from '../../assets/brain.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgCircleX from '../../assets/circle-x.svg';
import imgDroplet from '../../assets/droplet.svg';
import imgIconWrapper from '../../assets/icon-wrapper.svg';
import imgSparkles from '../../assets/sparkles.svg';
import { BackButton, Badge, Button, Card, Divider, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';

type Symptom = [string, boolean];

const EXPANDED: Array<{ icon: string; title: string; symptoms: Symptom[]; notes: string }> = [
  {
    icon: imgCircleX,
    title: 'Aparato Respiratorio',
    symptoms: [['Disnea', true], ['Tos', true], ['Expectoración', false], ['Hemoptisis', false], ['Dolor torácico', true], ['Sibilancias', true]],
    notes: 'Paciente refiere disnea de medianos esfuerzos que progresa a pequeños esfuerzos. Tos esporádica no productiva, acompañada de sibilancias inspiratorias ocasionales y dolor torácico opresivo leve.',
  },
  {
    icon: imgIconWrapper,
    title: 'Aparato Cardiovascular',
    symptoms: [['Dolor precordial', true], ['Palpitaciones', true], ['Edema', true], ['Disnea de esfuerzo', true], ['Claudicación', false]],
    notes: 'Se constata edema bilateral de miembros inferiores, grado II. Paciente refiere palpitaciones recurrentes tras mínimos esfuerzos y ortopnea.',
  },
];

const COLLAPSED: Array<[string, string]> = [
  [imgCircleX, 'Aparato Digestivo'],
  [imgDroplet, 'Aparato Genitourinario'],
  [imgBone, 'Sistema Músculo-esquelético'],
  [imgBrain, 'Sistema Neurológico'],
  [imgActivity3, 'Sistema Endocrino'],
  [imgSparkles, 'Piel y Anexos'],
];

export default function MedPacienteInterrogatorioAparatos() {
  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Interrogatorio"
      title="Interrogatorio por Aparatos y Sistemas"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col gap-3">
        {EXPANDED.map((s) => (
          <Card key={s.title} className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img className="size-6 shrink-0" alt="" src={s.icon} />
                <h2 className="font-jakarta text-[16px] font-bold leading-[normal] text-ink">{s.title}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Badge tone="warning">Con hallazgos</Badge>
                <img className="size-7" alt="" src={imgChevronDown2} />
              </div>
            </div>
            <Divider />
            <ul className="flex w-full flex-wrap gap-x-4 gap-y-2">
              {s.symptoms.map(([name, checked]) => (
                <li key={name} className="flex items-center gap-2">
                  <span
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={name}
                    className={cn('size-[18px] shrink-0 rounded', checked ? 'bg-primary' : 'border border-line')}
                  />
                  <span className={cn('font-jakarta text-[14px] font-medium leading-[normal]', checked ? 'text-ink' : 'text-muted')}>{name}</span>
                </li>
              ))}
            </ul>
            <div className="flex w-full flex-col gap-2">
              <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">OBSERVACIONES</p>
              <div className="w-full rounded-lg border border-line bg-surface p-3">
                <p className="font-jakarta text-[14px] font-normal leading-[normal] text-ink">{s.notes}</p>
              </div>
            </div>
          </Card>
        ))}

        {COLLAPSED.map(([icon, title]) => (
          <div key={title} className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
            <div className="flex min-w-0 items-center gap-3">
              <img className="size-6 shrink-0" alt="" src={icon} />
              <p className="font-jakarta text-[14px] font-bold leading-[normal] text-ink">{title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge tone="success">Normal</Badge>
              <span className="flex size-7 items-center justify-center rounded-full border border-[#dbeafe] bg-[#f1f5f9]">
                <img className="size-4 rotate-180" alt="" src={imgChevronDown2} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button size="lg">Guardar Interrogatorio</Button>
      </div>
    </PatientLayout>
  );
}
