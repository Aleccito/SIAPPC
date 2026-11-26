// El paciente del expediente: sale de `?paciente=<cédula>` (REVISION-IA.md, sección 1).
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAssignedPatients, useExpediente, usePatients } from '../../api/queries';
import type { AssignedPatient } from '../../api/types/dashboard';
import type { Expediente, HistoriaEntry } from '../../api/types/clinical';
import type { Patient } from '../../api/types/patients';
import { ageFrom, clinicalState, STATE_LABEL, STATE_TONE, type ClinicalState } from '../../lib/clinical';
import { DEFAULT_PATIENT, PATIENT_PARAM } from '../../lib/patientLink';

export type PatientView = {
  cedula: string;
  /** id numérico del backend (el que usan las rutas de /api). */
  id: string;
  patient: Patient;
  /** Del tablero (`/dashboard/assigned-patients`): cama, unidad, equipo, alertas y signos. */
  assigned: AssignedPatient | undefined;
  expediente: Expediente | undefined;
  name: string;
  age: number | null;
  state: ClinicalState;
  stateLabel: string;
  stateTone: (typeof STATE_TONE)[ClinicalState];
  /** "UCI-02", o null si no tiene cama. */
  bed: string | null;
  /** Diagnóstico activo registrado más recientemente (la misma regla que backend/src/routes/search.ts). */
  mainDx: HistoriaEntry | undefined;
};

export type PatientResult =
  | { status: 'loading'; cedula: string; view?: undefined; error?: undefined }
  | { status: 'notFound'; cedula: string; view?: undefined; error?: undefined }
  | { status: 'error'; cedula: string; view?: undefined; error: unknown }
  | { status: 'ready'; cedula: string; view: PatientView; error?: undefined };

/** Diagnóstico principal: el activo más reciente (el expediente viene ordenado del último al primero). */
export const mainDiagnosis = (exp: Expediente | undefined) => exp?.diagnosticos.find((d) => d.status === 'activo');

export function usePatient(): PatientResult {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get(PATIENT_PARAM);
  const cedula = fromUrl ?? DEFAULT_PATIENT;

  // Sin paciente en la URL se abre el de por defecto y se escribe en la URL (sin dejar entrada en el
  // historial), así recargar también lo conserva.
  useEffect(() => {
    if (fromUrl) return;
    const next = new URLSearchParams([[PATIENT_PARAM, DEFAULT_PATIENT], ...params]);
    setParams(next, { replace: true });
  }, [fromUrl, params, setParams]);

  // Con la cédula: si no está en la lista guardada (paciente recién admitido), se vuelve a pedir antes de decir que no existe.
  const patients = usePatients({ cedulas: [cedula] });
  const patient = patients.data?.items.find((p) => p.document === cedula);
  const assigned = useAssignedPatients();
  const expediente = useExpediente(patient?.id);

  if (patients.isError) return { status: 'error', cedula, error: patients.error };
  if (patients.isPending || (!patient && patients.isFetching)) return { status: 'loading', cedula };
  if (!patient) return { status: 'notFound', cedula };

  const a = assigned.data?.find((x) => x.id === patient.id);
  const state = clinicalState(a?.worstSeverity);
  return {
    status: 'ready',
    cedula,
    view: {
      cedula,
      id: patient.id,
      patient,
      assigned: a,
      expediente: expediente.data,
      name: patient.name,
      age: ageFrom(patient.birthDate),
      state,
      stateLabel: STATE_LABEL[state],
      stateTone: STATE_TONE[state],
      bed: a?.bed ?? null,
      mainDx: mainDiagnosis(expediente.data),
    },
  };
}
