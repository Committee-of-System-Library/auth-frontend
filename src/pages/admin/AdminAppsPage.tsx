import { useEffect, useState } from 'react'
import { Clock, CheckCircle, Pause, X, Copy, Eye, EyeOff } from 'lucide-react'
import { authApi, type ClientApplication, type AppApproveResponse } from '@/shared/api/auth.api'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

const tabs = [
    { label: '승인 대기', value: 'PENDING', icon: Clock },
    { label: '승인됨', value: 'APPROVED', icon: CheckCircle },
    { label: '정지됨', value: 'SUSPENDED', icon: Pause },
] as const

type TabValue = typeof tabs[number]['value']

export default function AdminAppsPage() {
    const [activeTab, setActiveTab] = useState<TabValue>('PENDING')
    const [apps, setApps] = useState<ClientApplication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [approveResult, setApproveResult] = useState<AppApproveResponse | null>(null)
    const [secretVisible, setSecretVisible] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const fetchApps = async (status: TabValue) => {
        setIsLoading(true)
        try {
            const list = await authApi.adminApps.list(status)
            setApps(list)
        } catch {
            setApps([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchApps(activeTab)
    }, [activeTab])

    const handleApprove = async (id: number) => {
        try {
            const result = await authApi.adminApps.approve(id)
            setApproveResult(result)
            setSecretVisible(false)
            fetchApps(activeTab)
        } catch (e) {
            alert(e instanceof Error ? e.message : '승인 실패')
        }
    }

    const handleReject = async (id: number) => {
        const reason = prompt('거절 사유를 입력하세요 (선택):')
        try {
            await authApi.adminApps.reject(id, reason || undefined)
            fetchApps(activeTab)
        } catch (e) {
            alert(e instanceof Error ? e.message : '거절 실패')
        }
    }

    const handleSuspend = async (id: number) => {
        if (!confirm('이 클라이언트를 정지하시겠습니까?')) return
        try {
            await authApi.adminApps.suspend(id)
            fetchApps(activeTab)
        } catch (e) {
            alert(e instanceof Error ? e.message : '정지 실패')
        }
    }

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    return (
        <div className="animate-fade-up">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-ink">클라이언트 관리</h1>
                <p className="text-ink-300 text-sm mt-1">OAuth 클라이언트 신청을 검토하고 관리합니다.</p>
            </div>

            {/* 탭 */}
            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.value
                                ? 'bg-primary text-white shadow-card'
                                : 'bg-white shadow-card text-ink-500 hover:text-primary hover:bg-primary-50'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="py-12">
                    <LoadingSpinner message="로딩 중..." size="md" />
                </div>
            ) : apps.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card p-6 text-center">
                    <p className="text-ink-300 text-sm">클라이언트 신청이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {apps.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl shadow-card p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-ink">{app.appName}</h3>
                                    {app.description && (
                                        <p className="text-xs text-ink-300 mt-0.5">{app.description}</p>
                                    )}
                                    {app.homepageUrl && (
                                        <p className="text-xs text-ink-200 mt-1">{app.homepageUrl}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {activeTab === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(app.id)}
                                                className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                                            >
                                                승인
                                            </button>
                                            <button
                                                onClick={() => handleReject(app.id)}
                                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                거절
                                            </button>
                                        </>
                                    )}
                                    {activeTab === 'APPROVED' && (
                                        <button
                                            onClick={() => handleSuspend(app.id)}
                                            className="px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            정지
                                        </button>
                                    )}
                                </div>
                            </div>

                            {app.clientId && (
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-xs text-ink-300">Client ID:</span>
                                    <code className="text-xs bg-surface-50 px-2 py-0.5 rounded font-mono text-ink-500">
                                        {app.clientId}
                                    </code>
                                </div>
                            )}

                            <div className="mt-2 text-xs text-ink-200">
                                Redirect URIs: {(() => {
                                    try { return JSON.parse(app.redirectUris).join(', ') }
                                    catch { return app.redirectUris }
                                })()}
                            </div>

                            <div className="text-xs text-ink-200 mt-1">
                                등록일: {new Date(app.createdAt).toLocaleDateString('ko-KR')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 승인 결과 모달 */}
            {approveResult && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-ink">클라이언트 승인 완료</h2>
                            <button
                                onClick={() => setApproveResult(null)}
                                className="text-ink-300 hover:text-ink"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                            아래 정보는 이 화면에서만 확인할 수 있습니다. 반드시 안전한 곳에 저장하세요.
                        </p>

                        <div className="space-y-3">
                            <SecretField
                                label="Client ID"
                                value={approveResult.clientId}
                                copied={copiedField === 'clientId'}
                                onCopy={() => copyToClipboard(approveResult.clientId, 'clientId')}
                            />
                            <SecretField
                                label="Client Secret"
                                value={approveResult.clientSecret}
                                copied={copiedField === 'clientSecret'}
                                onCopy={() => copyToClipboard(approveResult.clientSecret, 'clientSecret')}
                                hideable
                                visible={secretVisible}
                                onToggle={() => setSecretVisible(!secretVisible)}
                            />
                            <SecretField
                                label="JWT Secret (HMAC-SHA256)"
                                value={approveResult.jwtSecret}
                                copied={copiedField === 'jwtSecret'}
                                onCopy={() => copyToClipboard(approveResult.jwtSecret, 'jwtSecret')}
                                hideable
                                visible={secretVisible}
                                onToggle={() => setSecretVisible(!secretVisible)}
                            />
                        </div>

                        <button
                            onClick={() => setApproveResult(null)}
                            className="mt-6 w-full py-2.5 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink-700 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SecretField({
    label,
    value,
    copied,
    onCopy,
    hideable,
    visible,
    onToggle,
}: {
    label: string
    value: string
    copied: boolean
    onCopy: () => void
    hideable?: boolean
    visible?: boolean
    onToggle?: () => void
}) {
    const displayValue = hideable && !visible ? '••••••••••••••••' : value
    return (
        <div>
            <span className="text-xs font-medium text-ink-300">{label}</span>
            <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-xs bg-surface-50 px-3 py-2 rounded font-mono text-ink-500 break-all">
                    {displayValue}
                </code>
                {hideable && onToggle && (
                    <button onClick={onToggle} className="text-ink-300 hover:text-ink" title="보기/숨기기">
                        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
                <button onClick={onCopy} className="text-ink-300 hover:text-ink" title="복사">
                    <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-xs text-emerald-500">복사됨</span>}
            </div>
        </div>
    )
}
