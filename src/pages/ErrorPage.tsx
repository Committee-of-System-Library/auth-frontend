import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ERROR_MESSAGES } from './error/constants/errorMessages'

type ErrorCode =
  | 'unauthorized_domain'
  | 'consent_required'
  | 'session_expired'
  | 'network_error'
  | 'invalid_redirect'
  | 'session_failed'

export default function ErrorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isDev = import.meta.env.DEV

  const errorCode = (searchParams.get('code') || 'network_error') as ErrorCode
  const errorMessage = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.network_error

  // 디버그 정보
  const redirect = searchParams.get('redirect') || ''
  const requestId = searchParams.get('requestId') || ''
  const timestamp = new Date().toISOString()

  const handleRetryLogin = () => {
    navigate('/')
  }

  const handleGoToMain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white lg:px-24 py-8">
      <div className="w-full max-w-2xl p-6 lg:p-10 flex flex-col">
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
          <button
            onClick={handleRetryLogin}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            다시 로그인
          </button>
          <button
            onClick={handleGoToMain}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            메인으로
          </button>
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
      </div>
    </div>
  )
}
