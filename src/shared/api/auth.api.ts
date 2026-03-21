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

/** 클라이언트 앱 */
export type ClientApplication = {
    id: number
    appName: string
    description: string
    clientId: string | null
    redirectUris: string
    homepageUrl: string | null
    ownerId: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
    rejectionReason: string | null
    createdAt: string
    updatedAt: string
}

/** 앱 등록 요청 */
export type AppRegisterRequest = {
    appName: string
    description: string
    redirectUris: string[]
    homepageUrl: string
}

/** 앱 승인 응답 */
export type AppApproveResponse = {
    id: number
    clientId: string
    clientSecret: string
    jwtSecret: string
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

    developerApps: {
        list: () => authHttp<ClientApplication[]>("/appfn/api/developer/apps"),
        create: (body: AppRegisterRequest) =>
            authHttp<ClientApplication>("/appfn/api/developer/apps", {
                method: "POST",
                body: JSON.stringify(body),
            }),
        delete: (id: number) =>
            authHttp<void>(`/appfn/api/developer/apps/${id}`, { method: "DELETE" }),
    },

    adminApps: {
        list: (status?: string) =>
            authHttp<ClientApplication[]>(
                `/appfn/api/admin/apps${status ? `?status=${status}` : ''}`
            ),
        approve: (id: number) =>
            authHttp<AppApproveResponse>(`/appfn/api/admin/apps/${id}/approve`, { method: "PUT" }),
        reject: (id: number, reason?: string) =>
            authHttp<ClientApplication>(`/appfn/api/admin/apps/${id}/reject`, {
                method: "PUT",
                body: JSON.stringify(reason ? { reason } : {}),
            }),
        suspend: (id: number) =>
            authHttp<ClientApplication>(`/appfn/api/admin/apps/${id}/suspend`, { method: "PUT" }),
    },
}
