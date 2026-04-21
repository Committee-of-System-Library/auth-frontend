import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export type CodeSample = { lang: string; label: string; code: string; filename?: string }

export default function CodeTabs({ samples }: { samples: CodeSample[] }) {
    const [active, setActive] = useState(0)
    const [copied, setCopied] = useState(false)
    const current = samples[active]

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(current.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <div className="rounded-md overflow-hidden border border-[#313244] bg-[#1e1e2e] my-5">
            <div className="flex items-center justify-between bg-[#181825] border-b border-[#313244]">
                <div role="tablist" className="flex">
                    {samples.map((s, i) => (
                        <button
                            key={s.lang}
                            role="tab"
                            aria-selected={i === active}
                            onClick={() => setActive(i)}
                            className={`px-3.5 py-2 font-mono text-[11px] tracking-wider transition-colors ${
                                i === active
                                    ? 'text-white bg-[#1e1e2e] border-b-2 border-primary-400 -mb-px'
                                    : 'text-[#a6adc8] hover:text-white'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleCopy}
                    className="px-3 text-[#a6adc8] hover:text-white transition-colors"
                    aria-label="코드 복사"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#a6e3a1]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            {current.filename && (
                <div className="px-4 py-1.5 bg-[#181825] border-b border-[#313244]/50 font-mono text-[10.5px] text-[#6c7086]">
                    {current.filename}
                </div>
            )}
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#cdd6f4]">
                <code>{current.code}</code>
            </pre>
        </div>
    )
}
