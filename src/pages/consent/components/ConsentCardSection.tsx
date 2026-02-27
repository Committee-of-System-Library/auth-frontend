import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ConsentAgreementItem from './ConsentAgreementItem'
import { Button } from '@/components/ui/button'
import { CONSENT_ITEMS } from '@/pages/consent/constants/consentContent'
import { ROUTES } from '@/shared/constants/routes'
import { authApi } from '@/shared/api/auth.api'
import { HttpError } from '@/shared/api/http'
import type { SignupFormData } from '@/pages/signup/types'

export default function ConsentCardSection() {
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData as SignupFormData | undefined
    const isSignupFlow = !!formData

    const [termsAgreed, setTermsAgreed] = useState(false)
    const [privacyAgreed, setPrivacyAgreed] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleContinue = async () => {
        if (!termsAgreed || !privacyAgreed) return

        if (isSignupFlow && formData) {
            setSubmitError(null)
            setIsSubmitting(true)
            try {
                await authApi.signup({
                    studentNumber: formData.studentId,
                    major: formData.major,
                    grade: formData.grade,
                })
                navigate(ROUTES.MAIN)
            } catch (err) {
                let message = '회원가입에 실패했습니다. 다시 시도해 주세요.'
                if (err instanceof HttpError && err.responseText) {
                    try {
                        const body = JSON.parse(err.responseText) as { message?: string }
                        if (body.message) message = body.message
                    } catch {
                        // ignore
                    }
                }
                setSubmitError(message)
            } finally {
                setIsSubmitting(false)
            }
        } else {
            navigate(ROUTES.HOME)
        }
    }

    const isContinueEnabled = termsAgreed && privacyAgreed

    const agreementStates = {
        terms: termsAgreed,
        privacy: privacyAgreed,
    }

    const agreementSetters = {
        terms: setTermsAgreed,
        privacy: setPrivacyAgreed,
    }

    return (
        <div className="w-full max-w-md lg:max-w-xl bg-white rounded-2xl shadow-md p-6 lg:p-10 flex flex-col">
            {/* 상단 영역 */}
            <div>
                {/* CONSENT 타이틀 */}
                <div className="mb-2 flex items-center justify-center">
                    <h2 className="text-primary text-lg lg:text-2xl font-bold whitespace-nowrap">
                        회원가입 필수 약관 동의
                    </h2>
                </div>
                <p className="text-xs text-gray-600 text-center mb-4 space-y-1">
                    <span className="block">
                        자세한 약관 전문은 아래 링크에서 확인하실 수 있습니다.
                    </span>
                    <span className="block">
                        <a
                            href="https://discreet-source-909.notion.site/personal-information-collection-and-use-consent-form"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            개인정보 수집 및 이용 동의서
                        </a>
                    </span>
                </p>
            </div>

            {/* 체크박스 영역 */}
            <div className="flex-1 flex flex-col my-8 lg:my-4 space-y-6">
                {CONSENT_ITEMS.map((item) => (
                    <ConsentAgreementItem
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        content={item.content}
                        checked={agreementStates[item.id as keyof typeof agreementStates]}
                        onChange={(checked) =>
                            agreementSetters[item.id as keyof typeof agreementSetters](checked)
                        }
                    />
                ))}
            </div>

            {submitError && (
                <p className="text-sm text-red-600 text-center mt-2" role="alert">
                    {submitError}
                </p>
            )}

            {/* 버튼 영역: 뒤로가기 | 동의하고 회원가입 (회원가입 플로우) / 동의하고 계속 (기타) */}
            <div className="flex gap-3 mt-2">
                {isSignupFlow && (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                    >
                        뒤로가기
                    </Button>
                )}
                <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={handleContinue}
                    disabled={!isContinueEnabled || isSubmitting}
                    variant={isContinueEnabled ? 'primary' : 'secondary'}
                >
                    {isSignupFlow && isSubmitting
                        ? '처리 중...'
                        : isSignupFlow
                            ? '동의하고 회원가입'
                            : '동의하고 계속'}
                </Button>
            </div>
        </div>
    )
}

