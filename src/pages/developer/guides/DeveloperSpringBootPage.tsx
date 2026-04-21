import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import CodeBlock from '../_docs/CodeBlock'
import Callout from '../_docs/Callout'
import { H2, P, InlineCode } from '../_docs/atoms'

export default function DeveloperSpringBootPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/guides/spring-boot">
            <DocsHero
                eyebrow="§ 03 · 가이드"
                title="Spring Boot Starter"
                lede="knu-cse-sso-spring-boot-starter 1.2.0 을 사용하면 OAuth2 Resource Server 설정과 JWT 검증, 역할 어노테이션이 자동으로 등록됩니다."
                meta={[
                    { label: 'Artifact', value: 'kr.ac.knu.cse:knu-cse-sso-spring-boot-starter' },
                    { label: 'Version', value: '1.2.0' },
                ]}
            />

            <H2 id="dependency">의존성 추가</H2>
            <P>
                GitHub Packages 에 발행되어 있어 <InlineCode>GITHUB_ACTOR</InlineCode>, <InlineCode>GITHUB_TOKEN</InlineCode> (read:packages 권한)
                로 인증이 필요합니다.
            </P>
            <CodeBlock filename="build.gradle">{`repositories {
    mavenCentral()
    maven {
        url = uri("https://maven.pkg.github.com/Committee-of-System-Library/knu-cse-sso-spring-boot-starter")
        credentials {
            username = project.findProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR")
            password = project.findProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    implementation 'kr.ac.knu.cse:knu-cse-sso-spring-boot-starter:1.2.0'
}`}</CodeBlock>

            <H2 id="config">application.yml</H2>
            <P>
                Starter 가 <InlineCode>knu-cse.sso.client-id</InlineCode> 가 있을 때만 자동 설정을 로드합니다. 점(<InlineCode>.</InlineCode>) 이 아니라 하이픈(<InlineCode>-</InlineCode>) 인 것에 주의하세요.
            </P>
            <CodeBlock filename="application.yml">{`knu-cse:
  sso:
    client-id: \${KNU_CSE_SSO_CLIENT_ID}
    client-secret: \${KNU_CSE_SSO_CLIENT_SECRET}`}</CodeBlock>

            <H2 id="security">SecurityConfig</H2>
            <P>
                SecurityFilterChain 의 인가 규칙만 작성하면 됩니다. <InlineCode>KnuCseJwtAuthenticationConverter</InlineCode>,
                <InlineCode>KnuCseRoleInterceptor</InlineCode> 는 Starter 가 자동 등록합니다.
            </P>
            <CodeBlock filename="SecurityConfig.java">{`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            KnuCseJwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {
        return http
            .csrf(c -> c.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
            )
            .build();
    }
}`}</CodeBlock>

            <H2 id="principal">인증된 사용자 사용하기</H2>
            <P>
                JWT 의 클레임이 <InlineCode>KnuCseUser</InlineCode> 로 매핑됩니다. 컨트롤러에서 <InlineCode>@AuthenticationPrincipal</InlineCode> 로 바로 꺼낼 수 있습니다.
            </P>
            <CodeBlock filename="MeController.java">{`@GetMapping("/me")
public Map<String, Object> me(@AuthenticationPrincipal KnuCseUser user) {
    return Map.of(
        "id", user.getId(),
        "name", user.getName(),
        "email", user.getEmail(),
        "studentNumber", user.getStudentNumber(),
        "major", user.getMajor(),
        "userType", user.getUserType(),  // CSE_STUDENT | KNU_OTHER_DEPT | EXTERNAL
        "role", user.getRole()           // ADMIN | EXECUTIVE | ... | STUDENT | null
    );
}`}</CodeBlock>

            <Callout variant="warn" title="Starter 가 제공하는 Bean 을 수동 등록하지 마세요">
                <InlineCode>KnuCseJwtAuthenticationConverter</InlineCode>, <InlineCode>KnuCseRoleInterceptor</InlineCode>, <InlineCode>JwtDecoder</InlineCode> 는 Starter 의 AutoConfiguration 이 이미 등록합니다. 중복 등록은 Bean 충돌을 유발합니다.
            </Callout>

            <Callout variant="info" title="프로퍼티 prefix 는 하이픈">
                <InlineCode>knu-cse.sso</InlineCode> 가 정답입니다. <InlineCode>knu.cse.sso</InlineCode> 는 <b>로드되지 않습니다</b>.
            </Callout>
        </DocsShell>
    )
}
