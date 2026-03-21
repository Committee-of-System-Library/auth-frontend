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
import { authApi } from '@/shared/api/auth.api'
import type { SignupFormData } from './types'
import { MAJOR_OPTIONS } from './constants'
import { KNU_COLLEGES } from './knuDepartments'

type Step = 'student_number' | 'cse_major' | 'not_cse_choice' | 'other_dept' | 'external'

export default function SignupFormPage() {
    const navigate = useNavigate()

    // 공통 상태
    const [step, setStep] = useState<Step>('student_number')
    const [studentId, setStudentId] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [verifyError, setVerifyError] = useState('')
    const [isKnuEmail, setIsKnuEmail] = useState(false)

    // CSE 전공 선택
    const [cseMajor, setCseMajor] = useState('')

    // 타과생 선택
    const [college, setCollege] = useState('')
    const [department, setDepartment] = useState('')

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Step 1: 학번 입력 → 검증
    const handleVerify = async () => {
        if (!/^\d{10}$/.test(studentId)) {
            setErrors({ studentId: '학번은 10자리 숫자로 입력해주세요.' })
            return
        }
        setErrors({})
        setVerifyError('')
        setIsVerifying(true)

        try {
            const res = await authApi.verifyStudent(studentId)
            setIsKnuEmail(res.isKnuEmail)

            if (res.isCseStudent) {
                setStep('cse_major')
            } else if (res.isKnuEmail) {
                setStep('not_cse_choice')
            } else {
                // @knu.ac.kr 아닌 외부인
                setStep('external')
            }
        } catch {
            setVerifyError('학번 검증 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setIsVerifying(false)
        }
    }

    // 최종 제출 → 동의 페이지로
    const goToConsent = (data: SignupFormData) => {
        navigate(ROUTES.CONSENT, { state: { formData: data } })
    }

    // CSE 전공 선택 제출
    const handleCseMajorSubmit = () => {
        if (!cseMajor) {
            setErrors({ cseMajor: '전공을 선택해주세요.' })
            return
        }
        goToConsent({ studentId, major: cseMajor, userType: 'CSE_STUDENT' })
    }

    // 타과생 학과 선택 제출
    const handleOtherDeptSubmit = () => {
        const newErrors: Record<string, string> = {}
        if (!college) newErrors.college = '단과대학을 선택해주세요.'
        if (!department) newErrors.department = '학과를 선택해주세요.'
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        goToConsent({ studentId, major: `${college} ${department}`, userType: 'KNU_OTHER_DEPT' })
    }

    // 외부인 제출
    const handleExternalSubmit = () => {
        goToConsent({ studentId: '', major: '', userType: 'EXTERNAL' })
    }

    const selectedCollegeData = KNU_COLLEGES.find((c) => c.college === college)

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6 py-8">
            <div className="w-full max-w-md animate-fade-up">
                <div className="bg-white rounded-2xl shadow-card p-8">
                    <h1 className="text-xl font-bold text-ink mb-1 text-center">회원가입</h1>
                    <p className="text-ink-300 text-sm mb-8 text-center">
                        {step === 'student_number' && '학번을 입력해 학적을 확인합니다.'}
                        {step === 'cse_major' && '컴퓨터학부 학생으로 확인되었습니다. 전공을 선택해주세요.'}
                        {step === 'not_cse_choice' && '컴퓨터학부 학생 목록에서 확인되지 않았습니다.'}
                        {step === 'other_dept' && '소속 단과대학과 학과를 선택해주세요.'}
                        {step === 'external' && '외부 사용자로 가입합니다.'}
                    </p>

                    {/* Step 1: 학번 입력 */}
                    {step === 'student_number' && (
                        <div className="space-y-5">
                            <FormField id="studentId" label="학번" required error={errors.studentId}>
                                <input
                                    type="text"
                                    id="studentId"
                                    value={studentId}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                                        setStudentId(v)
                                        if (errors.studentId) setErrors({})
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
                            {verifyError && (
                                <p className="text-sm text-red-600 text-center">{verifyError}</p>
                            )}
                            <div className="pt-2">
                                <Button type="button" fullWidth onClick={handleVerify} disabled={isVerifying}>
                                    {isVerifying ? '확인 중...' : '학번 확인'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2a: CSE 전공 선택 */}
                    {step === 'cse_major' && (
                        <div className="space-y-5">
                            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3">
                                컴퓨터학부 재학생으로 확인되었습니다.
                            </div>
                            <FormField id="cseMajor" label="전공" required error={errors.cseMajor}>
                                <Select
                                    value={cseMajor || undefined}
                                    onValueChange={(v) => {
                                        setCseMajor(v)
                                        if (errors.cseMajor) setErrors({})
                                    }}
                                >
                                    <SelectTrigger
                                        id="cseMajor"
                                        className={cn('h-12 w-full rounded-xl bg-surface-50 border-none', errors.cseMajor && 'ring-2 ring-danger/30')}
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
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setStep('student_number')} className="flex-1">
                                    이전
                                </Button>
                                <Button type="button" onClick={handleCseMajorSubmit} className="flex-1">
                                    다음
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2b: 컴학 아님 — 타과생/컴학 문의/외부인 선택 */}
                    {step === 'not_cse_choice' && (
                        <div className="space-y-3">
                            <div className="bg-amber-50 text-amber-700 text-sm rounded-lg px-4 py-3">
                                학번 <strong>{studentId}</strong>은(는) 컴퓨터학부 학생 목록에 없습니다.
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('other_dept')}
                                className="w-full text-left px-4 py-3.5 bg-surface-50 rounded-xl text-sm hover:bg-surface-100 transition-colors"
                            >
                                <span className="font-medium text-ink">타과생입니다</span>
                                <span className="block text-ink-300 text-xs mt-0.5">경북대학교 다른 학과 소속</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleExternalSubmit}
                                className="w-full text-left px-4 py-3.5 bg-surface-50 rounded-xl text-sm hover:bg-surface-100 transition-colors"
                            >
                                <span className="font-medium text-ink">외부인입니다</span>
                                <span className="block text-ink-300 text-xs mt-0.5">경북대학교 소속이 아님</span>
                            </button>
                            <div className="border-t border-surface-100 pt-3 mt-3">
                                <p className="text-ink-300 text-xs text-center mb-2">
                                    컴퓨터학부 학생인데 목록에 없으신가요?
                                </p>
                                <p className="text-ink-300 text-xs text-center">
                                    아래 "외부인입니다"로 가입 후,{' '}
                                    <strong className="text-ink-500">마이페이지 &gt; 학부생 인증 요청</strong>에서
                                    관리자 승인을 받을 수 있습니다.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Button type="button" variant="outline" fullWidth onClick={() => setStep('student_number')}>
                                    이전
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2c: 타과생 — 단과대학/학과 선택 */}
                    {step === 'other_dept' && (
                        <div className="space-y-5">
                            <FormField id="college" label="단과대학" required error={errors.college}>
                                <Select
                                    value={college || undefined}
                                    onValueChange={(v) => {
                                        setCollege(v)
                                        setDepartment('')
                                        if (errors.college) setErrors({})
                                    }}
                                >
                                    <SelectTrigger
                                        id="college"
                                        className={cn('h-12 w-full rounded-xl bg-surface-50 border-none', errors.college && 'ring-2 ring-danger/30')}
                                    >
                                        <SelectValue placeholder="단과대학을 선택해주세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {KNU_COLLEGES.map((c) => (
                                            <SelectItem key={c.college} value={c.college}>{c.college}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            {college && selectedCollegeData && (
                                <FormField id="department" label="학과/학부" required error={errors.department}>
                                    <Select
                                        value={department || undefined}
                                        onValueChange={(v) => {
                                            setDepartment(v)
                                            if (errors.department) setErrors({})
                                        }}
                                    >
                                        <SelectTrigger
                                            id="department"
                                            className={cn('h-12 w-full rounded-xl bg-surface-50 border-none', errors.department && 'ring-2 ring-danger/30')}
                                        >
                                            <SelectValue placeholder="학과를 선택해주세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedCollegeData.departments.map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setStep('not_cse_choice')} className="flex-1">
                                    이전
                                </Button>
                                <Button type="button" onClick={handleOtherDeptSubmit} className="flex-1">
                                    다음
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 외부인 확인 */}
                    {step === 'external' && (
                        <div className="space-y-5">
                            <div className="bg-surface-50 text-ink-500 text-sm rounded-lg px-4 py-3">
                                {isKnuEmail
                                    ? '외부 사용자로 가입합니다. 일부 기능이 제한될 수 있습니다.'
                                    : '경북대학교 외부 사용자로 가입합니다.'}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => isKnuEmail ? setStep('not_cse_choice') : setStep('student_number')}
                                    className="flex-1"
                                >
                                    이전
                                </Button>
                                <Button type="button" onClick={handleExternalSubmit} className="flex-1">
                                    다음
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
