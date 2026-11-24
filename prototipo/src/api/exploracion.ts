// La parte de red de frontend/src/modules/clinical/api/exploracionApi.ts.
// Se dejan fuera `dtoAFormulario` y `formularioADto`, que dependen del formulario de frontend/:
// aquí `saveExploracion` recibe directamente el cuerpo que espera el backend
// (PUT /historia/:pacienteId/exploracion-fisica, ver backend/src/routes/historia.ts).
import { request } from './http';

/** `cabeza_cuello` … `neurologico`: los valores del enum `RegionExploracion` de prisma/schema.prisma. */
export const REGIONES_API = ['cabeza_cuello', 'torax', 'abdomen', 'extremidades_superiores', 'extremidades_inferiores', 'neurologico'] as const;
export type RegionApi = (typeof REGIONES_API)[number];

/** Los valores del enum `TecnicaExploracion`. */
export const TECNICAS_API = ['inspeccion', 'palpacion', 'percusion', 'auscultacion'] as const;
export type TecnicaApi = (typeof TECNICAS_API)[number];

export type HallazgoDto = {
  region: string;
  technique: string;
  state: 'normal' | 'anormal';
  text: string | null;
};

export type ExploracionDto = {
  weightKg: number | null;
  heightCm: number | null;
  abdominalCm: number | null;
  glasgow: number | null;
  updatedAt: string | null;
  findings: HallazgoDto[];
};

/** Lo que se manda al guardar (sin `updatedAt`, que pone el servidor). */
export type ExploracionInput = Omit<ExploracionDto, 'updatedAt'>;

export async function getExploracion(pacienteId: string): Promise<ExploracionDto> {
  return request<ExploracionDto>(`/historia/${pacienteId}/exploracion-fisica`);
}

export async function saveExploracion(pacienteId: string, body: ExploracionInput): Promise<ExploracionDto> {
  return request<ExploracionDto>(`/historia/${pacienteId}/exploracion-fisica`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
