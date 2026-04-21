import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { adjacentDocs } from './docsNav'

export default function NextPrev({ currentPath }: { currentPath: string }) {
    const { prev, next } = adjacentDocs(currentPath)
    if (!prev && !next) return null

    return (
        <nav aria-label="페이지 이동" className="mt-16 pt-8 border-t border-ink-100 grid sm:grid-cols-2 gap-3">
            {prev ? (
                <Link
                    to={prev.to}
                    className="group border border-surface-200 hover:border-ink-200 hover:bg-surface-50 p-4 rounded-md transition-colors"
                >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-300 mb-1.5">
                        <ArrowLeft className="w-3 h-3" /> 이전
                    </div>
                    <p className="text-ink font-semibold text-sm group-hover:text-primary transition-colors">
                        {prev.label}
                    </p>
                    <p className="text-ink-300 text-xs mt-0.5">{prev.group}</p>
                </Link>
            ) : (
                <div />
            )}
            {next && (
                <Link
                    to={next.to}
                    className="group border border-surface-200 hover:border-ink-200 hover:bg-surface-50 p-4 rounded-md transition-colors text-right"
                >
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-300 mb-1.5">
                        다음 <ArrowRight className="w-3 h-3" />
                    </div>
                    <p className="text-ink font-semibold text-sm group-hover:text-primary transition-colors">
                        {next.label}
                    </p>
                    <p className="text-ink-300 text-xs mt-0.5">{next.group}</p>
                </Link>
            )}
        </nav>
    )
}
