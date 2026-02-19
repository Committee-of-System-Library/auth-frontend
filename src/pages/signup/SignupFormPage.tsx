import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '@/shared/components/PageContainer'
import { ROUTES } from '@/shared/constants/routes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

interface SignupFormData {
    studentId: string
    major: string
    grade: string
}

export default function SignupFormPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<SignupFormData>({
        studentId: '',
        major: '',
        grade: '',
    })
    const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof SignupFormData, string>> = {}

        // 학번 검증 (무조건 10자리)
        if (!formData.studentId) {
            newErrors.studentId = '학번을 입력해주세요.'
        } else if (!/^\d{10}$/.test(formData.studentId)) {
            newErrors.studentId = '학번은 10자리 숫자로 입력해주세요.'
        }

        // 전공 검증
        if (!formData.major) {
            newErrors.major = '전공을 선택해주세요.'
        }

        // 학년 검증
        if (!formData.grade) {
            newErrors.grade = '학년을 선택해주세요.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        // TODO: 백엔드 API 호출
        // try {
        //     await signupApi(formData)
        //     // 회원가입 성공 시 동의 페이지로 이동
        //     navigate(ROUTES.SIGNUP_CONSENT, { state: { formData } })
        // } catch (error) {
        //     // 에러 처리
        //     console.error('회원가입 실패:', error)
        // } finally {
        //     setIsSubmitting(false)
        // }

        // 임시: 백엔드 없이 동의 페이지로 이동
        setTimeout(() => {
            navigate(ROUTES.CONSENT, { state: { formData } })
            setIsSubmitting(false)
        }, 500)
    }

    const handleChange = (field: keyof SignupFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let value = e.target.value
        // 학번: 숫자만, 최대 10자리
        if (field === 'studentId') {
            value = value.replace(/\D/g, '').slice(0, 10)
        }
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <PageContainer maxWidth="md" maxWidthLg="xl">
            <div className="w-full">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary mb-6 -mt-1 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    뒤로가기
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2 text-center">
                    회원가입
                </h1>
                <p className="text-gray-600 text-sm lg:text-base mb-8 text-center">
                    경북대학교 컴퓨터학부 통합인증시스템에 가입하세요
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 학번 */}
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                            학번 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="studentId"
                            value={formData.studentId}
                            onChange={handleChange('studentId')}
                            placeholder="10자리 학번을 입력해주세요"
                            maxLength={10}
                            inputMode="numeric"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.studentId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.studentId && (
                            <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>
                        )}
                    </div>

                    {/* 전공 */}
                    <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                            전공 <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={formData.major || undefined}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, major: value }))
                                if (errors.major) setErrors(prev => ({ ...prev, major: undefined }))
                            }}
                        >
                            <SelectTrigger
                                id="major"
                                className={cn(
                                    'h-12 w-full',
                                    errors.major && 'border-red-500 focus:ring-red-500'
                                )}
                                aria-invalid={!!errors.major}
                            >
                                <SelectValue placeholder="전공을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="글로벌 SW융합전공(첨단컴퓨팅연구전공)">
                                    글로벌 SW융합전공(첨단컴퓨팅연구전공)
                                </SelectItem>
                                <SelectItem value="심화컴퓨팅 전공(플랫폼SW융합전공)">
                                    심화컴퓨팅 전공(플랫폼SW융합전공)
                                </SelectItem>
                                <SelectItem value="인공지능컴퓨팅 전공">
                                    인공지능컴퓨팅 전공
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.major && (
                            <p className="mt-1 text-sm text-red-500">{errors.major}</p>
                        )}
                    </div>

                    {/* 학년 */}
                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                            학년 <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={formData.grade || undefined}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, grade: value }))
                                if (errors.grade) setErrors(prev => ({ ...prev, grade: undefined }))
                            }}
                        >
                            <SelectTrigger
                                id="grade"
                                className={cn(
                                    'h-12 w-full',
                                    errors.grade && 'border-red-500 focus:ring-red-500'
                                )}
                                aria-invalid={!!errors.grade}
                            >
                                <SelectValue placeholder="학년을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1학년</SelectItem>
                                <SelectItem value="2">2학년</SelectItem>
                                <SelectItem value="3">3학년</SelectItem>
                                <SelectItem value="4">4학년</SelectItem>
                                <SelectItem value="졸업유예">졸업유예</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.grade && (
                            <p className="mt-1 text-sm text-red-500">{errors.grade}</p>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '처리 중...' : '다음'}
                        </button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}
