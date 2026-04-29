import type {
    AIFlashcardSuggestion,
    AIMessage,
    AIQAResult,
    AISummaryResult,
    IAIService,
} from './aiService'

export class RealAIService implements IAIService {
    constructor(private readonly apiKey: string) { }

    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
        }
    }

    async summarize(text: string, chapterTitle?: string): Promise<AISummaryResult> {
        const res = await fetch('/api/ai/summarize', {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ text, chapterTitle }),
        })

        if (!res.ok) {
            throw new Error('Summarize API request failed')
        }

        const data = (await res.json()) as { summary?: string }
        const wordCount = text.split(/\s+/).filter(Boolean).length

        return {
            summary: data.summary ?? 'No summary returned by API.',
            keyPoints: [],
            difficulty: 'intermediate',
            estimatedReadingMinutes: Math.max(1, Math.round(wordCount / 200)),
        }
    }

    async ask(question: string, context: string, history?: AIMessage[]): Promise<AIQAResult> {
        const res = await fetch('/api/ai/qa', {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ question, context, history }),
        })

        if (!res.ok) {
            throw new Error('QA API request failed')
        }

        const data = (await res.json()) as {
            answer?: string
            references?: { text: string; location: number }[]
            confidence?: AIQAResult['confidence']
        }

        return {
            answer: data.answer ?? 'No answer returned by API.',
            references: data.references ?? [],
            confidence: data.confidence ?? 'medium',
        }
    }

    async translate(_text: string, _targetLanguage: string): Promise<string> {
        return '[Translation API is not configured yet]'
    }

    async explainSimply(_text: string): Promise<string> {
        return '[Simple explanation API is not configured yet]'
    }

    async generateFlashcards(_highlight: string, _context: string): Promise<AIFlashcardSuggestion[]> {
        return []
    }

    async generateQuiz(_text: string, _count = 3): Promise<{ question: string; answer: string }[]> {
        return []
    }

    isAvailable(): boolean {
        return this.apiKey.length > 0
    }
}
