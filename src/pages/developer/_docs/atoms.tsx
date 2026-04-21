import type { ReactNode } from 'react'

export function Prose({ children }: { children: ReactNode }) {
    return <div className="docs-prose text-[15px] text-ink-700 leading-[1.75]">{children}</div>
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
    return (
        <h2
            id={id}
            className="group text-[22px] font-bold text-ink tracking-tight mt-14 mb-3 pt-4 scroll-mt-24 border-t border-surface-200 first:border-0 first:pt-0 first:mt-0"
        >
            <a href={`#${id}`} className="no-underline">
                {children}
                <span className="ml-2 font-normal text-ink-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    #
                </span>
            </a>
        </h2>
    )
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
    return (
        <h3 id={id} className="text-[16px] font-semibold text-ink mt-8 mb-2 scroll-mt-24">
            {children}
        </h3>
    )
}

export function P({ children }: { children: ReactNode }) {
    return <p className="text-[15px] text-ink-700 leading-[1.75] my-4">{children}</p>
}

export function InlineCode({ children }: { children: ReactNode }) {
    return (
        <code className="font-mono text-[13px] bg-surface-100 text-ink px-1.5 py-0.5 rounded">
            {children}
        </code>
    )
}

export function Badge({
    children,
    tone = 'neutral',
}: {
    children: ReactNode
    tone?: 'neutral' | 'primary' | 'success' | 'warn' | 'danger'
}) {
    const map: Record<string, string> = {
        neutral: 'bg-surface-100 text-ink-700',
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        warn: 'bg-warning/10 text-warning',
        danger: 'bg-danger/10 text-danger',
    }
    return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wider ${map[tone]}`}>
            {children}
        </span>
    )
}
