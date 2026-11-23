// Pantalla "med/paciente/nota-ingreso" (Figma node 183:603) — generada desde el diseño original de Figma.
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgOptBuenoEllipse from '../../assets/opt-bueno-ellipse.svg';
import imgOptReservadoEllipse from '../../assets/opt-reservado-ellipse.svg';
import { BackButton, Badge, Button, Card, InfoField, PatientLayout, Table, TextBlock } from '../../components';
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

const PROGNOSIS = [
  { label: 'Bueno', text: 'Evolución favorable esperada' },
  { label: 'Reservado', text: 'Evolución incierta sujeta a monitoreo', selected: true },
  { label: 'Grave', text: 'Alto riesgo de complicaciones inminentes' },
];

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotaIngreso() {
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
          <TextBlock label="Motivo de Ingreso">Disnea progresiva y dificultad para respirar en reposo de 48 horas de evolución</TextBlock>
          <TextBlock label="Padecimiento Actual">
            Paciente femenina de 67 años con antecedente de Insuficiencia Cardíaca Congestiva (ICC) que presenta disnea progresiva de 48 horas de evolución, exacerbada en decúbito (ortopnea) y acompañada de tos seca no productiva. Al ingreso se documenta taquipnea, desaturación y signos clínicos compatibles con sobrecarga hídrica aguda / edema agudo de pulmón.
          </TextBlock>
        </Card>

        <Card className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Diagnósticos de Ingreso</CardHeading>
            <Button variant="soft" size="sm">+ Agregar Diagnóstico</Button>
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
            <ul className="flex w-full flex-col gap-[10px]">
              {PLAN.map((item) => (
                <li key={item} className="flex w-full items-center gap-2">
                  <img className="size-1.5 shrink-0" alt="" src={imgBulletItemEllipse} />
                  <p className="min-w-0 flex-1 font-jakarta text-[13px] font-medium leading-[normal] text-ink">{item}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="flex w-full min-w-0 flex-col gap-4 lg:w-[400px] lg:shrink-0">
            <CardHeading>Pronóstico de Ingreso</CardHeading>
            <div className="flex w-full flex-col gap-[10px]" role="radiogroup" aria-label="Pronóstico de ingreso">
              {PROGNOSIS.map((p) => (
                <div
                  key={p.label}
                  role="radio"
                  aria-checked={!!p.selected}
                  className={cn('flex w-full items-center gap-3 rounded-lg border p-3', p.selected ? 'border-warning bg-[rgba(245,158,11,0.06)]' : 'border-line bg-surface')}
                >
                  <img className="size-4 shrink-0" alt="" src={p.selected ? imgOptReservadoEllipse : imgOptBuenoEllipse} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[14px] font-bold text-ink">{p.label}</p>
                    <p className="font-jakarta text-[11px] font-medium text-muted">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex w-full justify-end">
          <Button size="lg">Guardar Nota de Ingreso</Button>
        </div>
      </div>
    </PatientLayout>
  );
}
