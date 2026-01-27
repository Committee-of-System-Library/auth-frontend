import LoginIntroSection from './components/LoginIntroSection'
import LoginCardSection from './components/LoginCardSection'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 px-6 lg:px-24 py-8">
            {/* 모바일: 로고/텍스트 상단 */}
            <div className="lg:hidden flex justify-center py-6">
                <div className="flex items-center gap-4">
                    <img src="/cse_logo.svg" alt="CSE Logo" className="w-12 h-12" />
                    <div className="flex flex-col">
                        <h1 className="text-primary text-xl font-bold leading-tight">
                            경북대학교
                        </h1>
                        <h1 className="text-primary text-xl font-bold leading-tight">
                            IT대학 컴퓨터학부 학생회
                        </h1>
                        <p className="text-gray-600 text-xs mt-1">KYUNGPOOK NATIONAL UNIVERSITY CSE</p>
                    </div>
                </div>
            </div>
            <LoginIntroSection />
            <LoginCardSection />
        </div>
    )
}

