import { useEffect, useState } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import type { HandoutScanResult } from '@/shared/api/snack.api'

const VARIANTS = {
    OK: {
        icon: Check,
        title: '배부 완료',
        bgClass: 'bg-emerald-500/95',
        ringClass: 'ring-emerald-300/60',
    },
    DUPLICATE: {
        icon: Info,
        title: '이미 받음',
        bgClass: 'bg-amber-500/95',
        ringClass: 'ring-amber-300/60',
    },
    UNPAID: {
        icon: X,
        title: '미납자',
        bgClass: 'bg-rose-500/95',
        ringClass: 'ring-rose-300/60',
    },
    NOT_FOUND: {
        icon: AlertTriangle,
        title: '등록되지 않은 학번',
        bgClass: 'bg-slate-700/95',
        ringClass: 'ring-slate-400/60',
    },
} as const

type Props = {
    result: HandoutScanResult
    onDismiss: () => void
    durationMs?: number
}

export default function FeedbackOverlay({ result, onDismiss, durationMs = 1400 }: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const showT = window.setTimeout(() => setVisible(true), 0)
        const hideT = window.setTimeout(() => setVisible(false), durationMs - 200)
        const dismissT = window.setTimeout(() => onDismiss(), durationMs)
        return () => {
            window.clearTimeout(showT)
            window.clearTimeout(hideT)
            window.clearTimeout(dismissT)
        }
    }, [result, durationMs, onDismiss])

    const variant = VARIANTS[result.result]
    const Icon = variant.icon

    const formatTime = (iso: string | null) => {
        if (!iso) return null
        return new Date(iso).toLocaleTimeString('ko-KR', { hour12: false })
    }

    return (
        <div
            className={`pointer-events-none fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-200 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-live="polite"
        >
            <div
                className={`flex w-[min(360px,80vw)] flex-col items-center gap-3 rounded-3xl px-8 py-8 text-white shadow-2xl ring-1 backdrop-blur-md transition-transform duration-200 ${
                    variant.bgClass
                } ${variant.ringClass} ${visible ? 'scale-100' : 'scale-95'}`}
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-9 w-9" strokeWidth={2.5} />
                </div>
                <p className="text-xl font-bold tracking-tight">{variant.title}</p>
                {result.name && (
                    <div className="text-center">
                        <p className="text-base font-semibold">{result.name}</p>
                        {result.major && (
                            <p className="text-sm font-medium opacity-90">{result.major}</p>
                        )}
                        <p className="mt-1 font-mono text-xs opacity-80">{result.studentNumber}</p>
                    </div>
                )}
                {!result.name && (
                    <p className="font-mono text-sm opacity-90">{result.studentNumber}</p>
                )}
                {result.result === 'DUPLICATE' && result.receivedAt && (
                    <p className="text-xs opacity-80">받은 시각 {formatTime(result.receivedAt)}</p>
                )}
            </div>
        </div>
    )
}
