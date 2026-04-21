import { useOutletContext } from 'react-router-dom'
import type { DeveloperOutletContext } from '../components/DeveloperLayout'
import DocsShell from '../_docs/DocsShell'
import DocsHero from '../_docs/DocsHero'
import CodeTabs from '../_docs/CodeTabs'
import Callout from '../_docs/Callout'
import { H2, P, InlineCode } from '../_docs/atoms'

const SAMPLES = [
    {
        lang: 'js',
        label: 'JavaScript',
        filename: 'verify.ts',
        code: `import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.CLIENT_SECRET!)

export async function verify(token: string) {
    const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        audience: 'cse-a1b2c3d4',
    })
    return payload
}`,
    },
    {
        lang: 'python',
        label: 'Python',
        filename: 'verify.py',
        code: `import jwt  # pip install PyJWT

def verify(token: str, secret: str) -> dict:
    return jwt.decode(
        token,
        secret,
        algorithms=["HS256"],
        audience="cse-a1b2c3d4",
    )`,
    },
    {
        lang: 'node',
        label: 'Node (jsonwebtoken)',
        filename: 'verify.js',
        code: `const jwt = require('jsonwebtoken')

function verify(token, secret) {
    return jwt.verify(token, secret, {
        algorithms: ['HS256'],
        audience: 'cse-a1b2c3d4',
    })
}`,
    },
    {
        lang: 'go',
        label: 'Go (golang-jwt)',
        filename: 'verify.go',
        code: `import "github.com/golang-jwt/jwt/v5"

func Verify(tokenStr, secret string) (jwt.MapClaims, error) {
    token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
        return []byte(secret), nil
    }, jwt.WithValidMethods([]string{"HS256"}), jwt.WithAudience("cse-a1b2c3d4"))
    if err != nil {
        return nil, err
    }
    return token.Claims.(jwt.MapClaims), nil
}`,
    },
]

export default function DeveloperManualJwtPage() {
    const { isStaff } = useOutletContext<DeveloperOutletContext>()

    return (
        <DocsShell isStaff={isStaff} currentPath="/developer/guides/manual-jwt">
            <DocsHero
                eyebrow="§ 04 · 가이드"
                title="수동 JWT 검증"
                lede="Spring Boot 외 언어·프레임워크에서는 발급받은 Client Secret 으로 HS256 서명을 직접 검증하면 됩니다. 라이브러리 사용 예시를 언어별로 정리했습니다."
            />

            <H2 id="verify">언어별 검증 예시</H2>
            <P>
                다음 4 개 필드는 공통으로 확인해야 합니다. <InlineCode>alg=HS256</InlineCode>, <InlineCode>aud=&lt;client_id&gt;</InlineCode>, <InlineCode>exp</InlineCode> (만료), 그리고 서명 유효성.
            </P>

            <CodeTabs samples={SAMPLES} />

            <H2 id="common-mistakes">흔한 실수</H2>
            <Callout variant="warn" title="alg=none 허용 금지">
                토큰 헤더의 <InlineCode>alg</InlineCode> 를 반드시 HS256 으로 고정하세요. 라이브러리가 알고리즘을 자동 추론하게 두면 공격자가 <InlineCode>alg=none</InlineCode> 으로 바이패스할 수 있습니다.
            </Callout>
            <Callout variant="warn" title="audience 검증 누락">
                aud 를 검증하지 않으면 다른 클라이언트용 토큰을 받아들이게 됩니다. 발급받은 Client ID 와 정확히 일치해야 합니다.
            </Callout>
            <Callout variant="tip" title="exp / iat 검증">
                거의 모든 JWT 라이브러리가 기본 활성화이지만, 옵션을 끄지 않았는지 확인하세요. 1 시간 TTL 이 기본값입니다.
            </Callout>
        </DocsShell>
    )
}
