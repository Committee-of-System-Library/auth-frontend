import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import CodeBlock from '../_docs/CodeBlock'
import Callout from '../_docs/Callout'
import { H2, H3, P, InlineCode } from '../_docs/atoms'

const ROLES = [
    { role: 'ADMIN', level: 3, desc: '모든 권한 포함' },
    { role: 'EXECUTIVE', level: 2, desc: '집행부 임원' },
    { role: 'FINANCE', level: 2, desc: '재정 담당' },
    { role: 'PLANNING', level: 2, desc: '기획' },
    { role: 'PR', level: 2, desc: '홍보' },
    { role: 'CULTURE', level: 2, desc: '문화' },
    { role: 'STUDENT', level: 1, desc: '일반 학생' },
]

export default function DeveloperRbacPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/guides/rbac">
            <DocsHero
                eyebrow="§ 05 · 가이드"
                title="역할 기반 접근 제어"
                lede="플랫폼 전체에 공통 적용되는 역할 계층과, Spring Boot Starter 가 제공하는 어노테이션. JWT 에 포함된 role 클레임을 기반으로 엔드포인트를 보호합니다."
            />

            <H2 id="hierarchy">역할 계층</H2>
            <P>
                역할은 레벨로 비교됩니다. 상위 레벨은 하위 레벨의 모든 권한을 자동 포함합니다.
            </P>

            <div className="my-6 border border-surface-200 bg-white rounded-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-ink bg-surface-50">
                            <th className="text-left px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase text-ink-500">
                                Role
                            </th>
                            <th className="text-left px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase text-ink-500">
                                Level
                            </th>
                            <th className="text-left px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase text-ink-500">
                                설명
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ROLES.map((r) => (
                            <tr key={r.role} className="border-b border-surface-200 last:border-0 hover:bg-surface-50">
                                <td className="px-4 py-2.5 font-mono text-[13px] text-ink font-semibold">{r.role}</td>
                                <td className="px-4 py-2.5 font-mono text-[13px] text-primary">{r.level}</td>
                                <td className="px-4 py-2.5 text-[13.5px] text-ink-500">{r.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Callout variant="info" title="UserType 은 별도 차원">
                <InlineCode>userType</InlineCode> (CSE_STUDENT / KNU_OTHER_DEPT / EXTERNAL) 은 Role 과 독립적인 차원입니다.
                학부생 전용 리소스 보호에는 <InlineCode>@RequireCseStudent</InlineCode> 를 쓰세요.
            </Callout>

            <H2 id="annotations">어노테이션</H2>

            <H3 id="annotation-require-role">@RequireRole</H3>
            <P>메서드 또는 클래스 레벨에 붙여 최소 필요 레벨을 선언합니다.</P>
            <CodeBlock filename="AdminController.java">{`@RestController
@RequireRole(Role.ADMIN)
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public AdminDashboard dashboard() { ... }

    // 더 낮은 역할로 완화 — 메서드 레벨이 우선
    @GetMapping("/overview")
    @RequireRole(Role.EXECUTIVE)
    public Overview overview() { ... }
}`}</CodeBlock>

            <H3 id="annotation-require-cse">@RequireCseStudent</H3>
            <P>UserType 이 CSE_STUDENT 인 사용자만 허용합니다. Role 과 독립적으로 동작합니다.</P>
            <CodeBlock filename="CseResourceController.java">{`@GetMapping("/cse/resources")
@RequireCseStudent
public List<Resource> forCseOnly(@AuthenticationPrincipal KnuCseUser user) {
    return resourceService.findAll(user.getStudentNumber());
}`}</CodeBlock>

            <H2 id="precedence">우선 순위</H2>
            <P>
                클래스 레벨과 메서드 레벨 어노테이션이 모두 있으면 <b>메서드 레벨이 우선</b>합니다. 클래스 전체는 ADMIN 으로 막고 일부만 완화하는 패턴을 주로 씁니다.
            </P>

            <Callout variant="warn" title="프론트 체크는 UX, 서버 체크가 진짜">
                프론트에서 역할로 메뉴를 숨기는 건 UX 향상일 뿐입니다. 실제 접근 제어는 반드시 서버의 <InlineCode>@RequireRole</InlineCode> 에 맡기세요.
            </Callout>
        </DocsShell>
    )
}
