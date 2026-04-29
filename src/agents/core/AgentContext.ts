import type { AgentContext } from './Agent'

export interface ReadingAgentContext extends AgentContext {
    chapterId?: string
    selectionStart?: number
    selectionEnd?: number
}

export interface SignalAgentContext extends AgentContext {
    signalSource?: string
    signalTimestamp?: string
}

export interface VrAgentContext extends AgentContext {
    environment?: 'classroom' | 'library' | 'lab' | 'custom'
}

export type AnyAgentContext = ReadingAgentContext | SignalAgentContext | VrAgentContext

export function createAgentContext(partial?: Partial<AgentContext>): AgentContext {
    return {
        userId: partial?.userId,
        bookId: partial?.bookId,
        selectionText: partial?.selectionText,
        language: partial?.language ?? 'zh-TW',
    }
}
