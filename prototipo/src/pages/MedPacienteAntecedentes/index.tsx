// Pantalla "med/paciente/antecedentes" (Figma node 183:421) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { BackButton, Badge, Button, Card, Modal, ModalHeader, PatientLayout, Select, Table, Tabs, useToast } from '../../components';

type Status = 'positivo' | 'negado' | 'dato';
type Row = { condition: string; relation: string; status: Status; notes: string };
type Section = {
  id: string;
  label: string;
  title: string;
  column: string;
  rows: Row[];
  /** Texto de la tarjeta "Sección siguiente" cuando esta es la siguiente. */
  blurb: string;
  /** Opciones de ejemplo de "+ Agregar Antecedente". */
  conditions: string[];
  relations: string[];
};

const row = (condition: string, relation: string, status: Status, notes: string): Row => ({ condition, relation, status, notes });
const NONE = 'Sin antecedentes reportados.';

// Heredofamiliares es la tabla de Figma; las otras tres son datos de ejemplo (paso 2).
const SECTIONS: Section[] = [
  {
    id: 'heredo',
    label: 'Heredofamiliares',
    title: 'Antecedentes Heredofamiliares',
    column: 'RELACIÓN FAMILIAR',
    rows: [
      row('Diabetes Mellitus Tipo 2', 'Madre', 'positivo', 'Diagnosticada en 2010. Tratamiento oral.'),
      row('Hipertensión Arterial', 'Padre', 'positivo', 'En tratamiento farmacológico continuo.'),
      row('Cáncer Gástrico', 'Abuela materna', 'positivo', 'Fallecida a los 72 años por neoplasia gástrica.'),
      row('Cardiopatía Isquémica', 'Negado', 'negado', NONE),
      row('Enfermedades Psiquiátricas / Mentales', 'Negado', 'negado', NONE),
    ],
    blurb: 'Incluye enfermedades crónicas y hereditarias en familiares directos: diabetes, hipertensión, cáncer y cardiopatías.',
    conditions: ['Asma', 'Enfermedad Renal Crónica', 'Evento Vascular Cerebral', 'Cáncer de Mama'],
    relations: ['Madre', 'Padre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)'],
  },
  {
    id: 'patologicos',
    label: 'Personales Patológicos',
    title: 'Antecedentes Personales Patológicos',
    column: 'AÑO / TIPO',
    rows: [
      row('Hipertensión Arterial Sistémica', '2018', 'positivo', 'Control con enalapril 10 mg cada 12 horas.'),
      row('Diabetes Mellitus Tipo 2', '2020', 'positivo', 'Metformina 850 mg cada 12 horas; HbA1c 7.4%.'),
      row('Revascularización Miocárdica', '2021 (Cirugía)', 'positivo', 'Bypass coronario de 2 vasos sin complicaciones.'),
      row('Alergia a Penicilina', 'Desde la infancia', 'positivo', 'Shock anafiláctico documentado.'),
      row('Transfusiones', 'Negado', 'negado', NONE),
    ],
    blurb: 'Incluye cirugías previas, hospitalizaciones previas, transfusiones, alergias severas y comorbilidades sistémicas activas.',
    conditions: ['Hipotiroidismo', 'Enfermedad Renal Crónica', 'Fractura de cadera', 'Apendicectomía'],
    relations: ['2015', '2019', '2022', '2024'],
  },
  {
    id: 'no-patologicos',
    label: 'No Patológicos',
    title: 'Antecedentes Personales No Patológicos',
    column: 'FRECUENCIA / DETALLE',
    rows: [
      row('Tabaquismo', 'Suspendido (2015)', 'positivo', 'Índice tabáquico de 12 paquetes/año.'),
      row('Alcoholismo', 'Ocasional', 'positivo', 'Consumo social, sin episodios de embriaguez.'),
      row('Sedentarismo', 'Desde 2019', 'positivo', 'Caminata ocasional, menos de 30 min por semana.'),
      row('Inmunizaciones', 'Esquema completo', 'dato', 'Influenza y COVID-19 aplicadas en 2025.'),
      row('Toxicomanías', 'Negado', 'negado', NONE),
    ],
    blurb: 'Incluye tabaquismo, alcoholismo, toxicomanías, actividad física, alimentación e inmunizaciones.',
    conditions: ['Consumo de cafeína', 'Exposición a biomasa', 'Mascotas en casa'],
    relations: ['Diario', 'Ocasional', 'Suspendido'],
  },
  {
    id: 'gineco',
    label: 'Gineco-obstétricos',
    title: 'Antecedentes Gineco-obstétricos',
    column: 'DETALLE',
    rows: [
      row('Menarca', '12 años', 'dato', 'Ciclos regulares hasta la menopausia.'),
      row('Gestas / Partos / Cesáreas', 'G3 P2 C1', 'dato', 'Último embarazo en 1992 sin complicaciones.'),
      row('Menopausia', '51 años', 'dato', 'Sin terapia de reemplazo hormonal.'),
      row('Citología cervical', '2024', 'dato', 'Resultado negativo a malignidad.'),
      row('Preeclampsia', 'Negado', 'negado', NONE),
    ],
    blurb: 'Incluye menarca, ciclos menstruales, gestas, partos, cesáreas, abortos y método anticonceptivo.',
    conditions: ['Diabetes gestacional', 'Aborto', 'Mastografía'],
    relations: ['1988', '1992', '2023'],
  },
];

