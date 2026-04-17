import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/login/LoginPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import ConsentPage from '@/pages/consent/ConsentPage'
import ErrorPage from '@/pages/error/ErrorPage'
import SignupFormPage from '@/pages/signup/SignupFormPage'
import AdminLayout from '@/pages/admin/components/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminVerificationsPage from '@/pages/admin/AdminVerificationsPage'
import AdminRegistryPage from '@/pages/admin/AdminRegistryPage'
import AdminAppsPage from '@/pages/admin/AdminAppsPage'
import AdminSnacksPage from '@/pages/admin/snacks/AdminSnacksPage'
import SnackEventDetailPage from '@/pages/admin/snacks/SnackEventDetailPage'
import SnackScannerPage from '@/pages/admin/snacks/SnackScannerPage'
import DeveloperLayout from '@/pages/developer/components/DeveloperLayout'
import DeveloperLandingPage from '@/pages/developer/DeveloperLandingPage'
import DeveloperAppsPage from '@/pages/developer/DeveloperAppsPage'
import DeveloperAppNewPage from '@/pages/developer/DeveloperAppNewPage'

const basename = (import.meta.env.VITE_BASE_PATH as string)?.trim()
  ? `/${(import.meta.env.VITE_BASE_PATH as string).trim().replace(/^\/|\/$/g, '')}`
  : undefined

export const router = createBrowserRouter(
  [
    { path: "/", element: <Navigate to="/developer" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/auth/callback", element: <AuthCallbackPage /> },
    { path: "/consent", element: <ConsentPage /> },
    { path: "/error", element: <ErrorPage /> },
    { path: "/signup", element: <SignupFormPage /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: "users", element: <AdminUsersPage /> },
        { path: "verifications", element: <AdminVerificationsPage /> },
        { path: "registry", element: <AdminRegistryPage /> },
        { path: "apps", element: <AdminAppsPage /> },
        { path: "snacks", element: <AdminSnacksPage /> },
        { path: "snacks/:id", element: <SnackEventDetailPage /> },
        { path: "snacks/:id/scan", element: <SnackScannerPage /> },
      ],
    },
    {
      path: "/developer",
      element: <DeveloperLayout />,
      children: [
        { index: true, element: <DeveloperLandingPage /> },
        { path: "apps", element: <DeveloperAppsPage /> },
        { path: "apps/new", element: <DeveloperAppNewPage /> },
      ],
    },
  ],
  basename ? { basename } : {},
)
