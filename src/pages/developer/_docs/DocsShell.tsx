import type { ReactNode } from 'react'
import DocsSidebar from './DocsSidebar'
import DocsTOC from './DocsTOC'
import NextPrev from './NextPrev'

type Props = {
    children: ReactNode
    isStaff: boolean
    toc?: boolean
    pager?: boolean
    currentPath?: string
}

export default function DocsShell({ children, isStaff, toc = true, pager = true, currentPath }: Props) {
    return (
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
            <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px] lg:gap-10 xl:gap-12">
                <aside className="hidden lg:block">
                    <div className="sticky top-20">
                        <DocsSidebar isStaff={isStaff} />
                    </div>
                </aside>

                <main data-docs-content className="min-w-0 animate-fade-up">
                    <div className="max-w-[720px]">
                        {children}
                        {pager && currentPath && <NextPrev currentPath={currentPath} />}
                    </div>
                </main>

                {toc && <DocsTOC />}
            </div>
        </div>
    )
}
