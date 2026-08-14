import type { ComponentType } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined'
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import type { StringKey } from '../../../shared/i18n/dictionary'
import type { Role } from '../../auth/types'
import {
  ActiveAlertsWidget,
  AssignedPatientsWidget,
  CriticalTrendsWidget,
  MedicoKpisWidget,
} from './medico'
import {
  AlertAcknowledgementWidget,
  NurseAssignmentsWidget,
  NurseRemindersWidget,
  NursingNotesWidget,
} from './enfermero'
import {
  AdmissionsTodayWidget,
  AppointmentsWidget,
  BedOccupancyWidget,
  RecentReportsWidget,
} from './administrativo'
import {
  ActiveUsersWidget,
  DeviceConnectivityWidget,
  IntegrationsWidget,
  PlatformUsageWidget,
  SecurityEventsWidget,
} from './admin'

// Catálogo de widgets, con el mismo criterio que modules/registry.ts: un widget
// se declara una vez aquí y el tablero lo coloca. Añadir uno es una entrada en
// `widgets` y su identificador en la lista del rol que lo usa — no se toca la
// maquetación de MainPage.
//
// El componente pinta SOLO el cuerpo: la cabecera, la barra de carga y los
// botones de reordenar los pone WidgetCard, así que un widget no puede quedar
// con una cabecera distinta a la de sus vecinos.
export type DashboardWidget = {
  /** Identificador estable: es lo que se guarda en el orden del usuario. */
  id: string
  title: StringKey
  icon: SvgIconComponent
  Component: ComponentType
  /** Columnas que ocupa en la rejilla de tres. Por defecto, una. */
  span?: 1 | 2 | 3
}

export const widgets: Record<string, DashboardWidget> = {
  medicoKpis: {
    id: 'medicoKpis',
    title: 'dash.widget.medicoKpis',
    icon: SpeedOutlinedIcon,
    Component: MedicoKpisWidget,
    span: 3,
  },
  assignedPatients: {
    id: 'assignedPatients',
    title: 'dash.widget.assignedPatients',
    icon: GroupsOutlinedIcon,
    Component: AssignedPatientsWidget,
    span: 2,
  },
  activeAlerts: {
    id: 'activeAlerts',
    title: 'dash.widget.activeAlerts',
    icon: NotificationsActiveOutlinedIcon,
    Component: ActiveAlertsWidget,
  },
  criticalTrends: {
    id: 'criticalTrends',
    title: 'dash.widget.criticalTrends',
    icon: MonitorHeartOutlinedIcon,
    Component: CriticalTrendsWidget,
    span: 3,
  },

  nurseAssignments: {
    id: 'nurseAssignments',
    title: 'dash.widget.nurseAssignments',
    icon: BedOutlinedIcon,
    Component: NurseAssignmentsWidget,
    span: 2,
  },
  alertAck: {
    id: 'alertAck',
    title: 'dash.widget.alertAck',
    icon: AssignmentTurnedInOutlinedIcon,
    Component: AlertAcknowledgementWidget,
  },
  nurseReminders: {
    id: 'nurseReminders',
    title: 'dash.widget.nurseReminders',
    icon: PendingActionsOutlinedIcon,
    Component: NurseRemindersWidget,
  },
  nursingNotes: {
    id: 'nursingNotes',
    title: 'dash.widget.nursingNotes',
    icon: NoteAltOutlinedIcon,
    Component: NursingNotesWidget,
  },

  bedOccupancy: {
    id: 'bedOccupancy',
    title: 'dash.widget.bedOccupancy',
    icon: BedOutlinedIcon,
    Component: BedOccupancyWidget,
  },
  admissionsToday: {
    id: 'admissionsToday',
    title: 'dash.widget.admissionsToday',
    icon: LoginOutlinedIcon,
    Component: AdmissionsTodayWidget,
  },
  appointments: {
    id: 'appointments',
    title: 'dash.widget.appointments',
    icon: EventNoteOutlinedIcon,
    Component: AppointmentsWidget,
  },
  recentReports: {
    id: 'recentReports',
    title: 'dash.widget.recentReports',
    icon: DescriptionOutlinedIcon,
    Component: RecentReportsWidget,
    span: 3,
  },

  deviceConnectivity: {
    id: 'deviceConnectivity',
    title: 'dash.widget.deviceConnectivity',
    icon: SensorsOutlinedIcon,
    Component: DeviceConnectivityWidget,
    span: 2,
  },
  activeUsers: {
    id: 'activeUsers',
    title: 'dash.widget.activeUsers',
    icon: ManageAccountsOutlinedIcon,
    Component: ActiveUsersWidget,
  },
  platformUsage: {
    id: 'platformUsage',
    title: 'dash.widget.platformUsage',
    icon: InsightsOutlinedIcon,
    Component: PlatformUsageWidget,
    span: 2,
  },
  integrations: {
    id: 'integrations',
    title: 'dash.widget.integrations',
    icon: HubOutlinedIcon,
    Component: IntegrationsWidget,
  },
  securityEvents: {
    id: 'securityEvents',
    title: 'dash.widget.securityEvents',
    icon: FactCheckOutlinedIcon,
    Component: SecurityEventsWidget,
    span: 3,
  },
}

// Qué ve cada rol, en su orden por defecto. Las llaves son `rol.nombre` de la
// base, los mismos valores que usa `requiredRole` en modules/registry.ts.
const roleDashboards: Record<string, string[]> = {
  medico: ['medicoKpis', 'assignedPatients', 'activeAlerts', 'criticalTrends'],
  enfermero: ['nurseAssignments', 'alertAck', 'nurseReminders', 'nursingNotes'],
  administrativo: ['bedOccupancy', 'admissionsToday', 'appointments', 'recentReports'],
  admin: [
    'deviceConnectivity',
    'activeUsers',
    'platformUsage',
    'integrations',
    'securityEvents',
  ],
}

// Un administrador puede crear roles nuevos (ver modules/auth/types.ts: `Role`
// es string, no una unión). Ese rol no tiene tablero propio, así que recibe el
// mínimo común: lo que cualquier usuario con sesión puede leer.
const fallbackDashboard = ['activeAlerts', 'recentReports']

export function dashboardFor(role: Role | undefined): string[] {
  return (role !== undefined ? roleDashboards[role] : undefined) ?? fallbackDashboard
}
