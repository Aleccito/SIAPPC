// Pantalla "med/paciente/exploracion-fisica" (Figma node 183:234) — generada desde el diseño original de Figma.
// Paso 3: somatometría y signos vitales se editan en su lugar (rangos posibles de cada signo), el IMC se
// calcula solo y los hallazgos se escriben; un hallazgo "Anormal" necesita descripción (REVISION.md, paso 3, punto 7).
import { useState } from 'react';
import { BackButton, Badge, Button, Card, Divider, FieldError, focusFirst, NumberField, PatientLayout, TextArea, useToast, useValidation } from '../../components';
import { cn } from '../../lib/cn';
import { checkNumber, checkPressure, checkText, parseNumber, VITAL_RANGES, type NumberRule } from '../../lib/validate';

type Soma = { weight: string; height: string; waist: string };
type Vitals = { fc: string; fr: string; ta: string; temp: string; spo2: string; gcs: string };

// Valores de Figma.
const SOMA: Soma = { weight: '68', height: '165', waist: '82' };
const VITALS: Vitals = { fc: '78', fr: '16', ta: '120/80', temp: '36.5', spo2: '98', gcs: '15' };

/** Recuadros de signos vitales: etiqueta, unidad tal como la escribe Figma y regla de validación. */
const VITAL_TILES: Array<{ key: keyof Vitals; label: string; unit: string; rule?: NumberRule }> = [
  { key: 'fc', label: 'F. CARDÍACA', unit: ' lpm', rule: VITAL_RANGES.fc },
  { key: 'fr', label: 'F. RESPIRATORIA', unit: ' rpm', rule: VITAL_RANGES.fr },
  { key: 'ta', label: 'TENSIÓN ART.', unit: ' mmHg' },
  { key: 'temp', label: 'TEMPERATURA', unit: ' °C', rule: VITAL_RANGES.temp },
  { key: 'spo2', label: 'SAT. OXÍGENO', unit: '%', rule: VITAL_RANGES.spo2 },
  { key: 'gcs', label: 'GLASGOW', unit: '/15', rule: VITAL_RANGES.gcs },
];

/** IMC con un decimal (truncado, como en Figma: 68 kg y 165 cm dan 24.9) y su categoría. */
function bmi(s: Soma) {
  const w = parseNumber(s.weight);
  const h = parseNumber(s.height);
  if (!w || !h || checkNumber(s.weight, VITAL_RANGES.weight) || checkNumber(s.height, VITAL_RANGES.height)) return null;
  const value = Math.floor((w / (h / 100) ** 2) * 10) / 10;
  const [label, color] =
    value < 18.5 ? ['Bajo peso', 'text-warning'] : value < 25 ? ['Normal', 'text-success'] : value < 30 ? ['Sobrepeso', 'text-warning'] : ['Obesidad', 'text-danger'];
  return { value: value.toFixed(1), label, color };
}

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

// Lo guardado se conserva mientras no se recargue la página (sin backend).
let saved: { soma: Soma; vitals: Vitals; findings: Record<string, Finding[]> } | null = null;

const findingKey = (r: number, i: number) => `hallazgo-${r}-${i}`;
const checkFinding = (item: Finding) =>
  checkText(item.text, item.normal ? { max: 500 } : { required: true, min: 10, max: 500, requiredMessage: 'Describa el hallazgo anormal' });

