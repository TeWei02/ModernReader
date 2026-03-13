import { Input } from '@/components/ui/Input'
import { useReaderStore } from '@/store/readerStore'
import { clsx } from 'clsx'
import { useState, type RefObject } from 'react'

interface SearchMatch {
    text: string
    context: string
    index: number
}

interface SearchPanelProps {
    content: string
    contentRef: RefObject<HTMLDivElement>
}

export function SearchPanel({ content, contentRef }: SearchPanelProps) {
    const searchQuery = useReaderStore((s) => s.searchQuery)
    const setSearchQuery = useReaderStore((s) => s.setSearchQuery)
    const toggleSearch = useReaderStore((s) => s.toggleSearch)
    const [activeMatch, setActiveMatch] = useState(0)

    const matches: SearchMatch[] = []
    if (searchQuery.trim().length >= 2) {
        const q = searchQuery.toLowerCase()
        let idx = 0
        const plain = content
        let found = plain.toLowerCase().indexOf(q, idx)
        while (found !== -1 && matches.length < 200) {
            matches.push({
                text: plain.slice(found, found + searchQuery.length),
                context: plain.slice(Math.max(0, found - 60), found + searchQuery.length + 60),
                index: found,
            })
            idx = found + 1
            found = plain.toLowerCase().indexOf(q, idx)
        }
    }

    const scrollToMatch = (i: number) => {
        setActiveMatch(i)
        const container = contentRef.current
        if (!container) return
        const marks = container.querySelectorAll<HTMLElement>('mark.search-match')
        const el = marks[i]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)] shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Search</p>
                <button
                    onClick={toggleSearch}
                    aria-label="Close search"
                    className="rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="px-3 pt-3 pb-2 shrink-0">
                <Input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setActiveMatch(0) }}
                    placeholder="Search in book…"
                    autoFocus
                    icon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
                {searchQuery.trim() && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                        {matches.length === 0 ? 'No results' : `${matches.length} result${matches.length !== 1 ? 's' : ''}`}
                    </p>
                )}
            </div>

            {/* Navigation buttons */}
            {matches.length > 1 && (
                <div className="flex items-center gap-2 px-3 pb-2 shrink-0">
                    <button
                        onClick={() => scrollToMatch((activeMatch - 1 + matches.length) % matches.length)}
                        aria-label="Previous match"
                        className="rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <span className="text-xs text-[var(--text-secondary)]">{activeMatch + 1} / {matches.length}</span>
                    <button
                        onClick={() => scrollToMatch((activeMatch + 1) % matches.length)}
                        aria-label="Next match"
                        className="rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Results list */}
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
                {matches.map((m, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToMatch(i)}
                        className={clsx(
                            'w-full text-left px-3 py-2.5 text-xs transition-colors',
                            i === activeMatch
                                ? 'bg-accent-600/10 text-accent-700 dark:text-accent-300'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                        )}
                    >
                        <span>
                            {m.context.slice(0, m.context.toLowerCase().indexOf(searchQuery.toLowerCase()))}
                            <mark className="bg-yellow-300 dark:bg-yellow-700 text-inherit rounded px-0.5">{m.text}</mark>
                            {m.context.slice(m.context.toLowerCase().indexOf(searchQuery.toLowerCase()) + searchQuery.length)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
