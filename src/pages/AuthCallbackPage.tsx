import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../shared/api/auth.api'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateAndRedirect = async () => {
      try {
        // 1. redirect 파라미터 파싱 및 검증
        const redirectUrl = searchParams.get('redirect')

        if (!redirectUrl) {
          navigate('/error?code=invalid_redirect')
          return
        }

        // redirect URL 검증 (같은 origin만 허용)
        // 절대 URL인 경우 같은 origin인지 확인
        if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
          try {
            const redirectUrlObj = new URL(redirectUrl)
            if (redirectUrlObj.origin !== window.location.origin) {
              navigate('/error?code=invalid_redirect')
              return
            }
          } catch {
            navigate('/error?code=invalid_redirect')
            return
          }
        } else if (!redirectUrl.startsWith('/')) {
          // 상대 경로가 아니고 절대 URL도 아닌 경우 거부
          navigate('/error?code=invalid_redirect')
          return
        }
        // 상대 경로(/로 시작)는 허용

        // 2. GET /api/auth/me 호출
        const response = await authApi.me()

        // 3. 분기 처리
        if (response.needsConsent) {
          // 동의 필요 → /consent로 이동
          navigate(`/consent?redirect=${encodeURIComponent(redirectUrl)}`)
        } else {
          // 정상 로그인 → redirect로 이동
          window.location.href = redirectUrl
        }
      } catch (error: any) {
        // 에러 처리
        const errorMessage = error?.message || ''
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          navigate('/error?code=session_failed')
        } else {
          navigate('/error?code=network_error')
        }
      } finally {
        setIsLoading(false)
      }
    }

    validateAndRedirect()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 lg:px-24 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 lg:p-10 flex flex-col items-center justify-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600 text-center">로그인 확인 중...</p>
          </>
        ) : (
          <p className="text-gray-600 text-center">리다이렉트 중...</p>
        )}
      </div>
    </div>
  )
}
