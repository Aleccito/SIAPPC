// Pantalla "med/pacientes/lista" (Figma node 45:79) — generada desde el diseño original de Figma.
// Los pacientes asignados (GET /dashboard/assigned-patients) con sus alertas agrupadas; las camas libres
// salen de la central (GET /monitoring/beds). Temperatura: src/api/sinBackend.ts.
import { useState, type ReactNode, type SyntheticEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSoapNote } from '../../api/clinical';
import { ApiError } from '../../api/http';
import { useMonitoredBeds } from '../../api/queries';
import { Link } from 'react-router-dom';
import imgSearch from '../../assets/search.svg';
import { AppLayout, Badge, Card, ConfirmDialog, Divider, EmptyState, IconAlertTriangle, IconArrowRight, IconCalendar, IconChevronDown, IconMoreHorizontal, KpiCard, Menu, Pagination, rowLinkClass, Select, Table, useAiAccess, useRowLink, useSession, useToast } from '../../components';
import { usePatientRows, type PatientRow as Patient } from '../../data/patients';
import { alertTitle, esActiva, VIGENCIA_ALERTA_MIN } from '../../lib/alerts';
import { fmtAgo, initials, STATE_ORDER } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { matches } from '../../lib/text';

/** Tipo de ingreso del backend (`ingreso.tipo`) en la columna "Traslado UCI". */
const TRANSFER: Record<string, [ReactNode, string]> = {
  urgencia: [<IconAlertTriangle key="u" size={12} className="text-danger" />, 'Urgencia'],
  programado: [<IconArrowRight key="p" size={12} className="text-muted" />, 'Ingreso'],
  traslado: [<IconArrowRight key="t" size={12} className="-rotate-45 text-muted" />, 'Traslado'],
};

