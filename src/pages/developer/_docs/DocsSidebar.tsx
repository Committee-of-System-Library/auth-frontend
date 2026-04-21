import { NavLink } from 'react-router-dom'
import { Lock, ShieldAlert } from 'lucide-react'
import { DOCS_NAV } from './docsNav'

export default function DocsSidebar({ isStaff }: { isStaff: boolean }) {
    return (
        <nav aria-label="문서 네비게이션" className="space-y-7">
            {DOCS_NAV.filter((g) => !g.staffOnly || isStaff).map((group) => (
                <div key={group.title}>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-300 mb-2.5 px-3">
                        {group.title}
                    </p>
                    <ul className="space-y-0.5">
                        {group.items.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.to === '/developer'}
                                    className={({ isActive }) =>
                                        `group relative flex items-center gap-2 pl-3 pr-2 py-1.5 text-[13.5px] leading-snug rounded-md transition-colors ${
                                            isActive
                                                ? 'text-ink font-medium bg-surface-100'
                                                : 'text-ink-500 hover:text-ink hover:bg-surface-50'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                aria-hidden
                                                className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full transition-colors ${
                                                    isActive ? 'bg-primary' : 'bg-transparent'
                                                }`}
                                            />
                                            <span className="flex-1">{item.label}</span>
                                            {item.flag === 'auth' && (
                                                <Lock className="w-3 h-3 text-ink-300 flex-shrink-0" aria-label="로그인 필요" />
                                            )}
                                            {item.flag === 'staff' && (
                                                <ShieldAlert className="w-3 h-3 text-primary flex-shrink-0" aria-label="임원 전용" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    )
}
