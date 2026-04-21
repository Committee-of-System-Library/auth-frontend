import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Zap, BookOpen, Code2, FileCode, ShieldCheck, KeyRound, Network, Boxes, ShieldAlert } from 'lucide-react'
import type { DeveloperOutletContext } from './components/DeveloperLayout'
import DocsShell from './_docs/DocsShell'

const CATEGORIES = [
    {
        title: '시작하기',
        desc: '5분 안에 SSO 를 연결하고 첫 JWT 를 검증해보세요.',
        icon: Zap,
        items: [
            { to: '/developer/quickstart', label: 'Quickstart — 5분 가이드' },
        ],
    },
    {
        title: '가이드',
        desc: 'SSO 로그인 플로우부터 권한 모델까지 단계별 문서.',
        icon: BookOpen,
        items: [
            { to: '/developer/guides/sso-flow', label: 'SSO 로그인 플로우' },
            { to: '/developer/guides/spring-boot', label: 'Spring Boot Starter' },
            { to: '/developer/guides/manual-jwt', label: '수동 JWT 검증 (JS / Python / Node / Go)' },
            { to: '/developer/guides/rbac', label: '역할 기반 접근 제어' },
        ],
    },
    {
        title: '레퍼런스',
        desc: 'JWT 클레임 명세, REST 엔드포인트 사양.',
        icon: Code2,
        items: [
            { to: '/developer/reference/jwt-claims', label: 'JWT Claims' },
            { to: '/developer/reference/api', label: 'REST API' },
        ],
    },
    {
        title: '대시보드',
        desc: 'Client ID 발급·관리. 로그인 후 이용 가능.',
        icon: FileCode,
        items: [
            { to: '/developer/apps', label: '내 앱' },
            { to: '/developer/apps/new', label: '앱 등록' },
        ],
    },
]

const FACT_CHIPS = [
    { icon: ShieldCheck, label: 'HMAC-SHA256 · 1h TTL' },
    { icon: KeyRound, label: 'Google Workspace SSO' },
    { icon: Network, label: 'Starter 1.2.0' },
    { icon: Boxes, label: 'Spring Boot · Node · Python · Go' },
]

export default function DeveloperHubPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} toc={false} pager={false}>
            <section className="pb-12 mb-12 border-b border-ink-100">
                <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.2em] uppercase text-primary mb-4">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary dot-pulse" />
                    <span>KNU CSE · Developer Portal</span>
                </div>
                <h1 className="text-[44px] sm:text-[56px] font-bold text-ink tracking-tight leading-[1.0] max-w-3xl">
                    경북대 컴퓨터학부<br />
                    <span className="text-primary">SSO 통합 문서</span>
                </h1>
                <p className="mt-6 text-ink-500 text-[16px] leading-relaxed max-w-xl">
                    학부 Google Workspace 계정 하나로 내 서비스에 로그인을 붙이세요.
                    Spring Boot Starter 한 줄이면 충분합니다.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        to="/developer/quickstart"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-ink-700 text-white rounded-md text-[14px] font-medium transition-colors"
                    >
                        Quickstart <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/developer/guides/spring-boot"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-surface-300 hover:border-ink-300 text-ink rounded-md text-[14px] font-medium transition-colors"
                    >
                        Spring Boot 가이드
                    </Link>
                </div>

                <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11.5px] text-ink-500">
                    {FACT_CHIPS.map((c) => (
                        <li key={c.label} className="inline-flex items-center gap-1.5">
                            <c.icon className="w-3 h-3 text-primary" />
                            {c.label}
                        </li>
                    ))}
                </ul>
            </section>

            {isStaff && <StaffRibbon />}

            <section>
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-300 mb-4">
                    탐색
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                        <CategoryCard key={cat.title} {...cat} />
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-300 mb-4">
                    한눈에 보기
                </h2>
                <div className="bg-white border border-surface-200 rounded-lg overflow-hidden">
                    <InfoRow label="인증 프로토콜" value="OAuth 2.0 유사 흐름 (auth-server 가 IdP)" />
                    <InfoRow label="토큰" value="JWT · HS256 · 1h TTL · 서비스별 client secret 로 서명" />
                    <InfoRow label="클레임" value="sub, student_number, name, email, major, user_type, role, aud, iss, iat, exp" />
                    <InfoRow label="역할 계층" value="ADMIN > EXECUTIVE | FINANCE | PLANNING | PR | CULTURE > STUDENT" />
                    <InfoRow label="허용 이메일 도메인" value="@knu.ac.kr" />
                </div>
            </section>
        </DocsShell>
    )
}

function CategoryCard({
    title,
    desc,
    icon: Icon,
    items,
}: {
    title: string
    desc: string
    icon: typeof Zap
    items: { to: string; label: string }[]
}) {
    return (
        <div className="group bg-white border border-surface-200 hover:border-ink-200 rounded-lg p-5 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <h3 className="text-ink font-semibold text-[15px]">{title}</h3>
            </div>
            <p className="text-ink-500 text-[13px] leading-relaxed mb-4">{desc}</p>
            <ul className="space-y-1.5">
                {items.map((i) => (
                    <li key={i.to}>
                        <Link
                            to={i.to}
                            className="group/item flex items-center gap-1.5 text-[13.5px] text-ink-700 hover:text-primary transition-colors"
                        >
                            <span>{i.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start px-5 py-3 border-b border-surface-200 last:border-0 gap-1 sm:gap-6">
            <dt className="font-mono text-[11px] tracking-widest uppercase text-ink-300 sm:w-36 flex-shrink-0 pt-0.5">
                {label}
            </dt>
            <dd className="text-[13.5px] text-ink-700 flex-1">{value}</dd>
        </div>
    )
}

function StaffRibbon() {
    return (
        <Link
            to="/developer/architecture"
            className="group relative block mb-12 bg-ink text-white overflow-hidden rounded-md"
        >
            <div className="absolute inset-y-0 left-0 w-[3px] bg-primary-400" />
            <div className="pl-6 pr-5 py-5 grid sm:grid-cols-[auto_1fr_auto] gap-5 items-center">
                <div className="w-9 h-9 border border-white/20 rounded flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-primary-300" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-primary-300 mb-1.5">
                        <span>INTERNAL · STAFF ONLY</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-primary-400 dot-pulse" />
                    </div>
                    <p className="font-semibold text-[15px] leading-tight">플랫폼 아키텍처 문서</p>
                    <p className="text-white/50 text-[12.5px] mt-0.5">
                        8 개 서브 레포 · 토폴로지 · 배포 흐름 · Nginx 라우팅
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>열람</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    )
}
