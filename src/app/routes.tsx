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
import DeveloperHubPage from '@/pages/developer/DeveloperHubPage'
import DeveloperQuickstartPage from '@/pages/developer/DeveloperQuickstartPage'
import DeveloperSsoFlowPage from '@/pages/developer/guides/DeveloperSsoFlowPage'
import DeveloperSpringBootPage from '@/pages/developer/guides/DeveloperSpringBootPage'
import DeveloperManualJwtPage from '@/pages/developer/guides/DeveloperManualJwtPage'
import DeveloperRbacPage from '@/pages/developer/guides/DeveloperRbacPage'
import DeveloperJwtClaimsPage from '@/pages/developer/reference/DeveloperJwtClaimsPage'
import DeveloperApiRefPage from '@/pages/developer/reference/DeveloperApiRefPage'
import DeveloperAppsPage from '@/pages/developer/DeveloperAppsPage'
import DeveloperAppNewPage from '@/pages/developer/DeveloperAppNewPage'
import DeveloperArchitecturePage from '@/pages/developer/DeveloperArchitecturePage'

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
        { index: true, element: <DeveloperHubPage /> },
        { path: "quickstart", element: <DeveloperQuickstartPage /> },
        { path: "guides/sso-flow", element: <DeveloperSsoFlowPage /> },
        { path: "guides/spring-boot", element: <DeveloperSpringBootPage /> },
        { path: "guides/manual-jwt", element: <DeveloperManualJwtPage /> },
        { path: "guides/rbac", element: <DeveloperRbacPage /> },
        { path: "reference/jwt-claims", element: <DeveloperJwtClaimsPage /> },
        { path: "reference/api", element: <DeveloperApiRefPage /> },
        { path: "apps", element: <DeveloperAppsPage /> },
        { path: "apps/new", element: <DeveloperAppNewPage /> },
        { path: "architecture", element: <DeveloperArchitecturePage /> },
      ],
    },
  ],
  basename ? { basename } : {},
)
