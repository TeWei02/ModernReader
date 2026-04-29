import { BaseAgent, type AgentContext, type AgentResponse } from '@/agents/core/Agent'
import { HttpTool } from '@/agents/core/Tool'

function isSummarizeIntent(input: string): boolean {
    const lower = input.toLowerCase()
    return (
        lower.includes('summarize') ||
        lower.includes('summary') ||
        lower.includes('摘要') ||
        lower.includes('重點') ||
        lower.includes('整理')
    )
}

export class ReadingAssistantAgent extends BaseAgent {
    id = 'reading-assistant'
    name = 'Reading Assistant'
    description = 'Summarize selected text and answer reading questions via backend mock AI API.'

    private summarizeTool = new HttpTool({
        id: 'summarize-tool',
        description: 'Call /api/ai/summarize for text summary',
        endpoint: '/api/ai/summarize',
        mapPayload: (_input, context) => ({
            text: context.selectionText ?? '',
            language: context.language,
        }),
    })

    private qaTool = new HttpTool({
        id: 'qa-tool',
        description: 'Call /api/ai/qa for question answering',
        endpoint: '/api/ai/qa',
        mapPayload: (input, context) => ({
            question: input,
            context: context.selectionText ?? '',
            language: context.language,
        }),
    })

    async run(input: string, context: AgentContext): Promise<AgentResponse> {
        try {
            const selectedText = context.selectionText?.trim() ?? ''
            if (!selectedText) {
                return {
                    type: 'text',
                    text: 'Please provide selected text first, then ask for summary or QA.',
                    debugInfo: { reason: 'missing-selection-text' },
                }
            }

            const summaryIntent = isSummarizeIntent(input)
            this.log('run', { input, summaryIntent, context })

            if (summaryIntent) {
                const result = await this.summarizeTool.call(input, context)
                if (!result.success) {
                    return {
                        type: 'text',
                        text: `Summary failed: ${result.errorMessage ?? 'Unknown error'}`,
                        debugInfo: { tool: 'summarize' },
                    }
                }

                const summary = (result.data as { summary?: string })?.summary ?? 'No summary returned.'
                return {
                    type: 'text',
                    text: summary,
                    debugInfo: {
                        tool: 'summarize',
                        mode: (result.data as { mode?: string })?.mode,
                    },
                }
            }

            const result = await this.qaTool.call(input, context)
            if (!result.success) {
                return {
                    type: 'text',
                    text: `Q&A failed: ${result.errorMessage ?? 'Unknown error'}`,
                    debugInfo: { tool: 'qa' },
                }
            }

            const payload = result.data as { answer?: string; confidence?: number; hints?: string[]; mode?: string }
            return {
                type: 'text',
                text: payload.answer ?? 'No answer returned.',
                debugInfo: {
                    tool: 'qa',
                    confidence: payload.confidence,
                    hints: payload.hints,
                    mode: payload.mode,
                },
            }
        } catch (error) {
            return this.safeError(error)
        }
    }
}
