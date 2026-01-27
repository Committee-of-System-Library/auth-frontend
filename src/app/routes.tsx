import { createBrowserRouter } from "react-router-dom"
import LoginPage from "../pages/login/LoginPage"
import AuthCallbackPage from "../pages/AuthCallbackPage"
import ConsentPage from "../pages/ConsentPage"
import ErrorPage from "../pages/ErrorPage"

export const router = createBrowserRouter([
    { path: "/", element: <LoginPage /> },
    { path: "/auth/callback", element: <AuthCallbackPage /> },
    { path: "/consent", element: <ConsentPage /> },
    { path: "/error", element: <ErrorPage /> },
])