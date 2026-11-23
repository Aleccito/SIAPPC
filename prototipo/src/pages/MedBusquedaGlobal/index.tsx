// Pantalla "med/busqueda/global" (Figma node 245:498) — generada desde el diseño original de Figma.
import { useState, type ReactNode } from 'react';
import imgClipboard2 from '../../assets/clipboard-2.svg';
import imgFile from '../../assets/file.svg';
import imgUser2 from '../../assets/user-2.svg';
import imgUser3 from '../../assets/user-3.svg';
import { AppLayout, Badge, Button, Card, EmptyState, SearchBox, Tabs } from '../../components';
import { matches } from '../../lib/text';

type Kind = 'patients' | 'soap' | 'docs';

function ResultCard({ icon, iconBg, children, actions }: { icon: string; iconBg: string; children: ReactNode; actions: ReactNode }) {
  return (
    <Card className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
          <img className="size-5" alt="" src={icon} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
    </Card>
  );
}

const Meta = ({ label, value }: { label: string; value: string }) => (
  <p className="font-jakarta text-[13px] leading-[normal] text-muted">
    {label} <span className="font-semibold text-ink">{value}</span>
  </p>
);

// Cada resultado lleva el texto con el que se busca. Todos los expedientes son el de ejemplo.
const RESULTS: Array<{ id: string; kind: Kind; search: string; card: ReactNode }> = [
  {
    id: 'maria',
    kind: 'patients',
    search: 'María González PT-8821 Insuficiencia Cardíaca Congestiva UCI Cama D3',
    card: (
      <ResultCard
        icon={imgUser2}
        iconBg="bg-primary-soft"
        actions={
          <>
            <Button variant="secondary" to="/MedPacienteDatosPersonales">Ver Perfil</Button>
            <Button to="/MedPacienteMonitoreoDetallado">Monitoreo</Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-jakarta text-[16px] font-bold leading-[normal] text-ink">María González</p>
          <Badge tone="danger">Crítico</Badge>
          <Badge tone="info">UCI Cama D3</Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Meta label="HC:" value="PT-8821" />
          <Meta label="Diagnóstico:" value="Insuficiencia Cardíaca Congestiva" />
        </div>
      </ResultCard>
    ),
  },
  {
    id: 'roberto',
    kind: 'patients',
    search: 'Roberto González Vega PT-4412 Fractura femoral expuesta Piso 2 Cama 8',
    card: (
      <ResultCard
        icon={imgUser3}
        iconBg="bg-success-soft"
        actions={
          <>
            <Button variant="secondary" to="/MedPacienteDatosPersonales">Ver Perfil</Button>
            <Button variant="secondary" to="/MedPacienteHistoriaClinicaGeneral">Ver Historia</Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-jakarta text-[16px] font-bold leading-[normal] text-ink">Roberto González Vega</p>
          <Badge tone="success">Estable</Badge>
          <Badge tone="neutral">Piso 2 Cama 8</Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Meta label="HC:" value="PT-4412" />
          <Meta label="Diagnóstico:" value="Fractura femoral expuesta" />
        </div>
      </ResultCard>
    ),
  },
  {
    id: 'nota',
    kind: 'soap',
    search: 'Nota SOAP González María deterioro hemodinámico presión pulmonar',
    card: (
      <ResultCard icon={imgClipboard2} iconBg="bg-warning-soft" actions={<Button variant="secondary" to="/MedPacienteNotasSoapDetalle">Ver Nota</Button>}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 leading-[normal]">
          <p className="font-jakarta text-[16px] font-bold text-ink">Nota SOAP — González, María</p>
          <p className="font-jakarta text-[12px] font-normal text-muted">15 Oct 2025</p>
        </div>
        <p className="max-w-[700px] truncate font-jakarta text-[13px] font-normal leading-[normal] text-muted">
          "Paciente presenta deterioro hemodinámico, con elevación de presión pulmonar capilar. Se incrementa dosis de soporte..."
        </p>
      </ResultCard>
    ),
  },
  {
    id: 'tac',
    kind: 'docs',
    search: 'TAC_Gonzalez_Maria.pdf Radiología Imagenología UCI',
    card: (
      <ResultCard icon={imgFile} iconBg="bg-[rgba(239,68,68,0.1)]" actions={<Button variant="secondary" to="/MedPacienteDocumentosClinicos">Ver Documento</Button>}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="break-all font-jakarta text-[16px] font-bold leading-[normal] text-ink">TAC_Gonzalez_Maria.pdf</p>
          <Badge tone="danger" size="sm">PDF</Badge>
        </div>
        <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">Subido el 12 Oct 2025 • Radiología &amp; Imagenología UCI</p>
      </ResultCard>
    ),
  },
];

export default function MedBusquedaGlobal() {
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('González');

  const found = RESULTS.filter((r) => matches(query, r.search));
  const count = (kind: Kind) => found.filter((r) => r.kind === kind).length;
  const tabs = [
    { id: 'all', label: `Todos (${found.length})` },
    { id: 'patients', label: `Pacientes (${count('patients')})` },
    { id: 'soap', label: `Notas SOAP (${count('soap')})` },
    { id: 'docs', label: `Documentos (${count('docs')})` },
  ];
  const shown = found.filter((r) => tab === 'all' || r.kind === tab);

  return (
    <AppLayout
      breadcrumb="SIAPPC > Búsqueda"
      title="Búsqueda Global"
      actions={
        <SearchBox
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar paciente, nota, documento..."
          aria-label="Buscar en SIAPPC"
          width={280}
        />
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-[20px] p-4 md:p-8">
        <div className="flex w-full flex-col gap-1 leading-[normal]">
          <h2 className="font-jakarta text-[22px] font-extrabold text-ink">{query.trim() ? `Resultados de búsqueda para "${query.trim()}"` : 'Todos los resultados'}</h2>
          <p className="font-jakarta text-[14px] font-medium text-muted">
            {`${found.length} ${found.length === 1 ? 'resultado encontrado' : 'resultados encontrados'} en el sistema SIAPPC`}
          </p>
        </div>

        <Tabs items={tabs} active={tab} onChange={setTab} />

        <div className="flex w-full flex-col gap-4">
          {shown.length === 0 && (
            <Card>
              <EmptyState
                message="No hay resultados para esta búsqueda."
                onReset={() => {
                  setQuery('González');
                  setTab('all');
                }}
              />
            </Card>
          )}
          {shown.map((r) => (
            <div key={r.id}>{r.card}</div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
