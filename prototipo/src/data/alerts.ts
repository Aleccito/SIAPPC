// Alertas de ejemplo que viajan entre pantallas (Centro de Alertas, Dashboard, Resumen
// del paciente → Confirmación de atención → de vuelta). Sin backend: van en el
// `state` de la navegación.

export type AlertInfo = {
  /** Identificador de la alerta (la cama). */
  id: string;
  patient: string;
  bed: string;
  title: string;
  detail: string;
};

/** La alerta que muestra Figma en la pantalla de confirmación. */
export const DEFAULT_ALERT: AlertInfo = {
  id: 'C-03',
  patient: 'María González',
  bed: 'UCI Cama D3',
  title: 'Alerta Crítica — SpO2 por debajo de umbral (86%)',
  detail: 'Activada hace 8 minutos (14:32 hrs)',
};

/** Lo que recibe la pantalla de confirmación. */
export type ConfirmState = { alert: AlertInfo; from: string };

/** Lo que recibe la pantalla de origen al volver de la confirmación. */
export type AttendedState = { attendedId: string };

/** Ruta de la pantalla de confirmación. */
export const CONFIRM_PATH = '/MedAlertasConfirmacionAtencion';
