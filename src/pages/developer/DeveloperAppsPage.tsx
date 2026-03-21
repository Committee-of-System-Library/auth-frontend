import { useEffect, useState } from 'react'
import { AppWindow, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/shared/api/auth.api'
import { buildOAuthLoginUrl, INTERNAL_CLIENT_ID } from '@/shared/utils/oauth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function DeveloperAppsPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        authApi.me()
            .then((res) => {
                if (!res.authenticated) {
                    window.location.href = buildOAuthLoginUrl({
                        clientId: INTERNAL_CLIENT_ID,
                        returnPath: '/developer/apps',
                    })
                    return
                }
                setIsLoading(false)
            })
            .catch(() => {
                window.location.href = buildOAuthLoginUrl({
                    clientId: INTERNAL_CLIENT_ID,
                    returnPath: '/developer/apps',
                })
            })
    }, [])

    if (isLoading) {
        return (
            <div className="py-20">
                <LoadingSpinner message="확인 중..." size="md" />
            </div>
        )
    }

    return (
        <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg font-bold text-ink">내 애플리케이션</h1>
                <button
                    onClick={() => navigate('/developer/apps/new')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink text-white rounded-lg text-[13px] font-medium hover:bg-ink-700 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    새 앱
                </button>
            </div>

            {/* 빈 상태 */}
            <div className="border border-surface-200 border-dashed rounded-lg py-16 text-center">
                <AppWindow className="w-8 h-8 text-ink-200 mx-auto mb-3" />
                <p className="text-ink-500 text-sm font-medium mb-1">
                    등록된 애플리케이션이 없습니다
                </p>
                <p className="text-ink-300 text-xs mb-5 max-w-xs mx-auto">
                    SSO 로그인을 프로젝트에 연동하려면 애플리케이션을 등록하세요.
                </p>
                <button
                    onClick={() => navigate('/developer/apps/new')}
                    className="text-primary text-sm font-medium hover:underline"
                >
                    첫 번째 앱 등록하기
                </button>
            </div>
        </div>
    )
}
