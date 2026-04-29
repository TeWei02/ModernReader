import { fetchBooks, type Book as GutendexBook } from '@/services/gutendex'
import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { BookCard } from './BookCard'
import { ImportButton } from './ImportButton'
import { NewCollectionModal } from './NewCollectionModal'

export default function LibraryPage() {
    const [books, setBooks] = useState<GutendexBook[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState<'download_count' | 'title'>('download_count')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const isImportModalOpen = useUIStore((s) => s.isImportModalOpen)
    const isNewCollectionModalOpen = useUIStore((s) => s.isNewCollectionModalOpen)
    const openNewCollection = useUIStore((s) => s.openNewCollectionModal)
    const closeNewCollection = useUIStore((s) => s.closeNewCollectionModal)

    useEffect(() => {
        let active = true
        const timer = setTimeout(async () => {
            setIsLoading(true)
            setErrorMessage(null)
            try {
                const result = await fetchBooks(searchQuery)
                if (!active) return

                const sorted = [...result].sort((a, b) => {
                    const av = sortBy === 'title' ? a.title.toLowerCase() : a.download_count
                    const bv = sortBy === 'title' ? b.title.toLowerCase() : b.download_count
                    if (av < bv) return sortOrder === 'asc' ? -1 : 1
                    if (av > bv) return sortOrder === 'asc' ? 1 : -1
                    return 0
                })
                setBooks(sorted)
            } catch (error) {
                if (!active) return
                setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch books from Gutendex.')
                setBooks([])
            } finally {
                if (active) setIsLoading(false)
            }
        }, 320)

        return () => {
            active = false
            clearTimeout(timer)
        }
    }, [searchQuery, sortBy, sortOrder])

    return (
        <div className="flex h-full">
            <div className="flex-1 overflow-y-auto">
                {/* Toolbar */}
                <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)] px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--text-heading)]">Library</h1>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{books.length} books from Gutendex</p>
                        </div>
                        <button
                            onClick={openNewCollection}
                            className="rounded-xl bg-accent-600 px-3 py-2 text-sm font-medium text-white hover:bg-accent-700 transition-colors"
                        >
                            New Collection
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="relative w-full max-w-md">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="搜尋書名或作者..."
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                            />
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'download_count' | 'title')}
                                className="rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] text-xs px-2 py-1.5 focus:outline-none"
                            >
                                <option value="download_count">Popular</option>
                                <option value="title">Title</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                                {sortOrder === 'asc'
                                    ? <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                    : <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" /></svg>
                                }
                            </button>

                            {/* View mode toggle */}
                            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Grid view"
                                    className={clsx('p-1.5 transition-colors', viewMode === 'grid' ? 'bg-accent-600/15 text-accent-600' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]')}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    aria-label="List view"
                                    className={clsx('p-1.5 transition-colors border-l border-[var(--border)]', viewMode === 'list' ? 'bg-accent-600/15 text-accent-600' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]')}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book grid/list */}
                {errorMessage && (
                    <div className="mx-6 mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                        Failed to load Gutendex books: {errorMessage}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonBookCard key={index} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                        {books.map((book) => <BookCard key={book.id} book={book} />)}
                    </div>
                )}
            </div>

            {/* Import modal */}
            {isImportModalOpen && <ImportButton />}

            {/* New collection modal */}
            <NewCollectionModal open={isNewCollectionModalOpen} onClose={closeNewCollection} />
        </div>
    )
}

function SkeletonBookCard() {
    return (
        <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 animate-pulse">
            <div className="h-[140px] rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-8">
            <div className="text-6xl">📚</div>
            <div>
                <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-1">No books found</h3>
                <p className="text-sm text-[var(--text-secondary)]">Try another search keyword for Gutendex.</p>
            </div>
        </div>
    )
}
