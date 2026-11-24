// Pantalla "med/busqueda/global" (Figma node 245:498) — generada desde el diseño original de Figma.
// GET /search?q= con las reglas del backend: paciente por nombre o cédula, nota SOAP por su texto y
// documento por su título. Abre con "Batista" (un paciente, una nota y un documento del seed de demo).
import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePatients } from '../../api/queries';
import { search } from '../../api/search';
import imgClipboard2 from '../../assets/clipboard-2.svg';
import imgFile from '../../assets/file.svg';
import imgUser2 from '../../assets/user-2.svg';
import imgUser3 from '../../assets/user-3.svg';
import { AppLayout, Badge, Button, Card, EmptyState, SearchBox, Tabs } from '../../components';
import { fmtDate, surnameFirst } from '../../lib/clinical';
import { patientPath } from '../../lib/patientLink';

type Kind = 'patients' | 'soap' | 'docs';
const DEFAULT_QUERY = 'Batista';

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

export default function MedBusquedaGlobal() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState(params.get('q') ?? DEFAULT_QUERY);
  const q = query.trim();
  // Mientras llega la respuesta nueva se siguen viendo los resultados anteriores.
  const response = useQuery({ queryKey: ['search', q], queryFn: () => search(q), enabled: q.length >= 2, placeholderData: keepPreviousData });
  const patients = usePatients();
  const cedulaOf = (id: string) => patients.data?.items.find((p) => p.id === id)?.document ?? '';
  const data = q.length >= 2 ? response.data : undefined;

  const found: Array<{ id: string; kind: Kind; card: ReactNode }> = [
    ...(data?.patients ?? []).map((p) => ({
      id: `p-${p.id}`,
      kind: 'patients' as const,
      card: (
        <ResultCard
          icon={p.critical ? imgUser2 : imgUser3}
          iconBg={p.critical ? 'bg-primary-soft' : 'bg-success-soft'}
          actions={
            <>
              <Button variant="secondary" to={patientPath('/MedPacienteDatosPersonales', p.document)}>
                Ver Perfil
              </Button>
              <Button to={patientPath('/MedPacienteMonitoreoDetallado', p.document)}>Monitoreo</Button>
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-jakarta text-[16px] font-bold leading-[normal] text-ink">{p.name}</p>
            <Badge tone={p.critical ? 'danger' : 'success'}>{p.critical ? 'Con alertas' : 'Estable'}</Badge>
            {p.bed && <Badge tone="info">{`${p.unit ?? ''} Cama ${p.bed}`}</Badge>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Meta label="HC:" value={p.document} />
            <Meta label="Diagnóstico:" value={p.diagnosis ?? '—'} />
          </div>
        </ResultCard>
      ),
    })),
    ...(data?.notes ?? []).map((n) => ({
      id: `n-${n.id}`,
      kind: 'soap' as const,
      card: (
        <ResultCard icon={imgClipboard2} iconBg="bg-warning-soft" actions={<Button variant="secondary" to={patientPath('/MedPacienteNotasSoapDetalle', cedulaOf(n.patientId), { nota: n.id })}>Ver Nota</Button>}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 leading-[normal]">
            <p className="font-jakarta text-[16px] font-bold text-ink">{`Nota SOAP — ${surnameFirst(n.patientName)}`}</p>
            <p className="font-jakarta text-[12px] font-normal text-muted">{fmtDate(n.at)}</p>
          </div>
          <p className="max-w-[700px] truncate font-jakarta text-[13px] font-normal leading-[normal] text-muted">{`"${n.excerpt}"`}</p>
        </ResultCard>
      ),
    })),
    ...(data?.documents ?? []).map((d) => ({
      id: `d-${d.id}`,
      kind: 'docs' as const,
      card: (
        <ResultCard icon={imgFile} iconBg="bg-[rgba(239,68,68,0.1)]" actions={<Button variant="secondary" to={patientPath('/MedPacienteDocumentosClinicos', cedulaOf(d.patientId))}>Ver Documento</Button>}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="break-all font-jakarta text-[16px] font-bold leading-[normal] text-ink">{d.title}</p>
            <Badge tone="danger" size="sm">
              PDF
            </Badge>
          </div>
          <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">{`Subido el ${fmtDate(d.at)} • ${d.patientName}${d.unit ? ` • ${d.unit}` : ''}`}</p>
        </ResultCard>
      ),
    })),
  ];
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
                message={q.length < 2 ? 'Escriba al menos 2 caracteres para buscar.' : response.isFetching ? 'Buscando…' : 'No hay resultados para esta búsqueda.'}
                onReset={() => {
                  setQuery(DEFAULT_QUERY);
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
