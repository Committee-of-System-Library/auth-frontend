import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Lock, AlertTriangle } from 'lucide-react'
import { authApi, type ArchitectureDoc, type ArchitectureBlock } from '@/shared/api/auth.api'
import type { DeveloperOutletContext } from './components/DeveloperLayout'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import DocsShell from './_docs/DocsShell'

type LoadState =
    | { kind: 'loading' }
    | { kind: 'error'; message: string; status?: number }
    | { kind: 'ok'; doc: ArchitectureDoc }

export default function DeveloperArchitecturePage() {
    const { isLoggedIn, isStaff, role } = useOutletContext<DeveloperOutletContext>()
    const [state, setState] = useState<LoadState>({ kind: 'loading' })

    useEffect(() => {
        if (!isLoggedIn || !isStaff) return
        let active = true
        authApi.developerDocs.architecture()
            .then((doc) => { if (active) setState({ kind: 'ok', doc }) })
            .catch((err: Error & { status?: number }) => {
                if (!active) return
                setState({ kind: 'error', message: err.message, status: err.status })
            })
        return () => { active = false }
    }, [isLoggedIn, isStaff])

    return (
        <DocsShell isStaff={isStaff} toc={false} pager={false}>
            {!isLoggedIn && <GateMessage title="로그인이 필요합니다" body="내부 아키텍처 문서는 임원 권한이 있는 사용자만 열람할 수 있습니다." />}
            {isLoggedIn && !isStaff && <GateMessage title="권한이 부족합니다" body="ADMIN 또는 학생회 임원 계정으로만 열람 가능합니다." tone="forbidden" />}
            {isLoggedIn && isStaff && state.kind === 'loading' && (
                <div className="py-24"><LoadingSpinner message="문서 로드 중..." size="md" /></div>
            )}
            {isLoggedIn && isStaff && state.kind === 'error' && (
                <div className="py-10">
                    <div className="bg-white border border-danger/30 p-6 flex gap-3 items-start rounded-md">
                        <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-sm font-semibold text-ink">문서를 불러올 수 없습니다</h2>
                            <p className="text-ink-500 text-sm mt-1 font-mono">
                                {state.status ? `HTTP ${state.status} — ` : ''}
                                {state.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {isLoggedIn && isStaff && state.kind === 'ok' && (
                <ArchitectureView doc={state.doc} role={role} />
            )}
        </DocsShell>
    )
}

function ArchitectureView({ doc, role }: { doc: ArchitectureDoc; role: string | null }) {
    return (
        <div className="animate-fade-up">
            <DocumentHeader doc={doc} role={role} />
            {doc.sections.map((section, idx) => (
                <SectionView
                    key={section.id}
                    section={section}
                    index={idx + 1}
                    total={doc.sections.length}
                />
            ))}
            <DocumentFooter doc={doc} />
        </div>
    )
}

function DocumentHeader({ doc, role }: { doc: ArchitectureDoc; role: string | null }) {
    return (
        <header className="pt-10 pb-8 border-b border-ink">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-primary mb-6">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary dot-pulse" />
                <span>CONFIDENTIAL · INTERNAL · STAFF ONLY</span>
            </div>

            <div className="grid md:grid-cols-[1fr_auto] md:gap-12 gap-6 items-end">
                <div>
                    <p className="font-mono text-[11px] tracking-widest text-ink-300 uppercase mb-3">
                        KNU CSE Platform / Engineering Gazette
                    </p>
                    <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-[0.95] tracking-tight text-ink">
                        플랫폼<br />아키텍처
                    </h1>
                </div>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-[10px] tracking-widest">
                    <HeaderMeta label="ISSUED" value={doc.updatedAt} />
                    <HeaderMeta label="SECTIONS" value={String(doc.sections.length).padStart(2, '0')} />
                    <HeaderMeta label="CLEARANCE" value={role ?? 'STAFF'} />
                    <HeaderMeta label="EDITION" value="2026·Q2" />
                </dl>
            </div>

            <p className="mt-8 text-ink-500 text-[15px] leading-relaxed max-w-2xl">
                8 개 서브 레포가 구성하는 운영 구조의 총람. 이 화면의 모든 내용은 서버에서 역할 검증 이후에만 응답되며, 외부 공유를 자제해주세요.
            </p>
        </header>
    )
}

function HeaderMeta({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-ink-300 mb-1">{label}</dt>
            <dd className="text-ink font-medium uppercase">{value}</dd>
        </div>
    )
}

function SectionView({
    section,
    index,
    total,
}: {
    section: ArchitectureDoc['sections'][number]
    index: number
    total: number
}) {
    return (
        <section id={section.id} className="pt-16 pb-12 scroll-mt-20 first:pt-10">
            <div className="flex items-baseline gap-5 mb-6">
                <span className="font-mono text-[11px] tracking-widest text-ink-300 flex-shrink-0 pt-1">
                    {String(index).padStart(2, '0')}
                    <span className="text-ink-200"> / {String(total).padStart(2, '0')}</span>
                </span>
                <div className="flex-1 h-px bg-ink-100" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3 leading-tight">
                {section.title}
            </h2>
            <p className="text-ink-500 text-[15px] leading-relaxed max-w-2xl">
                {section.summary}
            </p>

            <div className="mt-8 space-y-10">
                {section.blocks.map((block, i) => (
                    <BlockView key={i} block={block} />
                ))}
            </div>
        </section>
    )
}

function BlockView({ block }: { block: ArchitectureBlock }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-1 rounded-full bg-primary" />
                <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-700">
                    {block.heading}
                </h3>
                <div className="flex-1 h-px bg-surface-200" />
            </div>

            {block.type === 'bullets' && block.bullets && (
                <ol className="space-y-3">
                    {block.bullets.map((b, i) => (
                        <li key={i} className="flex gap-4 text-[14px] text-ink-700 leading-relaxed">
                            <span className="font-mono text-[10px] text-ink-300 pt-1 flex-shrink-0 w-5">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ol>
            )}

            {block.type === 'table' && block.rows && block.headers && (
                <div className="border border-ink-100 overflow-x-auto bg-white">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-ink">
                                {block.headers.map((h, i) => (
                                    <th
                                        key={i}
                                        className="text-left px-4 py-3 font-mono text-[10px] font-semibold text-ink uppercase tracking-widest whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((r, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-ink-100 last:border-0 hover:bg-surface-50 transition-colors"
                                >
                                    {r.cells.map((c, j) => (
                                        <td
                                            key={j}
                                            className={
                                                j === 0
                                                    ? 'px-4 py-3 text-ink font-medium text-[13px] whitespace-nowrap'
                                                    : 'px-4 py-3 text-ink-500 font-mono text-[12px]'
                                            }
                                        >
                                            {c}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function DocumentFooter({ doc }: { doc: ArchitectureDoc }) {
    return (
        <footer className="mt-20 pt-6 border-t border-ink">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] tracking-widest text-ink-300 uppercase mb-1">
                        End of document
                    </p>
                    <p className="text-ink text-sm">
                        외부 공유·스크린샷 배포를 자제해주세요.
                    </p>
                </div>
                <div className="font-mono text-[10px] text-ink-300 tracking-widest">
                    § {doc.sections.length.toString().padStart(2, '0')} · {doc.updatedAt}
                </div>
            </div>
        </footer>
    )
}

function GateMessage({
    title,
    body,
    tone = 'auth',
}: {
    title: string
    body: string
    tone?: 'auth' | 'forbidden'
}) {
    return (
        <div className="py-24 relative">
            <div className="absolute inset-0 grid-paper-fine opacity-40 pointer-events-none -z-10" />
            <div className="max-w-md mx-auto text-center">
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 mb-6 font-mono text-[10px] tracking-widest uppercase ${
                        tone === 'forbidden'
                            ? 'bg-danger/10 text-danger'
                            : 'bg-ink/5 text-ink-500'
                    }`}
                >
                    <Lock className="w-3 h-3" />
                    {tone === 'forbidden' ? 'HTTP 403 · FORBIDDEN' : 'HTTP 401 · UNAUTHORIZED'}
                </div>
                <h1 className="text-2xl font-bold text-ink mb-3 tracking-tight">{title}</h1>
                <p className="text-ink-500 text-sm mb-8 leading-relaxed">{body}</p>
                <Link
                    to="/developer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-ink text-sm font-medium text-ink hover:bg-ink hover:text-white transition-colors"
                >
                    ← 문서 홈
                </Link>
            </div>
        </div>
    )
}
