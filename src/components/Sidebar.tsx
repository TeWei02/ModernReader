import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'
import { NavLink, useNavigate } from 'react-router-dom'

interface NavItem {
    to: string
    label: string
    icon: (active: boolean) => JSX.Element
}

const NAV_ITEMS: NavItem[] = [
    {
        to: '/',
        label: 'Library',
        icon: () => (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 3H4a1 1 0 00-1 1v16a1 1 0 001 1h4M8 3v18M8 3h8m0 0h4a1 1 0 011 1v16a1 1 0 01-1 1h-4m0-18v18" />
            </svg>
        ),
    },
    {
        to: '/notebook',
        label: 'Notebook',
        icon: () => (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        to: '/flashcards',
        label: 'Flashcards',
        icon: () => (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        to: '/settings',
        label: 'Settings',
        icon: () => (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
]

export function Sidebar() {
    const collapsed = useUIStore((s) => s.sidebarCollapsed)
    const toggleSidebar = useUIStore((s) => s.toggleSidebar)
    const openImportModal = useUIStore((s) => s.openImportModal)
    const collections = useLibraryStore((s) => s.collections)
    const selectedCollectionId = useLibraryStore((s) => s.selectedCollectionId)
    const setSelectedCollection = useLibraryStore((s) => s.setSelectedCollection)
    const navigate = useNavigate()

    return (
        <aside
            className={clsx(
                'fixed left-0 top-0 z-30 h-full flex flex-col',
                'bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-all duration-200',
                collapsed ? 'w-14' : 'w-60'
            )}
        >
            {/* Logo + toggle */}
            <div className="flex h-14 items-center justify-between px-3 border-b border-[var(--border)]">
                {!collapsed && (
                    <span className="text-base font-bold text-[var(--text-heading)] tracking-tight select-none">
                        📖 ModernReader
                    </span>
                )}
                <button
                    onClick={toggleSidebar}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="ml-auto rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {collapsed
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        }
                    </svg>
                </button>
            </div>

            {/* Import button */}
            <div className="px-2 py-2">
                <button
                    onClick={openImportModal}
                    className={clsx(
                        'w-full flex items-center gap-2 rounded-lg px-2 py-2',
                        'bg-accent-600 text-white hover:bg-accent-700 transition-colors text-sm font-medium',
                        collapsed && 'justify-center'
                    )}
                    aria-label="Import book"
                >
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {!collapsed && <span>Import Book</span>}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-1">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => setSelectedCollection(null)}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors mb-0.5',
                                isActive
                                    ? 'bg-accent-600/15 text-accent-700 dark:text-accent-400 font-medium'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]',
                                collapsed && 'justify-center px-2'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="shrink-0">{icon(isActive)}</span>
                                {!collapsed && <span>{label}</span>}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Collections */}
                {!collapsed && collections.length > 0 && (
                    <div className="mt-3 px-2">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                            Collections
                        </p>
                        {collections.map((col) => (
                            <button
                                key={col.id}
                                onClick={() => { setSelectedCollection(col.id); navigate('/') }}
                                className={clsx(
                                    'mb-0.5 w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors text-left',
                                    selectedCollectionId === col.id
                                        ? 'bg-accent-600/15 text-accent-700 dark:text-accent-400'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                                )}
                            >
                                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span className="truncate">{col.name}</span>
                                <span className="ml-auto shrink-0 text-xs text-[var(--text-secondary)]">{col.bookIds.length}</span>
                            </button>
                        ))}
                    </div>
                )}
            </nav>

            {/* Sync status */}
            {!collapsed && (
                <div className="px-3 py-2 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--text-secondary)]">Local mode · no sync</p>
                </div>
            )}
        </aside>
    )
}
