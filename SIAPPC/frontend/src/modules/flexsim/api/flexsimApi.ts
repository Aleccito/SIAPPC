import type { RunResult, SimulationRun, RunStatus } from '../types'

// PENDIENTE: datos de ejemplo. Falta el servicio de trabajos en el backend, que
// lanza FlexSim en modo headless y escribe los resultados en MariaDB. FlexSim es
// una aplicación de escritorio de Windows: nunca se la llama desde el navegador.
export const models = ['line-a.fsm', 'line-b.fsm', 'warehouse.fsm']

const QUEUED_MS = 2000
const RUNNING_MS = 8000

type StoredRun = { id: string; model: string; startedAt: number }

let runs: StoredRun[] = [{ id: 'run-041', model: 'line-a.fsm', startedAt: 0 }]
let nextId = 42

// The fake backend derives status from elapsed time, so a queued run really does
// move to running and then completed while the page polls.
function statusOf(run: StoredRun): RunStatus {
  const elapsed = Date.now() - run.startedAt
  if (elapsed < QUEUED_MS) return 'queued'
  if (elapsed < QUEUED_MS + RUNNING_MS) return 'running'
  return 'completed'
}

function resultOf(run: StoredRun): RunResult {
  const seed = Number(run.id.replace(/\D/g, ''))
  return {
    throughput: 400 + (seed % 7) * 25,
    utilization: 0.6 + (seed % 5) * 0.05,
    bottleneck: `Station ${(seed % 4) + 1}`,
  }
}

function toSimulationRun(run: StoredRun): SimulationRun {
  const status = statusOf(run)
  return {
    id: run.id,
    model: run.model,
    status,
    startedAt: new Date(run.startedAt).toISOString(),
    result: status === 'completed' ? resultOf(run) : null,
  }
}

export async function listRuns(): Promise<SimulationRun[]> {
  return runs.map(toSimulationRun)
}

export async function startRun(model: string): Promise<SimulationRun> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const run: StoredRun = {
    id: `run-${nextId++}`,
    model,
    startedAt: Date.now(),
  }
  runs = [run, ...runs]
  return toSimulationRun(run)
}
