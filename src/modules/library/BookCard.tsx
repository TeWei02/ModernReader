import type { Book } from '@/services/gutendex'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface BookCardProps {
    book: Book
}

function stringToColor(value: string) {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue} 65% 78%)`
}

export function BookCard({ book }: BookCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    const imageCover = book.formats['image/jpeg']
    const htmlUrl = book.formats['text/html'] ?? book.formats['text/html; charset=utf-8']
    const plainTextUrl = book.formats['text/plain; charset=utf-8'] ?? book.formats['text/plain']
    const authorText = book.authors.map((a) => a.name).filter(Boolean).join(', ')

    const titleInitial = (book.title.trim()[0] ?? '?').toUpperCase()
    const coverColor = stringToColor(book.title || String(book.id))

    return (
        <div className="group relative">
            <Link
                to={`/reader/${String(book.id)}`}
                aria-label={`Open ${book.title}`}
                className="block rounded-2xl shadow-md bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-all duration-200"
            >
                {/* Cover */}
                <div className="relative h-[160px] w-full overflow-hidden">
                    {imageCover ? (
                        <img src={imageCover} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div
                            className="flex h-full items-center justify-center"
                            style={{ backgroundColor: coverColor }}
                        >
                            <span className="text-5xl font-bold text-black/45">
                                {titleInitial}
                            </span>
                        </div>
                    )}

                </div>

                {/* Info */}
                <div className="p-3">
                    <p className="font-semibold text-sm line-clamp-2 text-[var(--text-heading)]">{book.title}</p>
                    {authorText && (
                        <p className="text-xs text-gray-400 truncate">{authorText}</p>
                    )}
                    <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                        <span className="font-medium">Downloads: {book.download_count.toLocaleString()}</span>
                    </div>
                </div>
            </Link>

            {/* Context menu button */}
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((v) => !v) }}
                aria-label="Book options"
                className={clsx(
                    'absolute top-2 right-2 rounded-full bg-black/40 p-1 text-white transition-opacity',
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
                    className="absolute top-8 right-2 z-20 min-w-32 rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {htmlUrl && (
                        <a
                            href={htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                        >
                            Open HTML Source
                        </a>
                    )}
                    {plainTextUrl && (
                        <a
                            href={plainTextUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                        >
                            Open Plain Text
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}
