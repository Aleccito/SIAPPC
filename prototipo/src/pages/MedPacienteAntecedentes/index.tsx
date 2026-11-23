// Pantalla "med/paciente/antecedentes" (Figma node 183:421) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { BackButton, Badge, Button, Card, PatientLayout, Table, Tabs } from '../../components';

const SUBTABS = [
  { id: 'heredo', label: 'Heredofamiliares' },
  { id: 'patologicos', label: 'Personales Patológicos' },
  { id: 'no-patologicos', label: 'No Patológicos' },
  { id: 'gineco', label: 'Gineco-obstétricos' },
];

const ROWS: Array<{ condition: string; relation: string; positive: boolean; notes: string }> = [
  { condition: 'Diabetes Mellitus Tipo 2', relation: 'Madre', positive: true, notes: 'Diagnosticada en 2010. Tratamiento oral.' },
  { condition: 'Hipertensión Arterial', relation: 'Padre', positive: true, notes: 'En tratamiento farmacológico continuo.' },
  { condition: 'Cáncer Gástrico', relation: 'Abuela materna', positive: true, notes: 'Fallecida a los 72 años por neoplasia gástrica.' },
  { condition: 'Cardiopatía Isquémica', relation: 'Negado', positive: false, notes: 'Sin antecedentes reportados.' },
  { condition: 'Enfermedades Psiquiátricas / Mentales', relation: 'Negado', positive: false, notes: 'Sin antecedentes reportados.' },
];

export default function MedPacienteAntecedentes() {
  const [subtab, setSubtab] = useState('heredo');

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Antecedentes"
      title="Antecedentes Completos"
      tab="historia"
      actions={<BackButton />}
    >
      <Tabs variant="pills" items={SUBTABS} active={subtab} onChange={setSubtab} />

      <Card padding="lg" className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 leading-[normal]">
            <h2 className="font-jakarta text-[16px] font-extrabold text-ink">Antecedentes Heredofamiliares</h2>
            <p className="font-jakarta text-[12px] font-normal text-muted">(5 registros documentados)</p>
          </div>
          <Button variant="soft">+ Agregar Antecedente</Button>
        </div>

        <div className="w-full overflow-hidden rounded-lg border border-line">
          <Table minWidth={760}>
            <div className="flex w-full gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted">
              <p className="min-w-0 flex-1">ENFERMEDAD / CONDICIÓN</p>
              <p className="w-[180px] shrink-0">RELACIÓN FAMILIAR</p>
              <p className="w-[140px] shrink-0">ESTADO</p>
              <p className="w-[280px] shrink-0">OBSERVACIONES / DETALLES</p>
            </div>
            {ROWS.map((r) => (
              <div key={r.condition} className="flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[14px] leading-[normal] last:border-b-0">
                <p className={`min-w-0 flex-1 ${r.positive ? 'font-bold text-ink' : 'font-medium text-muted'}`}>{r.condition}</p>
                <p className={`w-[180px] shrink-0 font-normal ${r.positive ? 'text-ink' : 'text-muted'}`}>{r.relation}</p>
                <div className="w-[140px] shrink-0">
                  {r.positive ? (
                    <Badge tone="danger" size="sm">Positivo</Badge>
                  ) : (
                    <Badge tone="neutral" size="sm">-</Badge>
                  )}
                </div>
                <p className="w-[280px] shrink-0 font-normal text-muted">{r.notes}</p>
              </div>
            ))}
          </Table>
        </div>
      </Card>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-line bg-surface p-5 leading-[normal] opacity-60">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <p className="font-jakarta text-[13px] font-bold text-muted">Sección siguiente: Antecedentes Personales Patológicos</p>
          <p className="font-jakarta text-[11px] font-semibold text-primary">Ver sección →</p>
        </div>
        <p className="font-jakarta text-[12px] font-normal text-muted">
          Incluye cirugías previas, hospitalizaciones previas, transfusiones, alergias severas y comorbilidades sistémicas activas.
        </p>
      </div>
    </PatientLayout>
  );
}
