import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import type { Book } from '@/types/book'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

interface BookListProps {
    books: Book[]
}

export function BookList({ books }: BookListProps) {
    const navigate = useNavigate()
    const removeBook = useLibraryStore((s) => s.removeBook)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)

    const handleDelete = (book: Book) => {
        openConfirm(
            'Remove Book',
            `Remove "${book.title}" from your library?`,
            async () => {
                await removeBook(book.id)
                addToast('Book removed', 'success')
            }
        )
    }

    return (
        <div className="flex flex-col divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
            {books.map((book) => (
                <div
                    key={book.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/reader/${book.id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/reader/${book.id}`) }}
                    className="group flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
                >
                    {/* Cover thumbnail */}
                    <div className="h-14 w-10 shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 flex items-center justify-center">
                        {book.metadata.cover
                            ? <img src={book.metadata.cover} alt="" className="h-full w-full object-cover" />
                            : <span className="text-xl">{book.format === 'epub' ? '📗' : book.format === 'pdf' ? '📕' : '📄'}</span>
                        }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-heading)] truncate">{book.title}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{book.authors.join(', ') || 'Unknown author'}</p>
                        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                            <span className="uppercase font-medium">{book.format}</span>
                            {book.totalWords && <span>{book.totalWords.toLocaleString()} words</span>}
                            {book.tags.slice(0, 3).map((t) => (
                                <span key={t} className="rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 px-2 py-0.5">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Progress */}
                    {book.readingProgress != null && book.readingProgress > 0 && (
                        <div className="shrink-0 flex flex-col items-end gap-1">
                            <span className={clsx('text-xs font-medium', book.readingProgress >= 100 ? 'text-green-500' : 'text-[var(--text-secondary)]')}>
                                {book.readingProgress >= 100 ? '✓ Done' : `${Math.round(book.readingProgress)}%`}
                            </span>
                            <div className="h-1 w-20 rounded-full bg-[var(--border)]">
                                <div className="h-1 rounded-full bg-accent-500" style={{ width: `${Math.min(100, book.readingProgress)}%` }} />
                            </div>
                        </div>
                    )}

                    {/* Delete */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(book) }}
                        aria-label="Remove book"
                        className="shrink-0 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--hover-bg)] transition-all"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    )
}
