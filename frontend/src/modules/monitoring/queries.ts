import { useQuery } from '@tanstack/react-query'
import { listMonitoredBeds } from './api/monitoringApi'
import { clinicalState } from '../dashboard/presentation'
import type { ClinicalState } from '../dashboard/presentation'
import type { MonitoredBed } from './types'

// Consulta y derivaciones que comparten la página y sus tarjetas. Viven en un
// módulo sin componentes porque un archivo que exporta componentes no puede
// exportar además hooks sin romper el Fast Refresh de Vite (regla
// react/only-export-components de oxlint).

/**
 * La central se refresca sola cada 5 s, como el monitor de una cama y no como
 * los tableros (15 s): esto no es un resumen, es la pantalla que alguien deja
 * puesta en la estación de enfermería para enterarse de que una cifra se salió
 * de rango. Las alertas además llegan empujadas por SSE (useAlertStream), así
 * que el sondeo es el suelo, no el único camino.
 */
const REFRESH_INTERVAL_MS = 5000

export function useMonitoredBeds(unitId?: string) {
  return useQuery({
    // El prefijo 'monitoring' es lo que invalida useAlertStream al recibir una
    // alerta nueva. Si cambia aquí, cambia allá.
    queryKey: ['monitoring', 'beds', unitId ?? 'all'],
    queryFn: () => listMonitoredBeds(unitId),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}

/** Una cama está ocupada cuando tiene ingreso activo, no cuando `cama.estado` lo dice. */
export function isOccupied(bed: MonitoredBed): boolean {
  // Se mira el paciente y no `bedState`: el estado de la cama lo mueve
  // Admisión, y una cama marcada `ocupada` cuyo ingreso ya se cerró no tiene a
  // nadie a quien monitorear. El dato que manda es quién está dentro.
  return bed.patientId !== null
}

export type UnitOption = { id: string; name: string }

/**
 * Las unidades presentes en la respuesta, sin repetir.
 *
 * Se sacan de las camas y no de un endpoint de unidades a propósito: la central
 * solo puede mostrar unidades que tengan camas, y una lista con opciones que
 * siempre salen vacías es peor que no tener la opción.
 */
export function unitsOf(beds: MonitoredBed[]): UnitOption[] {
  const seen = new Map<string, string>()
  for (const bed of beds) seen.set(bed.unitId, bed.unit)
  return [...seen].map(([id, name]) => ({ id, name }))
}

export type StateCounts = Record<ClinicalState, number>

/**
 * Cuántas camas ocupadas hay en cada estado clínico.
 *
 * Las libres no cuentan en ninguno: una cama vacía no está "estable", no está.
 */
export function countByState(beds: MonitoredBed[]): StateCounts {
  const counts: StateCounts = { critico: 0, atencion: 0, estable: 0 }
  for (const bed of beds) {
    if (!isOccupied(bed)) continue
    counts[clinicalState(bed.worstSeverity)] += 1
  }
  return counts
}
