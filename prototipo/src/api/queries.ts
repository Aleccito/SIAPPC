// Hooks de datos de las pantallas: React Query sobre los servicios de src/api/.
// Las claves son las de frontend/ cuando existen (['patients'], ['aiAnalysis', id]…).
// En modo mock los datos no cambian solos, así que no se repreguntan; con el backend real se
// vuelven a pedir cada 15 s, como el tablero de frontend/ (CONEXION-BACKEND.md, sección 5).
import { useQuery } from '@tanstack/react-query';
import { API_MODE } from './mode';
import { listPatients, listAssignments } from './patients';
import { getExpediente, listSoapNotes } from './clinical';
import { getSoapNote } from './soapNote';
import { getExploracion } from './exploracion';
import { listAssignedPatients, listDeviceStatus } from './dashboard';
import { listMonitoredBeds } from './monitoring';
import { listAlerts, listReadings } from './sensors';
import { listNotifications } from './notifications';
import { listReports } from './reports';
import { search } from './search';
import type { AlertsFilter, ReadingsFilter } from './types/sensors';

const LIVE = API_MODE === 'mock' ? false : 15_000;

export const usePatients = () => useQuery({ queryKey: ['patients'], queryFn: () => listPatients() });
export const useAssignments = (patientId: string | undefined) =>
  useQuery({ queryKey: ['assignments', patientId], queryFn: () => listAssignments(patientId!), enabled: !!patientId });

export const useAssignedPatients = () => useQuery({ queryKey: ['assignedPatients'], queryFn: listAssignedPatients, refetchInterval: LIVE });
export const useDeviceStatus = () => useQuery({ queryKey: ['deviceStatus'], queryFn: listDeviceStatus, refetchInterval: LIVE });
export const useMonitoredBeds = () => useQuery({ queryKey: ['monitoredBeds'], queryFn: () => listMonitoredBeds(), refetchInterval: LIVE });

export const useExpediente = (patientId: string | undefined) =>
  useQuery({ queryKey: ['expediente', patientId], queryFn: () => getExpediente(patientId!), enabled: !!patientId });
export const useSoapNotes = (patientId: string | undefined) =>
  useQuery({ queryKey: ['soapNotes', patientId], queryFn: () => listSoapNotes(patientId!), enabled: !!patientId });
export const useSoapNote = (noteId: string | undefined) =>
  useQuery({ queryKey: ['soapNote', noteId], queryFn: () => getSoapNote(noteId!), enabled: !!noteId });
export const useExploracion = (patientId: string | undefined) =>
  useQuery({ queryKey: ['exploracion', patientId], queryFn: () => getExploracion(patientId!), enabled: !!patientId });

export const useReadings = (filters: ReadingsFilter, enabled = true) =>
  useQuery({ queryKey: ['readings', filters], queryFn: () => listReadings(filters), enabled, refetchInterval: LIVE });
export const useAlerts = (filters: AlertsFilter = {}, enabled = true) =>
  useQuery({ queryKey: ['alerts', filters], queryFn: () => listAlerts(filters), enabled, refetchInterval: LIVE });

export const useNotifications = (page = 0, pageSize = 50) =>
  useQuery({ queryKey: ['notifications', page, pageSize], queryFn: () => listNotifications(page, pageSize), refetchInterval: LIVE });

export const useEtlReports = () => useQuery({ queryKey: ['reports'], queryFn: listReports });

/** El backend pide 2 caracteres como mínimo; con menos no se pregunta. */
export const useSearch = (q: string) =>
  useQuery({ queryKey: ['search', q], queryFn: () => search(q), enabled: q.trim().length >= 2 });
