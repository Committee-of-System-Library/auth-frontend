import { ArrowRight } from 'lucide-react'
import { buildOAuthLoginUrl, INTERNAL_CLIENT_ID } from '@/shared/utils/oauth'

export default function DeveloperLandingPage() {

    const handleLogin = () => {
        const url = buildOAuthLoginUrl({
            clientId: INTERNAL_CLIENT_ID,
            returnPath: '/developer/apps',
        })
        window.location.href = url
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
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-colors"
                    >
                        로그인하고 시작하기
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                        href="#quickstart"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-300 text-ink-700 rounded-lg text-sm font-medium hover:bg-surface-50 transition-colors"
                    >
                        문서 보기
                    </a>
                </div>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">Quick Start</h2>
                <p className="text-ink-300 text-sm mb-6">Spring Boot 프로젝트에 의존성을 추가하고 설정하세요.</p>

                <div className="space-y-6">
                    {/* Step 1: Gradle */}
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            1. 의존성 추가
                        </h3>
                        <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-[13px] leading-relaxed font-mono"><code>{`// build.gradle.kts
repositories {
    maven { url = uri("https://maven.pkg.github.com/knu-cse/sso-spring-boot-starter") }
}

dependencies {
    implementation("kr.ac.knu.cse:sso-spring-boot-starter:1.0.0")
}`}</code></pre>
                        </div>
                    </div>

                    {/* Step 2: application.yml */}
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            2. application.yml 설정
                        </h3>
                        <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-[13px] leading-relaxed font-mono"><code>{`cse:
  sso:
    client-id: \${CLIENT_ID}
    client-secret: \${CLIENT_SECRET}
    auth-server-url: https://auth.chcse.knu.ac.kr`}</code></pre>
                        </div>
                    </div>

                    {/* Step 3: 사용 */}
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wider mb-2">
                            3. 사용
                        </h3>
                        <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-[13px] leading-relaxed font-mono"><code>{`@RestController
class UserController(
    private val ssoUser: SsoUser  // 자동 주입
) {
    @GetMapping("/me")
    fun me() = ssoUser.email  // JWT에서 추출
}`}</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* JWT Claims */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">JWT Claims</h2>
                <p className="text-ink-300 text-sm mb-6">SSO 토큰에 포함되는 클레임 명세입니다.</p>

                <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-200 bg-surface-50">
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">Claim</th>
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">설명</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">sub</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">사용자 고유 ID</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">email</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">@knu.ac.kr 이메일</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">role</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">ADMIN | USER</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">student_number</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">학번 (10자리)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">major</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">전공</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">grade</td>
                                <td className="px-4 py-2.5 text-ink-500">string</td>
                                <td className="px-4 py-2.5 text-ink-500">FIRST | SECOND | THIRD | FOURTH | OTHERS</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">iat</td>
                                <td className="px-4 py-2.5 text-ink-500">number</td>
                                <td className="px-4 py-2.5 text-ink-500">토큰 발급 시각 (Unix)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">exp</td>
                                <td className="px-4 py-2.5 text-ink-500">number</td>
                                <td className="px-4 py-2.5 text-ink-500">토큰 만료 시각 (Unix)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* API Reference */}
            <section className="py-10 border-t border-surface-200">
                <h2 className="text-lg font-bold text-ink mb-1">API Reference</h2>
                <p className="text-ink-300 text-sm mb-6">Auth Server가 제공하는 주요 엔드포인트입니다.</p>

                <div className="space-y-3">
                    <div className="bg-white rounded-lg border border-surface-200 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">GET</span>
                            <code className="text-[13px] font-mono text-ink">/login</code>
                        </div>
                        <p className="text-ink-300 text-xs">OAuth 로그인 시작. <code className="text-ink-500">client_id</code>, <code className="text-ink-500">redirect_uri</code>, <code className="text-ink-500">state</code> 파라미터 필요.</p>
                    </div>
                    <div className="bg-white rounded-lg border border-surface-200 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">GET</span>
                            <code className="text-[13px] font-mono text-ink">/api/auth/me</code>
                        </div>
                        <p className="text-ink-300 text-xs">현재 인증 상태 확인. 쿠키 기반 세션.</p>
                    </div>
                    <div className="bg-white rounded-lg border border-surface-200 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">POST</span>
                            <code className="text-[13px] font-mono text-ink">/signup</code>
                        </div>
                        <p className="text-ink-300 text-xs">신규 사용자 등록. 학번, 전공, 학년 제출.</p>
                    </div>
                    <div className="bg-white rounded-lg border border-surface-200 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">POST</span>
                            <code className="text-[13px] font-mono text-ink">/logout</code>
                        </div>
                        <p className="text-ink-300 text-xs">로그아웃. 쿠키 삭제.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-10 border-t border-surface-200">
                <div className="text-center">
                    <p className="text-ink-500 text-sm mb-4">앱을 등록하고 client_id를 발급받으세요.</p>
                    <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-colors"
                    >
                        로그인하고 시작하기
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    )
}