const STATUS_OPTIONS = [
  { value: 'positivo', label: 'Positivo' },
  { value: 'negado', label: 'Negado' },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === 'positivo') return <Badge tone="danger" size="sm">Positivo</Badge>;
  if (status === 'dato') return <Badge tone="info" size="sm">Registrado</Badge>;
  return <Badge tone="neutral" size="sm">-</Badge>;
}

function AddModal({ section, open, onClose, onAdd }: { section: Section; open: boolean; onClose: () => void; onAdd: (r: Row) => void }) {
  const [condition, setCondition] = useState(section.conditions[0]);
  const [relation, setRelation] = useState(section.relations[0]);
  const [status, setStatus] = useState<Status>('positivo');
  return (
    <Modal labelledBy="agregar-antecedente-titulo" open={open} onClose={onClose} width={460} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="agregar-antecedente-titulo" title="Agregar antecedente" onClose={onClose} />
      <p className="font-jakarta text-[14px] font-normal leading-[1.5] text-muted">{section.title}</p>
      <Select variant="input" fieldLabel="Enfermedad / condición" options={section.conditions} value={condition} onChange={setCondition} />
      <Select variant="input" fieldLabel={section.column.charAt(0) + section.column.slice(1).toLowerCase()} options={section.relations} value={relation} onChange={setRelation} />
      <Select variant="input" fieldLabel="Estado" options={STATUS_OPTIONS} value={status} onChange={(v) => setStatus(v as Status)} />
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={() =>
            onAdd(row(condition, status === 'negado' ? 'Negado' : relation, status, status === 'negado' ? NONE : 'Agregado en esta consulta.'))
          }
        >
          Agregar
        </Button>
      </div>
    </Modal>
  );
}

export default function MedPacienteAntecedentes() {
  const toast = useToast();
  const [subtab, setSubtab] = useState('heredo');
  const [rows, setRows] = useState(() => Object.fromEntries(SECTIONS.map((s) => [s.id, s.rows])));
  const [addOpen, setAddOpen] = useState(false);

  const index = SECTIONS.findIndex((s) => s.id === subtab);
  const section = SECTIONS[index];
  const next = SECTIONS[(index + 1) % SECTIONS.length];
  const current = rows[section.id];

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Antecedentes"
      title="Antecedentes Completos"
      tab="historia"
      actions={<BackButton />}
    >
      <Tabs variant="pills" items={SECTIONS} active={subtab} onChange={setSubtab} />

      <Card padding="lg" className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 leading-[normal]">
            <h2 className="font-jakarta text-[16px] font-extrabold text-ink">{section.title}</h2>
            <p className="font-jakarta text-[12px] font-normal text-muted">{`(${current.length} registros documentados)`}</p>
          </div>
          <Button variant="soft" onClick={() => setAddOpen(true)}>
            + Agregar Antecedente
          </Button>
        </div>

        <div className="w-full overflow-hidden rounded-lg border border-line">
          <Table minWidth={760}>
            <div className="flex w-full gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted">
              <p className="min-w-0 flex-1">ENFERMEDAD / CONDICIÓN</p>
              <p className="w-[180px] shrink-0">{section.column}</p>
              <p className="w-[140px] shrink-0">ESTADO</p>
              <p className="w-[280px] shrink-0">OBSERVACIONES / DETALLES</p>
            </div>
            {current.map((r) => {
              const found = r.status !== 'negado';
              return (
                <div key={r.condition} className="flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[14px] leading-[normal] last:border-b-0">
                  <p className={`min-w-0 flex-1 ${found ? 'font-bold text-ink' : 'font-medium text-muted'}`}>{r.condition}</p>
                  <p className={`w-[180px] shrink-0 font-normal ${found ? 'text-ink' : 'text-muted'}`}>{r.relation}</p>
                  <div className="w-[140px] shrink-0">
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="w-[280px] shrink-0 font-normal text-muted">{r.notes}</p>
                </div>
              );
            })}
          </Table>
        </div>
      </Card>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-line bg-surface p-5 leading-[normal] opacity-60">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <p className="font-jakarta text-[13px] font-bold text-muted">{`Sección siguiente: ${next.title}`}</p>
          <button type="button" onClick={() => setSubtab(next.id)} className="font-jakarta text-[11px] font-semibold text-primary hover:underline">
            Ver sección →
          </button>
        </div>
        <p className="font-jakarta text-[12px] font-normal text-muted">{next.blurb}</p>
      </div>

      {/* La key reinicia la ventana con las opciones de la subpestaña activa. */}
      <AddModal
        key={section.id}
        section={section}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(r) => {
          setRows((all) => ({ ...all, [section.id]: [...all[section.id].filter((x) => x.condition !== r.condition), r] }));
          setAddOpen(false);
          toast(`Antecedente agregado · ${r.condition}`);
        }}
      />
    </PatientLayout>
  );
}
