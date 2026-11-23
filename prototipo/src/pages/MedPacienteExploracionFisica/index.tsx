// Pantalla "med/paciente/exploracion-fisica" (Figma node 183:234) — generada desde el diseño original de Figma.
import { BackButton, Badge, Button, Card, Divider, PatientLayout } from '../../components';
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

const FINDINGS: Array<{ label: string; normal: boolean; text: string }> = [
  { label: 'INSPECCIÓN', normal: true, text: 'Tórax simétrico, normolíneo, movimientos respiratorios rítmicos sin uso de músculos accesorios.' },
  { label: 'PALPACIÓN', normal: true, text: 'Amplexión y amplexación normales, vibraciones vocales palpables y simétricas sin frémitos.' },
  { label: 'PERCUSIÓN', normal: true, text: 'Claro pulmonar conservado en ambos hemitórax, matidez cardíaca en límites normales.' },
  { label: 'AUSCULTACIÓN', normal: false, text: 'Murmullo vesicular disminuido basal bilateral. Se auscultan estertores crepitantes húmedos en ambas bases pulmonares.' },
];

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[14px] font-bold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteExploracionFisica() {
  const region = 'Tórax';

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
            {FINDINGS.map((f) => (
              <div key={f.label} className="flex w-full flex-col gap-1.5">
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">{f.label}</p>
                  <Badge tone={f.normal ? 'success' : 'danger'} size="sm">
                    {f.normal ? 'Normal' : 'Anormal'}
                  </Badge>
                </div>
                <div className="w-full rounded-lg border border-line bg-surface p-[10px]">
                  <p className="font-jakarta text-[13px] font-normal leading-[normal] text-ink">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button size="lg">Guardar</Button>
      </div>
    </PatientLayout>
  );
}
