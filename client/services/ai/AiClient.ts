export interface SummarizeRequest {
    text: string
    language?: string
}

export interface QaRequest {
    question: string
    context: string
    language?: string
}

export interface NonHumanSimulateRequest {
    signalId: string
    description?: string
}

export interface SummarizeResponse {
    summary: string
    originalLength: number
    summaryLength: number
    mode: 'mock'
}

export interface QaResponse {
    answer: string
    confidence: number
    hints: string[]
    mode: 'mock'
}

export interface NonHumanSimulateResponse {
    species: 'tree' | 'dolphin' | 'bird' | 'unknown'
    signalId: string
    mockInterpretation: string
    confidence: number
    warnings: string[]
}

const DEFAULT_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL ?? ''

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
    const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Request failed (${response.status}): ${text}`)
    }

    return (await response.json()) as TRes
}

export class AiClient {
    async summarize(input: SummarizeRequest): Promise<SummarizeResponse> {
        return postJson<SummarizeRequest, SummarizeResponse>('/api/ai/summarize', input)
    }

    async qa(input: QaRequest): Promise<QaResponse> {
        return postJson<QaRequest, QaResponse>('/api/ai/qa', input)
    }

    async simulateNonHumanSignal(input: NonHumanSimulateRequest): Promise<NonHumanSimulateResponse> {
        return postJson<NonHumanSimulateRequest, NonHumanSimulateResponse>('/api/ai/nonhuman/simulate', input)
    }
}

export const aiClient = new AiClient()
