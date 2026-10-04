import type { Request, Response } from 'express'

function mockSummarize(text: string): string {
    const clean = text.replace(/\s+/g, ' ').trim()
    if (!clean) return 'No input text provided. (mock summary)'

    const sentences = clean.split(/(?<=[.!?。！？])\s+/).filter(Boolean)
    const picked = sentences.slice(0, 2).join(' ')
    const fallback = clean.length > 120 ? `${clean.slice(0, 120)}...` : clean
    const summary = picked || fallback

    return `${summary} (mock summary)`
}

async function openAiSummarize(text: string, chapterTitle?: string): Promise<string | null> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return null

    const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
    const prompt = [
        'Summarize the provided reading content in 5-8 sentences.',
        'Keep it factual and grounded in the input only.',
        chapterTitle ? `Chapter title: ${chapterTitle}` : null,
        '',
        text.slice(0, 15000),
    ].filter(Boolean).join('\n')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful study assistant. Return concise, clear summaries.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    })

    if (!response.ok) {
        throw new Error(`OpenAI summarize request failed: ${response.status}`)
    }

    const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
    }

    return data.choices?.[0]?.message?.content?.trim() ?? null
}

export async function summarizeHandler(req: Request, res: Response): Promise<void> {
    const text = typeof req.body?.text === 'string' ? req.body.text : ''
    const chapterTitle = typeof req.body?.chapterTitle === 'string' ? req.body.chapterTitle : undefined

    if (!text.trim()) {
        res.status(400).json({ error: 'text is required' })
        return
    }

    try {
        const aiSummary = await openAiSummarize(text, chapterTitle)
        if (aiSummary) {
            res.json({
                summary: aiSummary,
                originalLength: text.length,
                summaryLength: aiSummary.length,
                mode: 'openai' as const,
            })
            return
        }
    } catch {
        // Fall back to mock summary when OpenAI is unavailable.
    }

    const summary = mockSummarize(text)

    res.json({
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
        mode: 'mock' as const,
    })
}
