import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { authApi } from '@/shared/api/auth.api'
import { buildOAuthLoginUrl, INTERNAL_CLIENT_ID } from '@/shared/utils/oauth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function DeveloperAppNewPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [appName, setAppName] = useState('')
    const [description, setDescription] = useState('')
    const [homepageUrl, setHomepageUrl] = useState('')
    const [redirectUris, setRedirectUris] = useState<string[]>([''])

    useEffect(() => {
        authApi.me()
            .then((res) => {
                if (!res.authenticated) {
                    window.location.href = buildOAuthLoginUrl({
                        clientId: INTERNAL_CLIENT_ID,
                        returnPath: '/developer/apps/new',
                    })
                    return
                }
                setIsLoading(false)
            })
            .catch(() => {
                window.location.href = buildOAuthLoginUrl({
                    clientId: INTERNAL_CLIENT_ID,
                    returnPath: '/developer/apps/new',
                })
            })
    }, [])

    const addRedirectUri = () => setRedirectUris([...redirectUris, ''])
    const removeRedirectUri = (index: number) =>
        setRedirectUris(redirectUris.filter((_, i) => i !== index))
    const updateRedirectUri = (index: number, value: string) =>
        setRedirectUris(redirectUris.map((uri, i) => (i === index ? value : uri)))

    if (isLoading) {
        return (
            <div className="py-20">
                <LoadingSpinner message="확인 중..." size="md" />
            </div>
        )
    }

    return (
        <div className="animate-fade-up max-w-2xl">
            <button
                onClick={() => navigate('/developer/apps')}
                className="flex items-center gap-1 text-sm text-ink-300 hover:text-ink mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                돌아가기
            </button>

            <div className="mb-8">
                <h1 className="text-lg font-bold text-ink">새 애플리케이션 등록</h1>
                <p className="text-ink-300 text-sm mt-1">
                    SSO 연동을 위한 OAuth 클라이언트를 등록합니다. 관리자 승인 후 사용 가능합니다.
                </p>
            </div>

            <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-6">
                <FormField id="appName" label="앱 이름" required>
                    <input
                        id="appName"
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="예: My Project"
                        className="w-full px-4 py-3 bg-surface-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </FormField>

                <FormField id="description" label="설명">
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="프로젝트에 대한 간단한 설명"
                        rows={3}
                        className="w-full px-4 py-3 bg-surface-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                    />
                </FormField>

                <FormField id="homepageUrl" label="홈페이지 URL">
                    <input
                        id="homepageUrl"
                        type="url"
                        value={homepageUrl}
                        onChange={(e) => setHomepageUrl(e.target.value)}
                        placeholder="https://myapp.example.com"
                        className="w-full px-4 py-3 bg-surface-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </FormField>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                        Redirect URIs <span className="text-danger">*</span>
                    </label>
                    <div className="space-y-2">
                        {redirectUris.map((uri, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    value={uri}
                                    onChange={(e) => updateRedirectUri(index, e.target.value)}
                                    placeholder="https://myapp.example.com/callback"
                                    className="flex-1 px-4 py-3 bg-surface-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                                />
                                {redirectUris.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRedirectUri(index)}
                                        className="px-3 text-ink-200 hover:text-danger transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addRedirectUri}
                        className="flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:text-primary-600 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        URI 추가
                    </button>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/developer/apps')}
                        className="flex-1"
                    >
                        취소
                    </Button>
                    <Button className="flex-1">
                        등록 신청
                    </Button>
                </div>
            </div>
        </div>
    )
}
