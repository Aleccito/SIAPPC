import type { ComponentType } from 'react';
import { IconActivity, IconBell, IconCpu, IconDashboard, IconFileText, IconSparkles, IconUsers, type IconProps } from '../icons';

export type NavSection = 'dashboard' | 'pacientes' | 'monitoreo' | 'alertas' | 'asistente' | 'reportes' | 'dispositivos';

export type NavItem = {
  section: NavSection;
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
  /** Permisos que hacen falta para verla (módulos de seed.sql, acción "ver"); sin ellos, la ve cualquiera con sesión. */
  perm?: string[];
  /** Roles que no la ven aunque tengan el permiso: el admin no ve nada clínico (CONEXION-BACKEND.md, 9.1). */
  hideFor?: string[];
};

/** Lo clínico necesita el expediente: el administrativo tiene `pacientes` pero no `historia_clinica`. */
const CLINICO = ['pacientes', 'historia_clinica'];
const SIN_ADMIN = ['admin'];

/** Menú lateral: una sola lista para todas las pantallas. */
export const NAV_ITEMS: NavItem[] = [
  { section: 'dashboard', label: 'Dashboard', to: '/MedDashboardPrincipal', icon: IconDashboard, perm: CLINICO, hideFor: SIN_ADMIN },
  { section: 'pacientes', label: 'Pacientes', to: '/MedPacientesLista', icon: IconUsers, perm: CLINICO, hideFor: SIN_ADMIN },
  { section: 'monitoreo', label: 'Monitoreo', to: '/MedMonitoreoGridUci', icon: IconActivity, perm: ['monitoreo'], hideFor: SIN_ADMIN },
  { section: 'alertas', label: 'Alertas', to: '/MedAlertasCentro', icon: IconBell, perm: ['alertas'], hideFor: SIN_ADMIN },
  // No viene de Figma (PR 3): la consulta libre a la IA, solo con el permiso `asistente_ia`.
  { section: 'asistente', label: 'Asistente IA', to: '/MedAsistenteIa', icon: IconSparkles, perm: ['asistente_ia', ...CLINICO], hideFor: SIN_ADMIN },
  { section: 'reportes', label: 'Reportes', to: '/MedReportesPanel', icon: IconFileText, perm: ['reportes'], hideFor: SIN_ADMIN },
  { section: 'dispositivos', label: 'Dispositivos', to: '/MedDispositivosMonitores', icon: IconCpu, perm: ['dispositivos'], hideFor: SIN_ADMIN },
];

/**
 * Qué hace falta para abrir una ruta del prototipo (CONEXION-BACKEND.md, 9.1). `clinical`: el admin no la ve
 * aunque la matriz le dé "ver". null: la ve cualquiera con sesión (Mi Perfil, Ayuda, las pantallas de acceso y
 * lo que no es del médico, como la sección Admin*).
 */
export function accessForPath(pathname: string): { perm: string[]; clinical: boolean } | null {
  const page = pathname.replace(/^\/+/, '');
  if (page.startsWith('MedMonitoreo')) return { perm: ['monitoreo'], clinical: true };
  if (page.startsWith('MedAlertas') || page.startsWith('MedNotificaciones') || page === 'Notificaciones') return { perm: ['alertas'], clinical: true };
  if (page.startsWith('MedReportes')) return { perm: ['reportes'], clinical: true };
  if (page.startsWith('MedDispositivo')) return { perm: ['dispositivos'], clinical: true };
  if (page.startsWith('MedAsistenteIa')) return { perm: ['asistente_ia', ...CLINICO], clinical: true };
  if (page.startsWith('MedPerfil') || page.startsWith('MedAyuda')) return null;
  if (page.startsWith('Med')) return { perm: CLINICO, clinical: true };
  return null;
}

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
