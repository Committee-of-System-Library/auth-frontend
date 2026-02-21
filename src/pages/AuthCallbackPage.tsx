import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, QUERY_PARAMS } from '@/shared/constants/routes'
import { getStoredOAuthState, clearOAuthState } from '@/shared/utils/oauth'
import PageContainer from '@/shared/components/PageContainer'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stateFromQuery = searchParams.get(QUERY_PARAMS.STATE)
    const storedState = getStoredOAuthState()

    if (!stateFromQuery || !storedState || stateFromQuery !== storedState) {
      navigate(`${ROUTES.ERROR}?code=state_mismatch`)
      return
    }

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
