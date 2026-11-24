// No viene de Figma: "Lo que verá la IA" (REVISION-IA.md, sección 3 y C3 de la sección 10). Muestra lo que el
// backend le manda al modelo para la pregunta escrita: lo mínimo de seguridad siempre y el resto según de qué
// trate (mismas reglas: src/lib/aiTemas.ts es copia de backend/src/services/aiTemas.ts).
import type { ReactNode } from 'react';
import { useExpediente, useExploracion, usePatients, useSoapNotes } from '../../api/queries';
import type { HistoriaEntry } from '../../api/types/clinical';
import type { PatientRow } from '../../data/patients';
import { detectarTemas, type Tema } from '../../lib/aiTemas';
import { fmtAgo } from '../../lib/clinical';
import { cn } from '../../lib/cn';

const LABEL: Record<Exclude<Tema, 'basico'>, string> = {
  equipo: 'Médico a cargo',
  ubicacion: 'Cama e ingreso',
  vitales: 'Signos vitales y tendencia de 6 h',
  alertas: 'Alertas',
  exploracion: 'Exploración física',
  medicamentos: 'Medicamentos suspendidos',
  diagnosticos: 'Diagnósticos resueltos o descartados',
  antecedentes: 'Antecedentes',
  procedimientos: 'Procedimientos',
  hospitalizaciones: 'Hospitalizaciones previas',
  evoluciones: 'Evoluciones',
  notas: 'Notas SOAP',
  citas: 'Próximas citas',
  documentos: 'Documentos (solo el título)',
};
const ORDER = Object.keys(LABEL) as Array<keyof typeof LABEL>;

const active = (list: HistoriaEntry[] | undefined) => (list ?? []).filter((e) => !e.status || e.status === 'activo' || e.status === 'activa');
const join = (items: string[]) => items.join('; ') || 'sin registros';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-2 last:border-b-0">
      <dt className="font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">{label}</dt>
      <dd className="break-words font-jakarta text-[13px] leading-[1.45] text-ink">{children}</dd>
    </div>
  );
}

export function AiContext({ row, question, className }: { row: PatientRow | undefined; question: string; className?: string }) {
  const exp = useExpediente(row?.id);
  const notes = useSoapNotes(row?.id);
  const explo = useExploracion(row?.id);
  const patient = usePatients().data?.items.find((p) => p.id === row?.id);
  if (!row) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <p className="font-jakarta text-[13px] leading-[1.5] text-muted">Elija un paciente para ver qué datos de su expediente recibe la IA.</p>
      </div>
    );
  }
  const e = exp.data;
  const temas = detectarTemas(question);
  const extra = ORDER.filter((t) => temas.has(t));
  const left = ORDER.filter((t) => !temas.has(t));
  const value = (t: keyof typeof LABEL): string => {
    switch (t) {
      case 'equipo':
        return 'Carlos Méndez (Médico)';
      case 'ubicacion':
        return row.bed ? `${row.bed} (${row.unit ?? '—'})` : 'Sin cama asignada';
      case 'vitales':
        return `FC ${row.vitals.hr ?? '—'} · SpO₂ ${row.vitals.spo2 ?? '—'} % (${fmtAgo(row.vitals.at)}), con su tendencia`;
      case 'alertas':
        return row.openAlerts ? `${row.openAlerts} abiertas` : 'Sin alertas abiertas';
      case 'exploracion':
        return explo.data?.updatedAt ? `Registrada ${fmtAgo(explo.data.updatedAt)}` : 'Pendiente';
      case 'medicamentos':
        return join((e?.medicamentos ?? []).filter((m) => m.status && m.status !== 'activo').map((m) => String(m.name)));
      case 'diagnosticos':
        return join((e?.diagnosticos ?? []).filter((d) => d.status && d.status !== 'activo').map((d) => String(d.description)));
      case 'antecedentes':
        return join((e?.antecedentes ?? []).filter((a) => a.active !== false).map((a) => `${a.type}: ${a.description}`));
      case 'procedimientos':
        return join((e?.procedimientos ?? []).slice(0, 5).map((x) => String(x.name)));
      case 'hospitalizaciones':
        return join((e?.hospitalizaciones ?? []).slice(0, 3).map((x) => String(x.reason)));
      case 'evoluciones':
        return join((e?.evoluciones ?? []).slice(0, 2).map((x) => String(x.diagnosis ?? '')));
      case 'notas': {
        const n = notes.data ?? [];
        return n.length ? `${n.length} ${n.length === 1 ? 'nota' : 'notas'}; la última, ${fmtAgo(n[0].at)}` : 'Sin notas';
      }
      case 'citas':
        return 'Sin citas próximas';
      case 'documentos':
        return join((e?.documentos ?? []).slice(0, 8).map((d) => String(d.title)));
    }
  };
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-1">
        <p className="font-jakarta text-[12px] font-bold uppercase text-muted">Siempre</p>
        <dl className="flex flex-col">
          <Row label="Paciente">{row.name}</Row>
          <Row label="Edad · sexo · sangre">{`${row.age ?? '—'} años · ${patient?.sex ?? '—'} · ${patient?.bloodType ?? '?'}`}</Row>
          <Row label="Motivo de consulta">{row.reason}</Row>
          <Row label="Alergias activas">{join(active(e?.alergias).map((a) => `${a.substance} (${a.severity}${a.reaction ? `: ${a.reaction}` : ''})`)).replace('sin registros', 'ninguna registrada')}</Row>
          <Row label="Medicamentos activos">{join(active(e?.medicamentos).map((m) => [m.name, m.dose, m.route, m.frequency].filter(Boolean).join(' '))).replace('sin registros', 'ninguno registrado')}</Row>
          <Row label="Diagnósticos activos">{join(active(e?.diagnosticos).map((d) => `${d.description}${d.code ? ` [${d.code}]` : ''}`)).replace('sin registros', 'ninguno')}</Row>
        </dl>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-jakarta text-[12px] font-bold uppercase text-muted">Con esta pregunta, además</p>
        {question.trim() ? (
          <dl className="flex flex-col">
            {extra.map((t) => (
              <Row key={t} label={LABEL[t]}>
                {value(t)}
              </Row>
            ))}
          </dl>
        ) : (
          <p className="font-jakarta text-[13px] leading-[1.5] text-muted">Escriba la pregunta: según de qué trate se agregan signos, alertas, notas, cama, médico a cargo…</p>
        )}
      </div>
      {question.trim() && left.length > 0 && (
        <p className="font-jakarta text-[12px] leading-[1.5] text-muted">
          <span className="font-bold">No se manda: </span>
          {left.map((t) => LABEL[t].toLowerCase()).join(', ')}.
        </p>
      )}
    </div>
  );
}
