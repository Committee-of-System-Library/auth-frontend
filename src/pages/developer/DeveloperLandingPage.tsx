import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DeveloperLandingPage() {
    const navigate = useNavigate()

    const handleStart = () => {
        navigate('/developer/apps')
    }

    return (
        <div className="animate-fade-up">
            {/* Hero */}
            <section className="py-12 lg:py-20">
                <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase mb-3">KNU CSE SSO</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-ink leading-tight mb-4">
                    학부생을 위한<br />통합 인증 플랫폼
                </h1>
                <p className="text-ink-500 text-base lg:text-lg leading-relaxed max-w-xl mb-8">
                    경북대학교 컴퓨터학부 Google Workspace 계정으로 SSO 로그인을 제공합니다.
                    Spring Boot Starter 하나로 프로젝트에 연동하세요.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleStart}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-colors"
                    >
                        시작하기
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                        href="#flow"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-300 text-ink-700 rounded-lg text-sm font-medium hover:bg-surface-50 transition-colors"
                    >
                        문서 보기
                    </a>
                </div>
            </section>

            {/* SSO 로그인 플로우 */}
            <section id="flow" className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">SSO 로그인 플로우</h2>
                <p className="text-ink-300 text-sm mb-6">외부 서비스가 SSO를 사용하는 전체 흐름입니다.</p>

                <div className="space-y-4">
                    <FlowStep
                        num={1}
                        title="앱 등록"
                        desc="개발자 포털에서 앱을 등록하면 관리자 승인 후 Client ID, Client Secret, JWT Secret이 발급됩니다."
                    />
                    <FlowStep
                        num={2}
                        title="로그인 리다이렉트"
                        desc="사용자를 SSO 서버의 /login 엔드포인트로 보냅니다. client_id, redirect_uri, state 파라미터를 포함합니다."
                    />
                    <FlowStep
                        num={3}
                        title="Google 인증"
                        desc="사용자가 Google Workspace 계정으로 인증합니다. (컴학 @knu.ac.kr 계정)"
                    />
                    <FlowStep
                        num={4}
                        title="JWT 토큰 수신"
                        desc="인증 완료 후 redirect_uri?state=xxx&token=<JWT> 형태로 리다이렉트됩니다. JWT에 사용자 정보가 담겨 있습니다."
                    />
                    <FlowStep
                        num={5}
                        title="토큰 검증 및 사용"
                        desc="발급받은 JWT Secret(HMAC-SHA256)으로 토큰을 검증하고, 클레임에서 사용자 정보를 추출합니다."
                    />
                </div>
            </section>

            {/* Quick Start — Spring Boot */}
            <section id="quickstart" className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">Quick Start — Spring Boot</h2>
                <p className="text-ink-300 text-sm mb-6">Spring Boot Starter를 사용하면 설정만으로 연동이 완료됩니다.</p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            1. 의존성 추가
                        </h3>
                        <CodeBlock>{`// build.gradle
repositories {
    maven {
        url = uri("https://maven.pkg.github.com/Committee-of-System-Library/knu-cse-sso-spring-boot-starter")
        credentials {
            username = project.findProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR")
            password = project.findProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    implementation 'kr.ac.knu.cse:knu-cse-sso-spring-boot-starter:1.0.0'
}`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            2. application.yml 설정
                        </h3>
                        <CodeBlock>{`knu-cse:
  sso:
    client-id: cse-a1b2c3d4              # 발급받은 Client ID
    client-secret: \${JWT_SECRET}          # 발급받은 JWT Secret`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            3. Security 설정
                        </h3>
                        <CodeBlock>{`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            KnuCseJwtAuthenticationConverter converter
    ) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(converter))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            4. 사용자 정보 접근
                        </h3>
                        <CodeBlock>{`@GetMapping("/me")
public Map<String, Object> me(@AuthenticationPrincipal KnuCseUser user) {
    return Map.of(
        "id", user.getId(),
        "name", user.getName(),
        "email", user.getEmail(),
        "studentNumber", user.getStudentNumber(),
        "major", user.getMajor(),
        "userType", user.getUserType(),  // CSE_STUDENT, KNU_OTHER_DEPT, EXTERNAL
        "role", user.getRole()           // ADMIN, STUDENT, null 등
    );
}`}</CodeBlock>
                    </div>
                </div>
            </section>

            {/* 프론트엔드 연동 */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">프론트엔드 연동</h2>
                <p className="text-ink-300 text-sm mb-6">프론트엔드에서 SSO 로그인을 트리거하고 JWT를 받는 방법입니다.</p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            로그인 시작
                        </h3>
                        <CodeBlock>{`function login() {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
        client_id: 'cse-a1b2c3d4',
        redirect_uri: 'https://myapp.example.com/callback',
        state,
    });

    window.location.href =
        \`https://chcse.knu.ac.kr/appfn/api/login?\${params}\`;
}`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            콜백 처리
                        </h3>
                        <CodeBlock>{`function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    const token = params.get('token');

    // 1. state 검증 (CSRF 방지)
    if (state !== sessionStorage.getItem('oauth_state')) {
        throw new Error('State mismatch');
    }

    // 2. JWT 저장
    localStorage.setItem('sso_token', token);

    // 3. API 요청 시 Authorization 헤더에 포함
    fetch('/api/me', {
        headers: { Authorization: \`Bearer \${token}\` },
    });
}`}</CodeBlock>
                    </div>
                </div>
            </section>

            {/* 다른 언어 연동 */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">다른 언어/프레임워크</h2>
                <p className="text-ink-300 text-sm mb-6">JWT Secret으로 HMAC-SHA256 토큰을 직접 검증할 수 있습니다.</p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            Python (PyJWT)
                        </h3>
                        <CodeBlock>{`import jwt

payload = jwt.decode(
    token,
    "발급받은_JWT_Secret",
    algorithms=["HS256"],
    audience="cse-a1b2c3d4"
)
print(payload["name"], payload["email"])`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            Node.js (jsonwebtoken)
                        </h3>
                        <CodeBlock>{`const jwt = require('jsonwebtoken');

const payload = jwt.verify(token, '발급받은_JWT_Secret', {
    algorithms: ['HS256'],
    audience: 'cse-a1b2c3d4',
});
console.log(payload.name, payload.email);`}</CodeBlock>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            Go (golang-jwt)
                        </h3>
                        <CodeBlock>{`token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
    return []byte("발급받은_JWT_Secret"), nil
})
claims := token.Claims.(jwt.MapClaims)
fmt.Println(claims["name"], claims["email"])`}</CodeBlock>
                    </div>
                </div>
            </section>

            {/* JWT Claims */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">JWT Claims</h2>
                <p className="text-ink-300 text-sm mb-6">SSO 토큰에 포함되는 클레임 명세입니다. 서명: HMAC-SHA256, 유효시간: 1시간.</p>

                <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-200 bg-surface-50">
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">Claim</th>
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">설명</th>
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">예시</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            <ClaimRow claim="sub" type="string" desc="사용자 고유 ID" example={`"7"`} />
                            <ClaimRow claim="student_number" type="string" desc="학번" example={`"2023012780"`} />
                            <ClaimRow claim="name" type="string" desc="이름" example={`"홍길동"`} />
                            <ClaimRow claim="email" type="string" desc="@knu.ac.kr 이메일" example={`"hong@knu.ac.kr"`} />
                            <ClaimRow claim="major" type="string" desc="전공" example={`"심화컴퓨팅 전공"`} />
                            <ClaimRow claim="user_type" type="string" desc="사용자 유형" example={`"CSE_STUDENT"`} />
                            <ClaimRow claim="role" type="string | null" desc="역할" example={`"STUDENT"`} />
                            <ClaimRow claim="aud" type="string" desc="Client ID (audience)" example={`"cse-a1b2c3d4"`} />
                            <ClaimRow claim="iss" type="string" desc="발급자" example={`"https://chcse.knu.ac.kr/appfn/api"`} />
                            <ClaimRow claim="iat" type="number" desc="발급 시각 (Unix)" example="1711065600" />
                            <ClaimRow claim="exp" type="number" desc="만료 시각 (Unix)" example="1711069200" />
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border border-surface-200 p-4">
                        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">user_type 값</h4>
                        <ul className="text-sm text-ink-500 space-y-1">
                            <li><code className="text-primary text-xs">CSE_STUDENT</code> — 컴퓨터학부 학생 (학번 인증 완료)</li>
                            <li><code className="text-primary text-xs">KNU_OTHER_DEPT</code> — 경북대 타과생</li>
                            <li><code className="text-primary text-xs">EXTERNAL</code> — 외부 사용자</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg border border-surface-200 p-4">
                        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">role 값 (계층적)</h4>
                        <ul className="text-sm text-ink-500 space-y-1">
                            <li><code className="text-primary text-xs">ADMIN</code> — 관리자 (모든 권한 포함)</li>
                            <li><code className="text-primary text-xs">EXECUTIVE</code>, <code className="text-primary text-xs">FINANCE</code>, <code className="text-primary text-xs">PLANNING</code>, <code className="text-primary text-xs">PR</code>, <code className="text-primary text-xs">CULTURE</code></li>
                            <li><code className="text-primary text-xs">STUDENT</code> — 일반 학생</li>
                            <li><code className="text-primary text-xs">null</code> — 역할 없음 (외부 사용자 등)</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 역할 기반 접근 제어 */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">역할 기반 접근 제어</h2>
                <p className="text-ink-300 text-sm mb-6">Spring Boot Starter는 어노테이션으로 엔드포인트를 보호할 수 있습니다.</p>

                <CodeBlock>{`// 특정 역할 이상만 허용
@RequireRole(Role.ADMIN)
@GetMapping("/admin/dashboard")
public String adminOnly() { ... }

// 컴학 학부생만 허용
@RequireCseStudent
@GetMapping("/cse/resources")
public String cseOnly() { ... }

// 클래스 레벨 적용
@RestController
@RequireRole(Role.STUDENT)
@RequestMapping("/api/student")
public class StudentController { ... }`}</CodeBlock>
            </section>

            {/* API Reference */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">API Reference</h2>
                <p className="text-ink-300 text-sm mb-6">SSO Auth Server가 제공하는 주요 엔드포인트입니다.</p>

                <div className="space-y-3">
                    <ApiEndpoint
                        method="GET"
                        path="/login"
                        desc={<>SSO 로그인 시작. <code className="text-ink-500">client_id</code>, <code className="text-ink-500">redirect_uri</code>, <code className="text-ink-500">state</code> 파라미터 필요. 인증 완료 후 <code className="text-ink-500">redirect_uri?state=xxx&token=JWT</code>로 리다이렉트.</>}
                    />
                    <ApiEndpoint
                        method="GET"
                        path="/auth/me"
                        desc="현재 인증 상태 확인. 쿠키 기반 세션. (내부 서비스용)"
                    />
                    <ApiEndpoint
                        method="POST"
                        path="/signup"
                        desc="신규 사용자 등록. 학번, 전공, 사용자 유형 제출."
                    />
                    <ApiEndpoint
                        method="POST"
                        path="/logout"
                        desc="로그아웃. 쿠키 삭제."
                    />
                    <ApiEndpoint
                        method="POST"
                        path="/appfn/api/developer/apps"
                        desc="새 OAuth 앱 등록 신청."
                        color="sky"
                    />
                    <ApiEndpoint
                        method="GET"
                        path="/appfn/api/developer/apps"
                        desc="내 앱 목록 조회."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="py-10 border-t border-surface-200">
                <div className="text-center">
                    <p className="text-ink-500 text-sm mb-4">앱을 등록하고 Client ID와 JWT Secret을 발급받으세요.</p>
                    <button
                        onClick={handleStart}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-colors"
                    >
                        시작하기
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    )
}

/* ── 공통 컴포넌트 ── */

function CodeBlock({ children }: { children: string }) {
    return (
        <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto">
            <pre className="text-[13px] leading-relaxed font-mono">
                <code>{children}</code>
            </pre>
        </div>
    )
}

function ClaimRow({ claim, type, desc, example }: { claim: string; type: string; desc: string; example: string }) {
    return (
        <tr>
            <td className="px-4 py-2.5 font-mono text-[13px] text-primary">{claim}</td>
            <td className="px-4 py-2.5 text-ink-500 text-[13px]">{type}</td>
            <td className="px-4 py-2.5 text-ink-500">{desc}</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-ink-300">{example}</td>
        </tr>
    )
}

function FlowStep({ num, title, desc }: { num: number; title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-7 h-7 bg-ink text-white rounded-full flex items-center justify-center text-xs font-bold">
                {num}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="text-ink-300 text-sm mt-0.5">{desc}</p>
            </div>
        </div>
    )
}

function ApiEndpoint({
    method,
    path,
    desc,
}: {
    method: string
    path: string
    desc: React.ReactNode
    color?: 'emerald' | 'sky'
}) {
    const isPost = method === 'POST' || method === 'PUT' || method === 'DELETE'
    const badgeColor = isPost ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'

    return (
        <div className="bg-white rounded-lg border border-surface-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>{method}</span>
                <code className="text-[13px] font-mono text-ink">{path}</code>
            </div>
            <p className="text-ink-300 text-xs">{desc}</p>
        </div>
    )
}
