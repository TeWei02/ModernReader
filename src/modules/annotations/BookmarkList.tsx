import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAnnotationStore } from '@/store/annotationStore'
import { useReaderStore } from '@/store/readerStore'
import { useUIStore } from '@/store/uiStore'
import { useState } from 'react'

interface BookmarkListProps {
    bookId: string
    onScrollTo: (location: number) => void
}

export function BookmarkList({ bookId, onScrollTo }: BookmarkListProps) {
    const bookmarks = useAnnotationStore((s) => s.bookmarksForBook(bookId))
    const addBookmark = useAnnotationStore((s) => s.addBookmark)
    const removeBookmark = useAnnotationStore((s) => s.removeBookmark)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)
    const [newName, setNewName] = useState('')

    // Get current scroll position for new bookmark
    const getCurrentLocation = (): number => {
        const store = useReaderStore.getState()
        if (!store.currentBookId) return 0
        // TODO: get from scroll position tracking
        return 0
    }

    const handleAdd = async () => {
        const name = newName.trim() || `Bookmark ${bookmarks.length + 1}`
        await addBookmark(bookId, name, getCurrentLocation())
        setNewName('')
        addToast('Bookmark added', 'success')
    }

    return (
        <div className="p-3 flex flex-col gap-3">
            {/* Add bookmark */}
            <div className="flex gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                    placeholder="Bookmark name (optional)"
                    className="flex-1 text-xs"
                />
                <Button size="sm" onClick={handleAdd}>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </Button>
            </div>

            {/* Bookmark list */}
            {bookmarks.length === 0 ? (
                <div className="text-center py-6 text-[var(--text-secondary)]">
                    <p className="text-2xl mb-2">🔖</p>
                    <p className="text-xs">No bookmarks yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    {bookmarks.sort((a, b) => a.location - b.location).map((bm) => (
                        <div
                            key={bm.id}
                            className="group flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-2 cursor-pointer hover:border-accent-400 transition-all"
                            onClick={() => onScrollTo(bm.location)}
                            role="button"
                            tabIndex={0}
                        >
                            <span className="text-accent-500">🔖</span>
                            <span className="flex-1 text-xs text-[var(--text-primary)] truncate">{bm.name}</span>
                            <span className="text-[10px] text-[var(--text-secondary)] shrink-0">{Math.round(bm.location)}%</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    openConfirm('Delete Bookmark', `Remove bookmark "${bm.name}"?`, async () => {
                                        await removeBookmark(bm.id)
                                        addToast('Bookmark removed', 'info')
                                    })
                                }}
                                aria-label="Delete bookmark"
                                className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
