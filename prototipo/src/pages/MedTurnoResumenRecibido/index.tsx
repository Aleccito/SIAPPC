// Pantalla "med/turno/resumen-recibido" (Figma node 245:729) — generada desde el diseño original de Figma.
// Los pacientes asignados, sus signos y alertas salen de src/api/; lo que se dijo de cada uno al entregar
// el turno, de src/api/sinBackend.ts (la entrega de turno no existe en el backend). Las alergias de
// "Indicaciones importantes" son las del seed.
import { useState, type SyntheticEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getEntregas, getTurno, marcarEntregaLeida } from '../../api/sinBackend';
import { AppLink } from '../../components/ui/AppLink';
import { AppLayout, Badge, Button, Card, IconCheck, rowLinkClass, SearchBox, Table, useRowLink, useToast } from '../../components';
import { usePatientRows } from '../../data/patients';
import { alertTitle } from '../../lib/alerts';
import { fmtDateTime, fmtTime, turnoDe } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';

const stop = (e: SyntheticEvent) => e.stopPropagation();
const surname = (name: string) => name.split(/\s+/)[1] ?? name;

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

const DOT = { critica: 'bg-danger', alta: 'bg-warning', media: 'bg-success', baja: 'bg-success' } as const;

export default function MedTurnoResumenRecibido() {
  const rowLink = useRowLink();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [done, setDone] = useState<Set<string>>(new Set());
  const { rows, groups } = usePatientRows();
  const turno = useQuery({ queryKey: ['sinBackend', 'turno'], queryFn: getTurno });
  // SIMULADO: la entrega elegida en el historial (?entrega=) o la última registrada en este navegador (pedido 11).
  const [params] = useSearchParams();
  const entregas = useQuery({ queryKey: ['sinBackend', 'entregas'], queryFn: getEntregas });
  const entrega = entregas.data?.find((e) => e.id === params.get('entrega')) ?? entregas.data?.[0];
  const [leidaAhora, setLeidaAhora] = useState(false);
  const read = leidaAhora || !!entrega?.leida;
  const toggle = (t: string) =>
    setDone((s) => {
      const next = new Set(s);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  const said = (cedula: string) => turno.data?.find((t) => t.cedula === cedula);
  // Las 4 alertas (agrupadas) más recientes del turno.
  const alerts = [...groups].sort((a, b) => b.latest.at.localeCompare(a.latest.at)).slice(0, 4);
  // Cada pendiente con su paciente: se tacha al hacerlo y lleva a su ficha.
  const tasks = rows.flatMap((r) => {
    const t = said(r.document);
    return t && t.tono !== 'success' ? [{ texto: `${t.pendiente} - ${r.name}`, cedula: r.document, nombre: r.name }] : [];
  });
  const indications = rows.flatMap((r) => (said(r.document)?.alergias ?? []).map((a) => `${surname(r.name)}: alergia a ${a.toLowerCase()} — no indicar ni usar.`));
  const critical = rows.filter((r) => r.state === 'critico');
  const notes = critical.length
    ? `Turno con ${critical.length} pacientes críticos. ${critical
        .slice(0, 3)
        .map((r) => `${surname(r.name)}: ${(said(r.document)?.novedad ?? '').replace(/\.$/, '')}.`)
        .join(' ')}`
    : 'Turno sin pacientes críticos.';

  return (
    <AppLayout breadcrumb="SIAPPC > Turno > Resumen Recibido" title="Entrega de Turno" actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, HC..." width={280} />}>
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
              <p className="font-jakarta font-semibold text-ink">{entrega ? `Turno ${entrega.turno}` : `Turno ${turnoDe().nombre} (${turnoDe().horas})`}</p>
              <p className="font-jakarta font-normal text-muted">{entrega ? `Entregado el ${fmtDateTime(entrega.at)}` : 'Sin fecha de entrega'}</p>
              <p className="font-jakarta font-normal text-muted">{`${entrega?.pacientes.length ?? rows.length} pacientes incluidos`}</p>
            </div>
          </div>
          <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">
            {entrega
              ? `Entregado por: ${entrega.entrego} (registrado en este navegador; el sistema todavía no tiene entrega de turno)`
              : 'Todavía no hay una entrega registrada en este navegador: se muestra lo que el sistema tiene de cada paciente.'}
          </p>
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-5 xl:flex-row">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
            <Card className="flex w-full flex-col gap-[14px]">
              <div className="flex w-full items-center justify-between gap-3">
                <CardHeading>Pacientes Incluidos en la Entrega</CardHeading>
                <Badge tone="neutral">{`${rows.length} pacientes`}</Badge>
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
                  {rows.map((p) => {
                    const t = said(p.document);
                    const to = patientPath('/MedPacienteResumen', p.document);
                    return (
                      <div
                        key={p.id}
                        {...rowLink(to)}
                        aria-label={`Ver a ${p.name}`}
                        className={cn('flex w-full items-center border-b border-line p-3 font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0', rowLinkClass)}
                      >
                        <div className="flex w-[220px] shrink-0 flex-col gap-0.5">
                          <p className="font-bold">{p.name}</p>
                          <p className="text-[11px] font-normal text-muted">HC: {p.document}</p>
                        </div>
                        <div className="w-[110px] shrink-0">
                          <Badge tone={p.tone}>{p.stateLabel}</Badge>
                        </div>
                        <p className="w-[180px] shrink-0">{`${p.unit ?? ''} Cama ${p.bed ?? '—'}`}</p>
                        <p className="w-[220px] shrink-0">{`FC:${p.vitals.hr ?? '—'} SpO2:${p.vitals.spo2 ?? '—'}%${p.signos ? ` PA:${p.signos.pa.sis}/${p.signos.pa.dia}` : ''}`}</p>
                        <p className="w-[260px] shrink-0 pr-3">{t?.novedad ?? '—'}</p>
                        <p className={`w-[220px] shrink-0 ${t?.tono === 'danger' ? 'font-semibold text-primary' : ''}`}>{t?.pendiente ?? '—'}</p>
                        <div className="w-[120px] shrink-0" onClick={stop} onKeyDown={stop}>
                          <Button to={to}>Ver Paciente</Button>
                        </div>
                      </div>
                    );
                  })}
                </Table>
              </div>
            </Card>

            <Card className="flex w-full flex-col gap-[14px]">
              <div className="flex w-full items-center justify-between gap-3">
                <CardHeading>Alertas del Turno Anterior</CardHeading>
                <Badge tone="neutral">{`${alerts.length} alertas`}</Badge>
              </div>
              <ul className="flex w-full flex-col gap-3">
                {alerts.map((g) => {
                  const p = rows.find((r) => r.device === g.device);
                  return (
                    <li key={g.key} className="flex w-full items-start gap-3">
                      <p className="w-20 shrink-0 font-jakarta text-[13px] font-bold leading-[normal] text-primary">{`${fmtTime(g.latest.at)} hrs`}</p>
                      <div className="flex min-w-0 flex-1 items-center gap-[10px]">
                        <span className={`size-[10px] shrink-0 rounded-full ${DOT[g.severity]}`} />
                        <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal] text-ink">{`${alertTitle(g.variable, g.severity, g.latest.value)} ${p ? surname(p.name) : ''} (${g.latest.value}) - ${g.count} avisos`}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-5 xl:w-[420px] xl:shrink-0">
            <Card className="flex w-full flex-col gap-[14px]">
              <CardHeading>Pendientes para Este Turno</CardHeading>
              <ul className="flex w-full flex-col gap-[10px]">
                {tasks.map((t) => {
                  const checked = done.has(t.texto);
                  return (
                    <li key={t.texto} className="flex w-full items-center gap-2">
                      <button type="button" role="checkbox" aria-checked={checked} onClick={() => toggle(t.texto)} className="flex min-w-0 flex-1 items-center gap-[10px] text-left">
                        <span className={cn('flex size-[18px] shrink-0 items-center justify-center rounded border-2 text-white', checked ? 'border-primary bg-primary' : 'border-muted')}>
                          {checked && <IconCheck size={10} />}
                        </span>
                        <span className={cn('min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[normal]', checked ? 'text-muted line-through' : 'text-ink')}>{t.texto}</span>
                      </button>
                      <AppLink to={patientPath('/MedPacienteResumen', t.cedula)} className="shrink-0 font-jakarta text-[12px] font-bold text-primary hover:underline" aria-label={`Abrir la ficha de ${t.nombre}`}>
                        Abrir
                      </AppLink>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="flex w-full flex-col gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] p-5">
              <CardHeading>Indicaciones Importantes</CardHeading>
              {indications.map((t) => (
                <div key={t} className="flex w-full items-start gap-[10px]">
                  <span className="mt-[6px] size-2 shrink-0 rounded bg-warning" />
                  <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[1.5] text-[#92400e]">{t}</p>
                </div>
              ))}
            </div>

            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Notas del Turno Anterior</CardHeading>
              <p className="font-jakarta text-[13px] font-normal leading-[1.5] text-muted">{entrega?.notas || notes}</p>
            </Card>

            <div className="flex w-full flex-col gap-[10px]">
              <Button
                size="lg"
                fullWidth
                disabled={read}
                onClick={async () => {
                  setLeidaAhora(true);
                  if (entrega) {
                    await marcarEntregaLeida(entrega.id);
                    void queryClient.invalidateQueries({ queryKey: ['sinBackend', 'entregas'] });
                  }
                  toast('Entrega marcada como leída (en este navegador)');
                }}
              >
                <span className="flex items-center gap-1.5">
                {read ? 'Leído' : 'Marcar como Leído'}
                <IconCheck size={14} />
              </span>
              </Button>
              <p className="w-full font-jakarta text-[11px] font-normal leading-[normal] text-muted">Al marcar como leído confirmas que revisaste la entrega de turno</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
