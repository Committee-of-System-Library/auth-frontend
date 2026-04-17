import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Loader2, ShieldCheck, Camera, Square } from 'lucide-react'
import { snackApi, type HandoutScanResult, type SnackEvent } from '@/shared/api/snack.api'
import FeedbackOverlay from './components/FeedbackOverlay'
import { useScanner, playFeedback } from './hooks/useScanner'

export default function SnackScannerPage() {
    const { id } = useParams<{ id: string }>()
    const eventId = Number(id)
    const navigate = useNavigate()

    const [event, setEvent] = useState<SnackEvent | null>(null)
    const [loadingEvent, setLoadingEvent] = useState(true)
    const [count, setCount] = useState(0)
    const [recent, setRecent] = useState<HandoutScanResult[]>([])
    const [feedback, setFeedback] = useState<HandoutScanResult | null>(null)
    const [closing, setClosing] = useState(false)
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const inFlightRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!eventId) return
        snackApi.get(eventId)
            .then((e) => {
                setEvent(e)
                setCount(e.handoutCount)
                if (e.status !== 'OPEN') {
                    navigate(`/admin/snacks/${eventId}`, { replace: true })
                }
            })
            .catch(() => alert('이벤트 정보를 불러올 수 없습니다.'))
            .finally(() => setLoadingEvent(false))
    }, [eventId, navigate])

    const handleStudentNumber = useCallback(
        async (studentNumber: string) => {
            if (inFlightRef.current.has(studentNumber)) return
            inFlightRef.current.add(studentNumber)
            try {
                const result = await snackApi.handout(eventId, studentNumber)
                setFeedback(result)
                playFeedback(result.result)
                if (result.result === 'OK') {
                    setCount((c) => c + 1)
                    setRecent((prev) => [result, ...prev].slice(0, 5))
                }
            } catch {
                playFeedback('NOT_FOUND')
                setFeedback({
                    result: 'NOT_FOUND',
                    studentNumber,
                    name: null,
                    major: null,
                    paid: null,
                    receivedAt: null,
                })
            } finally {
                window.setTimeout(() => inFlightRef.current.delete(studentNumber), 1500)
            }
        },
        [eventId]
    )

    const scannerEnabled = !loadingEvent && event?.status === 'OPEN'
    const { state: scannerState, errorMessage, elementId } = useScanner({
        onStudentNumber: handleStudentNumber,
        enabled: scannerEnabled,
    })

    const handleClose = async () => {
        setClosing(true)
        try {
            await snackApi.close(eventId)
            navigate(`/admin/snacks/${eventId}`, { replace: true })
        } catch {
            alert('이벤트 종료에 실패했습니다.')
            setClosing(false)
        }
    }

    const formatTime = useMemo(
        () => (iso: string | null) =>
            iso ? new Date(iso).toLocaleTimeString('ko-KR', { hour12: false }) : '',
        []
    )

    return (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-black text-white">
            {/* Camera viewport */}
            <div id={elementId} className="absolute inset-0 [&_video]:!h-full [&_video]:!w-full [&_video]:object-cover" />

            {/* Dark vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />

            {/* Top bar */}
            <header className="relative z-10 flex items-center justify-between gap-4 px-5 pt-[max(env(safe-area-inset-top),16px)] pb-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400">
                        <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/70" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight">
                            {event?.name ?? '...'}
                        </p>
                        <p className="text-[11px] text-white/60">
                            {event?.semester} ·{' '}
                            {event?.requiresPayment ? '납부자 전용' : '전체 학생 배부'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/admin/snacks')}
                    className="rounded-full bg-white/10 p-2 backdrop-blur transition-colors hover:bg-white/20"
                    aria-label="닫기"
                >
                    <X className="h-5 w-5" />
                </button>
            </header>

            {/* Scan target — corner brackets only */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2">
                <CornerBrackets />
            </div>

            {/* Bottom sheet */}
            <div className="relative z-10 mt-auto rounded-t-3xl bg-black/55 px-5 pt-5 pb-[max(env(safe-area-inset-bottom),20px)] backdrop-blur-xl">
                <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50">
                            누적 배부
                        </p>
                        <p className="font-mono text-4xl font-bold leading-none tracking-tight">
                            {count}
                            <span className="ml-1 text-base font-medium text-white/60">명</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCloseConfirm(true)}
                        className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15"
                    >
                        이벤트 종료
                    </button>
                </div>

                <div className="min-h-[88px] space-y-1.5">
                    {recent.length === 0 ? (
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            {scannerState === 'starting' && (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    카메라 준비 중...
                                </>
                            )}
                            {scannerState === 'running' && (
                                <>
                                    <Camera className="h-3.5 w-3.5" />
                                    학생회 QR을 정사각형 안에 비춰주세요
                                </>
                            )}
                            {scannerState === 'denied' && (
                                <span className="text-rose-300">{errorMessage}</span>
                            )}
                            {scannerState === 'error' && (
                                <span className="text-rose-300">{errorMessage}</span>
                            )}
                        </div>
                    ) : (
                        recent.map((r, idx) => (
                            <div
                                key={`${r.studentNumber}-${r.receivedAt}-${idx}`}
                                className="flex items-center justify-between text-xs"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <Square className="h-3 w-3 shrink-0 fill-emerald-400 text-emerald-400" />
                                    <span className="truncate font-medium">{r.name}</span>
                                    {r.major && (
                                        <span className="truncate text-white/50">· {r.major}</span>
                                    )}
                                </div>
                                <span className="font-mono text-white/60">
                                    {formatTime(r.receivedAt)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {event?.requiresPayment && (
                    <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] text-white/50">
                        <ShieldCheck className="h-3 w-3" />
                        납부자만 배부 가능 — ledger 실시간 검증
                    </div>
                )}
            </div>

            {feedback && (
                <FeedbackOverlay
                    result={feedback}
                    onDismiss={() => setFeedback(null)}
                />
            )}

            {showCloseConfirm && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4"
                    onClick={() => setShowCloseConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6 text-ink shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-1 text-base font-bold">이벤트를 종료할까요?</h3>
                        <p className="mb-5 text-sm text-ink-500">
                            종료 후에는 더 이상 배부할 수 없습니다. 명단은 언제든지 다시 다운로드할 수 있습니다.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCloseConfirm(false)}
                                disabled={closing}
                                className="flex-1 rounded-xl bg-surface-100 py-2.5 text-sm font-medium text-ink-500 hover:bg-surface-200 disabled:opacity-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleClose}
                                disabled={closing}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                            >
                                {closing && <Loader2 className="h-4 w-4 animate-spin" />}
                                종료하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function CornerBrackets() {
    const base =
        'absolute h-7 w-7 border-white/90 [filter:drop-shadow(0_0_6px_rgba(0,0,0,0.5))]'
    return (
        <>
            <div className={`${base} left-0 top-0 border-l-2 border-t-2 rounded-tl-lg`} />
            <div className={`${base} right-0 top-0 border-r-2 border-t-2 rounded-tr-lg`} />
            <div className={`${base} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg`} />
            <div className={`${base} bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg`} />
        </>
    )
}
