import { HttpError } from "./http"

function getBaseUrl(): string {
    const url = (import.meta.env.VITE_AUTH_SERVER_BASE_URL as string)?.trim()
    if (!url) {
        throw new Error(
            "VITE_AUTH_SERVER_BASE_URL이 설정되지 않았습니다. .env.local에 값을 넣고 개발 서버를 다시 실행해 주세요."
        )
    }
    return url.replace(/\/$/, "")
}

/**
 * Auth Server(8081) 전용 HTTP 요청.
 * credentials 포함, 실패 시 HttpError throw.
 */
export async function authHttp<T>(path: string, init: RequestInit = {}): Promise<T> {
    const baseUrl = getBaseUrl()
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            ...init,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(init.headers ?? {}),
            },
        })

        if (!res.ok) {
            const text = await res.text().catch(() => "")
            throw new HttpError(res.status, text || res.statusText, text)
        }

        if (res.status === 204) {
            return undefined as T
        }
        const contentType = res.headers.get("Content-Type") ?? ""
        if (contentType.includes("application/json")) {
            return (await res.json()) as T
        }
        return undefined as T
    } catch (error) {
        if (error instanceof HttpError) {
            throw error
        }
        throw new Error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}
