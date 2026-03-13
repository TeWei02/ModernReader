import { FullPageSpinner } from '@/components/ui/Spinner'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'
import { BookCard } from './BookCard'
import { BookList } from './BookList'
import { ImportButton } from './ImportButton'
import { NewCollectionModal } from './NewCollectionModal'
import { TagFilter } from './TagFilter'

export default function LibraryPage() {
    const books = useLibraryStore((s) => s.filteredBooks())
    const allTags = useLibraryStore((s) => s.allTags())
    const viewMode = useLibraryStore((s) => s.viewMode)
    const setViewMode = useLibraryStore((s) => s.setViewMode)
    const sortBy = useLibraryStore((s) => s.sortBy)
    const setSortBy = useLibraryStore((s) => s.setSortBy)
    const sortOrder = useLibraryStore((s) => s.sortOrder)
    const setSortOrder = useLibraryStore((s) => s.setSortOrder)
    const selectedCollectionId = useLibraryStore((s) => s.selectedCollectionId)
    const collections = useLibraryStore((s) => s.collections)
    const isLoading = useLibraryStore((s) => s.isLoading)
    const isImportModalOpen = useUIStore((s) => s.isImportModalOpen)
    const isNewCollectionModalOpen = useUIStore((s) => s.isNewCollectionModalOpen)
    const closeNewCollection = useUIStore((s) => s.closeNewCollectionModal)

    const activeCollection = collections.find((c) => c.id === selectedCollectionId)

    if (isLoading) return <FullPageSpinner label="Loading library…" />

    return (
        <div className="flex h-full">
            {/* Tag filter sidebar */}
            <TagFilter tags={allTags} />

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                {/* Toolbar row */}
                <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
                    {activeCollection ? (
                        <h2 className="text-sm font-semibold text-[var(--text-heading)]">
                            📁 {activeCollection.name}
                            <span className="ml-2 font-normal text-[var(--text-secondary)]">({books.length})</span>
                        </h2>
                    ) : (
                        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
                            {books.length} {books.length === 1 ? 'book' : 'books'}
                        </h2>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] text-xs px-2 py-1.5 focus:outline-none"
                        >
                            <option value="addedAt">Added</option>
                            <option value="lastOpenedAt">Last opened</option>
                            <option value="title">Title</option>
                            <option value="authors">Author</option>
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

                {/* Book grid/list */}
                {books.length === 0 ? (
                    <EmptyState />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
                        {books.map((book) => <BookCard key={book.id} book={book} />)}
                    </div>
                ) : (
                    <div className="p-4">
                        <BookList books={books} />
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

function EmptyState() {
    const openImport = useUIStore((s) => s.openImportModal)
    return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-8">
            <div className="text-6xl">📚</div>
            <div>
                <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-1">Your library is empty</h3>
                <p className="text-sm text-[var(--text-secondary)]">Import a Markdown, TXT, or EPUB file to get started.</p>
            </div>
            <button
                onClick={openImport}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Import your first book
            </button>
        </div>
    )
}
