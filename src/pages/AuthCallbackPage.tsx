import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, QUERY_PARAMS } from '@/shared/constants/routes'
import { getStoredOAuthState, clearOAuthState, getRedirectToCanonicalOriginUrl } from '@/shared/utils/oauth'
import PageContainer from '@/shared/components/PageContainer'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const validatedRef = useRef(false)

  useEffect(() => {
    if (validatedRef.current) return

    const rawFromQuery = searchParams.get(QUERY_PARAMS.STATE)
    const stateFromQuery = rawFromQuery?.trim() ?? ''
    const stateFromStorage = getStoredOAuthState()?.trim() ?? null

    if (!stateFromQuery) {
      navigate(`${ROUTES.ERROR}?code=state_missing`)
      return
    }
    if (!stateFromStorage) {
      // 다른 origin(예: 127.0.0.1)으로 돌아왔을 수 있음 → 캐노니컬(localhost 등)로 한 번 리다이렉트 후 재시도
      const redirectUrl = getRedirectToCanonicalOriginUrl()
      if (redirectUrl) {
        window.location.replace(redirectUrl)
        return
      }
      navigate(`${ROUTES.ERROR}?code=state_storage_lost`)
      return
    }
    if (stateFromQuery !== stateFromStorage) {
      navigate(`${ROUTES.ERROR}?code=state_mismatch`)
      return
    }

    validatedRef.current = true
    clearOAuthState()
    navigate(ROUTES.MAIN)
    setIsLoading(false)
  }, [searchParams, navigate])

  return (
    <PageContainer maxWidth="md" className="items-center justify-center">
      {isLoading ? (
        <LoadingSpinner message="로그인 확인 중..." size="md" />
      ) : (
        <p className="text-gray-600 text-center">리다이렉트 중...</p>
      )}
    </PageContainer>
  )
}
