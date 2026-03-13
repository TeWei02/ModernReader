import { FullPageSpinner } from '@/components/ui/Spinner'
import { AnnotationSidebar } from '@/modules/annotations/AnnotationSidebar'
import { storage } from '@/services/storage'
import { useAnnotationStore } from '@/store/annotationStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useReaderStore } from '@/store/readerStore'
import { clsx } from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AIPanel } from './AIPanel'
import type { TocEntry } from './ReaderContent'
import { ReaderContent } from './ReaderContent'
import { ReaderToolbar } from './ReaderToolbar'
import { SearchPanel } from './SearchPanel'
import { TableOfContents } from './TableOfContents'
import { TypographyPanel } from './TypographyPanel'

export default function ReaderPage() {
    const { bookId } = useParams<{ bookId: string }>()
    const navigate = useNavigate()

    const book = useLibraryStore((s) => s.books.find((b) => b.id === bookId))
    const markOpened = useLibraryStore((s) => s.markOpened)
    const saveProgress = useLibraryStore((s) => s.saveProgress)
    const openBook = useReaderStore((s) => s.openBook)
    const isLoading = useReaderStore((s) => s.isLoading)
    const setIsLoading = useReaderStore((s) => s.setIsLoading)
    const tocVisible = useReaderStore((s) => s.tocVisible)
    const searchVisible = useReaderStore((s) => s.searchVisible)
    const annotationSidebarVisible = useReaderStore((s) => s.annotationSidebarVisible)
    const aiPanelVisible = useReaderStore((s) => s.aiPanelVisible)
    const typographyPanelVisible = useReaderStore((s) => s.typographyPanelVisible)
    const loadForBook = useAnnotationStore((s) => s.loadForBook)

    const [content, setContent] = useState<string>('')
    const [toc, setToc] = useState<TocEntry[]>([])
    const contentRef = useRef<HTMLDivElement>(null)

    // Load book + annotations
    useEffect(() => {
        if (!bookId) { navigate('/'); return }
        if (!book) { navigate('/'); return }

        openBook(bookId)
        markOpened(bookId)
        loadForBook(bookId)

        async function load() {
            setIsLoading(true)
            try {
                // Try in-memory content first, then IndexedDB
                let rawContent = book!.content
                if (!rawContent && book!.contentRef) {
                    const stored = await storage.getBookContent(bookId!)
                    rawContent = stored?.content
                }
                setContent(rawContent ?? '*(No content)*')
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [bookId]) // eslint-disable-line react-hooks/exhaustive-deps

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { navigate('/') }
            if (e.altKey && e.key === 'ArrowLeft') { navigate(-1) }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [navigate])

    // Save progress on scroll
    const onProgress = useCallback(
        (pct: number) => {
            if (bookId) saveProgress(bookId, pct)
        },
        [bookId, saveProgress]
    )

    if (isLoading || !book) return <FullPageSpinner label="Opening book…" />

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
            {/* TOC panel */}
            {tocVisible && (
                <div className="w-64 shrink-0 border-r border-[var(--border)] overflow-hidden flex flex-col">
                    <TableOfContents entries={toc} contentRef={contentRef} />
                </div>
            )}

            {/* Main reading area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <ReaderToolbar book={book} />
                <ReaderContent
                    content={content}
                    book={book}
                    contentRef={contentRef}
                    onTocExtracted={setToc}
                    onProgress={onProgress}
                />
            </div>

            {/* Right panels */}
            {searchVisible && (
                <div className={clsx('w-72 shrink-0 border-l border-[var(--border)] overflow-hidden flex flex-col')}>
                    <SearchPanel content={content} contentRef={contentRef} />
                </div>
            )}
            {annotationSidebarVisible && (
                <div className="w-80 shrink-0 border-l border-[var(--border)] overflow-hidden flex flex-col">
                    <AnnotationSidebar bookId={book.id} contentRef={contentRef} />
                </div>
            )}
            {aiPanelVisible && (
                <div className="w-80 shrink-0 border-l border-[var(--border)] overflow-hidden flex flex-col">
                    <AIPanel book={book} />
                </div>
            )}
            {typographyPanelVisible && (
                <div className="w-72 shrink-0 border-l border-[var(--border)] overflow-y-auto">
                    <TypographyPanel />
                </div>
            )}
        </div>
    )
}
