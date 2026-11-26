// Alergias del expediente: GET/POST/PATCH /historia/:pacienteId/alergias (backend/src/routes/historia.ts). No hay
// DELETE a propósito: una alergia equivocada se corrige o se marca resuelta o descartada, y el historial se conserva.
// Crear pide `historia_clinica: crear` y corregir `historia_clinica: editar` (el médico); la enfermera y el admin leen.
import { request } from './http';

export const SEVERIDADES = ['leve', 'moderada', 'grave', 'anafilaxia'] as const;
export const ESTADOS_ALERGIA = ['activa', 'resuelta', 'descartada'] as const;

export type Severidad = (typeof SEVERIDADES)[number];
export type EstadoAlergia = (typeof ESTADOS_ALERGIA)[number];

export type Alergia = {
  id: string;
  substance: string;
  reaction: string | null;
  severity: Severidad;
  status: EstadoAlergia;
  /** Fecha civil ("2026-11-25") o null. */
  detectedOn: string | null;
};

export type DatosAlergia = {
  substance: string;
  reaction?: string;
  severity: Severidad;
  status: EstadoAlergia;
  detectedOn?: string;
};

export const SEVERIDAD_TEXTO: Record<Severidad, string> = { leve: 'Leve', moderada: 'Moderada', grave: 'Grave', anafilaxia: 'Anafilaxia' };
export const ESTADO_TEXTO: Record<EstadoAlergia, string> = { activa: 'Activa', resuelta: 'Resuelta', descartada: 'Descartada' };

export function createAlergia(pacienteId: string, datos: DatosAlergia): Promise<Alergia> {
  return request<Alergia>(`/historia/${pacienteId}/alergias`, { method: 'POST', body: JSON.stringify(datos) });
}

export function updateAlergia(pacienteId: string, id: string, datos: Partial<DatosAlergia>): Promise<Alergia> {
  return request<Alergia>(`/historia/${pacienteId}/alergias/${id}`, { method: 'PATCH', body: JSON.stringify(datos) });
}
