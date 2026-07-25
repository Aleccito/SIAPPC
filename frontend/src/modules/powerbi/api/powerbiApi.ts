import type { EmbedConfig } from '../types'

// PHASE 2: replace this body with a fetch to the backend endpoint that mints the
// embed token from the service principal. The token must never be built here —
// the frontend only ever receives a short-lived one.
export async function getEmbedConfig(): Promise<EmbedConfig> {
  throw new Error('Embed token endpoint is not available yet')
}
