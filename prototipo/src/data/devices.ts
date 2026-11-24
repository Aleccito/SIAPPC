// Monitores de cama. Los usan "Dispositivos — Monitores UCI" y la pantalla "Detalle de Monitor".
//
// AVISO para la sección del administrador: las exportaciones y el tipo `Device` son los mismos de
// antes; cambió el contenido. Ahora son los 8 equipos de backend/db/seed-demo.sql (DEMO-DEV-01…08,
// "Monitor de prueba", simulados), en las camas de los 8 pacientes.
//
// Del seed: cama, paciente, modelo, código (como número de serie), estado y señales (hr, spo2, resp).
// No viene del seed (el backend no los tiene, CONEXION-BACKEND.md pedido 18): batería, calibraciones,
// firmware y eventos. El estado en vivo y la última lectura los da GET /dashboard/devices.
import imgRowC01Vector from '../assets/row-c-01-vector.svg';
import { DEL_SEED, DEL_SEED_CAMAS } from '../api/mock/seed/delSeed';
import { ageFrom } from '../lib/clinical';

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
  /** Agregados en el paso de IA (opcionales: no cambian lo que ya usaba la sección del administrador). */
  cedula?: string;
  unit?: string;
};

export const STATUS_TONE = { ACTIVO: 'success', FALLA: 'danger', INACTIVO: 'neutral' } as const;

const STATE: Record<string, DeviceStatus> = { activo: 'ACTIVO', mantenimiento: 'FALLA', inactivo: 'INACTIVO', baja: 'INACTIVO' };
const SIGNAL: Record<string, string> = { hr: 'FC', spo2: 'SpO2', resp: 'FR' };

// No viene del seed: batería y última calibración de cada equipo.
const EXTRA: Record<string, { battery: number; calibration: string; calibrationDue?: boolean }> = {
  'DEMO-DEV-01': { battery: 92, calibration: '15 Oct 2026' },
  'DEMO-DEV-02': { battery: 87, calibration: '20 Oct 2026' },
  'DEMO-DEV-03': { battery: 95, calibration: '01 Nov 2026' },
  'DEMO-DEV-04': { battery: 78, calibration: '10 Oct 2026' },
  'DEMO-DEV-05': { battery: 64, calibration: '20 May 2026', calibrationDue: true },
  'DEMO-DEV-06': { battery: 88, calibration: '30 Oct 2026' },
  'DEMO-DEV-07': { battery: 81, calibration: '18 Oct 2026' },
  'DEMO-DEV-08': { battery: 90, calibration: '22 Oct 2026' },
};

export const DEVICES: Device[] = Object.values(DEL_SEED)
  .map((p) => {
    const d = p.dispositivo;
    const age = ageFrom(p.nacimiento);
    return {
      bed: p.ingreso.cama,
      icon: imgRowC01Vector,
      patient: p.nombre,
      age: age !== null ? `${age} años` : undefined,
      model: d.modelo,
      serial: d.codigo,
      status: STATE[d.estado] ?? 'ACTIVO',
      signals: Object.keys(p.lecturas).map((v) => SIGNAL[v] ?? v),
      cedula: p.cedula,
      unit: DEL_SEED_CAMAS.find((c) => c.codigo === p.ingreso.cama)?.unidad,
      ...EXTRA[d.codigo],
    };
  })
  .sort((a, b) => a.bed.localeCompare(b.bed));

/** Ruta de la pantalla "Detalle de Monitor" para una cama. */
export const deviceDetailPath = (bed: string) => `/MedDispositivoDetalle?cama=${bed}`;

/** Busca un monitor por cama; si no existe, devuelve el primero. */
export const deviceByBed = (bed: string | null) => DEVICES.find((d) => d.bed === bed) ?? DEVICES[0];

// No viene del seed: firmware por modelo.
const FIRMWARE: Record<string, string> = { 'Monitor de prueba': 'sim-1.0.4' };

export const firmwareOf = (d: Device) => FIRMWARE[d.model] ?? '—';

export const lastSeenOf = (d: Device) =>
  d.status === 'FALLA' ? 'Hace 4 min (intermitente)' : d.status === 'INACTIVO' ? 'Sin lecturas' : 'En línea · hace un momento';

/** Historial de calibraciones (no viene del seed; la más reciente es la de la tabla). */
export const calibrationsOf = (d: Device) => [
  { date: d.calibration, tech: 'Ing. Mario Vargas', result: d.calibrationDue ? 'Vencida' : 'Aprobada' },
  { date: '12 Abr 2026', tech: 'Ing. Mario Vargas', result: 'Aprobada' },
  { date: '08 Oct 2025', tech: 'Ing. Laura Pineda', result: 'Aprobada' },
];

/** Eventos recientes según el estado del monitor (no viene del seed). */
export const eventsOf = (d: Device) => {
  if (d.status === 'FALLA')
    return [
      { time: 'Hoy, 08:12', text: 'Señal intermitente', tone: 'danger' as const },
      { time: 'Hoy, 07:40', text: 'Batería por debajo del 20 %', tone: 'warning' as const },
    ];
  if (d.status === 'INACTIVO') return [{ time: 'Ayer, 16:30', text: 'Monitor liberado al dar de alta al paciente', tone: 'neutral' as const }];
  return [
    { time: 'Hoy', text: `Transmisión estable a la central (${d.signals.join(', ')})`, tone: 'success' as const },
    { time: 'Al ingreso', text: `Monitor asignado a la cama ${d.bed}`, tone: 'neutral' as const },
    { time: d.calibration, text: d.calibrationDue ? 'Calibración pendiente de renovar' : 'Calibración completada', tone: d.calibrationDue ? ('warning' as const) : ('success' as const) },
  ];
};
