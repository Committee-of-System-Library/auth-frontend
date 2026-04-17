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
    major: string | null
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

/** 사용자 (admin) */
export type Student = {
    id: number; name: string; studentNumber: string;
    major: string; grade: string | null; gender: string | null;
    userType: 'CSE_STUDENT' | 'KNU_OTHER_DEPT' | 'EXTERNAL';
    role: 'ADMIN' | 'EXECUTIVE' | 'FINANCE' | 'PLANNING' | 'PR' | 'CULTURE' | 'STUDENT' | null;
    createdAt: string; updatedAt: string;
}

/** 인증 요청 */
export type VerificationRequest = {
    id: number; studentId: number;
    requestedStudentNumber: string;
    evidenceDescription: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewerId: number | null; reviewComment: string | null;
    createdAt: string; reviewedAt: string | null;
}

/** CSE 학생 명단 */
export type CseStudentRegistry = {
    id: number; studentNumber: string; name: string;
    major: string; grade: number; enrollmentStatus: string | null;
    manuallyAdded: boolean; createdAt: string; updatedAt: string;
}

/** CSV 업로드 결과 */
export type RegistryUploadResult = {
    totalRows: number; insertedCount: number;
    updatedCount: number; errorCount: number;
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

    adminUsers: {
        list: () => authHttp<Student[]>("/appfn/api/admin/users"),
        changeRole: (id: number, role: string) =>
            authHttp<void>(`/appfn/api/admin/users/${id}/role`, {
                method: "PUT",
                body: JSON.stringify({ role }),
            }),
        changeUserType: (id: number, userType: string) =>
            authHttp<void>(`/appfn/api/admin/users/${id}/user-type`, {
                method: "PUT",
                body: JSON.stringify({ userType }),
            }),
        delete: (id: number) =>
            authHttp<void>(`/appfn/api/admin/users/${id}`, { method: "DELETE" }),
    },

    adminVerifications: {
        list: (status?: string) =>
            authHttp<VerificationRequest[]>(
                `/appfn/api/admin/verifications${status ? `?status=${status}` : ''}`
            ),
        approve: (id: number, comment?: string) =>
            authHttp<void>(`/appfn/api/admin/verifications/${id}/approve`, {
                method: "PUT",
                body: JSON.stringify(comment ? { comment } : {}),
            }),
        reject: (id: number, comment?: string) =>
            authHttp<void>(`/appfn/api/admin/verifications/${id}/reject`, {
                method: "PUT",
                body: JSON.stringify(comment ? { comment } : {}),
            }),
    },

    adminRegistry: {
        list: () => authHttp<CseStudentRegistry[]>("/appfn/api/admin/registry"),
        upload: (file: File) => {
            const form = new FormData()
            form.append("file", file)
            return authHttp<RegistryUploadResult>("/appfn/api/admin/registry/upload", {
                method: "POST",
                body: form,
            })
        },
        add: (body: { studentNumber: string; name: string; major: string; grade: number; enrollmentStatus?: string }) =>
            authHttp<CseStudentRegistry>("/appfn/api/admin/registry", {
                method: "POST",
                body: JSON.stringify(body),
            }),
        changeEnrollmentStatus: (studentNumber: string, enrollmentStatus: string) =>
            authHttp<CseStudentRegistry>(`/appfn/api/admin/registry/${studentNumber}/enrollment-status`, {
                method: "PUT",
                body: JSON.stringify({ enrollmentStatus }),
            }),
        delete: (studentNumber: string) =>
            authHttp<void>(`/appfn/api/admin/registry/${studentNumber}`, { method: "DELETE" }),
    },
}
