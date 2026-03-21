import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Users, ShieldCheck, Database, AppWindow, LayoutDashboard, LogOut } from 'lucide-react'
import { authApi } from '@/shared/api/auth.api'
import { saveReturnPath } from '@/shared/utils/oauth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
    { to: '/admin/users', icon: Users, label: '사용자 관리' },
    { to: '/admin/verifications', icon: ShieldCheck, label: '인증 요청' },
    { to: '/admin/registry', icon: Database, label: '학생 명단' },
    { to: '/admin/apps', icon: AppWindow, label: '클라이언트 관리' },
]

type AuthState = 'loading' | 'authenticated' | 'forbidden'

export default function AdminLayout() {
    const [authState, setAuthState] = useState<AuthState>('loading')
    const navigate = useNavigate()

    useEffect(() => {
        const redirectToLogin = () => {
            saveReturnPath('/admin')
            navigate('/login')
        }
        authApi.me()
            .then((res) => {
                if (!res.authenticated) {
                    redirectToLogin()
                    return
                }
                if (res.role !== 'ADMIN') {
                    setAuthState('forbidden')
                    return
                }
                setAuthState('authenticated')
            })
            .catch(() => {
                redirectToLogin()
            })
    }, [navigate])

    const handleLogout = async () => {
        try {
            await authApi.logout()
        } catch {
            // ignore
        }
        window.location.href = '/developer'
    }

    if (authState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <LoadingSpinner message="인증 확인 중..." size="md" />
            </div>
        )
    }

    if (authState === 'forbidden') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
                <div className="text-center">
                    <p className="text-5xl font-bold text-ink-200 mb-4">403</p>
                    <h1 className="text-xl font-bold text-ink mb-2">접근 권한이 없습니다</h1>
                    <p className="text-ink-300 text-sm mb-8">관리자 권한이 필요합니다.</p>
                    <a href="/developer" className="text-primary text-sm font-medium hover:underline">
                        돌아가기
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* 사이드바 */}
            <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-surface-200 fixed inset-y-0 left-0 z-20">
                {/* 로고 */}
                <div className="px-5 py-5 border-b border-surface-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">A</span>
                        </div>
                        <p className="text-ink font-bold text-sm">CSE Admin</p>
                    </div>
                </div>

                {/* 내비게이션 */}
                <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                                    isActive
                                        ? 'bg-surface-100 text-ink'
                                        : 'text-ink-500 hover:bg-surface-50 hover:text-ink-700'
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* 하단 */}
                <div className="px-2.5 py-3 border-t border-surface-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-ink-300 hover:text-danger hover:bg-red-50/50 w-full transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 lg:ml-56">
                {/* 모바일 헤더 */}
                <header className="lg:hidden bg-white border-b border-surface-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-ink rounded-md flex items-center justify-center">
                            <span className="text-white text-[9px] font-bold">A</span>
                        </div>
                        <p className="text-ink font-bold text-sm">CSE Admin</p>
                    </div>
                </header>

                {/* 모바일 하단 네비게이션 */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 flex justify-around py-1.5 z-10">
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
                                    isActive ? 'text-ink' : 'text-ink-300'
                                }`
                            }
                        >
                            <item.icon className="w-4.5 h-4.5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-5 lg:p-8 pb-20 lg:pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
