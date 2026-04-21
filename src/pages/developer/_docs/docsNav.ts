export type NavLeaf = {
    label: string
    to: string
    flag?: 'auth' | 'staff'
}

export type NavGroup = {
    title: string
    items: NavLeaf[]
    staffOnly?: boolean
}

export const DOCS_NAV: NavGroup[] = [
    {
        title: '시작하기',
        items: [
            { label: '개요', to: '/developer' },
            { label: 'Quickstart', to: '/developer/quickstart' },
        ],
    },
    {
        title: '가이드',
        items: [
            { label: 'SSO 로그인 플로우', to: '/developer/guides/sso-flow' },
            { label: 'Spring Boot Starter', to: '/developer/guides/spring-boot' },
            { label: '수동 JWT 검증', to: '/developer/guides/manual-jwt' },
            { label: '역할 기반 접근 제어', to: '/developer/guides/rbac' },
        ],
    },
    {
        title: '레퍼런스',
        items: [
            { label: 'JWT Claims', to: '/developer/reference/jwt-claims' },
            { label: 'REST API', to: '/developer/reference/api' },
        ],
    },
    {
        title: '대시보드',
        items: [
            { label: '내 앱', to: '/developer/apps', flag: 'auth' },
            { label: '앱 등록', to: '/developer/apps/new', flag: 'auth' },
        ],
    },
    {
        title: '내부',
        staffOnly: true,
        items: [
            { label: '아키텍처', to: '/developer/architecture', flag: 'staff' },
        ],
    },
]

const flatOrder: { to: string; label: string; group: string }[] = DOCS_NAV.flatMap((g) =>
    g.items.map((i) => ({ to: i.to, label: i.label, group: g.title }))
)

export function adjacentDocs(currentPath: string) {
    const idx = flatOrder.findIndex((d) => d.to === currentPath)
    if (idx === -1) return { prev: null, next: null }
    return {
        prev: idx > 0 ? flatOrder[idx - 1] : null,
        next: idx < flatOrder.length - 1 ? flatOrder[idx + 1] : null,
    }
}
