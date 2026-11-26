// Los monitores de "Dispositivos — Monitores UCI" y "Detalle de Monitor".
//
// - Con el backend: la lista es GET /dashboard/devices (código, modelo, estado, paciente, sensores y última lectura),
//   con la cama y la unidad de GET /monitoring/beds y las señales de las lecturas recientes (GET /sensors/readings).
// - Sin backend: DEVICES de src/data/devices.ts, con el estado de GET /dashboard/devices del simulador (como antes).
//
// SIMULADO (el backend no los tiene, pedido 18 de CONEXION-BACKEND.md): batería, calibraciones, firmware y eventos.
// Para los 8 equipos del simulador son los de src/data/devices.ts; para los demás se generan por el código del
// equipo (siempre los mismos). src/data/devices.ts no cambia: lo usa también la sección del administrador.
import imgRowC01Vector from '../assets/row-c-01-vector.svg';
import { useDeviceStatus, useMonitoredBeds, useReadings, usePatients } from '../api/queries';
import { API_MODE, goesToBackend } from '../api/mode';
import { hashTexto } from '../api/simulacion';
import type { DeviceState } from '../api/types/dashboard';
import { ageFrom, fmtAgo } from '../lib/clinical';
import { DEVICES, type Device, type DeviceStatus } from './devices';

export type DeviceLive = Device & {
  /** "En línea · hace 20 s", a partir de la última lectura (solo con el backend). */
  lastSeen?: string;
};

const ESTADO: Record<DeviceState, DeviceStatus> = { activo: 'ACTIVO', mantenimiento: 'FALLA', inactivo: 'INACTIVO', baja: 'INACTIVO' };
const SENAL: Record<string, string> = { hr: 'FC', spo2: 'SpO2', resp: 'FR', temp: 'Temp', pr: 'Pulso', perfusion: 'Perfusión' };
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** SIMULADO: batería y última calibración de un equipo que no es de los 8. */
function extraGenerado(code: string): Pick<Device, 'battery' | 'calibration' | 'calibrationDue'> {
  const h = hashTexto(code);
  const vencida = h % 7 === 0;
  const fecha = new Date(Date.now() - ((vencida ? 200 : 10) + (h % 40)) * 86_400_000);
  return {
    battery: 60 + (h % 39),
    calibration: `${String(fecha.getDate()).padStart(2, '0')} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`,
    calibrationDue: vencida || undefined,
  };
}

const conBackend = API_MODE !== 'mock' && goesToBackend('/dashboard/devices');

export function useDevices(): { devices: DeviceLive[]; isPending: boolean } {
  const status = useDeviceStatus();
  const beds = useMonitoredBeds();
  const patients = usePatients({ ids: (beds.data ?? []).map((b) => b.patientId) });
  const readings = useReadings({ limit: 500 }, conBackend);

  if (!conBackend) {
    // Sin backend: los 8 del seed, con el estado en vivo del simulador si ya llegó.
    const devices = DEVICES.map((d) => {
      const state = status.data?.find((x) => x.code === d.serial)?.state;
      return state ? { ...d, status: ESTADO[state] } : d;
    });
    return { devices, isPending: false };
  }

  const senales = new Map<string, Set<string>>();
  for (const r of readings.data ?? []) {
    if (!senales.has(r.device)) senales.set(r.device, new Set());
    senales.get(r.device)!.add(SENAL[r.variable] ?? r.variable);
  }
  const devices: DeviceLive[] = (status.data ?? [])
    .map((s) => {
      const seed = DEVICES.find((d) => d.serial === s.code);
      const bed = beds.data?.find((b) => b.device === s.code);
      const patient = patients.data?.items.find((p) => p.id === bed?.patientId);
      const age = s.patient ? ageFrom(bed?.birthDate ?? patient?.birthDate) : null;
      const vistas = [...(senales.get(s.code) ?? [])];
      const status2 = ESTADO[s.state] ?? 'INACTIVO';
      return {
        bed: bed?.bed ?? '—',
        icon: imgRowC01Vector,
        patient: s.patient ?? 'Sin paciente',
        age: age !== null ? `${age} años` : undefined,
        model: s.model ?? '—',
        serial: s.code,
        status: status2,
        ...(seed ? { battery: seed.battery, calibration: seed.calibration, calibrationDue: seed.calibrationDue } : extraGenerado(s.code)),
        signals: vistas.length ? vistas : [`${s.sensors} ${s.sensors === 1 ? 'sensor' : 'sensores'}`],
        cedula: patient?.document,
        unit: bed?.unit,
        lastSeen: s.lastReadingAt ? `${status2 === 'ACTIVO' ? 'En línea · ' : ''}${fmtAgo(s.lastReadingAt)}` : 'Sin lecturas',
      } satisfies DeviceLive;
    })
    .sort((a, b) => a.bed.localeCompare(b.bed));
  return { devices, isPending: status.isPending || beds.isPending };
}
