import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import type { SignupFormData } from './types'
import { MAJOR_OPTIONS } from './constants'

export default function SignupFormPage() {
    const navigate = useNavigate()
    const [studentId, setStudentId] = useState('')
    const [major, setMajor] = useState('')
    const [errors, setErrors] = useState<{ studentId?: string; major?: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {}
        if (!studentId) {
            newErrors.studentId = '학번을 입력해주세요.'
        } else if (!/^\d{10}$/.test(studentId)) {
            newErrors.studentId = '학번은 10자리 숫자로 입력해주세요.'
        }
        if (!major) newErrors.major = '전공을 선택해주세요.'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsSubmitting(true)
        const payload: SignupFormData = { studentId, major }
        navigate(ROUTES.CONSENT, { state: { formData: payload } })
        setIsSubmitting(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6 py-8">
            <div className="w-full max-w-md animate-fade-up">
                <div className="bg-white rounded-2xl shadow-card p-8">
                    <h1 className="text-xl font-bold text-ink mb-1 text-center">회원가입</h1>
                    <p className="text-ink-300 text-sm mb-8 text-center">
                        학번과 전공을 입력해주세요. 이름은 Google 계정에서 자동으로 가져옵니다.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField id="studentId" label="학번" required error={errors.studentId}>
                            <input
                                type="text"
                                id="studentId"
                                value={studentId}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                                    setStudentId(v)
                                    if (errors.studentId) setErrors((prev) => ({ ...prev, studentId: undefined }))
                                }}
                                placeholder="10자리 학번을 입력해주세요"
                                maxLength={10}
                                inputMode="numeric"
                                className={cn(
                                    'w-full px-4 py-3 bg-surface-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200',
                                    errors.studentId && 'ring-2 ring-danger/30'
                                )}
                            />
                        </FormField>

                        <FormField id="major" label="전공" required error={errors.major}>
                            <Select
                                value={major || undefined}
                                onValueChange={(value) => {
                                    setMajor(value)
                                    if (errors.major) setErrors((prev) => ({ ...prev, major: undefined }))
                                }}
                            >
                                <SelectTrigger
                                    id="major"
                                    className={cn('h-12 w-full rounded-xl bg-surface-50 border-none', errors.major && 'ring-2 ring-danger/30')}
                                >
                                    <SelectValue placeholder="전공을 선택해주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MAJOR_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>

                        <div className="pt-2">
                            <Button type="submit" fullWidth disabled={isSubmitting}>
                                {isSubmitting ? '처리 중...' : '다음'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
