export interface AgentContext {
    userId?: string
    bookId?: string
    selectionText?: string
    language?: string
}

export interface AgentResponse {
    type: 'text' | 'structured'
    text?: string
    data?: any
    debugInfo?: any
}

export interface Agent {
    id: string
    name: string
    description: string
    run(input: string, context: AgentContext): Promise<AgentResponse>
}

export abstract class BaseAgent implements Agent {
    abstract id: string
    abstract name: string
    abstract description: string

    protected log(event: string, payload?: unknown): void {
        // Keep logs consistent so agent runs are easy to inspect in dev tools.
        console.debug(`[Agent:${this.id}] ${event}`, payload ?? '')
    }

    protected safeError(error: unknown, fallback = 'Agent run failed'): AgentResponse {
        const message = error instanceof Error ? error.message : fallback
        this.log('error', { message, error })
        return {
            type: 'text',
            text: `Error: ${message}`,
            debugInfo: { error: message },
        }
    }

    abstract run(input: string, context: AgentContext): Promise<AgentResponse>
}
