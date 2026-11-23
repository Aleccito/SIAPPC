// Pantalla "med/turno/resumen-recibido" (Figma node 245:729) — generada desde el diseño original de Figma.
import { useState, type SyntheticEvent } from 'react';
import { AppLayout, Badge, Button, Card, IconCheck, rowLinkClass, SearchBox, Table, useRowLink, useToast } from '../../components';
import { cn } from '../../lib/cn';

const PATIENTS: Array<{ name: string; hc: string; status: string; tone: 'danger' | 'warning'; bed: string; vitals: string; events: string; pending: string; urgent?: boolean }> = [
  { name: 'María González', hc: 'PT-8821', status: 'Crítico', tone: 'danger', bed: 'UCI Cama D3', vitals: 'FC:112 SpO2:89% PA:85/50', events: 'Desaturación 03:00, ajuste FiO2 exitoso', pending: 'TAC control urgente', urgent: true },
  { name: 'Juan García', hc: 'PT-3991', status: 'Atención', tone: 'warning', bed: 'UCI Cama C5', vitals: 'FC:88 SpO2:94% PA:110/70', events: 'Glasgow mejoró 9→11, estable toda la noche', pending: 'Evaluar retiro sedación' },
  { name: 'Carlos Rodríguez', hc: 'PT-1102', status: 'Crítico', tone: 'danger', bed: 'UCI Cama D1', vitals: 'FC:105 SpO2:91% PA:95/55', events: 'Ingreso 02:15, politrauma, estabilizado', pending: 'Completar nota ingreso' },
];

const ALERTS = [
  ['02:15 hrs', 'bg-danger', 'Ingreso paciente politrauma Rodríguez - estabilización inmediata requerida'],
  ['03:00 hrs', 'bg-danger', 'Desaturación crítica González (SpO2: 84%) - Intervención: ajuste FiO2 a 50%'],
  ['04:20 hrs', 'bg-warning', 'FC elevada García (102 bpm) - Autoresuelta en 15 min'],
  ['05:30 hrs', 'bg-success', 'Laboratorios de control procesados - sin valores críticos'],
];

const TASKS = [
  'TAC control urgente - María González',
  'Evaluar retiro de sedación - Juan García',
  'Completar nota de ingreso - Carlos Rodríguez',
  'Revisión de laboratorios de control (4 pacientes)',
  'Contactar familiar González (actualización estado)',
];

const INDICATIONS = [
  'González: NO reducir FiO2 sin gasometría previa',
  'García: Suspender propofol solo si GCS ≥ 12 sostenido por 2h',
  'Rodríguez: Pendiente consentimiento quirúrgico',
];

const stop = (e: SyntheticEvent) => e.stopPropagation();

const CardHeading = ({ children }: { children: string }) => (
  <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>
);

