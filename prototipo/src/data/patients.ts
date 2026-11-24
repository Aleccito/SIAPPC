// Filas de pacientes para las listas (Dashboard, Mis Pacientes, la central y el turno):
// los asignados del tablero + sus alertas agrupadas + PA y temperatura (sinBackend), ordenados por gravedad.
import { useAlerts, useAssignedPatients } from '../api/queries';
import { useSignosTodos, type SignosExtra } from '../api/sinBackend';
import type { AssignedPatient } from '../api/types/dashboard';
import { groupAlerts, type AlertGroup } from '../lib/alerts';
import { ageFrom, clinicalState, STATE_LABEL, STATE_ORDER, STATE_TONE, type ClinicalState } from '../lib/clinical';
import { attendedAlerts } from './alerts';

export type PatientRow = AssignedPatient & {
  state: ClinicalState;
  stateLabel: string;
  tone: (typeof STATE_TONE)[ClinicalState];
  /** T1 crítico, T2 atención, T3 estable (la misma regla que `triageLevel` de frontend/). */
  triage: 'T1' | 'T2' | 'T3';
  age: number | null;
  signos: SignosExtra | undefined;
  /** Alertas sin resolver agrupadas (la peor y más reciente primero), sin las atendidas en esta visita. */
  alertGroups: AlertGroup[];
};

const TRIAGE: Record<ClinicalState, PatientRow['triage']> = { critico: 'T1', atencion: 'T2', estable: 'T3' };

/** `includeAttended`: también los grupos atendidos en esta visita (el Centro de alertas los muestra en "Atendidas"). */
export function usePatientRows({ includeAttended = false } = {}) {
  const assigned = useAssignedPatients();
  const alerts = useAlerts({ limit: 500 });
  const signos = useSignosTodos();
  const groups = groupAlerts(alerts.data ?? []).filter((g) => includeAttended || !attendedAlerts.has(g.key));
  const rows: PatientRow[] = (assigned.data ?? [])
    .map((p) => {
      const state = clinicalState(p.worstSeverity);
      return {
        ...p,
        state,
        stateLabel: STATE_LABEL[state],
        tone: STATE_TONE[state],
        triage: TRIAGE[state],
        age: ageFrom(p.birthDate),
        signos: signos.data?.[p.document],
        alertGroups: groups.filter((g) => g.device === p.device),
      };
    })
    .sort(
      (a, b) =>
        STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
        (b.alertGroups[0]?.latest.at ?? '').localeCompare(a.alertGroups[0]?.latest.at ?? '') ||
        a.name.localeCompare(b.name),
    );
  return { rows, groups, isPending: assigned.isPending, isError: assigned.isError, error: assigned.error };
}

/** "FC: 132↑ SpO2: 88%↓" y "PA: 92/54 (Hipotensión)", como las filas de Figma. */
export function vitalsText(r: PatientRow): [string, string] {
  const { hr, spo2 } = r.vitals;
  const hrArrow = hr === null ? '' : hr > 100 ? '↑' : hr < 60 ? '↓' : '';
  const spo2Arrow = spo2 !== null && spo2 < 95 ? '↓' : '';
  const first = `FC: ${hr ?? '—'}${hrArrow} SpO2: ${spo2 ?? '—'}%${spo2Arrow}`;
  if (!r.signos) return [first, 'PA: —'];
  const { sis, dia } = r.signos.pa;
  const note = sis < 90 ? ' (Hipotensión)' : sis < 100 ? ' (Baja)' : sis > 140 ? ' (Elevada)' : '';
  return [first, `PA: ${sis}/${dia}${note}`];
}
