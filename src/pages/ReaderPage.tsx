import { FullPageSpinner } from '@/components/ui/Spinner'
import { AIPanel } from '@/modules/reader/AiPanel'
import { ReaderToolbar } from '@/modules/reader/ReaderToolbar'
import { useReaderStore } from '@/store/readerStore'
import type { Book } from '@/types/book'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface GutendexBookDetail {
    id: number
    title: string
    formats: Record<string, string>
}

export default function ReaderPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const aiPanelVisible = useReaderStore((s) => s.aiPanelVisible)

    const [bookTitle, setBookTitle] = useState('')
    const [htmlUrl, setHtmlUrl] = useState<string | null>(null)
    const [plainTextContent, setPlainTextContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [book, setBook] = useState<Book | null>(null)
    const [iframeFailed, setIframeFailed] = useState(false)

    const normalizeUrl = (url: string | null): string | null => {
        if (!url) return null
        return url.startsWith('http://') ? `https://${url.slice(7)}` : url
    }

    useEffect(() => {
        if (!id) {
            navigate('/')
            return
        }
    }, [id, navigate])

    useEffect(() => {
        if (!id) {
            return
        }

        let active = true

        const loadBook = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`https://gutendex.com/books/${encodeURIComponent(id)}`)
                if (!response.ok) {
                    throw new Error(`Gutendex book request failed: ${response.status}`)
                }

                const data = (await response.json()) as GutendexBookDetail
                if (!active) return

                const nextHtmlUrl = data.formats['text/html'] ?? data.formats['text/html; charset=utf-8'] ?? null
                const nextPlainUrl = data.formats['text/plain; charset=utf-8'] ?? data.formats['text/plain'] ?? null

                setBookTitle(data.title)
                setHtmlUrl(normalizeUrl(nextHtmlUrl))
                setIframeFailed(false)
                setPlainTextContent('')

                let content = ''
                if (nextPlainUrl) {
                    try {
                        const textRes = await fetch(nextPlainUrl)
                        if (textRes.ok) {
                            const text = await textRes.text()
                            if (!active) return
                            content = text.slice(0, 200000)
                            setPlainTextContent(content)
                        }
                    } catch {
                        // Plain-text fetch blocked by CORS or network; fall back to iframe
                    }
                }

                setBook({
                    id,
                    title: data.title,
                    authors: [],
                    tags: [],
                    format: 'txt',
                    source: 'library',
                    addedAt: Date.now(),
                    metadata: {},
                    content,
                })
            } catch (err) {
                if (!active) return
                setError(err instanceof Error ? err.message : 'Failed to load book content.')
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        loadBook()

        return () => {
            active = false
        }
    }, [id])

    if (loading) {
        return <FullPageSpinner label="Opening book..." />
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
                <div className="p-6 text-center">
                    <p className="text-lg font-semibold">Unable to open book</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-3 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white"
                    >
                        Back to Library
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col bg-[var(--bg)] text-[var(--text-primary)]">
            {book && <ReaderToolbar book={book} isSpeaking={false} onToggleSpeak={() => undefined} />}

            <div className="flex min-h-0 flex-1">
                <section className="min-w-0 flex-1">
                    {htmlUrl && !iframeFailed ? (
                        <iframe
                            src={htmlUrl}
                            title={bookTitle || 'Book content'}
                            className="h-full w-full border-none"
                            sandbox="allow-same-origin allow-scripts"
                            onError={() => setIframeFailed(true)}
                        />
                    ) : (
                        <div className="h-full overflow-y-auto p-8 text-sm leading-relaxed text-[var(--text-primary)]">
                            {iframeFailed && (
                                <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-50 p-3 text-xs text-amber-700">
                                    HTML preview could not be embedded by the source site. Fallback text is shown.
                                </div>
                            )}
                            <pre className="whitespace-pre-wrap font-[inherit] text-inherit">
                                {plainTextContent || 'No readable text format found for this book.'}
                            </pre>
                        </div>
                    )}
                </section>

                {aiPanelVisible && book && (
                    <aside className="w-80 shrink-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--bg-secondary)]">
                        <AIPanel book={book} />
                    </aside>
                )}
            </div>
        </div>
    )
}
