import type { Request, Response } from 'express';

function containsAny(text: string, keywords: string[]): boolean {
    return keywords.some((k) => text.includes(k))
}

function buildMockAnswer(question: string, context: string): { answer: string; confidence: number; hints: string[] } {
    const q = question.toLowerCase()
    const c = context.toLowerCase()
    const hints: string[] = []

    if (containsAny(q, ['summary', '摘要', '重點'])) {
        hints.push('Detected summary intent')
    }
    if (containsAny(q, ['who', '誰', '作者', 'author'])) {
        hints.push('Detected entity-focused question')
    }
    if (containsAny(q, ['why', '為什麼', '原因'])) {
        hints.push('Detected causal question')
    }

    const excerpt = context.trim().length > 140
        ? `${context.trim().slice(0, 140)}...`
        : context.trim() || 'No context provided.'

    let answer = `Q: ${question}\nA: `

    if (containsAny(q, ['summary', '摘要', '重點'])) {
        answer += `The selected text mainly discusses: ${excerpt}`
    } else if (containsAny(q, ['who', '誰', '作者', 'author'])) {
        answer += `Based on the selected text, likely related entities appear in: ${excerpt}`
    } else if (containsAny(q, ['why', '為什麼', '原因'])) {
        answer += `A likely reason from the selected text is implied by: ${excerpt}`
    } else if (c.includes(q.slice(0, 8)) && q.trim().length > 5) {
        answer += `The question terms partially match the selected text. Relevant part: ${excerpt}`
    } else {
        answer += `I can provide a mock answer from the selected text: ${excerpt}`
    }

    const confidence = Math.max(0.45, Math.min(0.92, 0.55 + hints.length * 0.12))
    return { answer, confidence, hints }
}

export function qaHandler(req: Request, res: Response): void {
    const question = typeof req.body?.question === 'string' ? req.body.question : ''
    const context = typeof req.body?.context === 'string' ? req.body.context : ''

    const result = buildMockAnswer(question, context)

    res.json({
        ...result,
        mode: 'mock' as const,
    })
}
