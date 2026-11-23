// Pantalla "med/alertas/confirmacion-atencion" (Figma node 245:631) — generada desde el diseño original de Figma.
// Muestra la alerta desde la que se llegó (Centro de Alertas, Dashboard o Resumen del
// paciente); si se entra directo, la de Figma. Los campos de texto son del paso 3.
// La ventana se dibuja sobre la pantalla de origen, no sobre el fondo de ejemplo de Figma
// ("Centro de Control de Alertas"), para que se vea de dónde se vino (REVISION.md, C8).
import { useState, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgBell4 from '../../assets/bell-4.svg';
import { Button, CloseButton, Modal, Select, useToast } from '../../components';
import { DEFAULT_ALERT, type AttendedState, type ConfirmState } from '../../data/alerts';
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

export default function MedAlertasConfirmacionAtencion() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const incoming = location.state as ConfirmState | null;
  const alert = incoming?.alert ?? DEFAULT_ALERT;
  const from = incoming?.from ?? '/MedAlertasCentro';
  const [classification, setClassification] = useState(CLASSIFICATIONS[0]);

  const cancel = () => navigate(from);
  const confirm = () => {
    toast(`Atención registrada · ${alert.patient}`);
    const state: AttendedState = { attendedId: alert.id };
    navigate(from, { state });
  };

  const Background = BACKGROUND[from] ?? MedAlertasCentro;

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

        <div className="relative h-0 w-full">
          <div className="absolute inset-x-0 -top-px h-px bg-line" />
        </div>

        <div className="flex w-full flex-col items-start gap-[16px]" data-name="attention-form">
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-action">
            <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">Acción tomada *</p>
            <div className="flex h-[80px] w-full flex-col items-start rounded-[8px] border border-line bg-surface p-[12px]" data-name="textarea-action">
              <p className="w-full font-jakarta text-[13px] font-normal leading-[normal] text-subtle">Describa la acción clínica realizada...</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-classification">
            <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">Clasificación de Alerta</p>
            <Select variant="input-plain" ariaLabel="Clasificación de alerta" options={CLASSIFICATIONS} value={classification} onChange={setClassification} />
          </div>
          <div className="flex w-full flex-col items-start gap-[6px]" data-name="form-group-notes">
            <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">
              Notas adicionales <span className="font-medium text-muted">(Opcional)</span>
            </p>
            <div className="flex h-[50px] w-full flex-col items-start rounded-[8px] border border-line bg-surface p-[12px]" data-name="textarea-notes">
              <p className="w-full font-jakarta text-[12px] font-normal leading-[normal] text-subtle">Observaciones secundarias...</p>
            </div>
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
