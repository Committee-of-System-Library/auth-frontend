import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ERROR_MESSAGES, type ErrorCode } from './constants/errorMessages'
import { ROUTES, QUERY_PARAMS } from '@/shared/constants/routes'
import PageContainer from '@/shared/components/PageContainer'

const DEFAULT_ERROR_CODE: ErrorCode = 'network_error'

export default function ErrorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isDev = import.meta.env.DEV

  const errorCode = (searchParams.get(QUERY_PARAMS.CODE) || DEFAULT_ERROR_CODE) as ErrorCode
  const errorMessage = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[DEFAULT_ERROR_CODE]

  // 디버그 정보
  const redirect = searchParams.get(QUERY_PARAMS.REDIRECT) || ''
  const requestId = searchParams.get(QUERY_PARAMS.REQUEST_ID) || ''
  const timestamp = new Date().toISOString()

  const handleRetryLogin = () => {
    navigate(ROUTES.HOME)
  }

  const handleGoToMain = () => {
    navigate(ROUTES.HOME)
  }

  return (
    <PageContainer maxWidth="2xl">
      {/* 에러 아이콘 및 제목 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-primary text-xl lg:text-2xl font-bold mb-2">
          {errorMessage.title}
        </h2>
        <p className="text-gray-600 text-center text-sm lg:text-base">
          {errorMessage.description}
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <Button onClick={handleRetryLogin} className="w-full sm:w-auto">
          다시 로그인
        </Button>
        <Button variant="secondary" onClick={handleGoToMain} className="w-full sm:w-auto">
          메인으로
        </Button>
      </div>

      {/* 개발 모드 디버그 정보 */}
      {isDev && (redirect || requestId) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">개발 모드 디버그 정보</p>
          <div className="space-y-1 text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded">
            {redirect && (
              <div>
                <span className="text-gray-500">redirect:</span> {redirect}
              </div>
            )}
            {requestId && (
              <div>
                <span className="text-gray-500">requestId:</span> {requestId}
              </div>
            )}
            <div>
              <span className="text-gray-500">timestamp:</span> {timestamp}
            </div>
            <div>
              <span className="text-gray-500">errorCode:</span> {errorCode}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
