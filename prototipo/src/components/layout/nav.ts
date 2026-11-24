import type { ComponentType } from 'react';
import { IconActivity, IconBell, IconCpu, IconDashboard, IconFileText, IconSparkles, IconUsers, type IconProps } from '../icons';

export type NavSection = 'dashboard' | 'pacientes' | 'monitoreo' | 'alertas' | 'asistente' | 'reportes' | 'dispositivos';

export type NavItem = {
  section: NavSection;
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
  /** Permiso que hace falta para verla (módulo de seed.sql, acción "ver"); sin él, la ve cualquiera con sesión. */
  perm?: string;
  /** Roles que no la ven aunque tengan el permiso (la IA no se le muestra al admin). */
  hideFor?: string[];
};

/** Menú lateral: una sola lista para todas las pantallas. */
export const NAV_ITEMS: NavItem[] = [
  { section: 'dashboard', label: 'Dashboard', to: '/MedDashboardPrincipal', icon: IconDashboard },
  { section: 'pacientes', label: 'Pacientes', to: '/MedPacientesLista', icon: IconUsers },
  { section: 'monitoreo', label: 'Monitoreo', to: '/MedMonitoreoGridUci', icon: IconActivity },
  { section: 'alertas', label: 'Alertas', to: '/MedAlertasCentro', icon: IconBell },
  // No viene de Figma (PR 3): la consulta libre a la IA, solo con el permiso `asistente_ia`.
  { section: 'asistente', label: 'Asistente IA', to: '/MedAsistenteIa', icon: IconSparkles, perm: 'asistente_ia', hideFor: ['admin'] },
  { section: 'reportes', label: 'Reportes', to: '/MedReportesPanel', icon: IconFileText },
  { section: 'dispositivos', label: 'Dispositivos', to: '/MedDispositivosMonitores', icon: IconCpu },
];

/**
 * Qué opción del menú se marca según la ruta.
 * Regla: pantallas del paciente → Pacientes, Monitoreo* → Monitoreo, Turno* → Reportes (como en Figma).
 * Notificaciones, Búsqueda, Ayuda y Perfil no marcan ninguna.
 */
export function sectionForPath(pathname: string): NavSection | null {
  const page = pathname.replace(/^\/+/, '');
  if (page === '' || page.startsWith('MedAlertas')) return 'alertas';
  if (page.startsWith('MedDashboard')) return 'dashboard';
  if (page.startsWith('MedPaciente')) return 'pacientes';
  if (page.startsWith('MedMonitoreo')) return 'monitoreo';
  if (page.startsWith('MedReportes') || page.startsWith('MedTurno')) return 'reportes';
  if (page.startsWith('MedDispositivos')) return 'dispositivos';
  if (page.startsWith('MedAsistenteIa')) return 'asistente';
  return null;
}

/** Usuario que aparece en el pie del menú (dato de ejemplo). */
export const CURRENT_USER = {
  name: 'Dr. Carlos Méndez',
  role: 'Médico Intensivista',
};