const STATUS_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'critico', label: 'Crítico' },
  { value: 'atencion', label: 'Atención' },
  { value: 'estable', label: 'Estable' },
  // Sin exploración física desde el ingreso; viene del indicador del Dashboard (?filtro=evaluacion).
  { value: 'evaluacion', label: 'Evaluación pendiente' },
];
const RANGE_OPTIONS = [
  { value: '-1', label: 'Cualquier fecha' },
  { value: '0', label: 'Hoy' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
];
const SORT_OPTIONS = [
  { value: 'default', label: 'Todos' },
  { value: 'crit', label: 'Más críticos primero' },
  { value: 'bed', label: 'Por cama' },
  { value: 'name', label: 'Por nombre' },
];

/** Filas por página: las de Figma. */
const PAGE_SIZE = 5;
// Columnas proporcionales: con anchos fijos de Figma quedaba un hueco de ~500 px antes del menú a 1920
// (docs/historial/REVISION-DETALLES.md, A1). Por debajo de 900 px la tabla se desplaza (Table minWidth).
const COLS =
  'grid grid-cols-[minmax(200px,2.6fr)_minmax(90px,1fr)_minmax(96px,1.1fr)_minmax(64px,0.8fr)_minmax(64px,0.8fr)_minmax(64px,0.8fr)_minmax(64px,0.8fr)_36px] items-center gap-3';
const stop = (e: SyntheticEvent) => e.stopPropagation();


/** `aExploracion`: la fila abre la Exploración física (para registrar la evaluación pendiente) en vez del Resumen. */
function PatientRow({ p, onDischarge, aExploracion = false }: { p: Patient; onDischarge: (p: Patient) => void; aExploracion?: boolean }) {
  const rowLink = useRowLink();
  const crit = p.state === 'critico';
  const transfer = TRANSFER[p.admissionType ?? ''] ?? TRANSFER.programado;
  const aiAccess = useAiAccess();
  // Solo lo que el rol puede hacer: la enfermera no escribe notas ni exploración (docs/historial/REVISION-DETALLES.md, A3).
  const { can } = useSession();
  const escribeNotas = can('notas_soap', 'crear');
  return (
    <div
      {...rowLink(patientPath(aExploracion ? '/MedPacienteExploracionFisica' : '/MedPacienteResumen', p.document))}
      aria-label={aExploracion ? `Registrar la exploración física de ${p.name}` : `Ver a ${p.name}`}
      className={cn(COLS, 'p-4', 'border-b border-line bg-white last:border-b-0', rowLinkClass)}
    >
      <div className="flex items-center gap-[10px]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-line font-jakarta text-[12px] font-extrabold leading-[normal] text-ink">{initials(p.name)}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
          <p className="truncate font-jakarta text-[14px] font-bold text-ink" title={p.name}>
            {p.name}
          </p>
          <p className="font-jakarta text-[12px] font-normal text-muted">{`${p.document} • ${p.age ?? '—'} años`}</p>
        </div>
      </div>
      <div>
        <Badge tone={p.tone} size="sm">{p.stateLabel.toUpperCase()}</Badge>
      </div>
      <div className="flex items-center gap-1.5">
        {transfer[0]}
        <p className="font-jakarta text-[11px] font-bold leading-[normal] text-muted">{transfer[1]}</p>
      </div>
      <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{p.bed ?? '—'}</p>
      <p className={cn('font-jakarta text-[13px] leading-[normal]', crit ? 'font-extrabold text-danger' : 'font-bold text-ink')}>{p.vitals.hr ?? '—'}</p>
      <p className={cn('font-jakarta text-[13px] leading-[normal]', crit ? 'font-extrabold text-danger' : 'font-bold text-ink')}>{p.vitals.spo2 ?? '—'}</p>
      <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">{p.signos ? `${p.signos.temp.toFixed(1)}°` : '—'}</p>
      {/* El menú no debe activar la fila (los eventos del menú suben por el árbol de React). */}
      <div className="flex justify-end" onClick={stop} onKeyDown={stop}>
        <Menu
          label={`Más opciones de ${p.name}`}
          className="-m-1"
          trigger={<IconMoreHorizontal size={18} className="text-muted" />}
          items={[
            { label: 'Abrir expediente', to: patientPath('/MedPacienteResumen', p.document) },
            { label: 'Ver monitoreo', to: patientPath('/MedPacienteMonitoreoDetallado', p.document) },
            { label: 'Tendencias', to: patientPath('/MedPacienteTendenciasVitales', p.document) },
            ...(escribeNotas ? [{ label: 'Nueva nota SOAP', to: patientPath('/MedPacienteNotasSoapNueva', p.document) }] : []),
            ...(p.examined || !can('historia_clinica', 'editar') ? [] : [{ label: 'Registrar exploración física', to: patientPath('/MedPacienteExploracionFisica', p.document) }]),
            ...(aiAccess ? [{ label: 'Consultar IA', to: patientPath('/MedAsistenteIa', p.document) }] : []),
            // El egreso lo hace Admisión; el médico solo indica el alta médica (docs/historial/REVISION.md, R2).
            ...(escribeNotas ? [{ label: 'Indicar alta médica', onSelect: () => onDischarge(p) }] : []),
          ]}
        />
      </div>
    </div>
  );
}

export default function MedPacientesLista() {
  const toast = useToast();
  const [discharge, setDischarge] = useState<Patient | null>(null);
  const navigate = useNavigate();
  // "Indicar alta" deja constancia real: un borrador de nota SOAP con el alta en el plan, que el médico firma
  // (POST /soap/notes). El egreso lo hace Admisión; el backend no tiene una orden de alta aparte.
  const indicarAlta = async () => {
    const p = discharge;
    setDischarge(null);
    if (!p) return;
    try {
      const nota = await createSoapNote({
        patientId: Number(p.id),
        assessment: `Evolución favorable; criterios de alta cumplidos. Motivo de ingreso: ${p.reason}.`,
        plan: 'Alta médica indicada. Admisión completa el egreso y libera la cama. Indicaciones de egreso y control según evolución.',
      });
      toast(`Borrador de alta creado para ${p.name}: revíselo y fírmelo`);
      navigate(patientPath('/MedPacienteNotasSoapNueva', p.document, { nota: nota.id }));
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede escribir notas SOAP' : 'No se pudo crear el borrador de alta', 'info');
    }
  };
  const [unit, setUnit] = useState('Todas');
  const [params] = useSearchParams();
  const [status, setStatus] = useState(params.get('filtro') === 'evaluacion' ? 'evaluacion' : 'Todos');
  const [range, setRange] = useState('-1');
  const [sort, setSort] = useState('default');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Cualquier cambio de filtro vuelve a la primera página.
  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };
  const days = Number(range);
  const { rows: patients, groups, isPending } = usePatientRows();
  const beds = useMonitoredBeds();
  const unitOptions = ['Todas', ...new Set(patients.map((p) => p.unit).filter((u): u is string => !!u))];
  // Días desde el ingreso, para "Rango de Admisión".
  const admittedDaysAgo = (p: Patient) => (Date.now() - Date.parse(p.admittedAt ?? p.arrivedAt)) / 86_400_000;

  const filtered = patients.filter(
    (p) =>
      (unit === 'Todas' || p.unit === unit) &&
      (status === 'Todos' || (status === 'evaluacion' ? !p.examined : p.state === status)) &&
      (days < 0 || admittedDaysAgo(p) <= Math.max(days, 1)) &&
      matches(query, p.name, p.document),
  );
  const sorted =
    sort === 'crit'
      ? [...filtered].sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state])
      : sort === 'bed'
        ? [...filtered].sort((a, b) => (a.bed ?? '').localeCompare(b.bed ?? ''))
        : sort === 'name'
          ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'es'))
          : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const free = (beds.data ?? []).filter((b) => b.bedState === 'disponible').length;
  // Las 4 alertas (agrupadas) más recientes de los pacientes asignados.
  const recent = [...groups]
    .sort((a, b) => b.latest.at.localeCompare(a.latest.at))
    .slice(0, 4)
    .map((g) => ({ g, bed: patients.find((p) => p.device === g.device)?.bed ?? '—' }));
  const reset = () => {
    setUnit('Todas');
    setStatus('Todos');
    setRange('-1');
    setQuery('');
    setPage(1);
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Pacientes"
      title="Mis Pacientes"
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <Select variant="stacked" label="Unidad" options={unitOptions} value={unit} onChange={filter(setUnit)} trailingIcon={<IconChevronDown size={14} className="text-muted" />} />
          <Select variant="stacked" label="Estado" options={STATUS_OPTIONS} value={status} onChange={filter(setStatus)} trailingIcon={<IconChevronDown size={14} className="text-muted" />} />
          <Select
            variant="stacked"
            label="Rango de Admisión"
            options={RANGE_OPTIONS}
            value={range}
            onChange={filter(setRange)}
            trailingIcon={<IconCalendar size={14} className="text-muted" />}
            className="sm:flex-1"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Pacientes Activos" value={isPending ? '—' : String(patients.length)} note={`Cupo: ${beds.data?.length ?? '—'} camas`} />
          <KpiCard label="Estado Crítico" value={String(patients.filter((p) => p.state === 'critico').length)} tone="danger" tint="danger" note="Acción inmediata" />
          <KpiCard label="Alertas Activas" value={String(groups.filter((g) => esActiva(g)).length)} tone="warning" tint="warning" note={`Últimos ${VIGENCIA_ALERTA_MIN} min`} />
          <KpiCard label="Camas Disponibles" value={`${free} / ${beds.data?.length ?? '—'}`} note={beds.data?.length ? `${Math.round((free / beds.data.length) * 100)}% libre` : '—'} />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 xl:flex-row">
          <section className="flex w-full min-w-0 flex-col gap-3 xl:flex-1">
            <div className="flex w-full flex-col gap-1.5 leading-[normal]">
              <h2 className="font-jakarta text-[16px] font-extrabold text-ink">Lista de Pacientes Asignados</h2>
              <p className="font-jakarta text-[13px] font-normal text-muted">Resumen de estado de salud actual para su supervisión.</p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-[10px]">
              <Select variant="soft" options={SORT_OPTIONS} value={sort} onChange={setSort} trailingIcon={<IconChevronDown size={14} className="text-muted" />} ariaLabel="Ordenar pacientes" align="right" />
              <label className="flex w-full max-w-[320px] items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 focus-within:border-primary">
                <img className="size-4 shrink-0" alt="" src={imgSearch} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => filter(setQuery)(e.target.value)}
                  placeholder="Filtrar por nombre o ID..."
                  aria-label="Filtrar por nombre o ID"
                  className="min-w-0 flex-1 bg-transparent font-jakarta text-[13px] font-normal leading-[normal] text-ink outline-none placeholder:text-muted"
                />
              </label>
            </div>
            <Card padding="none" className="w-full overflow-hidden shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)]">
              <Table minWidth={900}>
                <div className={cn(COLS, 'border-b border-line bg-surface px-4 py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted')}>
                  <p>PACIENTE</p>
                  <p>ESTADO</p>
                  <p>TRASLADO UCI</p>
                  <p className="normal-case">CAMA</p>
                  <p>FC (LPM)</p>
                  <p>SPO2 (%)</p>
                  <p>TEMP (°C)</p>
                  {/* Sin "•••" aquí: era texto sin acción (docs/historial/REVISION-DETALLES.md, A3). Cada fila lleva su menú. */}
                  <span aria-hidden="true" />
                </div>
                {rows.map((p) => (
                  <PatientRow key={p.id} p={p} onDischarge={setDischarge} aExploracion={status === 'evaluacion'} />
                ))}
                {rows.length === 0 && <EmptyState message={isPending ? 'Cargando pacientes…' : undefined} onReset={reset} />}
              </Table>
            </Card>
            <Pagination summary={`Mostrando ${rows.length} de ${sorted.length} pacientes bajo su cuidado.`} page={current} pages={pages} onChange={setPage} />
          </section>

          <Card padding="sm" className="flex w-full min-w-0 flex-col gap-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)] xl:w-[280px] xl:shrink-0 xl:self-stretch">
            <div className="flex w-full items-center justify-between">
              <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Alertas Recientes</h2>
              <Badge tone="danger" size="sm">Hoy</Badge>
            </div>
            <Divider />
            <ul className="flex w-full flex-col gap-3">
              {recent.map(({ g, bed }) => (
                <li key={g.key}>
                  <Link to="/MedAlertasCentro" className="flex w-full items-start gap-[10px] rounded-md transition-colors hover:bg-surface">
                    <span className={cn('mt-0.5 h-3.5 w-1 shrink-0 rounded-full', g.severity === 'critica' ? 'bg-danger' : 'bg-warning')} />
                    <div className="flex min-w-0 flex-1 flex-col gap-px leading-[normal]">
                      <p className="font-jakarta text-[12px] font-bold text-ink">{`${alertTitle(g.variable, g.severity, g.latest.value)} (${g.latest.value})`}</p>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <p className="font-jakarta font-bold text-primary">{`Cama ${bed}`}</p>
                        <p className="font-jakarta font-normal text-muted">{fmtAgo(g.latest.at)}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              {recent.length === 0 && <li className="font-jakarta text-[12px] text-muted">Sin alertas recientes.</li>}
            </ul>
          </Card>
        </div>
      </div>
      <ConfirmDialog
        open={discharge !== null}
        title="¿Indicar alta médica?"
        confirmLabel="Indicar alta"
        onCancel={() => setDischarge(null)}
        onConfirm={() => void indicarAlta()}
      >
        {discharge &&
          `Se creará un borrador de nota SOAP de ${discharge.name} con el alta médica indicada en el plan. Usted lo revisa y lo firma; el egreso y la liberación de la cama los hace Admisión.`}
      </ConfirmDialog>
    </AppLayout>
  );
}
