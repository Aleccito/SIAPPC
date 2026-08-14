import type { ComponentType } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined'
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined'
import AirlineSeatFlatOutlinedIcon from '@mui/icons-material/AirlineSeatFlatOutlined'
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined'
import type { Role } from './auth/types'
import type { StringKey } from '../shared/i18n/dictionary'

// Each module registers its route and nav entry here. Adding a module later
// means appending one entry, not editing the layout.
//
// Aquí NO están ni Power BI ni FlexSim, y es a propósito. Los informes de
// simulación se hacen conectando Power BI directo a MariaDB (base `siappc_sim`,
// ver simulation/README.md), y el simulador es un proceso por lotes que corre
// desde Compose. Ninguna de las dos cosas necesita una pantalla en el tablero,
// y las que había mostraban datos inventados.
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
    path: '/patients',
    label: 'nav.patients',
    icon: MonitorHeartOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./patients/pages/PatientsPage')).PatientsPage,
    }),
  },
  // Expediente clínico. Va junto a Pacientes y no dentro de él porque son dos
  // cosas distintas: Pacientes es la sala de espera —quién llegó y a qué
  // módulo— y esto es el expediente, que se abre eligiendo al paciente y no
  // tiene sentido sin uno. No lleva `requiredRole`: quién entra lo decide
  // `rol_permiso` en el servidor, y la pantalla muestra el 403 que devuelva.
  {
    path: '/expediente',
    label: 'nav.clinical',
    icon: FolderSharedOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./clinical/pages/ExpedientePage')).ExpedientePage,
    }),
  },
  // Admisión: camas, ingresos, egresos y citas. Sin `requiredRole`, igual que
  // el expediente: quién entra lo decide `rol_permiso` en el servidor y la
  // pantalla muestra el 403 que devuelva.
  {
    path: '/admissions',
    label: 'nav.admissions',
    icon: LocalHotelOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./admissions/pages/AdmissionsPage')).AdmissionsPage,
    }),
  },
  // Central de monitoreo: el mapa de camas de una unidad. Va antes de Sensores
  // porque es la pantalla de turno —lo que se deja puesto—, mientras que
  // Sensores es la bandeja a la que se baja a mirar una lectura concreta.
  // Sin `requiredRole`: quién entra lo decide `rol_permiso` en el servidor
  // (`monitoreo:ver`), y la pantalla muestra el error que devuelva.
  {
    path: '/monitoring',
    label: 'nav.central',
    // Un monitor, no un corazón: `MonitorHeartOutlined` ya es el icono de
    // Pacientes, y dos entradas del menú con el mismo dibujo son
    // indistinguibles con la barra plegada, que es cuando el icono es lo único
    // que queda.
    icon: AirlineSeatFlatOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./monitoring/pages/CentralMonitorPage')).CentralMonitorPage,
    }),
  },
  // Ronda: la misma telemetría que la central, una cama a la vez, para la
  // tablet que se lleva por la sala. Va justo después de la central porque son
  // la misma tarea a dos distancias: la central se mira de pie desde el
  // pasillo, la ronda a 40 cm delante de la cama.
  //
  // La ruta es `/ronda` y NO `/monitoring/tablet`: `/monitoring/:device` ya
  // existe, y aunque el router da prioridad al segmento literal, un equipo cuyo
  // `dispositivo.codigo` fuera "tablet" quedaría inalcanzable sin que nada lo
  // avisara. Un choque silencioso no compensa la simetría del nombre.
  {
    path: '/ronda',
    label: 'nav.rounds',
    icon: TabletMacOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./monitoring/pages/RoundsPage')).RoundsPage,
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
  // Búsqueda global. No es entrada de menú: se llega escribiendo en el buscador
  // de la barra superior, no navegando.
  {
    path: '/search',
    lazy: async () => ({
      Component: (await import('./search/pages/SearchPage')).SearchPage,
    }),
  },
  // Las dos pantallas del expediente que cuelgan de un paciente concreto: sin
  // `:patientId` no significan nada, así que tampoco van al menú lateral.
  {
    path: '/expediente/:patientId/exploracion-fisica',
    lazy: async () => ({
      Component: (await import('./clinical/pages/ExploracionFisicaPage')).ExploracionFisicaPage,
    }),
  },
  {
    path: '/expediente/:pacienteId/antecedentes',
    lazy: async () => ({
      Component: (await import('./clinical/pages/AntecedentesPage')).AntecedentesPage,
    }),
  },
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
