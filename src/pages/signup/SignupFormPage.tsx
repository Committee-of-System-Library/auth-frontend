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
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import type { SignupFormData, SignupFormState } from './types'
import { MAJOR_OPTIONS, GRADE_OPTIONS } from './constants'

export default function SignupFormPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<SignupFormState>({
        studentId: '',
        major: '',
        grade: '',
    })
    const [errors, setErrors] = useState<Partial<Record<keyof SignupFormState, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof SignupFormState, string>> = {}

        if (!formData.studentId) {
            newErrors.studentId = '학번을 입력해주세요.'
        } else if (!/^\d{10}$/.test(formData.studentId)) {
            newErrors.studentId = '학번은 10자리 숫자로 입력해주세요.'
        }

        if (!formData.major) {
            newErrors.major = '전공을 선택해주세요.'
        }

        if (!formData.grade) {
            newErrors.grade = '학년을 선택해주세요.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        const payload: SignupFormData = {
            ...formData,
            major: formData.major,
            grade: formData.grade as SignupFormData['grade'],
        }

        // TODO: 백엔드 API 호출 후 동의/메인 이동
        setTimeout(() => {
            navigate(ROUTES.CONSENT, { state: { formData: payload } })
            setIsSubmitting(false)
        }, 500)
    }

    const handleChange = (field: keyof SignupFormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let value = e.target.value
        if (field === 'studentId') {
            value = value.replace(/\D/g, '').slice(0, 10)
        }
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    return (
        <PageContainer maxWidth="md" maxWidthLg="xl">
            <div className="w-full">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="mb-6 -mt-1 gap-1 px-0"
                >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    뒤로가기
                </Button>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2 text-center">
                    회원가입
                </h1>
                <p className="text-gray-600 text-sm lg:text-base mb-8 text-center">
                    경북대학교 컴퓨터학부 통합인증시스템에 가입하세요
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                        id="studentId"
                        label="학번"
                        required
                        error={errors.studentId}
                    >
                        <input
                            type="text"
                            id="studentId"
                            value={formData.studentId}
                            onChange={handleChange('studentId')}
                            placeholder="10자리 학번을 입력해주세요"
                            maxLength={10}
                            inputMode="numeric"
                            className={cn(
                                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary',
                                errors.studentId ? 'border-red-500' : 'border-gray-300'
                            )}
                        />
                    </FormField>

                    <FormField id="major" label="전공" required error={errors.major}>
                        <Select
                            value={formData.major || undefined}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, major: value }))
                                if (errors.major) setErrors((prev) => ({ ...prev, major: undefined }))
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
                                {MAJOR_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField id="grade" label="학년" required error={errors.grade}>
                        <Select
                            value={formData.grade || undefined}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, grade: value as SignupFormState['grade'] }))
                                if (errors.grade) setErrors((prev) => ({ ...prev, grade: undefined }))
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
                                {GRADE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <div className="pt-4">
                        <Button type="submit" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? '처리 중...' : '다음'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}
