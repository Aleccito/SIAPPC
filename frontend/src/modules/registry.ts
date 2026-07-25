import type { ComponentType } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
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

export const modules: AppModule[] = [
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
    path: '/reports',
    label: 'nav.reports',
    icon: DescriptionOutlinedIcon,
    lazy: async () => ({
      Component: (await import('./reports/pages/ReportsPage')).ReportsPage,
    }),
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
]
