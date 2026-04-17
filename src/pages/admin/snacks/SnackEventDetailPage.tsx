import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Search, ShieldCheck, ScanLine } from 'lucide-react'
import { snackApi, type SnackEvent, type SnackHandout } from '@/shared/api/snack.api'

export default function SnackEventDetailPage() {
    const { id } = useParams<{ id: string }>()
    const eventId = Number(id)
    const navigate = useNavigate()

    const [event, setEvent] = useState<SnackEvent | null>(null)
    const [handouts, setHandouts] = useState<SnackHandout[]>([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (!eventId) return
        Promise.all([snackApi.get(eventId), snackApi.listHandouts(eventId)])
            .then(([e, h]) => {
                setEvent(e)
                setHandouts(h)
            })
            .catch(() => alert('이벤트 정보를 불러올 수 없습니다.'))
            .finally(() => setLoading(false))
    }, [eventId])

    const filtered = useMemo(() => {
        if (!query.trim()) return handouts
        const q = query.trim().toLowerCase()
        return handouts.filter(
            (h) =>
                h.studentNumber.toLowerCase().includes(q) ||
                h.name.toLowerCase().includes(q) ||
                (h.major ?? '').toLowerCase().includes(q)
        )
    }, [handouts, query])

    const handleDownload = async () => {
        if (!event) return
        setDownloading(true)
        try {
            await snackApi.downloadXlsx(event)
        } catch {
            alert('Excel 다운로드에 실패했습니다.')
        } finally {
            setDownloading(false)
        }
    }

    const formatDateTime = (iso: string | null) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleString('ko-KR', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
        })
    }

    const formatHandoutTime = (iso: string) =>
        new Date(iso).toLocaleString('ko-KR', {
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        })

    if (loading || !event) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-5 w-5 animate-spin text-ink-200" />
            </div>
        )
    }

    return (
        <div className="animate-fade-up">
            <button
                onClick={() => navigate('/admin/snacks')}
                className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink"
            >
                <ArrowLeft className="h-4 w-4" />
                이벤트 목록
            </button>

            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold text-ink">{event.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-surface-100 px-2 py-0.5 font-mono text-ink-500">
                            {event.semester}
                        </span>
                        <StatusChip status={event.status} />
                        {event.requiresPayment && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-primary-700">
                                <ShieldCheck className="h-3 w-3" />
                                납부자 전용
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {event.status === 'OPEN' && (
                        <button
                            onClick={() => navigate(`/admin/snacks/${event.id}/scan`)}
                            className="flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-primary-200 hover:text-primary"
                        >
                            <ScanLine className="h-4 w-4" />
                            스캐너 열기
                        </button>
                    )}
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                    >
                        {downloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Excel 다운로드
                    </button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="배부 인원" value={String(handouts.length)} />
                <Stat label="시작" value={formatDateTime(event.openedAt)} />
                <Stat label="종료" value={formatDateTime(event.closedAt)} />
                <Stat
                    label="개설자 학번"
                    value={event.openedByStudentNumber ?? '—'}
                    mono
                />
            </div>

            <div className="mb-4 rounded-2xl bg-white p-4 shadow-card">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-200" />
                    <input
                        type="text"
                        placeholder="학번, 이름, 전공으로 검색"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl border-none bg-surface-50 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-100">
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-300">
                                학번
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-300">
                                이름
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-300">
                                전공
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-300">
                                받은 시간
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-sm text-ink-300">
                                    {query
                                        ? '검색 결과가 없습니다.'
                                        : '아직 배부 기록이 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((h) => (
                                <tr key={h.id} className="hover:bg-surface-50">
                                    <td className="px-6 py-3 font-mono text-sm text-ink">
                                        {h.studentNumber}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-ink">
                                        {h.name}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-ink-500">
                                        {h.major ?? '—'}
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-sm text-ink-500">
                                        {formatHandoutTime(h.receivedAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="rounded-xl border border-surface-200 bg-white px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-300">{label}</p>
            <p className={`mt-0.5 text-sm font-semibold text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </p>
        </div>
    )
}

function StatusChip({ status }: { status: 'OPEN' | 'CLOSED' }) {
    if (status === 'OPEN') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                진행 중
            </span>
        )
    }
    return (
        <span className="inline-flex items-center rounded-md bg-surface-100 px-2 py-0.5 text-ink-500">
            종료
        </span>
    )
}
