import type { ReactNode } from 'react'
import { Info, AlertTriangle, Lightbulb, OctagonAlert } from 'lucide-react'

type Variant = 'info' | 'warn' | 'tip' | 'danger'

const styles: Record<Variant, { bar: string; icon: string; bg: string; Icon: typeof Info }> = {
    info: { bar: 'border-primary', icon: 'text-primary', bg: 'bg-primary/5', Icon: Info },
    warn: { bar: 'border-warning', icon: 'text-warning', bg: 'bg-warning/5', Icon: AlertTriangle },
    tip: { bar: 'border-success', icon: 'text-success', bg: 'bg-success/5', Icon: Lightbulb },
    danger: { bar: 'border-danger', icon: 'text-danger', bg: 'bg-danger/5', Icon: OctagonAlert },
}

export default function Callout({
    variant = 'info',
    title,
    children,
}: {
    variant?: Variant
    title?: string
    children: ReactNode
}) {
    const s = styles[variant]
    return (
        <div className={`my-5 border-l-[3px] ${s.bar} ${s.bg} pl-4 pr-4 py-3 rounded-r-md`}>
            <div className="flex items-start gap-2.5">
                <s.Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.icon}`} />
                <div className="min-w-0 flex-1">
                    {title && <p className="font-semibold text-ink text-[13.5px] mb-1">{title}</p>}
                    <div className="text-ink-700 text-[13.5px] leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    )
}
