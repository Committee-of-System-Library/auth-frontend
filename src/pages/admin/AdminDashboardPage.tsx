import { Users, ShieldCheck, Database, AppWindow, ArrowRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const stats = [
    { label: '전체 사용자', value: '—', icon: Users },
    { label: '인증 대기', value: '—', icon: ShieldCheck },
    { label: '학생 명단', value: '—', icon: Database },
    { label: '클라이언트', value: '—', icon: AppWindow },
]

const quickActions = [
    { title: '사용자 관리', desc: '역할 변경, 계정 관리', to: '/admin/users' },
    { title: '인증 요청 처리', desc: '학부생 인증 승인/거부', to: '/admin/verifications' },
    { title: '학생 명단', desc: 'CSV 업로드, 명단 관리', to: '/admin/registry' },
    { title: '클라이언트 관리', desc: 'OAuth 앱 승인/거부', to: '/admin/apps' },
]

export default function AdminDashboardPage() {
    return (
        <div className="animate-fade-up">
            <h1 className="text-lg font-bold text-ink mb-6">대시보드</h1>

            {/* 통계 — 한 줄 요약 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-surface-200">
                        <stat.icon className="w-4 h-4 text-ink-300 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-lg font-semibold text-ink leading-tight">{stat.value}</p>
                            <p className="text-ink-300 text-[11px]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 빠른 작업 — 텍스트 링크 */}
            <h2 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-3">빠른 작업</h2>
            <div className="bg-white rounded-lg border border-surface-200 divide-y divide-surface-100">
                {quickActions.map((action) => (
                    <NavLink
                        key={action.to}
                        to={action.to}
                        className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 transition-colors group"
                    >
                        <div>
                            <p className="text-sm font-medium text-ink">{action.title}</p>
                            <p className="text-ink-300 text-xs">{action.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-200 group-hover:text-ink-500 transition-colors" />
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
