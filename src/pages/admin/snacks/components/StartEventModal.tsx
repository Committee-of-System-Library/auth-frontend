import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { snackApi, type SnackEvent } from '@/shared/api/snack.api'

type Props = {
    onClose: () => void
    onCreated: (event: SnackEvent) => void
}

export default function StartEventModal({ onClose, onCreated }: Props) {
    const [name, setName] = useState('')
    const [semester, setSemester] = useState('')
    const [requiresPayment, setRequiresPayment] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        snackApi.suggestSemester()
            .then((res) => setSemester(res.semester))
            .catch(() => {
                const now = new Date()
                const term = now.getMonth() + 1 <= 6 ? 1 : 2
                setSemester(`${now.getFullYear()}-${term}`)
            })
    }, [])

    const handleSubmit = async () => {
        if (!name.trim() || !semester.trim()) return
        setLoading(true)
        setError(null)
        try {
            const created = await snackApi.create({
                name: name.trim(),
                semester: semester.trim(),
                requiresPayment,
            })
            onCreated(created)
        } catch (err) {
            setError(err instanceof Error ? err.message : '이벤트 생성에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ink">새 이벤트 시작</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-ink-300 hover:bg-surface-100"
                        aria-label="닫기"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-ink-500">
                            이벤트 이름
                        </label>
                        <input
                            type="text"
                            placeholder="예: 2026-1 야식마차 1차"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border-none bg-surface-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-ink-500">
                            학기 (납부 확인 기준)
                        </label>
                        <input
                            type="text"
                            placeholder="2026-1"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full rounded-xl border-none bg-surface-50 px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                        />
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 p-3 hover:bg-surface-50">
                        <input
                            type="checkbox"
                            checked={requiresPayment}
                            onChange={(e) => setRequiresPayment(e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-primary"
                        />
                        <div>
                            <p className="text-sm font-medium text-ink">학생회비 납부자 전용</p>
                            <p className="text-xs text-ink-300">
                                체크 해제 시 등록된 학생 전체에게 배부합니다.
                            </p>
                        </div>
                    </label>
                </div>

                {error && (
                    <p className="mt-3 text-xs text-rose-600">{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !name.trim() || !semester.trim()}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    이벤트 시작
                </button>
            </div>
        </div>
    )
}
