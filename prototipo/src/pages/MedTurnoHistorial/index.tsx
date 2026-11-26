// Pantalla "med-turno-historial" (Figma node 259:15) — generada desde el diseño original de Figma.
import { useEffect, useState, type SyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEntregas, type Entrega } from '../../api/sinBackend';
import { fmtDateTime } from '../../lib/clinical';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout, Badge, Button, Card, EmptyState, Pagination, rowLinkClass, SearchBox, Select, Table, Tabs, useRowLink } from '../../components';
import { cn } from '../../lib/cn';

const TURNO_TABS = [
  { id: 'nueva', label: 'Nueva Entrega', to: '/MedTurnoEntregaHandoff' },
  { id: 'historial', label: 'Historial de Entregas', to: '/MedTurnoHistorial' },
];

const SELF = '/MedTurnoHistorial';
const SUMMARY_PATH = '/MedTurnoResumenRecibido';

/** Al confirmar una entrega de turno se llega aquí con este estado. */
export type HandoffState = { handedOff: true };

type Status = 'Leído' | 'Pendiente';
type Row = { id: string; date: string; shift: string; from: string; to: string; pax: string; status: Status; daysAgo: number };

// SIMULADO: las entregas son las registradas en este navegador con "Confirmar entrega" (sinBackend.ts). Antes eran
// 31 filas fijas de julio y agosto de 2026. El backend no tiene entregas de turno (docs/CONEXION-BACKEND.md, pedido 11).
const aFila = (e: Entrega): Row => ({
  id: e.id,
  date: fmtDateTime(e.at),
  shift: e.turno,
  from: e.entrego,
  to: 'Sin asignar',
  pax: `${e.pacientes.length} pax`,
  status: e.leida ? 'Leído' : 'Pendiente',
  daysAgo: Math.floor((Date.now() - Date.parse(e.at)) / 86_400_000),
});

const DATE_OPTIONS = [
  { value: '0', label: 'Hoy' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
];
const SHIFT_OPTIONS = ['Todos los turnos', 'Matutino', 'Vespertino', 'Nocturno'];
const PAGE_SIZE = 6;
const stop = (e: SyntheticEvent) => e.stopPropagation();

export default function MedTurnoHistorial() {
  const rowLink = useRowLink();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: HandoffState | null };
  // Una entrega recién confirmada aparece primero y queda pendiente de lectura.
  const entregas = useQuery({ queryKey: ['sinBackend', 'entregas'], queryFn: getEntregas });
  const rows = (entregas.data ?? []).map(aFila);
  const [range, setRange] = useState('7');
  const [shift, setShift] = useState(SHIFT_OPTIONS[0]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (state) navigate(SELF, { replace: true, state: null });
  }, [state, navigate]);

  const filtered = rows.filter((r) => r.daysAgo <= Number(range) && (shift === SHIFT_OPTIONS[0] || r.shift.startsWith(shift)));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const shown = filtered.slice(start, start + PAGE_SIZE);
  const summary = filtered.length ? `Mostrando ${start + 1}-${start + shown.length} de ${filtered.length} entregas` : 'Sin entregas';
  const pick = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Resumen de Turno"
      title="Entrega de Turno — Historial"
      actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar entrega, médico, cama..." width={280} />}
    >
      <div className="w-full px-4 pt-4 md:px-8">
        <Tabs items={TURNO_TABS} active="historial" />
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col p-4 md:p-8">
        <Card padding="lg" className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Select label="Fecha:" options={DATE_OPTIONS} value={range} onChange={pick(setRange)} />
              <Select label="Turno:" options={SHIFT_OPTIONS} value={shift} onChange={pick(setShift)} />
            </div>
            <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">Entregas registradas en este navegador</p>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-line">
            <Table minWidth={1084}>
              <div className="flex w-full gap-2 border-b border-line bg-surface p-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="w-[160px] shrink-0">Fecha</p>
                <p className="w-[200px] shrink-0">Turno</p>
                <p className="w-[180px] shrink-0">Entregó</p>
                <p className="w-[180px] shrink-0">Recibió</p>
                <p className="w-[100px] shrink-0">Pacientes</p>
                <p className="w-[120px] shrink-0">Estado</p>
                <p className="min-w-[68px] flex-1 text-right">Acción</p>
              </div>
              {shown.map((r) => (
                <div
                  key={r.id}
                  {...rowLink(`${SUMMARY_PATH}?entrega=${r.id}`)}
                  aria-label={`Ver resumen de la entrega del ${r.date}`}
                  className={cn('flex w-full items-center gap-2 border-b border-line p-[14px] font-jakarta text-[13px] leading-[normal] last:border-b-0', rowLinkClass)}
                >
                  <p className="w-[160px] shrink-0 font-bold text-ink">{r.date}</p>
                  <p className="w-[200px] shrink-0 font-semibold text-ink">{r.shift}</p>
                  <p className="w-[180px] shrink-0 font-normal text-muted">{r.from}</p>
                  <p className="w-[180px] shrink-0 font-normal text-muted">{r.to}</p>
                  <div className="w-[100px] shrink-0">
                    <Badge tone="neutral">{r.pax}</Badge>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <Badge tone={r.status === 'Leído' ? 'success' : 'warning'} className="w-[90px] justify-center">
                      {r.status}
                    </Badge>
                  </div>
                  <div className="flex min-w-[68px] flex-1 justify-end" onClick={stop} onKeyDown={stop}>
                    <Button variant="outline" size="sm" to={`${SUMMARY_PATH}?entrega=${r.id}`}>
                      Ver Resumen
                    </Button>
                  </div>
                </div>
              ))}
              {shown.length === 0 && (
                <EmptyState
                  message={entregas.isPending ? 'Cargando…' : rows.length ? undefined : 'Todavía no hay entregas registradas. Se registran desde «Nueva Entrega».'}
                  onReset={() => {
                    setRange('7');
                    setShift(SHIFT_OPTIONS[0]);
                  }}
                />
              )}
            </Table>
          </div>

          <Pagination summary={summary} page={current} pages={pages} onChange={setPage} className="pt-3" />
        </Card>
      </div>
    </AppLayout>
  );
}
