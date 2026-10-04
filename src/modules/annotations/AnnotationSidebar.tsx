import { useAnnotationStore } from '@/store/annotationStore'
import { useReaderStore } from '@/store/readerStore'
import { useUIStore } from '@/store/uiStore'
import type { Highlight, Note } from '@/types/annotation'
import { clsx } from 'clsx'
import { useMemo, useState, type RefObject } from 'react'
import { BookmarkList } from './BookmarkList'
import { NoteEditor } from './NoteEditor'

type Tab = 'highlights' | 'notes' | 'bookmarks'

interface AnnotationSidebarProps {
    bookId: string
    contentRef: RefObject<HTMLDivElement>
}

const COLOR_STYLES: Record<string, string> = {
    yellow: 'bg-yellow-200/60 border-yellow-400',
    green: 'bg-green-200/60  border-green-400',
    blue: 'bg-blue-200/60   border-blue-400',
    pink: 'bg-pink-200/60   border-pink-400',
}

export function AnnotationSidebar({ bookId, contentRef }: AnnotationSidebarProps) {
    const [tab, setTab] = useState<Tab>('highlights')
    const toggleAnnotationSidebar = useReaderStore((s) => s.toggleAnnotationSidebar)
    const allHighlights = useAnnotationStore((s) => s.highlights)
    const allNotes = useAnnotationStore((s) => s.notes)
    const allBookmarks = useAnnotationStore((s) => s.bookmarks)
    const highlights = useMemo(() => allHighlights.filter((h) => h.bookId === bookId), [allHighlights, bookId])
    const notes = useMemo(() => allNotes.filter((n) => n.bookId === bookId), [allNotes, bookId])
    const bookmarks = useMemo(() => allBookmarks.filter((b) => b.bookId === bookId), [allBookmarks, bookId])
    const removeHighlight = useAnnotationStore((s) => s.removeHighlight)
    const removeNote = useAnnotationStore((s) => s.removeNote)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)
    const [editingNote, setEditingNote] = useState<Note | null>(null)

    const scrollTo = (location: number) => {
        const container = contentRef.current
        if (!container) return
        container.scrollTop = (location / 100) * (container.scrollHeight - container.clientHeight)
    }

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'highlights', label: 'Highlights', count: highlights.length },
        { key: 'notes', label: 'Notes', count: notes.length },
        { key: 'bookmarks', label: 'Bookmarks', count: bookmarks.length },
    ]

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)] shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Annotations</p>
                <button onClick={toggleAnnotationSidebar} className="rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] shrink-0">
                {tabs.map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={clsx(
                            'flex-1 py-2 text-xs font-medium transition-colors',
                            tab === key
                                ? 'border-b-2 border-accent-500 text-accent-600 dark:text-accent-400'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                    >
                        {label}
                        {count > 0 && <span className="ml-1 text-[10px] opacity-70">({count})</span>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {tab === 'highlights' && (
                    <div className="flex flex-col gap-2 p-3">
                        {highlights.length === 0
                            ? <Empty icon="🖊️" text="No highlights yet. Select text while reading." />
                            : highlights.sort((a, b) => a.location - b.location).map((h) => (
                                <HighlightItem
                                    key={h.id}
                                    highlight={h}
                                    onScrollTo={() => scrollTo(h.location)}
                                    onDelete={() => openConfirm('Delete Highlight', 'Remove this highlight?', async () => {
                                        await removeHighlight(h.id)
                                        addToast('Highlight removed', 'info')
                                    })}
                                />
                            ))
                        }
                    </div>
                )}

                {tab === 'notes' && (
                    <div className="flex flex-col gap-2 p-3">
                        {editingNote && (
                            <NoteEditor
                                note={editingNote}
                                onClose={() => setEditingNote(null)}
                            />
                        )}
                        {!editingNote && notes.length === 0
                            ? <Empty icon="📝" text="No notes yet. Select text and press the note button." />
                            : !editingNote && notes.sort((a, b) => a.location - b.location).map((n) => (
                                <NoteItem
                                    key={n.id}
                                    note={n}
                                    onScrollTo={() => scrollTo(n.location)}
                                    onEdit={() => setEditingNote(n)}
                                    onDelete={() => openConfirm('Delete Note', 'Remove this note?', async () => {
                                        await removeNote(n.id)
                                        addToast('Note removed', 'info')
                                    })}
                                />
                            ))
                        }
                    </div>
                )}

                {tab === 'bookmarks' && (
                    <BookmarkList bookId={bookId} onScrollTo={scrollTo} />
                )}
            </div>
        </div>
    )
}

function HighlightItem({
    highlight, onScrollTo, onDelete,
}: { highlight: Highlight; onScrollTo: () => void; onDelete: () => void }) {
    return (
        <div
            className={clsx('group rounded-lg border-l-4 px-3 py-2 cursor-pointer hover:shadow-sm transition-all', COLOR_STYLES[highlight.color])}
            onClick={onScrollTo}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onScrollTo() }}
        >
            <p className="text-xs text-[var(--text-primary)] leading-relaxed line-clamp-4">{highlight.text}</p>
            <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)]">{Math.round(highlight.location)}%</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete() }}
                    aria-label="Delete highlight"
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

function NoteItem({
    note, onScrollTo, onEdit, onDelete,
}: { note: Note; onScrollTo: () => void; onEdit: () => void; onDelete: () => void }) {
    return (
        <div
            className="group rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 cursor-pointer hover:border-accent-400 transition-all"
            onClick={onScrollTo}
            role="button"
            tabIndex={0}
        >
            <p className="text-xs font-medium text-[var(--text-heading)] truncate">{note.title || note.content.slice(0, 40)}</p>
            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">{note.content}</p>
            <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)]">{Math.round(note.location)}%</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={(e) => { e.stopPropagation(); onEdit() }} aria-label="Edit note"
                        className="text-[var(--text-secondary)] hover:text-accent-500">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete() }} aria-label="Delete note"
                        className="text-[var(--text-secondary)] hover:text-red-500">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

function Empty({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="text-center py-8 text-[var(--text-secondary)]">
            <p className="text-3xl mb-2">{icon}</p>
            <p className="text-xs">{text}</p>
        </div>
    )
}
