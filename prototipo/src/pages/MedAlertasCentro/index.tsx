// Pantalla "med/alertas/centro" (Figma node 48:7) — generada desde el diseño original de Figma.
import imgBell10 from '../../assets/bell-10.svg';
import imgBell11 from '../../assets/bell-11.svg';
import imgBell9 from '../../assets/bell-9.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import { AppLayout, Button, IconCalendar, KpiCard, Select, Table } from '../../components';
import { cn } from '../../lib/cn';

type Alert = {
  bed: string;
  icon: string;
  stripe: string;
  event: string;
  eventColor: string;
  time: string;
  owner: string;
  ownerColor?: string;
  attending?: boolean;
  highlight?: 'danger' | 'selected';
};

const ALERTS: Alert[] = [
  { bed: 'C-03 María González', icon: imgBell9, stripe: 'bg-danger', event: 'SpO2 Crítico — 84% en ventilador mecánico', eventColor: 'text-danger', time: 'Hace 1 min', owner: 'Dr. Roberto Silva (Asignado)', highlight: 'danger' },
  { bed: 'C-09 Francisco Díaz', icon: imgBell10, stripe: 'bg-warning', event: 'FC Elevada — Taquicardia de 145 lpm detectada', eventColor: 'text-[#d97706]', time: 'Hace 3 min', owner: 'Atendiendo', ownerColor: 'text-[#d97706]', attending: true, highlight: 'selected' },
  { bed: 'C-01 Ricardo Gómez', icon: imgBell10, stripe: 'bg-warning', event: 'Temperatura Elevada — 39.1°C persistente', eventColor: 'text-muted', time: 'Hace 8 min', owner: 'Dra. Ana Gómez' },
  { bed: 'C-06 Javier Mendoza', icon: imgBell10, stripe: 'bg-warning', event: 'Presión Arterial Límite — 148/92 mmHg', eventColor: 'text-muted', time: 'Hace 12 min', owner: 'Dr. Roberto Silva' },
  { bed: 'C-11 Sofía Martínez', icon: imgBell11, stripe: 'bg-success', event: 'Desconexión de Sonda Vesical detectada', eventColor: 'text-muted', time: 'Hace 15 min', owner: 'Enf. Lucía Fernández' },
];

const HISTORY = [
  ['08:15', imgLiveIndicatorEllipse, 'Andrés Castro', 'SpO2 Recuperado', 'Enf. Carlos M.', '1.5 min'],
  ['08:02', imgDropdownBadgeEllipse, 'Elena Rodríguez', 'FC Muy Alta', 'Dr. R. Silva', '2.1 min'],
  ['07:45', imgDropdownBadgeEllipse2, 'Gabriela Ruiz', 'Ritmo Inestable', 'Dr. C. Méndez', '3.2 min'],
  ['07:30', imgDropdownBadgeEllipse2, 'Lucía Fernández', 'Fiebre 38.9°C', 'Enf. Carlos M.', '4.0 min'],
  ['07:12', imgDropdownBadgeEllipse, 'Javier Mendoza', 'SpO2 Crítico', 'Dr. R. Silva', '1.8 min'],
  ['06:50', imgDropdownBadgeEllipse2, 'Elena Rodríguez', 'Presión Baja', 'Dra. A. Gómez', '2.5 min'],
];

export default function MedAlertasCentro() {
  return (
    <AppLayout
      breadcrumb="SIAPPC > Alertas"
      title="Centro de Alertas Críticas"
      actions={
        <>
          <Select>Severidad: Todas</Select>
          <Select>Estado: Activas</Select>
          <Select icon={<IconCalendar size={14} className="text-muted" />} chevron={false}>
            Hoy, 24 Oct 2025
          </Select>
        </>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Alertas Activas" value="5" tone="danger" badge="Acción Urgente" />
          <KpiCard label="Pendientes de Atención" value="3" tone="warning" badge="En Cola" />
          <KpiCard label="Tiempo Resp. Promedio" value="2.3" unit="min" tone="success" badge="Bajo el límite" />
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-6 xl:flex-row">
          <section className="flex w-full min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Alertas Críticas Activas</h2>
            <div className="flex w-full flex-col gap-3">
              {ALERTS.map((a) => (
                <article
                  key={a.bed}
                  className={cn(
                    'flex w-full items-stretch overflow-hidden rounded-xl',
                    a.highlight === 'selected' ? 'border-2 border-primary bg-primary-soft' : 'border border-line',
                    a.highlight === 'danger' ? 'bg-danger-soft' : a.highlight !== 'selected' && 'bg-white',
                  )}
                >
                  <div className={cn('w-1.5 shrink-0', a.stripe)} />
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-1.5 leading-[normal]">
                      <div className="flex items-center gap-2">
                        <img className="size-3.5 shrink-0" alt="" src={a.icon} />
                        <p className="font-jakarta text-[15px] font-extrabold text-ink">{a.bed}</p>
                      </div>
                      <p className={cn('font-jakarta text-[13px] font-semibold', a.eventColor)}>{a.event}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                        <p className="font-jakarta font-medium text-subtle">{a.time}</p>
                        <p className={cn('font-jakarta font-semibold', a.ownerColor ?? 'text-primary')}>{a.owner}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="secondary">Silenciar</Button>
                      {a.attending ? <Button variant="warning">Atendiendo</Button> : <Button>Atender</Button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="flex w-full min-w-0 flex-col gap-3 xl:w-[450px] xl:shrink-0">
            <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Historial Resuelto (Últimas horas)</h2>
            <div className="w-full overflow-hidden rounded-xl border border-line bg-white">
              <Table minWidth={426}>
                <div className="flex w-full gap-3 border-b border-line bg-surface px-3 py-2.5 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                  <p className="w-[45px] shrink-0">HORA</p>
                  <p className="w-[105px] shrink-0">PACIENTE</p>
                  <p className="min-w-[110px] flex-1">EVENTO</p>
                  <p className="w-[80px] shrink-0 text-right">RESP.</p>
                </div>
                {HISTORY.map(([time, dot, patient, event, by, resp], i) => (
                  <div key={time} className={cn('flex w-full items-start gap-3 border-b border-line p-3 last:border-b-0', i % 2 ? 'bg-surface' : 'bg-white')}>
                    <p className="w-[45px] shrink-0 font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{time}</p>
                    <div className="flex w-[105px] shrink-0 items-center gap-1.5">
                      <img className="size-1.5 shrink-0" alt="" src={dot} />
                      <p className="truncate font-jakarta text-[13px] font-bold leading-[normal] text-ink">{patient}</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col gap-0.5 leading-[normal]">
                      <p className="font-jakarta text-[12px] font-semibold text-ink">{event}</p>
                      <p className="font-jakarta text-[10px] font-normal text-subtle">{by}</p>
                    </div>
                    <p className="w-[80px] shrink-0 text-right font-jakarta text-[12px] font-bold leading-[normal] text-success">{resp}</p>
                  </div>
                ))}
              </Table>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
