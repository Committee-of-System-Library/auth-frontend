import { http } from "./http"
import { authHttp } from "./authHttp"

export type MeResponse = {
    authenticated: boolean
    email?: string
    role?: string
    needsConsent?: boolean
}

/** 회원가입 요청 - API 필드명 studentNumber */
export type SignupRequest = {
    studentNumber: string
    major: string
    grade: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "OTHERS"
}

export type SignupResponse = {
    studentId: number
}

/**
 * Auth Server POST /logout. 204 No Content.
 * 로그아웃 후 쿠키 삭제되므로 호출 후 로그인 페이지로 이동하면 됨.
 */
export const authApi = {
    me: () => http<MeResponse>("/api/auth/me"),
    logout: () => authHttp<void>("/logout", { method: "POST" }),
    signup: (body: SignupRequest) =>
        authHttp<SignupResponse>("/signup", {
            method: "POST",
            body: JSON.stringify(body),
        }),
}