import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    Loader2,
    Camera,
    Square,
    Volume2,
    VolumeX,
    Flashlight,
    FlashlightOff,
    PowerOff,
} from 'lucide-react'
import { snackApi, type HandoutScanResult, type SnackEvent } from '@/shared/api/snack.api'
import FeedbackOverlay from './components/FeedbackOverlay'
import { useScanner } from './hooks/useScanner'
import { isMuted, setMuted, playFeedback, primeAudio } from './hooks/feedback'

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
    const [muted, setMutedState] = useState<boolean>(isMuted())
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
    const { state: scannerState, errorMessage, elementId, hasTorch, torchOn, toggleTorch } =
        useScanner({
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

    const handleToggleMute = () => {
        const next = !muted
        setMuted(next)
        setMutedState(next)
        if (!next) primeAudio()
    }

    // Prime audio on first user interaction (any tap on bottom sheet)
    const primedRef = useRef(false)
    const handlePrime = () => {
        if (primedRef.current) return
        primedRef.current = true
        if (!muted) primeAudio()
    }

    const formatTime = useMemo(
        () => (iso: string | null) =>
            iso ? new Date(iso).toLocaleTimeString('ko-KR', { hour12: false }) : '',
        []
    )

    return (
        <div
            className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-black text-white"
            onClick={handlePrime}
        >
            {/* Camera viewport — html5-qrcode forces position:relative on its mount node,
                so we wrap it in an absolute container instead of fighting that inline style. */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    id={elementId}
                    className="h-full w-full [&_video]:!h-full [&_video]:!w-full [&_video]:object-cover"
                />
            </div>

            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75" />

            {/* Top bar */}
            <header className="relative z-10 flex items-start justify-between gap-3 px-4 pt-[max(env(safe-area-inset-top),16px)] pb-3">
                <button
                    onClick={() => navigate('/admin/snacks')}
                    className="flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-black/60"
                >
                    <ArrowLeft className="h-4 w-4" />
                    목록으로
                </button>

                <div className="flex min-w-0 max-w-[55%] flex-col items-center text-center">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold tracking-tight">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        {event?.name ?? '...'}
                    </p>
                    <p className="text-[11px] text-white/65">
                        {event?.semester} ·{' '}
                        {event?.requiresPayment ? '납부자 전용' : '전체 학생 배부'}
                    </p>
                </div>

                <div className="flex items-center gap-1.5">
                    {hasTorch && (
                        <button
                            onClick={toggleTorch}
                            className={`rounded-full p-2 backdrop-blur-md transition-colors ${
                                torchOn ? 'bg-yellow-400 text-black' : 'bg-black/45 hover:bg-black/60'
                            }`}
                            aria-label="플래시"
                        >
                            {torchOn ? (
                                <Flashlight className="h-4 w-4" />
                            ) : (
                                <FlashlightOff className="h-4 w-4" />
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleToggleMute}
                        className={`rounded-full p-2 backdrop-blur-md transition-colors ${
                            muted ? 'bg-rose-500/80 hover:bg-rose-500' : 'bg-black/45 hover:bg-black/60'
                        }`}
                        aria-label={muted ? '소리 켜기' : '소리 끄기'}
                    >
                        {muted ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </header>

            {/* Hint banner — auto fades after a few seconds */}
            <HintBanner />

            {/* Scan target — large, soft, non-restrictive */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: 'min(78vw, 78vh, 360px)',
                    height: 'min(78vw, 78vh, 360px)',
                }}
            >
                <CornerBrackets />
            </div>

            {/* Sub hint — positioning is forgiving */}
            <p className="pointer-events-none absolute left-1/2 top-1/2 mt-[calc(min(78vw,78vh,360px)/2+16px)] -translate-x-1/2 text-center text-[11px] font-medium text-white/70 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))]">
                QR이 화면 안에 들어오면 자동으로 인식됩니다
            </p>

            {/* Bottom sheet */}
            <div
                className="relative z-10 mt-auto rounded-t-3xl bg-black/55 px-5 pt-5 pb-[max(env(safe-area-inset-bottom),20px)] backdrop-blur-xl"
            >
                <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/55">
                            누적 배부
                        </p>
                        <p className="font-mono text-4xl font-bold leading-none tracking-tight">
                            {count}
                            <span className="ml-1 text-base font-medium text-white/65">명</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCloseConfirm(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-all hover:bg-rose-600 active:scale-[0.97]"
                    >
                        <PowerOff className="h-4 w-4" />
                        이벤트 종료
                    </button>
                </div>

                <div className="min-h-[88px] space-y-1.5">
                    {recent.length === 0 ? (
                        <div className="flex items-center gap-2 text-xs text-white/55">
                            {scannerState === 'starting' && (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    카메라 준비 중...
                                </>
                            )}
                            {scannerState === 'running' && (
                                <>
                                    <Camera className="h-3.5 w-3.5" />
                                    학생회 QR을 카메라 앞에 비춰주세요
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
                                        <span className="truncate text-white/55">· {r.major}</span>
                                    )}
                                </div>
                                <span className="font-mono text-white/65">
                                    {formatTime(r.receivedAt)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/55">
                    <span className="font-semibold text-white/75">목록으로</span> = 잠시 닫기 (이벤트는 계속 진행) ·{' '}
                    <span className="font-semibold text-rose-300">이벤트 종료</span> = 더 이상 배부 받지 않음
                </div>
            </div>

            {feedback && (
                <FeedbackOverlay
                    result={feedback}
                    onDismiss={() => setFeedback(null)}
                />
            )}

            {showCloseConfirm && createPortal(
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4"
                    onClick={() => setShowCloseConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6 text-ink shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-1 text-base font-bold">이벤트를 종료할까요?</h3>
                        <p className="mb-4 text-sm text-ink-500">
                            지금까지 <strong className="text-ink">{count}명</strong>에게 배부했습니다.
                        </p>
                        <div className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            종료 후에는 더 이상 스캔할 수 없습니다. 명단은 언제든 다시 다운로드할 수 있습니다.
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCloseConfirm(false)}
                                disabled={closing}
                                className="flex-1 rounded-xl bg-surface-100 py-2.5 text-sm font-medium text-ink-500 hover:bg-surface-200 disabled:opacity-50"
                            >
                                계속 진행
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
                </div>,
                document.body,
            )}
        </div>
    )
}

function HintBanner() {
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        const t = window.setTimeout(() => setVisible(false), 4500)
        return () => window.clearTimeout(t)
    }, [])
    if (!visible) return null
    return (
        <div className="pointer-events-none absolute left-1/2 top-[max(env(safe-area-inset-top),16px)] z-[5] mt-14 -translate-x-1/2 animate-fade-in rounded-full bg-black/55 px-3.5 py-1.5 text-[11px] text-white/85 backdrop-blur-md">
            화면 어디에 비춰도 인식됩니다
        </div>
    )
}

function CornerBrackets() {
    const base =
        'absolute h-9 w-9 border-white/85 [filter:drop-shadow(0_0_8px_rgba(0,0,0,0.55))]'
    return (
        <>
            <div className={`${base} left-0 top-0 rounded-tl-2xl border-l-[3px] border-t-[3px]`} />
            <div className={`${base} right-0 top-0 rounded-tr-2xl border-r-[3px] border-t-[3px]`} />
            <div className={`${base} bottom-0 left-0 rounded-bl-2xl border-b-[3px] border-l-[3px]`} />
            <div className={`${base} bottom-0 right-0 rounded-br-2xl border-b-[3px] border-r-[3px]`} />
        </>
    )
}
