/**
 * 에러 코드 타입 정의
 */
export type ErrorCode =
    | 'unauthorized_domain'
    | 'consent_required'
    | 'session_expired'
    | 'network_error'
    | 'invalid_redirect'
    | 'session_failed'
    | 'state_mismatch'

/**
 * 에러 메시지 인터페이스
 */
export interface ErrorMessage {
    title: string
    description: string
}

