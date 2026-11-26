// Pantalla "med/paciente/registro-diagnostico" (Figma node 140:499) — generada desde el diseño original de Figma.
// Paso 3: el CIE-10 se busca escribiendo; descripción (20 a 1000 caracteres), fecha (no futura ni anterior al
// ingreso) y notas (hasta 1000) son campos reales (REVISION.md, paso 3, punto 5).
// Registra con POST /historia/:id/diagnosticos (o PATCH si llega ?diagnostico=<id> desde "editar").
// El backend no tiene "severidad" ni "hallazgos" en el diagnóstico: van en `notas`.
import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, request } from '../../api/http';
import type { HistoriaEntry } from '../../api/types/clinical';
import imgSearch3 from '../../assets/search-3.svg';
import { BackButton, Badge, Button, Card, Combobox, DateField, Divider, FieldError, focusFirst, IconChevronDown, PatientLayout, type PatientView, rowButton, Select, TextArea, usePatient, useToast, useValidation } from '../../components';
import { AiIdeasCard } from '../../components/ai';
import { matches, plain } from '../../lib/text';
import { fmtDate } from '../../lib/clinical';
import { checkDate, checkText, todayIso } from '../../lib/validate';
import { cn } from '../../lib/cn';
import { usePatientNavigate } from '../../lib/patientLink';

const SEVERITY = ['Leve', 'Moderada', 'Severa', 'Crítica'];
/** Los valores del enum `TipoDiagnostico` del backend. */
const TYPES = [
  { value: 'presuntivo', label: 'Presuntivo' },
  { value: 'definitivo', label: 'Definitivo' },
  { value: 'diferencial', label: 'Diferencial' },
];
/**
 * Qué escribir en el buscador de CIE-10 para una hipótesis de la IA (PR 3): la palabra (o el final de una palabra
 * larga, "tromboembolia" → "embolia") que encuentra menos códigos sin quedarse en cero. Si ninguna encuentra, la
 * primera palabra: el médico la corrige.
 */
function cie10Query(title: string): string {
  const words = plain(title)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 && !['clase', 'alto', 'grado', 'riesgo', 'posible', 'probable'].includes(w));
  const candidates = [...words, ...words.filter((w) => w.length > 8).map((w) => w.slice(-7))];
  let best: [string, number] | null = null;
  for (const c of candidates) {
    const n = CIE10.filter(([code, label]) => matches(c, label, code)).length;
    if (n > 0 && (!best || n < best[1])) best = [c, n];
  }
  return best?.[0] ?? words[0] ?? title;
}

/** Códigos CIE-10 frecuentes en UCI (datos de ejemplo); el campo los busca por código o por texto. */
const CIE10: Array<[string, string]> = [
  ['I50.9', 'Insuficiencia cardíaca, no especificada'],
  ['I50.1', 'Insuficiencia ventricular izquierda'],
  ['J81', 'Edema pulmonar'],
  ['I10', 'Hipertensión esencial (primaria)'],
  ['I11.0', 'Enfermedad cardíaca hipertensiva con insuficiencia cardíaca'],
  ['I21.9', 'Infarto agudo del miocardio, sin otra especificación'],
  ['I48', 'Fibrilación y aleteo auricular'],
  ['I26.9', 'Embolia pulmonar sin mención de corazón pulmonar agudo'],
  ['I63.9', 'Infarto cerebral, no especificado'],
  ['E11.9', 'Diabetes mellitus tipo 2 sin complicaciones'],
  ['E86', 'Depleción del volumen'],
  ['E87.1', 'Hiposmolaridad e hiponatremia'],
  ['E87.6', 'Hipopotasemia'],
  ['N17.9', 'Insuficiencia renal aguda, no especificada'],
  ['N18.9', 'Enfermedad renal crónica, no especificada'],
  ['N39.0', 'Infección de vías urinarias, sitio no especificado'],
  ['J18.9', 'Neumonía, no especificada'],
  ['J44.1', 'Enfermedad pulmonar obstructiva crónica con exacerbación aguda'],
  ['J80', 'Síndrome de dificultad respiratoria del adulto'],
  ['J96.0', 'Insuficiencia respiratoria aguda'],
  ['A41.9', 'Sepsis, no especificada'],
  ['R57.0', 'Choque cardiogénico'],
  ['R57.1', 'Choque hipovolémico'],
  ['R40.2', 'Coma, no especificado'],
  ['G93.1', 'Lesión cerebral anóxica, no clasificada en otra parte'],
  ['K85.9', 'Pancreatitis aguda, no especificada'],
  ['K92.2', 'Hemorragia gastrointestinal, no especificada'],
  ['D64.9', 'Anemia de tipo no especificado'],
  ['S06.9', 'Traumatismo intracraneal, no especificado'],
  ['T07', 'Traumatismos múltiples, no especificados'],
  // Los de los 8 pacientes del seed.
  ['N10', 'Nefritis tubulointersticial aguda (pielonefritis)'],
  ['S72.0', 'Fractura del cuello del fémur'],
  ['S72.9', 'Fractura del fémur, parte no especificada'],
  ['S36.9', 'Traumatismo de órgano intraabdominal no especificado'],
  ['R00.1', 'Bradicardia, no especificada'],
  ['T46.0', 'Envenenamiento por glucósidos cardiotónicos'],
  ['E87.5', 'Hiperpotasemia'],
  ['I47.9', 'Taquicardia paroxística, no especificada'],
  ['I48.9', 'Fibrilación y aleteo auricular, no especificado'],
  ['R07.4', 'Dolor en el pecho, no especificado'],
];
const CIE10_OPTIONS = CIE10.map(([code, text]) => ({ value: code, label: `${code} ${text}` }));

