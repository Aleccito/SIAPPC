import type { Report } from '../types'

// PHASE 2: replace this body with a fetch to the backend. The shape stays.
const fixtures: Report[] = [
  {
    id: 'r-001',
    name: 'Line throughput — weekly',
    source: 'Power BI',
    status: 'ready',
    updatedAt: '2026-07-24T08:15:00Z',
  },
  {
    id: 'r-002',
    name: 'Bottleneck simulation run 42',
    source: 'FlexSim',
    status: 'running',
    updatedAt: '2026-07-24T09:02:00Z',
  },
  {
    id: 'r-003',
    name: 'Downtime by station',
    source: 'MariaDB',
    status: 'failed',
    updatedAt: '2026-07-23T17:40:00Z',
  },
]

export async function listReports(): Promise<Report[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return fixtures
}
