// Alertas que viajan entre pantallas (Centro de Alertas, Dashboard, Resumen del paciente →
// Confirmación de atención → de vuelta). El backend no tiene "atender una alerta"
// (docs/CONEXION-BACKEND.md, sección 7, pedido 2): lo atendido viaja en el `state` de la navegación.
import { alertTitle, alertValueText, type AlertGroup } from '../lib/alerts';
import { fmtAgo, fmtTime } from '../lib/clinical';

export type AlertInfo = {
  /** Identificador del grupo de alertas (`DEMO-DEV-02-spo2-critica`). */
  id: string;
  /** Cédula del paciente (para volver a su expediente). */
  cedula?: string;
  patient: string;
  bed: string;
  title: string;
  detail: string;
};

/** Datos de la confirmación a partir de un grupo de alertas del monitor. */
export function alertInfoFrom(group: AlertGroup, patient: { cedula: string; name: string; bed: string | null }): AlertInfo {
  const crit = group.severity === 'critica';
  return {
    id: group.key,
    cedula: patient.cedula,
    patient: patient.name,
    bed: patient.bed ? `Cama ${patient.bed}` : 'Sin cama',
    title: `${crit ? 'Alerta Crítica' : 'Alerta'} — ${alertTitle(group.variable, group.severity, group.latest.value)} (${alertValueText(group.variable, group.latest.value).replace(/^\S+ actual /, '')})`,
    detail: `Activada ${fmtAgo(group.latest.at)} (${fmtTime(group.latest.at)} hrs) · ${group.count} ${group.count === 1 ? 'aviso' : 'avisos'}`,
  };
}

/** Lo que recibe la pantalla de confirmación. */
export type ConfirmState = { alert: AlertInfo; from: string };

/** Lo que recibe la pantalla de origen al volver de la confirmación. */
export type AttendedState = { attendedId: string };

/** Ruta de la pantalla de confirmación. */
export const CONFIRM_PATH = '/MedAlertasConfirmacionAtencion';

/** Alertas atendidas en esta visita (no hay endpoint para reconocerlas): se ocultan hasta recargar. */
export const attendedAlerts = new Set<string>();
