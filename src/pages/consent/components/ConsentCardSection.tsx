import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ConsentAgreementItem from './ConsentAgreementItem'
import { Button } from '@/components/ui/button'
import { CONSENT_ITEMS } from '@/pages/consent/constants/consentContent'
import { ROUTES } from '@/shared/constants/routes'
import type { SignupFormData } from '@/pages/signup/types'

export default function ConsentCardSection() {
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData as SignupFormData | undefined
    const isSignupFlow = !!formData // 회원가입 플로우인지 확인

    const [termsAgreed, setTermsAgreed] = useState(false)
    const [privacyAgreed, setPrivacyAgreed] = useState(false)

    const handleContinue = () => {
        if (termsAgreed && privacyAgreed) {
            if (isSignupFlow) {
                // 회원가입 플로우: 백엔드 API 호출 후 메인 페이지로 이동
                // TODO: 백엔드 API 호출
                // try {
                //     await signupApi({ ...formData, termsAgreed, privacyAgreed })
                //     // 회원가입 성공 시 메인 페이지로 리다이렉션 (백엔드에서 처리)
                //     // navigate(ROUTES.MAIN)
                // } catch (error) {
                //     // 에러 처리
                //     console.error('회원가입 실패:', error)
                // }

                // 임시: 백엔드 없이 메인 페이지로 이동
                console.log('회원가입 정보:', { ...formData, termsAgreed, privacyAgreed })
                navigate(ROUTES.MAIN)
            } else {
                // 기존 플로우
                console.log('Consent submitted:', { termsAgreed, privacyAgreed })
                // TODO: Backend API call will be added later
                navigate(ROUTES.HOME)
            }
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
                <div className="mb-6 flex items-center justify-center">
                    <h2 className="text-primary text-lg lg:text-2xl font-bold whitespace-nowrap">
                        회원가입 필수 약관 동의
                    </h2>
                </div>
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

            {/* 버튼 영역: 뒤로가기 | 동의하고 회원가입 (회원가입 플로우) / 동의하고 계속 (기타) */}
            <div className="flex gap-3 mt-2">
                {isSignupFlow && (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => navigate(-1)}
                    >
                        뒤로가기
                    </Button>
                )}
                <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={handleContinue}
                    disabled={!isContinueEnabled}
                    variant={isContinueEnabled ? 'primary' : 'secondary'}
                >
                    {isSignupFlow ? '동의하고 회원가입' : '동의하고 계속'}
                </Button>
            </div>
        </div>
    )
}

