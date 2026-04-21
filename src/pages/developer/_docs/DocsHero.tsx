import type { ReactNode } from 'react'

type Props = {
    eyebrow?: string
    title: string
    lede?: ReactNode
    meta?: { label: string; value: string }[]
}

export default function DocsHero({ eyebrow, title, lede, meta }: Props) {
    return (
        <header className="pb-8 mb-10 border-b border-ink-100">
            {eyebrow && (
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-4">
                    {eyebrow}
                </p>
            )}
            <h1 className="text-[32px] sm:text-[38px] font-bold text-ink tracking-tight leading-[1.1]">
                {title}
            </h1>
            {lede && (
                <p className="mt-4 text-ink-500 text-[15.5px] leading-relaxed max-w-2xl">
                    {lede}
                </p>
            )}
            {meta && meta.length > 0 && (
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10.5px] tracking-widest">
                    {meta.map((m) => (
                        <div key={m.label} className="flex items-center gap-2">
                            <dt className="text-ink-300 uppercase">{m.label}</dt>
                            <dd className="text-ink font-medium">{m.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </header>
    )
}
