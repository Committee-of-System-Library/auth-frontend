/**
 * 애플리케이션 라우트 경로 상수
 */
export const ROUTES = {
    LOGIN: '/login',
    AUTH_CALLBACK: '/auth/callback',
    CONSENT: '/consent',
    ERROR: '/error',
    SIGNUP_FORM: '/signup',
    DEVELOPER: '/developer',
    DEVELOPER_APPS: '/developer/apps',
    DEVELOPER_APPS_NEW: '/developer/apps/new',
    ADMIN: '/admin',
} as const

/**
 * 쿼리 파라미터 이름 상수
 */
export const QUERY_PARAMS = {
    REDIRECT: 'redirect',
    CODE: 'code',
    REQUEST_ID: 'requestId',
    STATE: 'state',
} as const
