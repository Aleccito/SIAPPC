// Pantalla "med-turno-historial" (Figma node 259:15) — generada desde el diseño original de Figma.
import { AppLayout, Badge, Button, Card, Pagination, SearchBox, Select, Table, Tabs } from '../../components';

const TURNO_TABS = [
  { id: 'nueva', label: 'Nueva Entrega', to: '/MedTurnoEntregaHandoff' },
  { id: 'historial', label: 'Historial de Entregas', to: '/MedTurnoHistorial' },
];

const ROWS: Array<[string, string, string, string, string, 'Leído' | 'Pendiente']> = [
  ['14 Ago 2026, 06:55', 'Nocturno (23:00 - 07:00)', 'Dra. Laura Sánchez', 'Dr. Carlos Méndez', '3 pax', 'Leído'],
  ['13 Ago 2026, 22:50', 'Vespertino (15:00 - 23:00)', 'Dra. Ana Gómez', 'Dra. Laura Sánchez', '7 pax', 'Leído'],
  ['13 Ago 2026, 14:45', 'Matutino (07:00 - 15:00)', 'Dr. Carlos Méndez', 'Dra. Ana Gómez', '7 pax', 'Pendiente'],
  ['13 Ago 2026, 06:50', 'Nocturno (23:00 - 07:00)', 'Dr. Roberto Silva', 'Dr. Carlos Méndez', '4 pax', 'Leído'],
  ['12 Ago 2026, 22:45', 'Vespertino (15:00 - 23:00)', 'Dra. Ana Gómez', 'Dr. Roberto Silva', '6 pax', 'Leído'],
  ['12 Ago 2026, 14:55', 'Matutino (07:00 - 15:00)', 'Dr. Carlos Méndez', 'Dra. Ana Gómez', '6 pax', 'Leído'],
];

export default function MedTurnoHistorial() {
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
              <Select label="Fecha:">Últimos 7 días</Select>
              <Select label="Turno:">Todos los turnos</Select>
            </div>
            <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">Mostrando registros auditados de la UCI</p>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-line">
            <Table minWidth={1030}>
              <div className="flex w-full gap-2 border-b border-line bg-surface p-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                <p className="w-[160px] shrink-0">Fecha</p>
                <p className="w-[200px] shrink-0">Turno</p>
                <p className="w-[180px] shrink-0">Entregó</p>
                <p className="w-[180px] shrink-0">Recibió</p>
                <p className="w-[100px] shrink-0">Pacientes</p>
                <p className="w-[120px] shrink-0">Estado</p>
                <p className="min-w-0 flex-1 text-right">Acción</p>
              </div>
              {ROWS.map(([date, shift, from, to, pax, status]) => (
                <div key={date} className="flex w-full items-center gap-2 border-b border-line p-[14px] font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <p className="w-[160px] shrink-0 font-bold text-ink">{date}</p>
                  <p className="w-[200px] shrink-0 font-semibold text-ink">{shift}</p>
                  <p className="w-[180px] shrink-0 font-normal text-muted">{from}</p>
                  <p className="w-[180px] shrink-0 font-normal text-muted">{to}</p>
                  <div className="w-[100px] shrink-0">
                    <Badge tone="neutral">{pax}</Badge>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <Badge tone={status === 'Leído' ? 'success' : 'warning'} className="w-[90px] justify-center">
                      {status}
                    </Badge>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-end">
                    <Button variant="outline" size="sm">
                      Ver Resumen
                    </Button>
                  </div>
                </div>
              ))}
            </Table>
          </div>

          <Pagination summary="Mostrando 1-6 de 24 entregas" page={1} pages={4} className="pt-3" />
        </Card>
      </div>
    </AppLayout>
  );
}
