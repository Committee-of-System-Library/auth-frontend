import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import Callout from '../_docs/Callout'
import { H2, P, InlineCode, Badge } from '../_docs/atoms'

type Endpoint = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    desc: string
    auth: 'none' | 'jwt' | 'cookie'
    params?: string[]
}

type Group = {
    title: string
    id: string
    endpoints: Endpoint[]
}

const GROUPS: Group[] = [
    {
        title: 'SSO 인증',
        id: 'sso',
        endpoints: [
            { method: 'GET', path: '/appfn/api/login', desc: 'SSO 로그인 시작. client_id, redirect_uri, state 파라미터 필요', auth: 'none', params: ['client_id', 'redirect_uri', 'state'] },
            { method: 'GET', path: '/appfn/api/auth/me', desc: '현재 인증 상태 (쿠키 세션). 내부 서비스용', auth: 'cookie' },
            { method: 'POST', path: '/appfn/api/signup', desc: '신규 사용자 등록 — 학번·전공·userType', auth: 'none' },
            { method: 'POST', path: '/appfn/api/logout', desc: '로그아웃 (쿠키 삭제)', auth: 'cookie' },
        ],
    },
    {
        title: 'Developer · 앱 관리',
        id: 'developer',
        endpoints: [
            { method: 'GET', path: '/appfn/api/developer/apps', desc: '내가 등록한 앱 목록', auth: 'jwt' },
            { method: 'POST', path: '/appfn/api/developer/apps', desc: '새 앱 등록 (관리자 승인 대기 상태로 생성)', auth: 'jwt' },
            { method: 'POST', path: '/appfn/api/developer/apps/{id}/secret', desc: 'Client Secret 재발급 (표시는 1 회)', auth: 'jwt' },
        ],
    },
    {
        title: 'Developer · 문서',
        id: 'docs',
        endpoints: [
            { method: 'GET', path: '/appfn/api/developer/docs/architecture', desc: '내부 아키텍처 문서 (staff 전용)', auth: 'jwt' },
        ],
    },
]

export default function DeveloperApiRefPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/reference/api">
            <DocsHero
                eyebrow="§ 07 · 레퍼런스"
                title="REST API"
                lede="auth-server 가 외부로 노출하는 주요 엔드포인트. 모든 경로는 /appfn/api context-path 하위에 위치합니다."
                meta={[
                    { label: 'Base', value: 'https://chcse.knu.ac.kr/appfn/api' },
                    { label: 'Auth', value: 'Bearer JWT · Cookie' },
                ]}
            />

            <Callout variant="info" title="인증 방식">
                외부 클라이언트는 <InlineCode>Authorization: Bearer &lt;JWT&gt;</InlineCode> 헤더로 호출합니다. auth-client 내부 화면은 세션 쿠키를 사용합니다.
            </Callout>

            {GROUPS.map((g) => (
                <section key={g.id}>
                    <H2 id={g.id}>{g.title}</H2>
                    <P>
                        {g.id === 'sso' && 'SSO 로그인·세션 엔드포인트.'}
                        {g.id === 'developer' && '앱 등록·조회. JWT 필요.'}
                        {g.id === 'docs' && '문서 조회. 역할 검증 후 응답.'}
                    </P>
                    <div className="my-5 space-y-2">
                        {g.endpoints.map((e) => (
                            <ApiRow key={e.path + e.method} endpoint={e} />
                        ))}
                    </div>
                </section>
            ))}
        </DocsShell>
    )
}

function ApiRow({ endpoint: e }: { endpoint: Endpoint }) {
    const methodStyle: Record<Endpoint['method'], string> = {
        GET: 'bg-emerald-50 text-emerald-700',
        POST: 'bg-sky-50 text-sky-700',
        PUT: 'bg-amber-50 text-amber-700',
        DELETE: 'bg-rose-50 text-rose-700',
    }
    return (
        <article className="bg-white border border-surface-200 rounded-md p-4 hover:border-ink-200 transition-colors">
            <header className="flex items-center gap-2.5 flex-wrap">
                <span className={`font-mono text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${methodStyle[e.method]}`}>
                    {e.method}
                </span>
                <code className="font-mono text-[13px] text-ink">{e.path}</code>
                <div className="ml-auto flex items-center gap-1.5">
                    {e.auth === 'none' && <Badge tone="neutral">PUBLIC</Badge>}
                    {e.auth === 'jwt' && <Badge tone="primary">JWT</Badge>}
                    {e.auth === 'cookie' && <Badge tone="neutral">COOKIE</Badge>}
                </div>
            </header>
            <p className="text-ink-500 text-[13px] mt-2">{e.desc}</p>
            {e.params && e.params.length > 0 && (
                <p className="mt-1.5 text-ink-300 text-[12px] font-mono">
                    params: {e.params.join(', ')}
                </p>
            )}
        </article>
    )
}
