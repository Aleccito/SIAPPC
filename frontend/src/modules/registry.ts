import type { ComponentType } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import type { Role } from './auth/types'
import type { StringKey } from '../shared/i18n/dictionary'

// Each module registers its route and nav entry here. Adding the Power BI or
// FlexSim module later means appending one entry, not editing the layout.
export type AppModule = {
  path: string
  label: StringKey
  icon: SvgIconComponent
  // Route-level code split: the page chunk is fetched on first navigation, so
  // it stays out of the entry bundle. Shape matches React Router's lazy field.
  lazy: () => Promise<{ Component: ComponentType }>
  // Omitted means every signed-in user sees it.
  requiredRole?: Role
}

// Cabecera de sección: agrupa entradas y no lleva pantalla propia. Pulsarla
// abre o cierra el grupo, nada más — por eso no tiene `path` ni `lazy`.
//
// Solo un nivel de anidamiento: con dos, la barra lateral pide migas de pan y
// un menú que se recuerde a sí mismo, y aquí no hay tantas pantallas.
export type NavGroup = {
  // Clave estable para el estado de abierto/cerrado. No es una ruta: si lo
  // fuera, alguien acabaría enlazándola.
  id: string
  label: StringKey
  icon: SvgIconComponent
  requiredRole?: Role
  children: AppModule[]
}

export type NavEntry = AppModule | NavGroup

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry
}

export const modules: NavEntry[] = [
  {
    path: '/',
    label: 'nav.dashboard',
    icon: DashboardOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./dashboard/pages/MainPage')).MainPage,
    }),
  },
  {
    path: '/powerbi',
    label: 'nav.powerbi',
    icon: InsightsOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./powerbi/pages/PowerBiPage')).PowerBiPage,
    }),
  },
  {
    path: '/flexsim',
    label: 'nav.flexsim',
    icon: PrecisionManufacturingOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./flexsim/pages/FlexSimPage')).FlexSimPage,
    }),
  },
  {
    path: '/patients',
    label: 'nav.patients',
    icon: MonitorHeartOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./patients/pages/PatientsPage')).PatientsPage,
    }),
  },
  {
    path: '/sensors',
    label: 'nav.sensors',
    icon: SensorsOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./sensors/pages/SensorsPage')).SensorsPage,
    }),
  },
  {
    id: 'reports',
    label: 'nav.reports',
    icon: DescriptionOutlinedIcon,
    children: [
      {
        path: '/reports',
        label: 'nav.reportsList',
        icon: ListAltOutlinedIcon,
        lazy: async () => ({
          Component: (await import('./reports/pages/ReportsPage')).ReportsPage,
        }),
      },
      {
        path: '/notifications',
        label: 'nav.notifications',
        icon: NotificationsNoneOutlinedIcon,
        lazy: async () => ({
          Component: (await import('./notifications/pages/NotificationsPage'))
            .NotificationsPage,
        }),
      },
      {
        path: '/reports/permissions',
        label: 'nav.permissionChanges',
        icon: ShieldOutlinedIcon,
        lazy: async () => ({
          Component: (await import('./admin/pages/PermissionChangesPage'))
            .PermissionChangesPage,
        }),
        requiredRole: 'admin',
      },
      // La bitácora es material de consulta, como los reportes: quién hizo qué
      // y cuándo. Colgarla de aquí la saca de la lista de administración, donde
      // estaba junto a Usuarios y Roles, que son pantallas de configuración.
      {
        path: '/admin/audit',
        label: 'nav.audit',
        icon: FactCheckOutlinedIcon,
        lazy: async () => ({
          Component: (await import('./admin/pages/AuditPage')).AuditPage,
        }),
        requiredRole: 'admin',
      },
    ],
  },
  {
    path: '/admin/users',
    label: 'nav.users',
    icon: ManageAccountsOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./admin/pages/UsersPage')).UsersPage,
    }),
    requiredRole: 'admin',
  },
  {
    path: '/admin/roles',
    label: 'nav.roles',
    icon: ShieldOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./admin/pages/RolesPage')).RolesPage,
    }),
    requiredRole: 'admin',
  },
]

// El árbol de `modules` es para el menú. El router necesita la lista plana:
// agrupar en la barra lateral no cambia dónde vive cada pantalla, y las
// cabeceras de sección no aportan ninguna ruta.
export const routeModules: AppModule[] = modules.flatMap((entry) =>
  isNavGroup(entry) ? entry.children : [entry],
)

// Rutas que no son entradas de navegación: se llega a ellas desde una pantalla,
// no desde la barra lateral.
export const detailRoutes = [
  {
    // Detalle de una cama. `:device` es el `dispositivo.codigo` de la Pi, que es
    // lo que identifica la fuente de las lecturas; la cama es una etiqueta que
    // cuelga del paciente asignado.
    path: '/monitoring/:device',
    lazy: async () => ({
      Component: (await import('./monitoring/pages/BedMonitorPage')).BedMonitorPage,
    }),
  },
  {
    path: '/admin/roles/:id/permissions',
    lazy: async () => ({
      Component: (await import('./admin/pages/PermissionMatrixPage')).PermissionMatrixPage,
    }),
    requiredRole: 'admin' as Role,
  },
]
