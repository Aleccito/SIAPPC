// Alertas del monitor agrupadas y en palabras (REVISION-IA.md, D5).
// El seed trae una alerta por minuto mientras el signo sigue fuera de rango: 18 avisos casi iguales
// de "FC 132 fuera de rango". Las pantallas los agrupan por equipo, signo y severidad.
import type { AlertSeverity, SensorAlert } from '../api/types/sensors';
import { VARIABLE_LABEL } from './clinical';

export type AlertGroup = {
  /** `DEMO-DEV-01-hr-alta`: estable entre recargas (lo usa "Atender"). */
  key: string;
  device: string;
  variable: string;
  severity: AlertSeverity;
  /** La alerta más reciente del grupo. */
  latest: SensorAlert;
  count: number;
  /** La más vieja del grupo: desde cuándo dura. */
  since: string;
  open: number;
  acknowledged: number;
};

const SEVERITY_RANK: Record<AlertSeverity, number> = { critica: 0, alta: 1, media: 2, baja: 3 };

/** Agrupa (las alertas vienen de la más reciente a la más vieja, como GET /sensors/alerts). */
export function groupAlerts(alerts: SensorAlert[], { includeResolved = false } = {}): AlertGroup[] {
  const groups = new Map<string, AlertGroup>();
  for (const a of alerts) {
    if (!includeResolved && a.status === 'resuelta') continue;
    const key = `${a.device}-${a.variable}-${a.severity}`;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, { key, device: a.device, variable: a.variable, severity: a.severity, latest: a, count: 1, since: a.at, open: a.status === 'abierta' ? 1 : 0, acknowledged: a.status === 'reconocida' ? 1 : 0 });
    } else {
      g.count += 1;
      g.since = a.at < g.since ? a.at : g.since;
      if (a.status === 'abierta') g.open += 1;
      if (a.status === 'reconocida') g.acknowledged += 1;
    }
  }
  return [...groups.values()].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.latest.at.localeCompare(a.latest.at));
}

/**
 * Título de la alerta con el umbral que la disparó. Los umbrales son los de
 * backend/src/services/mqttIngest.ts (FC crítica < 40 o > 140, alta < 50 o > 120; SpO2 crítica < 85,
 * alta < 90; FR alta < 8 o > 30).
 */
export function alertTitle(variable: string, severity: AlertSeverity, value: number): string {
  const critical = severity === 'critica';
  if (variable === 'hr') {
    const high = value > 100;
    const limit = critical ? (high ? '> 140' : '< 40') : high ? '> 120' : '< 50';
    return `FC ${limit} lpm — ${high ? 'Taquicardia' : 'Bradicardia'}${critical ? ' crítica' : ''}`;
  }
  if (variable === 'spo2') return `SpO2 < ${critical ? 85 : 90}% — ${critical ? 'Desaturación crítica' : 'Saturación baja'}`;
  if (variable === 'resp') return `FR ${value > 20 ? '> 30' : '< 8'} rpm — ${value > 20 ? 'Taquipnea' : 'Bradipnea'}`;
  return `${variable} fuera de rango`;
}

/** "Saturación actual 83%" / "Ritmo actual 149 lpm". */
export function alertValueText(variable: string, value: number): string {
  const v = VARIABLE_LABEL[variable];
  if (variable === 'hr') return `Ritmo actual ${value} lpm`;
  if (variable === 'spo2') return `Saturación actual ${value}%`;
  if (variable === 'resp') return `Respiración actual ${value} rpm`;
  return `${v?.short ?? variable} ${value}`;
}

/** Color del valor de un signo vital según los mismos umbrales (y uno intermedio de advertencia). */
export function vitalTone(variable: 'hr' | 'spo2' | 'resp' | 'pa' | 'temp', value: number | null | undefined): 'danger' | 'warning' | 'normal' {
  if (value === null || value === undefined) return 'normal';
  switch (variable) {
    case 'hr':
      return value > 120 || value < 50 ? 'danger' : value > 100 || value < 60 ? 'warning' : 'normal';
    case 'spo2':
      return value < 90 ? 'danger' : value < 95 ? 'warning' : 'normal';
    case 'resp':
      return value > 30 || value < 8 ? 'danger' : value > 22 || value < 10 ? 'warning' : 'normal';
    case 'pa':
      return value < 90 || value > 160 ? 'danger' : value < 100 || value > 140 ? 'warning' : 'normal';
    case 'temp':
      return value >= 38.5 || value < 35.5 ? 'danger' : value >= 37.5 ? 'warning' : 'normal';
  }
}
