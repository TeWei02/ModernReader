import { useAnnotationStore } from '@/store/annotationStore'
import { useReaderStore } from '@/store/readerStore'
import type { Book } from '@/types/book'
import { clsx } from 'clsx'
import type MarkdownIt from 'markdown-it'
import {
    forwardRef,
    useCallback,
    useEffect, useRef,
    useState,
    type RefObject
} from 'react'
import { HighlightMenu } from './HighlightMenu'

export interface TocEntry {
    id: string
    level: number
    text: string
}

interface SelectionState {
    text: string
    context: string
    location: number
    x: number
    y: number
}

interface ReaderContentProps {
    content: string
    book: Book
    contentRef: RefObject<HTMLDivElement>
    onTocExtracted: (toc: TocEntry[]) => void
    onProgress: (pct: number) => void
}

// Lazily load markdown-it and highlight.js
// Use the type-imported MarkdownIt for the lazy instance variable
let mdInstance: MarkdownIt | null = null
async function getMarkdownIt() {
    if (mdInstance) return mdInstance
    const [{ default: MarkdownIt }, { default: hljs }] = await Promise.all([
        import('markdown-it'),
        import('highlight.js/lib/core'),
    ])
    // Register common languages lazily
    const [js, ts, py, cpp, bash, json, css, xml] = await Promise.all([
        import('highlight.js/lib/languages/javascript'),
        import('highlight.js/lib/languages/typescript'),
        import('highlight.js/lib/languages/python'),
        import('highlight.js/lib/languages/cpp'),
        import('highlight.js/lib/languages/bash'),
        import('highlight.js/lib/languages/json'),
        import('highlight.js/lib/languages/css'),
        import('highlight.js/lib/languages/xml'),
    ])
    hljs.registerLanguage('javascript', js.default)
    hljs.registerLanguage('typescript', ts.default)
    hljs.registerLanguage('python', py.default)
    hljs.registerLanguage('cpp', cpp.default)
    hljs.registerLanguage('bash', bash.default)
    hljs.registerLanguage('json', json.default)
    hljs.registerLanguage('css', css.default)
    hljs.registerLanguage('xml', xml.default)

    mdInstance = new MarkdownIt({
        html: false,
        breaks: true,
        linkify: true,
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try { return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>` } catch { }
            }
            return `<pre class="hljs"><code>${mdInstance!.utils.escapeHtml(str)}</code></pre>`
        },
    })
    return mdInstance
}

function renderHtml(content: string, md: NonNullable<typeof mdInstance>) {
    // Detect if it looks like markdown or plain text
    const isMarkdown = /[#*`\[\]_~>|-]/.test(content.slice(0, 500))
    return isMarkdown ? md.render(content) : `<p>${content.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
}

function extractToc(html: string): TocEntry[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1,h2,h3,h4,h5,h6')
    return Array.from(headings).map((h, i) => ({
        id: `heading-${i}`,
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim() ?? '',
    }))
}

function injectHeadingIds(html: string): string {
    let counter = 0
    return html.replace(/<(h[1-6])([^>]*)>/gi, (_, tag, attrs) => {
        return `<${tag}${attrs} id="heading-${counter++}">`
    })
}

function applyHighlightsToHtml(html: string, highlights: { id: string; text: string; color: string }[]): string {
    let result = html
    const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length)
    for (const h of sorted) {
        if (!h.text.trim()) continue
        // Only highlight outside HTML tags
        const escaped = h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        try {
            result = result.replace(
                new RegExp(`(${escaped})(?![^<]*>)`, 'g'),
                `<mark class="highlight highlight-${h.color}" data-highlight-id="${h.id}" tabindex="0">$1</mark>`
            )
        } catch {
            // Regex error (malformed text) — skip this highlight
        }
    }
    return result
}

export const ReaderContent = forwardRef<HTMLDivElement, ReaderContentProps>(
    function ReaderContent({ content, book, contentRef, onTocExtracted, onProgress }, _ref) {
        const wrapperRef = useRef<HTMLDivElement>(null)
        const [html, setHtml] = useState('')
        const [selection, setSelection] = useState<SelectionState | null>(null)
        const settings = useReaderStore((s) => s.settings)
        const setActiveHeading = useReaderStore((s) => s.setActiveHeading)
        const highlights = useAnnotationStore((s) => s.highlightsForBook(book.id))
        const searchQuery = useReaderStore((s) => s.searchQuery)

        // Render markdown → HTML
        useEffect(() => {
            getMarkdownIt().then((md) => {
                let rendered = renderHtml(content, md)
                rendered = injectHeadingIds(rendered)
                rendered = applyHighlightsToHtml(rendered, highlights)
                if (searchQuery.trim()) {
                    const esc = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                    try {
                        rendered = rendered.replace(new RegExp(`(${esc})(?![^<]*>)`, 'gi'),
                            '<mark class="search-match">$1</mark>')
                    } catch { }
                }
                setHtml(rendered)
                onTocExtracted(extractToc(rendered))
            })
        }, [content, highlights, searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

        // Track scroll progress
        useEffect(() => {
            const el = wrapperRef.current
            if (!el) return
            let raf = 0
            const onScroll = () => {
                cancelAnimationFrame(raf)
                raf = requestAnimationFrame(() => {
                    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1) * 100
                    onProgress(Math.round(pct))
                    // Active heading tracking
                    const headings = el.querySelectorAll<HTMLElement>('[id^="heading-"]')
                    let active = ''
                    for (const h of headings) {
                        if (h.offsetTop <= el.scrollTop + 80) active = h.id
                    }
                    if (active) setActiveHeading(active)
                })
            }
            el.addEventListener('scroll', onScroll, { passive: true })
            return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
        }, [onProgress, setActiveHeading])

        // Text selection handler
        const handleMouseUp = useCallback(() => {
            const sel = window.getSelection()
            if (!sel || sel.isCollapsed || !sel.toString().trim()) {
                setSelection(null)
                return
            }
            const text = sel.toString().trim()
            if (text.length < 1 || text.length > 2000) { setSelection(null); return }

            const range = sel.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            const wrapRect = wrapperRef.current?.getBoundingClientRect()

            // Calculate location as scroll percentage
            const el = wrapperRef.current
            const pct = el ? (el.scrollTop + rect.top - (el.getBoundingClientRect().top)) / (el.scrollHeight || 1) * 100 : 0

            // Get surrounding context (~100 chars)
            const context = sel.anchorNode?.textContent?.slice(
                Math.max(0, (sel.anchorOffset ?? 0) - 50),
                (sel.anchorOffset ?? 0) + text.length + 50
            ) ?? text

            setSelection({
                text,
                context,
                location: Math.round(pct),
                x: rect.left + rect.width / 2 - (wrapRect?.left ?? 0),
                y: rect.top - (wrapRect?.top ?? 0) - 48,
            })
        }, [])

        const dismissSelection = useCallback(() => {
            setSelection(null)
            window.getSelection()?.removeAllRanges()
        }, [])

        return (
            <div className="relative flex-1 overflow-hidden flex">
                {/* Scrollable content area */}
                <div
                    ref={(el) => {
                        ; (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                        if (contentRef) (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el
                    }}
                    className="flex-1 overflow-y-auto px-4 py-8"
                    onMouseUp={handleMouseUp}
                    onClick={(e) => {
                        // Dismiss if click is outside highlight menu
                        const target = e.target as HTMLElement
                        if (!target.closest('[data-highlight-menu]')) {
                            if (selection && !target.closest('mark')) setSelection(null)
                        }
                    }}
                >
                    <article
                        className={clsx(
                            'prose mx-auto reader-content',
                            settings.readingMode === 'paginated' && 'paginated'
                        )}
                        style={{
                            maxWidth: `${settings.pageWidth}px`,
                            fontSize: `${settings.fontSize}px`,
                            fontFamily: 'var(--reader-font-family)',
                            lineHeight: settings.lineHeight,
                        }}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>

                {/* Floating highlight menu */}
                {selection && (
                    <HighlightMenu
                        bookId={book.id}
                        selection={selection}
                        onDismiss={dismissSelection}
                    />
                )}
            </div>
        )
    }
)
