/**
 * 애플리케이션 라우트 경로 상수
 */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/',
    AUTH_CALLBACK: '/auth/callback',
    CONSENT: '/consent',
    ERROR: '/error',
    SIGNUP_FORM: '/signup',
    MAIN: '/main',
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

