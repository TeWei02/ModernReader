import { useReaderStore } from '@/store/readerStore'
import type { Book } from '@/types/book'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

interface ReaderToolbarProps {
    book: Book
}

interface ToolbarButton {
    label: string
    icon: JSX.Element
    active?: boolean
    onClick: () => void
}

export function ReaderToolbar({ book }: ReaderToolbarProps) {
    const navigate = useNavigate()
    const tocVisible = useReaderStore((s) => s.tocVisible)
    const searchVisible = useReaderStore((s) => s.searchVisible)
    const annotationSidebarVisible = useReaderStore((s) => s.annotationSidebarVisible)
    const aiPanelVisible = useReaderStore((s) => s.aiPanelVisible)
    const toggleToc = useReaderStore((s) => s.toggleToc)
    const toggleSearch = useReaderStore((s) => s.toggleSearch)
    const toggleAnnotationSidebar = useReaderStore((s) => s.toggleAnnotationSidebar)
    const toggleAiPanel = useReaderStore((s) => s.toggleAiPanel)
    const settings = useReaderStore((s) => s.settings)
    const updateSettings = useReaderStore((s) => s.updateSettings)

    const typographyPanelVisible = useReaderStore((s) => s.typographyPanelVisible)
    const toggleTypographyPanel = useReaderStore((s) => s.toggleTypographyPanel)

    const buttons: ToolbarButton[] = [
        {
            label: 'Back to Library',
            onClick: () => navigate('/'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            ),
        },
    ]

    const secondaryButtons: ToolbarButton[] = [
        {
            label: 'Table of Contents',
            active: tocVisible,
            onClick: toggleToc,
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                </svg>
            ),
        },
        {
            label: 'Search',
            active: searchVisible,
            onClick: toggleSearch,
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
        },
        {
            label: 'Annotations',
            active: annotationSidebarVisible,
            onClick: toggleAnnotationSidebar,
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
        },
        {
            label: 'AI Assistant',
            active: aiPanelVisible,
            onClick: toggleAiPanel,
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
            ),
        },
        {
            label: 'Typography',
            active: typographyPanelVisible,
            onClick: toggleTypographyPanel,
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10m-10 6h16" />
                </svg>
            ),
        },
    ]

    return (
        <header className="h-12 flex items-center gap-1 px-3 border-b border-[var(--border)] bg-[var(--toolbar-bg)] backdrop-blur-sm shrink-0">
            {/* Back */}
            {buttons.map((b) => (
                <ToolBtn key={b.label} {...b} />
            ))}

            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            {/* Title */}
            <div className="flex-1 min-w-0 px-2">
                <p className="text-sm font-medium text-[var(--text-heading)] truncate">{book.title}</p>
                {book.authors.length > 0 && (
                    <p className="text-xs text-[var(--text-secondary)] truncate">{book.authors.join(', ')}</p>
                )}
            </div>

            <div className="flex items-center gap-0.5 ml-auto">
                {/* Reading mode toggle */}
                <button
                    onClick={() => updateSettings({ readingMode: settings.readingMode === 'scroll' ? 'paginated' : 'scroll' })}
                    title={`Switch to ${settings.readingMode === 'scroll' ? 'paginated' : 'scroll'} mode`}
                    className="rounded-lg p-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    {settings.readingMode === 'scroll' ? '📜' : '📖'}
                </button>

                {/* Theme cycle */}
                <ThemeCycleButton />

                <div className="w-px h-5 bg-[var(--border)] mx-1" />

                {secondaryButtons.map((b) => (
                    <ToolBtn key={b.label} {...b} />
                ))}
            </div>
        </header>
    )
}

function ToolBtn({ label, icon, active, onClick }: ToolbarButton) {
    return (
        <button
            onClick={onClick}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={clsx(
                'rounded-lg p-2 transition-colors',
                active
                    ? 'bg-accent-600/15 text-accent-600 dark:text-accent-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
            )}
        >
            {icon}
        </button>
    )
}

const THEMES = ['light', 'dark', 'sepia', 'high-contrast'] as const
const THEME_ICONS: Record<string, string> = { light: '☀️', dark: '🌙', sepia: '📜', 'high-contrast': '◑' }

function ThemeCycleButton() {
    const settings = useReaderStore((s) => s.settings)
    const updateSettings = useReaderStore((s) => s.updateSettings)

    const cycle = () => {
        const idx = THEMES.indexOf(settings.theme)
        updateSettings({ theme: THEMES[(idx + 1) % THEMES.length] })
    }

    return (
        <button
            onClick={cycle}
            title={`Theme: ${settings.theme}`}
            className="rounded-lg p-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
        >
            {THEME_ICONS[settings.theme]}
        </button>
    )
}
