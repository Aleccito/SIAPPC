// Pantalla "med/alertas/confirmacion-atencion" (Figma node 245:631) — generada desde el diseño original de Figma.
// Muestra la alerta desde la que se llegó (Centro de Alertas, Dashboard o Resumen del
// paciente); si se entra directo, la de Figma. Los campos de texto son del paso 3.
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgBell4 from '../../assets/bell-4.svg';
import imgMockAlertRowEllipse from '../../assets/mock-alert-row-ellipse.svg';
import { AppLayout, Button, IconX, Modal, SearchBox, Select, useToast } from '../../components';
import { DEFAULT_ALERT, type AttendedState, type ConfirmState } from '../../data/alerts';

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

  return (
    <AppLayout
      breadcrumb="SIAPPC > Alertas"
      title="Centro de Control de Alertas"
      actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente, HC..." width={280} />}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-[20px] p-4 md:p-8" data-name="mock-alerts-body">
        <p className="font-jakarta text-[18px] font-bold leading-[normal] text-ink">Monitoreo Crítico Activo</p>
        <div className="flex w-full items-start gap-[12px] rounded-[8px] border border-danger bg-white p-[16px]" data-name="mock-alert-row">
          <img className="mt-[3px] size-[10px] shrink-0" alt="" src={imgMockAlertRowEllipse} />
          <p className="font-jakarta text-[14px] font-semibold leading-[normal] text-ink">
            {alert === DEFAULT_ALERT ? 'SpO2 por debajo de umbral de seguridad en Cama D3' : `${alert.title} — ${alert.bed}`}
          </p>
        </div>
      </div>

      {/* Ventana de confirmación sobre la pantalla */}
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
          <button type="button" aria-label="Cerrar" onClick={cancel} className="flex size-[16px] shrink-0 items-start text-muted hover:text-ink">
            <IconX size={12} />
          </button>
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
    </AppLayout>
  );
}
