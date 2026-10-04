import { Input } from '@/components/ui/Input'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
    '/': 'Library',
    '/notebook': 'Notebook',
    '/flashcards': 'Flashcards',
    '/agents': 'Agents',
    '/settings': 'Settings',
}

export function TopBar() {
    const location = useLocation()
    const title = routeTitles[location.pathname] ?? 'ModernReader'
    const searchQuery = useLibraryStore((s) => s.searchQuery)
    const setSearchQuery = useLibraryStore((s) => s.setSearchQuery)
    const openNewCollection = useUIStore((s) => s.openNewCollectionModal)
    const accessibilityMode = useUIStore((s) => s.accessibilityMode)
    const cycleAccessibilityMode = useUIStore((s) => s.cycleAccessibilityMode)
    const isLibrary = location.pathname === '/'

    const modeLabel = accessibilityMode === 'standard'
        ? 'Standard'
        : accessibilityMode === 'kids'
            ? 'Kids'
            : 'Senior'

    return (
        <header className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 border-b border-[var(--border)] bg-[var(--toolbar-bg)] backdrop-blur-sm">
            <h1 className="text-lg font-semibold text-[var(--text-heading)] shrink-0">{title}</h1>

            <button
                onClick={cycleAccessibilityMode}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                title="Switch accessibility mode"
            >
                Easy Mode: {modeLabel}
            </button>

            {isLibrary && (
                <>
                    <div className="flex-1 max-w-sm">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search books, authors, tags…"
                            aria-label="Search library"
                            icon={
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                        />
                    </div>
                    <button
                        onClick={openNewCollection}
                        className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Collection
                    </button>
                </>
            )}
        </header>
    )
}
