import { useEffect, useState } from 'react'
import { AppWindow, Plus, Clock, CheckCircle, XCircle, Pause, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authApi, type ClientApplication } from '@/shared/api/auth.api'
import { buildSSOLoginUrl } from '@/shared/utils/oauth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

const statusConfig = {
    PENDING: { label: '승인 대기', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    APPROVED: { label: '승인됨', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    REJECTED: { label: '거절됨', icon: XCircle, color: 'text-red-600 bg-red-50' },
    SUSPENDED: { label: '정지됨', icon: Pause, color: 'text-gray-600 bg-gray-100' },
} as const

export default function DeveloperAppsPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [apps, setApps] = useState<ClientApplication[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const redirectToLogin = () => {
            const url = buildSSOLoginUrl({ returnPath: '/developer/apps' })
            navigate(url)
        }
        authApi.me()
            .then((res) => {
                if (!res.authenticated) {
                    redirectToLogin()
                    return
                }
                return authApi.developerApps.list()
            })
            .then((list) => {
                if (list) setApps(list)
                setIsLoading(false)
            })
            .catch(() => {
                redirectToLogin()
            })
    }, [navigate])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

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

            {apps.length === 0 ? (
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
            ) : (
                <div className="space-y-3">
                    {apps.map((app) => {
                        const status = statusConfig[app.status]
                        const StatusIcon = status.icon
                        return (
                            <div
                                key={app.id}
                                className="bg-white rounded-lg border border-surface-200 p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-ink">
                                            {app.appName}
                                        </h3>
                                        {app.description && (
                                            <p className="text-xs text-ink-300 mt-0.5">
                                                {app.description}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                                    >
                                        <StatusIcon className="w-3 h-3" />
                                        {status.label}
                                    </span>
                                </div>
                                {app.clientId && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-ink-300">Client ID:</span>
                                        <code className="text-xs bg-surface-50 px-2 py-0.5 rounded font-mono text-ink-500">
                                            {app.clientId}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(app.clientId!)}
                                            className="text-ink-200 hover:text-ink transition-colors"
                                            title="복사"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                        {copiedId === app.clientId && (
                                            <span className="text-xs text-emerald-500">복사됨</span>
                                        )}
                                    </div>
                                )}
                                <div className="text-xs text-ink-200 mt-2">
                                    등록일: {new Date(app.createdAt).toLocaleDateString('ko-KR')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
