import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import CodeBlock from '../_docs/CodeBlock'
import Callout from '../_docs/Callout'
import { H2, P, InlineCode } from '../_docs/atoms'

type Claim = {
    name: string
    type: string
    required: boolean
    desc: string
    example: string
}

const CLAIMS: Claim[] = [
    { name: 'sub', type: 'string', required: true, desc: '플랫폼 내부 사용자 ID (Student.id)', example: '"7"' },
    { name: 'student_number', type: 'string | null', required: false, desc: '학번. EXTERNAL 은 임시 학번', example: '"2023012780"' },
    { name: 'name', type: 'string', required: true, desc: '이름', example: '"홍길동"' },
    { name: 'email', type: 'string', required: true, desc: '이메일 (일반적으로 @knu.ac.kr)', example: '"hong@knu.ac.kr"' },
    { name: 'major', type: 'string | null', required: false, desc: '전공 (CSE_STUDENT 일 때만)', example: '"심화컴퓨팅 전공"' },
    { name: 'user_type', type: 'string', required: true, desc: 'CSE_STUDENT · KNU_OTHER_DEPT · EXTERNAL', example: '"CSE_STUDENT"' },
    { name: 'role', type: 'string | null', required: false, desc: '역할 (ADMIN / EXECUTIVE 등). 외부 사용자는 null', example: '"STUDENT"' },
    { name: 'aud', type: 'string', required: true, desc: '발급 대상 Client ID', example: '"cse-a1b2c3d4"' },
    { name: 'iss', type: 'string', required: true, desc: '발급자', example: '"https://chcse.knu.ac.kr/appfn/api"' },
    { name: 'iat', type: 'number', required: true, desc: '발급 시각 (Unix)', example: '1711065600' },
    { name: 'exp', type: 'number', required: true, desc: '만료 시각 (Unix, 1시간 TTL)', example: '1711069200' },
]

export default function DeveloperJwtClaimsPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/reference/jwt-claims">
            <DocsHero
                eyebrow="§ 06 · 레퍼런스"
                title="JWT Claims"
                lede="auth-server 가 발급하는 SSO JWT 의 클레임 명세. 서명 HS256, TTL 1 시간. 모든 claim 키는 snake_case."
                meta={[
                    { label: 'Algorithm', value: 'HS256' },
                    { label: 'TTL', value: '3600 s' },
                ]}
            />

            <H2 id="schema">스키마</H2>
            <P>필수 클레임 (required=✓) 이 누락되면 Starter 의 <InlineCode>KnuCseJwtAuthenticationConverter</InlineCode> 가 <InlineCode>OAuth2AuthenticationException(invalid_token)</InlineCode> 을 던집니다.</P>

            <div className="my-6 border border-surface-200 bg-white rounded-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-ink bg-surface-50">
                            {['Claim', 'Type', 'Req', '설명', '예시'].map((h) => (
                                <th key={h} className="text-left px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase text-ink-500">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CLAIMS.map((c) => (
                            <tr key={c.name} className="border-b border-surface-200 last:border-0 hover:bg-surface-50 transition-colors">
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary font-semibold whitespace-nowrap">{c.name}</td>
                                <td className="px-4 py-2.5 font-mono text-[12px] text-ink-500 whitespace-nowrap">{c.type}</td>
                                <td className="px-4 py-2.5 text-[12px] text-ink-500">{c.required ? '✓' : '—'}</td>
                                <td className="px-4 py-2.5 text-[13px] text-ink-700">{c.desc}</td>
                                <td className="px-4 py-2.5 font-mono text-[12px] text-ink-300 whitespace-nowrap">{c.example}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <H2 id="example-payload">예시 페이로드</H2>
            <CodeBlock filename="payload.json" lang="json">{`{
  "sub": "7",
  "student_number": "2023012780",
  "name": "홍길동",
  "email": "hong@knu.ac.kr",
  "major": "심화컴퓨팅 전공",
  "user_type": "CSE_STUDENT",
  "role": "STUDENT",
  "aud": "cse-a1b2c3d4",
  "iss": "https://chcse.knu.ac.kr/appfn/api",
  "iat": 1711065600,
  "exp": 1711069200
}`}</CodeBlock>

            <Callout variant="info" title="키 네이밍">
                클레임은 모두 snake_case 입니다. Starter 가 Java 측에서는 camelCase Getter 로 자동 매핑하지만, 다른 언어에서 직접 검증 시에는 키 이름을 그대로 사용하세요.
            </Callout>
        </DocsShell>
    )
}
