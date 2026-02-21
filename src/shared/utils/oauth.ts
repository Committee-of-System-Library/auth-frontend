/**
 * OAuth 로그인 리다이렉트용 state 저장 키
 */
export const OAUTH_STATE_KEY = 'oauth_state'

const AUTH_SERVER_BASE_URL = import.meta.env.VITE_AUTH_SERVER_BASE_URL as string
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL as string
/** 로그인 시작 경로. Keycloak은 예: /realms/REALM명/protocol/openid-connect/auth */
const AUTH_LOGIN_PATH = (import.meta.env.VITE_AUTH_LOGIN_PATH as string) || '/login'

function getAuthServerBaseUrl(): string {
  const url = AUTH_SERVER_BASE_URL?.trim()
  if (!url) {
    throw new Error(
      'VITE_AUTH_SERVER_BASE_URL이 설정되지 않았습니다. .env.local에 VITE_AUTH_SERVER_BASE_URL을 넣고 개발 서버를 다시 실행해 주세요.'
    )
  }
  return url.replace(/\/$/, '') // 끝 슬래시 제거
}

function getLoginPath(): string {
  const path = (AUTH_LOGIN_PATH && AUTH_LOGIN_PATH.trim()) || '/login'
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * 랜덤 state 문자열 생성 후 sessionStorage에 저장하고, 그 state를 반환한다.
 */
export function saveOAuthState(): string {
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  return state
}

/**
 * OAuth 로그인 URL을 생성한다.
 * redirect_uri = FRONTEND_BASE_URL + '/callback'
 */
export function buildOAuthLoginUrl(): string {
  const baseUrl = getAuthServerBaseUrl()
  const loginPath = getLoginPath()
  const state = saveOAuthState()
  const frontendOrigin = (FRONTEND_BASE_URL && FRONTEND_BASE_URL.trim()) || window.location.origin
  const redirectUri = `${frontendOrigin.replace(/\/$/, '')}/callback`
  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    state,
  })
  return `${baseUrl}${loginPath}?${params.toString()}`
}

/**
 * 저장된 OAuth state를 읽어 반환한다. 없으면 null.
 */
export function getStoredOAuthState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_KEY)
}

/**
 * 저장된 OAuth state를 제거한다.
 */
export function clearOAuthState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY)
}
