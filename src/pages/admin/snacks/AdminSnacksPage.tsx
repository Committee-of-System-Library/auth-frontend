import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ScanLine, Loader2, UtensilsCrossed, ShieldCheck, Users } from 'lucide-react'
import { snackApi, type SnackEvent } from '@/shared/api/snack.api'
import StartEventModal from './components/StartEventModal'

export default function AdminSnacksPage() {
    const [events, setEvents] = useState<SnackEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [showStart, setShowStart] = useState(false)
    const navigate = useNavigate()

    const load = () => {
        setLoading(true)
        snackApi.list()
            .then(setEvents)
            .catch(() => alert('이벤트 목록을 불러올 수 없습니다.'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleCreated = (event: SnackEvent) => {
        setShowStart(false)
        navigate(`/admin/snacks/${event.id}/scan`)
    }

    const formatDateTime = (iso: string | null) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleString('ko-KR', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
        })
    }

    return (
        <div className="animate-fade-up">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink">야식마차</h1>
                    <p className="mt-1 text-sm text-ink-300">
                        QR 스캔으로 야식 배부 인원을 관리합니다.
                    </p>
                </div>
                <button
                    onClick={() => setShowStart(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                    <Plus className="h-4 w-4" />
                    새 이벤트 시작
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-5 w-5 animate-spin text-ink-200" />
                </div>
            ) : events.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100">
                        <UtensilsCrossed className="h-5 w-5 text-ink-300" />
                    </div>
                    <p className="text-sm font-medium text-ink">아직 야식마차 이벤트가 없습니다</p>
                    <p className="mt-1 text-xs text-ink-300">
                        “새 이벤트 시작”을 눌러 첫 행사를 열어보세요.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {events.map((event) => (
                        <button
                            key={event.id}
                            onClick={() => {
                                if (event.status === 'OPEN') {
                                    navigate(`/admin/snacks/${event.id}/scan`)
                                } else {
                                    navigate(`/admin/snacks/${event.id}`)
                                }
                            }}
                            className="group flex flex-col gap-3 rounded-2xl border border-surface-200 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-base font-bold text-ink">{event.name}</h2>
                                <StatusChip status={event.status} />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Chip
                                    icon={<span className="font-mono text-[10px]">{event.semester}</span>}
                                    label={null}
                                />
                                {event.requiresPayment && (
                                    <Chip
                                        icon={<ShieldCheck className="h-3 w-3" />}
                                        label="납부자 전용"
                                        tone="primary"
                                    />
                                )}
                            </div>

                            <div className="flex items-end justify-between border-t border-surface-100 pt-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-ink-300">
                                        배부 인원
                                    </p>
                                    <p className="flex items-baseline gap-1 text-2xl font-bold tabular-nums text-ink">
                                        {event.handoutCount}
                                        <Users className="h-3 w-3 text-ink-300" />
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wider text-ink-300">
                                        시작
                                    </p>
                                    <p className="text-xs text-ink-500">
                                        {formatDateTime(event.openedAt)}
                                    </p>
                                    {event.closedAt && (
                                        <>
                                            <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-300">
                                                종료
                                            </p>
                                            <p className="text-xs text-ink-500">
                                                {formatDateTime(event.closedAt)}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                {event.status === 'OPEN' ? (
                                    <>
                                        <ScanLine className="h-3.5 w-3.5" />
                                        스캐너 열기
                                    </>
                                ) : (
                                    <>상세 보기</>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showStart && (
                <StartEventModal
                    onClose={() => setShowStart(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    )
}

function StatusChip({ status }: { status: 'OPEN' | 'CLOSED' }) {
    if (status === 'OPEN') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                진행 중
            </span>
        )
    }
    return (
        <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-[11px] font-semibold text-ink-500">
            종료
        </span>
    )
}

function Chip({
    icon,
    label,
    tone = 'neutral',
}: {
    icon: React.ReactNode
    label: string | null
    tone?: 'neutral' | 'primary'
}) {
    const toneClass =
        tone === 'primary'
            ? 'bg-primary-50 text-primary-700'
            : 'bg-surface-100 text-ink-500'
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
        >
            {icon}
            {label}
        </span>
    )
}
