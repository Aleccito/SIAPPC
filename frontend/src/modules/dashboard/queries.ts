import { useQuery } from '@tanstack/react-query'
import { listAssignedPatients } from './api/dashboardApi'
import { listAlerts } from '../sensors/api/sensorsApi'

// Consultas que comparten varios widgets. Viven aquí y no junto a ellos porque
// un archivo que exporta componentes no puede exportar además hooks sin romper
// el Fast Refresh de Vite (regla react/only-export-components de oxlint), y
// porque compartir la misma `queryKey` es lo que evita que dos widgets del
// mismo tablero pidan la misma lista dos veces.

/**
 * Los tableros se refrescan solos: quien deja uno abierto en la estación de
 * enfermería no debería recargar para ver una alerta nueva. Más espaciado que
 * el monitor de cama (5 s) porque aquí son resúmenes, no la señal en vivo.
 */
export const REFRESH_INTERVAL_MS = 15000

const ALERTS_LIMIT = 100

export function useAssignedPatients() {
  return useQuery({
    queryKey: ['dashboard', 'assignedPatients'],
    queryFn: listAssignedPatients,
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}

export function useOpenAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'openAlerts'],
    queryFn: () => listAlerts({ status: 'abierta', limit: ALERTS_LIMIT }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
