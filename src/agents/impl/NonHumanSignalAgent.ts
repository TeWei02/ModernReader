import { BaseAgent, type AgentContext, type AgentResponse } from '@/agents/core/Agent'
import { aiClient } from '@/services/ai/AiClient'

export class NonHumanSignalAgent extends BaseAgent {
    id = 'nonhuman-signal'
    name = 'NonHuman Signal Agent'
    description = 'Simulation-only agent for non-human signal interpretation research workflows.'

    async run(input: string, context: AgentContext): Promise<AgentResponse> {
        try {
            const signalId = input.trim() || `signal-${Date.now()}`
            this.log('run', { signalId, context })

            const result = await aiClient.simulateNonHumanSignal({
                signalId,
                description: context.selectionText,
            })

            return {
                type: 'structured',
                data: {
                    species: result.species,
                    signalId: result.signalId,
                    mockInterpretation: result.mockInterpretation,
                    confidence: result.confidence,
                    warnings: result.warnings,
                    note: 'Simulation only. This is mock data and not real biological translation.',
                },
                debugInfo: {
                    simulation: true,
                    source: 'POST /api/ai/nonhuman/simulate',
                },
            }
        } catch (error) {
            return this.safeError(error, 'NonHumanSignalAgent failed')
        }
    }
}
