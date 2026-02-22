import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageContainer from '@/shared/components/PageContainer'
import { ROUTES } from '@/shared/constants/routes'
import { authApi } from '@/shared/api/auth.api'

export default function MainPage() {
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await authApi.logout()
            navigate(ROUTES.LOGIN)
        } catch {
            setIsLoggingOut(false)
            navigate(ROUTES.LOGIN)
        }
    }

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

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                    </Button>
                </div>
            </div>
        </PageContainer>
    )
}
