import type { AgentContext } from './Agent'

export interface ToolContext extends AgentContext {
    // Extension point for tool-specific context in future providers.
}

export interface ToolResult {
    success: boolean
    data?: any
    errorMessage?: string
}

export interface Tool {
    id: string
    description: string
    call(input: string, context: ToolContext): Promise<ToolResult>
}

export interface HttpToolOptions {
    id: string
    description: string
    endpoint: string
    mapPayload?: (input: string, context: ToolContext) => Record<string, unknown>
}

const API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL ?? ''

export class HttpTool implements Tool {
    readonly id: string
    readonly description: string
    private readonly endpoint: string
    private readonly mapPayload?: (input: string, context: ToolContext) => Record<string, unknown>

    constructor(options: HttpToolOptions) {
        this.id = options.id
        this.description = options.description
        this.endpoint = options.endpoint
        this.mapPayload = options.mapPayload
    }

    async call(input: string, context: ToolContext): Promise<ToolResult> {
        try {
            const payload = this.mapPayload
                ? this.mapPayload(input, context)
                : { input, context }

            const response = await fetch(`${API_BASE_URL}${this.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const text = await response.text()
                return {
                    success: false,
                    errorMessage: `HTTP ${response.status}: ${text}`,
                }
            }

            const data = (await response.json()) as unknown
            return { success: true, data }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown tool error'
            return { success: false, errorMessage }
        }
    }
}
