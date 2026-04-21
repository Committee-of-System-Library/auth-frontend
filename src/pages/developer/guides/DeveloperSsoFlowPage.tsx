import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import Callout from '../_docs/Callout'
import CodeBlock from '../_docs/CodeBlock'
import { H2, P, InlineCode, Badge } from '../_docs/atoms'

const STEPS = [
    {
        num: '01',
        title: '앱 등록',
        tag: '선행',
        body: 'Developer Portal 에서 앱을 등록하면 관리자 승인 후 Client ID · Client Secret 이 발급됩니다.',
    },
    {
        num: '02',
        title: '로그인 리다이렉트',
        tag: 'GET',
        body: '사용자를 /login 엔드포인트로 보냅니다. client_id, redirect_uri, state 파라미터가 필수입니다.',
    },
    {
        num: '03',
        title: 'Google 인증',
        tag: 'Google',
        body: '사용자가 Google Workspace (@knu.ac.kr) 계정으로 인증합니다.',
    },
    {
        num: '04',
        title: 'JWT 전달',
        tag: 'Redirect',
        body: '인증이 끝나면 redirect_uri?state=…&token=<JWT> 형식으로 리다이렉트됩니다.',
    },
    {
        num: '05',
        title: '검증 및 사용',
        tag: 'HS256',
        body: 'Client Secret 으로 HMAC-SHA256 서명을 검증하고 클레임에서 사용자 정보를 추출합니다.',
    },
]

export default function DeveloperSsoFlowPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/guides/sso-flow">
            <DocsHero
                eyebrow="§ 02 · 가이드"
                title="SSO 로그인 플로우"
                lede="외부 서비스가 auth-server 를 IdP 로 사용해 로그인을 처리하는 전체 흐름. OAuth 2.0 과 유사하지만 단순화된 토큰 전달 방식입니다."
            />

            <H2 id="sequence">시퀀스 다이어그램</H2>
            <P>다섯 단계로 압축한 흐름.</P>

            <ol className="mt-4 space-y-4">
                {STEPS.map((s) => (
                    <li key={s.num} className="relative flex gap-5 py-4 border-t border-surface-200 first:border-0 first:pt-0">
                        <div className="font-mono text-[11px] tracking-widest text-ink-300 w-8 flex-shrink-0 pt-0.5">
                            {s.num}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-ink font-semibold text-[15px]">{s.title}</h3>
                                <Badge tone="primary">{s.tag}</Badge>
                            </div>
                            <p className="text-ink-500 text-[13.5px] leading-relaxed">{s.body}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <H2 id="login-url">로그인 URL 구성</H2>
            <P>
                프론트엔드에서 버튼을 누를 때 생성해야 하는 URL. <InlineCode>state</InlineCode> 는 CSRF 방지용이므로
                세션 스토리지에 저장했다가 콜백에서 검증하세요.
            </P>

            <CodeBlock filename="build-login-url.ts" lang="typescript">{`function buildLoginUrl() {
    const state = crypto.randomUUID()
    sessionStorage.setItem('sso_state', state)

    const params = new URLSearchParams({
        client_id: 'cse-a1b2c3d4',
        redirect_uri: 'https://myapp.example.com/callback',
        state,
    })

    return \`https://chcse.knu.ac.kr/appfn/api/login?\${params}\`
}`}</CodeBlock>

            <H2 id="callback">콜백 처리</H2>
            <P>
                리다이렉트로 받은 <InlineCode>state</InlineCode> 와 저장된 값이 일치해야 정상 요청입니다. 다르면 즉시 거절하세요.
            </P>

            <CodeBlock filename="handle-callback.ts" lang="typescript">{`function handleCallback() {
    const params = new URLSearchParams(window.location.search)
    const state = params.get('state')
    const token = params.get('token')

    if (state !== sessionStorage.getItem('sso_state')) {
        throw new Error('state 불일치 — 요청 거절')
    }
    if (!token) throw new Error('token 없음')

    localStorage.setItem('sso_token', token)
    return token
}`}</CodeBlock>

            <Callout variant="warn" title="redirect_uri 는 등록된 값과 정확히 일치해야 합니다">
                대소문자·경로·포트까지 모두 일치해야 합니다. 개발용·운영용 주소를 모두 미리 등록해두세요.
            </Callout>
        </DocsShell>
    )
}
