export type RunStatus = 'queued' | 'running' | 'completed' | 'failed'

export type RunResult = {
  throughput: number
  utilization: number
  bottleneck: string
}

export type SimulationRun = {
  id: string
  model: string
  status: RunStatus
  startedAt: string
  result: RunResult | null
}
