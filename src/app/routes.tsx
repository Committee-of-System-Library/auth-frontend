import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/login/LoginPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import ConsentPage from '@/pages/consent/ConsentPage'
import ErrorPage from '@/pages/error/ErrorPage'
import SignupFormPage from '@/pages/signup/SignupFormPage'
import MainPage from '@/pages/main/MainPage'

export const router = createBrowserRouter([
    { path: "/", element: <LoginPage /> },
    { path: "/auth/callback", element: <AuthCallbackPage /> },
    { path: "/callback", element: <AuthCallbackPage /> },
    { path: "/consent", element: <ConsentPage /> },
    { path: "/error", element: <ErrorPage /> },
    { path: "/signup", element: <SignupFormPage /> },
    { path: "/main", element: <MainPage /> },
])