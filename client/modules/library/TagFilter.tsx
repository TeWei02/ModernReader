import { useLibraryStore } from '@/store/libraryStore'
import { clsx } from 'clsx'

interface TagFilterProps {
    tags: string[]
}

export function TagFilter({ tags }: TagFilterProps) {
    const selectedTags = useLibraryStore((s) => s.selectedTags)
    const toggleTag = useLibraryStore((s) => s.toggleTag)
    const setSelectedTags = useLibraryStore((s) => s.setSelectedTags)

    if (tags.length === 0) return null

    return (
        <aside className="hidden lg:flex w-44 shrink-0 flex-col border-r border-[var(--border)] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--bg)] px-3 py-3 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Tags</p>
                    {selectedTags.length > 0 && (
                        <button
                            onClick={() => setSelectedTags([])}
                            className="text-xs text-accent-500 hover:text-accent-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-0.5 px-2 py-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={clsx(
                            'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-left transition-colors',
                            selectedTags.includes(tag)
                                ? 'bg-accent-600/15 text-accent-700 dark:text-accent-400 font-medium'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                        )}
                    >
                        <span className="h-2 w-2 rounded-full bg-accent-400 shrink-0" />
                        <span className="truncate">{tag}</span>
                    </button>
                ))}
            </div>
        </aside>
    )
}