const TYPE_TONE: Record<string, 'success' | 'warning' | 'info'> = { definitivo: 'success', presuntivo: 'warning', diferencial: 'info' };

const Field = ({ label, htmlFor, children, className }: { label: string; htmlFor?: string; children: ReactNode; className?: string }) => (
  <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
    {htmlFor ? (
      <label htmlFor={htmlFor} className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">
        {label}
      </label>
    ) : (
      <p className="font-jakarta text-[12px] font-bold leading-[normal] text-muted">{label}</p>
    )}
    {children}
  </div>
);


export default function MedPacienteRegistroDiagnostico() {
  const { view } = usePatient();
  const [params] = useSearchParams();
  const editId = params.get('diagnostico');
  const editing = view?.expediente?.diagnosticos.find((d) => d.id === editId);
  return (
    <PatientLayout
      breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica`}
      title={editing ? 'Editar Diagnóstico' : 'Registro de Nuevo Diagnóstico'}
      tab="historia"
      actions={<BackButton />}
    >
      {view?.expediente && <Registro key={editing?.id ?? 'nuevo'} v={view} editing={editing} />}
    </PatientLayout>
  );
}

/** "Severidad: Severa. Hallazgos: … Plan: …" ⇄ los tres campos del formulario. */
function readNotes(notes: unknown) {
  const text = typeof notes === 'string' ? notes : '';
  return {
    severity: /Severidad: (\w+)/.exec(text)?.[1] ?? 'Moderada',
    description: /Hallazgos: ([\s\S]*?)(?: Plan: |$)/.exec(text)?.[1] ?? '',
    plan: / Plan: ([\s\S]*)$/.exec(text)?.[1] ?? '',
  };
}

function Registro({ v, editing }: { v: PatientView; editing: HistoriaEntry | undefined }) {
  const navigate = usePatientNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const previous = readNotes(editing?.notes);
  // La fecha del diagnóstico no puede ser anterior al ingreso.
  const admission = (v.assigned?.admittedAt ?? v.patient.arrivedAt).slice(0, 10);
  const [type, setType] = useState(String(editing?.type ?? 'presuntivo'));
  const [code, setCode] = useState(String(editing?.code ?? ''));
  const [cieSearch, setCieSearch] = useState<{ text: string; seq: number } | null>(null);
  const [severity, setSeverity] = useState(previous.severity);
  const [description, setDescription] = useState(previous.description);
  const [date, setDate] = useState(String(editing?.diagnosedOn ?? todayIso()));
  const [notes, setNotes] = useState(previous.plan);
  const [saving, setSaving] = useState(false);
  const form = useValidation({
    'dx-cie10': () => (code ? null : 'Elija un código de la lista'),
    'dx-descripcion': () => checkText(description, { required: true, min: 20, max: 1000, requiredMessage: 'Describa los hallazgos clínicos' }),
    'dx-fecha': () => checkDate(date, { notBefore: editing ? undefined : admission }),
    'dx-notas': () => checkText(notes, { max: 1000 }),
  });
  const chevron = <IconChevronDown size={14} className="text-muted" />;
  const others = (v.expediente?.diagnosticos ?? []).filter((d) => d.id !== editing?.id);

  const register = async () => {
    form.markAll();
    const bad = (Object.keys(form.errors) as Array<keyof typeof form.errors>).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los campos marcados', 'info');
      focusFirst([bad]);
      return;
    }
    if (saving) return;
    setSaving(true);
    const [, text] = CIE10.find(([c]) => c === code) ?? [code, code];
    const body = {
      code,
      description: text,
      type,
      status: 'activo',
      diagnosedOn: date,
      notes: `Severidad: ${severity}. Hallazgos: ${description.trim()}${notes.trim() ? ` Plan: ${notes.trim()}` : ''}`,
    };
    try {
      const path = `/historia/${v.id}/diagnosticos`;
      if (editing) await request(`${path}/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      else await request(path, { method: 'POST', body: JSON.stringify(body) });
      await queryClient.invalidateQueries({ queryKey: ['expediente', v.id] });
      toast(`Diagnóstico ${editing ? 'actualizado' : 'registrado'} · ${code}`);
      navigate('/MedPacienteDiagnosticosActivos');
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede registrar diagnósticos' : 'No se pudo registrar el diagnóstico', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Formulario de Diagnóstico Clínico</h2>

          <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
            <Field label="Tipo de Diagnóstico">
              <Select variant="input" options={TYPES} value={type} onChange={setType} trailingIcon={chevron} ariaLabel="Tipo de Diagnóstico" />
            </Field>
            <Field label="Código CIE-10" htmlFor="dx-cie10">
              {/* Cerrado muestra código y descripción (en dos líneas si no caben, a 390 px); al tocarlo se escribe para buscar. */}
              <Combobox
                id="dx-cie10"
                label="Código CIE-10"
                options={CIE10_OPTIONS}
                value={code}
                onChange={setCode}
                onBlur={() => form.touch('dx-cie10')}
                placeholder="Buscar por código o nombre…"
                icon={<img className="size-3.5 shrink-0" alt="" src={imgSearch3} />}
                highlighted
                search={cieSearch}
                error={form.show('dx-cie10')}
              />
              <FieldError forId="dx-cie10" error={form.show('dx-cie10')} />
            </Field>
          </div>

          <Field label="Descripción / Hallazgos Clínicos" htmlFor="dx-descripcion">
            <TextArea
              id="dx-descripcion"
              value={description}
              onChange={setDescription}
              onBlur={() => form.touch('dx-descripcion')}
              textSize={14}
              leading="loose"
              maxLength={1000}
              aria-required
              error={form.show('dx-descripcion')}
            />
          </Field>

          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
            <Field label="Severidad" className="gap-[10px] md:flex-1">
              <div className="flex flex-wrap items-center gap-4" role="radiogroup" aria-label="Severidad">
                {SEVERITY.map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={s === severity} onClick={() => setSeverity(s)} className="flex items-center gap-2">
                    <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border-2 bg-white', s === severity ? 'border-primary' : 'border-subtle')}>
                      {s === severity && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    <span className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{s}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Fecha de Registro" htmlFor="dx-fecha" className="md:w-[200px] md:shrink-0">
              <DateField id="dx-fecha" label="Fecha de registro" value={date} onChange={setDate} onBlur={() => form.touch('dx-fecha')} min={editing ? undefined : admission} max={todayIso()} error={form.show('dx-fecha')} />
              <FieldError forId="dx-fecha" error={form.show('dx-fecha')} />
            </Field>
          </div>

          <Field label="Notas Adicionales / Plan de Manejo Inicial" htmlFor="dx-notas">
            <TextArea
              id="dx-notas"
              value={notes}
              onChange={setNotes}
              onBlur={() => form.touch('dx-notas')}
              placeholder="Iniciar protocolo de diuréticos IV y control estricto de balance hídrico..."
              textSize={14}
              minHeight={60}
              maxLength={1000}
              error={form.show('dx-notas')}
            />
          </Field>

          {/* "Estudios adjuntos" se quitó: el archivo no se guardaba en ningún lado (REVISION-MEDICO.md, 6). Los
              documentos se suben en Documentos clínicos. */}

          <div className="flex w-full flex-wrap justify-end gap-3 pt-3">
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button size="lg" onClick={() => void register()}>
              {editing ? 'Guardar Cambios' : 'Registrar Diagnóstico'}
            </Button>
          </div>
        </Card>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[340px] xl:shrink-0">
        <Card className="flex w-full min-w-0 flex-col gap-4">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Diagnósticos Previos</h2>
          <Divider />
          <ul className="flex w-full flex-col gap-3">
            {others.map((d) => (
              <li key={d.id} className="flex w-full flex-col gap-2 rounded-lg border border-line p-3">
                <div className="flex w-full items-center justify-between">
                  <Badge tone="neutral" size="sm">{String(d.code ?? '—')}</Badge>
                  <Badge tone={d.status === 'resuelto' ? 'success' : TYPE_TONE[String(d.type)] ?? 'warning'} size="sm">
                    {d.status === 'resuelto' ? 'Resuelto' : TYPES.find((t) => t.value === d.type)?.label ?? String(d.type)}
                  </Badge>
                </div>
                <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">{String(d.description)}</p>
                <div className="flex w-full justify-between gap-3 text-[11px] leading-[normal] text-muted">
                  <p className="font-jakarta font-normal">{fmtDate(d.diagnosedOn as string | null)}</p>
                  <p className="font-jakarta font-medium">{d.status === 'resuelto' ? 'Antecedente' : 'Ingreso actual'}</p>
                </div>
              </li>
            ))}
            {others.length === 0 && <li className="font-jakarta text-[13px] text-muted">Sin diagnósticos previos.</li>}
          </ul>
        </Card>
        {/* No viene de Figma (PR 3): las hipótesis de la IA solo aceleran la búsqueda del código; no registran nada. */}
        <AiIdeasCard variant="cie10" patientId={v.id} cedula={v.cedula} onSearchCie10={(title) => setCieSearch({ text: cie10Query(title), seq: Date.now() })} />
        </div>
      </div>
    </>
  );
}
