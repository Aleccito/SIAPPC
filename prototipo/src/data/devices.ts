// Monitores de UCI de ejemplo. Los usan "Dispositivos — Monitores UCI" y la pantalla
// nueva "Detalle de Monitor". Los 8 primeros son los de Figma; los 4 últimos se
// agregaron para la paginación ("Mostrando 8 de 12").
import imgRowC01Vector from '../assets/row-c-01-vector.svg';
import imgRowC06Vector from '../assets/row-c-06-vector.svg';
import imgRowC07Vector from '../assets/row-c-07-vector.svg';

export type DeviceStatus = 'ACTIVO' | 'FALLA' | 'INACTIVO';

export type Device = {
  bed: string;
  icon: string;
  patient: string;
  age?: string;
  model: string;
  serial: string;
  status: DeviceStatus;
  battery: number;
  calibration: string;
  calibrationDue?: boolean;
  signals: string[];
  rowBg?: string;
};

export const STATUS_TONE = { ACTIVO: 'success', FALLA: 'danger', INACTIVO: 'neutral' } as const;

export const DEVICES: Device[] = [
  { bed: 'C-01', icon: imgRowC01Vector, patient: 'María González', age: '64 años', model: 'Philips IntelliVue MX800', serial: 'MX800-A10231', status: 'ACTIVO', battery: 92, calibration: '15 Jul 2026', signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-02', icon: imgRowC01Vector, patient: 'Juan García', age: '72 años', model: 'GE CARESCAPE B650', serial: 'B650-G20417', status: 'ACTIVO', battery: 87, calibration: '20 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'FR'] },
  { bed: 'C-03', icon: imgRowC01Vector, patient: 'Carlos Rodríguez', age: '58 años', model: 'Philips IntelliVue MX800', serial: 'MX800-A10244', status: 'ACTIVO', battery: 95, calibration: '01 Ago 2026', signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-05', icon: imgRowC01Vector, patient: 'Laura Torres', age: '49 años', model: 'Mindray BeneVision N22', serial: 'N22-M30518', status: 'ACTIVO', battery: 78, calibration: '10 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'Temp'] },
  { bed: 'C-06', icon: imgRowC06Vector, patient: 'Francisco Díaz', age: '81 años', model: 'GE CARESCAPE B650', serial: 'B650-G20433', status: 'FALLA', battery: 15, calibration: '05 Jul 2026', signals: ['ECG (intermitente)'], rowBg: 'bg-danger-soft' },
  { bed: 'C-07', icon: imgRowC07Vector, patient: '— Disponible —', model: 'Philips IntelliVue MX550', serial: 'MX550-A40102', status: 'INACTIVO', battery: 100, calibration: '28 Jul 2026', signals: ['—'], rowBg: 'bg-[rgba(248,250,252,0.7)]' },
  { bed: 'C-09', icon: imgRowC01Vector, patient: 'Ana Morales', age: '35 años', model: 'Mindray BeneVision N22', serial: 'N22-M30526', status: 'ACTIVO', battery: 65, calibration: '25 Jun 2026', calibrationDue: true, signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-11', icon: imgRowC01Vector, patient: 'Pedro Sánchez', age: '53 años', model: 'Philips IntelliVue MX800', serial: 'MX800-A10259', status: 'ACTIVO', battery: 88, calibration: '30 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'FR'] },
  // Agregados para la página 2 (datos de ejemplo).
  { bed: 'C-04', icon: imgRowC01Vector, patient: 'Alberto Ruiz', age: '45 años', model: 'Philips IntelliVue MX550', serial: 'MX550-A40115', status: 'ACTIVO', battery: 81, calibration: '18 Jul 2026', signals: ['ECG', 'SpO2', 'PA'] },
  { bed: 'C-08', icon: imgRowC01Vector, patient: 'Diego Torres', age: '39 años', model: 'GE CARESCAPE B650', serial: 'B650-G20450', status: 'ACTIVO', battery: 90, calibration: '22 Jul 2026', signals: ['ECG', 'SpO2'] },
  { bed: 'C-10', icon: imgRowC01Vector, patient: 'Elena Rodríguez', age: '64 años', model: 'Mindray BeneVision N22', serial: 'N22-M30533', status: 'ACTIVO', battery: 69, calibration: '26 Jul 2026', signals: ['ECG', 'SpO2', 'PA', 'FR'] },
  { bed: 'C-12', icon: imgRowC01Vector, patient: 'María Fernández', age: '58 años', model: 'Philips IntelliVue MX800', serial: 'MX800-A10262', status: 'ACTIVO', battery: 74, calibration: '20 Jun 2026', calibrationDue: true, signals: ['ECG', 'SpO2', 'PA'] },
];

/** Ruta de la pantalla "Detalle de Monitor" para una cama. */
export const deviceDetailPath = (bed: string) => `/MedDispositivoDetalle?cama=${bed}`;

/** Busca un monitor por cama; si no existe, devuelve el primero. */
export const deviceByBed = (bed: string | null) => DEVICES.find((d) => d.bed === bed) ?? DEVICES[0];

const FIRMWARE: Record<string, string> = {
  'Philips IntelliVue MX800': 'M.03.21',
  'Philips IntelliVue MX550': 'M.03.18',
  'GE CARESCAPE B650': 'v3.2.1',
  'Mindray BeneVision N22': '01.42.00',
};

export const firmwareOf = (d: Device) => FIRMWARE[d.model] ?? '—';

export const lastSeenOf = (d: Device) =>
  d.status === 'FALLA' ? 'Hace 4 min (intermitente)' : d.status === 'INACTIVO' ? 'Ayer, 16:30' : 'En línea · hace 3 s';

/** Historial de calibraciones de ejemplo (la más reciente es la de la tabla). */
export const calibrationsOf = (d: Device) => [
  { date: d.calibration, tech: 'Ing. Mario Vargas', result: d.calibrationDue ? 'Vencida' : 'Aprobada' },
  { date: '12 Ene 2026', tech: 'Ing. Mario Vargas', result: 'Aprobada' },
  { date: '08 Jul 2025', tech: 'Ing. Laura Pineda', result: 'Aprobada' },
];

/** Eventos recientes de ejemplo según el estado del monitor. */
export const eventsOf = (d: Device) => {
  if (d.status === 'FALLA')
    return [
      { time: 'Hoy, 08:12', text: 'Señal de ECG intermitente', tone: 'danger' as const },
      { time: 'Hoy, 07:40', text: 'Batería por debajo del 20 %', tone: 'warning' as const },
      { time: 'Ayer, 22:05', text: 'Desconexión del sensor de SpO2', tone: 'danger' as const },
    ];
  if (d.status === 'INACTIVO')
    return [
      { time: 'Ayer, 16:30', text: 'Monitor liberado al dar de alta al paciente', tone: 'neutral' as const },
      { time: '28 Jul 2026', text: 'Calibración completada', tone: 'success' as const },
    ];
  return [
    { time: 'Hoy, 08:00', text: 'Transmisión estable a la central', tone: 'success' as const },
    { time: 'Ayer, 19:20', text: 'Cambio de batería', tone: 'neutral' as const },
    { time: d.calibration, text: d.calibrationDue ? 'Calibración pendiente de renovar' : 'Calibración completada', tone: d.calibrationDue ? ('warning' as const) : ('success' as const) },
  ];
};
