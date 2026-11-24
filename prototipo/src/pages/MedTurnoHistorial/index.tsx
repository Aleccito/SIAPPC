// Pantalla "med-turno-historial" (Figma node 259:15) — generada desde el diseño original de Figma.
import { useEffect, useState, type SyntheticEvent } from 'react';
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
type Row = { date: string; shift: string; from: string; to: string; pax: string; status: Status; daysAgo: number };

const M = 'Matutino (07:00 - 15:00)';
const V = 'Vespertino (15:00 - 23:00)';
const N = 'Nocturno (23:00 - 07:00)';

const row = (date: string, shift: string, from: string, to: string, pax: number, daysAgo: number, status: Status = 'Leído'): Row => ({
  date,
  shift,
  from,
  to,
  pax: `${pax} pax`,
  status,
  daysAgo,
});

// Las 6 primeras son las de Figma; el resto son de ejemplo. Las 24 primeras caen en los
// últimos 7 días ("Mostrando 1-6 de 24"); las demás solo aparecen con "Últimos 30 días".
const ROWS: Row[] = [
  row('14 Ago 2026, 06:55', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 3, 0),
  row('13 Ago 2026, 22:50', V, 'Dra. Ana Gómez', 'Dra. Laura Sánchez', 7, 1),
  row('13 Ago 2026, 14:45', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 7, 1, 'Pendiente'),
  row('13 Ago 2026, 06:50', N, 'Dr. Roberto Silva', 'Dr. Carlos Méndez', 4, 1),
  row('12 Ago 2026, 22:45', V, 'Dra. Ana Gómez', 'Dr. Roberto Silva', 6, 2),
  row('12 Ago 2026, 14:55', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 6, 2),
  row('12 Ago 2026, 06:50', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 5, 2),
  row('11 Ago 2026, 22:50', V, 'Dra. Ana Gómez', 'Dra. Laura Sánchez', 6, 3),
  row('11 Ago 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 6, 3),
  row('11 Ago 2026, 06:55', N, 'Dr. Roberto Silva', 'Dr. Carlos Méndez', 5, 3),
  row('10 Ago 2026, 22:45', V, 'Dra. Ana Gómez', 'Dr. Roberto Silva', 7, 4),
  row('10 Ago 2026, 19:30', V, 'Dr. Luis Herrera', 'Dra. Ana Gómez', 7, 4),
  row('10 Ago 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dr. Luis Herrera', 7, 4),
  row('10 Ago 2026, 06:50', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 6, 4),
  row('09 Ago 2026, 22:50', V, 'Dra. Ana Gómez', 'Dra. Laura Sánchez', 6, 5),
  row('09 Ago 2026, 14:55', M, 'Dra. Carmen Vega', 'Dra. Ana Gómez', 5, 5),
  row('09 Ago 2026, 11:20', M, 'Dr. Carlos Méndez', 'Dra. Carmen Vega', 5, 5),
  row('09 Ago 2026, 06:50', N, 'Dr. Roberto Silva', 'Dr. Carlos Méndez', 5, 5),
  row('08 Ago 2026, 22:45', V, 'Dra. Ana Gómez', 'Dr. Roberto Silva', 6, 6),
  row('08 Ago 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 6, 6),
  row('08 Ago 2026, 06:55', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 4, 6),
  row('07 Ago 2026, 22:50', V, 'Dra. Ana Gómez', 'Dra. Laura Sánchez', 5, 7),
  row('07 Ago 2026, 14:45', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 5, 7),
  row('07 Ago 2026, 06:50', N, 'Dr. Roberto Silva', 'Dr. Carlos Méndez', 4, 7),
  row('03 Ago 2026, 22:50', V, 'Dra. Ana Gómez', 'Dr. Roberto Silva', 6, 11),
  row('03 Ago 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 6, 11),
  row('03 Ago 2026, 06:55', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 5, 11),
  row('28 Jul 2026, 22:45', V, 'Dra. Ana Gómez', 'Dra. Laura Sánchez', 7, 17),
  row('28 Jul 2026, 14:55', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 7, 17),
  row('28 Jul 2026, 06:50', N, 'Dr. Roberto Silva', 'Dr. Carlos Méndez', 6, 17),
  row('22 Jul 2026, 22:50', V, 'Dra. Ana Gómez', 'Dr. Roberto Silva', 5, 23),
  row('22 Jul 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 5, 23),
  row('22 Jul 2026, 06:55', N, 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', 4, 23),
];

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
  const [rows] = useState<Row[]>(() =>
    state?.handedOff ? [row('14 Ago 2026, 14:50', M, 'Dr. Carlos Méndez', 'Dra. Ana Gómez', 8, 0, 'Pendiente'), ...ROWS] : ROWS,
  );
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
            <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">Mostrando registros auditados de la UCI</p>
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
                  key={r.date}
                  {...rowLink(SUMMARY_PATH)}
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
                    <Button variant="outline" size="sm" to={SUMMARY_PATH}>
                      Ver Resumen
                    </Button>
                  </div>
                </div>
              ))}
              {shown.length === 0 && (
                <EmptyState
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
