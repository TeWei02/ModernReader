import { useAnnotationStore } from '@/store/annotationStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import type { Highlight, Note } from '@/types/annotation'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type Filter = 'all' | 'highlights' | 'notes'

const COLOR_BORDER: Record<string, string> = {
    yellow: 'border-yellow-400', green: 'border-green-400',
    blue: 'border-blue-400', pink: 'border-pink-400',
}
const COLOR_BG: Record<string, string> = {
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20', green: 'bg-green-50 dark:bg-green-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20', pink: 'bg-pink-50 dark:bg-pink-900/20',
}

export default function NotebookPage() {
    const allHighlights = useAnnotationStore((s) => s.highlights)
    const allNotes = useAnnotationStore((s) => s.notes)
    const removeHighlight = useAnnotationStore((s) => s.removeHighlight)
    const removeNote = useAnnotationStore((s) => s.removeNote)
    const books = useLibraryStore((s) => s.books)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)

    const [filter, setFilter] = useState<Filter>('all')
    const [selectedBookId, setSelectedBookId] = useState<string>('all')
    const [searchQ, setSearchQ] = useState('')

    const booksWithAnnotations = books.filter(
        (b) => allHighlights.some((h) => h.bookId === b.id) || allNotes.some((n) => n.bookId === b.id)
    )

    const filteredHighlights = allHighlights
        .filter((h) => selectedBookId === 'all' || h.bookId === selectedBookId)
        .filter((h) => !searchQ.trim() || h.text.toLowerCase().includes(searchQ.toLowerCase()))

    const filteredNotes = allNotes
        .filter((n) => selectedBookId === 'all' || n.bookId === selectedBookId)
        .filter((n) => !searchQ.trim() || n.content.toLowerCase().includes(searchQ.toLowerCase()))

    const getBookTitle = (bookId: string) => books.find((b) => b.id === bookId)?.title ?? 'Unknown Book'

    const exportMarkdown = () => {
        const lines = [
            '# Notebook Export',
            '',
            '## Highlights',
            ...filteredHighlights.map((h) => `> ${h.text}\n\n— *${getBookTitle(h.bookId)}* (${Math.round(h.location)}%)\n`),
            '## Notes',
            ...filteredNotes.map((n) => `### ${n.title || 'Note'}\n\n${n.content}\n\n— *${getBookTitle(n.bookId)}* (${Math.round(n.location)}%)\n`),
        ].join('\n')
        const blob = new Blob([lines], { type: 'text/markdown' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'notebook-export.md'
        a.click()
        URL.revokeObjectURL(a.href)
        addToast('Exported to Markdown', 'success')
    }

    const total = filteredHighlights.length + filteredNotes.length

    return (
        <div className="max-w-4xl mx-auto px-6 py-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search annotations…"
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm px-3 py-1.5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-accent-500 w-56"
                />

                {/* Book filter */}
                <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm px-2 py-1.5 text-[var(--text-secondary)] focus:outline-none max-w-48 truncate"
                >
                    <option value="all">All books</option>
                    {booksWithAnnotations.map((b) => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                </select>

                {/* Type filter */}
                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-xs">
                    {(['all', 'highlights', 'notes'] as Filter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                'px-3 py-1.5 capitalize transition-colors',
                                filter === f
                                    ? 'bg-accent-600/15 text-accent-600 dark:text-accent-400 font-medium'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]',
                                f !== 'all' && 'border-l border-[var(--border)]'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <span className="text-xs text-[var(--text-secondary)] ml-auto">{total} annotations</span>
                <button
                    onClick={exportMarkdown}
                    disabled={total === 0}
                    className="text-xs border border-[var(--border)] rounded-lg px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-50 transition-colors"
                >
                    Export MD
                </button>
            </div>

            {/* Empty */}
            {total === 0 && (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                    <p className="text-5xl mb-4">📓</p>
                    <p className="text-lg font-semibold text-[var(--text-heading)] mb-2">Your notebook is empty</p>
                    <p className="text-sm">Highlights and notes from your books will appear here.</p>
                </div>
            )}

            {/* Highlights */}
            {(filter === 'all' || filter === 'highlights') && filteredHighlights.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                        Highlights ({filteredHighlights.length})
                    </h2>
                    <div className="flex flex-col gap-3">
                        {filteredHighlights
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .map((h) => (
                                <HighlightCard
                                    key={h.id}
                                    highlight={h}
                                    bookTitle={getBookTitle(h.bookId)}
                                    bookId={h.bookId}
                                    onDelete={() =>
                                        openConfirm('Delete Highlight', 'Remove this highlight?', async () => {
                                            await removeHighlight(h.id)
                                            addToast('Highlight removed', 'info')
                                        })
                                    }
                                />
                            ))}
                    </div>
                </section>
            )}

            {/* Notes */}
            {(filter === 'all' || filter === 'notes') && filteredNotes.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                        Notes ({filteredNotes.length})
                    </h2>
                    <div className="flex flex-col gap-3">
                        {filteredNotes
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map((n) => (
                                <NoteCard
                                    key={n.id}
                                    note={n}
                                    bookTitle={getBookTitle(n.bookId)}
                                    bookId={n.bookId}
                                    onDelete={() =>
                                        openConfirm('Delete Note', 'Remove this note?', async () => {
                                            await removeNote(n.id)
                                            addToast('Note removed', 'info')
                                        })
                                    }
                                />
                            ))}
                    </div>
                </section>
            )}
        </div>
    )
}

function HighlightCard({ highlight, bookTitle, bookId, onDelete }: { highlight: Highlight; bookTitle: string; bookId: string; onDelete: () => void }) {
    return (
        <div className={clsx('group rounded-xl border-l-4 px-4 py-3', COLOR_BORDER[highlight.color], COLOR_BG[highlight.color])}>
            <blockquote className="text-sm text-[var(--text-primary)] leading-relaxed italic">
                "{highlight.text}"
            </blockquote>
            <div className="mt-2 flex items-center justify-between">
                <Link to={`/reader/${bookId}`} className="text-xs text-accent-600 hover:underline truncate max-w-[60%]">
                    {bookTitle}
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--text-secondary)]">{new Date(highlight.createdAt).toLocaleDateString()}</span>
                    <button
                        onClick={onDelete}
                        aria-label="Delete"
                        className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all text-xs"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    )
}

function NoteCard({ note, bookTitle, bookId, onDelete }: { note: Note; bookTitle: string; bookId: string; onDelete: () => void }) {
    return (
        <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 hover:border-accent-400 transition-all">
            {note.title && <p className="text-sm font-semibold text-[var(--text-heading)] mb-1">{note.title}</p>}
            <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{note.content}</p>
            <div className="mt-2 flex items-center justify-between">
                <Link to={`/reader/${bookId}`} className="text-xs text-accent-600 hover:underline truncate max-w-[60%]">
                    {bookTitle}
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--text-secondary)]">{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <button
                        onClick={onDelete}
                        aria-label="Delete"
                        className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all text-xs"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    )
}
