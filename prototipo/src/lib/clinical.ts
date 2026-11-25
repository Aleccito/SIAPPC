// Reglas y formatos clínicos que comparten las pantallas.
import type { AlertSeverity } from '../api/types/sensors';

export type ClinicalState = 'critico' | 'atencion' | 'estable';

/** El turno de una hora: matutino 07–15, vespertino 15–23, nocturno 23–07. */
export function turnoDe(fecha = new Date()): { nombre: string; horas: string } {
  const h = fecha.getHours();
  if (h >= 7 && h < 15) return { nombre: 'Matutino', horas: '07:00 - 15:00' };
  if (h >= 15 && h < 23) return { nombre: 'Vespertino', horas: '15:00 - 23:00' };
  return { nombre: 'Nocturno', horas: '23:00 - 07:00' };
}

/**
 * Estado clínico a partir de la peor alerta abierta. Misma regla que
 * frontend/src/modules/dashboard/presentation.ts (`clinicalState`).
 */
export function clinicalState(worst: AlertSeverity | null | undefined): ClinicalState {
  if (worst === 'critica') return 'critico';
  if (worst === 'alta' || worst === 'media') return 'atencion';
  return 'estable';
}

/** Un solo rótulo para el estado intermedio: "Atención", como frontend/ (REVISION-IA.md, D3). */
export const STATE_LABEL: Record<ClinicalState, string> = { critico: 'Crítico', atencion: 'Atención', estable: 'Estable' };
export const STATE_TONE = { critico: 'danger', atencion: 'warning', estable: 'success' } as const;
export const STATE_ORDER: Record<ClinicalState, number> = { critico: 0, atencion: 1, estable: 2 };

/** Edad en años cumplidos a partir de la fecha civil del backend ("1958-03-14T00:00:00-05:00"). */
export function ageFrom(birthDate: string | null | undefined, now = new Date()): number | null {
  if (!birthDate) return null;
  const [y, m, d] = birthDate.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return age;
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const pad = (n: number) => String(n).padStart(2, '0');

/** "24 Oct 2025" (fecha civil "AAAA-MM-DD…" o instante ISO). */
export function fmtDate(value: string | null | undefined): string {
  if (!value) return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) || /T00:00:00-05:00$/.test(value)) {
    const [y, m, d] = value.slice(0, 10).split('-').map(Number);
    return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
  }
  const t = new Date(value);
  return `${pad(t.getDate())} ${MONTHS[t.getMonth()]} ${t.getFullYear()}`;
}

/** "24 Oct 2025, 09:15". */
export function fmtDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const t = new Date(value);
  return `${pad(t.getDate())} ${MONTHS[t.getMonth()]} ${t.getFullYear()}, ${pad(t.getHours())}:${pad(t.getMinutes())}`;
}

/** "09:15". */
export function fmtTime(value: string | null | undefined): string {
  if (!value) return '—';
  const t = new Date(value);
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}

/** "hace 3 seg", "hace 8 min", "hace 20 h", "hace 2 días". */
/** Igual que fmtAgo pero corto, como en Figma ("hace 3seg", "hace 5min"), para columnas angostas. */
export function fmtAgoShort(value: string | null | undefined, now = Date.now()): string {
  return fmtAgo(value, now).replace('hace un momento', 'ahora').replace(/ (seg|min|h)$/, '$1');
}

export function fmtAgo(value: string | null | undefined, now = Date.now()): string {
  if (!value) return '—';
  const s = Math.max(0, Math.round((now - Date.parse(value)) / 1000));
  if (s < 5) return 'hace un momento';
  if (s < 60) return `hace ${s} seg`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 48) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} días`;
}

/** Iniciales para el círculo del paciente (REVISION-IA.md, D2): "Rogelio Batista Quintero" → "RB". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** "Rogelio Batista Quintero" → "Batista Quintero, Rogelio" (como las filas "García López, Juan" de Figma). */
export function surnameFirst(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name;
  return `${parts.slice(1).join(' ')}, ${parts[0]}`;
}

/**
 * Nombre del personal con su título, como lo escribe Figma ("Dr. Carlos Méndez"). El backend guarda
 * el nombre sin título y no sabe cuál corresponde, así que solo se agrega al personal conocido.
 */
const STAFF_TITLE: Record<string, string> = {
  'Carlos Méndez': 'Dr. Carlos Méndez',
  'Ana Gómez': 'Dra. Ana Gómez',
  'Lucía Ramos': 'Lic. Lucía Ramos',
};
export const staffName = (name: string | null | undefined) => (name ? STAFF_TITLE[name] ?? name : '—');

/** Severidad de una alerta en palabras. */
export const SEVERITY_LABEL: Record<AlertSeverity, string> = { baja: 'Baja', media: 'Media', alta: 'Alta', critica: 'Crítica' };

/** Signos que publica el monitor: nombre corto y unidad. */
export const VARIABLE_LABEL: Record<string, { short: string; long: string; unit: string }> = {
  hr: { short: 'FC', long: 'Frecuencia cardíaca', unit: 'lpm' },
  spo2: { short: 'SpO2', long: 'Saturación de oxígeno', unit: '%' },
  resp: { short: 'FR', long: 'Frecuencia respiratoria', unit: 'rpm' },
};
