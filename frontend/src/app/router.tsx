import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from '../modules/auth/components/ProtectedRoute'
import { RequireRole } from '../modules/auth/components/RequireRole'
import { ForgotPasswordPage } from '../modules/auth/pages/ForgotPasswordPage'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { modules } from '../modules/registry'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: modules.map(({ path, lazy, requiredRole }) =>
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
