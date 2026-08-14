import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute'
import { RequireRole } from '../modules/auth/components/RequireRole'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { detailRoutes, routeModules } from '../modules/registry'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [...routeModules, ...detailRoutes].map(({ path, lazy, requiredRole }) =>
          requiredRole
            ? {
                element: <RequireRole role={requiredRole} />,
                children: [{ path, lazy }],
              }
            : { path, lazy },
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