export default function MedPacienteExploracionFisica() {
  const toast = useToast();
  const [region, setRegion] = useState('Tórax');
  const [soma, setSoma] = useState(() => saved?.soma ?? SOMA);
  const [vitals, setVitals] = useState(() => saved?.vitals ?? VITALS);
  const [findings, setFindings] = useState(() => saved?.findings ?? structuredClone(BY_REGION));
  const imc = bmi(soma);

  const rules: Record<string, () => string | null> = {
    'explo-weight': () => checkNumber(soma.weight, VITAL_RANGES.weight),
    'explo-height': () => checkNumber(soma.height, VITAL_RANGES.height),
    'explo-waist': () => checkNumber(soma.waist, { ...VITAL_RANGES.waist, required: false }),
  };
  for (const t of VITAL_TILES) rules[`explo-${t.key}`] = () => (t.rule ? checkNumber(vitals[t.key], t.rule) : checkPressure(vitals[t.key]));
  REGIONS.forEach((r, ri) => findings[r].forEach((item, i) => (rules[findingKey(ri, i)] = () => checkFinding(item))));
  const form = useValidation(rules);
  const regionHasError = (ri: number) => findings[REGIONS[ri]].some((_, i) => form.show(findingKey(ri, i)));

  const setFinding = (r: string, i: number, change: Partial<Finding>) =>
    setFindings((all) => ({ ...all, [r]: all[r].map((x, j) => (j === i ? { ...x, ...change } : x)) }));

  const save = () => {
    form.markAll();
    const bad = Object.keys(rules).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los campos marcados', 'info');
      // Un hallazgo con error en otra región: se abre esa región antes de llevar el cursor.
      const m = /^hallazgo-(\d+)-/.exec(bad);
      if (m) setRegion(REGIONS[Number(m[1])]);
      requestAnimationFrame(() => focusFirst([bad]));
      return;
    }
    saved = { soma, vitals, findings };
    toast('Exploración guardada');
  };

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
          {/* 4 recuadros solo con la tarjeta ancha: a 1024 px el texto se salía (REVISION.md, V11). */}
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {(
              [
                ['weight', 'PESO', ' kg', 1],
                ['height', 'TALLA', ' cm', 0],
                ['imc', 'IMC', '', 0],
                ['waist', 'PERÍMETRO ABD.', ' cm', 0],
              ] as const
            ).map(([key, label, unit, decimals]) => {
              const error = key === 'imc' ? null : form.show(`explo-${key}`);
              return (
                <div key={key} className="flex min-w-0 flex-col gap-1 rounded-lg bg-surface p-3 leading-[normal]">
                  {key === 'imc' ? (
                    <p className="font-jakarta text-[11px] font-semibold text-muted">{label}</p>
                  ) : (
                    <label htmlFor={`explo-${key}`} className="font-jakarta text-[11px] font-semibold text-muted">
                      {label}
                    </label>
                  )}
                  <p className="font-jakarta text-[18px] font-extrabold text-ink">
                    {key === 'imc' ? (
                      imc ? (
                        <>
                          {imc.value} <span className={cn('text-[11px] font-medium', imc.color)}>{imc.label}</span>
                        </>
                      ) : (
                        <span className="text-subtle">—</span>
                      )
                    ) : (
                      <>
                        <NumberField
                          id={`explo-${key}`}
                          appearance="inline"
                          decimals={decimals}
                          value={soma[key]}
                          onChange={(v) => setSoma((x) => ({ ...x, [key]: v }))}
                          onBlur={() => form.touch(`explo-${key}`)}
                          aria-required={key !== 'waist'}
                          error={error}
                        />
                        {unit}
                      </>
                    )}
                  </p>
                  <FieldError forId={`explo-${key}`} error={error} className="text-[11px]" />
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="flex min-w-0 flex-1 flex-col gap-4">
          <CardHeading>Signos Vitales de Ingreso</CardHeading>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {VITAL_TILES.map((t) => {
              const id = `explo-${t.key}`;
              const error = form.show(id);
              return (
                <div key={t.key} className="flex flex-col gap-0.5 rounded-md bg-surface p-2 leading-[normal]">
                  <label htmlFor={id} className="font-jakarta text-[10px] font-semibold text-muted">
                    {t.label}
                  </label>
                  <p className="font-jakarta text-[14px] font-bold text-ink">
                    <NumberField
                      id={id}
                      appearance="inline"
                      decimals={t.rule?.decimals}
                      pressure={t.key === 'ta'}
                      value={vitals[t.key]}
                      onChange={(v) => setVitals((x) => ({ ...x, [t.key]: v }))}
                      onBlur={() => form.touch(id)}
                      aria-required
                      error={error}
                    />
                    {t.unit}
                  </p>
                  <FieldError forId={id} error={error} className="text-[11px]" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
        <Card padding="none" className="flex w-full flex-row gap-1 overflow-x-auto p-2 lg:w-[260px] lg:shrink-0 lg:flex-col">
          {REGIONS.map((r, ri) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
              className={cn(
                'flex shrink-0 items-center justify-between gap-2 rounded-lg px-4 py-3 text-left font-jakarta text-[14px] leading-[normal] transition-colors lg:w-full',
                region === r ? 'bg-primary-soft font-bold text-primary' : 'font-medium text-ink hover:bg-surface',
              )}
            >
              {r}
              {/* Punto rojo: esta región tiene un hallazgo con error. */}
              {regionHasError(ri) && <span className="size-2 shrink-0 rounded-full bg-danger" aria-label="con errores" />}
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
            {findings[region].map((item, i) => {
              const id = findingKey(REGIONS.indexOf(region), i);
              return (
                <div key={item.label} className="flex w-full flex-col gap-1.5">
                  <div className="flex w-full items-center justify-between gap-3">
                    <label htmlFor={id} className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">
                      {item.label}
                    </label>
                    {/* La etiqueta se toca para cambiar entre Normal y Anormal. */}
                    <button
                      type="button"
                      aria-pressed={!item.normal}
                      aria-label={`${item.label}: ${item.normal ? 'Normal' : 'Anormal'}. Cambiar`}
                      onClick={() => setFinding(region, i, { normal: !item.normal })}
                      className="flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <Badge tone={item.normal ? 'success' : 'danger'} size="sm">
                        {item.normal ? 'Normal' : 'Anormal'}
                      </Badge>
                    </button>
                  </div>
                  <TextArea
                    id={id}
                    value={item.text}
                    onChange={(v) => setFinding(region, i, { text: v })}
                    onBlur={() => form.touch(id)}
                    placeholder="Sin hallazgos."
                    tone="surface"
                    padding="sm"
                    minHeight={0}
                    maxLength={500}
                    error={form.show(id)}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button size="lg" onClick={save}>
          Guardar
        </Button>
      </div>
    </PatientLayout>
  );
}
