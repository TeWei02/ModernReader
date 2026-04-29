import { useReaderStore } from '@/store/readerStore'
import { clsx } from 'clsx'
import { type RefObject } from 'react'
import type { TocEntry } from './ReaderContent'

interface TableOfContentsProps {
    entries: TocEntry[]
    contentRef: RefObject<HTMLDivElement>
}

export function TableOfContents({ entries, contentRef }: TableOfContentsProps) {
    const activeHeadingId = useReaderStore((s) => s.activeHeadingId)
    const toggleToc = useReaderStore((s) => s.toggleToc)

    const scrollTo = (id: string) => {
        const container = contentRef.current
        if (!container) return
        const el = container.querySelector(`#${id}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)] shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Contents
                </p>
                <button
                    onClick={toggleToc}
                    aria-label="Close table of contents"
                    className="rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2" aria-label="Table of contents">
                {entries.length === 0 ? (
                    <p className="px-3 py-8 text-xs text-center text-[var(--text-secondary)]">No headings found</p>
                ) : (
                    entries.map((entry) => (
                        <button
                            key={entry.id}
                            onClick={() => scrollTo(entry.id)}
                            className={clsx(
                                'w-full text-left rounded-lg px-3 py-1.5 text-sm transition-colors',
                                activeHeadingId === entry.id
                                    ? 'text-accent-600 dark:text-accent-400 font-medium bg-accent-600/10'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]',
                                entry.level === 1 && 'pl-3',
                                entry.level === 2 && 'pl-6 text-xs',
                                entry.level === 3 && 'pl-8 text-xs opacity-80',
                                entry.level >= 4 && 'pl-10 text-xs opacity-60',
                            )}
                        >
                            {entry.text}
                        </button>
                    ))
                )}
            </nav>
        </div>
    )
}
