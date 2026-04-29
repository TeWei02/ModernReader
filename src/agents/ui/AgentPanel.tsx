import type { Agent, AgentContext, AgentResponse } from '@/agents/core/Agent'
import { NonHumanSignalAgent } from '@/agents/impl/NonHumanSignalAgent'
import { ReadingAssistantAgent } from '@/agents/impl/ReadingAssistantAgent'
import { VrReadingAgent } from '@/agents/impl/VrReadingAgent'
import { useMemo, useState } from 'react'

interface AgentPanelProps {
    initialSelectionText?: string
    initialBookId?: string
}

export function AgentPanel({ initialSelectionText, initialBookId }: AgentPanelProps) {
    const readingAgent = useMemo(() => new ReadingAssistantAgent(), [])
    const nonHumanAgent = useMemo(() => new NonHumanSignalAgent(), [])
    const vrReadingAgent = useMemo(() => new VrReadingAgent(), [])
    const [selectedAgentId, setSelectedAgentId] = useState(readingAgent.id)
    const [input, setInput] = useState('請幫我摘要這段文字')
    const [selectionText, setSelectionText] = useState(initialSelectionText ?? '')
    const [bookId, setBookId] = useState(initialBookId ?? '')
    const [language, setLanguage] = useState('zh-TW')
    const [running, setRunning] = useState(false)
    const [result, setResult] = useState<AgentResponse | null>(null)

    const agents: Agent[] = useMemo(
        () => [readingAgent, nonHumanAgent, vrReadingAgent],
        [readingAgent, nonHumanAgent, vrReadingAgent]
    )
    const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) ?? agents[0]

    const handleRun = async () => {
        setRunning(true)
        try {
            const context: AgentContext = {
                userId: 'local-user',
                bookId: bookId || undefined,
                selectionText: selectionText || undefined,
                language,
            }
            const response = await selectedAgent.run(input.trim(), context)
            setResult(response)
        } finally {
            setRunning(false)
        }
    }

    return (
        <section className="mx-auto max-w-4xl px-6 py-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
                <h2 className="text-lg font-semibold text-[var(--text-heading)]">AI Agent Panel</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Execute practical agent actions and inspect real responses.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="text-sm text-[var(--text-primary)]">
                        Agent
                        <select
                            value={selectedAgentId}
                            onChange={(event) => setSelectedAgentId(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                        >
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm text-[var(--text-primary)]">
                        Language
                        <input
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                            placeholder="zh-TW"
                        />
                    </label>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="text-sm text-[var(--text-primary)]">
                        Book ID (optional)
                        <input
                            value={bookId}
                            onChange={(event) => setBookId(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                            placeholder="book-001"
                        />
                    </label>

                    <label className="text-sm text-[var(--text-primary)]">
                        Operation / Question
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                            placeholder="Ask a question or summarize command"
                        />
                    </label>
                </div>

                <label className="mt-4 block text-sm text-[var(--text-primary)]">
                    Selection Text
                    <textarea
                        value={selectionText}
                        onChange={(event) => setSelectionText(event.target.value)}
                        className="mt-1 min-h-36 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                        placeholder="Paste selected passage here"
                    />
                </label>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={handleRun}
                        disabled={running || input.trim().length === 0}
                        className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {running ? 'Running...' : 'Run Agent'}
                    </button>
                    <span className="text-xs text-[var(--text-secondary)]">{selectedAgent.description}</span>
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Response</h3>
                {!result && <p className="mt-3 text-sm text-[var(--text-secondary)]">No response yet.</p>}

                {result?.type === 'text' && (
                    <div className="mt-3 space-y-3">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">{result.text}</p>
                        {result.debugInfo && (
                            <pre className="overflow-x-auto rounded-lg bg-[var(--code-bg)] p-3 text-xs text-[var(--text-secondary)]">
                                {JSON.stringify(result.debugInfo, null, 2)}
                            </pre>
                        )}
                    </div>
                )}

                {result?.type === 'structured' && (
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--code-bg)] p-3 text-xs text-[var(--text-primary)]">
                        {JSON.stringify(result.data, null, 2)}
                    </pre>
                )}
            </div>
        </section>
    )
}
