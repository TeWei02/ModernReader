import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import type { Book } from '@/types/book'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface BookCardProps {
    book: Book
}

function formatProgress(p?: number) {
    if (p == null || p === 0) return null
    if (p >= 100) return '✓ Finished'
    return `${Math.round(p)}%`
}

function timeAgo(ts?: number) {
    if (!ts) return null
    const diff = Date.now() - ts
    const d = Math.floor(diff / 86400000)
    if (d === 0) return 'Today'
    if (d === 1) return 'Yesterday'
    if (d < 30) return `${d}d ago`
    const m = Math.floor(d / 30)
    if (m < 12) return `${m}mo ago`
    return `${Math.floor(m / 12)}y ago`
}

export function BookCard({ book }: BookCardProps) {
    const navigate = useNavigate()
    const removeBook = useLibraryStore((s) => s.removeBook)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleOpen = () => navigate(`/reader/${book.id}`)

    const handleDelete = () => {
        openConfirm(
            'Remove Book',
            `Remove "${book.title}" from your library? All annotations will also be deleted.`,
            async () => {
                await removeBook(book.id)
                addToast('Book removed', 'success')
            }
        )
    }

    const progress = formatProgress(book.readingProgress)
    const opened = timeAgo(book.lastOpenedAt)

    return (
        <div
            className="group relative flex flex-col rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-accent-400 transition-all hover:shadow-md cursor-pointer"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label={`Open ${book.title}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
        >
            {/* Cover */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 overflow-hidden">
                {book.metadata.cover ? (
                    <img src={book.metadata.cover} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-4xl opacity-40">
                            {book.format === 'epub' ? '📗' : book.format === 'pdf' ? '📕' : '📄'}
                        </span>
                    </div>
                )}

                {/* Progress bar */}
                {book.readingProgress != null && book.readingProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div
                            className="h-full bg-accent-500 transition-all"
                            style={{ width: `${Math.min(100, book.readingProgress)}%` }}
                        />
                    </div>
                )}

                {/* Format badge */}
                <span className="absolute top-2 right-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white uppercase">
                    {book.format}
                </span>

                {/* Context menu button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
                    aria-label="Book options"
                    className={clsx(
                        'absolute top-2 left-2 rounded-full bg-black/40 p-1 text-white transition-opacity',
                        menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                    </svg>
                </button>

                {/* Context menu */}
                {menuOpen && (
                    <div
                        className="absolute top-8 left-2 z-20 min-w-32 rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleDelete}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-[var(--hover-bg)] transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-0.5 p-2.5">
                <p className="text-sm font-semibold text-[var(--text-heading)] line-clamp-2 leading-tight">{book.title}</p>
                {book.authors.length > 0 && (
                    <p className="text-xs text-[var(--text-secondary)] truncate">{book.authors.join(', ')}</p>
                )}
                <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                    {progress && <span className={clsx('font-medium', progress === '✓ Finished' && 'text-green-500')}>{progress}</span>}
                    {opened && <span>{opened}</span>}
                </div>
            </div>
        </div>
    )
}
