// Pantalla "med/paciente/exploracion-fisica" (Figma node 183:234) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { BackButton, Badge, Button, Card, Divider, PatientLayout, useToast } from '../../components';
import { cn } from '../../lib/cn';

const SOMATOMETRY: Array<[string, string, string?]> = [
  ['PESO', '68 kg'],
  ['TALLA', '165 cm'],
  ['IMC', '24.9', 'Normal'],
  ['PERÍMETRO ABD.', '82 cm'],
];

const VITALS = [
  ['F. CARDÍACA', '78 lpm'],
  ['F. RESPIRATORIA', '16 rpm'],
  ['TENSIÓN ART.', '120/80 mmHg'],
  ['TEMPERATURA', '36.5 °C'],
  ['SAT. OXÍGENO', '98%'],
  ['GLASGOW', '15/15'],
];

const REGIONS = ['Cabeza y cuello', 'Tórax', 'Abdomen', 'Extremidades superiores', 'Extremidades inferiores', 'Neurológico'];

type Finding = { label: string; normal: boolean; text: string };

const f = (label: string, normal: boolean, text: string): Finding => ({ label, normal, text });

const FINDINGS: Finding[] = [
  { label: 'INSPECCIÓN', normal: true, text: 'Tórax simétrico, normolíneo, movimientos respiratorios rítmicos sin uso de músculos accesorios.' },
  { label: 'PALPACIÓN', normal: true, text: 'Amplexión y amplexación normales, vibraciones vocales palpables y simétricas sin frémitos.' },
  { label: 'PERCUSIÓN', normal: true, text: 'Claro pulmonar conservado en ambos hemitórax, matidez cardíaca en límites normales.' },
  { label: 'AUSCULTACIÓN', normal: false, text: 'Murmullo vesicular disminuido basal bilateral. Se auscultan estertores crepitantes húmedos en ambas bases pulmonares.' },
];

// Tórax conserva el texto de Figma; las demás regiones llevan hallazgos de ejemplo.
const BY_REGION: Record<string, Finding[]> = {
  'Cabeza y cuello': [
    f('INSPECCIÓN', false, 'Normocéfala, mucosas orales semihidratadas. Ingurgitación yugular grado II a 45°.'),
    f('PALPACIÓN', true, 'Tiroides no palpable, sin adenomegalias cervicales.'),
    f('PERCUSIÓN', true, 'Sin hallazgos relevantes.'),
    f('AUSCULTACIÓN', true, 'Sin soplos carotídeos.'),
  ],
  Tórax: FINDINGS,
  Abdomen: [
    f('INSPECCIÓN', true, 'Abdomen plano, sin cicatrices ni red venosa colateral.'),
    f('PALPACIÓN', false, 'Blando, depresible, hepatomegalia de 2 cm bajo el reborde costal, levemente dolorosa.'),
    f('PERCUSIÓN', true, 'Timpanismo conservado, sin matidez cambiante.'),
    f('AUSCULTACIÓN', true, 'Peristalsis presente y normal.'),
  ],
  'Extremidades superiores': [
    f('INSPECCIÓN', true, 'Simétricas, sin deformidades. Catéter venoso periférico en antebrazo izquierdo sin datos de flebitis.'),
    f('PALPACIÓN', true, 'Pulsos radiales presentes y simétricos. Llenado capilar de 2 segundos.'),
    f('MOVILIDAD', true, 'Arcos de movilidad completos.'),
    f('FUERZA', true, 'Fuerza 5/5 bilateral.'),
  ],
  'Extremidades inferiores': [
    f('INSPECCIÓN', false, 'Edema bilateral con fóvea ++ hasta el tercio medio de las piernas.'),
    f('PALPACIÓN', true, 'Pulsos pedios y tibiales posteriores presentes.'),
    f('MOVILIDAD', true, 'Arcos de movilidad conservados.'),
    f('FUERZA', true, 'Fuerza 5/5 bilateral.'),
  ],
  Neurológico: [
    f('ESTADO DE ALERTA', true, 'Despierta, orientada en tiempo, lugar y persona. Glasgow 15/15.'),
    f('PARES CRANEALES', true, 'Sin alteraciones.'),
    f('MOTOR', true, 'Fuerza y tono conservados en las cuatro extremidades.'),
    f('SENSIBILIDAD', true, 'Sin déficit sensitivo. Reflejos osteotendinosos ++/++++.'),
  ],
};

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[14px] font-bold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteExploracionFisica() {
  const toast = useToast();
  const [region, setRegion] = useState('Tórax');

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Exploración Física"
      title="Exploración Física"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col gap-4">
          <CardHeading>Somatometría de Ingreso</CardHeading>
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {SOMATOMETRY.map(([label, value, note]) => (
              <div key={label} className="flex min-w-0 flex-col gap-1 rounded-lg bg-surface p-3 leading-[normal]">
                <p className="font-jakarta text-[11px] font-semibold text-muted">{label}</p>
                <p className="font-jakarta text-[18px] font-extrabold text-ink">
                  {value} {note && <span className="text-[11px] font-medium text-success">{note}</span>}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex min-w-0 flex-1 flex-col gap-4">
          <CardHeading>Signos Vitales de Ingreso</CardHeading>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {VITALS.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 rounded-md bg-surface p-2 leading-[normal]">
                <p className="font-jakarta text-[10px] font-semibold text-muted">{label}</p>
                <p className="font-jakarta text-[14px] font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
        <Card padding="none" className="flex w-full flex-row gap-1 overflow-x-auto p-2 lg:w-[260px] lg:shrink-0 lg:flex-col">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
              className={cn(
                'shrink-0 rounded-lg px-4 py-3 text-left font-jakarta text-[14px] leading-[normal] transition-colors lg:w-full',
                region === r ? 'bg-primary-soft font-bold text-primary' : 'font-medium text-ink hover:bg-surface',
              )}
            >
              {r}
            </button>
          ))}
        </Card>

        <Card padding="lg" className="flex w-full min-w-0 flex-1 flex-col gap-5">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Exploración Detallada: {region}</h2>
            <Badge tone="info">Región Activa</Badge>
          </div>
          <Divider />
          <div className="flex w-full flex-col gap-4">
            {BY_REGION[region].map((item) => (
              <div key={item.label} className="flex w-full flex-col gap-1.5">
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">{item.label}</p>
                  <Badge tone={item.normal ? 'success' : 'danger'} size="sm">
                    {item.normal ? 'Normal' : 'Anormal'}
                  </Badge>
                </div>
                <div className="w-full rounded-lg border border-line bg-surface p-[10px]">
                  <p className="font-jakarta text-[13px] font-normal leading-[normal] text-ink">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button size="lg" onClick={() => toast('Exploración guardada')}>
          Guardar
        </Button>
      </div>
    </PatientLayout>
  );
}
