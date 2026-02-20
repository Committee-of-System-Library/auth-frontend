import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageContainer from '@/shared/components/PageContainer'
import { ROUTES } from '@/shared/constants/routes'

export default function MainPage() {
    const navigate = useNavigate()

    return (
        <PageContainer maxWidth="2xl">
            <div className="w-full text-center">
                <div className="mb-8">
                    <img 
                        src="/cse_logo.svg" 
                        alt="CSE Logo" 
                        className="w-20 h-20 mx-auto mb-4" 
                    />
                    <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                        경북대학교 컴퓨터학부
                    </h1>
                    <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                        통합인증시스템
                    </h2>
                    <p className="text-gray-600 text-lg">
                        환영합니다!
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <p className="text-gray-700 text-base mb-4">
                        회원가입이 완료되었습니다.
                    </p>
                    <p className="text-gray-600 text-sm">
                        백엔드 연동 후 자동으로 메인 페이지로 리다이렉션됩니다.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => navigate(ROUTES.LOGIN)}>
                        로그인 페이지로
                    </Button>
                </div>
            </div>
        </PageContainer>
    )
}
