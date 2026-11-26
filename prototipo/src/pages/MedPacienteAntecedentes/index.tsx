// Pantalla "med/paciente/antecedentes" (Figma node 183:421) — generada desde el diseño original de Figma.
// Los antecedentes son los del expediente (GET/POST /historia/:id/antecedentes). Cada subpestaña es
// uno o dos valores del enum `TipoAntecedente` del backend.
import { AlergiasCard } from '../../components/patient/AlergiasCard';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createAntecedente, type TipoAntecedente } from '../../api/antecedentes';
import { ApiError } from '../../api/http';
import type { HistoriaEntry } from '../../api/types/clinical';
import { Badge, Button, Card, IconArrowRight, Modal, ModalHeader, PatientLayout, Select, Table, Tabs, usePatient, useSession, useToast, type PatientView } from '../../components';

type Section = {
  id: string;
  label: string;
  title: string;
  column: string;
  /** Tipos del backend que muestra. El primero es el que se usa al agregar. */
  types: TipoAntecedente[];
  /** Texto de la tarjeta "Sección siguiente" cuando esta es la siguiente. */
  blurb: string;
  /** Opciones de "+ Agregar Antecedente". */
  conditions: string[];
  relations: string[];
};

const SECTIONS: Section[] = [
  {
    id: 'heredo',
    label: 'Heredofamiliares',
    title: 'Antecedentes Heredofamiliares',
    column: 'RELACIÓN FAMILIAR',
    types: ['familiar'],
    blurb: 'Incluye enfermedades crónicas y hereditarias en familiares directos: diabetes, hipertensión, cáncer y cardiopatías.',
    conditions: ['Diabetes mellitus', 'Hipertensión arterial', 'Cardiopatía isquémica', 'Cáncer', 'Enfermedad renal crónica', 'Asma'],
    relations: ['Madre', 'Padre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)'],
  },
  {
    id: 'patologicos',
    label: 'Personales Patológicos',
    title: 'Antecedentes Personales Patológicos',
    column: 'AÑO / TIPO',
    types: ['personal', 'quirurgico'],
    // Las alergias tienen su propia subpestaña (docs/historial/REVISION-DETALLES.md, D): mencionarlas aquí confundía.
    blurb: 'Incluye cirugías previas, hospitalizaciones previas, transfusiones y comorbilidades sistémicas activas. Las alergias están en su pestaña.',
    conditions: ['Hipotiroidismo', 'Enfermedad renal crónica', 'Cardiopatía isquémica', 'Epilepsia'],
    relations: ['2015', '2019', '2022', '2024', '2025'],
  },
  {
    id: 'no-patologicos',
    label: 'No Patológicos',
    title: 'Antecedentes Personales No Patológicos',
    column: 'FRECUENCIA / DETALLE',
    types: ['habito'],
    blurb: 'Incluye tabaquismo, alcoholismo, toxicomanías, actividad física, alimentación e inmunizaciones.',
    conditions: ['Tabaquismo', 'Consumo de alcohol', 'Sedentarismo', 'Exposición a biomasa'],
    relations: ['Diario', 'Ocasional', 'Suspendido'],
  },
  {
    id: 'gineco',
    label: 'Gineco-obstétricos',
    title: 'Antecedentes Gineco-obstétricos',
    column: 'AÑO',
    types: ['ginecoobstetrico'],
    blurb: 'Incluye menarca, ciclos menstruales, gestas, partos, cesáreas, abortos y método anticonceptivo.',
    conditions: ['Diabetes gestacional', 'Preeclampsia', 'Aborto', 'Cesárea'],
    relations: ['1990', '2000', '2010', '2020'],
  },
];

const ALERGIAS = { id: 'alergias', label: 'Alergias' };
const TABS = [...SECTIONS, ALERGIAS];

/** Segunda columna: parentesco, año o "Cirugía", según el tipo. */
function detail(e: HistoriaEntry): string {
  if (e.type === 'familiar') return String(e.relationship ?? '—');
  if (e.type === 'quirurgico') return e.year ? `${e.year} (Cirugía)` : 'Cirugía';
  return e.year ? String(e.year) : '—';
}

function AddModal({ section, open, onClose, onAdd }: { section: Section; open: boolean; onClose: () => void; onAdd: (condition: string, relation: string) => void }) {
  const [condition, setCondition] = useState(section.conditions[0]);
  const [relation, setRelation] = useState(section.relations[0]);
  return (
    <Modal labelledBy="agregar-antecedente-titulo" open={open} onClose={onClose} width={460} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="agregar-antecedente-titulo" title="Agregar antecedente" onClose={onClose} />
      <p className="font-jakarta text-[14px] font-normal leading-[1.5] text-muted">{section.title}</p>
      <Select variant="input" fieldLabel="Enfermedad / condición" options={section.conditions} value={condition} onChange={setCondition} />
      <Select variant="input" fieldLabel={section.column.charAt(0) + section.column.slice(1).toLowerCase()} options={section.relations} value={relation} onChange={setRelation} />
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={() => onAdd(condition, relation)}>Agregar</Button>
      </div>
    </Modal>
  );
}

