// Hoja imprimible del paciente ("Generar Reporte" de la cabecera y "Hoja del paciente" de Reportes): una página con
// los datos reales del expediente y los signos de ahora, para imprimir o guardar en PDF desde el navegador.
// No se guarda en ningún lado: el backend no tiene reportes clínicos (CONEXION-BACKEND.md, pedido 14).
import { useRef, type ReactNode } from 'react';
import { useAlerts, useMonitoredBeds, useSoapNotes } from '../../api/queries';
import { getSignosExtra, useExtra } from '../../api/sinBackend';
import { alertTitle, esActiva, groupAlerts } from '../../lib/alerts';
import { fmtDate, fmtDateTime, staffName } from '../../lib/clinical';
import { imprimirElemento } from '../../lib/imprimir';
import { useDisplayUser } from '../auth/session';
import { Button } from '../ui/Button';
import { CloseButton, Modal } from '../ui/Modal';
import type { PatientView } from './usePatient';

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5 break-inside-avoid">
      <h3 className="border-b border-line pb-1 font-jakarta text-[13px] font-extrabold uppercase tracking-wide text-ink">{titulo}</h3>
      <div className="font-jakarta text-[13px] leading-[1.45] text-ink">{children}</div>
    </section>
  );
}

const Lista = ({ items, vacio }: { items: string[]; vacio: string }) =>
  items.length ? (
    <ul className="list-disc pl-5">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  ) : (
    <p className="text-muted">{vacio}</p>
  );

export function HojaPaciente({ v, onClose }: { v: PatientView; onClose: () => void }) {
  const me = useDisplayUser();
  const hoja = useRef<HTMLElement>(null);
  const bed = useMonitoredBeds().data?.find((b) => b.patientId === v.id);
  const vitals = bed?.vitals;
  const signos = useExtra('signos', v.cedula, getSignosExtra).data;
  const device = v.assigned?.device ?? bed?.device ?? undefined;
  const alertas = groupAlerts(useAlerts({ device, limit: 500 }, !!device).data ?? []).filter((g) => esActiva(g));
  const nota = useSoapNotes(v.id).data?.find((n) => n.parentId === null);
  const e = v.expediente;
  const activos = (filas: Array<Record<string, unknown>> | undefined, estado: string) => (filas ?? []).filter((f) => f.status === estado);

  const diagnosticos = activos(e?.diagnosticos, 'activo').map((d) => [texto(d.description), texto(d.code) && `(${d.code})`].filter(Boolean).join(' '));
  // Con la severidad (REVISION-DETALLES.md, D): "Penicilina (grave) — urticaria".
  const alergias = activos(e?.alergias, 'activa').map((a) => [texto(a.substance), a.severity && `(${String(a.severity)})`, texto(a.reaction) && `— ${a.reaction}`].filter(Boolean).join(' '));
  const medicamentos = activos(e?.medicamentos, 'activo').map((m) => [texto(m.name), texto(m.dose), texto(m.route), texto(m.frequency)].filter(Boolean).join(' '));
  const signosTexto = [
    vitals?.hr != null && `FC ${vitals.hr} lpm`,
    vitals?.spo2 != null && `SpO2 ${vitals.spo2} %`,
    vitals?.resp != null && `FR ${vitals.resp} rpm`,
    signos && `PA ${signos.pa.sis}/${signos.pa.dia} mmHg (simulada)`,
    signos && `Temp ${signos.temp.toFixed(1)} °C${signos.tempDelMonitor ? '' : ' (simulada)'}`,
  ].filter(Boolean) as string[];

  return (
    <Modal labelledBy="hoja-paciente-titulo" onClose={onClose} width={820} className="gap-4 p-5 sm:p-8">
      <div className="flex w-full items-center justify-between gap-3" data-no-imprimir>
        <h2 id="hoja-paciente-titulo" className="font-jakarta text-[18px] font-extrabold leading-[normal] text-ink">
          Hoja del paciente
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => imprimirElemento(hoja.current, `Hoja de ${v.name}`)}>Imprimir o guardar en PDF</Button>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <article ref={hoja} className="flex w-full flex-col gap-4 rounded-lg border border-line bg-white p-5">
        <header className="flex flex-col gap-1 border-b-2 border-ink pb-3">
          <p className="font-jakarta text-[11px] font-bold uppercase tracking-wider text-muted">SIAPPC · Hoja del paciente</p>
          <h1 className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">{v.name}</h1>
          <p className="font-jakarta text-[13px] text-ink">
            {[`Cédula ${v.cedula}`, v.age !== null && `${v.age} años`, v.patient.sex === 'F' ? 'Femenino' : v.patient.sex === 'M' ? 'Masculino' : null, v.patient.bloodType && `Sangre ${v.patient.bloodType}`, v.bed && `Cama ${v.bed}`]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className="font-jakarta text-[12px] text-muted">{`Ingreso: ${fmtDate(v.assigned?.admittedAt ?? v.patient.arrivedAt)} · Estado: ${v.stateLabel} · Motivo: ${v.patient.reason}`}</p>
        </header>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Seccion titulo="Diagnósticos activos">
            <Lista items={diagnosticos} vacio="Sin diagnósticos activos." />
          </Seccion>
          <Seccion titulo="Alergias">
            <Lista items={alergias} vacio="Sin alergias registradas." />
          </Seccion>
          <Seccion titulo="Medicamentos activos">
            <Lista items={medicamentos} vacio="Sin medicamentos activos." />
          </Seccion>
          <Seccion titulo="Signos vitales ahora">
            <Lista items={signosTexto} vacio="Sin lecturas." />
          </Seccion>
          <Seccion titulo="Alertas activas (últimos 30 min)">
            <Lista items={alertas.map((g) => `${alertTitle(g.variable, g.severity, g.latest.value)} — ${g.count} avisos`)} vacio="Sin alertas activas." />
          </Seccion>
          <Seccion titulo="Glasgow">
            <p>{v.assigned?.glasgow ? `${v.assigned.glasgow}/15` : 'Sin exploración física registrada.'}</p>
          </Seccion>
        </div>
        <Seccion titulo={nota ? `Última nota SOAP · ${fmtDateTime(nota.at)} · ${staffName(nota.authorName)}` : 'Última nota SOAP'}>
          {nota ? (
            <div className="flex flex-col gap-1">
              {[
                ['S', nota.subjective],
                ['O', nota.objective],
                ['A', nota.assessment],
                ['P', nota.plan],
              ].map(([l, t]) => (
                <p key={l}>
                  <span className="font-bold">{`${l}: `}</span>
                  {t ?? '—'}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted">Sin notas SOAP.</p>
          )}
        </Seccion>
        <footer className="border-t border-line pt-2 font-jakarta text-[11px] text-muted">
          {`Generada el ${fmtDateTime(new Date().toISOString())} por ${me.name}. PA y temperatura marcadas como simuladas no vienen del monitor.`}
        </footer>
      </article>
    </Modal>
  );
}
