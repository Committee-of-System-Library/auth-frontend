/**
 * OAuth 로그인 리다이렉트용 state 저장 키
 */
export const OAUTH_STATE_KEY = 'oauth_state'

const AUTH_SERVER_BASE_URL = import.meta.env.VITE_AUTH_SERVER_BASE_URL as string
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL as string

/**
 * 개발 환경에서 localhost와 127.0.0.1은 같은 기기라도 origin이 달라 sessionStorage가 공유되지 않음.
 * VITE_FRONTEND_BASE_URL에 맞춰 한쪽으로만 쓰도록, 다른 쪽으로 접속했을 때 캐노니컬로 리다이렉트할 URL을 반환.
 * 리다이렉트 불필요면 null.
 */
export function getRedirectToCanonicalOriginUrl(): string | null {
  if (import.meta.env.PROD || typeof window === 'undefined') return null
  const base = (FRONTEND_BASE_URL && FRONTEND_BASE_URL.trim()) || ''
  if (!base) return null
  let canonical: string
  try {
    canonical = new URL(base).origin
  } catch {
    return null
  }
  const current = window.location.origin
  if (canonical === current) return null
  const a = new URL(current)
  const b = new URL(canonical)
  if (a.port !== b.port) return null
  const isLocal = (host: string) => host === 'localhost' || host === '127.0.0.1'
  if (!isLocal(a.hostname) || !isLocal(b.hostname)) return null
  return canonical + window.location.pathname + window.location.search + window.location.hash
}

function getAuthServerBaseUrl(): string {
  const url = AUTH_SERVER_BASE_URL?.trim()
  if (!url) {
    throw new Error(
      'VITE_AUTH_SERVER_BASE_URL이 설정되지 않았습니다. .env.local에 VITE_AUTH_SERVER_BASE_URL을 넣고 개발 서버를 다시 실행해 주세요.'
    )
  }
  return url.replace(/\/$/, '') // 끝 슬래시 제거
}

/**
 * 랜덤 state 문자열 생성 후 sessionStorage + localStorage에 저장하고, 그 state를 반환한다.
 * 저장 키: "oauth_state". localStorage는 같은 origin 다른 탭에서 콜백이 열릴 때 대비용.
 */
export function saveOAuthState(): string {
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  try {
    localStorage.setItem(OAUTH_STATE_KEY, state)
  } catch {
    // 일부 환경에서 localStorage 비활성화 시 무시
  }
  return state
}

/**
 * OAuth 로그인 URL을 생성한다.
 * Auth Server /login으로 이동 (서버가 Keycloak으로 302).
 * redirect_uri = 현재 창의 origin + '/auth/callback' (같은 origin으로 돌아와야 sessionStorage 유지)
 *
 * 백엔드 요구사항:
 * - 콜백 시 클라이언트가 이 URL에 담아 보낸 state를 세션에 저장했다가,
 *   로그인 성공 후 redirect_uri로 리다이렉트할 때 ?state=<저장한 값> 그대로 붙여 보내야 함.
 * - redirect_uri로 리다이렉트할 때 반드시 클라이언트가 보낸 redirect_uri와 동일한 URL을 써야 함.
 */
export function buildOAuthLoginUrl(): string {
  const baseUrl = getAuthServerBaseUrl()
  const state = saveOAuthState()
  // 개발: redirect_uri를 .env 기준으로 고정 → main.tsx 캐노니컬 리다이렉트와 맞추어 항상 같은 origin으로 돌아오게 함
  const origin =
    import.meta.env.DEV && FRONTEND_BASE_URL?.trim()
      ? new URL(FRONTEND_BASE_URL.trim()).origin
      : typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : (FRONTEND_BASE_URL && FRONTEND_BASE_URL.trim()) || ''
  const redirectUri = `${origin.replace(/\/$/, '')}/auth/callback`
  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    state,
  })
  return `${baseUrl}/login?${params.toString()}`
}

/**
 * 저장된 OAuth state를 읽어 반환한다. sessionStorage 먼저, 없으면 localStorage (같은 탭/다른 탭 대비).
 */
export function getStoredOAuthState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_KEY) ?? localStorage.getItem(OAUTH_STATE_KEY)
}

/**
 * 저장된 OAuth state를 sessionStorage와 localStorage에서 제거한다.
 */
export function clearOAuthState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  try {
    localStorage.removeItem(OAUTH_STATE_KEY)
  } catch {
    // ignore
  }
}
