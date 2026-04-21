import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from './components/DeveloperLayout'
import DocsShell from './_docs/DocsShell'
import DocsHero from './_docs/DocsHero'
import CodeBlock from './_docs/CodeBlock'
import Callout from './_docs/Callout'
import { H2, P, InlineCode } from './_docs/atoms'

export default function DeveloperQuickstartPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/quickstart">
            <DocsHero
                eyebrow="§ 01 · 시작하기"
                title="Quickstart"
                lede="Spring Boot 프로젝트에 SSO 를 5 분 안에 연결합니다. 이미 컴학 Google Workspace 계정으로 로그인 흐름이 완성돼 있어, Starter 의존성과 2 줄의 설정만 있으면 됩니다."
                meta={[
                    { label: 'Reading', value: '5 min' },
                    { label: 'Stack', value: 'Spring Boot 3+' },
                ]}
            />

            <H2 id="step-1">1. 앱 등록</H2>
            <P>
                <InlineCode>/developer/apps/new</InlineCode> 에서 앱을 등록하고 관리자 승인을 받으면 Client ID 와
                Client Secret 이 발급됩니다. Secret 은 한 번만 표시되므로 안전한 곳에 보관하세요.
            </P>

            <Callout variant="info" title="Redirect URI">
                등록 시 설정한 redirect URI 로만 토큰이 전달됩니다. 운영/개발 URI 를 모두 미리 등록해두세요.
            </Callout>

            <H2 id="step-2">2. 의존성 추가</H2>
            <CodeBlock filename="build.gradle">{`repositories {
    mavenCentral()
    maven {
        url = uri("https://maven.pkg.github.com/Committee-of-System-Library/knu-cse-sso-spring-boot-starter")
        credentials {
            username = System.getenv("GITHUB_ACTOR")
            password = System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    implementation 'kr.ac.knu.cse:knu-cse-sso-spring-boot-starter:1.2.0'
}`}</CodeBlock>

            <H2 id="step-3">3. 설정 주입</H2>
            <CodeBlock filename="application.yml">{`knu-cse:
  sso:
    client-id: \${KNU_CSE_SSO_CLIENT_ID}
    client-secret: \${KNU_CSE_SSO_CLIENT_SECRET}`}</CodeBlock>

            <H2 id="step-4">4. 컨트롤러에서 사용자 꺼내기</H2>
            <CodeBlock filename="MeController.java">{`@RestController
public class MeController {

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal KnuCseUser user) {
        return Map.of(
            "name", user.getName(),
            "email", user.getEmail(),
            "studentNumber", user.getStudentNumber(),
            "role", user.getRole()
        );
    }
}`}</CodeBlock>

            <H2 id="step-5">5. 프론트에서 로그인 트리거</H2>
            <CodeBlock filename="login.ts" lang="typescript">{`const state = crypto.randomUUID()
sessionStorage.setItem('sso_state', state)

const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SSO_CLIENT_ID,
    redirect_uri: 'https://myapp.example.com/callback',
    state,
})

window.location.href = \`https://chcse.knu.ac.kr/appfn/api/login?\${params}\``}</CodeBlock>

            <Callout variant="tip" title="다음 단계">
                SSO 플로우의 전체 시퀀스가 궁금하면 <b>SSO 로그인 플로우</b> 페이지로, 다른 언어로 JWT 를 검증하고 싶으면 <b>수동 JWT 검증</b> 페이지로 이동하세요.
            </Callout>
        </DocsShell>
    )
}
