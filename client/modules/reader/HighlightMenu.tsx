import { useAnnotationStore } from '@/store/annotationStore'
import { useUIStore } from '@/store/uiStore'
import type { HighlightColor } from '@/types/annotation'
import { clsx } from 'clsx'
import { useState } from 'react'

interface HighlightMenuProps {
    bookId: string
    selection: {
        text: string
        context: string
        location: number
        x: number
        y: number
    }
    onDismiss: () => void
}

const COLORS: { color: HighlightColor; cls: string; label: string }[] = [
    { color: 'yellow', cls: 'bg-yellow-300 hover:bg-yellow-400', label: 'Yellow' },
    { color: 'green', cls: 'bg-green-300  hover:bg-green-400', label: 'Green' },
    { color: 'blue', cls: 'bg-blue-300   hover:bg-blue-400', label: 'Blue' },
    { color: 'pink', cls: 'bg-pink-300   hover:bg-pink-400', label: 'Pink' },
]

export function HighlightMenu({ bookId, selection, onDismiss }: HighlightMenuProps) {
    const addHighlight = useAnnotationStore((s) => s.addHighlight)
    const addNote = useAnnotationStore((s) => s.addNote)
    const addToast = useUIStore((s) => s.addToast)
    const [showNoteInput, setShowNoteInput] = useState(false)
    const [noteContent, setNoteContent] = useState('')

    const handleHighlight = async (color: HighlightColor) => {
        await addHighlight(bookId, selection.text, selection.context, color, selection.location)
        addToast('Highlight saved', 'success')
        onDismiss()
    }

    const handleSaveNote = async () => {
        await addNote({
            bookId,
            content: noteContent,
            location: selection.location,
            tags: [],
        })
        addToast('Note saved', 'success')
        onDismiss()
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(selection.text).then(() => {
            addToast('Copied to clipboard', 'info')
            onDismiss()
        })
    }

    return (
        <div
            data-highlight-menu=""
            role="toolbar"
            aria-label="Highlight options"
            className={clsx(
                'absolute z-30 flex flex-col gap-1 rounded-xl shadow-lg',
                'border border-[var(--border)] bg-[var(--bg)] p-2',
                'animate-fade-in'
            )}
            style={{ left: Math.max(8, selection.x - 80), top: Math.max(8, selection.y) }}
        >
            {!showNoteInput ? (
                <div className="flex items-center gap-1">
                    {/* Color buttons */}
                    {COLORS.map(({ color, cls, label }) => (
                        <button
                            key={color}
                            onClick={() => handleHighlight(color)}
                            aria-label={`Highlight ${label}`}
                            title={`Highlight ${label}`}
                            className={clsx('h-6 w-6 rounded-full transition-transform hover:scale-110 border-2 border-white shadow-sm', cls)}
                        />
                    ))}

                    <div className="w-px h-4 bg-[var(--border)] mx-0.5" />

                    {/* Note button */}
                    <button
                        onClick={() => setShowNoteInput(true)}
                        title="Add note"
                        aria-label="Add note"
                        className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Copy button */}
                    <button
                        onClick={handleCopy}
                        title="Copy text"
                        aria-label="Copy text"
                        className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>

                    {/* Dismiss */}
                    <button
                        onClick={onDismiss}
                        title="Dismiss"
                        aria-label="Dismiss"
                        className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2 min-w-56">
                    <p className="text-xs text-[var(--text-secondary)] italic truncate">"{selection.text.slice(0, 60)}{selection.text.length > 60 ? '…' : ''}"</p>
                    <textarea
                        autoFocus
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Write a note…"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm px-2 py-1.5 resize-none text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-accent-500 min-h-16"
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setShowNoteInput(false)}
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNote}
                            disabled={!noteContent.trim()}
                            className="rounded-lg bg-accent-600 text-white text-xs px-3 py-1 hover:bg-accent-700 disabled:opacity-50 transition-colors"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
