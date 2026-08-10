import type { EmbedConfig } from '../types'

// PENDIENTE: datos de ejemplo. Falta el endpoint que emite el token de
// incrustación a partir del service principal. Ese token no se construye aquí
// bajo ninguna circunstancia: el frontend solo recibe uno de vida corta.
export async function getEmbedConfig(): Promise<EmbedConfig> {
  throw new Error('Embed token endpoint is not available yet')
}
