/**
 * OAuth 로그인 리다이렉트용 state 저장 키
 */
export const OAUTH_STATE_KEY = 'oauth_state'

/**
 * 로그인 후 돌아갈 경로 저장 키
 */
export const RETURN_PATH_KEY = 'sso_return_path'

/**
 * 내부 SSO 클라이언트 ID (Admin/Developer 콘솔 로그인용)
 */
export const INTERNAL_CLIENT_ID = 'cse-internal'

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
 * 로그인 후 돌아갈 경로를 sessionStorage에 저장한다.
 */
export function saveReturnPath(path: string): void {
  sessionStorage.setItem(RETURN_PATH_KEY, path)
}

/**
 * 저장된 returnPath를 꺼내고 삭제한다.
 */
export function consumeReturnPath(): string | null {
  const path = sessionStorage.getItem(RETURN_PATH_KEY)
  sessionStorage.removeItem(RETURN_PATH_KEY)
  return path
}

function getOrigin(): string {
  const origin =
    import.meta.env.DEV && FRONTEND_BASE_URL?.trim()
      ? new URL(FRONTEND_BASE_URL.trim()).origin
      : typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : (FRONTEND_BASE_URL && FRONTEND_BASE_URL.trim()) || ''
  return origin.replace(/\/$/, '')
}

function getBasePath(): string {
  const basePath = (import.meta.env.VITE_BASE_PATH as string)?.trim()
    ? `/${(import.meta.env.VITE_BASE_PATH as string).replace(/^\/|\/$/g, '')}`
    : ''
  return basePath
}

/**
 * OAuth 로그인 URL을 생성한다.
 * Auth Server /login으로 이동 (서버가 Keycloak으로 302).
 *
 * @param options.clientId - OAuth client_id (내부 로그인 시 'cse-internal')
 * @param options.returnPath - 로그인 후 돌아갈 프론트 경로 (sessionStorage에 저장)
 */
export function buildOAuthLoginUrl(options?: {
  clientId?: string
  returnPath?: string
}): string {
  const baseUrl = getAuthServerBaseUrl()
  const state = saveOAuthState()

  if (options?.returnPath) {
    saveReturnPath(options.returnPath)
  }

  const origin = getOrigin()
  const basePath = getBasePath()
  const redirectUri = `${origin}${basePath}/auth/callback`

  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    state,
  })

  if (options?.clientId) {
    params.set('client_id', options.clientId)
  }

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
