import { NavLink, Outlet } from 'react-router-dom'

export default function DeveloperLayout() {
    return (
        <div className="min-h-screen bg-surface-50">
            {/* 헤더 */}
            <header className="bg-white border-b border-surface-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
                    <NavLink to="/developer" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">S</span>
                        </div>
                        <p className="text-ink font-bold text-sm">CSE SSO</p>
                    </NavLink>
                    <nav className="flex items-center gap-4 text-sm">
                        <NavLink
                            to="/developer"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink-300 hover:text-ink-500'}`
                            }
                        >
                            문서
                        </NavLink>
                        <NavLink
                            to="/developer/apps"
                            className={({ isActive }) =>
                                `font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink-300 hover:text-ink-500'}`
                            }
                        >
                            내 앱
                        </NavLink>
                    </nav>
                </div>
            </header>

            {/* 콘텐츠 */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}
