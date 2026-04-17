import { authHttp } from "./authHttp"

export type SnackEventStatus = 'OPEN' | 'CLOSED'

export type SnackEvent = {
    id: number
    name: string
    semester: string
    requiresPayment: boolean
    status: SnackEventStatus
    openedAt: string
    closedAt: string | null
    openedByStudentNumber: string | null
    handoutCount: number
}

export type SnackHandout = {
    id: number
    studentNumber: string
    name: string
    major: string | null
    receivedAt: string
}

export type HandoutResult = 'OK' | 'DUPLICATE' | 'UNPAID' | 'NOT_FOUND'

export type HandoutScanResult = {
    result: HandoutResult
    studentNumber: string
    name: string | null
    major: string | null
    paid: boolean | null
    receivedAt: string | null
}

export type SnackEventCreateRequest = {
    name: string
    semester: string
    requiresPayment: boolean
}

const BASE = "/appfn/api/admin/snacks"

function getAuthBaseUrl(): string {
    const url = (import.meta.env.VITE_AUTH_SERVER_BASE_URL as string)?.trim()
    if (!url) {
        throw new Error("VITE_AUTH_SERVER_BASE_URL이 설정되지 않았습니다.")
    }
    return url.replace(/\/$/, "")
}

export const snackApi = {
    suggestSemester: () =>
        authHttp<{ semester: string }>(`${BASE}/semester-suggestion`),

    create: (body: SnackEventCreateRequest) =>
        authHttp<SnackEvent>(`${BASE}/events`, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    list: (status?: SnackEventStatus) =>
        authHttp<SnackEvent[]>(
            `${BASE}/events${status ? `?status=${status}` : ''}`
        ),

    get: (id: number) => authHttp<SnackEvent>(`${BASE}/events/${id}`),

    listHandouts: (id: number) =>
        authHttp<SnackHandout[]>(`${BASE}/events/${id}/handouts`),

    handout: (id: number, studentNumber: string) =>
        authHttp<HandoutScanResult>(`${BASE}/events/${id}/handouts`, {
            method: "POST",
            body: JSON.stringify({ studentNumber }),
        }),

    close: (id: number) =>
        authHttp<SnackEvent>(`${BASE}/events/${id}/close`, { method: "POST" }),

    /**
     * Excel 다운로드 — JSON이 아닌 binary blob이라 authHttp 우회.
     * credentials include + 직접 fetch.
     */
    downloadXlsx: async (event: SnackEvent) => {
        const baseUrl = getAuthBaseUrl()
        const res = await fetch(`${baseUrl}${BASE}/events/${event.id}/export.xlsx`, {
            method: "GET",
            credentials: "include",
        })
        if (!res.ok) {
            throw new Error(`다운로드 실패: ${res.status}`)
        }
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${event.name}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    },
}
