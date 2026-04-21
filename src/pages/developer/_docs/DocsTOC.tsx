import { useEffect, useState } from 'react'

type Heading = { id: string; text: string; level: 2 | 3 }

export default function DocsTOC({ containerSelector = 'main[data-docs-content]' }: { containerSelector?: string }) {
    const [items, setItems] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)

    useEffect(() => {
        const root = document.querySelector(containerSelector)
        if (!root) return
        const nodes = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'))
        setItems(
            nodes.map((n) => ({
                id: n.id,
                text: n.textContent?.trim() ?? '',
                level: n.tagName === 'H2' ? 2 : 3,
            })),
        )

        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting)
                if (visible.length > 0) {
                    const first = visible.reduce((a, b) =>
                        a.target.getBoundingClientRect().top < b.target.getBoundingClientRect().top ? a : b,
                    )
                    setActiveId(first.target.id)
                }
            },
            { rootMargin: '-80px 0px -70% 0px' },
        )
        nodes.forEach((n) => obs.observe(n))
        return () => obs.disconnect()
    }, [containerSelector])

    if (items.length === 0) return null

    return (
        <aside className="hidden xl:block w-[200px] flex-shrink-0">
            <div className="sticky top-24 pt-1">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-300 mb-3">
                    On this page
                </p>
                <ul className="space-y-1.5">
                    {items.map((h) => (
                        <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                            <a
                                href={`#${h.id}`}
                                className={`block py-0.5 text-[12.5px] leading-snug transition-colors ${
                                    activeId === h.id
                                        ? 'text-primary font-medium'
                                        : 'text-ink-500 hover:text-ink'
                                }`}
                            >
                                {h.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
