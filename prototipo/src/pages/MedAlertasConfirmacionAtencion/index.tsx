// Pantalla "med/alertas/confirmacion-atencion" (Figma node 245:631) — generada desde el diseño original de Figma.
// Muestra la alerta desde la que se llegó (Centro de Alertas, Dashboard o Resumen del
// paciente); si se entra directo, la alerta crítica más reciente de los pacientes asignados. "Acción tomada"
// es obligatoria (10 a 500 caracteres) y las
// notas, opcionales (hasta 500) (REVISION.md, paso 3, punto 2).
// La ventana se dibuja sobre la pantalla de origen, no sobre el fondo de ejemplo de Figma
// ("Centro de Control de Alertas"), para que se vea de dónde se vino (REVISION.md, C8).
// El backend no tiene "atender una alerta" (CONEXION-BACKEND.md, pedido 2): la atención se registra en
// esta visita y la alerta se oculta de las listas hasta recargar.
import { useState, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgBell4 from '../../assets/bell-4.svg';
import { useAlerts, useAssignedPatients } from '../../api/queries';
import { AiIdeasCard, Button, CloseButton, focusFirst, Modal, Select, TextArea, useToast, useValidation } from '../../components';
import { alertInfoFrom, attendedAlerts, type AlertInfo, type AttendedState, type ConfirmState } from '../../data/alerts';
import { groupAlerts } from '../../lib/alerts';
import { checkText } from '../../lib/validate';
import MedAlertasCentro from '../MedAlertasCentro';
import MedDashboardPrincipal from '../MedDashboardPrincipal';
import MedPacienteResumen from '../MedPacienteResumen';

/** Pantalla que queda de fondo según desde dónde se abrió la confirmación. */
const BACKGROUND: Record<string, ComponentType> = {
  '/MedAlertasCentro': MedAlertasCentro,
  '/MedDashboardPrincipal': MedDashboardPrincipal,
  '/MedPacienteResumen': MedPacienteResumen,
};

const CLASSIFICATIONS = ['Alerta verdadera atendida', 'Falsa alarma', 'Artefacto técnico', 'Escalada a otro servicio'];

/** Sin alerta en la navegación (entrada directa): la crítica más reciente de los pacientes asignados. */
function useDefaultAlert(enabled: boolean): AlertInfo | null {
  const alerts = useAlerts({ limit: 500 }, enabled);
  const patients = useAssignedPatients();
  if (!enabled || !alerts.data || !patients.data) return null;
  const group = groupAlerts(alerts.data).find((g) => !attendedAlerts.has(g.key));
  const p = group && patients.data.find((x) => x.device === group.device);
  return group && p ? alertInfoFrom(group, { cedula: p.document, name: p.name, bed: p.bed }) : null;
}

export default function MedAlertasConfirmacionAtencion() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const incoming = location.state as ConfirmState | null;
  const fallback = useDefaultAlert(!incoming);
  const alert: AlertInfo = incoming?.alert ??
    fallback ?? { id: '', patient: 'Cargando…', bed: '', title: 'Cargando la alerta…', detail: '' };
  const from = incoming?.from ?? '/MedAlertasCentro';
  const assigned = useAssignedPatients();
  const aiPatientId = assigned.data?.find((p) => p.document === alert.cedula)?.id;
  const [classification, setClassification] = useState(CLASSIFICATIONS[0]);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const form = useValidation({
    'atencion-accion': () => checkText(action, { required: true, min: 10, max: 500, requiredMessage: 'Describa la acción tomada' }),
    'atencion-notas': () => checkText(notes, { max: 500 }),
  });

  const cancel = () => navigate(from);
  const confirm = () => {
    form.markAll();
    const bad = (Object.keys(form.errors) as Array<keyof typeof form.errors>).find((k) => form.errors[k]);
    if (bad) {
      toast('Revise los campos marcados', 'info');
      focusFirst([bad]);
      return;
    }
    attendedAlerts.add(alert.id);
    // Solo en este equipo: el backend todavía no deja atender una alerta (pedido 2).
    toast(`Atención registrada en este equipo · ${alert.patient}`);
    const state: AttendedState = { attendedId: alert.id };
    navigate(from, { state });
  };

  const Background = BACKGROUND[from.split('?')[0]] ?? MedAlertasCentro;

  return (
    <>
      {/* La pantalla de origen queda de fondo; la ventana no deja tocarla. */}
      <div aria-hidden="true" inert>
        <Background />
      </div>
      <Modal labelledBy="confirmar-atencion-titulo" width={480} onClose={cancel} className="items-start gap-[20px] p-5 drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)] sm:p-6">
        <div className="flex w-full items-center justify-between gap-3" data-name="modal-header">
          <div className="flex min-w-0 items-center gap-[12px]" data-name="title-with-icon">
            <div className="flex size-[32px] shrink-0 items-center justify-center rounded-[16px] bg-danger-soft" data-name="alert-icon-red">
              <img className="size-[16px]" alt="" src={imgBell4} />
            </div>
            <h2 id="confirmar-atencion-titulo" className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">
              Confirmar Atención de Alerta
            </h2>
          </div>
          <CloseButton onClick={cancel} />
        </div>

        <div className="flex w-full flex-col items-start gap-[8px] rounded-[8px] bg-danger-soft p-[16px]" data-name="alert-summary-box">
          <p className="font-jakarta text-[14px] font-extrabold leading-[normal] text-danger">{alert.title}</p>
          <div className="flex w-full flex-col items-start gap-[4px] font-jakarta font-normal">
            <p className="text-[13px] leading-[normal] text-ink">
              <span className="font-bold">Paciente:</span> {alert.patient} — {alert.bed}
            </p>
            <p className="text-[12px] leading-[normal] text-muted">{alert.detail}</p>
          </div>
        </div>

        {/* No viene de Figma (PR 3): las ideas ayudan a decidir, pero no se copian a lo que se registra. */}
        {aiPatientId && alert.cedula && <AiIdeasCard variant="collapsible" patientId={aiPatientId} cedula={alert.cedula} className="w-full" />}

        <div className="relative h-0 w-full">
          <div className="absolute inset-x-0 -top-px h-px bg-line" />
        </div>

        <div className="flex w-full flex-col items-start gap-[16px]" data-name="attention-form">
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-action">
            <label htmlFor="atencion-accion" className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">
              Acción tomada *
            </label>
            <TextArea
              id="atencion-accion"
              value={action}
              onChange={setAction}
              onBlur={() => form.touch('atencion-accion')}
              placeholder="Describa la acción clínica realizada..."
              tone="surface"
              maxLength={500}
              aria-required
              error={form.show('atencion-accion')}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-classification">
            <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">Clasificación de Alerta</p>
            <Select variant="input-plain" ariaLabel="Clasificación de alerta" options={CLASSIFICATIONS} value={classification} onChange={setClassification} />
          </div>
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-notes">
            <label htmlFor="atencion-notas" className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">
              Notas adicionales <span className="font-medium text-muted">(Opcional)</span>
            </label>
            <TextArea
              id="atencion-notas"
              value={notes}
              onChange={setNotes}
              onBlur={() => form.touch('atencion-notas')}
              placeholder="Observaciones secundarias..."
              tone="surface"
              textSize={12}
              minHeight={50}
              maxLength={500}
              error={form.show('atencion-notas')}
            />
          </div>
        </div>

        <div className="flex w-full flex-wrap items-start justify-end gap-[12px]" data-name="modal-footer">
          <Button variant="secondary" onClick={cancel}>
            Cancelar
          </Button>
          <Button onClick={confirm}>Confirmar Atención</Button>
        </div>
      </Modal>
    </>
  );
}