export default function MedTurnoResumenRecibido() {
  const rowLink = useRowLink();
  const toast = useToast();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [read, setRead] = useState(false);
  const toggle = (t: string) =>
    setDone((s) => {
      const next = new Set(s);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <AppLayout
      breadcrumb="SIAPPC > Turno > Resumen Recibido"
      title="Entrega de Turno"
      actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, HC..." width={280} />}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-5 p-4 md:p-8">
        <div className="flex w-full flex-col gap-3">
          <p className="font-jakarta text-[11px] font-medium leading-[normal] text-muted">SIAPPC &gt; Dashboard &gt; Resumen de Turno</p>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">Resumen de Turno Recibido</h2>
              <span className={cn('rounded-md px-2.5 py-1 font-jakarta text-[12px] font-bold leading-[normal]', read ? 'bg-success-soft text-success' : 'bg-warning-soft text-[#92400e]')}>
                {read ? 'Leído' : 'En revisión'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-[12px] leading-[normal] sm:items-end">
              <p className="font-jakarta font-semibold text-ink">Turno Nocturno 23:00-07:00</p>
              <p className="font-jakarta font-normal text-muted">Fecha: 14 Ago 2026, 06:55 hrs</p>
              <p className="font-jakarta font-normal text-muted">3 pacientes incluidos</p>
            </div>
          </div>
          <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">Entregado por: Dra. Laura Sánchez - Médico de Guardia Nocturna</p>
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-5 xl:flex-row">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
            <Card className="flex w-full flex-col gap-[14px]">
              <div className="flex w-full items-center justify-between gap-3">
                <CardHeading>Pacientes Incluidos en la Entrega</CardHeading>
                <Badge tone="neutral">3 pacientes</Badge>
              </div>
              <div className="w-full overflow-hidden rounded-lg border border-line">
                <Table minWidth={1350}>
                  <div className="flex w-full items-center border-b border-line bg-surface px-3 py-2.5 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
                    <p className="w-[220px] shrink-0">Paciente</p>
                    <p className="w-[110px] shrink-0">Estado</p>
                    <p className="w-[180px] shrink-0">Ubicación</p>
                    <p className="w-[220px] shrink-0">Signos Vitales Clave</p>
                    <p className="w-[260px] shrink-0">Eventos del Turno</p>
                    <p className="w-[220px] shrink-0">Pendientes</p>
                    <p className="w-[120px] shrink-0">Acción</p>
                  </div>
                  {PATIENTS.map((p) => (
                    <div
                      key={p.hc}
                      {...rowLink('/MedPacienteResumen')}
                      aria-label={`Ver a ${p.name}`}
                      className={cn('flex w-full items-center border-b border-line p-3 font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0', rowLinkClass)}
                    >
                      <div className="flex w-[220px] shrink-0 flex-col gap-0.5">
                        <p className="font-bold">{p.name}</p>
                        <p className="text-[11px] font-normal text-muted">HC: {p.hc}</p>
                      </div>
                      <div className="w-[110px] shrink-0">
                        <Badge tone={p.tone}>{p.status}</Badge>
                      </div>
                      <p className="w-[180px] shrink-0">{p.bed}</p>
                      <p className="w-[220px] shrink-0">{p.vitals}</p>
                      <p className="w-[260px] shrink-0 pr-3">{p.events}</p>
                      <p className={`w-[220px] shrink-0 ${p.urgent ? 'font-semibold text-primary' : ''}`}>{p.pending}</p>
                      <div className="w-[120px] shrink-0" onClick={stop} onKeyDown={stop}>
                        <Button to="/MedPacienteResumen">Ver Paciente</Button>
                      </div>
                    </div>
                  ))}
                </Table>
              </div>
            </Card>

            <Card className="flex w-full flex-col gap-[14px]">
              <div className="flex w-full items-center justify-between gap-3">
                <CardHeading>Alertas del Turno Anterior</CardHeading>
                <Badge tone="neutral">4 alertas</Badge>
              </div>
              <ul className="flex w-full flex-col gap-3">
                {ALERTS.map(([time, dot, text]) => (
                  <li key={time} className="flex w-full items-start gap-3">
                    <p className="w-20 shrink-0 font-jakarta text-[13px] font-bold leading-[normal] text-primary">{time}</p>
                    <div className="flex min-w-0 flex-1 items-center gap-[10px]">
                      <span className={`size-[10px] shrink-0 rounded-full ${dot}`} />
                      <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal] text-ink">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-5 xl:w-[420px] xl:shrink-0">
            <Card className="flex w-full flex-col gap-[14px]">
              <CardHeading>Pendientes para Este Turno</CardHeading>
              <ul className="flex w-full flex-col gap-[10px]">
                {TASKS.map((t) => {
                  const checked = done.has(t);
                  return (
                    <li key={t}>
                      <button type="button" role="checkbox" aria-checked={checked} onClick={() => toggle(t)} className="flex w-full items-center gap-[10px] text-left">
                        <span
                          className={cn(
                            'flex size-[18px] shrink-0 items-center justify-center rounded border-2 text-white',
                            checked ? 'border-primary bg-primary' : 'border-muted',
                          )}
                        >
                          {checked && <IconCheck size={10} />}
                        </span>
                        <span className={cn('min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal]', checked ? 'text-muted line-through' : 'text-ink')}>{t}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="flex w-full flex-col gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] p-5">
              <CardHeading>Indicaciones Importantes</CardHeading>
              {INDICATIONS.map((t) => (
                <div key={t} className="flex w-full items-start gap-[10px]">
                  <span className="mt-[6px] size-2 shrink-0 rounded bg-warning" />
                  <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[1.5] text-[#92400e]">{t}</p>
                </div>
              ))}
            </div>

            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Notas del Turno Anterior</CardHeading>
              <p className="font-jakarta text-[13px] font-normal leading-[1.5] text-muted">
                Noche con un ingreso nuevo y un episodio de desaturación resuelto. González fue el caso más delicado - responde bien al ajuste. García muestra mejoría neurológica sostenida. Rodríguez estable post-estabilización.
              </p>
            </Card>

            <div className="flex w-full flex-col gap-[10px]">
              <Button
                size="lg"
                fullWidth
                disabled={read}
                onClick={() => {
                  setRead(true);
                  toast('Entrega de turno marcada como leída');
                }}
              >
                {read ? 'Leído ✓' : 'Marcar como Leído ✓'}
              </Button>
              <p className="w-full font-jakarta text-[11px] font-normal leading-[normal] text-muted">Al marcar como leído confirmas que revisaste la entrega de turno</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
