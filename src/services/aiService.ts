/**
 * AI Service — Abstraction layer for LLM calls.
 * Defaults to mock mode and can switch to the backend-powered implementation
 * when an API key exists in settings storage.
 *
 * SECURITY: API keys must NEVER be stored in frontend code.
 * Real implementation should proxy all requests through a backend server.
 */

export type AIProvider = 'mock' | 'openai' | 'anthropic' | 'custom'

export interface AIMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AISummaryResult {
    summary: string
    keyPoints: string[]
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedReadingMinutes: number
}

export interface AIQAResult {
    answer: string
    references: { text: string; location: number }[]
    confidence: 'high' | 'medium' | 'low'
    disclaimer?: string
}

export interface AIFlashcardSuggestion {
    front: string
    back: string
    tags: string[]
}

export interface IAIService {
    summarize(text: string, chapterTitle?: string): Promise<AISummaryResult>
    ask(question: string, context: string, history?: AIMessage[]): Promise<AIQAResult>
    translate(text: string, targetLanguage: string): Promise<string>
    explainSimply(text: string): Promise<string>
    generateFlashcards(highlight: string, context: string): Promise<AIFlashcardSuggestion[]>
    generateQuiz(text: string, count?: number): Promise<{ question: string; answer: string }[]>
    isAvailable(): boolean
}

// ─── Mock implementation ───────────────────────────────────────────────────────

class MockAIService implements IAIService {
    async summarize(text: string, chapterTitle?: string): Promise<AISummaryResult> {
        const wordCount = text.split(/\s+/).length
        return {
            summary: `[Mock summary] ${chapterTitle ? `Chapter "${chapterTitle}"` : 'This text'} contains about ${wordCount} words. Configure an OpenAI API key in settings for real summaries.`,
            keyPoints: [
                '(Mock) Main ideas are identified from the current selection',
                '(Mock) Important entities and relationships are highlighted',
                '(Mock) Follow-up study prompts are suggested',
            ],
            difficulty: 'intermediate',
            estimatedReadingMinutes: Math.max(1, Math.round(wordCount / 200)),
        }
    }

    async ask(question: string, _context: string, _history?: AIMessage[]): Promise<AIQAResult> {
        return {
            answer: `[Mock answer] You asked: "${question}". This is a simulated response. Configure an API key in settings for real answers.`,
            references: [],
            confidence: 'low',
            disclaimer: 'This is a mock response. Configure a real AI API for grounded answers.',
        }
    }

    async translate(text: string, targetLanguage: string): Promise<string> {
        return `[Mock translation -> ${targetLanguage}]\n${text.substring(0, 100)}...`
    }

    async explainSimply(text: string): Promise<string> {
        return `[Mock simple explanation] A simplified explanation for "${text.substring(0, 50)}..." will appear here once a real provider is configured.`
    }

    async generateFlashcards(highlight: string, _context: string): Promise<AIFlashcardSuggestion[]> {
        return [
            {
                front: `Key concept: ${highlight.substring(0, 40)}`,
                back: `Explanation: ${highlight.substring(0, 80)}`,
                tags: ['ai-generated', 'mock'],
            },
        ]
    }

    async generateQuiz(text: string, count = 3): Promise<{ question: string; answer: string }[]> {
        return Array.from({ length: count }, (_, i) => ({
            question: `[Mock quiz ${i + 1}] Which option best matches the passage?`,
            answer: `[Mock answer ${i + 1}] ${text.substring(i * 20, i * 20 + 40)}`,
        }))
    }

    isAvailable(): boolean {
        return false
    }
}

import { storage } from './storage'

let currentService: IAIService = new MockAIService()
let initPromise: Promise<void> | null = null

async function createAiService(): Promise<IAIService> {
    try {
        const apiKey = await storage.getSetting<string>('openai-api-key')
        if (apiKey) {
            const { RealAIService } = await import('./realAiService')
            return new RealAIService(apiKey)
        }
    } catch {
        // Keep mock mode if reading settings fails.
    }
    return new MockAIService()
}

async function ensureInitialized(): Promise<void> {
    if (!initPromise) {
        initPromise = (async () => {
            currentService = await createAiService()
        })()
    }
    await initPromise
}

void ensureInitialized()

export const aiService: IAIService = {
    summarize: async (text, chapterTitle) => {
        await ensureInitialized()
        return currentService.summarize(text, chapterTitle)
    },
    ask: async (question, context, history) => {
        await ensureInitialized()
        return currentService.ask(question, context, history)
    },
    translate: async (text, targetLanguage) => {
        await ensureInitialized()
        return currentService.translate(text, targetLanguage)
    },
    explainSimply: async (text) => {
        await ensureInitialized()
        return currentService.explainSimply(text)
    },
    generateFlashcards: async (highlight, context) => {
        await ensureInitialized()
        return currentService.generateFlashcards(highlight, context)
    },
    generateQuiz: async (text, count) => {
        await ensureInitialized()
        return currentService.generateQuiz(text, count)
    },
    isAvailable: () => currentService.isAvailable(),
}
