import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { aiService } from '@/services/aiService'
import { useReaderStore } from '@/store/readerStore'
import type { Book } from '@/types/book'
import { useEffect, useRef, useState } from 'react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface AIPanelProps {
    book: Book
}

export function AIPanel({ book }: AIPanelProps) {
    const toggleAiPanel = useReaderStore((s) => s.toggleAiPanel)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState<string | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const isMock = !aiService.isAvailable()

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSummarize = async () => {
        setSummaryLoading(true)
        try {
            // Use first 4000 chars as context for summary
            const excerpt = book.content?.slice(0, 4000) ?? '(content not available)'
            const result = await aiService.summarize(excerpt, 'chapter')
            setSummary(result.summary)
        } finally {
            setSummaryLoading(false)
        }
    }

    const handleAsk = async () => {
        const q = input.trim()
        if (!q || loading) return
        setInput('')
        setMessages((m) => [...m, { role: 'user', content: q }])
        setLoading(true)
        try {
            const context = book.content?.slice(0, 8000) ?? ''
            const result = await aiService.ask(context, q)
            setMessages((m) => [...m, { role: 'assistant', content: result.answer + (result.references.length ? `\n\n*References: ${result.references.join(', ')}*` : '') }])
        } catch {
            setMessages((m) => [...m, { role: 'assistant', content: '(Error: could not get response)' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)] shrink-0">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">AI Assistant</p>
                    {isMock && <p className="text-[10px] text-amber-500">Mock mode — connect AI key in settings</p>}
                </div>
                <button
                    onClick={toggleAiPanel}
                    className="rounded p-0.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Quick actions */}
            <div className="px-3 py-2 border-b border-[var(--border)] shrink-0 flex gap-2 flex-wrap">
                <button
                    onClick={handleSummarize}
                    disabled={summaryLoading}
                    className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                    {summaryLoading ? <Spinner size="sm" /> : '✨'}
                    Summarize chapter
                </button>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mx-3 mt-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-xs text-[var(--text-primary)] leading-relaxed shrink-0">
                    <p className="font-semibold text-[var(--text-secondary)] mb-1">Summary</p>
                    {summary}
                </div>
            )}

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-3">
                {messages.length === 0 && !summary && (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                        <p className="text-3xl mb-3">🤖</p>
                        <p className="text-xs">Ask anything about this book</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user'
                                ? 'bg-accent-600 text-white'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[var(--bg-secondary)] rounded-xl px-3 py-2 border border-[var(--border)]">
                            <Spinner size="sm" />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-[var(--border)] shrink-0 flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() } }}
                    placeholder="Ask about this book…"
                    className="flex-1 text-xs"
                />
                <Button size="icon" onClick={handleAsk} disabled={!input.trim() || loading}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </Button>
            </div>
        </div>
    )
}
