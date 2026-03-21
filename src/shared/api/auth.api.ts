import { authHttp } from "./authHttp"

export type MeResponse = {
    authenticated: boolean
    email?: string
    role?: string
    needsConsent?: boolean
}

export type VerifyResponse = {
    isCseStudent: boolean
    isKnuEmail: boolean
    email: string
}

/** 회원가입 요청 */
export type SignupRequest = {
    studentNumber: string
    major: string
    userType: 'CSE_STUDENT' | 'KNU_OTHER_DEPT' | 'EXTERNAL'
}

export type SignupResponse = {
    redirectUrl: string | null
}

/**
 * Auth Server POST /logout. 204 No Content.
 * 로그아웃 후 쿠키 삭제되므로 호출 후 로그인 페이지로 이동하면 됨.
 */
export const authApi = {
    me: () => authHttp<MeResponse>("/auth/me"),
    logout: () => authHttp<void>("/logout", { method: "POST" }),
    verifyStudent: (studentNumber: string) =>
        authHttp<VerifyResponse>(`/signup/verify?studentNumber=${encodeURIComponent(studentNumber)}`),
    signup: (body: SignupRequest) =>
        authHttp<SignupResponse>("/signup", {
            method: "POST",
            body: JSON.stringify(body),
        }),
}
