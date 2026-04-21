import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Search } from 'lucide-react'
import { authApi } from '@/shared/api/auth.api'
import { buildSSOLoginUrl } from '@/shared/utils/oauth'

const STAFF_ROLES = new Set(['ADMIN', 'EXECUTIVE', 'FINANCE', 'PLANNING', 'PR', 'CULTURE'])

export default function DeveloperLayout() {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        authApi.me()
            .then((res) => {
                setIsLoggedIn(res.authenticated)
                setRole(res.role ?? null)
            })
            .catch(() => {
                setIsLoggedIn(false)
                setRole(null)
            })
    }, [])

    const isStaff = role !== null && STAFF_ROLES.has(role)

    const handleLogout = async () => {
        try { await authApi.logout() } catch { /* ignore */ }
        setIsLoggedIn(false)
        setRole(null)
        navigate('/developer')
    }

    const handleLogin = () => {
        const url = buildSSOLoginUrl({ returnPath: '/developer' })
        navigate(url)
    }

    return (
        <div className="min-h-screen bg-surface-50">
            <header className="bg-white/95 backdrop-blur border-b border-surface-200 sticky top-0 z-20">
                <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-3 flex items-center gap-6">
                    <NavLink to="/developer" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold tracking-wider">CSE</span>
                        </div>
                        <div className="leading-none">
                            <p className="text-ink font-semibold text-[13.5px]">Developer Portal</p>
                            <p className="text-ink-300 text-[10px] font-mono tracking-wider mt-0.5">v1.2.0</p>
                        </div>
                    </NavLink>

                    <div className="hidden md:flex flex-1 max-w-md">
                        <button
                            className="w-full flex items-center gap-2 px-3 py-1.5 bg-surface-100 border border-surface-200 rounded-md text-ink-300 hover:text-ink-500 text-[13px] transition-colors"
                            title="검색 (준비 중)"
                            disabled
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span className="flex-1 text-left">문서 검색</span>
                            <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-surface-300 text-ink-300">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    <nav className="flex items-center gap-5 text-sm ml-auto">
                        <a
                            href="https://github.com/Committee-of-System-Library"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:block text-ink-500 hover:text-ink font-medium transition-colors text-[13.5px]"
                        >
                            GitHub
                        </a>
                        <NavLink
                            to="/developer/apps"
                            className={({ isActive }) =>
                                `font-medium transition-colors text-[13.5px] ${
                                    isActive ? 'text-ink' : 'text-ink-500 hover:text-ink'
                                }`
                            }
                        >
                            대시보드
                        </NavLink>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-ink-500 hover:text-danger font-medium transition-colors text-[13.5px]"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">로그아웃</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-white hover:bg-ink-700 font-medium transition-colors rounded-md text-[13px]"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                로그인
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <Outlet context={{ isLoggedIn, role, isStaff }} />
        </div>
    )
}

export type DeveloperOutletContext = {
    isLoggedIn: boolean
    role: string | null
    isStaff: boolean
}
