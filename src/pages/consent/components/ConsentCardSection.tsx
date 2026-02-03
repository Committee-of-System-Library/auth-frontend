import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsentAgreementItem from './ConsentAgreementItem'
import { CONSENT_ITEMS } from '../constants/consentContent'

export default function ConsentCardSection() {
    const navigate = useNavigate()
    const [termsAgreed, setTermsAgreed] = useState(false)
    const [privacyAgreed, setPrivacyAgreed] = useState(false)

    const handleContinue = () => {
        if (termsAgreed && privacyAgreed) {
            console.log('Consent submitted:', { termsAgreed, privacyAgreed })
            // TODO: Backend API call will be added later
            navigate('/')
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
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 lg:p-10 flex flex-col">
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

            {/* 동의하고 계속 버튼 */}
            <div className="flex justify-center mt-2">
                <button
                    onClick={handleContinue}
                    disabled={!isContinueEnabled}
                    className={`w-[60%] rounded-lg px-2 py-4 font-medium text-sm lg:text-base transition-colors ${isContinueEnabled
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    동의하고 계속
                </button>
            </div>
        </div>
    )
}

