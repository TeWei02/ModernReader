/**
 * AI Service — Abstraction layer for LLM calls.
 * Currently returns mock responses. Swap in real API calls by replacing the
 * implementation inside each method — callers don't need to change.
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
            summary: `[AI 摘要 — 模擬] ${chapterTitle ? `《${chapterTitle}》` : '此段落'}涵蓋了 ${wordCount} 個詞，核心主題包含主要論點與關鍵概念的闡述。`,
            keyPoints: [
                '核心論點一（模擬）',
                '核心論點二（模擬）',
                '延伸閱讀建議（模擬）',
            ],
            difficulty: 'intermediate',
            estimatedReadingMinutes: Math.max(1, Math.round(wordCount / 200)),
        }
    }

    async ask(question: string, _context: string, _history?: AIMessage[]): Promise<AIQAResult> {
        return {
            answer: `[AI 回答 — 模擬] 您問的是：「${question}」。這是一個模擬回答，尚未連接真實 AI 服務。`,
            references: [],
            confidence: 'low',
            disclaimer: '目前為模擬模式，請在設定中配置 AI API 金鑰以獲取真實回答。',
        }
    }

    async translate(text: string, targetLanguage: string): Promise<string> {
        return `[模擬翻譯 → ${targetLanguage}]\n${text.substring(0, 100)}...`
    }

    async explainSimply(text: string): Promise<string> {
        return `[簡化說明 — 模擬] 這段文字講述了重要概念：「${text.substring(0, 50)}...」用更簡單的方式理解就是：它描述了一個核心觀念。`
    }

    async generateFlashcards(highlight: string, _context: string): Promise<AIFlashcardSuggestion[]> {
        return [
            {
                front: `關於「${highlight.substring(0, 40)}...」的問題是什麼？`,
                back: `答：${highlight.substring(0, 80)}`,
                tags: ['ai-generated'],
            },
        ]
    }

    async generateQuiz(text: string, count = 3): Promise<{ question: string; answer: string }[]> {
        return Array.from({ length: count }, (_, i) => ({
            question: `[模擬測驗 ${i + 1}] 關於這段內容，下列何者正確？`,
            answer: `答案 ${i + 1}：${text.substring(i * 20, i * 20 + 40)}（模擬）`,
        }))
    }

    isAvailable(): boolean {
        return false // mock always returns false to surface the "mock" badge in UI
    }
}

// ─── Export singleton (swap class to enable real AI) ──────────────────────────

export const aiService: IAIService = new MockAIService()
