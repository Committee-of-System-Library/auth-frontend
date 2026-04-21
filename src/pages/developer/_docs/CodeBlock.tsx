import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = {
    children: string
    lang?: string
    filename?: string
}

export default function CodeBlock({ children, lang, filename }: Props) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <div className="rounded-md overflow-hidden border border-[#313244] bg-[#1e1e2e] my-5">
            {(filename || lang) && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244]">
                    <span className="font-mono text-[11px] text-[#a6adc8] tracking-wider">
                        {filename ?? lang}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="text-[#a6adc8] hover:text-white transition-colors"
                        aria-label="코드 복사"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#a6e3a1]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            )}
            <div className="relative">
                {!filename && !lang && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 rounded bg-[#313244] text-[#a6adc8] hover:text-white opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label="코드 복사"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#a6e3a1]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                )}
                <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#cdd6f4]">
                    <code>{children}</code>
                </pre>
            </div>
        </div>
    )
}