export default function MedPacienteAntecedentes() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Antecedentes`} title="Antecedentes Completos" tab="historia">
      {view && <Antecedentes v={view} />}
    </PatientLayout>
  );
}

function Antecedentes({ v }: { v: PatientView }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useSession();
  const [subtab, setSubtab] = useState('heredo');
  const [addOpen, setAddOpen] = useState(false);

  // "Alergias" no es un tipo de antecedente del backend: es su propia tabla (GET/POST/PATCH /historia/:id/alergias).
  if (subtab === ALERGIAS.id) {
    return (
      <>
        <Tabs variant="pills" items={TABS} active={subtab} onChange={setSubtab} />
        <AlergiasCard pacienteId={v.id} nombre={v.name} entradas={v.expediente?.alergias} />
      </>
    );
  }

  const index = SECTIONS.findIndex((s) => s.id === subtab);
  const section = SECTIONS[index];
  const next = SECTIONS[(index + 1) % SECTIONS.length];
  const all = v.expediente?.antecedentes ?? [];
  const current = all.filter((e) => section.types.includes(e.type as TipoAntecedente));
  const notApplicable = section.id === 'gineco' && v.patient.sex === 'M';

  const add = async (condition: string, relation: string) => {
    const type = section.types[0];
    try {
      await createAntecedente(v.id, {
        type,
        description: type === 'habito' ? `${condition} (${relation.toLowerCase()})` : condition,
        ...(type === 'familiar' ? { relationship: relation } : {}),
        ...(type === 'personal' || type === 'ginecoobstetrico' ? { year: Number(relation) } : {}),
      });
      await queryClient.invalidateQueries({ queryKey: ['expediente', v.id] });
      setAddOpen(false);
      toast(`Antecedente agregado · ${condition}`);
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede agregar antecedentes' : 'No se pudo agregar el antecedente', 'info');
    }
  };

  return (
    <>
      <Tabs variant="pills" items={TABS} active={subtab} onChange={setSubtab} />

      <Card padding="lg" className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 leading-[normal]">
            <h2 className="font-jakarta text-[16px] font-extrabold text-ink">{section.title}</h2>
            <p className="font-jakarta text-[12px] font-normal text-muted">{`(${current.length} registros documentados)`}</p>
          </div>
          {can('historia_clinica', 'crear') && !notApplicable && (
            <Button variant="soft" onClick={() => setAddOpen(true)}>
              + Agregar Antecedente
            </Button>
          )}
        </div>

        <div className="w-full overflow-hidden rounded-lg border border-line">
          <Table minWidth={848}>
            <div className="flex w-full gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted">
              <p className="min-w-[180px] flex-1">ENFERMEDAD / CONDICIÓN</p>
              <p className="w-[180px] shrink-0">{section.column}</p>
              <p className="w-[140px] shrink-0">ESTADO</p>
              <p className="w-[280px] shrink-0">OBSERVACIONES / DETALLES</p>
            </div>
            {current.map((r) => (
              <div key={r.id} className="flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[14px] leading-[normal] last:border-b-0">
                <p className={`min-w-[180px] flex-1 ${r.active ? 'font-bold text-ink' : 'font-medium text-muted'}`}>{String(r.description)}</p>
                <p className={`w-[180px] shrink-0 font-normal ${r.active ? 'text-ink' : 'text-muted'}`}>{detail(r)}</p>
                <div className="w-[140px] shrink-0">{r.active ? <Badge tone="danger" size="sm">Positivo</Badge> : <Badge tone="neutral" size="sm">Dado de baja</Badge>}</div>
                <p className="w-[280px] shrink-0 font-normal text-muted">{r.type === 'quirurgico' ? 'Antecedente quirúrgico.' : '—'}</p>
              </div>
            ))}
            {current.length === 0 && (
              <p className="px-4 py-[14px] font-jakarta text-[14px] font-medium leading-[normal] text-muted">
                {notApplicable ? 'No aplica para este paciente.' : 'Sin antecedentes registrados en esta sección.'}
              </p>
            )}
          </Table>
        </div>
      </Card>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-line bg-surface p-5 leading-[normal] opacity-60">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <p className="font-jakarta text-[13px] font-bold text-muted">{`Sección siguiente: ${next.title}`}</p>
          <button type="button" onClick={() => setSubtab(next.id)} className="flex items-center gap-1 font-jakarta text-[11px] font-semibold text-primary hover:underline">
            Ver sección
            <IconArrowRight size={12} />
          </button>
        </div>
        <p className="font-jakarta text-[12px] font-normal text-muted">{next.blurb}</p>
      </div>

      {/* La key reinicia la ventana con las opciones de la subpestaña activa. */}
      <AddModal key={section.id} section={section} open={addOpen} onClose={() => setAddOpen(false)} onAdd={(c, r) => void add(c, r)} />
    </>
  );
}
