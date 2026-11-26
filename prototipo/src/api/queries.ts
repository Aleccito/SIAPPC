// Hooks de datos de las pantallas: React Query sobre los servicios de src/api/.
// Las claves son las de frontend/ cuando existen (['patients'], ['aiAnalysis', id]…).
// En modo mock los datos no cambian solos, así que no se repreguntan; con el backend real se
// vuelven a pedir cada 15 s, como el tablero de frontend/ (docs/CONEXION-BACKEND.md, sección 5).
import { useEffect } from 'react';
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

// La lista de pacientes y el expediente casi no cambian: se consideran al día 5 minutos (y se refrescan al escribir en
// ellos), así volver a una pantalla no repite la consulta (docs/historial/REVISION-MEDICO.md, 5.1).
const QUIETO = 5 * 60_000;

/** Cuándo se volvió a pedir la lista por última vez porque faltaba alguien, por conjunto de faltantes. */
const pedidosPorFaltante = new Map<string, number>();

/**
 * La lista de pacientes, vigente 5 minutos. Pero si una pantalla busca a alguien que no está (`buscar`: ids o
 * cédulas), como un paciente recién admitido desde la app principal, se vuelve a pedir en el acto: antes su ficha
 * decía "no encontrado" y su cama de la central salía "Disponible" hasta 5 minutos (docs/historial/REVISION-DETALLES.md, 3.7).
 * Como mucho una vez cada 10 s por cada conjunto de faltantes, así una cédula que no existe no repregunta sin fin.
 */
export function usePatients(buscar?: { ids?: Array<string | null | undefined>; cedulas?: Array<string | null | undefined> }) {
  const query = useQuery({ queryKey: ['patients'], queryFn: () => listPatients(), staleTime: QUIETO });
  const items = query.data?.items;
  const faltan = items
    ? [
        ...(buscar?.ids ?? []).filter((id): id is string => !!id && !items.some((p) => p.id === id)),
        ...(buscar?.cedulas ?? []).filter((c): c is string => !!c && !items.some((p) => p.document === c)),
      ]
    : [];
  const clave = [...new Set(faltan)].sort().join(',');
  const { isFetching, refetch } = query;
  useEffect(() => {
    if (!clave || isFetching) return;
    const antes = pedidosPorFaltante.get(clave) ?? 0;
    if (Date.now() - antes < 10_000) return;
    pedidosPorFaltante.set(clave, Date.now());
    void refetch();
  }, [clave, isFetching, refetch]);
  return query;
}
export const useAssignments = (patientId: string | undefined) =>
  useQuery({ queryKey: ['assignments', patientId], queryFn: () => listAssignments(patientId!), enabled: !!patientId });

// Las listas que cambian cuando Admisión registra o mueve a alguien: al entrar a una pantalla o volver a la pestaña se
// piden otra vez si tienen más de 5 s (por defecto, 30 s), además de cada 15 s (docs/historial/REVISION-DETALLES.md, 3.7).
const LISTA = 5_000;
export const useAssignedPatients = () => useQuery({ queryKey: ['assignedPatients'], queryFn: listAssignedPatients, refetchInterval: LIVE, staleTime: LISTA });
export const useDeviceStatus = () => useQuery({ queryKey: ['deviceStatus'], queryFn: listDeviceStatus, refetchInterval: LIVE, staleTime: LISTA });
export const useMonitoredBeds = () => useQuery({ queryKey: ['monitoredBeds'], queryFn: () => listMonitoredBeds(), refetchInterval: LIVE, staleTime: LISTA });

export const useExpediente = (patientId: string | undefined) =>
  useQuery({ queryKey: ['expediente', patientId], queryFn: () => getExpediente(patientId!), enabled: !!patientId, staleTime: QUIETO });
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
